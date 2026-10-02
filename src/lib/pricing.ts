// Grille tarifaire CliniquePro : deux packs. Montants en FCFA par mois.
// Source de vérité unique : modifier ici met à jour les cartes, le tableau comparatif et le total combiné.

export type PackId = "operationnel" | "financier";

export type Pack = {
  id: PackId;
  name: string;
  audience: string;
  monthly: number;
  tagline: string;
  highlights: string[];
  featured?: boolean;
};

export const packs: Pack[] = [
  {
    id: "operationnel",
    name: "Gestion opérationnelle",
    audience: "Le parcours patient, de l'accueil à la prescription",
    monthly: 35_000,
    tagline: "Tout ce qui fait tourner la clinique au quotidien.",
    highlights: [
      "Dossiers patients et dossier médical ophtalmologique",
      "Agenda partagé, rendez-vous et disponibilités médecins",
      "Réception, prestations du jour et prise en charge assurance",
      "Consultations structurées avec modèles par spécialité",
      "Examens (OCT, champ visuel, fond d'œil…) et rapports",
      "Ordonnances, ordonnances de lunettes, bulletins d'examens",
    ],
  },
  {
    id: "financier",
    name: "Gestion financière et comptable",
    audience: "Facturation, caisse, honoraires et comptabilité",
    monthly: 45_000,
    tagline: "Sécurisez chaque franc encaissé, de la caisse au bilan.",
    featured: true,
    highlights: [
      "Facturation par prestation, part patient et part assurance",
      "Caisse : sessions, encaissements multi-moyens, remboursements",
      "Honoraires médecins : pourcentage, prime fixe, états de paiement",
      "Comptabilité SYSCOHADA : journal, grand livre, balance",
      "Fournisseurs, dépenses, dettes et créances assurance",
      "Clôtures mensuelles et annuelles, contrôles d'audit",
    ],
  },
];

/** Total mensuel de la sélection (les packs sont complémentaires et se cumulent) */
export const bothPacksMonthly = packs.reduce((sum, p) => sum + p.monthly, 0);

export const pricingNote =
  "Tarifs en FCFA par mois. Les deux packs sont complémentaires et peuvent être souscrits ensemble. Demandez une démonstration pour valider le périmètre adapté à votre clinique.";
