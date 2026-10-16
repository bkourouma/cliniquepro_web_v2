import type { MetadataRoute } from "next";
import { pageUpdated } from "@/lib/dates";
import { guides, guidePath } from "@/lib/guides";
import { GUIDES_PATH, intentRoutes } from "@/lib/intent-routes";
import { absoluteUrl } from "@/lib/site";
import { wikiDomains } from "@/lib/wiki";

// Seul <lastmod> est exploité par Google (changefreq et priority sont ignorés) : on ne renseigne que lui.
// Chaque page a sa propre date (src/lib/dates.ts), changée seulement quand son contenu change vraiment.
const paths = [
  "/",
  "/fonctionnalites",
  "/tarifs",
  ...intentRoutes.map((r) => r.path),
  "/faq",
  GUIDES_PATH,
  ...guides.map((g) => guidePath(g.slug)),
  "/wiki",
  ...wikiDomains.map((d) => `/wiki/${d.slug}`),
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: absoluteUrl(path), lastModified: pageUpdated(path) }));
}
