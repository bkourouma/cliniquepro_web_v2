// Date (ISO) de dernière modification réelle du contenu de chaque page : alimente <lastmod> du sitemap
// et « dateModified » des données structurées. À changer page par page, seulement quand son contenu change vraiment
// (une fausse fraîcheur est pénalisée) ; une nouvelle page s'ajoute ici avec sa date de création.
//
// Pas de date unique pour tout le site : les pages légales n'ont pas changé le même jour que l'accueil.

import { SITE_UPDATED } from "./site";

export const PAGE_UPDATED: Record<string, string> = {
  "/": "2026-10-16",
  "/fonctionnalites": "2026-10-16",
  "/tarifs": "2026-10-16",
  "/faq": "2026-10-16",
  "/a-propos": "2026-10-16",
  "/contact": "2026-10-16",
  "/wiki": "2026-10-16",
  // Les 10 domaines du wiki (/wiki/<domaine>) : repris de la clé « /wiki/* »
  "/wiki/*": "2026-10-16",
  // Pages d'intention (profils, fonctions, page locale) et guides : date de création, à faire évoluer quand leur contenu change
  "/logiciel-gestion-clinique-cote-ivoire": "2026-10-16",
  "/logiciel-cabinet-medical": "2026-10-16",
  "/logiciel-centre-de-sante": "2026-10-16",
  "/logiciel-ophtalmologie": "2026-10-16",
  "/logiciel-rendez-vous-medicaux": "2026-10-16",
  "/dossier-patient-informatise": "2026-10-16",
  "/facturation-assurance-clinique": "2026-10-16",
  "/logiciel-clinique-hors-connexion": "2026-10-16",
  "/guides": "2026-10-16",
  "/guides/logiciel-clinique-saas-ou-sur-mesure": "2026-10-16",
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
