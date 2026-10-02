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

export const TRIAL_TEXT = "Premier mois offert, sans engagement";

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

// Remise de combinaison : 10 % sur le moins cher des packs souscrits ensemble (même règle qu'ImmoTopia).
// ⚠ Pourcentage repris par défaut, à confirmer.
export const COMBO_DISCOUNT = 0.1;

/** Total mensuel d'une sélection de packs, avec la remise de combinaison quand il y en a plusieurs */
export function comboPrice(selected: Pack[]) {
  const subtotal = selected.reduce((sum, p) => sum + p.monthly, 0);
  const discount = selected.length > 1 ? Math.round(Math.min(...selected.map((p) => p.monthly)) * COMBO_DISCOUNT) : 0;
  return { subtotal, discount, total: subtotal - discount };
}

export const pricingNote =
  "Prix hors taxes, en FCFA par mois. Premier mois offert sur tous les packs, sans engagement. Les deux packs sont complémentaires : souscrits ensemble, −10 % sur le moins cher. Demandez une démonstration pour valider le périmètre adapté à votre clinique.";
