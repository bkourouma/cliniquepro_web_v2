import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { fromPrice } from "@/lib/page-content";
import { functionRoutes, intentRoute } from "@/lib/intent-routes";
import { Eyebrow, Reveal } from "./ui";

// Cartes « Pour qui ? » de l'accueil : le texte vient de l'accueil, les adresses de intent-routes.ts.
const cards = [
  {
    slug: "logiciel-gestion-clinique-cote-ivoire" as const,
    title: "Clinique privée",
    text: "Du dossier patient à la comptabilité SYSCOHADA, avec l'assurance, la caisse et les honoraires des médecins dans un seul outil.",
  },
  {
    slug: "logiciel-centre-de-sante" as const,
    title: "Centre de santé privé",
    text: "L'accueil, les infirmiers, les médecins, la caisse et la direction travaillent sur le même dossier, chacun avec les droits de son métier.",
  },
  {
    slug: "logiciel-cabinet-medical" as const,
    title: "Cabinet médical",
    text: "Un agenda qui tient, un dossier retrouvé en quelques secondes, des ordonnances propres et une caisse juste, avec la Gestion opérationnelle seule.",
  },
];

export function HomeSolutions() {
  const oph = intentRoute("logiciel-ophtalmologie");
  const local = intentRoute("logiciel-gestion-clinique-cote-ivoire");
  return (
    <section id="pour-qui" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Pour qui ?</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-5xl">
            Pour votre clinique, votre centre de santé ou <span className="text-gradient-dark">votre cabinet.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-900/60">Toutes spécialités. Les modèles de consultation se paramètrent ; l&apos;ophtalmologie est la spécialité la plus détaillée.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => {
            const r = intentRoute(c.slug);
            return (
              <Reveal key={c.slug} delay={i * 0.07} className="h-full">
                <Link href={r.path} className="group flex h-full flex-col rounded-[24px] border border-ink-900/[0.07] bg-white p-7 shadow-sm transition-shadow hover:shadow-xl">
                  <h3 className="font-display text-2xl font-bold">{c.title}</h3>
                  <p className="mt-3 flex-1 text-ink-900/65">{c.text}</p>
                  <span className="mt-5 flex items-center justify-between text-sm font-semibold text-brand-600">
                    {r.label}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-ink-900/70">
          Votre spécialité est l&apos;ophtalmologie ? Voir le{" "}
          <Link href={oph.path} className="font-semibold text-brand-600 hover:underline">
            logiciel d&apos;ophtalmologie
          </Link>
          . Vous cherchez une fonction précise ?{" "}
          {functionRoutes.map((r, i) => (
            <span key={r.slug}>
              {i > 0 && (i === functionRoutes.length - 1 ? " ou " : ", ")}
              <Link href={r.path} className="font-semibold text-brand-600 hover:underline">
                {r.label.toLowerCase()}
              </Link>
            </span>
          ))}
          .
        </p>

        <Reveal className="mx-auto mt-12 max-w-3xl rounded-[24px] bg-ink-950 p-7 text-white md:p-9">
          <h3 className="font-display text-2xl font-bold">Édité à Abidjan, pour la Côte d&apos;Ivoire</h3>
          <p className="mt-3 text-white/70">
            CliniquePro est édité par Alliance Consultants, à Abidjan. Les prix sont publics, en FCFA et hors taxes ({fromPrice.replace("Dès", "dès")}), le premier mois est offert et l&apos;abonnement est sans engagement.
          </p>
          <Link href={local.path} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mint-400 hover:underline">
            Le logiciel de gestion de clinique en Côte d&apos;Ivoire <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
