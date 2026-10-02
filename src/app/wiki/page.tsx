import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FinalCta } from "@/components/final-cta";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { WikiSearch } from "@/components/wiki/wiki-search";
import { scopeLabel } from "@/lib/features";
import { countItems, searchIndex, wikiDomains, wikiTotal, WIKI_UPDATED_ON } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Wiki des fonctionnalités — CliniquePro",
  description: `Toutes les actions de CliniquePro, domaine par domaine : patients, accueil, consultations, examens, assurances, caisse, facturation, comptabilité. ${wikiTotal} fonctionnalités détaillées.`,
  alternates: { canonical: "/wiki" },
};

export default function WikiPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <PageHero eyebrow="Wiki des fonctionnalités" title={<>Chaque action de l&apos;application, <span className="text-gradient">une par une.</span></>}>
          {wikiTotal} fonctionnalités détaillées, regroupées par domaine, avec les profils qui y ont accès. Mise à jour : {WIKI_UPDATED_ON}.
        </PageHero>
        <div className="mx-auto max-w-6xl px-5 py-14">
          <WikiSearch entries={searchIndex} />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {wikiDomains.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 0.06} className="h-full">
                <Link href={`/wiki/${d.slug}`} className="group flex h-full flex-col rounded-[24px] border border-ink-900/[0.07] bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                  <span className="w-fit rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-bold tracking-wide text-brand-600 uppercase">{scopeLabel[d.pack]}</span>
                  <h2 className="mt-4 font-display text-2xl font-bold">{d.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-ink-900/60">{d.summary}</p>
                  <p className="mt-5 flex items-center justify-between text-sm font-semibold text-brand-600">
                    {countItems(d)} actions
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
