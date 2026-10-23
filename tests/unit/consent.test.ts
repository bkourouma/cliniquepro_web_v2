import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

// Imports dynamiques : node exécute les .ts tels quels et tsc reste satisfait (pas d'extension .ts dans le code du site).
const load = (rel: string) => import(new URL(`../../${rel}`, import.meta.url).href);
const read = (rel: string) => readFileSync(new URL(`../../${rel}`, import.meta.url), "utf8");
const consent = await load("src/lib/consent.ts");
const ga = await load("src/lib/ga.ts");

function memoryStorage(initial: Record<string, string> = {}) {
  const data: Record<string, string> = { ...initial };
  return {
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
    removeItem: (k: string) => {
      delete data[k];
    },
    data,
  };
}

describe("consentement : états et durée de validité", () => {
  const t0 = Date.UTC(2026, 9, 23);

  it("vaut « unset » sans choix mémorisé ou sans stockage", () => {
    assert.equal(consent.readConsent(memoryStorage(), t0), "unset");
    assert.equal(consent.readConsent(null, t0), "unset");
  });

  it("mémorise « accepted » et « refused » sous une seule clé", () => {
    const s = memoryStorage();
    consent.writeConsent(s, "accepted", t0);
    assert.equal(consent.readConsent(s, t0 + 1000), "accepted");
    consent.writeConsent(s, "refused", t0);
    assert.equal(consent.readConsent(s, t0 + 1000), "refused");
    assert.deepEqual(Object.keys(s.data), [consent.CONSENT_KEY]);
  });

  it("expire après 182 jours (retour à « unset »)", () => {
    const s = memoryStorage();
    consent.writeConsent(s, "accepted", t0);
    assert.equal(consent.CONSENT_TTL_MS, 182 * 24 * 3600 * 1000);
    assert.equal(consent.readConsent(s, t0 + consent.CONSENT_TTL_MS - 1), "accepted");
    assert.equal(consent.readConsent(s, t0 + consent.CONSENT_TTL_MS), "unset");
  });

  it("ignore une valeur corrompue, invalide ou datée du futur", () => {
    const raws = ["pas du json", "null", '{"choice":"maybe","at":1}', '{"choice":"accepted"}', JSON.stringify({ choice: "accepted", at: t0 + 5000 })];
    for (const raw of raws) {
      assert.equal(consent.readConsent(memoryStorage({ [consent.CONSENT_KEY]: raw }), t0), "unset", raw);
    }
  });

  it("écrire échoue sans casser quand le stockage est bloqué", () => {
    const blocked = {
      getItem: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new Error("quota");
      },
    };
    assert.equal(consent.writeConsent(blocked, "accepted", t0), false);
    assert.equal(consent.writeConsent(null, "accepted", t0), false);
  });
});

describe("balise Google Analytics : conditions de chargement", () => {
  const host = "cliniquepro-web.allianceconsultants.net";
  const ok = { nodeEnv: "production", hostname: host, consent: "accepted" };

  it("ne charge que si production + bon domaine + accepté", () => {
    assert.equal(consent.shouldLoadAnalytics(ok), true);
  });
  it("ne charge jamais sans accord", () => {
    for (const c of ["unset", "refused", "loading"]) assert.equal(consent.shouldLoadAnalytics({ ...ok, consent: c }), false, c);
  });
  it("ne charge pas en développement ni en test", () => {
    for (const env of ["development", "test", undefined]) assert.equal(consent.shouldLoadAnalytics({ ...ok, nodeEnv: env }), false);
  });
  it("ne charge pas hors du bon domaine (local, application, aperçu, autre site)", () => {
    for (const h of ["localhost", "", "cliniquepro.allianceconsultants.net", "allianceconsultants.net", `preview.${host}`, "evil.example"]) {
      assert.equal(consent.shouldLoadAnalytics({ ...ok, hostname: h }), false, h);
    }
  });
});

describe("configuration gtag", () => {
  it("identifiant de mesure avec le chiffre zéro, sans lettre O", () => {
    assert.equal(ga.GA_MEASUREMENT_ID, "G-T7NBZ6WY80");
    assert.ok(!/O/.test(ga.GA_MEASUREMENT_ID));
  });
  it("cookie_expires = 34128000 et signaux publicitaires désactivés", () => {
    assert.equal(ga.GA_CONFIG.cookie_expires, 34128000);
    assert.equal(ga.GA_CONFIG.allow_google_signals, false);
    assert.equal(ga.GA_CONFIG.allow_ad_personalization_signals, false);
    const script: string = ga.buildGtagInitScript();
    assert.match(script, /"cookie_expires":34128000/);
    assert.match(script, /"allow_google_signals":false/);
    assert.match(script, /"allow_ad_personalization_signals":false/);
    assert.match(script, /gtag\('config', 'G-T7NBZ6WY80'/);
    assert.equal(ga.GA_SCRIPT_SRC, "https://www.googletagmanager.com/gtag/js?id=G-T7NBZ6WY80");
  });
  it("le composant n'appelle Google que via shouldLoadAnalytics", () => {
    const src = read("src/components/consent/google-analytics.tsx");
    assert.match(src, /if \(!shouldLoadAnalytics\(/);
    assert.match(src, /process\.env\.NODE_ENV/);
    // aucune URL Google écrite en dur dans le composant : la balise vient de ga.ts
    assert.doesNotMatch(src, /googletagmanager/);
  });
});

describe("retrait du consentement", () => {
  it("reconnaît les cookies Google Analytics et eux seuls", () => {
    for (const n of ["_ga", "_ga_T7NBZ6WY80", "_gid", "_gat", "_gat_gtag_G_T7NBZ6WY80"]) assert.equal(consent.isGoogleAnalyticsCookie(n), true, n);
    for (const n of ["cp_consent", "ga", "_gax", "session"]) assert.equal(consent.isGoogleAnalyticsCookie(n), false, n);
  });

  it("liste l'hôte et ses domaines parents", () => {
    assert.deepEqual(consent.cookieDomains("cliniquepro-web.allianceconsultants.net"), [
      "cliniquepro-web.allianceconsultants.net",
      "allianceconsultants.net",
    ]);
  });

  it("refus : drapeau ga-disable à vrai et cookies _ga*, _gid, _gat* expirés", () => {
    const writes: string[] = [];
    const doc = {
      get cookie() {
        return "_ga=GA1.1.1; _ga_T7NBZ6WY80=GS1; _gid=x; _gat_gtag=1; autre=1";
      },
      set cookie(v: string) {
        writes.push(v);
      },
    };
    const win: Record<string, unknown> = {};
    consent.applyConsentEffects(win, doc, "cliniquepro-web.allianceconsultants.net", ga.GA_MEASUREMENT_ID, "refused");
    assert.equal(win["ga-disable-G-T7NBZ6WY80"], true);
    for (const n of ["_ga", "_ga_T7NBZ6WY80", "_gid", "_gat_gtag"]) {
      assert.ok(writes.some((w) => w.startsWith(`${n}=;`) && w.includes("max-age=0")), n);
    }
    assert.ok(writes.some((w) => w.includes("domain=.allianceconsultants.net")));
    assert.ok(!writes.some((w) => w.startsWith("autre=")));
  });

  it("acceptation : drapeau à faux, aucun cookie touché", () => {
    const writes: string[] = [];
    const doc = {
      get cookie() {
        return "_ga=1";
      },
      set cookie(v: string) {
        writes.push(v);
      },
    };
    const win: Record<string, unknown> = {};
    consent.applyConsentEffects(win, doc, "cliniquepro-web.allianceconsultants.net", ga.GA_MEASUREMENT_ID, "accepted");
    assert.equal(win["ga-disable-G-T7NBZ6WY80"], false);
    assert.deepEqual(writes, []);
  });
});
