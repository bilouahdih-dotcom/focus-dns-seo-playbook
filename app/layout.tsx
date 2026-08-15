import type { Metadata } from "next";
import { headers } from "next/headers";
import StructuredData from "./StructuredData";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const title = "Optimisation SEO avec le DNS — Mentalité Focus";
  const description = "Le playbook opérationnel pour configurer un DNS rapide, stable et sécurisé sans nuire à votre SEO.";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    // Le guide explique justement qu'un domaine doit exposer une seule version
    // indexable : autant l'appliquer à lui-même.
    alternates: { canonical: "/" },
    authors: [{ name: "Mentalité Focus" }],
    creator: "Mentalité Focus",
    publisher: "Mentalité Focus",
    keywords: [
      "DNS", "SEO", "DNSSEC", "HTTPS", "redirection 301", "canonique",
      "sous-domaine", "CDN", "Cloudflare", "Google Search Console",
      "enregistrement CNAME", "référencement technique",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: baseUrl,
      siteName: "Mentalité Focus",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: "Optimisation SEO avec le DNS — Mentalité Focus" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${baseUrl}/og.png`] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return (
    <html lang="fr">
      <head>
        {/* Polices auto-hébergées : préchargées pour éviter le saut de rendu. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-var.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/plexmono-400.woff2" crossOrigin="anonymous" />
        <StructuredData baseUrl={`${protocol}://${host}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
