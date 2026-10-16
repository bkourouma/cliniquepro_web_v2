// Pages « d'intention » : une page par besoin de recherche (profil, fonction, ville). Le gabarit commun est
// src/components/intent-page.tsx ; l'adresse, le titre court et le menu sont dans intent-routes.ts.
//
// Règles (docs/PROMPTS-CONTENU.md) : chaque page cite sa source en commentaire (module de features.ts, domaine du wiki
// ou décision de l'éditeur du 13 et du 16 octobre 2026) ; aucune fonction hors de ces sources, aucun assureur nommé, aucun
// chiffre, client ou avis inventé. Titre : 46 caractères au plus (60 avec « | CliniquePro »). Description : 155 au plus.
// Les prix ne s'écrivent jamais ici : ils viennent de pricing.ts via fromPrice et price (page-content.ts).

import { AUDIENCE, DATA_LAW, NOT_COVERED } from "./positionnement";
import { fromPrice, type FaqItem, type Section } from "./page-content";
import type { IntentSlug } from "./intent-routes";

export type IntentPage = {
  slug: IntentSlug;
  /** Partie variable du titre (le gabarit ajoute « | CliniquePro ») */
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  /** Phrase d'ouverture sous le titre */
  lead: string;
  sections: Section[];
  faq: FaqItem[];
  /** Pages liées, en plus de /tarifs et /contact (3 à 5 liens croisés) */
  related: IntentSlug[];
  /** Pages du wiki qui détaillent les actions, action par action */
  wiki: { href: string; label: string }[];
};

const NOT_COVERED_TEXT = `${NOT_COVERED[0]}, ${NOT_COVERED[1]} et ${NOT_COVERED[2]}`;

export const intentPages: IntentPage[] = [
  /* ------------------------------------------------------------------ page locale */
  // Sources : décisions de l'éditeur (Côte d'Ivoire d'abord, hébergement au choix, sauvegarde par Alliance Consultants, loi 2013-450,
  // hors connexion = saisie puis synchronisation), features.ts (assurances, caisse, comptabilité), wiki « argent » et « assurances ».
  {
    slug: "logiciel-gestion-clinique-cote-ivoire",
    title: "Logiciel de clinique à Abidjan, Côte d'Ivoire",
    description: `Logiciel de clinique édité à Abidjan : dossier patient, assurance, caisse, facturation en FCFA, comptabilité SYSCOHADA. ${fromPrice}.`,
    eyebrow: "Côte d'Ivoire",
    h1: "Logiciel de gestion de clinique en Côte d'Ivoire, édité à Abidjan",
    lead: `CliniquePro est un logiciel web de gestion pour les ${AUDIENCE} de Côte d'Ivoire. Il est édité à Abidjan par Alliance Consultants, avec des prix publics en FCFA et une démonstration de 30 minutes.`,
    sections: [
      {
        h2: "Un éditeur basé à Abidjan",
        paragraphs: [
          "CliniquePro est édité par Alliance Consultants, une société basée à Abidjan. Vous échangez avec l'éditeur par WhatsApp, par téléphone ou par e-mail, et la démonstration se fait en français. Pour savoir qui est derrière le logiciel, voir la page [À propos](/a-propos).",
          "Le nom CliniquePro ressemble à celui d'autres logiciels. Pour ne pas les confondre, retenez l'éditeur, Alliance Consultants (Abidjan), et l'adresse de ce site.",
        ],
      },
      { h2: "Des prix publics en FCFA, premier mois offert", price: "both" },
      {
        h2: "Prise en charge par l'assurance et tiers payant",
        paragraphs: [
          "Vous enregistrez dans le catalogue de votre clinique les assurances et mutuelles avec lesquelles vous travaillez, avec leur taux de remboursement par défaut, puis vous les rattachez aux patients. À l'accueil, la demande de prise en charge part vers l'assureur, qui approuve ou rejette chaque prestation depuis un lien sécurisé. La facture distingue la part de l'assurance et la part du patient.",
        ],
        bullets: [
          "Catalogue des assurances et mutuelles, rattaché aux patients",
          "Validation ou rejet prestation par prestation, avec justification et historique des décisions",
          "Suivi du tiers payant : prestations facturées, puis payées",
        ],
      },
      {
        h2: "Une caisse en FCFA, avec Mobile Money intégré",
        paragraphs: [
          "La caisse fonctionne par session, de l'ouverture avec fond de caisse à la fermeture avec suivi des écarts. Elle accepte les espèces (avec la monnaie rendue), la carte, le virement, le chèque, le paiement direct par l'assurance et le paiement Mobile Money intégré. Les remboursements sont encadrés. Lorsque l'assurance couvre tout, un reçu à 0 FCFA est émis.",
          "Pour le détail du parcours, de la prise en charge à la facture, voir la page [facturation et prise en charge assurance](/facturation-assurance-clinique).",
        ],
      },
      {
        h2: "Une comptabilité SYSCOHADA alimentée par l'activité",
        paragraphs: [
          "Le plan de comptes SYSCOHADA et le journal en partie double sont alimentés automatiquement par les encaissements, les remboursements, les écarts de caisse et les honoraires des médecins. Vous disposez du grand livre, de la balance, des clôtures mensuelles et annuelles, des fournisseurs, des dépenses et des créances d'assurance, avec des exports CSV et PDF. Ces fonctions font partie du pack Gestion financière et comptable.",
        ],
      },
      {
        h2: "La saisie continue en cas de coupure",
        paragraphs: [
          "La saisie, par exemple des consultations et des paiements, peut se poursuivre sans connexion Internet. Elle est synchronisée au retour du réseau. Une page dédiée explique ce que cela veut dire, et ce que cela ne promet pas : [saisie hors connexion](/logiciel-clinique-hors-connexion).",
        ],
      },
      {
        h2: "Vos données : hébergement au choix, sauvegarde quotidienne",
        paragraphs: [
          `L'hébergement est au choix de la clinique : dans le cloud, ou sur un serveur local installé chez vous. Dans les deux cas, la sauvegarde quotidienne est assurée par Alliance Consultants. CliniquePro respecte la ${DATA_LAW}. Chaque utilisateur a un rôle et des droits adaptés à son métier, et le journal d'audit conserve la trace des actions importantes.`,
          "Si vous gérez plusieurs sites ou plusieurs cabinets, ils peuvent se gérer sous un même compte.",
        ],
      },
      {
        h2: "Prêt à l'emploi ou développement sur mesure ?",
        paragraphs: [
          "Faire développer un logiciel pour sa clinique est une option. Un logiciel prêt à l'emploi, abonnement mensuel, prix publics et sans engagement, en est une autre. Le guide [Logiciel de clinique : prêt à l'emploi (SaaS) ou développement sur mesure ?](/guides/logiciel-clinique-saas-ou-sur-mesure) donne les critères pour choisir.",
        ],
      },
    ],
    faq: [
      {
        q: "Pour quelles structures ivoiriennes CliniquePro est-il conçu ?",
        a: `CliniquePro est conçu pour les ${AUDIENCE}, de toutes spécialités. Les modèles de consultation sont paramétrables pour toutes les spécialités ; l'ophtalmologie est la plus détaillée.`,
      },
      {
        q: "Les prix sont-ils en FCFA ?",
        a: "Oui. Les prix sont publiés en FCFA, hors taxes, par mois. Seul le devis ou le contrat signé fait foi.",
      },
      {
        q: "Où sont hébergées les données ?",
        a: "L'hébergement est au choix du client : dans le cloud, ou sur un serveur local installé dans la clinique. La sauvegarde quotidienne est assurée par Alliance Consultants dans les deux cas.",
      },
      {
        q: "Que ne fait pas CliniquePro ?",
        a: `CliniquePro ne couvre pas ${NOT_COVERED_TEXT}. Il gère le parcours de la consultation à la comptabilité.`,
      },
      {
        q: "Comment obtenir une démonstration ?",
        a: "Utilisez le bouton « Demander une démo » ou écrivez-nous sur WhatsApp : un échange de 30 minutes montre l'application appliquée à votre organisation, sans engagement.",
      },
    ],
    related: ["logiciel-cabinet-medical", "logiciel-centre-de-sante", "facturation-assurance-clinique", "logiciel-clinique-hors-connexion"],
    wiki: [
      { href: "/wiki/assurances", label: "Assurances et prise en charge : toutes les actions" },
      { href: "/wiki/argent", label: "Caisse, facturation et comptabilité : toutes les actions" },
    ],
  },

  /* ------------------------------------------------------------------ cabinet médical */
  // Sources : features.ts (agenda, consultations, dossier, ordonnances, assurances, facturation, caisse, admin), wiki « clinique » (certificats,
  // rappels WhatsApp), décisions de l'éditeur (multi-cabinets, hors connexion, hébergement au choix).
  {
    slug: "logiciel-cabinet-medical",
    title: "Logiciel de cabinet médical en Côte d'Ivoire",
    description: `Agenda, dossier patient, ordonnances, caisse et assurance pour votre cabinet médical. ${fromPrice}, premier mois offert.`,
    eyebrow: "Cabinet médical",
    h1: "Le logiciel de gestion de votre cabinet médical",
    lead: "Un cabinet a besoin d'un outil simple : un agenda qui tient, un dossier patient retrouvé en quelques secondes, des ordonnances propres et une caisse juste. CliniquePro réunit tout cela, toutes spécialités.",
    sections: [
      {
        h2: "Ce que couvre la Gestion opérationnelle pour un cabinet",
        paragraphs: [
          "Le pack Gestion opérationnelle couvre le parcours du patient, de l'accueil à la prescription. Pour un cabinet, il suffit pour tenir l'agenda, ouvrir et suivre les dossiers, consulter, prescrire et gérer la prise en charge par l'assurance.",
        ],
        bullets: [
          "Dossiers patients et dossier médical, toutes spécialités",
          "Agenda partagé, rendez-vous et disponibilités des médecins",
          "Réception, prestations du jour et prise en charge assurance",
          "Consultations structurées avec modèles paramétrables par spécialité",
          "Ordonnances, bulletins d'examens et certificats médicaux",
        ],
      },
      {
        h2: "Agenda et rappels WhatsApp",
        paragraphs: [
          "L'agenda s'organise par médecin et par type d'acte, avec des créneaux de 15 minutes et un contrôle des conflits : un médecin ou un patient ne peut pas être réservé deux fois sur la même plage. Des rappels de rendez-vous partent automatiquement par WhatsApp, et le médecin reçoit un récapitulatif quotidien à heure fixe. Tout est décrit sur la page [rendez-vous médicaux](/logiciel-rendez-vous-medicaux).",
        ],
      },
      {
        h2: "Dossier patient, constantes, consultation, ordonnances",
        paragraphs: [
          "Chaque patient a un dossier unique : identité, contacts, assurances, historique. Le médecin saisit le motif, les antécédents, le diagnostic et la prescription dans un modèle de consultation que vous paramétrez pour votre spécialité. Il émet ensuite l'ordonnance, le bulletin d'examens ou le certificat médical depuis le même écran, sur votre papier à en-tête. Voir le [dossier patient informatisé](/dossier-patient-informatise).",
        ],
      },
      {
        h2: "Prise en charge par l'assurance",
        paragraphs: [
          "Si vos patients sont assurés, vous rattachez l'assurance ou la mutuelle à leur dossier. La demande de prise en charge est envoyée à l'assureur, qui valide ou rejette chaque prestation depuis un lien sécurisé. Aucun assureur n'est imposé : vous créez ceux avec lesquels vous travaillez.",
        ],
      },
      {
        h2: "Caisse et facturation : le pack financier, en option",
        paragraphs: [
          "La facturation par prestation, la caisse avec sessions, les honoraires des médecins et la comptabilité SYSCOHADA appartiennent au pack Gestion financière et comptable. Vous le choisissez si vous voulez tenir la caisse et les comptes du cabinet dans le même outil. Voir [facturation et assurance](/facturation-assurance-clinique).",
        ],
      },
      {
        h2: "Saisie hors connexion et plusieurs cabinets",
        paragraphs: [
          "Si la connexion se coupe, la saisie des consultations, des rendez-vous et des paiements peut continuer, puis elle est synchronisée au retour du réseau ([en savoir plus](/logiciel-clinique-hors-connexion)). Si vous exercez dans plusieurs cabinets, ils peuvent être gérés sous un même compte. L'hébergement des données est au choix : cloud, ou serveur local installé dans le cabinet.",
        ],
      },
      { h2: "Prix pour un cabinet", price: "operationnel" },
    ],
    faq: [
      {
        q: "Quel pack choisir pour un cabinet avec un seul médecin ?",
        a: "La Gestion opérationnelle couvre l'agenda, le dossier patient, la consultation, les ordonnances et la prise en charge par l'assurance. Ajoutez la Gestion financière et comptable si vous voulez aussi gérer la facturation, la caisse, les honoraires et la comptabilité dans CliniquePro. La démonstration permet de valider le bon périmètre.",
      },
      {
        q: "CliniquePro convient-il à ma spécialité ?",
        a: "Oui. Les modèles de consultation sont paramétrables pour toutes les spécialités : vous créez votre spécialité et votre modèle dans l'application. L'ophtalmologie est la spécialité la plus détaillée.",
      },
      {
        q: "Faut-il installer un logiciel sur l'ordinateur du cabinet ?",
        a: "Non. CliniquePro est une application web, accessible depuis un navigateur, sur ordinateur, tablette ou téléphone.",
      },
      {
        q: "Peut-on reprendre les dossiers que j'ai déjà ?",
        a: "Oui : l'import de vos données existantes fait partie de la mise en route, et la formation de votre équipe est incluse.",
      },
    ],
    related: ["logiciel-rendez-vous-medicaux", "dossier-patient-informatise", "facturation-assurance-clinique", "logiciel-gestion-clinique-cote-ivoire"],
    wiki: [
      { href: "/wiki/clinique", label: "Clinique médicale : consultations, agenda, ordonnances, certificats" },
      { href: "/wiki/patients", label: "Patients : le dossier administratif" },
    ],
  },

  /* ------------------------------------------------------------------ centre de santé privé */
  // Sources : features.ts, wiki « clinique » (constantes), « pilotage » (rôles infirmier, technicien d'examens), « administration » (rôles, audit).
  // Cible : centres de santé et centres médicaux PRIVÉS uniquement (décision du 13 octobre 2026).
  {
    slug: "logiciel-centre-de-sante",
    title: "Logiciel de gestion pour centre de santé privé",
    description: `Patients, rendez-vous, consultations, caisse et prise en charge assurance pour votre centre de santé privé. ${fromPrice}, démo 30 min.`,
    eyebrow: "Centre de santé privé",
    h1: "Logiciel de gestion pour centres de santé et centres médicaux privés",
    lead: "Un centre de santé privé fait travailler ensemble l'accueil, les médecins, les infirmiers, la caisse et la direction. CliniquePro donne à chacun l'écran de son métier, sur le même dossier patient.",
    sections: [
      {
        h2: "Une organisation multi-rôles, un seul dossier patient",
        paragraphs: [
          "Dans un centre de santé, plusieurs personnes interviennent sur le même patient. CliniquePro attribue à chaque utilisateur un rôle et des permissions : direction, médecin, accueil, infirmier, caisse, comptabilité, assureur, administrateur. Chacun voit les écrans et les indicateurs de son métier, et personne ne ressaisit ce que l'autre a déjà enregistré.",
        ],
      },
      {
        h2: "Le parcours du patient, de l'arrivée à la sortie",
        paragraphs: [
          "À l'arrivée, l'accueil ouvre le dossier d'accueil : prestations prévues, médecin assigné, assurance ou paiement direct. Le patient apparaît ensuite dans la file du jour, où l'infirmier saisit les constantes avant la consultation. Le médecin consulte, prescrit et demande des examens ; la caisse encaisse les prestations réglées. CliniquePro relie ces étapes entre elles, de la réception à la caisse.",
        ],
      },
      {
        h2: "Constantes et consultations",
        paragraphs: [
          "L'écran des constantes enregistre la tension, le pouls, la température, la fréquence respiratoire, la saturation en oxygène, le poids, la taille et la glycémie, avec des notes et un indice de masse corporelle calculé automatiquement. L'historique des constantes d'un patient se consulte dans un tableau, et la dernière saisie est rappelée au médecin pendant la consultation. Les modèles de consultation sont paramétrables pour toutes les spécialités qui exercent dans votre centre.",
        ],
      },
      {
        h2: "Assurance et facturation",
        paragraphs: [
          "Les patients assurés sont rattachés à leur assurance ou à leur mutuelle. La demande de prise en charge part vers l'assureur, qui valide ou rejette chaque prestation. La facture distingue la part de l'assurance et la part du patient, et le suivi du tiers payant indique ce qui est facturé et payé. Voir [facturation et prise en charge assurance](/facturation-assurance-clinique).",
        ],
      },
      {
        h2: "Pilotage et statistiques pour la direction",
        paragraphs: [
          "La direction suit les patients, les consultations, les rendez-vous, les paiements et le chiffre d'affaires par période, depuis un tableau de bord par rôle. L'assistant analytique, une fonction d'intelligence artificielle optionnelle reposant sur un service tiers, permet d'interroger les données en langage naturel. C'est une aide à l'analyse : elle ne pose aucun diagnostic.",
        ],
      },
      {
        h2: "Rôles, journal d'audit et plusieurs sites",
        paragraphs: [
          `Le journal d'audit indique qui a fait quoi, quand et sur quel dossier. Les comptes se créent, se modifient et se désactivent sans suppression. Si votre structure compte plusieurs sites, ils se gèrent sous un même compte. CliniquePro respecte la ${DATA_LAW} ; l'hébergement est au choix (cloud ou serveur local) et la sauvegarde quotidienne est assurée par Alliance Consultants.`,
        ],
      },
      { h2: "Prix pour un centre de santé", price: "both" },
    ],
    faq: [
      {
        q: "CliniquePro est-il fait pour les centres de santé privés ?",
        a: "Oui. CliniquePro est conçu pour les cliniques privées, les centres de santé privés et les cabinets médicaux. Il couvre le parcours de la consultation à la comptabilité.",
      },
      {
        q: "Les infirmiers ont-ils leur propre accès ?",
        a: "Oui. Chaque utilisateur dispose d'un rôle et de permissions adaptés à son métier, y compris pour la saisie des constantes avant la consultation.",
      },
      {
        q: "CliniquePro gère-t-il l'hospitalisation, le laboratoire ou la pharmacie ?",
        a: `Non. CliniquePro ne couvre pas ${NOT_COVERED_TEXT}. Le catalogue de médicaments sert à rédiger les ordonnances, pas à gérer une pharmacie.`,
      },
      {
        q: "Peut-on suivre plusieurs sites dans un même compte ?",
        a: "Oui. Plusieurs sites ou cabinets peuvent être gérés sous un même compte.",
      },
    ],
    related: ["logiciel-gestion-clinique-cote-ivoire", "logiciel-cabinet-medical", "dossier-patient-informatise", "facturation-assurance-clinique"],
    wiki: [
      { href: "/wiki/reception", label: "Réception et accueil : toutes les actions" },
      { href: "/wiki/administration", label: "Administration : utilisateurs, rôles, journal d'audit" },
    ],
  },

  /* ------------------------------------------------------------------ ophtalmologie */
  // Sources : features.ts (dossier, examens, ordonnances, agenda), wiki « clinique » (examens, ordonnances de lunettes, dossiers médicaux, remplissage
  // d'un examen depuis un PDF par IA). Pas d'imagerie intégrée ni de connexion aux appareils : non confirmé, donc non écrit.
  {
    slug: "logiciel-ophtalmologie",
    title: "Logiciel d'ophtalmologie : clinique et cabinet",
    description: "Acuité, pression intraoculaire, réfraction, OCT, champ visuel, ordonnances de lunettes : le dossier ophtalmologique de CliniquePro.",
    eyebrow: "Ophtalmologie",
    h1: "Logiciel de gestion pour cliniques et cabinets d'ophtalmologie",
    lead: "L'ophtalmologie est la spécialité la plus détaillée de CliniquePro : mesures du dossier, examens, ordonnances de lunettes et agenda sont intégrés, dans le même outil que l'accueil, l'assurance et la caisse.",
    sections: [
      {
        h2: "Le dossier ophtalmologique",
        paragraphs: [
          "Le dossier médical regroupe les antécédents médicaux et familiaux, les allergies, les traitements, les chirurgies et les facteurs de risque. En ophtalmologie, il détaille les antécédents ophtalmologiques, l'acuité visuelle de loin et de près, la pression intraoculaire et la réfraction. Une mesure d'acuité ou de pression saisie par erreur se corrige ensuite depuis le dossier.",
          "L'historique des examens et des consultations reste regroupé : le suivi d'un patient dans le temps se lit d'un seul coup d'œil.",
        ],
      },
      {
        h2: "Les examens ophtalmologiques",
        paragraphs: [
          "Un workflow d'examens suit chaque examen de la planification au rapport : programmation, démarrage, saisie progressive des résultats, puis statuts en attente, en cours, terminé ou annulé. Les examens intégrés en ophtalmologie sont les suivants.",
        ],
        bullets: [
          "Acuité visuelle, pression intraoculaire et réfraction",
          "Segment antérieur et fond d'œil",
          "OCT et rétinographie",
          "Champ visuel et biométrie",
        ],
      },
      {
        h2: "Ordonnances de lunettes et bulletins d'examens",
        paragraphs: [
          "L'ordonnance de lunettes se remplit dans un formulaire de correction optique, puis se génère en document Word prêt à être remis au patient. L'ordonnance médicale, le bulletin d'examens et les documents imprimables partent du même dossier, avec votre en-tête et votre pied de page personnalisés.",
          "Vous pouvez aussi joindre des fichiers à un examen. Pour gagner du temps, une fonction d'intelligence artificielle optionnelle, qui repose sur un service tiers, peut extraire les valeurs d'un PDF de résultats vers les champs du modèle d'examen : c'est une aide à la saisie, pas un diagnostic.",
        ],
      },
      {
        h2: "L'agenda ophtalmologique",
        paragraphs: [
          "L'agenda gère des types de rendez-vous adaptés à l'activité : consultation, suivi, urgence, examen, chirurgie, injection et laser. Les statuts, les créneaux et les disponibilités de chaque médecin sont décrits sur la page [rendez-vous médicaux](/logiciel-rendez-vous-medicaux).",
        ],
      },
      {
        h2: "Du dossier à la facturation",
        paragraphs: [
          "Le même dossier alimente la réception, l'assurance, la facturation, la caisse et les honoraires des médecins. Les prestations du jour sont ajoutées à l'accueil, la prise en charge est demandée à l'assureur, puis la facture distingue la part de l'assurance et la part du patient. Voir [facturation et assurance](/facturation-assurance-clinique) pour le détail.",
        ],
      },
      {
        h2: "Et pour les autres spécialités ?",
        paragraphs: [
          "CliniquePro ne s'arrête pas à l'ophtalmologie. Les modèles de consultation sont paramétrables pour toutes les spécialités, et l'ophtalmologie sert d'exemple détaillé. Pour une vue d'ensemble, voir le [logiciel de gestion de clinique](/logiciel-gestion-clinique-cote-ivoire) et le [logiciel de cabinet médical](/logiciel-cabinet-medical).",
        ],
      },
      { h2: "Prix", price: "operationnel" },
    ],
    faq: [
      {
        q: "Quels examens ophtalmologiques CliniquePro gère-t-il ?",
        a: "L'acuité visuelle, la pression intraoculaire, la réfraction, le segment antérieur, le fond d'œil, l'OCT, la rétinographie, le champ visuel et la biométrie, avec des modèles d'examen configurables et des rapports d'examen.",
      },
      {
        q: "Peut-on établir une ordonnance de lunettes ?",
        a: "Oui. L'ordonnance de lunettes se remplit dans un formulaire de correction optique et se génère en document Word.",
      },
      {
        q: "Les modules d'ophtalmologie sont-ils inclus dans un pack ?",
        a: "Oui : ils sont inclus dans la Gestion opérationnelle, avec les dossiers, l'agenda, les consultations, les examens et les ordonnances.",
      },
      {
        q: "L'intelligence artificielle pose-t-elle un diagnostic ?",
        a: "Non. Les fonctions d'IA sont optionnelles, reposent sur un service tiers et servent d'aide. La décision médicale reste celle du médecin.",
      },
    ],
    related: ["dossier-patient-informatise", "logiciel-rendez-vous-medicaux", "facturation-assurance-clinique", "logiciel-cabinet-medical"],
    wiki: [
      { href: "/wiki/clinique#examens", label: "Examens : toutes les actions" },
      { href: "/wiki/clinique#ordonnances-de-lunettes-vision", label: "Ordonnances de lunettes : toutes les actions" },
    ],
  },

  /* ------------------------------------------------------------------ rendez-vous */
  // Sources : features.ts (agenda), wiki « clinique » → « Agenda et rendez-vous » (statut disponible). Pas de prise de rendez-vous en ligne
  // par le patient, pas de SMS, aucun taux de rendez-vous manqués : non confirmés, donc non écrits.
  {
    slug: "logiciel-rendez-vous-medicaux",
    title: "Logiciel de rendez-vous médicaux (agenda)",
    description: "Agenda partagé par médecin, rappels WhatsApp, statuts et glisser-déposer pour clinique ou cabinet. Démo de 30 minutes.",
    eyebrow: "Rendez-vous médicaux",
    h1: "Gérez les rendez-vous de votre clinique ou cabinet",
    lead: "L'agenda de CliniquePro organise l'activité par médecin et par type d'acte, évite les conflits de créneaux et relance les patients par WhatsApp.",
    sections: [
      {
        h2: "Un agenda par médecin et par type d'acte",
        paragraphs: [
          "Chaque médecin a son planning hebdomadaire. Vous créez, modifiez, replanifiez ou annulez un rendez-vous en choisissant le médecin, le patient et la prestation, dont la durée par défaut est reprise automatiquement. Les types d'acte couvrent la consultation, le suivi, l'urgence, l'examen, la chirurgie, l'injection et le laser. L'agenda aide ainsi à mieux anticiper les flux de patients et à limiter les rendez-vous oubliés.",
        ],
      },
      {
        h2: "Des créneaux de 15 minutes, sans conflit",
        paragraphs: [
          "L'agenda travaille sur une grille de 15 minutes, avec une durée de 15 à 240 minutes. Il refuse un rendez-vous dans le passé, en dehors des horaires du médecin, ou en conflit avec un autre rendez-vous du même médecin ou du même patient. Les messages d'erreur sont en français.",
        ],
      },
      {
        h2: "Des statuts clairs, des transitions contrôlées",
        paragraphs: [
          "Un rendez-vous est planifié, confirmé, en cours, reporté, terminé, annulé ou absent. Les transitions invalides sont interdites : terminé, annulé et absent sont des statuts définitifs. Un rendez-vous de suivi lié à une consultation la clôt ; s'il est annulé, la consultation est rouverte lorsqu'il n'existe pas d'autre suivi actif.",
        ],
      },
      {
        h2: "Glisser-déposer et replanification",
        paragraphs: [
          "Sur le calendrier, vous déplacez un rendez-vous ou vous allongez sa durée d'un geste, sans passer par un formulaire. Le déplacement vers le passé est refusé et les mêmes contrôles de conflit s'appliquent.",
        ],
      },
      {
        h2: "Rappels WhatsApp automatiques et récapitulatif du médecin",
        paragraphs: [
          "Des rappels de rendez-vous peuvent partir automatiquement par WhatsApp, et le médecin reçoit un récapitulatif quotidien à heure fixe, réglé par cabinet. À partir de la liste des rendez-vous, vous pouvez aussi sélectionner des patients et leur envoyer un rappel par WhatsApp ou par e-mail. Pour des messages libres, le module [messagerie WhatsApp](/wiki/communication) complète l'agenda.",
        ],
      },
      {
        h2: "Exports Excel et PDF",
        paragraphs: [
          "La liste des rendez-vous se filtre, puis s'exporte en tableur ou en PDF au format A4 paysage, par exemple pour préparer la journée d'un médecin ou transmettre le planning à l'équipe.",
        ],
      },
      {
        h2: "Horaires et disponibilités des médecins",
        paragraphs: [
          "Les plages de travail de chaque médecin se règlent dans l'application. L'agenda n'accepte un créneau que dans ces plages actives. Si la connexion se coupe, la saisie peut continuer et elle est synchronisée au retour du réseau ([saisie hors connexion](/logiciel-clinique-hors-connexion)).",
        ],
      },
      { h2: "Prix : l'agenda est dans la Gestion opérationnelle", price: "operationnel" },
    ],
    faq: [
      {
        q: "Les rappels de rendez-vous sont-ils automatiques ?",
        a: "Oui, des rappels WhatsApp peuvent être envoyés automatiquement, et le médecin reçoit un récapitulatif quotidien à heure fixe. Vous pouvez aussi envoyer un rappel manuel à une sélection de patients.",
      },
      {
        q: "Peut-on imprimer ou partager le planning ?",
        a: "Oui. La liste des rendez-vous filtrés s'exporte en tableur ou en PDF au format A4 paysage.",
      },
      {
        q: "Peut-on gérer plusieurs médecins dans la même clinique ?",
        a: "Oui. L'agenda est organisé par médecin, avec ses horaires et ses disponibilités, et les conflits sont contrôlés pour chaque médecin et pour chaque patient.",
      },
      {
        q: "Que se passe-t-il si Internet se coupe ?",
        a: "La saisie peut continuer sans connexion, puis elle est synchronisée au retour du réseau. Le périmètre exact se présente lors de la démonstration.",
      },
      {
        q: "L'agenda est-il inclus dans un pack ?",
        a: "Oui, dans la Gestion opérationnelle, avec les dossiers patients, la réception, les consultations et les examens.",
      },
    ],
    related: ["dossier-patient-informatise", "logiciel-cabinet-medical", "logiciel-clinique-hors-connexion", "logiciel-ophtalmologie"],
    wiki: [{ href: "/wiki/clinique#agenda-et-rendez-vous", label: "Agenda et rendez-vous : toutes les actions" }],
  },

  /* ------------------------------------------------------------------ dossier patient (avec la section IA) */
  // Sources : features.ts (patients, dossier, consultations, ordonnances, pilotage), wiki « patients », « clinique » (dossiers médicaux, constantes,
  // certificats, IA des dossiers, remplissage via PDF), décision du 16 octobre 2026 (les trois fonctions d'IA, aide optionnelle, service tiers).
  {
    slug: "dossier-patient-informatise",
    title: "Dossier patient informatisé pour clinique",
    description: "Un dossier unique par patient : identité, assurance, consultations, examens, constantes, ordonnances. Accès par rôle et journal d'audit.",
    eyebrow: "Dossier patient",
    h1: "Le dossier patient informatisé de votre clinique",
    lead: "Un dossier unique par patient, de l'identité aux ordonnances : l'accueil, les médecins et la caisse travaillent sur les mêmes informations, chacun avec les droits de son métier.",
    sections: [
      {
        h2: "Un dossier unique : identité, contacts, assurances, historique",
        paragraphs: [
          "Le dossier administratif regroupe l'identité, les contacts, l'adresse, la personne à prévenir, les assurances rattachées et l'historique du patient. La recherche porte sur le nom, le prénom, le numéro et le téléphone, avec des filtres par sexe, statut, régime, année de naissance et ville. À partir du dossier, vous accédez aux consultations, examens, rendez-vous et paiements liés. À la mise en route, l'import de vos données existantes est inclus.",
        ],
      },
      {
        h2: "Détection des doublons",
        paragraphs: [
          "Avant de créer un patient, CliniquePro vérifie s'il en existe déjà un avec le même numéro de sécurité sociale, ou les mêmes prénom, nom et date de naissance. Le cas échéant, une alerte liste les patients potentiellement similaires et demande une confirmation pour créer le dossier quand même. L'archivage est une suppression logique : la raison est obligatoire et l'action est tracée.",
        ],
      },
      {
        h2: "Le dossier médical",
        paragraphs: [
          "Le dossier médical structure le motif, les symptômes, l'examen clinique, le diagnostic, le plan de traitement et le suivi. L'historique médical conserve les antécédents médicaux et familiaux, les allergies, les traitements, les chirurgies et les facteurs de risque. Un tableau de bord du patient résume les éléments clés : allergies, antécédents, examens terminés et suivis à venir.",
        ],
      },
      {
        h2: "Les constantes (signes vitaux)",
        paragraphs: [
          "Les constantes se saisissent avant la consultation : tension, pouls, température, fréquence respiratoire, saturation en oxygène, poids, taille et glycémie, avec l'indice de masse corporelle calculé automatiquement. L'historique reste consultable et la dernière saisie est rappelée au médecin pendant la consultation.",
        ],
      },
      {
        h2: "Des consultations structurées par modèle",
        paragraphs: [
          "Chaque consultation suit un modèle paramétrable pour toutes les spécialités : motif, symptômes, antécédents, traitements en cours, diagnostic principal et secondaire, niveau d'urgence, recommandations et date de contrôle. Vous créez vos spécialités et vos modèles dans l'application. L'ophtalmologie sert d'exemple détaillé : voir le [logiciel d'ophtalmologie](/logiciel-ophtalmologie).",
        ],
      },
      {
        h2: "Ordonnances, certificats médicaux et bulletins d'examens",
        paragraphs: [
          "Depuis le dossier, le médecin produit l'ordonnance médicale avec le catalogue de médicaments, le bulletin d'examens et le certificat médical. Les documents sont imprimables, avec un en-tête, un pied de page et des modèles d'impression personnalisables.",
        ],
      },
      {
        h2: "Qui voit quoi : rôles, permissions et journal d'audit",
        paragraphs: [
          `Chaque utilisateur a un rôle et des permissions adaptés à son métier. Le journal d'audit conserve la trace de qui a fait quoi, et l'historique d'audit d'un patient retrace les accès et les modifications. CliniquePro respecte la ${DATA_LAW}. L'hébergement est au choix du client, dans le cloud ou sur un serveur local, et la sauvegarde quotidienne est assurée par Alliance Consultants.`,
        ],
      },
      {
        h2: "Exporter le dossier d'un patient",
        paragraphs: [
          "Le dossier d'un patient peut être exporté en JSON, XML ou CSV. À la fin du contrat, vous pouvez aussi récupérer vos données, sur simple demande.",
        ],
      },
      {
        h2: "L'intelligence artificielle : une aide optionnelle, jamais un diagnostic",
        paragraphs: [
          "CliniquePro propose trois fonctions d'intelligence artificielle. Elles sont optionnelles, reposent sur un service tiers et servent d'aide : elles ne posent aucun diagnostic, et la décision médicale reste celle du médecin.",
        ],
        bullets: [
          "Poser des questions en langage naturel sur vos données, par exemple le chiffre d'affaires par médecin ou l'évolution des consultations, ou des questions libres sur un patient",
          "Extraire des informations d'un PDF de résultats d'examen vers les champs du modèle d'examen",
          "Produire une synthèse du dossier patient : historique, points clés et examens récents",
        ],
      },
      { h2: "Prix : le dossier patient est dans la Gestion opérationnelle", price: "operationnel" },
    ],
    faq: [
      {
        q: "Le dossier patient est-il partagé entre l'accueil, le médecin et la caisse ?",
        a: "Oui. Le dossier est unique ; chaque utilisateur y accède avec les droits de son rôle, et les actions importantes sont tracées dans un journal d'audit.",
      },
      {
        q: "Peut-on exporter le dossier d'un patient ?",
        a: "Oui, en JSON, XML ou CSV. Vous pouvez aussi récupérer vos données à la fin du contrat, sur simple demande.",
      },
      {
        q: "L'intelligence artificielle est-elle obligatoire ?",
        a: "Non. Les fonctions d'IA sont optionnelles ; vous choisissez de les utiliser ou non. Elles reposent sur un service tiers, servent d'aide et ne posent aucun diagnostic.",
      },
      {
        q: "Que devient mon dossier si la connexion se coupe ?",
        a: "La saisie, par exemple d'une consultation, peut continuer sans connexion, puis elle est synchronisée au retour du réseau.",
      },
      {
        q: "Mes données sont-elles sauvegardées ?",
        a: "Oui. La sauvegarde quotidienne est assurée par Alliance Consultants, que vous choisissiez le cloud ou un serveur local.",
      },
    ],
    related: ["logiciel-rendez-vous-medicaux", "logiciel-ophtalmologie", "logiciel-cabinet-medical", "facturation-assurance-clinique"],
    wiki: [
      { href: "/wiki/patients", label: "Patients : toutes les actions du dossier administratif" },
      { href: "/wiki/clinique#dossiers-medicaux", label: "Dossiers médicaux : toutes les actions" },
    ],
  },

  /* ------------------------------------------------------------------ facturation et assurance */
  // Sources : features.ts (assurances, reception, facturation, caisse, comptabilité), wiki « assurances », « reception », « argent ».
  // Assureurs génériques : aucun nom, aucune télétransmission, aucun délai de remboursement.
  {
    slug: "facturation-assurance-clinique",
    title: "Facturation de clinique et tiers payant",
    description: "Factures par prestation, part patient et part assurance, validation par l'assureur, créances suivies. Pour clinique et cabinet.",
    eyebrow: "Facturation et assurance",
    h1: "Facturation et prise en charge assurance pour clinique",
    lead: "De l'assurance rattachée au patient à la créance suivie : CliniquePro relie la réception, la décision de l'assureur, la facture et la caisse, pour que chaque prestation soit facturée à la bonne personne, au bon montant.",
    sections: [
      {
        h2: "Associer l'assurance au patient dès l'accueil",
        paragraphs: [
          "Vous tenez un catalogue des assurances et mutuelles avec lesquelles vous travaillez : nom, code, type, coordonnées, tiers payant et taux de remboursement par défaut. À la réception, vous associez l'assurance au patient, ou vous ajoutez la sienne depuis le dossier d'accueil. Un patient sans assurance règle en paiement direct.",
        ],
      },
      {
        h2: "La demande de prise en charge",
        paragraphs: [
          "Après l'ajout des prestations prévues, vous envoyez la demande de prise en charge à l'assureur : il la reçoit par e-mail avec un lien de validation. Les montants liés aux actes sont calculés à la réception.",
        ],
      },
      {
        h2: "Validation ou rejet prestation par prestation",
        paragraphs: [
          "L'assureur ouvre le portail par un lien sécurisé et approuve ou rejette chaque prestation, avec une justification. La demande est alors approuvée, rejetée ou partiellement approuvée, et des notifications partent ensuite. Toutes les décisions restent dans l'historique, ce qui permet de retrouver pourquoi une prestation a été refusée.",
        ],
      },
      {
        h2: "Part patient et part assurance",
        paragraphs: [
          "La facture est établie par prestation et indique le montant à la charge du patient, le montant pris en charge par l'assurance et le montant total, avec un statut de facture et un statut de paiement. Lorsque l'assurance couvre toutes les prestations, un reçu à 0 FCFA est émis à la caisse.",
        ],
      },
      {
        h2: "Le suivi du tiers payant : facturé, puis payé",
        paragraphs: [
          "L'écran de facturation des assurances liste les prestations facturables avec leur décision. Vous filtrez par assurance, par période et par décision de paiement (en attente, validé, refusé), puis vous marquez des prestations comme facturées, avec le numéro de facture et la date, ou comme payées, en lot ou une par une. Une synthèse donne les totaux par statut.",
        ],
      },
      {
        h2: "Créances d'assurance âgées",
        paragraphs: [
          "Dans la comptabilité, les créances d'assurance sont suivies par ancienneté, à côté des dettes fournisseurs. Vous repérez ainsi les montants que les assureurs n'ont pas encore réglés. Cette partie appartient au pack Gestion financière et comptable.",
        ],
      },
      {
        h2: "Exports CSV",
        paragraphs: [
          "Les lignes de facturation affichées, selon vos filtres, s'exportent en CSV, par exemple pour préparer un relevé destiné à un assureur ou pour un contrôle interne.",
        ],
      },
      {
        h2: "Caisse et encaissement",
        paragraphs: [
          "À la caisse, le caissier sélectionne les prestations à encaisser, avec le total calculé en direct. Il accepte les espèces avec la monnaie rendue, la carte, le virement, le chèque, le paiement direct par l'assurance et le paiement Mobile Money intégré. La session de caisse s'ouvre avec un fond de caisse et se ferme avec le suivi des écarts ; les remboursements sont encadrés, et chaque encaissement génère l'écriture comptable correspondante.",
        ],
      },
      { h2: "Prix : facturation, caisse et comptabilité", price: "financier" },
    ],
    faq: [
      {
        q: "Comment CliniquePro gère-t-il les assurances et les mutuelles ?",
        a: "Vous créez dans un catalogue les assurances et mutuelles avec lesquelles vous travaillez, puis vous les rattachez aux patients. La demande de prise en charge est envoyée à l'assureur, qui valide ou rejette chaque prestation via un lien sécurisé.",
      },
      {
        q: "La facture distingue-t-elle la part du patient et celle de l'assurance ?",
        a: "Oui. Chaque facture indique le montant patient, le montant assurance et le montant total, par prestation.",
      },
      {
        q: "Peut-on suivre les factures non payées par les assurances ?",
        a: "Oui. Le suivi du tiers payant distingue les prestations facturées et payées, et les créances d'assurance sont suivies par ancienneté dans la comptabilité.",
      },
      {
        q: "Quels moyens de paiement la caisse accepte-t-elle ?",
        a: "Espèces, carte, virement, chèque, paiement direct par l'assurance et paiement Mobile Money intégré.",
      },
      {
        q: "Faut-il les deux packs pour facturer les assurances ?",
        a: "La prise en charge par l'assurance fait partie de la Gestion opérationnelle. La facturation, la caisse, les honoraires et la comptabilité font partie de la Gestion financière et comptable ; les deux packs se combinent.",
      },
    ],
    related: ["logiciel-gestion-clinique-cote-ivoire", "logiciel-cabinet-medical", "dossier-patient-informatise", "logiciel-centre-de-sante"],
    wiki: [
      { href: "/wiki/assurances", label: "Assurances et prise en charge : toutes les actions" },
      { href: "/wiki/argent#facturation", label: "Facturation : toutes les actions" },
    ],
  },

  /* ------------------------------------------------------------------ saisie hors connexion */
  // Source unique : décision de l'éditeur du 13 octobre 2026 (saisie hors ligne puis synchronisation, rien de plus) ; features.ts (agenda,
  // consultations). Ne pas écrire que toute l'application fonctionne sans Internet ni qu'on peut tout consulter hors ligne.
  {
    slug: "logiciel-clinique-hors-connexion",
    title: "Logiciel de clinique : saisie hors connexion",
    description: `Saisie hors ligne des consultations et paiements, puis synchronisation au retour du réseau. Clinique et cabinet. ${fromPrice}.`,
    eyebrow: "Hors connexion",
    h1: "Un logiciel de clinique qui accepte la saisie hors connexion",
    lead: "Une connexion peut se couper au mauvais moment. Avec CliniquePro, la saisie continue sans Internet, puis elle est synchronisée dès que le réseau revient.",
    sections: [
      {
        h2: "Ce qui continue sans connexion : la saisie",
        paragraphs: [
          "Sans connexion Internet, le personnel peut continuer à saisir, par exemple les consultations, les rendez-vous et les paiements. Ils n'ont pas à attendre le retour du réseau pour continuer à travailler.",
        ],
      },
      {
        h2: "Pour quelles situations ?",
        paragraphs: [
          "Une coupure de quelques minutes à l'accueil, une connexion instable dans le cabinet, une panne pendant la journée : dans ces situations, l'équipe n'est pas obligée d'arrêter de saisir. Elle continue, puis la synchronisation intervient au retour du réseau.",
        ],
        bullets: [
          "À l'accueil, un rendez-vous peut être saisi sans attendre le retour de la connexion.",
          "En consultation, le médecin peut saisir sa consultation.",
          "À la caisse, un paiement peut être enregistré.",
        ],
      },
      {
        h2: "La synchronisation au retour du réseau",
        paragraphs: [
          "Lorsque la connexion revient, ce qui a été saisi hors ligne est synchronisé avec le reste des données de la clinique.",
        ],
      },
      {
        h2: "Ce que CliniquePro ne promet pas",
        paragraphs: [
          "Nous préférons être précis. Le mode hors connexion de CliniquePro porte sur la saisie, suivie d'une synchronisation. Nous n'affirmons pas que toute l'application fonctionne sans Internet, ni que l'ensemble des données peut être consulté hors ligne. Si un cas précis est essentiel pour vous, demandez-le explicitement pendant la démonstration : mieux vaut le savoir avant de s'abonner. Le périmètre exact se présente sur vos cas d'usage.",
        ],
      },
      {
        h2: "Les questions à poser à tout éditeur de logiciel de clinique",
        paragraphs: ["Avant de choisir un logiciel, quel qu'il soit, posez ces questions sur le travail hors ligne. Elles s'appliquent à CliniquePro comme aux autres."],
        bullets: [
          "Quelles opérations peut-on saisir sans connexion, et lesquelles attendent le retour du réseau ?",
          "Que se passe-t-il si deux personnes modifient le même dossier pendant une coupure ?",
          "Comment sait-on qu'une saisie a bien été synchronisée ?",
          "Le mode hors ligne est-il présenté en démonstration, sur vos cas d'usage ?",
        ],
      },
      {
        h2: "Où ce mode se place dans le parcours",
        paragraphs: [
          "La saisie hors connexion concerne le travail quotidien : prendre les rendez-vous sur l'[agenda](/logiciel-rendez-vous-medicaux), enregistrer une consultation dans le [dossier patient](/dossier-patient-informatise), encaisser un paiement. Pour la suite du parcours, de l'assurance à la facture, voir [facturation et assurance](/facturation-assurance-clinique). Pour un cabinet, voir le [logiciel de cabinet médical](/logiciel-cabinet-medical) ; pour une clinique, le [logiciel de gestion de clinique à Abidjan](/logiciel-gestion-clinique-cote-ivoire).",
        ],
      },
      { h2: "Prix", price: "both" },
    ],
    faq: [
      {
        q: "CliniquePro fonctionne-t-il sans connexion Internet ?",
        a: "La saisie peut continuer sans connexion Internet, par exemple les consultations et les paiements : elle est ensuite synchronisée au retour du réseau. Le périmètre exact se présente lors de la démonstration.",
      },
      {
        q: "Quelles saisies peut-on faire hors connexion ?",
        a: "Par exemple les consultations, les rendez-vous et les paiements. La liste précise se montre pendant la démonstration, sur vos cas d'usage.",
      },
      {
        q: "Peut-on tout consulter hors ligne ?",
        a: "Nous n'affirmons pas que toutes les données peuvent être consultées hors ligne. Le mode hors connexion porte sur la saisie, suivie d'une synchronisation.",
      },
      {
        q: "Comment voir le mode hors connexion avant de s'abonner ?",
        a: "Demandez-le pendant la démonstration de 30 minutes : elle montre l'application appliquée à votre organisation, sans engagement.",
      },
    ],
    related: ["logiciel-rendez-vous-medicaux", "dossier-patient-informatise", "logiciel-gestion-clinique-cote-ivoire", "logiciel-cabinet-medical"],
    wiki: [{ href: "/wiki/clinique", label: "Clinique médicale : consultations, agenda, dossiers" }],
  },
];

export const intentPageBySlug = (slug: string) => intentPages.find((p) => p.slug === slug);

/** Page de détail d'un module de /fonctionnalites, quand elle existe (sinon le lien va au wiki). */
export const featureDetailPage: Record<string, IntentSlug> = {
  patients: "dossier-patient-informatise",
  agenda: "logiciel-rendez-vous-medicaux",
  consultations: "dossier-patient-informatise",
  dossier: "dossier-patient-informatise",
  examens: "logiciel-ophtalmologie",
  ordonnances: "dossier-patient-informatise",
  assurances: "facturation-assurance-clinique",
  facturation: "facturation-assurance-clinique",
  caisse: "facturation-assurance-clinique",
};

/** Pages d'intention à proposer depuis chaque domaine du wiki (maillage du wiki vers les pages de vente). */
export const wikiDomainPages: Record<string, IntentSlug[]> = {
  patients: ["dossier-patient-informatise"],
  reception: ["facturation-assurance-clinique", "logiciel-rendez-vous-medicaux"],
  clinique: ["logiciel-rendez-vous-medicaux", "dossier-patient-informatise", "logiciel-ophtalmologie"],
  assurances: ["facturation-assurance-clinique"],
  medecins: ["logiciel-cabinet-medical"],
  argent: ["facturation-assurance-clinique"],
  communication: ["logiciel-rendez-vous-medicaux"],
  pilotage: ["logiciel-centre-de-sante"],
  administration: ["logiciel-centre-de-sante"],
};
