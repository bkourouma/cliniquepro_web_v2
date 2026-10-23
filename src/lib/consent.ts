// Consentement aux cookies de mesure d'audience (Google Analytics 4).
// Le choix est mémorisé dans le navigateur du visiteur (localStorage, clé « cp_consent »), 6 mois. Ce stockage est
// strictement nécessaire : il ne sert qu'à se souvenir du choix, il n'est jamais transmis ni exploité à d'autres fins.
// Ce fichier n'importe rien : il est testable tel quel.

export const CONSENT_KEY = "cp_consent";
/** Durée de validité du choix : 6 mois (182 jours). */
export const CONSENT_TTL_MS = 182 * 24 * 60 * 60 * 1000;
/** Évènement émis à chaque changement de choix. */
export const CONSENT_EVENT = "cp-consent-change";
/** Évènement demandant la réouverture du bandeau (bouton « Gérer mes cookies »). */
export const OPEN_CONSENT_EVENT = "cp-consent-open";

export type ConsentChoice = "accepted" | "refused";
export type ConsentState = ConsentChoice | "unset";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** Lit le choix mémorisé. « unset » si absent, illisible, invalide ou plus vieux que 6 mois. */
export function readConsent(storage: StorageLike | null, now: number = Date.now()): ConsentState {
  if (!storage) return "unset";
  try {
    const raw = storage.getItem(CONSENT_KEY);
    if (!raw) return "unset";
    const data = JSON.parse(raw) as { choice?: unknown; at?: unknown } | null;
    if (!data || (data.choice !== "accepted" && data.choice !== "refused")) return "unset";
    if (typeof data.at !== "number" || !Number.isFinite(data.at)) return "unset";
    const age = now - data.at;
    if (age < 0 || age >= CONSENT_TTL_MS) return "unset";
    return data.choice;
  } catch {
    return "unset";
  }
}

export function writeConsent(storage: StorageLike | null, choice: ConsentChoice, now: number = Date.now()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: now }));
    return true;
  } catch {
    /* stockage indisponible (navigation privée, blocage) : le choix vaut pour la page en cours seulement */
    return false;
  }
}

/** Noms des cookies Google Analytics : _ga, _ga_<ID>, _gid, _gat*. */
export function isGoogleAnalyticsCookie(name: string): boolean {
  return name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat");
}

/** Domaines sur lesquels tenter l'effacement d'un cookie posé par gtag.js (hôte courant et domaines parents). */
export function cookieDomains(hostname: string): string[] {
  const parts = hostname.split(".");
  const out: string[] = [];
  for (let i = 0; i <= parts.length - 2; i++) out.push(parts.slice(i).join("."));
  return out;
}

export function clearGoogleAnalyticsCookies(doc: Pick<Document, "cookie">, hostname: string): void {
  const names = doc.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n && isGoogleAnalyticsCookie(n));
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/";
  for (const name of names) {
    doc.cookie = `${name}=; ${expired}`;
    for (const d of cookieDomains(hostname)) {
      doc.cookie = `${name}=; ${expired}; domain=${d}`;
      doc.cookie = `${name}=; ${expired}; domain=.${d}`;
    }
  }
}

/** Nom du drapeau officiel qui désactive gtag.js pour un identifiant de mesure. */
export function disableFlagName(measurementId: string): string {
  return `ga-disable-${measurementId}`;
}

/**
 * Effets d'un choix sur la page en cours : drapeau ga-disable (vrai si refus) et, en cas de refus,
 * effacement des cookies Google Analytics déjà posés.
 */
export function applyConsentEffects(
  win: Record<string, unknown>,
  doc: Pick<Document, "cookie">,
  hostname: string,
  measurementId: string,
  choice: ConsentChoice,
): void {
  win[disableFlagName(measurementId)] = choice === "refused";
  if (choice === "refused") clearGoogleAnalyticsCookies(doc, hostname);
}

/** Domaine où la balise est autorisée (comme Umami) : le vrai site, ni le développement ni un aperçu. */
export const ANALYTICS_HOSTS = ["cliniquepro-web.allianceconsultants.net"];

export function shouldLoadAnalytics(opts: {
  nodeEnv: string | undefined;
  hostname: string;
  consent: ConsentState | "loading";
}): boolean {
  return opts.nodeEnv === "production" && ANALYTICS_HOSTS.includes(opts.hostname) && opts.consent === "accepted";
}
