// Positionnement de CliniquePro, une seule fois : titres, descriptions, données structurées, llms.txt, FAQ et « À propos »
// reprennent ces phrases pour ne jamais se contredire. Source : décisions de l'éditeur du 13 octobre 2026
// (voir docs/PROMPTS-CONTENU.md, section « Positionnement »). Rien ici ne doit être plus affirmatif que ces décisions.

/** Cible : structures privées, toutes spécialités. Pas de centres publics ou communautaires. */
export const AUDIENCE = "cliniques privées, centres de santé privés et cabinets médicaux";

/** Forme courte, pour les titres et les phrases où « privé » alourdit sans rien changer. */
export const AUDIENCE_SHORT = "cliniques, centres de santé et cabinets médicaux";

export const SOFTWARE_CATEGORY = "Logiciel de gestion de clinique, de centre de santé et de cabinet médical";

/** Phrase d'identité, pour lever la confusion avec les logiciels de nom proche. */
export const PUBLISHED_BY = "CliniquePro, édité par Alliance Consultants (Abidjan, Côte d'Ivoire)";

export const DATA_LAW = "loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel";

/** Hors périmètre, écrit noir sur blanc (FAQ, À propos, llms.txt). */
export const NOT_COVERED = ["l'hospitalisation", "le laboratoire", "la pharmacie"] as const;

/** Offre publiable en plus des prix (pricing.ts) : aucun délai, aucun frais de mise en route annoncé. */
export const SERVICE_POINTS = [
  "Formation de l'équipe incluse",
  "Import des données existantes",
  "Support par WhatsApp",
  "Abonnement sans engagement",
  "Sauvegarde quotidienne assurée par Alliance Consultants",
] as const;

/** Capacités confirmées par l'éditeur en plus des modules de features.ts (données structurées « featureList »). */
export const EXTRA_CAPABILITIES = [
  "Modèles de consultation paramétrables pour toutes les spécialités",
  "Saisie hors ligne puis synchronisation au retour du réseau",
  "Hébergement des données au choix du client (cloud ou serveur local)",
  "Plusieurs sites ou cabinets sous un même compte",
  "Paiement Mobile Money intégré",
  "Prise en charge par les assurances et mutuelles",
  "Fonctions d'intelligence artificielle optionnelles",
] as const;

/** Description commune (Organization, SoftwareApplication, llms.txt) : une seule phrase d'identité. */
export const SOFTWARE_DESCRIPTION = `Logiciel web de gestion pour ${AUDIENCE}, toutes spécialités : patients, rendez-vous, consultations, assurance, caisse, facturation, honoraires et comptabilité.`;
