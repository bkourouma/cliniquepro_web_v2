// Coordonnées et identité légale, centralisées ici (pied de page, contact, WhatsApp, mentions légales).
// Éditeur : Alliance Consultants (identité légale reprise de immotopia.cloud, même éditeur). Adresse e-mail dédiée à CliniquePro.

export const SITE_NAME = "CliniquePro";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cliniquepro-web.allianceconsultants.net";
// Adresse de connexion à l'application (variable NEXT_PUBLIC_APP_URL pour la changer)
export const APP_LOGIN_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cliniquepro.allianceconsultants.net/demo-login";

// Date (ISO) de la dernière mise à jour du contenu : alimente <lastmod> du sitemap et « dateModified » des données
// structurées. À faire évoluer quand le contenu des pages change vraiment (une fausse fraîcheur est pénalisée).
export const SITE_UPDATED = "2026-10-06";

/** Adresse absolue d'un chemin du site (« / » donne l'adresse racine, sans barre finale). */
export function absoluteUrl(path = "/") {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export const contact = {
  phone: "+225 01 01 51 01 36",
  phoneHref: "tel:+2250101510136",
  whatsapp: "https://wa.me/2250101510136",
  whatsappMessage: "Bonjour CliniquePro, je souhaite en savoir plus sur votre logiciel de gestion de clinique.",
  email: "cliniquepro@allianceconsultants.net",
  city: "Abidjan, Côte d'Ivoire",
};

// Profils officiels de la marque (données structurées « sameAs » et pied de page)
export const social = {
  facebook: "https://www.facebook.com/profile.php?id=61590811132929",
};

export const legal = {
  publisher: "Alliance Consultants",
  rccm: "CI-ABJ-2014-B-20956",
  taxId: "1438224 S", // numéro de compte contribuable (CC)
  publicationDirector: "Baba KOUROUMA",
  publisherSite: "https://allianceconsultants.net",
  host: "Hostinger International Ltd.",
  hostAddress: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
  hostSite: "https://www.hostinger.com",
};

export function whatsappLink(message = contact.whatsappMessage) {
  return `${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
