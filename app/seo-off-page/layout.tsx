import type { Metadata } from "next";
import StructuredData from "../StructuredData";
import { siteUrl } from "../site-url";

const TITLE = "SEO off-page : construire une autorité durable — Mentalité Focus";
const DESCRIPTION =
  "Backlinks, sources de liens, profil d'ancres, mentions de marque, référencement local et risques de pénalité : le playbook off-page de Mentalité Focus.";

const CHAPTERS = [
  ["autorite", "Ce que recouvre vraiment le off-page"],
  ["backlink", "L'anatomie d'un lien qui compte"],
  ["sources", "Les familles de sources de liens"],
  ["ancres", "La répartition naturelle des ancres"],
  ["methodes", "Obtenir des liens sans les acheter"],
  ["marque", "Mentions de marque et notoriété"],
  ["local", "Référencement local et citations"],
  ["analyse", "Analyser un profil de liens"],
  ["risques", "Les schémas de liens à risque"],
  ["checklist", "L'audit avant campagne"],
] as const;

const AUDIT = [
  "Pages cibles du netlinking définies",
  "Contenu réellement citable publié",
  "Profil d'ancres varié et naturel",
  "Liens obtenus depuis des sites du même univers",
  "Aucun lien acheté en masse ni échangé en réseau",
  "Mentions de marque non liées identifiées",
  "Fiche Google Business Profile complète et à jour",
  "Coordonnées identiques partout (nom, adresse, téléphone)",
  "Profil de liens surveillé chaque trimestre",
  "Liens cassés vers le site récupérés",
  "Concurrents analysés sur leurs sources de liens",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/seo-off-page" },
    keywords: [
      "SEO off-page", "backlink", "netlinking", "profil de liens", "ancre de lien",
      "mention de marque", "référencement local", "Google Business Profile",
      "autorité de domaine", "schéma de liens", "lien sponsorisé",
    ],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      locale: "fr_FR",
      url: `${baseUrl}/seo-off-page`,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: TITLE }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${baseUrl}/og.png`] },
  };
}

export default async function SeoOffPageLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = await siteUrl();
  return (
    <>
      <StructuredData
        baseUrl={baseUrl}
        playbook={{
          path: "/seo-off-page",
          title: TITLE,
          description: DESCRIPTION,
          chapters: CHAPTERS,
          audit: {
            name: "Audit off-page avant campagne",
            description: "Les onze contrôles à valider avant de lancer un travail de netlinking.",
            steps: AUDIT,
          },
          breadcrumb: "Playbook SEO off-page",
          about: ["Référencement naturel", "Netlinking", "Notoriété de marque"],
        }}
      />
      {children}
    </>
  );
}
