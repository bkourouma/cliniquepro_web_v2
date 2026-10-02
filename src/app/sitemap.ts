import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const paths = ["/", "/fonctionnalites", "/tarifs", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: p === "/" ? "weekly" : "monthly", priority: p === "/" ? 1 : 0.7 }));
}
