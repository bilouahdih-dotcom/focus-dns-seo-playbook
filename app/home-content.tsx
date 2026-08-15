"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import Lenis from "lenis";
import DnsCrystal from "./DnsCrystal";
import Loader from "./Loader";
import { DecryptedText, SplitText, FocusLogo } from "./playbook";

/* Accueil calqué sur l'enchaînement d'alche.studio : visuel plein écran, une
   intro courte, la collection en liste (leur section Works), un manifeste, ce
   que couvre la collection, puis un outro plein écran. */

const EDITIONS = [
  {
    num: "011",
    date: "2026 · 08",
    href: "/seo-on-page",
    title: "SEO on-page",
    line: "Rendre chaque page compréhensible, unique et réellement utile.",
    tags: ["intention", "title", "structure", "maillage", "web vitals"],
  },
  {
    num: "012",
    date: "2026 · 08",
    href: "/seo-off-page",
    title: "SEO off-page",
    line: "Construire une autorité qui se mérite, et qui tient dans le temps.",
    tags: ["backlinks", "ancres", "marque", "notoriété", "risques"],
  },
  {
    num: "013",
    date: "2026 · 08",
    href: "/seo-local",
    title: "SEO local",
    line: "Être trouvé dans sa ville : la carte, la fiche, les avis, les pages.",
    tags: ["pack local", "fiche", "avis", "nap", "multi-adresses"],
  },
  {
    num: "014",
    date: "2026 · 08",
    href: "/seo-technique",
    title: "SEO technique",
    line: "Rendre le site explorable, compréhensible et indexable par les robots.",
    tags: ["crawl", "indexation", "robots.txt", "rendu js", "redirections"],
  },
  {
    num: "015",
    date: "2026 · 08",
    href: "/seo-dns",
    title: "DNS & Infrastructure",
    line: "Rendre le domaine stable, rapide et canonique : le socle sous tout le reste.",
    tags: ["dns", "https", "dnssec", "cdn", "301"],
  },
];

const COUVERTURE = [
  ["PAGE", "Ce que le moteur lit et comprend d'une page : intention, structure, contenu, balisage, vitesse ressentie."],
  ["AUTORITÉ", "Ce que les autres disent de vous : liens éditoriaux, mentions de marque, et les schémas à ne pas suivre."],
  ["TERRITOIRE", "Ce qui décide sur une recherche géolocalisée : la carte, la fiche d'établissement, les avis et les pages de lieu."],
  ["MÉCANIQUE", "Ce qui se passe entre la requête du robot et l'index : exploration, rendu, statuts, architecture, migrations."],
  ["INFRASTRUCTURE", "Le socle sous tout le reste : résolution, chiffrement, version canonique, disponibilité du domaine."],
];

export default function HomeContent() {
  const reduce = useReducedMotion();
  const kvRef = useRef<HTMLElement>(null);
  const readLineRef = useRef<HTMLElement>(null);

  const [kvRange, setKvRange] = useState<[number, number]>([0, 1]);
  const [pageRange, setPageRange] = useState<[number, number]>([0, 1]);
  const { scrollY } = useScroll();
  const rawKv = useTransform(scrollY, kvRange, [0, 1], { clamp: true });
  const kvProgress = useSpring(rawKv, { stiffness: 240, damping: 38, mass: .2 });
  const rawPage = useTransform(scrollY, pageRange, [0, 1], { clamp: true });
  const pageProgress = useSpring(rawPage, { stiffness: 160, damping: 40, mass: .3 });

  const kvCopyOpacity = useTransform(kvProgress, [0, .22, .42], [1, 1, 0]);
  const kvCopyY = useTransform(kvProgress, [0, .42], [0, -80]);
  const gridRotate = useTransform(kvProgress, [0, 1], [-2, 4]);

  // Smooth scroll inertiel, comme sur les playbooks.
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), touchMultiplier: 1.6 });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
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
      const el = kvRef.current;
      if (!el) return;
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      setKvRange([el.offsetTop, el.offsetTop + travel]);
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
      if (readLineRef.current) readLineRef.current.style.transform = `scaleX(${pct / 100})`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="studio-shell">
      <Loader baseline="Cinq playbooks. Une seule discipline." />
      <DnsCrystal progress={kvProgress} pageProgress={pageProgress} enabled={!reduce} />
      <div className="read-line" aria-hidden="true"><i ref={readLineRef} /></div>

      <header className="global-header">
        <a className="wordmark" href="#kv" aria-label="Mentalité Focus — accueil"><FocusLogo /></a>
        <nav aria-label="Navigation principale">
          <a href="#collection">Collection</a>
          <a href="#manifeste">Manifeste</a>
          <a href="#couverture">Couverture</a>
        </nav>
        <Link className="header-action" href="/seo-on-page">Commencer <span>↘</span></Link>
      </header>

      {/* KV : un écran plein, le cristal en fond, une invitation à défiler. */}
      <section className="kv" id="kv" ref={kvRef}>
        <div className="kv-sticky">
          <motion.div className="scene-grid hero-grid" style={{ rotate: gridRotate }} aria-hidden="true" />
          <div className="hero-crosses" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div>
          <motion.div className="kv-content" style={{ opacity: kvCopyOpacity, y: kvCopyY }}>
            <motion.div initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.25, ease: [.16, 1, .3, 1] }}>
              <div className="hero-kicker"><DecryptedText text="MENTALITÉ FOCUS / COLLECTION SEO" /><i /></div>
              <h1><SplitText delay={.25}><span>PLAYBOOKS</span>{" "}<br /><em>SEO</em></SplitText></h1>
              <p className="kv-line">Cinq guides opérationnels : la page, l&apos;autorité, le territoire, la mécanique, l&apos;infrastructure.</p>
            </motion.div>
          </motion.div>
          <a className="scroll-signal kv-scroll" href="#collection"><span>SCROLL TO EXPLORE</span><i /></a>
          <span className="hero-coordinate">48°51′N / 02°21′E · LIVE</span>
        </div>
      </section>

      {/* Collection : la liste, équivalent de leur section Works. */}
      <section className="collection" id="collection">
        <header className="collection-head">
          <small><DecryptedText text="COLLECTION / 005 ÉDITIONS" /></small>
          <h2><SplitText>Cinq playbooks.{" "}<br /><em>Une seule discipline.</em></SplitText></h2>
        </header>
        <ul className="edition-list">
          {EDITIONS.map((edition, index) => (
            <motion.li key={edition.num}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .3 }}
              transition={{ duration: .9, delay: index * .08, ease: [.25, .46, .45, .94] }}>
              <Link href={edition.href}>
                <span className="edition-num">{edition.num}</span>
                <time className="edition-date">{edition.date}</time>
                <h3><SplitText>{edition.title}</SplitText></h3>
                <p>{edition.line}</p>
                <ul className="edition-tags">{edition.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                <i aria-hidden="true">↗</i>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Manifeste : le pendant de leur bloc Mission. */}
      <section className="manifesto" id="manifeste">
        <div className="scene-grid" aria-hidden="true" />
        <small><DecryptedText text="MANIFESTE / 001" /></small>
        <h2><SplitText>Le SEO n&apos;est pas une astuce.{" "}<br /><em>C&apos;est une discipline d&apos;exécution.</em></SplitText></h2>
        <p>Chaque playbook part du même principe : ce qui se mesure se corrige. Pas de recette miracle, pas de promesse de première place — des contrôles vérifiables, dans l&apos;ordre où ils comptent.</p>
      </section>

      {/* Couverture : le pendant de leur section Service. */}
      <section className="coverage" id="couverture">
        <header className="collection-head">
          <small><DecryptedText text="CE QUE COUVRE LA COLLECTION" /></small>
          <h2><SplitText>Cinq couches.{" "}<br /><em>Dans cet ordre.</em></SplitText></h2>
        </header>
        <div className="coverage-grid">
          {COUVERTURE.map(([titre, texte], index) => (
            <motion.article key={titre}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .3 }}
              transition={{ duration: .9, delay: index * .08, ease: [.25, .46, .45, .94] }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{titre}</h3>
              <p>{texte}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Outro plein écran, comme leur TopPageOutro. */}
      <section className="home-outro">
        <div className="home-outro-sticky">
          <span>MENTALITÉ FOCUS / 2026</span>
          <h2><SplitText>Commencer par{" "}<br /><em>la page.</em></SplitText></h2>
          <Link className="home-outro-cta" href="/seo-on-page">PLAYBOOK 011 <i>↗</i></Link>
        </div>
      </section>

      <footer className="global-footer">
        <a className="wordmark" href="#kv" aria-label="Mentalité Focus"><FocusLogo /></a>
        <p>COLLECTION SEO · 5 ÉDITIONS · 2026</p>
        <a href="#kv">TOP ↑</a>
      </footer>
    </main>
  );
}
