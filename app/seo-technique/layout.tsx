import type { Metadata } from "next";
import StructuredData from "../StructuredData";
import { siteUrl } from "../site-url";

const TITLE = "SEO technique : exploration, indexation, rendu — Mentalité Focus";
const DESCRIPTION =
  "robots.txt, indexation, sitemap, codes HTTP, rendu JavaScript, architecture, paramètres d'URL et migrations : le playbook technique de Mentalité Focus.";

const CHAPTERS = [
  ["crawl", "Comprendre le parcours du robot"],
  ["robots", "Utiliser robots.txt à bon escient"],
  ["indexation", "Arbitrer ce qui mérite d'être indexé"],
  ["sitemap", "Tenir un sitemap cohérent"],
  ["statuts", "Codes HTTP et redirections"],
  ["rendu", "Rendu JavaScript et contenu différé"],
  ["architecture", "Profondeur et structure du site"],
  ["parametres", "Paramètres d'URL, facettes et pagination"],
  ["migration", "Migrer sans perdre de trafic"],
  ["erreurs", "Les pannes techniques silencieuses"],
  ["checklist", "L'audit technique"],
] as const;

const AUDIT = [
  "robots.txt accessible et sans blocage involontaire",
  "Sitemap XML à jour, sans URL non indexable",
  "Aucune page utile en noindex par erreur",
  "Contenu principal présent sans exécuter le JavaScript",
  "Chaînes de redirection réduites à un seul saut",
  "Pages supprimées en 404 ou 410, pas en soft 404",
  "Profondeur de trois clics maximum vers les pages clés",
  "Paramètres d'URL et facettes maîtrisés",
  "Pagination explorable",
  "Rapport d'indexation de Search Console sans anomalie",
  "Plan de redirection prêt avant toute refonte",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/seo-technique" },
    keywords: [
      "SEO technique", "crawl", "budget d'exploration", "indexation", "robots.txt",
      "noindex", "sitemap XML", "redirection 301", "soft 404", "rendu JavaScript",
      "architecture de site", "migration SEO",
    ],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      locale: "fr_FR",
      url: `${baseUrl}/seo-technique`,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: TITLE }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${baseUrl}/og.png`] },
  };
}

export default async function SeoTechniqueLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = await siteUrl();
  return (
    <>
      <StructuredData
        baseUrl={baseUrl}
        playbook={{
          path: "/seo-technique",
          title: TITLE,
          description: DESCRIPTION,
          chapters: CHAPTERS,
          audit: {
            name: "Audit technique avant production",
            description: "Les onze contrôles techniques à passer sur un site avant d'y investir en contenu.",
            steps: AUDIT,
          },
          breadcrumb: "Playbook SEO technique",
          about: ["Référencement technique", "Exploration", "Indexation"],
        }}
      />
      {children}
    </>
  );
}
