import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const title = "Optimisation SEO avec le DNS — Mentalité Focus";
  const description = "Le playbook opérationnel pour configurer un DNS rapide, stable et sécurisé sans nuire à votre SEO.";

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      images: [{ url: `${baseUrl}/og.png`, width: 1792, height: 1024, alt: "Optimisation SEO avec le DNS — Mentalité Focus" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${baseUrl}/og.png`] },
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
