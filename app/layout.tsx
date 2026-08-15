import type { Metadata } from "next";
import { siteUrl } from "./site-url";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await siteUrl();
  return {
    metadataBase: new URL(baseUrl),
    // Chaque playbook définit son propre titre ; celui-ci sert de repli.
    title: "Playbooks SEO — Mentalité Focus",
    description:
      "Les playbooks SEO de Mentalité Focus : infrastructure DNS, optimisation on-page, autorité off-page et référencement local.",
    authors: [{ name: "Mentalité Focus" }],
    creator: "Mentalité Focus",
    publisher: "Mentalité Focus",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Polices auto-hébergées : préchargées pour éviter le saut de rendu. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-var.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/plexmono-400.woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
