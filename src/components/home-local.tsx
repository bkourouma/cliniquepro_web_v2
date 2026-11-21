import { Eyebrow, Reveal } from "./ui";

// Section « Pourquoi CliniquePro à Abidjan » de l'accueil. Chaque point reprend positionnement.ts, faq.ts et features.ts :
// aucun opérateur Mobile Money n'est nommé (non publié), aucun client ni chiffre (aucune preuve publiable à ce jour).
const points = [
  {
    title: "Mobile Money à la caisse",
    text: "Le paiement Mobile Money est intégré à la caisse : il s'encaisse comme les espèces ou la carte, dans la même session de caisse et avec la même facture.",
  },
  {
    title: "Saisie hors ligne en cas de coupure réseau",
    text: "La saisie, par exemple les consultations et les paiements, peut continuer sans connexion Internet, puis elle est synchronisée au retour du réseau.",
  },
  {
    title: "Comptabilité SYSCOHADA",
    text: "Un plan de comptes SYSCOHADA et un journal en partie double alimenté par les encaissements, avec grand livre et balance.",
  },
  {
    title: "Hébergement des données à votre choix",
    text: "Dans le cloud ou sur un serveur local installé dans la clinique. Dans les deux cas, la sauvegarde quotidienne est assurée par Alliance Consultants.",
  },
];

export function HomeLocal() {
  return (
    <section id="pourquoi-abidjan" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Ancré en Côte d&apos;Ivoire</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-5xl">
            Pourquoi CliniquePro <span className="text-gradient-dark">à Abidjan</span>
          </h2>
          <p className="mt-5 text-lg text-ink-900/60">
            Un logiciel édité à Abidjan par Alliance Consultants, qui répond aux réalités d&apos;une clinique ivoirienne.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-[24px] border border-ink-900/[0.07] bg-paper p-7 shadow-sm">
                <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 text-ink-900/65">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
