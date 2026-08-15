/**
 * Données structurées schema.org. Rendues côté serveur, donc lisibles par les
 * moteurs sans exécuter de JavaScript.
 */
const TITLE = "Optimisation SEO avec le DNS — Mentalité Focus";
const DESCRIPTION =
  "Le playbook opérationnel pour configurer un DNS rapide, stable et sécurisé sans nuire à votre SEO.";

const CHAPTERS: [string, string][] = [
  ["lien", "Le lien réel entre DNS et SEO"],
  ["domaine", "Choisir une version canonique du domaine"],
  ["records", "Les enregistrements A, AAAA et CNAME"],
  ["https", "Forcer HTTPS et garder un certificat valide"],
  ["subdomains", "Maîtriser l'exposition des sous-domaines"],
  ["cloudflare", "Un DNS anycast rapide et disponible"],
  ["search-console", "Vérifier le domaine dans Google Search Console"],
  ["dnssec", "Signer la zone avec DNSSEC"],
  ["cdn", "Servir le contenu depuis un CDN"],
  ["erreurs", "Les anti-patterns DNS à éviter"],
  ["checklist", "L'audit final avant mise en ligne"],
];

const AUDIT_STEPS = [
  "Domaine principal défini", "Redirections configurées", "HTTPS forcé", "SSL valide",
  "DNS correctement configuré", "Aucun sous-domaine inutile exposé",
  "Google Search Console vérifiée", "DNSSEC activé si disponible",
  "CDN configuré si nécessaire", "Aucun CNAME inutile",
  "Aucun contenu dupliqué entre plusieurs sous-domaines",
];

export default function StructuredData({ baseUrl }: { baseUrl: string }) {
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
        "@type": "TechArticle",
        "@id": `${baseUrl}/#article`,
        headline: TITLE,
        description: DESCRIPTION,
        inLanguage: "fr-FR",
        image: `${baseUrl}/og.png`,
        author: { "@id": `${baseUrl}/#organization` },
        publisher: { "@id": `${baseUrl}/#organization` },
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntityOfPage: { "@type": "WebPage", "@id": baseUrl },
        proficiencyLevel: "Intermediate",
        about: ["DNS", "Référencement naturel", "Infrastructure web"],
        hasPart: CHAPTERS.map(([id, name]) => ({
          "@type": "WebPageElement",
          name,
          url: `${baseUrl}/#${id}`,
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}/#audit`,
        name: "Audit DNS avant mise en ligne",
        description:
          "Les onze contrôles à valider pour qu'une configuration DNS ne pénalise pas le référencement.",
        inLanguage: "fr-FR",
        step: AUDIT_STEPS.map((name, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name,
          url: `${baseUrl}/#checklist`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Mentalité Focus", item: "https://mentalitefocus.com" },
          { "@type": "ListItem", position: 2, name: "Playbook DNS & SEO", item: baseUrl },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique défini ci-dessus, aucune entrée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
