import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { wikiDomains } from "@/lib/wiki";

const paths = ["/", "/fonctionnalites", "/wiki", ...wikiDomains.map((d) => `/wiki/${d.slug}`), "/tarifs", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: p === "/" ? "weekly" : "monthly", priority: p === "/" ? 1 : 0.7 }));
}
