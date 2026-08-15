import type { Metadata } from "next";
import HomeContent from "./home-content";
import { siteUrl } from "./site-url";

const TITLE = "Playbooks SEO — Mentalité Focus";
const DESCRIPTION =
  "Quatre playbooks opérationnels : infrastructure DNS, optimisation on-page, autorité off-page et référencement local. Des contrôles vérifiables, dans l'ordre où ils comptent.";

const EDITIONS = [
  { path: "/seo-dns", name: "Playbook 011 — DNS & Infrastructure" },
  { path: "/seo-on-page", name: "Playbook 012 — SEO on-page" },
  { path: "/seo-off-page", name: "Playbook 013 — SEO off-page" },
  { path: "/seo-local", name: "Playbook 014 — SEO local" },
];

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/" },
    keywords: ["playbook SEO", "référencement naturel", "SEO technique", "SEO on-page", "SEO off-page", "DNS"],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "website",
      locale: "fr_FR",
      url: baseUrl,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: TITLE }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${baseUrl}/og.png`] },
  };
}

export default async function Home() {
  const baseUrl = await siteUrl();
  /* L'accueil est une page de collection, pas un article : son graphe déclare
     la liste des éditions plutôt qu'un TechArticle. */
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Mentalité Focus",
        url: "https://mentalitefocus.com",
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: TITLE,
        inLanguage: "fr-FR",
        publisher: { "@id": `${baseUrl}/#organization` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/#collection`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "fr-FR",
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: EDITIONS.length,
          itemListElement: EDITIONS.map((edition, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: edition.name,
            url: `${baseUrl}${edition.path}`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <HomeContent />
    </>
  );
}
