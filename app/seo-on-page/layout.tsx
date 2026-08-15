import type { Metadata } from "next";
import StructuredData from "../StructuredData";
import { siteUrl } from "../site-url";

const TITLE = "SEO on-page : optimiser une page pour être trouvée — Mentalité Focus";
const DESCRIPTION =
  "Intention de recherche, title, structure Hn, maillage interne, images, données structurées et Core Web Vitals : le playbook on-page de Mentalité Focus.";

const CHAPTERS = [
  ["intention", "Comprendre l'intention de recherche"],
  ["title", "Écrire le title et la meta description"],
  ["structure", "Structurer les titres Hn"],
  ["contenu", "Couvrir le sujet, pas le mot-clé"],
  ["url", "Concevoir des URL lisibles"],
  ["maillage", "Organiser le maillage interne"],
  ["images", "Optimiser et décrire les images"],
  ["donnees", "Baliser en données structurées"],
  ["vitesse", "Tenir les Core Web Vitals"],
  ["erreurs", "Les erreurs on-page fréquentes"],
  ["checklist", "L'audit avant publication"],
] as const;

const AUDIT = [
  "Une intention de recherche par page",
  "Title unique, sous 60 caractères",
  "Meta description écrite, sous 155 caractères",
  "Un seul H1, hiérarchie Hn continue",
  "Contenu répondant à la question posée",
  "URL courte, lisible, sans paramètre inutile",
  "Liens internes contextuels vers les pages clés",
  "Images en attribut alt et format moderne",
  "Balise canonique sur chaque page",
  "Données structurées valides",
  "Core Web Vitals dans le vert",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/seo-on-page" },
    keywords: [
      "SEO on-page", "intention de recherche", "balise title", "meta description",
      "structure Hn", "maillage interne", "attribut alt", "données structurées",
      "Core Web Vitals", "URL SEO", "contenu optimisé",
    ],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      locale: "fr_FR",
      url: `${baseUrl}/seo-on-page`,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: TITLE }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${baseUrl}/og.png`] },
  };
}

export default async function SeoOnPageLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = await siteUrl();
  return (
    <>
      <StructuredData
        baseUrl={baseUrl}
        playbook={{
          path: "/seo-on-page",
          title: TITLE,
          description: DESCRIPTION,
          chapters: CHAPTERS,
          audit: {
            name: "Audit on-page avant publication",
            description: "Les onze contrôles à passer sur une page avant de la publier.",
            steps: AUDIT,
          },
          breadcrumb: "Playbook SEO on-page",
          about: ["Référencement naturel", "Rédaction web", "Optimisation de page"],
        }}
      />
      {children}
    </>
  );
}
