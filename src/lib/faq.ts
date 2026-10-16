// Questions fréquentes. Réponses limitées à ce que l'application fait et aux décisions de l'éditeur (voir
// src/lib/positionnement.ts et docs/PROMPTS-CONTENU.md) ; ce qui n'y figure pas n'est pas affirmé. Le hors-périmètre
// (hospitalisation, laboratoire, pharmacie) est écrit noir sur blanc.

import { fcfa } from "@/lib/format";
import { COMBO_DISCOUNT, comboPrice, packs } from "@/lib/pricing";
import { AUDIENCE, DATA_LAW, NOT_COVERED, PUBLISHED_BY } from "@/lib/positionnement";
import type { FaqItem } from "@/lib/page-content";
import { contact, legal, SITE_URL } from "@/lib/site";

// Les prix viennent de pricing.ts : un changement de tarif se répercute ici sans retouche.
const [operationnel, financier] = packs;
const combo = comboPrice(packs);

export type FaqGroup = { title: string; items: { q: string; a: string }[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "Offre et tarifs",
    items: [
      {
        q: "Quels sont les packs CliniquePro ?",
        a: `Deux packs : la ${operationnel.name} (${fcfa(operationnel.monthly)} HT par mois) qui couvre le parcours patient, médical et assurance, et la ${financier.name} (${fcfa(financier.monthly)} HT par mois) qui couvre la facturation, la caisse, les honoraires médecins et la comptabilité.`,
      },
      {
        q: "Puis-je prendre les deux packs ?",
        a: `Oui. Les deux packs sont complémentaires : souscrits ensemble, vous bénéficiez de ${Math.round(COMBO_DISCOUNT * 100)} % de remise sur le moins cher des deux, soit ${fcfa(combo.total)} HT par mois au lieu de ${fcfa(combo.subtotal)}.`,
      },
      {
        q: "Y a-t-il une période d'essai ?",
        a: "Oui : le premier mois est offert sur tous les packs, sans engagement.",
      },
      {
        q: "Y a-t-il un engagement ?",
        a: "Non. L'abonnement est sans engagement. Les prix sont exprimés en FCFA, hors taxes, par mois ; seul le devis ou le contrat signé fait foi.",
      },
      {
        q: "Quel pack choisir pour démarrer ?",
        a: "Si votre priorité est d'organiser l'accueil, l'agenda, les consultations et les examens, commencez par la Gestion opérationnelle. Si votre priorité est de sécuriser la caisse, la facturation et la comptabilité, choisissez la Gestion financière et comptable. Une démonstration permet de valider le bon périmètre.",
      },
    ],
  },
  {
    title: "Structures et fonctionnalités",
    items: [
      {
        q: "Pour quels types de structures CliniquePro est-il conçu ?",
        a: `CliniquePro est conçu pour les ${AUDIENCE}, de toutes spécialités. Direction, médecins, accueil, caisse et comptabilité y travaillent dans une même application, chacun avec les droits de son métier.`,
      },
      {
        q: "CliniquePro convient-il à ma spécialité ?",
        a: "Oui. Les modèles de consultation sont paramétrables pour toutes les spécialités : vous créez vos spécialités et vos modèles dans l'application. L'ophtalmologie est la spécialité la plus détaillée, avec des examens intégrés.",
      },
      {
        q: "CliniquePro est-il adapté à l'ophtalmologie ?",
        a: "Oui. C'est la spécialité la plus détaillée : l'application intègre l'acuité visuelle, la pression intraoculaire, la réfraction, le fond d'œil, l'OCT, le champ visuel, la biométrie, les ordonnances de lunettes et des modèles de consultation spécialisés.",
      },
      {
        q: "Peut-on gérer plusieurs sites ou plusieurs cabinets ?",
        a: "Oui. Plusieurs sites ou cabinets peuvent être gérés sous un même compte.",
      },
      {
        q: "Comment sont gérées les assurances et les mutuelles ?",
        a: "Les assurances et mutuelles sont rattachées aux patients et aux dossiers de réception. La demande de prise en charge est envoyée à l'assurance, qui valide ou rejette prestation par prestation via un portail accessible par lien sécurisé. La facture distingue la part de l'assurance et la part du patient, et l'historique des décisions est conservé.",
      },
      {
        q: "Quels moyens de paiement la caisse accepte-t-elle ?",
        a: "Espèces, carte, virement, chèque, paiement direct par l'assurance et paiement Mobile Money intégré, avec gestion de la monnaie rendue, remboursements encadrés, fermeture de caisse et suivi des écarts.",
      },
      {
        q: "La comptabilité est-elle conforme au SYSCOHADA ?",
        a: "L'application intègre un plan de comptes SYSCOHADA simplifié et un journal en partie double immuable alimenté automatiquement par les encaissements, remboursements, écarts de caisse et honoraires, avec grand livre, balance et clôtures de période.",
      },
      {
        q: "Peut-on communiquer avec les patients par WhatsApp ?",
        a: "Oui, un module permet d'envoyer des messages WhatsApp depuis l'interface (confirmations, rappels, informations pratiques selon votre politique).",
      },
      {
        q: "CliniquePro propose-t-il des fonctions d'intelligence artificielle ?",
        a: "Oui, en option, avec trois fonctions : poser des questions en langage naturel sur vos données, extraire des informations d'un PDF de résultats vers les champs d'un examen, et obtenir une synthèse du dossier patient. Elles s'appuient sur un service d'intelligence artificielle tiers. Ce sont des aides : elles ne posent aucun diagnostic et la décision médicale reste celle du médecin. Vous choisissez de les utiliser ou non.",
      },
    ],
  },
  {
    title: "Données, sécurité et utilisation",
    items: [
      {
        q: "Qui peut voir quoi dans l'application ?",
        a: "Chaque utilisateur dispose d'un rôle et de permissions adaptés à son métier (direction, médecin, accueil, caisse, comptabilité, assurance, administrateur). Les actions importantes sont associées aux utilisateurs, aux dates et aux statuts dans un journal d'audit.",
      },
      {
        q: "CliniquePro fonctionne-t-il sans connexion Internet ?",
        a: "La saisie peut continuer sans connexion Internet, par exemple les consultations et les paiements : elle est ensuite synchronisée au retour du réseau. Le périmètre exact de ce mode hors ligne se présente lors de la démonstration.",
      },
      {
        q: "Où sont hébergées les données ?",
        a: "L'hébergement est au choix du client : dans le cloud, ou sur un serveur local installé dans la clinique. Dans les deux cas, la sauvegarde quotidienne est assurée par Alliance Consultants.",
      },
      {
        q: "Quelle loi encadre la protection des données personnelles ?",
        a: `CliniquePro respecte la ${DATA_LAW}.`,
      },
      {
        q: "Faut-il installer un logiciel ?",
        a: "Non. CliniquePro est une application web moderne, accessible depuis un navigateur.",
      },
      {
        q: "Puis-je l'utiliser sur tablette ou téléphone ?",
        a: "Oui, l'application s'utilise depuis un navigateur et son interface s'adapte aux petits écrans, avec un menu dédié sur mobile.",
      },
      {
        q: "Mes données sont-elles sauvegardées ?",
        a: "Oui. Alliance Consultants assure une sauvegarde quotidienne de vos données, que vous ayez choisi l'hébergement dans le cloud ou sur un serveur local installé dans la clinique.",
      },
      {
        q: "Puis-je récupérer mes données si je mets fin au contrat ?",
        a: "Oui. Vous pouvez récupérer vos données à la fin du contrat, sur simple demande. L'application permet déjà d'exporter le dossier d'un patient (JSON, XML ou CSV) et plusieurs états de caisse et de comptabilité (CSV, PDF).",
      },
    ],
  },
  {
    title: "Mise en route et support",
    items: [
      {
        q: "La formation de l'équipe est-elle incluse ?",
        a: "Oui, la formation de votre équipe est incluse.",
      },
      {
        q: "Peut-on reprendre les données que j'ai déjà ?",
        a: "Oui : l'import de vos données existantes fait partie de la mise en route. La démonstration permet de voir avec vous comment reprendre vos fichiers actuels.",
      },
      {
        q: "Comment joindre le support ?",
        a: `Par WhatsApp, au ${contact.phone}. Vous pouvez aussi nous écrire à ${contact.email}.`,
      },
      {
        q: "Comment obtenir une démonstration ?",
        a: "Utilisez le bouton « Demander une démo » : un échange de 30 minutes permet de voir l'application appliquée à votre organisation, sans engagement.",
      },
    ],
  },
  {
    title: "Périmètre et éditeur",
    items: [
      {
        q: "Que ne fait pas CliniquePro ?",
        a: `CliniquePro ne couvre pas ${NOT_COVERED[0]} (lits, séjours), ${NOT_COVERED[1]} (analyses) ni ${NOT_COVERED[2]} (gestion d'une officine). Il gère le parcours de la consultation à la comptabilité ; le catalogue de médicaments sert à rédiger les ordonnances, pas à gérer une pharmacie.`,
      },
      {
        q: "Qui édite CliniquePro ?",
        a: `${PUBLISHED_BY}. Pour ne pas le confondre avec des logiciels de nom proche ou identique, retenez l'éditeur (${legal.publisher}, RCCM ${legal.rccm}) et l'adresse du site : ${SITE_URL.replace("https://", "")}.`,
      },
    ],
  },
];

// Questions sur les prix, affichées en bas de /tarifs (avec le balisage FAQPage). Les montants viennent de pricing.ts.
export const pricingFaq: FaqItem[] = [
  {
    q: "Combien coûte CliniquePro ?",
    a: `Deux packs, à l'abonnement mensuel : la ${operationnel.name} à ${fcfa(operationnel.monthly)} HT par mois et la ${financier.name} à ${fcfa(financier.monthly)} HT par mois. Souscrits ensemble, ils coûtent ${fcfa(combo.total)} HT par mois au lieu de ${fcfa(combo.subtotal)}.`,
  },
  {
    q: "Les prix sont-ils hors taxes ?",
    a: "Oui. Tous les prix sont en FCFA, hors taxes, par mois. Aucun prix toutes taxes comprises n'est publié : seul le devis ou le contrat signé fait foi.",
  },
  {
    q: "Qu'est-ce qui est inclus dans l'abonnement ?",
    a: "La formation de votre équipe, l'import de vos données existantes et le support par WhatsApp sont inclus, ainsi que la sauvegarde quotidienne de vos données, assurée par Alliance Consultants, que vous choisissiez le cloud ou un serveur local.",
  },
  {
    q: "Y a-t-il un engagement ou un essai gratuit ?",
    a: "L'abonnement est sans engagement, et le premier mois est offert sur tous les packs.",
  },
  {
    q: "Quel pack choisir pour un cabinet avec un seul médecin ?",
    a: `La ${operationnel.name} (${fcfa(operationnel.monthly)} HT par mois) couvre l'agenda, le dossier patient, la consultation, les ordonnances et la prise en charge par l'assurance. Ajoutez la ${financier.name} si vous voulez aussi gérer la facturation, la caisse, les honoraires et la comptabilité.`,
  },
  {
    q: "Faut-il demander un devis pour connaître les prix ?",
    a: "Non, les prix sont publics. La démonstration de 30 minutes permet de valider le périmètre adapté à votre structure, sans engagement.",
  },
];
