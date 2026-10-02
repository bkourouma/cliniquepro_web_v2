// Tout le texte du site est centralisé ici pour pouvoir être modifié sans toucher aux composants.
// Source : FONCTIONNALITES-SITE-INTERNET.md et FONCTIONNALITES.md du dépôt cliniqueprosas.
// Règle éditoriale : ne présenter que ce que l'application fait réellement ; jamais de date de livraison,
// jamais de chiffre ou de témoignage inventé (voir docs/PROMPTS-CONTENU.md pour les contenus à fournir).

export type MockupKind = "agenda" | "consultation" | "examens" | "assurance" | "caisse" | "comptabilite" | "pilotage";

export type HeroCard = {
  id: MockupKind;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  /** Photo facultative (public/images/hero/…, format 3:4). Sans photo, un fond dégradé est affiché. */
  image?: string;
  imageAlt?: string;
  imageClass?: string;
  accent: string; // couleur d'accent de la carte (halo, sur-titre)
  pack: "Gestion opérationnelle" | "Gestion financière et comptable";
};

export const heroCards: HeroCard[] = [
  {
    id: "agenda",
    eyebrow: "Patients, agenda et accueil",
    title: "Du premier appel à la salle d'attente, tout est organisé.",
    description:
      "Dossier patient centralisé, agenda partagé par médecin et par type d'acte (consultation, suivi, urgence, examen, chirurgie, injection, laser), statuts de rendez-vous et réception structurée dès l'arrivée.",
    cta: "Voir l'accueil patient",
    href: "#roles-accueil",
    accent: "#5FA3FF",
    pack: "Gestion opérationnelle",
  },
  {
    id: "consultation",
    eyebrow: "Consultation ophtalmologique",
    title: "Un dossier médical pensé pour l'ophtalmologie.",
    description:
      "Motif, antécédents, acuité visuelle de loin et de près, pression intraoculaire, réfraction, diagnostic et prescription : des modèles de consultation structurés pour gagner du temps et standardiser vos comptes rendus.",
    cta: "Voir l'espace médecin",
    href: "#roles-medecin",
    accent: "#34E39A",
    pack: "Gestion opérationnelle",
  },
  {
    id: "examens",
    eyebrow: "Examens et prescriptions",
    title: "Chaque examen suivi, chaque résultat retrouvé.",
    description:
      "Planification, démarrage et suivi des examens (OCT, champ visuel, rétinographie, biométrie, fond d'œil…), modèles configurables, rapports, puis ordonnances médicales et de lunettes prêtes à imprimer.",
    cta: "Découvrir les examens",
    href: "#ecosysteme",
    accent: "#7DD3FC",
    pack: "Gestion opérationnelle",
  },
  {
    id: "assurance",
    eyebrow: "Assurances et prise en charge",
    title: "Les accords assurance, sans échanges à la main.",
    description:
      "Associez l'assurance au patient, envoyez la demande de prise en charge, suivez les validations ou rejets prestation par prestation, avec un portail assurance accessible par lien sécurisé.",
    cta: "Voir la prise en charge",
    href: "#ecosysteme",
    accent: "#A78BFA",
    pack: "Gestion opérationnelle",
  },
  {
    id: "caisse",
    eyebrow: "Facturation et caisse",
    title: "Chaque paiement encaissé, tracé et rapproché.",
    description:
      "Factures par prestation, part patient et part assurance, sessions de caisse avec fond de caisse, paiements en espèces, carte, mobile money, virement ou chèque, monnaie rendue et remboursements encadrés.",
    cta: "Voir la caisse",
    href: "#roles-caisse",
    accent: "#FBBF24",
    pack: "Gestion financière et comptable",
  },
  {
    id: "comptabilite",
    eyebrow: "Comptabilité SYSCOHADA",
    title: "Une comptabilité qui s'écrit toute seule, sans trou.",
    description:
      "Plan de comptes SYSCOHADA, journal en partie double généré par les encaissements, grand livre, balance, fournisseurs et dépenses, clôtures mensuelles et annuelles, contrôles d'audit.",
    cta: "Découvrir la comptabilité",
    href: "#roles-caisse",
    accent: "#3DDC84",
    pack: "Gestion financière et comptable",
  },
  {
    id: "pilotage",
    eyebrow: "Pilotage et honoraires",
    title: "Toute l'activité de la clinique, d'un coup d'œil.",
    description:
      "Tableaux de bord direction, chiffre d'affaires, encaissements, statistiques par période, honoraires médecins calculés automatiquement et assistant analytique pour interroger vos données en langage naturel.",
    cta: "Découvrir le pilotage",
    href: "#roles-direction",
    accent: "#5FA3FF",
    pack: "Gestion financière et comptable",
  },
];

/* ---------------------------------------------------------------- bandeau défilant */

export type Partner = { name: string; color: string; badge?: boolean };

export const marqueeLabel = "Pensé pour les parcours ophtalmologiques";
export const marqueeItems: Partner[] = [
  { name: "Acuité visuelle", color: "#5FA3FF" },
  { name: "Pression intraoculaire", color: "#34E39A" },
  { name: "Réfraction", color: "#7DD3FC" },
  { name: "Fond d'œil", color: "#A78BFA" },
  { name: "OCT", color: "#FBBF24" },
  { name: "Champ visuel", color: "#3DDC84" },
  { name: "Biométrie", color: "#5FA3FF" },
  { name: "Ordonnances de lunettes", color: "#34E39A" },
];

/* ---------------------------------------------------------------- rôles */

export type RoleId = "direction" | "medecin" | "accueil" | "caisse";

export type Role = {
  id: RoleId;
  label: string;
  headline: string;
  pitch: string;
  features: { title: string; text: string }[];
  cta: { label: string; href: string };
  /** Maquette affichée à droite de l'onglet */
  mockup: MockupKind;
};

export const roles: Role[] = [
  {
    id: "direction",
    label: "Direction",
    headline: "Pilotez la clinique avec des chiffres fiables.",
    pitch:
      "Patients, rendez-vous, chiffre d'affaires, encaissements, factures, assurances et honoraires : la direction suit l'activité par période, sans attendre un état préparé à la main.",
    features: [
      { title: "Tableau de bord", text: "Vue propriétaire et indicateurs patients, consultations et paiements." },
      { title: "Statistiques", text: "Analyse des prestations et de l'activité médicale par période." },
      { title: "Assistant analytique", text: "Interrogez vos données en langage naturel." },
    ],
    cta: { label: "Voir les packs", href: "/tarifs" },
    mockup: "pilotage",
  },
  {
    id: "medecin",
    label: "Médecin",
    headline: "Consultez sans ressaisir, prescrivez sans friction.",
    pitch:
      "Le médecin retrouve le dossier complet du patient, saisit les données cliniques dans un modèle adapté, demande des examens et produit ses ordonnances depuis le même écran.",
    features: [
      { title: "Dossier ophtalmologique", text: "Antécédents, acuité, PIO, réfraction, historique." },
      { title: "Modèles de consultation", text: "Données cliniques dynamiques selon le type de consultation." },
      { title: "Prescriptions", text: "Ordonnances, lunettes, bulletins d'examens imprimables." },
    ],
    cta: { label: "Voir les fonctionnalités", href: "/fonctionnalites" },
    mockup: "consultation",
  },
  {
    id: "accueil",
    label: "Accueil",
    headline: "Un accueil fluide, un dossier prêt avant la consultation.",
    pitch:
      "Création du dossier, enregistrement de l'arrivée, ajout des prestations prévues, association de l'assurance et suivi du statut : l'accueil prépare la consultation et la caisse.",
    features: [
      { title: "Agenda partagé", text: "Rendez-vous par médecin, statuts et notes internes." },
      { title: "Réception", text: "Prestations du jour, montants calculés, lien vers la caisse." },
      { title: "Prise en charge", text: "Demandes assurance envoyées depuis le dossier de réception." },
    ],
    cta: { label: "Voir l'agenda et l'accueil", href: "/fonctionnalites" },
    mockup: "agenda",
  },
  {
    id: "caisse",
    label: "Caisse et comptabilité",
    headline: "Chaque encaissement écrit sa propre écriture comptable.",
    pitch:
      "Le caissier ouvre sa session, encaisse et clôture avec suivi des écarts. Le comptable retrouve le journal, la balance, les fournisseurs, les dépenses et les clôtures de période.",
    features: [
      { title: "Sessions de caisse", text: "Ouverture, fermeture, historique et suivi des écarts." },
      { title: "Journal immuable", text: "Écritures en partie double, corrigées par contre-passation." },
      { title: "Honoraires médecins", text: "Pourcentage, prime fixe et état de paiement par période." },
    ],
    cta: { label: "Voir la comptabilité", href: "/fonctionnalites" },
    mockup: "caisse",
  },
];

/* ---------------------------------------------------------------- problèmes résolus */

export const problems = [
  { title: "Dossiers patients dispersés", text: "Un seul dossier relie identité, assurance, consultations, examens, rendez-vous et paiements." },
  { title: "Temps perdu entre accueil, consultation et caisse", text: "Les informations saisies à l'accueil suivent le patient jusqu'au paiement, sans ressaisie." },
  { title: "Suivi assurance difficile", text: "Demandes, validations, rejets et montants approuvés restent historisés prestation par prestation." },
  { title: "Erreurs de facturation", text: "Les factures reprennent les actes réalisés avec la répartition patient / assurance." },
  { title: "Honoraires calculés à la main", text: "Pourcentages et primes sont appliqués aux actes de la période, avec le détail." },
  { title: "Manque de visibilité sur l'activité", text: "Des tableaux de bord et une comptabilité à jour plutôt que des fichiers à consolider." },
];

/* ---------------------------------------------------------------- journée type */

export const journey = [
  { moment: "Le matin", title: "Ouverture et accueil", text: "L'équipe ouvre la caisse, consulte l'agenda et accueille les premiers patients. Les dossiers sont retrouvés en quelques secondes." },
  { moment: "En consultation", title: "Dossier et prescription", text: "Le médecin consulte l'historique, saisit les données cliniques, demande des examens et produit ses prescriptions." },
  { moment: "Aux examens", title: "Résultats rattachés au patient", text: "Les techniciens réalisent les examens planifiés ; les résultats restent disponibles pour le médecin." },
  { moment: "Au paiement", title: "Part patient, part assurance", text: "La caisse encaisse la part patient, suit la part assurance et solde les actes réalisés." },
  { moment: "Le soir", title: "Clôture et pilotage", text: "La direction vérifie la caisse, les factures, les dossiers assurance, les honoraires et les tableaux de bord." },
];

/* ---------------------------------------------------------------- navigation */

export type NavLink = { label: string; href: string; children?: { label: string; text: string; href: string }[]; footer?: { label: string; href: string }; wide?: boolean };

export const navLinks: NavLink[] = [
  {
    label: "Solution",
    href: "#roles",
    wide: true,
    children: [
      { label: "Direction", text: "Tableaux de bord et statistiques", href: "#roles-direction" },
      { label: "Médecin", text: "Consultation, dossier et prescriptions", href: "#roles-medecin" },
      { label: "Accueil", text: "Agenda, réception et assurances", href: "#roles-accueil" },
      { label: "Caisse et comptabilité", text: "Encaissements, journal et honoraires", href: "#roles-caisse" },
    ],
    footer: { label: "Toutes les fonctionnalités", href: "/fonctionnalites" },
  },
  { label: "Wiki", href: "/wiki" },
  { label: "Écosystème", href: "#ecosysteme" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerProductLinks = [
  { label: "Fonctionnalités", href: "/fonctionnalites" },
  { label: "Wiki des fonctionnalités", href: "/wiki" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "FAQ", href: "/faq" },
  { label: "Demander une démo", href: "/contact" },
];
