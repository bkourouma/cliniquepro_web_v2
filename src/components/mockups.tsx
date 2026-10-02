"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { Check, FileText, Glasses, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { MockupKind } from "@/lib/content";
import { fcfa, num } from "@/lib/format";

// Les écrans ci-dessous montrent l'interface avec des données fictives de démonstration.

/** Fait défiler des étapes en boucle, uniquement quand la carte est active. */
function useLoop(active: boolean, steps: number, ms: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => {
      clearInterval(id);
      setStep(0);
    };
  }, [active, steps, ms]);
  return active ? step : 0;
}

function useCountUp(target: number, active: boolean, duration = 1.4) {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (!active) return;
    const c = animate(target * 0.55, target, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [target, active, duration]);
  return active ? v : target;
}

function Window({ title, children, badge }: { title: string; children: ReactNode; badge?: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-[11px] font-medium text-white/50">{title}</span>
        <span className="ml-auto">{badge}</span>
      </div>
      <div className="relative min-h-0 flex-1 p-4">{children}</div>
    </div>
  );
}

type Tone = "green" | "amber" | "blue" | "violet" | "slate" | "rose";

function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  const tones: Record<Tone, string> = {
    green: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    amber: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    blue: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
    violet: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
    rose: "bg-rose-400/15 text-rose-300 ring-rose-400/30",
    slate: "bg-white/10 text-white/60 ring-white/15",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${tones[tone]}`}>{children}</span>;
}

function Stat({ label, value, tone = "text-white", hint }: { label: string; value: ReactNode; tone?: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2.5 ring-1 ring-white/[0.06]">
      <p className="text-[10px] text-white/50">{label}</p>
      <p className={`mt-0.5 font-display text-base font-bold tabular-nums ${tone}`}>{value}</p>
      {hint && <p className="text-[10px] text-white/40">{hint}</p>}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white/80">
      {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
    </span>
  );
}

function Toast({ show, icon, title, text }: { show: boolean; icon: ReactNode; title: string; text: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute inset-x-6 top-3 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-700/95 p-3 shadow-xl backdrop-blur-md"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-mint-400 text-ink-950">{icon}</span>
          <div className="text-xs">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-white/55">{text}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- 1. Agenda et accueil */

const appointments = [
  { time: "08:30", name: "Awa Koné", kind: "Consultation" },
  { time: "09:15", name: "Yao Brou", kind: "Suivi" },
  { time: "10:00", name: "Mariam Diallo", kind: "Examen" },
  { time: "10:45", name: "Serge Aka", kind: "Injection" },
  { time: "11:30", name: "Fatou Traoré", kind: "Consultation" },
];

function AgendaMockup({ active }: { active: boolean }) {
  // 0: planifié, 1: confirmé, 2: arrivée enregistrée (notification), 3: pause
  const step = useLoop(active, 4, 1500);
  const confirmed = step >= 1;
  const arrived = step >= 2;
  return (
    <Window title="Agenda · Dr Kouadio · Mardi" badge={<Pill tone="blue">Agenda partagé</Pill>}>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat label="Rendez-vous" value="18" hint="aujourd'hui" />
        <Stat label="Confirmés" value={confirmed ? "15" : "14"} tone="text-emerald-300" />
        <Stat label="Absents" value="1" tone="text-amber-300" />
      </div>
      <div className="space-y-1.5">
        {appointments.map((a, i) => {
          const isTarget = i === 2;
          const status = !isTarget ? (i < 2 ? "done" : "planned") : arrived ? "arrived" : confirmed ? "confirmed" : "planned";
          return (
            <motion.div
              key={a.name}
              animate={{ backgroundColor: isTarget && step === 2 ? "rgba(52,227,154,0.14)" : "rgba(255,255,255,0.03)" }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2 ring-1 ring-white/[0.05]"
            >
              <span className="w-10 text-[11px] font-semibold text-white/70 tabular-nums">{a.time}</span>
              <Avatar name={a.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{a.name}</p>
                <p className="truncate text-[10px] text-white/45">{a.kind}</p>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={status} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                  {status === "done" && (
                    <Pill tone="slate">
                      <Check className="size-3" /> Terminé
                    </Pill>
                  )}
                  {status === "planned" && <Pill tone="amber">Planifié</Pill>}
                  {status === "confirmed" && <Pill tone="blue">Confirmé</Pill>}
                  {status === "arrived" && (
                    <Pill tone="green">
                      <Check className="size-3" /> Arrivé
                    </Pill>
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <Toast show={step === 2} icon={<Check className="size-5" />} title="Arrivée enregistrée · Réception" text="Mariam Diallo · prestations du jour ajoutées" />
    </Window>
  );
}

/* ---------------------------------------------------------------- 2. Consultation */

const exam = [
  { label: "Acuité visuelle (loin)", od: "10/10", og: "9/10" },
  { label: "Pression intraoculaire", od: "14 mmHg", og: "15 mmHg" },
  { label: "Réfraction", od: "−1,25 (−0,50 à 90°)", og: "−1,00" },
];

function ConsultationMockup({ active }: { active: boolean }) {
  // les lignes se remplissent une à une, puis l'ordonnance de lunettes apparaît
  const step = useLoop(active, 6, 1100);
  return (
    <Window title="Consultation · Dossier ophtalmologique" badge={<Pill tone="green">Modèle ophtalmo</Pill>}>
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/[0.06]">
        <Avatar name="Awa Koné" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-white">Awa Koné · 42 ans</p>
          <p className="text-[10px] text-white/45">Motif : baisse de la vision de près · Assurée</p>
        </div>
        <Pill tone="blue">Suivi</Pill>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-white/55">
          <span>Mesure</span>
          <span>Œil droit</span>
          <span>Œil gauche</span>
        </div>
        {exam.map((r, i) => (
          <div key={r.label} className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-t border-white/[0.05] px-3 py-2 text-[11px]">
            <span className="text-white/70">{r.label}</span>
            <motion.span animate={{ opacity: step > i ? 1 : 0.15 }} className="font-semibold text-white tabular-nums">
              {step > i ? r.od : "…"}
            </motion.span>
            <motion.span animate={{ opacity: step > i ? 1 : 0.15 }} className="font-semibold text-white tabular-nums">
              {step > i ? r.og : "…"}
            </motion.span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-white/50">Diagnostic :</span>
        <motion.span animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
          <Pill tone="violet">Presbytie</Pill>
        </motion.span>
        <motion.span animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
          <Pill tone="slate">Contrôle dans 6 mois</Pill>
        </motion.span>
      </div>
      <AnimatePresence>
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-3 rounded-xl bg-mint-400/10 p-3 ring-1 ring-mint-400/30"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-mint-400 text-ink-950">
              <Glasses className="size-4" />
            </span>
            <div className="text-[11px]">
              <p className="font-semibold text-white">Ordonnance de lunettes prête</p>
              <p className="text-white/55">Imprimable avec l&apos;en-tête de la clinique</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Window>
  );
}

/* ---------------------------------------------------------------- 3. Examens */

const exams = [
  { name: "OCT maculaire", who: "Yao Brou" },
  { name: "Champ visuel", who: "Mariam Diallo" },
  { name: "Rétinographie", who: "Serge Aka" },
  { name: "Biométrie", who: "Fatou Traoré" },
];

function ExamensMockup({ active }: { active: boolean }) {
  const step = useLoop(active, 5, 1300);
  // état de chaque examen selon l'étape : 0 en attente, 1 en cours, 2 terminé
  const state = (i: number) => Math.max(0, Math.min(2, step - i + (i === 0 ? 1 : 0)));
  return (
    <Window title="Examens complémentaires · Aujourd'hui" badge={<Pill tone="violet">Workflow</Pill>}>
      <div className="space-y-2">
        {exams.map((e, i) => {
          const s = state(i);
          return (
            <div key={e.name} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.05]">
              <div className="flex items-center gap-3">
                <Avatar name={e.who} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">{e.name}</p>
                  <p className="truncate text-[10px] text-white/45">{e.who}</p>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={s} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}>
                    {s === 0 && <Pill tone="amber">En attente</Pill>}
                    {s === 1 && <Pill tone="blue">En cours</Pill>}
                    {s === 2 && (
                      <Pill tone="green">
                        <Check className="size-3" /> Terminé
                      </Pill>
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400"
                  initial={false}
                  animate={{ width: s === 0 ? "6%" : s === 1 ? "55%" : "100%" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-[11px] ring-1 ring-white/[0.05]">
        <FileText className="size-4 text-sky-300" />
        <span className="text-white/75">Rapports d&apos;examen rattachés au dossier du patient</span>
      </div>
    </Window>
  );
}

/* ---------------------------------------------------------------- 4. Assurance */

const lines = [
  { name: "Consultation spécialisée", amount: 25000 },
  { name: "OCT maculaire", amount: 35000 },
  { name: "Champ visuel", amount: 30000 },
];

function AssuranceMockup({ active }: { active: boolean }) {
  // 0: brouillon, 1: envoyé, 2: portail assurance (lien sécurisé), 3: approuvé
  const step = useLoop(active, 5, 1400);
  const stage = Math.min(step, 3);
  const steps = ["Réception", "Envoyé", "Portail assurance", "Décision"];
  const approved = stage === 3;
  return (
    <Window title="Prise en charge · Assurance partenaire" badge={<Pill tone="violet">Lien sécurisé</Pill>}>
      <div className="flex items-center justify-between gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <motion.span
              animate={{ backgroundColor: i <= stage ? "rgba(52,227,154,1)" : "rgba(255,255,255,0.1)" }}
              className="grid size-5 shrink-0 place-items-center rounded-full text-ink-950"
            >
              {i <= stage && <Check className="size-3" strokeWidth={3} />}
            </motion.span>
            <span className={`truncate text-[10px] ${i <= stage ? "text-white/85" : "text-white/40"}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
        <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-white/55">
          <span>Prestation</span>
          <span className="text-right">Montant</span>
          <span className="text-right">Approuvé</span>
        </div>
        {lines.map((l, i) => {
          const rejected = i === 2 && approved;
          return (
            <div key={l.name} className="grid grid-cols-[1.5fr_1fr_1fr] items-center border-t border-white/[0.05] px-3 py-2 text-[11px]">
              <span className="truncate text-white/75">{l.name}</span>
              <span className="text-right text-white/60 tabular-nums">{num(l.amount)}</span>
              <span className="text-right tabular-nums">
                {!approved ? <span className="text-white/25">—</span> : rejected ? <Pill tone="rose">Rejeté</Pill> : <span className="font-semibold text-emerald-300">{num(l.amount)}</span>}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="Part assurance" value={approved ? fcfa(60000) : "En attente"} tone={approved ? "text-emerald-300" : "text-white/50"} />
        <Stat label="Reste à charge patient" value={approved ? fcfa(30000) : "—"} tone={approved ? "text-white" : "text-white/50"} />
      </div>
      <Toast show={step === 4} icon={<ShieldCheck className="size-5" />} title="Décision enregistrée" text="Historique des décisions mis à jour" />
    </Window>
  );
}

/* ---------------------------------------------------------------- 5. Caisse */

function Donut({ slices, active, size = 108, children }: { slices: { value: number; color: string }[]; active: boolean; size?: number; children?: ReactNode }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((a, s) => a + s.value, 0));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {slices.map((s, i) => {
          const len = (s.value / 100) * c;
          const offset = (starts[i] / 100) * c;
          return (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={`${len} ${c}`}
              initial={false}
              animate={{ strokeDashoffset: active ? -offset : -offset + len, opacity: active ? 1 : 0.4 }}
              transition={{ duration: 1.1, delay: active ? 0.15 * i : 0, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

const methods = [
  { label: "Espèces", value: 42, color: "#1B6FE0" },
  { label: "Mobile money", value: 33, color: "#34E39A" },
  { label: "Carte", value: 15, color: "#7DD3FC" },
  { label: "Virement", value: 10, color: "#FBBF24" },
];

const payments = [
  { name: "Awa Koné", method: "Espèces", amount: 11843, change: 3157 },
  { name: "Yao Brou", method: "Mobile money", amount: 56489, change: 0 },
  { name: "Serge Aka", method: "Espèces", amount: 43941, change: 6059 },
];

function CaisseMockup({ active }: { active: boolean }) {
  const step = useLoop(active, 4, 1400);
  const shown = Math.min(step + 1, 3);
  const total = useCountUp(112273, active, 1.2);
  return (
    <Window title="Caisse · Session ouverte" badge={<Pill tone="green">Fond de caisse 50 000</Pill>}>
      <div className="flex items-center gap-4 rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/[0.06]">
        <Donut slices={methods} active={active}>
          <div>
            <p className="text-[9px] text-white/45">Net encaissé</p>
            <p className="font-display text-sm font-bold text-white tabular-nums">{num(total)}</p>
          </div>
        </Donut>
        <ul className="flex-1 space-y-1.5">
          {methods.map((m) => (
            <li key={m.label} className="flex items-center gap-2 text-[11px]">
              <span className="size-2 rounded-full" style={{ background: m.color }} />
              <span className="text-white/70">{m.label}</span>
              <span className="ml-auto font-semibold text-white tabular-nums">{m.value} %</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 mb-1.5 text-[10px] font-semibold tracking-wide text-white/45 uppercase">Derniers encaissements</p>
      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {payments.slice(0, shown).map((p) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 ring-1 ring-white/[0.05]"
            >
              <Avatar name={p.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{p.name}</p>
                <p className="text-[10px] text-white/45">{p.method}{p.change > 0 ? ` · monnaie rendue ${num(p.change)}` : ""}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-300 tabular-nums">{fcfa(p.amount)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Window>
  );
}

/* ---------------------------------------------------------------- 6. Comptabilité */

const entry = [
  { code: "571", label: "Caisse", debit: 11843, credit: 0 },
  { code: "4112", label: "Créances assurance", debit: 47371, credit: 0 },
  { code: "706", label: "Prestations de services", debit: 0, credit: 59214 },
];

function ComptabiliteMockup({ active }: { active: boolean }) {
  const step = useLoop(active, 5, 1200);
  const rows = Math.min(step, 3);
  return (
    <Window title="Journal de caisse · CAI-2026-000012" badge={<Pill tone="slate">Écriture immuable</Pill>}>
      <div className="overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
        <div className="grid grid-cols-[0.5fr_1.6fr_1fr_1fr] bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-white/55">
          <span>Compte</span>
          <span>Libellé</span>
          <span className="text-right">Débit</span>
          <span className="text-right">Crédit</span>
        </div>
        {entry.map((l, i) => (
          <motion.div
            key={l.code}
            initial={false}
            animate={{ opacity: i < rows ? 1 : 0.18 }}
            className="grid grid-cols-[0.5fr_1.6fr_1fr_1fr] items-center border-t border-white/[0.05] px-3 py-2 text-[11px]"
          >
            <span className="font-semibold text-sky-300 tabular-nums">{l.code}</span>
            <span className="truncate text-white/75">{l.label}</span>
            <span className="text-right text-white tabular-nums">{l.debit ? num(l.debit) : ""}</span>
            <span className="text-right text-white tabular-nums">{l.credit ? num(l.credit) : ""}</span>
          </motion.div>
        ))}
        <div className="grid grid-cols-[0.5fr_1.6fr_1fr_1fr] items-center border-t border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold">
          <span />
          <span className="text-white/60">Totaux</span>
          <span className="text-right text-white tabular-nums">{rows >= 3 ? num(59214) : "…"}</span>
          <span className="text-right text-white tabular-nums">{rows >= 3 ? num(59214) : "…"}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="Balance" value={<span className="inline-flex items-center gap-1 text-emerald-300"><Check className="size-3.5" strokeWidth={3} /> Équilibrée</span>} />
        <Stat label="Contrôles d'audit" value="22" hint="affichés en continu" tone="text-sky-300" />
      </div>
      <div className="mt-3 space-y-1.5">
        {["Dépenses fournisseurs avec justificatif", "Clôture mensuelle avec liste de contrôle"].map((t, i) => (
          <div key={t} className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 text-[11px] ring-1 ring-white/[0.05]">
            <motion.span animate={{ backgroundColor: step >= 3 + i ? "rgba(52,227,154,1)" : "rgba(255,255,255,0.08)" }} className="grid size-4 place-items-center rounded-full text-ink-950">
              {step >= 3 + i && <Check className="size-3" strokeWidth={3} />}
            </motion.span>
            <span className="text-white/80">{t}</span>
          </div>
        ))}
      </div>
    </Window>
  );
}

/* ---------------------------------------------------------------- 7. Pilotage et honoraires */

const week = [38, 52, 44, 66, 58, 72, 49];
const days = ["L", "M", "M", "J", "V", "S", "D"];
const doctors = [
  { name: "Dr Kouadio", rule: "40 % + prime fixe", amount: 1_280_000 },
  { name: "Dr Bamba", rule: "35 %", amount: 940_000 },
];

function PilotageMockup({ active }: { active: boolean }) {
  const step = useLoop(active, 4, 1500);
  const ca = useCountUp(18_450_000, active, 1.6);
  return (
    <Window title="Tableau de bord · Direction" badge={<Pill tone="blue">Ce mois</Pill>}>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Patients" value="412" hint="ce mois" />
        <Stat label="Chiffre d'affaires" value={num(ca)} tone="text-emerald-300" hint="FCFA" />
        <Stat label="Factures en attente" value="23" tone="text-amber-300" />
      </div>
      <div className="mt-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.05]">
        <p className="text-[10px] text-white/50">Encaissements des 7 derniers jours</p>
        <div className="mt-2 flex h-20 items-end gap-2">
          {week.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-mint-400"
                initial={false}
                animate={{ height: active ? `${h}%` : "8%", opacity: step % 7 === i ? 1 : 0.7 }}
                transition={{ duration: 1, delay: active ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="text-[9px] text-white/40">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 mb-1.5 text-[10px] font-semibold tracking-wide text-white/45 uppercase">Honoraires médecins · à verser</p>
      <div className="space-y-1.5">
        {doctors.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 ring-1 ring-white/[0.05]">
            <Avatar name={d.name.replace("Dr ", "")} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">{d.name}</p>
              <p className="text-[10px] text-white/45">{d.rule}</p>
            </div>
            <span className="text-xs font-semibold text-white tabular-nums">{fcfa(d.amount)}</span>
            <Pill tone={step > i + 1 ? "green" : "amber"}>{step > i + 1 ? "Payé" : "À verser"}</Pill>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/45">
        <Sparkles className="size-3.5 text-mint-400" /> « Quel est le chiffre d&apos;affaires par prestation ce mois-ci ? »
      </div>
    </Window>
  );
}

/* ---------------------------------------------------------------- mise à l'échelle */

// Taille de conception des interfaces : elles sont ensuite mises à l'échelle pour remplir le volet.
const DESIGN_W = 460;
const DESIGN_H = 390;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Réduit (ou agrandit légèrement) son contenu pour tenir dans le conteneur, sans reflow interne. */
function FitScale({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setScale(Math.min(width / DESIGN_W, height / DESIGN_H, 1.2));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative size-full">
      <div className="absolute top-1/2 left-1/2" style={{ width: DESIGN_W, height: DESIGN_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

export function Mockup({ kind, active }: { kind: MockupKind; active: boolean }) {
  return (
    <FitScale>
      <MockupInner kind={kind} active={active} />
    </FitScale>
  );
}

function MockupInner({ kind, active }: { kind: MockupKind; active: boolean }) {
  switch (kind) {
    case "agenda":
      return <AgendaMockup active={active} />;
    case "consultation":
      return <ConsultationMockup active={active} />;
    case "examens":
      return <ExamensMockup active={active} />;
    case "assurance":
      return <AssuranceMockup active={active} />;
    case "caisse":
      return <CaisseMockup active={active} />;
    case "comptabilite":
      return <ComptabiliteMockup active={active} />;
    case "pilotage":
      return <PilotageMockup active={active} />;
  }
}


