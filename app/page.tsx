"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Lenis from "lenis";
import DnsCrystal from "./DnsCrystal";

const chapters = [
  ["introduction", "Intro"], ["lien", "DNS / SEO"], ["domaine", "Domaine"],
  ["records", "Records"], ["https", "HTTPS"], ["subdomains", "Sous-domaines"],
  ["cloudflare", "Cloudflare"], ["search-console", "Search Console"],
  ["dnssec", "DNSSEC"], ["cdn", "CDN"], ["erreurs", "Erreurs"], ["checklist", "Checklist"],
] as const;

type ChapterId = (typeof chapters)[number][0];

const checks = [
  "Domaine principal défini", "Redirections configurées", "HTTPS forcé", "SSL valide",
  "DNS correctement configuré", "Aucun sous-domaine inutile exposé",
  "Google Search Console vérifiée", "DNSSEC activé si disponible",
  "CDN configuré si nécessaire", "Aucun CNAME inutile",
  "Aucun contenu dupliqué entre plusieurs sous-domaines",
];

const scrambleGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/.-";

function DecryptedText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [display, setDisplay] = useState(text.replace(/[^ ]/g, "·"));

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const timer = window.setInterval(() => {
      setDisplay(text.split("").map((char, index) => {
        if (char === " ") return " ";
        if (index < frame / 2) return char;
        return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)];
      }).join(""));
      frame += 1;
      if (frame > text.length * 2 + 4) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 28);
    return () => window.clearInterval(timer);
  }, [inView, text]);

  return <span ref={ref} className="decrypt" aria-label={text}><span aria-hidden="true">{display}</span></span>;
}

/* Titre découpé caractère par caractère, révélé en cascade — la mécanique
   typographique d'alche.studio : chaque glyphe est un inline-block qui monte
   depuis un masque, avec un retard proportionnel à sa position. */
function SplitText({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  // Le contenu peut contenir des <br/> et des <em> : on ne découpe que le texte.
  let charIndex = 0;
  const split = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      // Découpage par mot puis par glyphe : un mot reste un bloc insécable,
      // sinon le retour à la ligne peut tomber au milieu d'un mot.
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

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return <article className={`spotlight-card ${className}`} onPointerMove={move}>{children}</article>;
}

function Scene({ id, index, eyebrow, title, description, tone = "dark", children }: {
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

/* Logo officiel Mentalité Focus (mentalitefocus.com). */
function FocusLogo() {
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

function Protocol({ kind, title, children }: { kind: "do" | "avoid" | "note"; title: string; children: React.ReactNode }) {
  return <div className={`protocol protocol-${kind}`}><span>{kind === "do" ? "+" : kind === "avoid" ? "×" : "i"}</span><div><b>{title}</b><p>{children}</p></div></div>;
}

export default function Home() {
  const [active, setActive] = useState<ChapterId>("introduction");
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  // Course réelle du hero collant = hauteur de la section moins un écran.
  // Mesurée à la main : l'option `offset` de useScroll la calcule sur la hauteur totale.
  const [heroRange, setHeroRange] = useState<[number, number]>([0, 1]);
  const { scrollY } = useScroll();
  const rawHeroProgress = useTransform(scrollY, heroRange, [0, 1], { clamp: true });
  // Spring serré : le hero doit suivre le scroll, pas flotter derrière lui.
  const heroProgress = useSpring(rawHeroProgress, { stiffness: 240, damping: 38, mass: .2 });

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
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const prismScale = useTransform(heroProgress, [0, .32, .72, 1], [.72, 1.08, .9, 1.5]);
  const prismRotate = useTransform(heroProgress, [0, .42, .75, 1], [-14, 5, -9, 22]);
  const prismY = useTransform(heroProgress, [0, .5, 1], [45, -25, -160]);
  const heroCopyOpacity = useTransform(heroProgress, [0, .2, .38], [1, 1, 0]);
  const heroCopyY = useTransform(heroProgress, [0, .38], [0, -90]);
  const gridRotate = useTransform(heroProgress, [0, .5, 1], [-2, 4, -5]);
  // La nappe balaie l'écran en fin de hero : elle arrive tard et sort vite,
  // sinon elle stationne en aplat plein cadre sur un tiers du scroll.
  const wipeY = useTransform(heroProgress, [0, .62, .78, .9, 1], ["118%", "118%", "34%", "-45%", "-135%"]);
  const dataOpacity = useTransform(heroProgress, [0, .18, .5, .88, 1], [.35, 1, .55, 1, 0]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("mf-dns-audit-v2");
      // Hydratation client : la valeur n'existe pas au rendu serveur.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* stockage facultatif */ }

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
      let current: ChapterId = chapters[0][0];
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
  }, []);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      try { window.localStorage.setItem("mf-dns-audit-v2", JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };
  const score = Math.round((checked.length / checks.length) * 100);

  return (
    <main className="studio-shell">
      <div className="read-line" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>

      <header className="global-header">
        <a className="wordmark" href="#introduction" aria-label="Mentalité Focus — accueil"><FocusLogo /></a>
        <nav aria-label="Navigation principale"><a href="#lien">Principes</a><a href="#domaine">Architecture</a><a href="#records">Système</a><a href="#checklist">Audit</a></nav>
        <a className="header-action" href="#checklist">Lancer l’audit <span>↘</span></a>
        <button className="mobile-trigger" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Ouvrir le sommaire">{menu ? "×" : "//"}</button>
      </header>

      <aside className={`chapter-rail ${menu ? "open" : ""}`} aria-label="Sommaire">
        <div className="rail-track"><i style={{ height: `${progress}%` }} /></div>
        <nav>{chapters.map(([id,label],index)=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)} className={active===id?"active":""}><span>{String(index+1).padStart(2,"0")}</span><b>{label}</b></a>)}</nav>
        <small>{progress}%</small>
      </aside>

      <section className="hero-scene" id="introduction" ref={heroRef}>
        <div className="hero-sticky">
          <motion.div className="scene-grid hero-grid" style={{ rotate: gridRotate }} aria-hidden="true" />
          <div className="hero-crosses" aria-hidden="true">{Array.from({length:12}).map((_,i)=><i key={i}/>)}</div>
          {/* Le cristal WebGL se superpose au prisme CSS et le masque une fois
              prêt ; sans WebGL (ou en reduced-motion) le prisme reste seul. */}
          <motion.div className="dns-prism" style={{ scale: prismScale, rotate: prismRotate, y: prismY }} aria-hidden="true">
            <div className="prism-skin"><span>DNS</span><i/><i/><i/></div>
            <div className="prism-outline"><b>site.fr</b></div>
            <div className="prism-shadow"/>
          </motion.div>
          <DnsCrystal progress={heroProgress} enabled={!reduce} />
          <span className="crystal-label" aria-hidden="true">DNS</span>
          {/* Couche scroll (MotionValues) et couche d'entrée (animate) séparées :
              les cumuler sur le même élément fait s'écraser opacity / y. */}
          <motion.div className="hero-content" style={{ opacity: heroCopyOpacity, y: heroCopyY }}>
            <motion.div className="hero-intro" initial={reduce ? false : {opacity:0,y:36}}
              animate={{opacity:1,y:0}} transition={{duration:1.25,ease:[.16,1,.3,1]}}>
              <div className="hero-kicker"><DecryptedText text="PLAYBOOK 011 / SEO INFRASTRUCTURE"/><i/></div>
              <h1><SplitText delay={.25}><span>DNS / SEO</span><br/><em>INFRASTRUCTURE</em><br/>PLAYBOOK</SplitText></h1>
              <div className="hero-brief"><p>Construire une infrastructure <strong>stable, rapide, sûre et canonique</strong> pour ne jamais laisser le DNS affaiblir le SEO.</p><motion.a href="#lien" whileHover={{x:7}}>Entrer dans le système <i>↘</i></motion.a></div>
            </motion.div>
          </motion.div>
          <motion.div className="hero-telemetry" style={{ opacity: dataOpacity }}><span>STATUS</span><b><i/> INFRASTRUCTURE READY</b><code>HTTPS · DNSSEC · 301</code></motion.div>
          <motion.div className="hero-light-wipe" style={{ y: wipeY, rotate: -4 }} aria-hidden="true"><span>ONE DOMAIN / ONE SIGNAL</span></motion.div>
          <div className="scroll-signal"><span>SCROLL TO CONTROL</span><i/></div>
          <span className="hero-coordinate">48°51′N / 02°21′E · LIVE</span>
          <span className="hero-chapter">INTRO / 01</span>
        </div>
      </section>

      <Scene id="lien" index="02" eyebrow="DNS × SEO / THE REAL LINK" tone="dark"
        title={<>Le DNS ne vous classe pas.<br/><em>Il sécurise le terrain.</em></>}
        description="Il ne crée pas d’autorité éditoriale. Il évite les défaillances techniques qui ralentissent, fragmentent ou rendent le site indisponible.">
        <div className="manifesto-line"><span>STABILITÉ</span><i>×</i><span>SÉCURITÉ</span><i>×</i><span>VITESSE</span><i>×</i><span>COHÉRENCE</span></div>
        <div className="impact-matrix">
          {[['01','Résolution','Le domaine répond vite et sans interruption.'],['02','Exploration','Les robots atteignent toujours la bonne version.'],['03','Confiance','HTTPS et DNSSEC protègent les échanges.'],['04','Expérience','Moins d’erreurs, de latence et de rebonds.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>INDIRECT SEO SIGNAL</b></SpotlightCard>)}
        </div>
        <Protocol kind="note" title="Le principe">Le DNS prépare l’infrastructure. Le contenu, l’intention de recherche et la popularité restent les moteurs du classement.</Protocol>
      </Scene>

      <Scene id="domaine" index="03" eyebrow="CANONICAL ARCHITECTURE" tone="light"
        title={<>Trois entrées.<br/><em>Une seule destination.</em></>}
        description="Choisissez site.fr ou www.site.fr, puis redirigez définitivement toutes les autres variantes vers cette version principale.">
        <div className="canonical-stage">
          <div className="incoming-routes"><small>INPUT / VARIANTS</small><code><i/>http://site.fr</code><code><i/>http://www.site.fr</code><code><i/>https://www.site.fr</code></div>
          <div className="redirect-engine"><span>PERMANENT REDIRECT</span><strong>301 / 308</strong><div className="pulse-arrow">→</div><small>CHEMIN CONSERVÉ</small></div>
          <div className="canonical-target"><span>CANONICAL OUTPUT</span><strong>https://site.fr</strong><b><i/> UNIQUE · INDEXABLE</b></div>
        </div>
        <div className="protocol-row"><Protocol kind="do" title="À faire">Configurez la redirection au niveau serveur, plateforme ou CDN. Le DNS seul ne produit pas de redirection HTTP.</Protocol><Protocol kind="avoid" title="À éviter">Ne laissez jamais HTTP, HTTPS, www et non-www répondre séparément en statut 200.</Protocol></div>
      </Scene>

      <Scene id="records" index="04" eyebrow="DNS RECORD SYSTEM" tone="dark"
        title={<>A. AAAA. CNAME.<br/><em>Trois rôles précis.</em></>}
        description="Une zone courte, explicite et documentée se résout plus facilement et se diagnostique plus vite.">
        <div className="record-system">
          {[['A','IPv4','@','192.0.2.10','Domaine → adresse IPv4'],['AAAA','IPv6','@','2001:db8::10','Domaine → adresse IPv6'],['CNAME','ALIAS','www','site.fr.','Alias → autre nom DNS']].map(([type,meta,name,value,desc])=><SpotlightCard key={type} className="record-module"><header><span>{type}</span><small>{meta}</small></header><h3>{desc}</h3><div><code>{name}</code><i>→</i><code>{value}</code></div><footer>TTL / AUTO</footer></SpotlightCard>)}
        </div>
        <div className="zone-terminal"><header><span>ZONE / site.fr</span><b>● PROPAGATED</b></header><pre><i>TYPE</i>    <i>NAME</i>      <i>VALUE</i>{"\n"}<b>A</b>       @         192.0.2.10{"\n"}<b>AAAA</b>    @         2001:db8::10{"\n"}<b>CNAME</b>   www       site.fr.{"\n"}<b>TXT</b>     @         google-site-verification=…</pre></div>
        <div className="chain-compare"><div><small>CHAIN / FAIL</small><code>www → app → edge → origin</code></div><i>×</i><div><small>DIRECT / PASS</small><code>www → site.fr</code></div></div>
      </Scene>

      <Scene id="https" index="05" eyebrow="TRANSPORT SECURITY" tone="gold"
        title={<>Chiffrer tout.<br/><em>Rediriger toujours.</em></>}
        description="Chaque requête HTTP doit basculer vers HTTPS, et le certificat doit rester valide pour tous les noms réellement utilisés.">
        <div className="ssl-stage">
          <div className="ssl-seal"><div><span>SSL</span><b>VALID</b><small>TRUSTED CHAIN</small></div></div>
          <ol>{[['01','Couvrir site.fr et www'],['02','Forcer HTTPS en 301 / 308'],['03','Automatiser le renouvellement'],['04','Supprimer le contenu mixte']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b><i>PASS</i></li>)}</ol>
        </div>
        <div className="protocol-row"><Protocol kind="do" title="Test express">Saisissez une URL en HTTP : elle doit conserver son chemin et arriver immédiatement sur la même page en HTTPS.</Protocol><Protocol kind="avoid" title="Piège">Ne redirigez pas toutes les anciennes pages vers l’accueil. Chaque URL doit garder sa destination logique.</Protocol></div>
      </Scene>

      <Scene id="subdomains" index="06" eyebrow="SUBDOMAIN EXPOSURE MAP" tone="light"
        title={<>Tout ce qui existe<br/><em>doit être assumé.</em></>}
        description="Un sous-domaine oublié peut être indexé, exposer une copie du site ou devenir un point d’entrée vulnérable.">
        <div className="exposure-table"><header><span>HOSTNAME</span><span>ENVIRONMENT</span><span>RISK</span><span>ACTION</span></header>
          {[['dev.site.fr','DEVELOPMENT','HIGH','SUPPRIMER / FILTRER'],['test.site.fr','QA TEST','HIGH','AUTHENTIFIER'],['staging.site.fr','PREPROD','MEDIUM','NOINDEX + AUTH'],['blog.site.fr','PRODUCTION','LOW','CONSERVER SI UTILE']].map(([host,env,risk,action])=><div key={host} className={`risk-${risk.toLowerCase()}`}><code><i/>{host}</code><span>{env}</span><b>{risk}</b><strong>{action}</strong></div>)}
        </div>
        <div className="protocol-row"><Protocol kind="do" title="Sous-domaine actif">Vérifiez HTTPS, accès, sitemap, canonique et liens depuis le domaine principal.</Protocol><Protocol kind="avoid" title="Duplication">Ne publiez pas la même page sur site.fr et blog.site.fr. Fusionnez, redirigez ou canonicalisez.</Protocol></div>
      </Scene>

      <Scene id="cloudflare" index="07" eyebrow="ANYCAST / EDGE NETWORK" tone="dark"
        title={<>Répondre partout.<br/><em>Sans point faible.</em></>}
        description="Un DNS rapide et fiable comme Cloudflare réduit la latence de résolution et limite les risques d’indisponibilité.">
        <div className="network-radar">
          <div className="radar-core"><span>CF</span><b>CLOUDFLARE</b><small>EXAMPLE PROVIDER</small></div>
          <i className="radar-wave w1"/><i className="radar-wave w2"/><i className="radar-wave w3"/>
          {[['PAR','18ms'],['YUL','34ms'],['DKR','41ms'],['SIN','62ms']].map(([city,time],i)=><div key={city} className={`edge-point p${i+1}`}><i/><span>{city}</span><b>{time}</b></div>)}
        </div>
        <div className="signal-grid">{[['01','Anycast','Réponse depuis un nœud proche.'],['02','Disponibilité','Pas de serveur DNS unique.'],['03','Proxy / cache','Accélération et protection optionnelles.'],['04','Observabilité','Règles et événements centralisés.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
        <Protocol kind="note" title="Critère de choix">Disponibilité, latence stable, DNSSEC et outils d’audit comptent plus que la marque du fournisseur.</Protocol>
      </Scene>

      <Scene id="search-console" index="08" eyebrow="DOMAIN OWNERSHIP / GOOGLE" tone="light"
        title={<>Prouver le domaine.<br/><em>Couvrir toutes ses versions.</em></>}
        description="La propriété Domaine de Google Search Console regroupe protocoles et sous-domaines dans une seule vérification TXT.">
        <div className="verification-stage">
          <ol>{[['01','Créer une propriété Domaine'],['02','Copier la valeur TXT'],['03','Publier le TXT à la racine'],['04','Vérifier puis conserver le record']].map(([n,t])=><li key={n}><span>{n}</span><b>{t}</b></li>)}</ol>
          <div className="txt-terminal"><header><span>DNS RECORD / TXT</span><b>GSC</b></header><dl><div><dt>TYPE</dt><dd>TXT</dd></div><div><dt>NAME</dt><dd>@</dd></div><div><dt>TTL</dt><dd>AUTO</dd></div></dl><small>VALUE</small><code>google-site-verification=<b>AbC123…</b></code><footer><i/> READY TO VERIFY</footer></div>
        </div>
        <Protocol kind="do" title="Bon format">Saisissez site.fr sans protocole ni chemin. La propriété Domaine couvrira HTTP, HTTPS, www et les autres sous-domaines.</Protocol>
      </Scene>

      <Scene id="dnssec" index="09" eyebrow="CHAIN OF TRUST" tone="dark"
        title={<>Signer la réponse.<br/><em>Garantir son origine.</em></>}
        description="DNSSEC permet au résolveur de vérifier que la réponse DNS reçue est authentique et n’a pas été altérée.">
        <div className="trust-route">{[['01','REGISTRY','.FR'],['02','REGISTRAR','DS RECORD'],['03','AUTH DNS','SIGNED ZONE'],['✓','RESOLVER','VALIDATED']].map(([n,t,m],i)=><div key={t} className={i===3?'verified':''}><span>{n}</span><b>{t}</b><small>{m}</small>{i < 3 ? <i>→</i> : null}</div>)}</div>
        <div className="trust-notes"><SpotlightCard><span>ACTIVATION</span><h3>Signer chez le DNS</h3><p>Activez la zone signée, puis publiez le DS demandé chez le registrar si la liaison n’est pas automatique.</p></SpotlightCard><SpotlightCard><span>MIGRATION</span><h3>Changer dans le bon ordre</h3><p>Un ancien DS associé à de nouvelles clés peut rendre tout le domaine inaccessible.</p></SpotlightCard></div>
        <Protocol kind="note" title="Complémentarité">DNSSEC protège la résolution. HTTPS chiffre la connexion au site. L’un ne remplace pas l’autre.</Protocol>
      </Scene>

      <Scene id="cdn" index="10" eyebrow="CONTENT DELIVERY NETWORK" tone="light"
        title={<>Rapprocher le contenu.<br/><em>Absorber la distance.</em></>}
        description="Un CDN sert les fichiers depuis un point proche du visiteur, réduit la charge de l’origine et absorbe les pics.">
        <div className="cdn-globe"><div className="globe-core"><small>ORIGIN</small><strong>PARIS</strong></div>{[['YUL','MONTRÉAL'],['DKR','DAKAR'],['SIN','SINGAPOUR']].map(([code,city],i)=><div key={code} className={`pop pop${i+1}`}><i/><span>EDGE / {code}</span><b>{city}</b></div>)}<span className="arc arc1"/><span className="arc arc2"/><span className="arc arc3"/></div>
        <div className="cdn-decisions">{[['PERTINENT SI','Audience internationale','Images et assets lourds','Pics de trafic'],['RÉGLER','Cache HTML','Purge après publication','Pages personnalisées'],['MESURER','TTFB et latence DNS','Taux de cache HIT','Disponibilité origine']].map(([t,...items])=><SpotlightCard key={t}><span>{t}</span>{items.map(item=><p key={item}>↳ {item}</p>)}</SpotlightCard>)}</div>
      </Scene>

      <Scene id="erreurs" index="11" eyebrow="ANTI-PATTERN DATABASE" tone="danger"
        title={<>Les faux raccourcis<br/><em>coûtent toujours plus cher.</em></>}
        description="Une zone DNS simple est plus facile à sécuriser, migrer, surveiller et réparer.">
        <div className="anti-grid">{[['01','Sous-domaines en masse','Ils n’ajoutent aucune autorité.'],['02','CNAME “pour le SEO”','Un alias ne crée pas de classement.'],['03','Staging indexable','Il expose doublons et données.'],['04','Versions en parallèle','Les signaux sont fragmentés.'],['05','Cibles orphelines','Elles cassent ou se détournent.'],['06','Migration sans rollback','TTL et ordre doivent être planifiés.']].map(([n,t,d])=><SpotlightCard key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>ABORT</b></SpotlightCard>)}</div>
        <div className="red-rule"><span>RULE / 011</span><p>N’utilisez jamais des dizaines de sous-domaines ou de CNAME pour manipuler le SEO. <strong>Google évalue le contenu et l’expérience, pas le volume d’entrées DNS.</strong></p></div>
      </Scene>

      <Scene id="checklist" index="12" eyebrow="FINAL SYSTEM AUDIT" tone="gold"
        title={<>Valider le système.<br/><em>Fermer les failles.</em></>}
        description="Cochez les onze contrôles. La progression reste enregistrée sur cet appareil.">
        <div className="audit-console">
          <header><div><span>PRE-LAUNCH / DNS SEO</span><h3>{score===100?'SYSTEM READY':'VALIDATION IN PROGRESS'}</h3></div><div className="audit-score"><b>{score}</b><span>%</span></div></header>
          <div className="audit-progress"><i style={{width:`${score}%`}}/></div>
          <div className="audit-list">{checks.map((item,index)=><label key={item} className={checked.includes(index)?'done':''}><input type="checkbox" checked={checked.includes(index)} onChange={()=>toggle(index)}/><i>{checked.includes(index)?'✓':''}</i><span>{item}</span><small>{checked.includes(index)?'PASS':'PENDING'}</small></label>)}</div>
          <footer><span>{checked.length} / {checks.length} CONTROLS PASSED</span><button onClick={()=>{setChecked([]);try{window.localStorage.removeItem('mf-dns-audit-v2')}catch{/* stockage facultatif */}}}>RESET AUDIT</button></footer>
        </div>
        <div className="outro"><span>MENTALITÉ FOCUS / PLAYBOOK 011</span><h3>Le DNS ne promet pas la première place.<br/><em>Il évite de partir avec un handicap.</em></h3><motion.a href="#introduction" whileHover={{y:-5}}>RESTART <i>↑</i></motion.a></div>
      </Scene>

      <footer className="global-footer"><a className="wordmark" href="#introduction" aria-label="Mentalité Focus"><FocusLogo /></a><p>PLAYBOOK 011 · SEO INFRASTRUCTURE · 2026</p><a href="#introduction">TOP ↑</a></footer>
    </main>
  );
}
