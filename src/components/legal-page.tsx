import type { ReactNode } from "react";
import { FinalCta } from "./final-cta";
import { Navbar } from "./navbar";
import { PageHero } from "./page-hero";

/** Gabarit des pages légales : texte long, lisible, typographie sobre. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <PageHero eyebrow="Informations légales" title={title}>
          <p className="text-base">Dernière mise à jour : {updated}</p>
        </PageHero>
        <article className="mx-auto max-w-3xl px-5 py-14 text-ink-900/75 [&_a]:font-medium [&_a]:text-brand-600 [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:text-ink-900 [&_ul]:mb-4 [&_ul]:space-y-1.5">
          {children}
        </article>
      </main>
      <FinalCta />
    </>
  );
}
