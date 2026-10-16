// Guides éditoriaux (/guides). Même discipline que les pages d'intention : aucun concurrent nommé, aucun chiffre ni délai
// qui ne soit dans les sources du site, aucune étude de cas inventée, aucun conseil médical (il s'agit de gestion d'établissement).
// Auteur : « L'équipe CliniquePro — Alliance Consultants » (décision de l'éditeur du 13 octobre 2026).

import { fcfa } from "./format";
import { NOT_COVERED } from "./positionnement";
import { packs } from "./pricing";
import type { Section } from "./page-content";

export const GUIDE_AUTHOR = "L'équipe CliniquePro — Alliance Consultants";

export type Guide = {
  slug: string;
  /** Partie variable du titre (le gabarit ajoute « | CliniquePro ») */
  title: string;
  /** Titre complet affiché en H1 et dans le champ « headline » de l'Article */
  h1: string;
  description: string;
  /** Date de première publication (ISO) ; la date de modification vient de src/lib/dates.ts */
  published: string;
  lead: string;
  sections: Section[];
};

const [operationnel, financier] = packs;
const prix = (n: number) => `${fcfa(n)} HT par mois`;

export const guides: Guide[] = [
  {
    slug: "logiciel-clinique-saas-ou-sur-mesure",
    title: "Logiciel de clinique : SaaS ou sur mesure ?",
    h1: "Logiciel de clinique : prêt à l'emploi (SaaS) ou développement sur mesure ?",
    description: "Prêt à l'emploi (SaaS) ou développement sur mesure : les critères pour choisir un logiciel de clinique, et la place de CliniquePro.",
    published: "2026-10-16",
    lead: "Une clinique, un centre de santé ou un cabinet qui s'informatise a deux grandes voies : un logiciel déjà développé, que l'on loue par abonnement, ou un logiciel conçu sur mesure. Ce guide donne les critères pour décider, sans conseil médical : il s'agit de gestion d'établissement.",
    sections: [
      {
        h2: "Les deux options en bref",
        paragraphs: [
          "Un logiciel prêt à l'emploi (on dit aussi SaaS, pour logiciel en tant que service) est déjà développé et testé. Il s'utilise depuis un navigateur, sans installation, contre un abonnement mensuel. L'éditeur le maintient et le fait évoluer pour l'ensemble de ses clients.",
          "Un développement sur mesure est conçu pour une seule structure, à partir d'un cahier des charges. Il se pilote comme un projet : cadrage, devis, développement, recette, puis maintenance. Il peut coller exactement à votre organisation, mais il demande du temps de votre part et un budget de départ.",
        ],
      },
      {
        h2: "Six critères pour choisir",
        paragraphs: ["Quelle que soit l'option, comparez-la sur les mêmes points."],
        bullets: [
          "Le périmètre : le logiciel couvre-t-il le parcours complet (accueil, dossier, consultation, assurance, caisse, comptabilité) ou seulement une partie ?",
          "La mise en route : qui forme l'équipe, qui reprend les données existantes, et combien de temps votre équipe doit-elle y consacrer ?",
          "La maintenance et les évolutions : qui corrige les anomalies, qui fait évoluer l'outil, et à quel prix ?",
          "Les données : où sont-elles hébergées, qui les sauvegarde, et pouvez-vous les récupérer si vous changez d'outil ?",
          "Le coût : le prix est-il publié, mensuel et prévisible, ou dépend-il d'un devis et d'un projet ?",
          "L'engagement : que se passe-t-il si l'outil ne vous convient pas au bout de quelques semaines ?",
        ],
      },
      {
        h2: "Ce que comprend un logiciel prêt à l'emploi",
        paragraphs: [
          "Un logiciel prêt à l'emploi vous donne tout de suite un outil complet : vous le voyez fonctionner avant de vous abonner, vous partez d'une base éprouvée et vous bénéficiez des améliorations de l'éditeur. En contrepartie, vous adaptez votre organisation à l'outil dans une certaine mesure, et le logiciel vaut ce que valent ses réglages : une bonne solution doit se paramétrer, par exemple par spécialité, plutôt que d'imposer un seul modèle.",
        ],
      },
      {
        h2: "Comparer les coûts sans les mélanger",
        paragraphs: [
          "Un abonnement et un projet ne se comparent pas sur le premier mois, mais sur la durée. Un logiciel prêt à l'emploi a un coût récurrent et prévisible, qui comprend la maintenance et les évolutions. Un développement sur mesure a un coût de conception au départ, auquel s'ajoutent la maintenance et chaque évolution demandée ensuite. Posez la question dans les deux cas : que comprend le prix, et que faudra-t-il payer en plus ?",
        ],
      },
      {
        h2: "Quand le sur mesure se justifie",
        paragraphs: ["Le développement sur mesure est pertinent dans certains cas précis :"],
        bullets: [
          "votre processus est très particulier et aucun logiciel existant ne le couvre, même avec du paramétrage ;",
          "vous devez relier le logiciel à des systèmes que vous possédez déjà ;",
          "vous souhaitez être propriétaire du code et pouvez financer un projet puis sa maintenance ;",
          "vous disposez d'une personne pour piloter le projet de bout en bout.",
        ],
      },
      {
        h2: "La checklist à utiliser avec n'importe quel éditeur",
        bullets: [
          "Puis-je voir le logiciel fonctionner sur mes cas d'usage avant de m'engager ?",
          "Les prix sont-ils publics, hors taxes ou toutes taxes comprises, et par mois ?",
          "La formation de mon équipe et la reprise de mes données sont-elles incluses ?",
          "Y a-t-il un engagement de durée ?",
          "Comment joindre le support, et par quel canal ?",
          "Qui sauvegarde mes données, et à quelle fréquence ?",
          "Puis-je choisir l'hébergement, dans le cloud ou sur un serveur local ?",
          "Que ne couvre pas le logiciel ?",
        ],
      },
      {
        h2: "Comment tester avant de décider",
        paragraphs: [
          "Quelle que soit l'option, demandez à voir le logiciel sur votre quotidien plutôt que sur un scénario idéal. Préparez trois situations de votre journée : l'accueil d'un patient assuré, une consultation avec une prescription, un encaissement suivi de la fermeture de caisse. Si l'éditeur sait les dérouler devant vous, vous saurez vite si le périmètre convient.",
        ],
      },
      {
        h2: "Où se situe CliniquePro",
        paragraphs: [
          `CliniquePro est un logiciel prêt à l'emploi pour les cliniques privées, les centres de santé privés et les cabinets médicaux, toutes spécialités. Il est édité à Abidjan par Alliance Consultants. Voici ce qu'il apporte sur les critères ci-dessus.`,
        ],
        bullets: [
          `Un prix public : ${operationnel.name} à ${prix(operationnel.monthly)}, ${financier.name} à ${prix(financier.monthly)}, hors taxes, sans devis préalable.`,
          "Une mise en route accompagnée : la formation de l'équipe, l'import des données existantes et le support par WhatsApp sont inclus.",
          "Un abonnement sans engagement, avec le premier mois offert.",
          "Un hébergement au choix, dans le cloud ou sur un serveur local installé dans la clinique, avec une sauvegarde quotidienne assurée par Alliance Consultants.",
          "Un paramétrage par spécialité : les modèles de consultation s'adaptent à toutes les spécialités.",
        ],
      },
      {
        h2: "Les limites à connaître",
        paragraphs: [
          `CliniquePro ne couvre pas ${NOT_COVERED[0]}, ${NOT_COVERED[1]} ni ${NOT_COVERED[2]} : il couvre le parcours de la consultation à la comptabilité. Si votre besoin dépasse ce périmètre, ou s'il repose sur un processus que l'application ne sait pas paramétrer, la démonstration de 30 minutes permet de le vérifier honnêtement avant tout engagement.`,
        ],
      },
      {
        h2: "Pour aller plus loin",
        paragraphs: [
          "Pour voir comment ces critères se traduisent dans le produit, consultez le [logiciel de gestion de clinique en Côte d'Ivoire](/logiciel-gestion-clinique-cote-ivoire), le [logiciel de cabinet médical](/logiciel-cabinet-medical) et la page des [tarifs](/tarifs). Les questions fréquentes sont dans la [FAQ](/faq).",
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
export const guidePath = (slug: string) => `/guides/${slug}`;
