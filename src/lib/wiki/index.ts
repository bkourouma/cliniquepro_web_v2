// Wiki des fonctionnalités (/wiki) : une page par domaine, toutes les actions de l'application.
// Les données sont générées par `python scripts/build-wiki.py` à partir de l'inventaire Excel
// (docs/sources/OphtaClinic_Wiki_Fonctionnalites.xlsx) : ne pas modifier wiki.generated.json à la main.

import raw from "./wiki.generated.json";
import type { ModuleScope } from "../features";

export type WikiItem = { title: string; goal: string; status: "disponible" | "developpement"; profiles?: string[]; menu?: string };
export type WikiFeature = { title: string; items: WikiItem[] };
export type WikiModule = { slug: string; title: string; pack: ModuleScope; features: WikiFeature[] };
export type WikiDomain = { slug: string; title: string; summary: string; pack: ModuleScope; modules: WikiModule[] };

export const WIKI_UPDATED_ON: string = raw.updatedOn;
const FR_MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 2 octobre 2026 » → « 2026-10-02 » (données structurées et sitemap) */
function frenchDateToIso(text: string) {
  const m = text.trim().toLowerCase().match(/^(\d{1,2})(?:er)? (\S+) (\d{4})$/);
  const month = m ? FR_MONTHS.indexOf(m[2]) : -1;
  return m && month >= 0 ? `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}` : undefined;
}
export const WIKI_UPDATED_ISO = frenchDateToIso(WIKI_UPDATED_ON);

export const wikiDomains = raw.domains as WikiDomain[];

export const domainBySlug = (slug: string) => wikiDomains.find((d) => d.slug === slug);

export const countItems = (d: WikiDomain) => d.modules.reduce((n, m) => n + m.features.reduce((k, f) => k + f.items.length, 0), 0);
export const wikiTotal = wikiDomains.reduce((n, d) => n + countItems(d), 0);

export type SearchEntry = { d: string; dt: string; m: string; f: string; g: string };

/** Index de recherche aplati (envoyé au navigateur seulement sur /wiki). */
export const searchIndex: SearchEntry[] = wikiDomains.flatMap((d) =>
  d.modules.flatMap((m) => m.features.flatMap((f) => f.items.map((i) => ({ d: d.slug, dt: d.title, m: m.title, f: f.title, g: i.goal })))),
);

/**
 * Habillage éditorial des domaines (hors du JSON généré, qu'on ne modifie pas à la main) :
 * titre de référencement (≤ 47 caractères avant le suffixe « | CliniquePro »), introduction rédigée uniquement avec des
 * faits des sources du wiki, et modules de /fonctionnalites qui y renvoient (maillage entre le wiki et les pages de vente).
 */
export type DomainEditorial = { seoTitle: string; intro: string; more?: string[]; featureIds: string[] };

export const domainEditorial: Record<string, DomainEditorial> = {
  patients: {
    seoTitle: "Dossier patient du logiciel de clinique",
    intro:
      "Chaque patient a un dossier administratif unique dans CliniquePro : identité, contacts, assurances rattachées et historique. Cette page détaille la recherche et la liste filtrée, le détail du patient, la détection des doublons avant création, la modification et l'archivage.",
    more: [
      "La recherche porte sur le nom, le prénom, le numéro et le téléphone, avec des filtres par sexe, statut, régime, année de naissance et ville. Avant toute création, une alerte signale les patients potentiellement similaires et demande une confirmation. L'archivage est une suppression logique : la raison est obligatoire, l'action est tracée dans l'audit, et le patient disparaît de la liste standard sans être détruit.",
    ],
    featureIds: ["patients"],
  },
  reception: {
    seoTitle: "Réception et accueil patient en clinique",
    intro:
      "La réception structure l'arrivée du patient : ouverture du dossier d'accueil avec les prestations, le médecin assigné et l'assurance (ou le paiement direct), puis envoi de la demande de prise en charge à l'assureur par e-mail avec un lien de validation.",
    featureIds: ["reception"],
  },
  clinique: {
    seoTitle: "Consultations et examens du logiciel clinique",
    intro:
      "Le cœur médical de CliniquePro : consultations, modèles de consultation par spécialité, examens et bulletins d'examens, dossiers médicaux, constantes, ordonnances (dont les ordonnances de lunettes en ophtalmologie), certificats, médicaments et agenda des rendez-vous avec rappels WhatsApp.",
    featureIds: ["agenda", "consultations", "dossier", "examens", "ordonnances"],
  },
  assurances: {
    seoTitle: "Assurances et prise en charge en clinique",
    intro:
      "Le catalogue des assurances et mutuelles, rattaché aux patients, et le portail assureur : chaque prestation est approuvée ou rejetée avec justification par l'assureur, depuis un lien sécurisé, et chaque décision reste historisée.",
    featureIds: ["assurances"],
  },
  medecins: {
    seoTitle: "Médecins et spécialités du logiciel clinique",
    intro:
      "Le référentiel des médecins (identité, licence, honoraires, photo et signature, planning hebdomadaire) et les spécialités de consultation. Les spécialités et leurs modèles de consultation se créent dans l'application : c'est ce qui rend CliniquePro paramétrable pour toutes les spécialités.",
    featureIds: ["consultations", "admin"],
  },
  argent: {
    seoTitle: "Facturation, caisse et comptabilité clinique",
    intro:
      "Prestations et tarifs, facturation avec la part du patient et la part de l'assurance, sessions de caisse et encaissements multi-moyens (dont le Mobile Money), honoraires des médecins et comptabilité SYSCOHADA avec ses contrôles d'audit.",
    featureIds: ["facturation", "caisse", "honoraires", "comptabilite"],
  },
  documents: {
    seoTitle: "Documents et impressions de clinique",
    intro:
      "Le centre d'impression remet au guichet les ordonnances, listes d'examens, bulletins et certificats médicaux, avec papier à en-tête, gabarits et aperçu des documents.",
    featureIds: ["ordonnances"],
  },
  communication: {
    seoTitle: "Communication patient par WhatsApp",
    intro:
      "La messagerie WhatsApp de CliniquePro permet à l'administrateur et à la secrétaire d'envoyer des messages manuels aux patients et aux médecins, depuis l'application.",
    more: [
      "On recherche d'abord les contacts disposant d'un numéro, on filtre par Tous, Patients ou Médecins, puis on compose la sélection de destinataires (sélection ou désélection individuelle ou groupée, retrait d'un destinataire, sélection vidée en un geste). Le message est un texte libre limité à 2 000 caractères, avec compteur. Chaque message réellement envoyé est journalisé, et la carte « Dernier résultat » indique combien de messages sont partis, combien non, avec le motif pour chaque destinataire. Un rapport d'envoi exportable par destinataire est en cours de développement.",
      "Les rappels de rendez-vous par WhatsApp (envoi automatique et récapitulatif quotidien au médecin à heure fixe, par cabinet) sont décrits avec l'agenda, dans le domaine Clinique médicale.",
    ],
    featureIds: ["whatsapp"],
  },
  pilotage: {
    seoTitle: "Pilotage et analyse de l'activité de clinique",
    intro:
      "Les tableaux de bord par rôle, les statistiques propriétaire et l'assistant analytique pour interroger les données en langage naturel. Chaque rôle (direction, médecin, secrétaire, caissier, comptabilité…) voit ses propres indicateurs.",
    featureIds: ["pilotage"],
  },
  administration: {
    seoTitle: "Administration du logiciel de clinique",
    intro:
      "L'administrateur gère ici les utilisateurs de la clinique, consulte le journal d'audit et règle la configuration. Ce domaine porte la sécurité des accès : chaque compte a un rôle, et les actions sensibles laissent une trace.",
    more: [
      "Côté utilisateurs : liste avec filtres par rôle et recherche, création d'un compte, modification (nom, e-mail, rôle, compte actif), réinitialisation d'un mot de passe qui débloque le compte, et désactivation logique qui retire l'accès sans supprimer le compte. Côté audit : liste paginée de « qui a fait quoi », filtres par type d'entité, action et utilisateur, et panneau de détail pour lire les modifications enregistrées. Les paramètres de conservation des données, la purge de l'audit ancien et la gestion des sessions utilisateurs sont signalés « en cours de développement ».",
    ],
    featureIds: ["admin"],
  },
};
