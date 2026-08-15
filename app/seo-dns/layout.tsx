import type { Metadata } from "next";
import StructuredData from "../StructuredData";
import { siteUrl } from "../site-url";

const TITLE = "Optimisation SEO avec le DNS — Mentalité Focus";
const DESCRIPTION =
  "Le playbook opérationnel pour configurer un DNS rapide, stable et sécurisé sans nuire à votre SEO.";

const CHAPTERS = [
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
] as const;

const AUDIT = [
  "Domaine principal défini", "Redirections configurées", "HTTPS forcé", "SSL valide",
  "DNS correctement configuré", "Aucun sous-domaine inutile exposé",
  "Google Search Console vérifiée", "DNSSEC activé si disponible",
  "CDN configuré si nécessaire", "Aucun CNAME inutile",
  "Aucun contenu dupliqué entre plusieurs sous-domaines",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    // Le guide explique qu'un domaine doit exposer une seule version
    // indexable : autant l'appliquer à lui-même.
    alternates: { canonical: "/seo-dns" },
    keywords: [
      "DNS", "SEO", "DNSSEC", "HTTPS", "redirection 301", "canonique",
      "sous-domaine", "CDN", "Cloudflare", "Google Search Console",
      "enregistrement CNAME", "référencement technique",
    ],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      locale: "fr_FR",
      url: `${baseUrl}/seo-dns`,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: TITLE }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${baseUrl}/og.png`] },
  };
}

export default async function DnsLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = await siteUrl();
  return (
    <>
      <StructuredData
        baseUrl={baseUrl}
        playbook={{
          path: "/seo-dns",
          title: TITLE,
          description: DESCRIPTION,
          chapters: CHAPTERS,
          audit: {
            name: "Audit DNS avant mise en ligne",
            description: "Les onze contrôles à valider pour qu'une configuration DNS ne pénalise pas le référencement.",
            steps: AUDIT,
          },
          breadcrumb: "Playbook DNS & SEO",
          about: ["DNS", "Référencement naturel", "Infrastructure web"],
        }}
      />
      {children}
    </>
  );
}
