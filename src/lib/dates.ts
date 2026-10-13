// Date (ISO) de dernière modification réelle du contenu de chaque page : alimente <lastmod> du sitemap
// et « dateModified » des données structurées. À changer page par page, seulement quand son contenu change vraiment
// (une fausse fraîcheur est pénalisée) ; une nouvelle page s'ajoute ici avec sa date de création.
//
// Pas de date unique pour tout le site : les pages légales n'ont pas changé le même jour que l'accueil.

import { SITE_UPDATED } from "./site";

export const PAGE_UPDATED: Record<string, string> = {
  "/": "2026-10-13",
  "/fonctionnalites": "2026-10-13",
  "/tarifs": "2026-10-13",
  "/faq": "2026-10-13",
  "/a-propos": "2026-10-13",
  "/contact": "2026-10-13",
  "/wiki": "2026-10-13",
  // Les 10 domaines du wiki (/wiki/<domaine>) : repris de la clé « /wiki/* »
  "/wiki/*": "2026-10-13",
  // Pages légales : texte inchangé depuis leur rédaction (dates affichées en bas de page)
  "/mentions-legales": "2026-10-02",
  "/confidentialite": "2026-10-06",
};

/** Date de dernière modification d'une page ; à défaut, la date générale du site. */
export function pageUpdated(path: string): string {
  if (PAGE_UPDATED[path]) return PAGE_UPDATED[path];
  if (path.startsWith("/wiki/") && PAGE_UPDATED["/wiki/*"]) return PAGE_UPDATED["/wiki/*"];
  return SITE_UPDATED;
}
