// Wiki des fonctionnalités (/wiki) : une page par domaine, toutes les actions de l'application.
// Les données sont générées par `python scripts/build-wiki.py` à partir de l'inventaire Excel
// (docs/sources/OphtaClinic_Wiki_Fonctionnalites.xlsx) : ne pas modifier wiki.generated.json à la main.

import raw from "./wiki.generated.json";
import type { ModuleScope } from "../features";

export type WikiItem = { title: string; goal: string; status: "disponible" | "developpement"; profiles?: string[]; menu?: string };
export type WikiFeature = { title: string; items: WikiItem[] };
export type WikiModule = { slug: string; title: string; pack: ModuleScope; features: WikiFeature[] };
export type WikiDomain = { slug: string; title: string; summary: string; pack: ModuleScope; modules: WikiModule[] };

export const WIKI_UPDATED_ON: string = raw.updatedOn;
const FR_MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 2 octobre 2026 » → « 2026-10-02 » (données structurées et sitemap) */
function frenchDateToIso(text: string) {
  const m = text.trim().toLowerCase().match(/^(\d{1,2})(?:er)? (\S+) (\d{4})$/);
  const month = m ? FR_MONTHS.indexOf(m[2]) : -1;
  return m && month >= 0 ? `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}` : undefined;
}
export const WIKI_UPDATED_ISO = frenchDateToIso(WIKI_UPDATED_ON);

export const wikiDomains = raw.domains as WikiDomain[];

export const domainBySlug = (slug: string) => wikiDomains.find((d) => d.slug === slug);

export const countItems = (d: WikiDomain) => d.modules.reduce((n, m) => n + m.features.reduce((k, f) => k + f.items.length, 0), 0);
export const wikiTotal = wikiDomains.reduce((n, d) => n + countItems(d), 0);

export type SearchEntry = { d: string; dt: string; m: string; f: string; g: string };

/** Index de recherche aplati (envoyé au navigateur seulement sur /wiki). */
export const searchIndex: SearchEntry[] = wikiDomains.flatMap((d) =>
  d.modules.flatMap((m) => m.features.flatMap((f) => f.items.map((i) => ({ d: d.slug, dt: d.title, m: m.title, f: f.title, g: i.goal })))),
);
