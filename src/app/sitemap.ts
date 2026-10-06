import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_UPDATED } from "@/lib/site";
import { WIKI_UPDATED_ISO, wikiDomains } from "@/lib/wiki";

// Seul <lastmod> est exploité par Google (changefreq et priority sont ignorés) : on ne renseigne que lui.
const pages: { path: string; lastModified: string }[] = [
  { path: "/", lastModified: SITE_UPDATED },
  { path: "/fonctionnalites", lastModified: SITE_UPDATED },
  { path: "/tarifs", lastModified: SITE_UPDATED },
  { path: "/faq", lastModified: SITE_UPDATED },
  { path: "/wiki", lastModified: WIKI_UPDATED_ISO ?? SITE_UPDATED },
  ...wikiDomains.map((d) => ({ path: `/wiki/${d.slug}`, lastModified: WIKI_UPDATED_ISO ?? SITE_UPDATED })),
  { path: "/a-propos", lastModified: SITE_UPDATED },
  { path: "/contact", lastModified: SITE_UPDATED },
  { path: "/mentions-legales", lastModified: "2026-10-02" },
  { path: "/confidentialite", lastModified: "2026-10-02" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({ url: absoluteUrl(p.path), lastModified: p.lastModified }));
}
