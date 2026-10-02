"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, CircleDollarSign, FileText, Glasses, LayoutDashboard, Play, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroCards, type HeroCard, type MockupKind } from "@/lib/content";
import { goTo } from "@/lib/nav";
import { Mockup } from "./mockups";
import { useDemo } from "./providers";
import { MagneticButton } from "./ui";

const N = heroCards.length;

// Pictogramme décoratif des cartes sans photo
const cardIcon: Record<MockupKind, LucideIcon> = {
  agenda: CalendarDays,
  consultation: Stethoscope,
  examens: Glasses,
  assurance: ShieldCheck,
  caisse: CircleDollarSign,
  comptabilite: FileText,
  pilotage: LayoutDashboard,
};
const AUTOPLAY_MS = 8000;

/** Décalage circulaire d'une carte par rapport à la carte active, dans [-3, 3] */
function offsetOf(i: number, active: number) {
  const half = Math.floor(N / 2);
  return ((i - active + N + half) % N) - half;
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragging = useRef(false);
  const root = useRef<HTMLElement>(null);
  const { open } = useDemo();
  const cards = heroCards;

  const go = useCallback((dir: number) => setActive((a) => (a + dir + N) % N), []);

  // Les écrans animés démarrent une fois le navigateur au repos : le premier affichage reste léger
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const start = () => setAnimated(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 1200);
    return () => clearTimeout(id);
  }, []);

  // Lecture automatique, en pause au survol ou quand l'onglet est caché
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -70) go(1);
    else if (swipe > 70) go(-1);
    setTimeout(() => (dragging.current = false), 0);
  }

  const title = "La plateforme tout-en-un pour piloter votre clinique ophtalmologique.";
  // Index du premier mot mis en dégradé
  const gradientFrom = 4;
  const accent = cards[active].accent;

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate overflow-hidden bg-ink-950 pt-28 pb-16 text-white md:pt-32 md:pb-20"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {/* Fond : grille + halos qui prennent la couleur de la carte active */}
      <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_70%)]" />
      {/* Halos en dégradés radiaux (bien plus légers qu'un flou CSS sur mobile) */}
      <AnimatePresence initial={false}>
        <motion.div
          key={accent}
          aria-hidden
          className="absolute top-[22%] left-1/2 -z-10 h-[760px] w-[1300px] -translate-x-1/2"
          style={{ background: `radial-gradient(closest-side, ${accent}59, transparent)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>
      <div aria-hidden className="absolute -top-72 -left-72 -z-10 size-[900px]" style={{ background: "radial-gradient(closest-side, rgba(27,111,224,0.34), transparent)" }} />
      <div aria-hidden className="absolute -top-60 right-[-25%] -z-10 size-[760px]" style={{ background: "radial-gradient(closest-side, rgba(18,196,106,0.16), transparent)" }} />

      <div className="mx-auto max-w-5xl px-5 text-center">
        <div className="hero-fade inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/75 backdrop-blur-md">
          <span className="shrink-0 rounded-full bg-mint-400 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-ink-950">2 PACKS</span>
          Gestion opérationnelle · Gestion financière et comptable
        </div>
      </div>

      {/* Titre, accroche et appels à l'action : premier écran */}
      <div className="mx-auto mt-6 max-w-4xl px-5 text-center">
        <h1 className="font-display text-[2.35rem] leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <span className={`hero-word inline-block ${i >= gradientFrom ? "text-gradient" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                {w}&nbsp;
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-fade mx-auto mt-5 max-w-2xl text-base text-white/65 md:text-lg" style={{ animationDelay: "350ms" }}>
          CliniquePro centralise patients, rendez-vous, consultations, examens, assurances, caisse, facturation, honoraires et comptabilité dans une interface web moderne, conçue pour les cliniques ophtalmologiques.
        </p>
        <div className="hero-fade mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "500ms" }}>
          <MagneticButton
            onClick={open}
            className="bg-white px-7 py-3.5 text-sm text-ink-950 shadow-[0_0_40px_-8px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-6px_rgba(255,255,255,0.7)]"
          >
            <Play className="size-4 fill-current" /> Réserver une démo de 30 min
          </MagneticButton>
          <MagneticButton
            onClick={() => goTo("#tarifs")}
            className="border border-white/25 bg-white/5 px-7 py-3.5 text-sm text-white backdrop-blur-md hover:bg-white/15"
          >
            Voir les tarifs
          </MagneticButton>
        </div>
      </div>

      {/* Scène Coverflow 3D */}
      <div
        className="hero-stage relative mx-auto mt-8 h-[680px] w-full [perspective:1800px] sm:h-[600px] md:mt-10 md:h-[540px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Fonctionnalités CliniquePro"
      >
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y [transform-style:preserve-3d] active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={onDragEnd}
        >
          {cards.map((card, i) => {
            const d = offsetOf(i, active);
            const abs = Math.abs(d);
            return (
              <motion.div
                key={card.id}
                className="absolute top-0 left-1/2 h-full w-[88vw] max-w-[1080px] will-change-transform md:w-[76vw]"
                initial={false}
                animate={{
                  x: `${-50 + d * 64}%`,
                  scale: 1 - abs * 0.14,
                  rotateY: d * -9,
                  opacity: abs >= 3 ? 0 : 1,
                  zIndex: 10 - abs,
                }}
                transition={{ type: "spring", stiffness: 170, damping: 26, mass: 0.9 }}
                style={{ pointerEvents: abs >= 3 ? "none" : "auto" }}
                onClick={() => {
                  if (!dragging.current && d !== 0) setActive(i);
                }}
                aria-hidden={d !== 0}
              >
                <Card card={card} active={d === 0} near={animated && abs <= 1} />
                {/* Calque d'assombrissement des cartes latérales */}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-[28px] bg-ink-950"
                  initial={false}
                  animate={{ opacity: abs === 0 ? 0 : abs === 1 ? 0.55 : 0.78 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Contrôles */}
      <div className="hero-fade mx-auto mt-8 flex max-w-5xl flex-col items-center gap-5 px-5" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3">
          <NavButton label="Carte précédente" onClick={() => go(-1)}>
            <ChevronLeft className="size-5" />
          </NavButton>
          <div className="flex items-center">
            {cards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                aria-label={c.eyebrow}
                aria-current={i === active}
                className="group relative flex h-6 cursor-pointer items-center transition-all duration-500"
                style={{ width: i === active ? 56 : 24 }}
              >
                <span className={`absolute h-2 overflow-hidden rounded-full bg-white/15 ${i === active ? "inset-x-0" : "inset-x-2"}`}>
                {i === active && (
                  <motion.span
                    key={`${active}-${paused}`}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: c.accent }}
                    initial={{ width: paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
                </span>
              </button>
            ))}
          </div>
          <NavButton label="Carte suivante" onClick={() => go(1)}>
            <ChevronRight className="size-5" />
          </NavButton>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase"
          >
            {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} · {cards[active].eyebrow}
          </motion.p>
        </AnimatePresence>
      </div>

    </section>
  );
}

function NavButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={label}
      className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-colors hover:bg-white/15"
    >
      {children}
    </motion.button>
  );
}

function Card({ card, active, near }: { card: HeroCard; active: boolean; near: boolean }) {
  const Icon = cardIcon[card.id];
  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-900 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] md:flex-row"
      style={{ boxShadow: active ? `0 40px 140px -40px ${card.accent}66, 0 0 0 1px rgba(255,255,255,0.08)` : undefined }}
    >
      {/* Volet gauche : photo + texte */}
      <div className="relative min-h-0 flex-[1.15] overflow-hidden md:flex-[0.46]">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.imageAlt ?? ""}
            fill
            sizes="(max-width: 768px) 88vw, 40vw"
            className={`object-cover ${card.imageClass ?? "object-[center_22%]"} transition-transform duration-[1.6s] ease-out ${active ? "scale-100" : "scale-110"}`}
            draggable={false}
            priority={card.id === "agenda"}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 30% 20%, ${card.accent}55, transparent 60%), linear-gradient(160deg, #143a78, #040f26)` }}
          >
            <Icon aria-hidden className="absolute top-8 right-8 size-24 opacity-[0.14] md:size-36" style={{ color: card.accent }} strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: card.accent }}>
            {card.eyebrow}
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-wide text-white/45 uppercase">Pack {card.pack}</p>
          <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-balance md:text-[2.1rem]">{card.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm text-white/70 sm:line-clamp-3 md:line-clamp-none md:text-[15px]">{card.description}</p>
          <button
            tabIndex={active ? 0 : -1}
            onClick={(e) => {
              if (!active) return;
              e.stopPropagation();
              goTo(card.href);
            }}
            className="shine group mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition-transform hover:scale-[1.03]"
          >
            {card.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Volet droit : interface de l'application */}
      <div className="relative h-[300px] shrink-0 overflow-hidden bg-[linear-gradient(160deg,#0c2a5c,#040f26)] p-4 sm:h-[280px] md:h-auto md:flex-[0.54] md:p-8">
        <div
          aria-hidden
          className="absolute -right-40 -bottom-40 size-[28rem]"
          style={{ background: `radial-gradient(closest-side, ${card.accent}4d, transparent)` }}
        />
        <div className="relative flex h-full items-center justify-center">
          {/* Les écrans animés ne sont montés que pour la carte active et ses voisines */}
          {near ? <Mockup kind={card.id} active={active} /> : <div className="size-full rounded-2xl border border-white/10 bg-ink-900/60" />}
        </div>
      </div>
    </article>
  );
}
