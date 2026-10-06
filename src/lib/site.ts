// Coordonnées et identité légale, centralisées ici (pied de page, contact, WhatsApp, mentions légales).
// Éditeur et coordonnées repris de immotopia.cloud (même éditeur : Alliance Consultants).

export const SITE_NAME = "CliniquePro";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cliniquepro-web.allianceconsultants.net";
// Adresse de connexion à l'application (variable NEXT_PUBLIC_APP_URL pour la changer)
export const APP_LOGIN_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cliniquepro.allianceconsultants.net/demo-login";

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
  email: "support@immotopia.cloud",
  city: "Abidjan, Côte d'Ivoire",
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
