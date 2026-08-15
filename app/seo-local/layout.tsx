import type { Metadata } from "next";
import StructuredData from "../StructuredData";
import { siteUrl } from "../site-url";

const TITLE = "SEO local : être trouvé dans sa ville — Mentalité Focus";
const DESCRIPTION =
  "Pack local, fiche d'établissement, cohérence des coordonnées, avis, pages locales et réseaux multi-adresses : le playbook local de Mentalité Focus.";

const CHAPTERS = [
  ["pack", "Comprendre le pack local"],
  ["fiche", "Tenir la fiche d'établissement"],
  ["nap", "Aligner nom, adresse et téléphone"],
  ["avis", "Obtenir et gérer les avis"],
  ["pages", "Écrire de vraies pages locales"],
  ["proximite", "Travailler les signaux de proximité"],
  ["contenu", "Photos et entretien de la fiche"],
  ["reseau", "Gérer plusieurs établissements"],
  ["erreurs", "Ce qui fait suspendre une fiche"],
  ["checklist", "L'audit de présence locale"],
] as const;

const AUDIT = [
  "Fiche d'établissement revendiquée et vérifiée",
  "Catégorie principale exacte",
  "Nom, adresse et téléphone identiques partout",
  "Horaires à jour, jours fériés inclus",
  "Zone de service ou adresse définie sans ambiguïté",
  "Photos récentes et représentatives",
  "Avis sollicités auprès de vrais clients",
  "Réponse apportée à chaque avis, négatif compris",
  "Une page dédiée par établissement ou par zone",
  "Coordonnées et plan présents sur le site",
  "Données structurées LocalBusiness en place",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/seo-local" },
    keywords: [
      "SEO local", "pack local", "fiche d'établissement", "Google Business Profile",
      "avis clients", "NAP", "citations locales", "page locale",
      "recherche près de moi", "LocalBusiness", "multi-établissements",
    ],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      locale: "fr_FR",
      url: `${baseUrl}/seo-local`,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: TITLE }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${baseUrl}/og.png`] },
  };
}

export default async function SeoLocalLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = await siteUrl();
  return (
    <>
      <StructuredData
        baseUrl={baseUrl}
        playbook={{
          path: "/seo-local",
          title: TITLE,
          description: DESCRIPTION,
          chapters: CHAPTERS,
          audit: {
            name: "Audit de présence locale",
            description: "Les onze contrôles à passer sur la présence locale d'un établissement.",
            steps: AUDIT,
          },
          breadcrumb: "Playbook SEO local",
          about: ["Référencement local", "Google Business Profile", "Avis clients"],
        }}
      />
      {children}
    </>
  );
}
