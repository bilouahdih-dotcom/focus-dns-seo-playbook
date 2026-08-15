"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import Lenis from "lenis";
import DnsCrystal from "./DnsCrystal";
import Loader from "./Loader";

/* Pièces communes aux playbooks. Les deux pages partagent le même système
   (canvas persistant, hero collant, scènes révélées, sommaire latéral) : il
   vit ici pour qu'une correction profite aux deux. */

const scrambleGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/.-";

export function DecryptedText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  /* Le texte réel est rendu côté serveur, pas la version brouillée : les
     moteurs lisaient sinon des points à la place des intertitres. */
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const step = () => {
      setDisplay(text.split("").map((char, index) => {
        if (char === " ") return " ";
        if (index < frame / 2) return char;
        return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)];
      }).join(""));
      frame += 1;
    };
    step();
    const timer = window.setInterval(() => {
      step();
      if (frame > text.length * 2 + 4) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 28);
    return () => window.clearInterval(timer);
  }, [inView, text]);

  return <span ref={ref} className="decrypt">{display}</span>;
}

/* Titre découpé caractère par caractère, révélé en cascade — la mécanique
   typographique d'alche.studio. */
export function SplitText({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  let charIndex = 0;
  const split = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      // Par mot puis par glyphe : un mot doit rester insécable.
      return node.split(/(\s+)/).map((chunk, chunkIndex) => {
        if (chunk === "") return null;
        if (/^\s+$/.test(chunk)) return <span key={`s${chunkIndex}`} className="split-space">{chunk}</span>;
        return (
          <span key={`w${chunkIndex}`} className="split-word">
            {chunk.split("").map((char) => {
              const index = charIndex++;
              return (
                <motion.span
                  key={index}
                  className="split-char"
                  initial={reduce ? false : { y: "42%", opacity: 0, rotate: -4 }}
                  animate={inView ? { y: "0%", opacity: 1, rotate: 0 } : undefined}
                  transition={{ duration: .78, delay: delay + index * .018, ease: [.25, .46, .45, .94] }}
                >{char}</motion.span>
              );
            })}
          </span>
        );
      });
    }
    if (Array.isArray(node)) return node.map((child, i) => <span key={`g${i}`} className="split-group">{split(child)}</span>);
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      if (element.type === "br") return element;
      return React.cloneElement(element, undefined, split(element.props.children));
    }
    return node;
  };

  return <span ref={ref} className={`split ${className}`}>{split(children)}</span>;
}

export function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return <article className={`spotlight-card ${className}`} onPointerMove={move}>{children}</article>;
}

export function Scene({ id, index, eyebrow, title, description, tone = "dark", children }: {
  id: string; index: string; eyebrow: string; title: React.ReactNode; description: string;
  tone?: "dark" | "light" | "gold" | "danger"; children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section id={id} className={`scene scene-${tone}`}
      initial={reduce ? false : { opacity: .35, clipPath: "inset(5% 2% 5% 2%)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: .06 }} transition={{ duration: 1.15, ease: [.16, 1, .3, 1] }}>
      <div className="scene-grid" aria-hidden="true" />
      <div className="scene-crosses" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <motion.div className="scene-shutter" aria-hidden="true"
        initial={reduce ? false : { y: "-110%" }} whileInView={{ y: "115%" }}
        viewport={{ once: true, amount: .18 }} transition={{ duration: 1.35, ease: [.76, 0, .24, 1] }}/>
      <span className="scene-ghost" aria-hidden="true">{index}</span>
      <header className="scene-head">
        <div className="scene-number"><span>{index}</span><i/></div>
        <div><small><DecryptedText text={eyebrow} /></small><h2><SplitText delay={.1}>{title}</SplitText></h2><p>{description}</p></div>
      </header>
      <motion.div className="scene-body" initial={reduce ? false : { opacity: 0, y: 90 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }}
        transition={{ duration: 1, delay: .12, ease: [.16, 1, .3, 1] }}>{children}</motion.div>
      <span className="scene-edge">SECTION / {index}</span>
    </motion.section>
  );
}

export function Protocol({ kind, title, children }: { kind: "do" | "avoid" | "note"; title: string; children: React.ReactNode }) {
  return <div className={`protocol protocol-${kind}`}><span>{kind === "do" ? "+" : kind === "avoid" ? "×" : "i"}</span><div><b>{title}</b><p>{children}</p></div></div>;
}

/* Logo officiel Mentalité Focus (mentalitefocus.com). */
export function FocusLogo() {
  return (
    <svg className="focus-logo" viewBox="0 0 685 226" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M123.05 0V36.93H41.15V87.33L41.45 87.63H120.65V124.36H41.45L41.15 124.66V202.01L20.52 213.39L0.200012 225.56L0 28.35V8.38998C1 4.14998 4.13998 0.999979 8.38998 0.00997925H123.05V0Z"/>
      <path d="M684.76 155.69C684.3 162.55 682.54 168.78 679 174.59C657.71 209.53 591.44 208.07 575.2 169.06C574.33 166.97 572.7 162.5 572.68 160.39C572.68 159.89 572.61 159.01 573.18 158.85L602.11 152.94C602.43 153.01 602.65 153.15 602.81 153.44C603.3 154.29 603.75 157.04 604.21 158.23C609.7 172.37 631.26 176.02 643.53 169.31C651.98 164.69 655.5 151.56 646.97 145.44C636.17 137.68 613.96 137.51 600.61 132.28C581.75 124.9 574.6 111.86 575.46 91.9201C577.08 54.4901 621.28 45.0201 650.93 55.0401C661.71 58.6801 673.82 66.5201 678.28 77.4101C679.44 80.2401 680.25 83.7801 680.92 86.5801C681.06 87.1801 681.451 89.5701 680.621 89.6301L651.91 95.3901C650.44 95.1601 648.581 90.6201 647.741 89.3701C641.341 79.8101 627.08 76.1101 616.42 79.7601C606.92 83.0101 604.5 94.3901 610.92 101.81C619.97 112.28 647.81 112.72 661.3 118.14C674.79 123.56 683.941 136.92 684.731 151.91V155.7L684.76 155.69Z"/>
      <path d="M8.39975 0C4.14975 1 1.00977 4.14001 0.00976562 8.38V0H8.39975Z"/>
      <path d="M136.36 152.17C128.57 129.83 131.95 102.66 144.62 82.7301C171.03 41.2201 237.72 40.2801 264.04 82.3701C283.39 113.32 278.68 161.78 248.99 184.83C220.93 206.6 174.85 204.71 150.71 177.85C143.97 170.36 139.64 161.62 136.35 152.17H136.36ZM201.71 80.8901C154.25 83.5201 153.15 162.87 196.07 169.86C211.24 172.33 227.79 166.66 236.04 153.31C253.52 125 240.3 78.7501 201.72 80.8901H201.71Z"/>
      <path d="M464.43 56.0901V139.23C465.78 158 473.35 169.52 493.3 169.26C513.25 169 519.96 157.99 522.34 139.99C524.34 124.86 523.2 108.02 523.15 92.7201C523.12 80.5101 523.2 68.2901 523.15 56.0801H556.11V195.4L523.55 195.51C523.13 195.27 523.18 194.92 523.14 194.52C522.86 191.66 522.79 183.91 523.14 181.13C523.22 180.53 523.57 180.38 523.67 180.06C523.98 179.01 522.82 179.64 522.35 180.15C520.83 181.82 519.64 184.7 518.15 186.53C504.98 202.73 478.43 202.38 460.75 194.59C437.59 184.39 431.36 165.01 430.85 141.23C430.63 130.81 430.89 120.27 430.87 109.89C430.84 91.9601 430.87 74.0201 430.87 56.0901H464.43Z"/>
      <path d="M408.63 75.3098C412.79 80.9198 417.1 90.7198 418.14 97.6398C418.17 97.8598 418.33 98.3198 418.09 98.4898L387.93 105.38C383.85 95.0998 377.16 86.2198 366.19 82.8898C310.24 65.8898 303.2 175.91 359.43 170.23C374.37 168.72 384.21 157.78 389.13 144.31L419.06 152.31C419.18 153.82 418.49 155.28 417.98 156.68C405.26 191.42 368.74 207.55 333.59 196.3C306.15 187.52 290.15 165.08 287.47 136.79C284.51 105.49 295.02 74.4498 323.66 58.8398C351.02 43.9298 389.69 49.7898 408.62 75.3098H408.63Z"/>
    </svg>
  );
}

export type Chapter = readonly [string, string];

export type PlaybookHero = {
  kicker: string;
  title: React.ReactNode;
  brief: React.ReactNode;
  telemetry: { label: string; state: string; detail: string };
  wipe: string;
  mark: string;
  coordinate: string;
};

/**
 * Enveloppe commune : écran d'entrée, canvas persistant, en-tête, sommaire
 * latéral, hero collant et pied de page. Chaque playbook fournit ses chapitres,
 * son hero et ses scènes.
 */
export function PlaybookShell({ chapters, hero, navLinks, action, current, edition, baseline, children }: {
  chapters: readonly Chapter[];
  hero: PlaybookHero;
  navLinks: readonly (readonly [string, string])[];
  action: readonly [string, string];
  /** Playbook affiché, pour le sélecteur d'édition. */
  current: "dns" | "on-page" | "off-page";
  edition: string;
  /** Phrase de l'écran d'entrée : elle doit annoncer le playbook affiché. */
  baseline: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<string>(chapters[0][0]);
  const readLineRef = useRef<HTMLElement>(null);
  const railFillRef = useRef<HTMLElement>(null);
  const percentRef = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const [heroRange, setHeroRange] = useState<[number, number]>([0, 1]);
  const { scrollY } = useScroll();
  const rawHeroProgress = useTransform(scrollY, heroRange, [0, 1], { clamp: true });
  const heroProgress = useSpring(rawHeroProgress, { stiffness: 240, damping: 38, mass: .2 });
  const [pageRange, setPageRange] = useState<[number, number]>([0, 1]);
  const rawPageProgress = useTransform(scrollY, pageRange, [0, 1], { clamp: true });
  const pageProgress = useSpring(rawPageProgress, { stiffness: 160, damping: 40, mass: .3 });

  const prismScale = useTransform(heroProgress, [0, .32, .72, 1], [.72, 1.08, .9, 1.5]);
  const prismRotate = useTransform(heroProgress, [0, .42, .75, 1], [-14, 5, -9, 22]);
  const prismY = useTransform(heroProgress, [0, .5, 1], [45, -25, -160]);
  const heroCopyOpacity = useTransform(heroProgress, [0, .2, .38], [1, 1, 0]);
  const heroCopyY = useTransform(heroProgress, [0, .38], [0, -90]);
  const gridRotate = useTransform(heroProgress, [0, .5, 1], [-2, 4, -5]);
  const wipeY = useTransform(heroProgress, [0, .62, .78, .9, 1], ["118%", "118%", "34%", "-45%", "-135%"]);
  const dataOpacity = useTransform(heroProgress, [0, .18, .5, .88, 1], [.35, 1, .55, 1, 0]);

  // Smooth scroll inertiel (alche.studio tourne sur Lenis). Il pilote aussi
  // les ancres, sinon `scroll-behavior:smooth` et Lenis se disputent le scroll.
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), touchMultiplier: 1.6 });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest?.('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, [reduce]);

  useEffect(() => {
    const measure = () => {
      const el = heroRef.current;
      if (!el) return;
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      setHeroRange([el.offsetTop, el.offsetTop + travel]);
      const end = Math.max(el.offsetTop + travel + 1, document.documentElement.scrollHeight - window.innerHeight);
      setPageRange([el.offsetTop + travel, end]);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      /* Écriture directe dans le DOM plutôt qu'un setState : la progression
         change à chaque image de défilement, et un état React re-rendrait
         toutes les scènes et les centaines de glyphes du split-text. */
      if (readLineRef.current) readLineRef.current.style.transform = `scaleX(${pct / 100})`;
      if (railFillRef.current) railFillRef.current.style.height = `${pct}%`;
      if (percentRef.current) percentRef.current.textContent = `${pct}%`;

      let current: string = chapters[0][0];
      for (const [id] of chapters) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * .42) current = id;
      }
      setActive(current);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapters]);

  return (
    <main className="studio-shell">
      <Loader baseline={baseline} />
      {/* Canvas persistant, comme le `Layout__gl_inner` d'alche.studio. */}
      <DnsCrystal progress={heroProgress} pageProgress={pageProgress} enabled={!reduce} />
      <div className="read-line" aria-hidden="true"><i ref={readLineRef} /></div>

      <header className="global-header">
        {/* Le logo ramène à la collection, comme partout ailleurs sur le web ;
            le retour en haut de page reste le rôle du lien du pied. */}
        <Link className="wordmark" href="/" aria-label="Mentalité Focus — retour à l'accueil"><FocusLogo /></Link>
        <nav aria-label="Navigation principale">
          {navLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="header-action" href={action[0]}>{action[1]} <span>↘</span></a>
        <button className="mobile-trigger" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Ouvrir le sommaire">{menu ? "×" : "//"}</button>
      </header>

      {/* Sélecteur d'édition : les playbooks sont les entrées d'une même
          collection, on passe de l'un à l'autre sans repasser par un accueil. */}
      <nav className="edition-switch" aria-label="Choisir un playbook">
        <Link href="/" className="edition-home"><span aria-hidden="true">↖</span><b>Collection</b></Link>
        <Link href="/seo-dns" className={current === "dns" ? "active" : ""}><span>011</span><b>DNS &amp; Infrastructure</b></Link>
        <Link href="/seo-on-page" className={current === "on-page" ? "active" : ""}><span>012</span><b>SEO on-page</b></Link>
        <Link href="/seo-off-page" className={current === "off-page" ? "active" : ""}><span>013</span><b>SEO off-page</b></Link>
      </nav>

      <aside className={`chapter-rail ${menu ? "open" : ""}`} aria-label="Sommaire">
        <div className="rail-track"><i ref={railFillRef} /></div>
        <nav>{chapters.map(([id, label], index) => (
          <a key={id} href={`#${id}`} onClick={() => setMenu(false)} className={active === id ? "active" : ""}>
            <span>{String(index + 1).padStart(2, "0")}</span><b>{label}</b>
          </a>
        ))}</nav>
        <small ref={percentRef}>0%</small>
      </aside>

      <section className="hero-scene" id="introduction" ref={heroRef}>
        <div className="hero-sticky">
          <motion.div className="scene-grid hero-grid" style={{ rotate: gridRotate }} aria-hidden="true" />
          <div className="hero-crosses" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div>
          {/* Repli CSS tant que le canvas WebGL n'a pas pris la main. */}
          <motion.div className="dns-prism" style={{ scale: prismScale, rotate: prismRotate, y: prismY }} aria-hidden="true">
            <div className="prism-skin"><span>{hero.mark}</span><i/><i/><i/></div>
            <div className="prism-outline"><b>site.fr</b></div>
            <div className="prism-shadow"/>
          </motion.div>
          {/* Couche scroll (MotionValues) et couche d'entrée (animate) séparées :
              les cumuler sur le même élément fait s'écraser opacity / y. */}
          <motion.div className="hero-content" style={{ opacity: heroCopyOpacity, y: heroCopyY }}>
            <motion.div className="hero-intro" initial={reduce ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.25, ease: [.16, 1, .3, 1] }}>
              <div className="hero-kicker"><DecryptedText text={hero.kicker} /><i/></div>
              <h1><SplitText delay={.25}>{hero.title}</SplitText></h1>
              <div className="hero-brief">
                <p>{hero.brief}</p>
                <motion.a href={`#${chapters[1][0]}`} whileHover={{ x: 7 }}>Entrer dans le système <i>↘</i></motion.a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div className="hero-telemetry" style={{ opacity: dataOpacity }}>
            <span>{hero.telemetry.label}</span><b><i/> {hero.telemetry.state}</b><code>{hero.telemetry.detail}</code>
          </motion.div>
          <motion.div className="hero-light-wipe" style={{ y: wipeY, rotate: -4 }} aria-hidden="true"><span>{hero.wipe}</span></motion.div>
          <div className="scroll-signal"><span>SCROLL TO CONTROL</span><i/></div>
          <span className="hero-coordinate">{hero.coordinate}</span>
          <span className="hero-chapter">INTRO / 01</span>
        </div>
      </section>

      {children}

      <footer className="global-footer">
        <Link className="wordmark" href="/" aria-label="Mentalité Focus — retour à l'accueil"><FocusLogo /></Link>
        <p>{edition}</p>
        <span className="footer-links">
          <Link href="/">← Collection</Link>
          <a href="#introduction">TOP ↑</a>
        </span>
      </footer>
    </main>
  );
}
