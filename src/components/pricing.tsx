"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Check, ChevronDown, Globe, History, Layers, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { features } from "@/lib/features";
import { fcfa } from "@/lib/format";
import { packs, pricingNote, type Pack, type PackId } from "@/lib/pricing";
import { useDemo } from "./providers";
import { Eyebrow, MagneticButton, Reveal, trackSpotlight } from "./ui";

const perks = [
  { icon: Globe, text: "Application web, sans installation" },
  { icon: ShieldCheck, text: "Rôles et permissions par métier" },
  { icon: History, text: "Journal d'audit des actions importantes" },
  { icon: Layers, text: "Deux packs complémentaires" },
];

export function Pricing({ comparisonOpen = false }: { comparisonOpen?: boolean }) {
  const { open } = useDemo();

  return (
    <section id="tarifs" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Tarifs</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
            Deux packs, <span className="text-gradient-dark">choisissez votre périmètre.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-900/60">
            Commencez par ce qui compte le plus pour votre clinique : le parcours patient, la partie financière et comptable, ou les deux.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm text-ink-900/70 ring-1 ring-ink-900/[0.07]">
                <Icon className="size-4 text-brand-600" /> {text}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
          {packs.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <PackCard pack={p} onCta={open} />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-ink-900/60">{pricingNote}</p>

        <Comparison defaultOpen={comparisonOpen} />
        <Combiner />
      </div>
    </section>
  );
}

function PackCard({ pack, onCta }: { pack: Pack; onCta: () => void }) {
  const dark = !!pack.featured;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onMouseMove={dark ? undefined : trackSpotlight}
      className={`relative flex h-full flex-col rounded-[28px] p-7 ${
        dark ? "glow-border text-white shadow-[0_40px_120px_-30px_rgba(27,111,224,0.8)]" : "spotlight border border-ink-900/[0.08] bg-white shadow-sm transition-shadow hover:shadow-xl"
      }`}
    >
      {dark && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 px-4 py-1.5 text-xs font-bold whitespace-nowrap">
          <Sparkles className="size-3.5" /> Maîtrisez vos chiffres
        </span>
      )}
      <div className="relative flex flex-1 flex-col">
        <div className="md:min-h-[84px]">
          <h3 className="font-display text-2xl leading-tight font-bold">{pack.name}</h3>
          <p className={`mt-1.5 text-sm ${dark ? "text-white/60" : "text-ink-900/55"}`}>{pack.audience}</p>
        </div>
        <div className="mt-4">
          <p className="font-display text-[2.4rem] leading-none font-bold tracking-tight tabular-nums">{fcfa(pack.monthly).replace(" FCFA", "")}</p>
          <p className={`mt-1.5 text-sm ${dark ? "text-white/50" : "text-ink-900/45"}`}>FCFA / mois</p>
        </div>
        <p className={`mt-4 rounded-xl p-3 text-xs font-semibold ${dark ? "bg-white/[0.06] text-white/80" : "bg-brand-500/[0.06] text-ink-900/70"}`}>{pack.tagline}</p>
        <ul className="mt-6 flex-1 space-y-2.5">
          {pack.highlights.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className={`mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full ${dark ? "bg-mint-400 text-ink-950" : "bg-brand-500/10 text-brand-600"}`}>
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className={dark ? "text-white/85" : "text-ink-900/75"}>{f}</span>
            </li>
          ))}
        </ul>
        <MagneticButton
          onClick={onCta}
          strength={0.18}
          className={`mt-7 w-full py-3.5 text-sm ${dark ? "bg-white text-ink-950 hover:shadow-[0_0_40px_-6px_rgba(255,255,255,0.6)]" : "bg-ink-900 text-white hover:bg-ink-800"}`}
        >
          Demander une démonstration
        </MagneticButton>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ tableau comparatif */

function Comparison({ defaultOpen }: { defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-14">
      <div className="flex justify-center">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold transition hover:border-ink-900/40"
        >
          Comparer les packs en détail
          <ChevronDown className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 overflow-x-auto rounded-[24px] bg-white ring-1 ring-ink-900/[0.07]">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-ink-900/[0.07] text-left">
                    <th className="p-4 font-medium text-ink-900/50">Module</th>
                    {packs.map((p) => (
                      <th key={p.id} className={`p-4 text-center font-display font-bold ${p.featured ? "text-brand-600" : ""}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((f) => (
                    <tr key={f.id} className="border-b border-ink-900/[0.05] last:border-0 hover:bg-brand-500/[0.03]">
                      <td className="p-4 text-ink-900/75">{f.title}</td>
                      {packs.map((p) => {
                        const ok = f.scope === "commun" || f.scope === p.id;
                        return (
                          <td key={p.id} className={`p-4 text-center ${p.featured ? "bg-brand-500/[0.04]" : ""}`}>
                            {ok ? (
                              <Check className="mx-auto size-4.5 text-emerald-600" strokeWidth={3} aria-label="Inclus" />
                            ) : (
                              <Minus className="mx-auto size-4 text-ink-900/20" aria-label="Non inclus" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ total de la sélection */

function Combiner() {
  const [selected, setSelected] = useState<PackId[]>(["operationnel"]);
  const { open } = useDemo();
  const toggle = (id: PackId) => setSelected((s) => (s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]));
  const chosen = packs.filter((p) => selected.includes(p.id));
  const total = chosen.reduce((sum, p) => sum + p.monthly, 0);

  return (
    <div className="mt-16 overflow-hidden rounded-[32px] bg-ink-950 text-white">
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="p-7 md:p-10">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-mint-400 uppercase">
            <Calculator className="size-4" /> Composez votre offre
          </p>
          <h3 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">Quels packs pour votre clinique&nbsp;?</h3>
          <div className="mt-8 grid gap-3">
            {packs.map((p) => {
              const on = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => toggle(p.id)}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition ${on ? "border-leaf-400/60 bg-leaf-500/10" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"}`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-md ${on ? "bg-leaf-400 text-ink-950" : "bg-white/10"}`}>{on && <Check className="size-4" strokeWidth={3} />}</span>
                  <span className="flex-1">
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block text-xs text-white/50">{p.audience}</span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{fcfa(p.monthly)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-white/[0.03] p-7 md:p-10 lg:border-t-0 lg:border-l">
          <div aria-hidden className="absolute -top-20 -right-20 size-64" style={{ background: "radial-gradient(closest-side, rgba(27,111,224,0.4), transparent)" }} />
          <div className="relative">
            <p className="text-sm text-white/55">Votre total mensuel</p>
            <motion.p key={total} initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 font-display text-5xl font-bold tracking-tight tabular-nums">
              {fcfa(total).replace(" FCFA", "")}
            </motion.p>
            <p className="mt-1 text-sm text-white/55">FCFA / mois</p>
            <div className="mt-6 space-y-2 text-sm">
              {chosen.map((p) => (
                <div key={p.id} className="flex justify-between gap-4 text-white/75">
                  <span>{p.name}</span>
                  <span className="shrink-0 tabular-nums">{fcfa(p.monthly)}</span>
                </div>
              ))}
            </div>
            <MagneticButton onClick={open} strength={0.18} className="mt-8 w-full bg-white py-3.5 text-sm text-ink-950">
              Demander une démonstration
            </MagneticButton>
            <p className="mt-4 text-xs text-white/60">Estimation indicative : la démonstration permet de valider le périmètre adapté à votre clinique.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
