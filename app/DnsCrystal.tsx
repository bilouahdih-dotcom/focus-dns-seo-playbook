"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

/**
 * Le "F" de Focus en WebGL — la mécanique du visuel d'alche.studio :
 * MeshPhysicalMaterial (transmission + iridescence + clearcoat) sur une
 * environment map passée au PMREMGenerator, et un canvas plein écran fixe qui
 * persiste derrière toute la page, comme leur `Layout__gl_inner`.
 *
 * Deux pilotes de scroll : `progress` couvre le hero (matière et cadrage
 * plein écran), `pageProgress` couvre le reste du document (le logo recule
 * en fond de page et continue de tourner).
 *
 * Three.js n'est chargé qu'au montage côté client (~700 kB) : le prisme CSS
 * reste affiché tant que le canvas n'a pas pris le relais, et le reste si le
 * navigateur n'a pas WebGL ou si l'utilisateur refuse les animations.
 */
export default function DnsCrystal({ progress, pageProgress, enabled }: {
  progress: MotionValue<number>;
  pageProgress: MotionValue<number>;
  enabled: boolean;
}) {
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
        // Mesure du conteneur, pas de window.innerWidth : ce dernier inclut la
        // barre de défilement, ce qui étirerait l'image de quelques pixels.
        const rect = host.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        /* Le canvas couvre désormais l'écran entier et tourne sur toute la
           page : le plafond de résolution compte double. On vise ~2 Mpx, ce
           qui suffit largement pour un objet réfléchissant. */
        const budget = 1_500_000;
        const cap = width < 800 ? 1.25 : 1.5;
        const ratio = Math.min(window.devicePixelRatio, cap, Math.sqrt(budget / (width * height)));
        renderer.setPixelRatio(Math.max(1, ratio));
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

      /* Le "F" du logo Focus extrudé en volume : le tracé SVG de la marque est
         converti en Shape puis extrudé, biseau compris. Les biseaux jouent le
         rôle des facettes — un solide à faces trop larges renverrait une seule
         zone de l'environnement par face et retomberait en aplats. */
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      if (disposed) return;
      const logoPath = "M123.05 0V36.93H41.15V87.33L41.45 87.63H120.65V124.36H41.45L41.15 124.66V202.01L20.52 213.39L0.200012 225.56L0 28.35V8.38998C1 4.14998 4.13998 0.999979 8.38998 0.00997925H123.05V0Z";
      const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 685 226"><path d="${logoPath}"/></svg>`;
      const parsed = new SVGLoader().parse(svgMarkup);
      const geometry = new THREE.ExtrudeGeometry(
        parsed.paths.flatMap((path) => SVGLoader.createShapes(path)),
        { depth: 42, bevelEnabled: true, bevelThickness: 13, bevelSize: 11, bevelSegments: 4, curveSegments: 6 },
      );
      // Le SVG a son origine en haut à gauche et l'axe Y inversé : on recentre
      // et on remet le glyphe à l'endroit avant de le ramener à l'échelle scène.
      geometry.center();
      geometry.rotateZ(Math.PI);
      geometry.rotateY(Math.PI);
      geometry.scale(.0145, .0145, .0145);

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
      /* La matière traverse tout le document : les trois premiers états sont
         parcourus pendant le hero, les suivants pendant la lecture. */
      const stages = [
        // chrome froid -> or massif -> cristal irisé
        { at: 0,   transmission: .10, metalness: .95, roughness: .06, iridescence: .60, thickness: 1.4, color: "#ffffff" },
        { at: .28, transmission: 0,   metalness: 1,   roughness: .19, iridescence: .10, thickness: 1.1, color: "#e8c766" },
        { at: .50, transmission: .22, metalness: .88, roughness: .03, iridescence: 1,   thickness: 2.4, color: "#ffffff" },
        // fond de page : plus sombre et plus mat, pour rester sous le texte
        { at: .75, transmission: .05, metalness: .98, roughness: .30, iridescence: .35, thickness: 1.0, color: "#c9a227" },
        { at: 1,   transmission: .12, metalness: .92, roughness: .12, iridescence: .85, thickness: 1.8, color: "#efe7d2" },
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

      // Le canvas couvre l'écran en permanence : on suspend le rendu quand
      // l'onglet passe en arrière-plan plutôt que sur l'intersection.
      let visible = !document.hidden;
      const onVisibility = () => { visible = !document.hidden; };
      document.addEventListener("visibilitychange", onVisibility);

      let frame = 0;
      let lastDraw = 0;
      const start = performance.now();
      const render = (now: number) => {
        frame = requestAnimationFrame(render);
        if (!visible) return;
        const heroValue = Math.min(1, Math.max(0, progress.get()));
        /* Plein régime tant que le hero pilote la scène ; au-delà le logo n'est
           qu'un fond derrière le texte, 30 images/s suffisent et libèrent la
           moitié du budget GPU pour le scroll. */
        const interval = heroValue < 1 ? 0 : 33;
        if (now - lastDraw < interval) return;
        lastDraw = now;
        const hero = heroValue;
        const after = Math.min(1, Math.max(0, pageProgress.get()));
        // Une seule ligne de temps : le hero occupe la première moitié,
        // la lecture du document la seconde.
        const p = after > 0 ? .5 + after * .5 : hero * .5;
        const elapsed = (now - start) / 1000;
        applyMaterial(p);

        crystal.rotation.y = hero * Math.PI * 2.1 + after * Math.PI * 2.6 + elapsed * .13;
        crystal.rotation.x = Math.sin(hero * Math.PI) * .5 - .12 + after * .8;
        crystal.rotation.z = hero * .5 - after * .55;
        // Le logo passe du premier plan (hero) au fond de page : il rapetisse,
        // glisse vers la gauche et descend, pour laisser le texte lisible.
        crystal.scale.setScalar(mix(.56, .84, hero) * mix(1, .46, after) + Math.sin(elapsed * .8) * .008);
        crystal.position.x = mix(1.55, -1.15, after);
        crystal.position.y = mix(.12, -.35, hero) + after * .55;
        crystal.position.z = mix(0, -2.2, after);
        (edges.material as import("three").LineBasicMaterial).opacity = mix(.5, .16, p);
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(render);

      /* ResizeObserver et pas seulement l'évènement `resize` : au retrait du
         voile d'entrée la barre de défilement réapparaît et rétrécit le
         conteneur de quelques pixels sans qu'aucun `resize` ne soit émis —
         l'image resterait légèrement étirée. */
      const observer = new ResizeObserver(size);
      observer.observe(host);
      window.addEventListener("resize", size);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", onVisibility);
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
  }, [enabled, progress, pageProgress]);

  return <div ref={hostRef} className={`dns-crystal ${live ? "is-live" : ""}`} aria-hidden="true" />;
}
