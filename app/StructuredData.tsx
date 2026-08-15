/**
 * Données structurées schema.org, rendues côté serveur.
 *
 * Un graphe par playbook : le TechArticle doit décrire la page qui le porte.
 * Un graphe global dans le layout racine décrirait le guide DNS jusque sur les
 * pages on-page et off-page, ce qui contredirait leur contenu.
 */
export type PlaybookSchema = {
  path: string;
  title: string;
  description: string;
  chapters: readonly (readonly [string, string])[];
  audit: { name: string; description: string; steps: readonly string[] };
  breadcrumb: string;
  about: readonly string[];
};

export default function StructuredData({ baseUrl, playbook }: { baseUrl: string; playbook: PlaybookSchema }) {
  const pageUrl = `${baseUrl}${playbook.path}`;
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
        name: "Playbooks SEO — Mentalité Focus",
        inLanguage: "fr-FR",
        publisher: { "@id": `${baseUrl}/#organization` },
      },
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#article`,
        headline: playbook.title,
        description: playbook.description,
        inLanguage: "fr-FR",
        image: `${baseUrl}/og.png`,
        author: { "@id": `${baseUrl}/#organization` },
        publisher: { "@id": `${baseUrl}/#organization` },
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        proficiencyLevel: "Intermediate",
        about: playbook.about,
        hasPart: playbook.chapters.map(([id, name]) => ({
          "@type": "WebPageElement",
          name,
          url: `${pageUrl}#${id}`,
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}#audit`,
        name: playbook.audit.name,
        description: playbook.audit.description,
        inLanguage: "fr-FR",
        step: playbook.audit.steps.map((name, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name,
          url: `${pageUrl}#checklist`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Mentalité Focus", item: "https://mentalitefocus.com" },
          { "@type": "ListItem", position: 2, name: playbook.breadcrumb, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique défini côté serveur, aucune entrée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
