import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  /* Une entrée par playbook. Les chapitres sont des ancres, pas des pages :
     les lister reviendrait à déclarer des doublons de la même URL. */
  return [
    { url: origin, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/seo-on-page`, changeFrequency: "monthly", priority: .9 },
    { url: `${origin}/seo-off-page`, changeFrequency: "monthly", priority: .9 },
    { url: `${origin}/seo-local`, changeFrequency: "monthly", priority: .9 },
    { url: `${origin}/seo-technique`, changeFrequency: "monthly", priority: .9 },
    { url: `${origin}/seo-dns`, changeFrequency: "monthly", priority: .9 },
  ];
}
