// Coordonnées et identité légale, centralisées ici (pied de page, contact, WhatsApp, mentions légales).
// Éditeur : Alliance Consultants (identité légale reprise de immotopia.cloud, même éditeur). Adresse e-mail dédiée à CliniquePro.

export const SITE_NAME = "CliniquePro";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cliniquepro-web.allianceconsultants.net";
// Adresse de connexion à l'application (variable NEXT_PUBLIC_APP_URL pour la changer)
export const APP_LOGIN_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cliniquepro.allianceconsultants.net/demo-login";

// Date (ISO) de la dernière mise à jour générale du contenu (llms.txt, pages sans date propre). La date de chaque page
// est dans src/lib/dates.ts : <lastmod> du sitemap et « dateModified » des données structurées en dépendent. À faire
// évoluer quand le contenu change vraiment (une fausse fraîcheur est pénalisée).
export const SITE_UPDATED = "2026-10-13";

/** Adresse absolue d'un chemin du site (« / » donne l'adresse racine, sans barre finale). */
export function absoluteUrl(path = "/") {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

// Mesure d'audience : Umami, hébergé par Alliance Consultants (sans cookie, sans adresse IP conservée). L'identifiant du site
// est public (il figure dans le HTML servi) ; `domains` limite le comptage au vrai site : ni le développement local ni un aperçu
// ne gonflent les chiffres. Si le site change d'adresse, `domains` doit changer avec elle (sinon plus rien n'est compté).
export const analytics = {
  scriptUrl: "https://analytics.allianceconsultants.net/script.js",
  websiteId: "a6623f9b-ed4b-4dc8-816e-32c25460f57d",
  domains: "cliniquepro-web.allianceconsultants.net",
};

export const contact = {
  phone: "+225 01 01 51 01 36",
  phoneHref: "tel:+2250101510136",
  whatsapp: "https://wa.me/2250101510136",
  whatsappMessage: "Bonjour CliniquePro, je souhaite en savoir plus sur votre logiciel de gestion de clinique.",
  email: "cliniquepro@allianceconsultants.net",
  city: "Abidjan, Côte d'Ivoire",
  // Adresse postale d'Alliance Consultants, telle que publiée sur https://allianceconsultants.net (pied de page,
  // /a-propos, /privacy et données structurées, relevé le 13 octobre 2026) : ville et pays seulement, ni rue ni quartier.
  // Ne pas en inventer : si l'éditeur publie une rue, l'ajouter ici (streetAddress) et elle alimentera les données structurées.
  address: { locality: "Abidjan", country: "CI", countryName: "Côte d'Ivoire" } as { locality: string; country: string; countryName: string; streetAddress?: string; postalCode?: string },
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
