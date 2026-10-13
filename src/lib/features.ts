// Les 14 modules de CliniquePro, avec le pack qui les couvre. Source : FONCTIONNALITES-SITE-INTERNET.md.
// Hypothèse de découpage (à valider avec l'éditeur) : « opérationnel » = parcours patient et médical,
// « financier » = facturation, caisse, honoraires, comptabilité, « commun » = socle présent dans les deux packs.

import type { PackId } from "./pricing";

export type ModuleScope = PackId | "commun";

export type Feature = {
  id: string;
  scope: ModuleScope;
  title: string;
  summary: string;
  items: string[];
  value: string;
};

export const features: Feature[] = [
  {
    id: "patients",
    scope: "operationnel",
    title: "Gestion des patients",
    summary: "Toutes les informations utiles au suivi administratif et médical du patient, dans un dossier unique.",
    items: [
      "Création et modification du dossier patient",
      "Import des données existantes à la mise en route",
      "Identité, contact, adresse et personne à prévenir",
      "Recherche rapide et historique du patient",
      "Gestion du statut et des consentements",
      "Suivi des assurances rattachées",
      "Accès aux consultations, examens, rendez-vous et paiements liés",
    ],
    value: "Retrouver une information en quelques secondes et éviter les dossiers dispersés.",
  },
  {
    id: "agenda",
    scope: "operationnel",
    title: "Agenda et rendez-vous",
    summary: "Un agenda partagé pour organiser l'activité quotidienne par médecin et par type d'acte.",
    items: [
      "Création, modification et suppression de rendez-vous",
      "Types : consultation, suivi, urgence, examen, chirurgie, injection, laser",
      "Statuts : planifié, confirmé, annulé, terminé, absent",
      "Disponibilités des médecins",
      "Rappels et notes internes",
      "Saisie possible hors connexion, synchronisée au retour du réseau",
    ],
    value: "Mieux anticiper les flux de patients et limiter les rendez-vous oubliés.",
  },
  {
    id: "reception",
    scope: "operationnel",
    title: "Réception et accueil patient",
    summary: "Le passage du patient est structuré dès son arrivée à la clinique.",
    items: [
      "Enregistrement de l'arrivée",
      "Ajout des prestations prévues",
      "Association avec l'assurance du patient",
      "Calcul des montants liés aux actes",
      "Envoi des demandes de prise en charge",
      "Lien entre réception, consultation, facturation et caisse",
    ],
    value: "Fluidifier l'accueil et assurer la continuité entre accueil, médecin, assurance et paiement.",
  },
  {
    id: "consultations",
    scope: "operationnel",
    title: "Consultations médicales",
    summary: "Un espace de consultation structuré pour les médecins.",
    items: [
      "Motif, symptômes, antécédents et traitements en cours",
      "Diagnostic principal et secondaire",
      "Niveau d'urgence ou de gravité",
      "Prescription, recommandations et date de contrôle",
      "Modèles de consultation paramétrables pour toutes les spécialités",
      "Saisie possible hors connexion, synchronisée au retour du réseau",
    ],
    value: "Standardiser la qualité des comptes rendus et gagner du temps en consultation.",
  },
  {
    id: "dossier",
    scope: "operationnel",
    title: "Dossier médical",
    summary: "Les informations cliniques essentielles du patient, regroupées et historisées, avec le détail de l'ophtalmologie en exemple.",
    items: [
      "Antécédents médicaux et familiaux",
      "Allergies, traitements, chirurgies et facteurs de risque",
      "Historique des examens et consultations",
      "Exemple en ophtalmologie, la spécialité la plus détaillée : antécédents ophtalmologiques, acuité visuelle de loin et de près, pression intraoculaire, réfraction",
      "Export ou impression des documents utiles",
    ],
    value: "Une vision complète du patient et un suivi médical sécurisé dans le temps.",
  },
  {
    id: "examens",
    scope: "operationnel",
    title: "Examens et résultats",
    summary: "Un workflow d'examens, avec les examens de l'ophtalmologie intégrés en exemple.",
    items: [
      "Planification, démarrage et suivi des examens",
      "Saisie progressive des résultats et modèles configurables",
      "Statuts : en attente, en cours, terminé, annulé",
      "Données d'imagerie ou fichiers associés",
      "Exemple en ophtalmologie : acuité, PIO, réfraction, segment antérieur, fond d'œil, OCT, rétinographie, champ visuel, biométrie",
      "Rapports d'examen",
    ],
    value: "Organiser les files d'examens et réduire les pertes d'information entre techniciens et médecins.",
  },
  {
    id: "ordonnances",
    scope: "operationnel",
    title: "Ordonnances et prescriptions",
    summary: "Des documents médicaux homogènes, produits depuis le dossier patient.",
    items: [
      "Ordonnances médicales et, en ophtalmologie, ordonnances de lunettes",
      "Catalogue de médicaments",
      "Bulletins d'examens",
      "Documents imprimables depuis le dossier patient",
      "En-têtes, pieds de page et modèles d'impression personnalisables",
    ],
    value: "Réduire les erreurs de rédaction et valoriser l'image professionnelle de la clinique.",
  },
  {
    id: "assurances",
    scope: "operationnel",
    title: "Assurances et prise en charge",
    summary: "La relation entre la clinique et ses assurances et mutuelles partenaires, du catalogue à la décision.",
    items: [
      "Catalogue des assurances et mutuelles associé aux patients",
      "Suivi des dossiers envoyés à l'assurance",
      "Validation ou rejet des prises en charge",
      "Montants approuvés par prestation",
      "Portail assurance accessible via lien sécurisé",
      "Historique des décisions",
    ],
    value: "Moins d'échanges manuels et un suivi précis des accords et des refus.",
  },
  {
    id: "facturation",
    scope: "financier",
    title: "Facturation",
    summary: "Les actes, prestations, patients et assurances reliés dans une même facture.",
    items: [
      "Génération et suivi des factures",
      "Lignes de facture par prestation",
      "Montant patient, montant assurance et montant total",
      "Statut de facture et statut de paiement",
      "Suivi du tiers payant et export des données",
    ],
    value: "Limiter les erreurs de facturation et suivre les montants dus par patient ou par assurance.",
  },
  {
    id: "caisse",
    scope: "financier",
    title: "Caisse et encaissement",
    summary: "Le cycle complet de la caisse, de l'ouverture à la fermeture.",
    items: [
      "Ouverture de session de caisse avec fond de caisse",
      "Encaissement des prestations",
      "Espèces, carte, virement, chèque ou assurance, et paiement Mobile Money intégré",
      "Monnaie rendue et remboursements encadrés",
      "Fermeture de caisse, historique des sessions et suivi des écarts",
    ],
    value: "Sécuriser les encaissements et faciliter les contrôles de fin de journée.",
  },
  {
    id: "honoraires",
    scope: "financier",
    title: "Honoraires médecins",
    summary: "Le calcul et le suivi des rémunérations des médecins.",
    items: [
      "Paramétrage des honoraires par médecin",
      "Calcul par période : pourcentage par prestation et prime fixe",
      "Montants à verser et statut de paiement",
      "Détail des actes pris en compte",
      "Édition de documents de paiement",
    ],
    value: "Éviter les calculs manuels complexes et donner une visibilité claire aux praticiens.",
  },
  {
    id: "comptabilite",
    scope: "financier",
    title: "Finances et comptabilité",
    summary: "Une comptabilité SYSCOHADA alimentée par l'activité de la clinique.",
    items: [
      "Plan de comptes SYSCOHADA et journal en partie double immuable",
      "Écritures automatiques pour encaissements, remboursements, écarts de caisse et honoraires",
      "Grand livre, balance et centralisation par journal",
      "Fournisseurs, dépenses avec justificatif, dettes fournisseurs",
      "Créances assurance âgées",
      "Clôtures mensuelles et annuelles, contrôles d'audit, exports CSV et PDF",
    ],
    value: "Une comptabilité traçable, sans double saisie, prête pour vos contrôles.",
  },
  {
    id: "pilotage",
    scope: "commun",
    title: "Tableaux de bord et statistiques",
    summary: "Des vues de pilotage pour suivre l'activité de la clinique.",
    items: [
      "Tableau de bord général et vue propriétaire",
      "Indicateurs patients, consultations, rendez-vous et paiements",
      "Suivi du chiffre d'affaires et statistiques par période",
      "Assistant analytique pour interroger les données en langage naturel",
      "Fonctions d'IA optionnelles (service tiers) : une aide à l'analyse, qui ne pose aucun diagnostic",
    ],
    value: "Décider plus vite et repérer les points de blocage.",
  },
  {
    id: "whatsapp",
    scope: "commun",
    title: "Messagerie WhatsApp",
    summary: "Un canal déjà familier des patients, accessible depuis l'interface.",
    items: [
      "Envoi de messages WhatsApp depuis l'application",
      "Confirmations, rappels ou informations pratiques selon la politique de la clinique",
    ],
    value: "Communiquer plus vite avec les patients et les partenaires.",
  },
  {
    id: "admin",
    scope: "commun",
    title: "Administration et sécurité",
    summary: "Configurer l'outil et donner le bon accès à la bonne personne.",
    items: [
      "Gestion des utilisateurs, rôles et permissions",
      "Gestion des médecins, prestations, assurances et spécialités",
      "Plusieurs sites ou cabinets sous un même compte",
      "Hébergement des données au choix : cloud ou serveur local dans la clinique",
      "Journal d'audit et sessions utilisateurs",
      "Configuration des documents",
      "Paramètres de conservation des données",
    ],
    value: "Protéger les informations sensibles et adapter l'application à votre organisation.",
  },
];

export const scopeLabel: Record<ModuleScope, string> = {
  operationnel: "Gestion opérationnelle",
  financier: "Gestion financière et comptable",
  commun: "Inclus dans les deux packs",
};

/** Page du wiki qui détaille chaque module, action par action (maillage de /fonctionnalites vers le wiki). */
export const featureWiki: Record<string, string> = {
  patients: "/wiki/patients",
  agenda: "/wiki/clinique#agenda-et-rendez-vous",
  reception: "/wiki/reception",
  consultations: "/wiki/clinique#consultations",
  dossier: "/wiki/clinique#dossiers-medicaux",
  examens: "/wiki/clinique#examens",
  ordonnances: "/wiki/clinique#ordonnances-medicales",
  assurances: "/wiki/assurances",
  facturation: "/wiki/argent#facturation",
  caisse: "/wiki/argent#caisse",
  honoraires: "/wiki/argent#honoraires",
  comptabilite: "/wiki/argent#comptabilite",
  pilotage: "/wiki/pilotage",
  whatsapp: "/wiki/communication",
  admin: "/wiki/administration",
};
