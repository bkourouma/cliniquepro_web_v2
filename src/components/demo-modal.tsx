"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BookingFrame, Thanks } from "./booking-frame";

// Lien public de réservation Calendly ou Cal.com (ex. https://calendly.com/cliniquepro).
// S'il est absent, un formulaire de qualification intégré est affiché à la place.
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-ink-900 text-white shadow-2xl outline-none sm:rounded-[28px]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-mint-400 uppercase">Démonstration personnalisée · 30 min</p>
                <h2 id="demo-title" className="mt-1 font-display text-2xl font-bold md:text-3xl">
                  Voyez CliniquePro appliqué à votre clinique.
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {BOOKING_URL ? (
                <BookingFrame url={BOOKING_URL} onDone={onClose} />
              ) : (
                <LeadForm onDone={onClose} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Option = { value: string };
const structures: Option[] = [
  { value: "Clinique ophtalmologique" },
  { value: "Cabinet spécialisé" },
  { value: "Centre médical" },
  { value: "Autre structure de santé" },
];
const volumes: Option[] = [
  { value: "1 à 2 médecins" },
  { value: "3 à 5 médecins" },
  { value: "6 à 10 médecins" },
  { value: "Plus de 10 médecins" },
];
const needs: Option[] = [
  { value: "Gestion opérationnelle" },
  { value: "Gestion financière et comptable" },
  { value: "Les deux packs" },
  { value: "Je ne sais pas encore" },
];
const roles: Option[] = [
  { value: "Directeur / Propriétaire" },
  { value: "Médecin" },
  { value: "Responsable administratif" },
  { value: "Comptable" },
  { value: "Autre" },
];

function LeadForm({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <Thanks
        onDone={onDone}
        text="Un expert CliniquePro vous recontacte sous 24 h ouvrées pour fixer le créneau de votre démonstration."
      />
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 p-6 md:grid-cols-2">
      <Choice name="structure" label="Votre structure" options={structures} />
      <Choice name="volume" label="Taille de l'équipe médicale" options={volumes} />
      <Choice name="need" label="Pack qui vous intéresse" options={needs} />
      <Choice name="role" label="Votre fonction" options={roles} />
      <Field name="name" label="Nom complet" autoComplete="name" required />
      <Field name="company" label="Clinique / Cabinet" autoComplete="organization" required />
      <Field name="email" label="E-mail professionnel" type="email" autoComplete="email" required />
      <Field name="phone" label="Téléphone / WhatsApp" type="tel" autoComplete="tel" placeholder="+225 07 00 00 00 00" required />
      {/* Champ piège anti-robots, invisible pour les humains */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="shine flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 py-4 font-semibold shadow-[0_10px_40px_-10px_rgba(18,196,106,0.7)] disabled:opacity-70"
        >
          {state === "sending" ? <Loader2 className="size-5 animate-spin" /> : <CalendarCheck className="size-5" />}
          Réserver ma démonstration
        </button>
        {state === "error" && (
          <p role="alert" className="mt-3 text-center text-sm text-rose-300">
            L&apos;envoi a échoué. Vérifiez votre connexion et réessayez.
          </p>
        )}
        <p className="mt-3 text-center text-xs text-white/40">
          Vos informations servent uniquement à organiser la démonstration.
        </p>
      </div>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/75">{label}</span>
      <input
        {...props}
        maxLength={120}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-brand-400 focus:bg-white/[0.08] focus:ring-4 focus:ring-brand-500/20"
      />
    </label>
  );
}

function Choice({ name, label, options, className = "" }: { name: string; label: string; options: Option[]; className?: string }) {
  return (
    <fieldset className={className}>
      <legend className="text-sm font-medium text-white/75">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} required={i === 0} className="peer sr-only" />
            <span className="block rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-sm text-white/75 transition peer-checked:border-brand-400 peer-checked:bg-brand-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/30 hover:bg-white/10">
              {o.value}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
