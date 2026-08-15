import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const title = "SEO on-page : optimiser une page pour être trouvée — Mentalité Focus";
  const description =
    "Intention de recherche, title, structure Hn, maillage interne, images, données structurées et Core Web Vitals : le playbook on-page de Mentalité Focus.";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: { canonical: "/seo-on-page" },
    keywords: [
      "SEO on-page", "intention de recherche", "balise title", "meta description",
      "structure Hn", "maillage interne", "attribut alt", "données structurées",
      "Core Web Vitals", "URL SEO", "contenu optimisé",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: `${baseUrl}/seo-on-page`,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${baseUrl}/og.png`] },
  };
}

export default function SeoOnPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
