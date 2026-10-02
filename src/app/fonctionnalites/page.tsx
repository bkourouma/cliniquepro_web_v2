import type { Metadata } from "next";
import { Check } from "lucide-react";
import { DemoButton } from "@/components/demo-button";
import { FinalCta } from "@/components/final-cta";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { features, scopeLabel, type ModuleScope } from "@/lib/features";

export const metadata: Metadata = {
  title: "Fonctionnalités — CliniquePro",
  description: "Patients, agenda, réception, consultations, examens, ordonnances, assurances, facturation, caisse, honoraires et comptabilité : tous les modules de CliniquePro.",
  alternates: { canonical: "/fonctionnalites" },
};

const scopeStyle: Record<ModuleScope, string> = {
  operationnel: "bg-brand-500/10 text-brand-600",
  financier: "bg-leaf-500/15 text-emerald-700",
  commun: "bg-ink-900/[0.06] text-ink-900/70",
};

const groups: ModuleScope[] = ["operationnel", "financier", "commun"];

export default function FonctionnalitesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <PageHero eyebrow="Fonctionnalités" title={<>Tous les modules, <span className="text-gradient">de l&apos;accueil au bilan.</span></>}>
          Chaque module précise le pack qui le couvre : Gestion opérationnelle, Gestion financière et comptable, ou socle commun aux deux.
        </PageHero>

        <div className="mx-auto max-w-6xl px-5 py-16">
          {groups.map((g) => (
            <section key={g} className="mb-16">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{scopeLabel[g]}</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {features
                  .filter((f) => f.scope === g)
                  .map((f, i) => (
                    <Reveal key={f.id} delay={(i % 2) * 0.06} className="h-full">
                      <article id={f.id} className="h-full rounded-[24px] border border-ink-900/[0.07] bg-white p-7 shadow-sm">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${scopeStyle[f.scope]}`}>{scopeLabel[f.scope]}</span>
                        <h3 className="mt-4 font-display text-2xl font-bold">{f.title}</h3>
                        <p className="mt-2 text-ink-900/60">{f.summary}</p>
                        <ul className="mt-5 space-y-2">
                          {f.items.map((it) => (
                            <li key={it} className="flex items-start gap-2.5 text-sm text-ink-900/75">
                              <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-600">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                              {it}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-5 rounded-xl bg-paper p-3 text-sm font-medium text-ink-900/70">{f.value}</p>
                      </article>
                    </Reveal>
                  ))}
              </div>
            </section>
          ))}
          <div className="text-center">
            <DemoButton className="rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 px-8 py-4 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(18,196,106,0.7)]">
              Demander une démonstration
            </DemoButton>
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
