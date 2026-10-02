// Coordonnées et identité légale, centralisées ici (pied de page, contact, WhatsApp, mentions légales).
// ⚠ Valeurs marquées « À renseigner » : à remplacer par les vraies informations de l'éditeur
// (voir docs/PROMPTS-CONTENU.md). Elles ne doivent pas rester telles quelles en production.

export const SITE_NAME = "CliniquePro";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cliniquepro.com";
export const APP_LOGIN_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.cliniquepro.com/login";

export const contact = {
  phone: "+225 00 00 00 00 00",
  phoneHref: "tel:+22500000000000",
  whatsapp: "https://wa.me/22500000000000",
  whatsappMessage: "Bonjour CliniquePro, je souhaite en savoir plus sur votre logiciel de gestion de clinique.",
  email: "contact@cliniquepro.com",
  city: "Abidjan, Côte d'Ivoire",
};

export const legal = {
  publisher: "À renseigner (raison sociale de l'éditeur)",
  legalForm: "À renseigner",
  rccm: "À renseigner",
  taxId: "À renseigner",
  publicationDirector: "À renseigner",
  host: "À renseigner (hébergeur)",
  hostAddress: "À renseigner",
};

export function whatsappLink(message = contact.whatsappMessage) {
  return `${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
