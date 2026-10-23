import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

// Vérifications sur le source des composants (pas de moteur de rendu dans ce dépôt, aucune dépendance de test ajoutée).
const read = (rel: string) => readFileSync(new URL(`../../${rel}`, import.meta.url), "utf8");

describe("bandeau de consentement", () => {
  const src = read("src/components/consent/cookie-consent.tsx");

  it("propose Accepter et Refuser avec exactement le même style", () => {
    assert.match(src, /onClick=\{\(\) => choose\("refused"\)\}/);
    assert.match(src, /onClick=\{\(\) => choose\("accepted"\)\}/);
    const shared = [...src.matchAll(/className=\{BTN\}/g)];
    assert.equal(shared.length, 3, "Fermer, Refuser et Accepter partagent BTN");
  });
  it("gère Échap, « Fermer » à la réouverture et le retour du focus", () => {
    assert.match(src, /e\.key === "Escape"/);
    assert.match(src, /reopened && consent !== "unset"/);
    assert.match(src, /Fermer/);
    assert.match(src, /target\.focus\(\)/);
  });
  it("ne s'affiche pas avant l'hydratation et renvoie vers la politique", () => {
    assert.match(src, /consent === "loading"/);
    assert.match(src, /href="\/confidentialite#cookies"/);
  });
  it("est monté dans le layout racine avec la balise GA, à côté d'Umami", () => {
    const layout = read("src/app/layout.tsx");
    assert.match(layout, /<Analytics \/>/);
    assert.match(layout, /<GoogleAnalytics \/>/);
    assert.match(layout, /<CookieConsent \/>/);
  });
});

describe("pied de page", () => {
  it("contient le bouton « Gérer mes cookies »", () => {
    const footer = read("src/components/final-cta.tsx");
    assert.match(footer, /<ManageCookiesButton/);
    const btn = read("src/components/consent/manage-cookies-button.tsx");
    assert.match(btn, /Gérer mes cookies/);
    assert.match(btn, /onClick=\{openConsentPanel\}/);
    assert.match(btn, /type="button"/);
  });
});

describe("politique de confidentialité", () => {
  const page = read("src/app/confidentialite/page.tsx").replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  it("décrit GA4 : éditeur, consentement, cookies, durée de 13 mois, retrait", () => {
    assert.match(page, /Google Analytics 4/);
    assert.match(page, /Google Ireland Limited/);
    assert.match(page, /qu'avec votre consentement/);
    assert.match(page, /_ga<\/strong> et <strong>_ga_<identifiant>/);
    assert.match(page, /13 mois au plus/);
    assert.match(page, /Gérer mes cookies/);
  });
  it("cite Google Analytics parmi les destinataires, avec consentement", () => {
    const d = page.slice(page.indexOf("Destinataires et sous-traitants"), page.indexOf("Durée de conservation"));
    assert.match(d, /Google Ireland Limited \(Google Analytics 4\)/);
    assert.match(d, /Si vous acceptez/);
  });
  it("garde Umami sans cookie et ne dit plus qu'aucun service tiers n'est utilisé", () => {
    assert.match(page, /Umami/);
    assert.match(page, /sans cookie/);
    assert.doesNotMatch(page, /sans envoyer de données à un service de mesure d'audience tiers/);
  });
  it("reste dans le cadre ivoirien, sans RGPD, sans durée de conservation Google, sans l'application", () => {
    assert.match(page, /loi ivoirienne n° 2013-450 du 19 juin 2013/);
    assert.doesNotMatch(page, /RGPD|GDPR/);
    assert.doesNotMatch(page, /cliniquepro\.allianceconsultants\.net/);
    assert.doesNotMatch(page, /26 mois|14 mois|2 mois/);
  });
  it("renvoie vers la mention du calendrier de réservation et expose l'ancre #cookies", () => {
    assert.match(page, /id="cookies"/);
    assert.match(page, /calendrier de réservation/);
  });
  it("affiche la date de mise à jour du jour de la modification", () => {
    assert.match(page, /updated="23 octobre 2026"/);
    assert.match(read("src/lib/dates.ts"), /"\/confidentialite": "2026-10-23"/);
  });
});
