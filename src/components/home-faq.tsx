import { faqGroups } from "@/lib/faq";
import { SmartLink } from "./smart-link";
import { Eyebrow, Reveal } from "./ui";

/** Extrait de la FAQ sur l'accueil : les premières questions de chaque groupe. */
export function HomeFaq() {
  const items = faqGroups.flatMap((g) => g.items.slice(0, 2)).slice(0, 6);
  return (
    <section id="faq" className="bg-paper pb-24 md:pb-32">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-5xl">Vous vous demandez…</h2>
        </Reveal>
        <div className="mt-10 divide-y divide-ink-900/[0.07] rounded-[22px] bg-white ring-1 ring-ink-900/[0.07]">
          {items.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-brand-600 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-ink-900/65">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm">
          <SmartLink href="/faq" className="font-semibold text-brand-600 hover:underline">
            Voir toutes les questions →
          </SmartLink>
        </p>
      </div>
    </section>
  );
}
