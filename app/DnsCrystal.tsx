"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

/**
 * Cristal DNS en WebGL — la mécanique du visuel d'alche.studio :
 * MeshPhysicalMaterial (transmission + iridescence + clearcoat) sur une
 * environment map passée au PMREMGenerator. La matière change avec le scroll :
 * verre sombre -> or massif -> chrome irisé.
 *
 * Three.js n'est chargé qu'au montage côté client (~600 kB) : le prisme CSS
 * reste affiché tant que le canvas n'a pas pris le relais, et le reste si le
 * navigateur n'a pas WebGL ou si l'utilisateur refuse les animations.
 */
export default function DnsCrystal({ progress, enabled }: { progress: MotionValue<number>; enabled: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed || !hostRef.current) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return; // pas de WebGL : le prisme CSS reste en place
      }

      // Sans tone mapping, le verre rend plat et lavé.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      // La transmission fait un second rendu de la scène à chaque frame : à
      // pleine résolution elle coûte plus cher que tout le reste réuni.
      renderer.transmissionResolutionScale = .5;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
      camera.position.set(0, 0, 6.2);

      const size = () => {
        const rect = host.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        // Plafond plus bas sur petit écran : le rendu tourne en continu et
        // pèse sur la batterie.
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 800 ? 1.25 : 1.5));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      renderer.domElement.className = "crystal-canvas";
      host.appendChild(renderer.domElement);
      size();

      /* Environment map procédurale aux couleurs Focus : fond noir, bandes de
         studio blanches et or, quelques sources. C'est elle qu'on lit dans les
         reflets — pas de fichier HDR à charger.
         Elle est en flottant, pas en canvas 2D : un canvas plafonne à 1.0 par
         composante, ce qui ne produit aucun spéculaire éclatant et laisse le
         cristal en aplat mat. Les sources montent ici jusqu'à 26. */
      const W = 256, H = 128;
      const pixels = new Float32Array(W * H * 4);
      for (let y = 0; y < H; y += 1) {
        for (let x = 0; x < W; x += 1) {
          const v = .008 + .012 * (1 - y / H);
          const i = (y * W + x) * 4;
          pixels[i] = v; pixels[i + 1] = v; pixels[i + 2] = v * .9; pixels[i + 3] = 1;
        }
      }
      const band = (y0: number, y1: number, r: number, g: number, b: number) => {
        for (let y = y0; y < y1; y += 1) {
          const falloff = 1 - Math.abs((y - (y0 + y1) / 2) / ((y1 - y0) / 2));
          for (let x = 0; x < W; x += 1) {
            const i = (y * W + x) * 4;
            pixels[i] += r * falloff; pixels[i + 1] += g * falloff; pixels[i + 2] += b * falloff;
          }
        }
      };
      const spot = (cx: number, cy: number, radius: number, r: number, g: number, b: number) => {
        for (let y = 0; y < H; y += 1) {
          for (let x = 0; x < W; x += 1) {
            const dx = Math.min(Math.abs(x - cx), W - Math.abs(x - cx));
            const distance = Math.hypot(dx, y - cy);
            if (distance >= radius) continue;
            const falloff = Math.pow(1 - distance / radius, 2.4);
            const i = (y * W + x) * 4;
            pixels[i] += r * falloff; pixels[i + 1] += g * falloff; pixels[i + 2] += b * falloff;
          }
        }
      };
      band(8, 26, 7, 7, 7);            // source haute, franche
      band(52, 64, 5.5, 4.2, 1.3);     // horizon or Focus
      band(92, 104, 1.2, .9, .3);      // rappel or bas
      spot(40, 26, 26, 26, 26, 26);
      spot(205, 22, 22, 24, 20, 9);
      spot(128, 62, 30, 9, 7, 2.2);

      const equirect = new THREE.DataTexture(pixels, W, H, THREE.RGBAFormat, THREE.FloatType);
      equirect.mapping = THREE.EquirectangularReflectionMapping;
      equirect.needsUpdate = true;
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envTarget = pmrem.fromEquirectangular(equirect);
      scene.environment = envTarget.texture;

      /* Icosaèdre subdivisé + flatShading : un solide à peu de faces (octaèdre)
         renvoie une seule zone de l'environnement par face et retombe en
         aplats. Il faut beaucoup de facettes pour que chaque plan attrape un
         reflet différent — c'est ce qui donne l'aspect taillé. */
      const geometry = new THREE.IcosahedronGeometry(1.5, 1);
      geometry.scale(.92, 1.3, .92);

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        flatShading: true,
        metalness: .95, roughness: .06,
        transmission: .1, thickness: 1.4, ior: 1.7,
        iridescence: .6, iridescenceIOR: 2.2,
        clearcoat: 1, clearcoatRoughness: .02,
        envMapIntensity: 1.6,
      });
      const crystal = new THREE.Mesh(geometry, material);
      scene.add(crystal);

      // Arêtes soulignées : le playbook est un document technique, le filaire
      // rattache le cristal au reste de la grille.
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: new THREE.Color("#c9a227"), transparent: true, opacity: .5 }),
      );
      crystal.add(edges);

      const key = new THREE.DirectionalLight("#fff6dd", 2.4);
      key.position.set(3, 4, 5);
      const rim = new THREE.DirectionalLight("#c9a227", 3.1);
      rim.position.set(-4, -1.5, -3);
      scene.add(key, rim, new THREE.AmbientLight("#ffffff", .16));

      const mix = (from: number, to: number, t: number) => from + (to - from) * t;
      // Trois états de matière traversés par le scroll.
      const stages = [
        // chrome froid -> or massif -> cristal irisé
        { at: 0,   transmission: .10, metalness: .95, roughness: .06, iridescence: .60, thickness: 1.4, color: "#ffffff" },
        { at: .55, transmission: 0,   metalness: 1,   roughness: .19, iridescence: .10, thickness: 1.1, color: "#e8c766" },
        { at: 1,   transmission: .22, metalness: .88, roughness: .03, iridescence: 1,   thickness: 2.4, color: "#ffffff" },
      ];
      const colorFrom = new THREE.Color();
      const colorTo = new THREE.Color();

      const applyMaterial = (p: number) => {
        let i = 0;
        while (i < stages.length - 2 && p > stages[i + 1].at) i += 1;
        const a = stages[i];
        const b = stages[i + 1];
        const t = Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at)));
        material.transmission = mix(a.transmission, b.transmission, t);
        material.metalness = mix(a.metalness, b.metalness, t);
        material.roughness = mix(a.roughness, b.roughness, t);
        material.iridescence = mix(a.iridescence, b.iridescence, t);
        material.thickness = mix(a.thickness, b.thickness, t);
        material.color.copy(colorFrom.set(a.color).lerp(colorTo.set(b.color), t));
      };

      let visible = true;
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
      observer.observe(host);

      let frame = 0;
      const start = performance.now();
      const render = (now: number) => {
        frame = requestAnimationFrame(render);
        if (!visible) return;
        const p = Math.min(1, Math.max(0, progress.get()));
        const elapsed = (now - start) / 1000;
        applyMaterial(p);
        crystal.rotation.y = p * Math.PI * 2.1 + elapsed * .13;
        crystal.rotation.x = Math.sin(p * Math.PI) * .5 - .12;
        crystal.rotation.z = p * .5;
        crystal.scale.setScalar(mix(.56, .84, p) + Math.sin(elapsed * .8) * .008);
        crystal.position.y = mix(.12, -.35, p);
        (edges.material as import("three").LineBasicMaterial).opacity = mix(.5, .16, p);
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(render);

      window.addEventListener("resize", size);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("resize", size);
        renderer.domElement.remove();
        geometry.dispose();
        material.dispose();
        edges.geometry.dispose();
        (edges.material as import("three").Material).dispose();
        equirect.dispose();
        envTarget.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
      setLive(false);
    };
  }, [enabled, progress]);

  return <div ref={hostRef} className={`dns-crystal ${live ? "is-live" : ""}`} aria-hidden="true" />;
}
