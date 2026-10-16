// Adresses et libellés courts des pages « d'intention » (profils, fonctions, page locale) et du guide.
// Fichier volontairement léger : le menu et le pied de page (composants client) l'importent. Les textes complets
// des pages vivent dans intent-pages.ts et guides.ts, qui ne doivent pas partir dans le JavaScript du navigateur.

export type IntentSlug =
  | "logiciel-gestion-clinique-cote-ivoire"
  | "logiciel-cabinet-medical"
  | "logiciel-centre-de-sante"
  | "logiciel-ophtalmologie"
  | "logiciel-rendez-vous-medicaux"
  | "dossier-patient-informatise"
  | "facturation-assurance-clinique"
  | "logiciel-clinique-hors-connexion";

export type IntentRoute = {
  slug: IntentSlug;
  path: string;
  /** Libellé du menu et du pied de page */
  label: string;
  /** Une ligne sous le libellé dans le menu et sur les cartes */
  text: string;
  group: "solution" | "fonction";
};

const route = (slug: IntentSlug, label: string, text: string, group: IntentRoute["group"]): IntentRoute => ({ slug, path: `/${slug}`, label, text, group });

export const intentRoutes: IntentRoute[] = [
  route("logiciel-gestion-clinique-cote-ivoire", "Clinique en Côte d'Ivoire", "Édité à Abidjan, prix publics en FCFA", "solution"),
  route("logiciel-cabinet-medical", "Cabinet médical", "Agenda, dossier, caisse et assurance", "solution"),
  route("logiciel-centre-de-sante", "Centre de santé privé", "Patients, constantes, consultations, caisse", "solution"),
  route("logiciel-ophtalmologie", "Ophtalmologie", "Acuité, PIO, réfraction, OCT, lunettes", "solution"),
  route("logiciel-rendez-vous-medicaux", "Rendez-vous médicaux", "Agenda par médecin, rappels WhatsApp", "fonction"),
  route("dossier-patient-informatise", "Dossier patient", "Un dossier unique, accès par rôle", "fonction"),
  route("facturation-assurance-clinique", "Facturation et assurance", "Part patient, part assurance, tiers payant", "fonction"),
  route("logiciel-clinique-hors-connexion", "Saisie hors connexion", "Saisie hors ligne puis synchronisation", "fonction"),
];

export const intentRoute = (slug: IntentSlug) => intentRoutes.find((r) => r.slug === slug)!;

export const solutionRoutes = intentRoutes.filter((r) => r.group === "solution");
export const functionRoutes = intentRoutes.filter((r) => r.group === "fonction");

export const GUIDES_PATH = "/guides";
