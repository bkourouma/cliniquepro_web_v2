import { problems, journey } from "@/lib/content";
import { Check } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

/** Problèmes résolus (cartes) puis déroulé d'une journée type avec CliniquePro. */
export function Journey() {
  return (
    <section id="parcours" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Ce que CliniquePro règle</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
            Moins de doubles saisies, <span className="text-gradient-dark">plus de visibilité.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-900/60">
            Les difficultés que rencontrent les cliniques au quotidien, et la manière dont l&apos;application y répond.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.07} className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-ink-900/[0.07] bg-paper p-6 transition-shadow hover:shadow-lg">
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-leaf-500 text-white">
                  <Check className="size-5" strokeWidth={3} />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-900/60">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-24 max-w-3xl text-center">
          <Eyebrow>Une journée avec CliniquePro</Eyebrow>
          <h3 className="mt-5 font-display text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">Du premier patient à la clôture du soir.</h3>
        </Reveal>

        <ol className="relative mx-auto mt-14 max-w-3xl space-y-8 border-l-2 border-brand-500/20 pl-8">
          {journey.map((j, i) => (
            <Reveal key={j.moment} delay={i * 0.05}>
              <li className="relative">
                <span className="absolute top-1 -left-[2.65rem] grid size-5 place-items-center rounded-full bg-white ring-4 ring-brand-500/30">
                  <span className="size-2 rounded-full bg-leaf-500" />
                </span>
                <p className="text-xs font-bold tracking-[0.16em] text-brand-600 uppercase">{j.moment}</p>
                <h4 className="mt-1 font-display text-xl font-bold">{j.title}</h4>
                <p className="mt-1 text-ink-900/60">{j.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
