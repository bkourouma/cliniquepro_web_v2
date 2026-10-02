"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { roles, type RoleId } from "@/lib/content";
import { ROLE_EVENT } from "@/lib/nav";
import { Mockup } from "./mockups";
import { SmartLink } from "./smart-link";
import { Eyebrow, Reveal, trackSpotlight } from "./ui";

export function Roles() {
  const [tab, setTab] = useState<RoleId>("direction");

  useEffect(() => {
    const onSelect = (e: Event) => setTab((e as CustomEvent<RoleId>).detail);
    window.addEventListener(ROLE_EVENT, onSelect);
    return () => window.removeEventListener(ROLE_EVENT, onSelect);
  }, []);

  const role = roles.find((r) => r.id === tab)!;

  return (
    <section id="roles" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Une interface par métier</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
            À chaque équipe, <span className="text-gradient-dark">son espace de travail.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-900/60">
            Direction, médecin, accueil ou caisse : chacun retrouve exactement les outils de son métier, avec les droits d&apos;accès qui lui correspondent.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <div role="tablist" aria-label="Rôles" className="inline-flex max-w-full overflow-x-auto rounded-full border border-ink-900/10 bg-white p-1.5 shadow-sm">
            {roles.map((r) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={tab === r.id}
                onClick={() => setTab(r.id)}
                className={`relative cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors md:px-6 ${
                  tab === r.id ? "text-white" : "text-ink-900/60 hover:text-ink-900"
                }`}
              >
                {tab === r.id && (
                  <motion.span layoutId="role-pill" className="absolute inset-0 rounded-full bg-ink-900" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{r.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 min-h-[620px] md:min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr]"
            >
              <div>
                <h3 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">{role.headline}</h3>
                <p className="mt-4 text-ink-900/65 md:text-lg">{role.pitch}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                  {role.features.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      onMouseMove={trackSpotlight}
                      whileHover={{ y: -4 }}
                      className="spotlight rounded-2xl border border-ink-900/[0.07] bg-white p-4 shadow-sm transition-shadow hover:shadow-lg"
                    >
                      <p className="relative font-semibold">{f.title}</p>
                      <p className="relative mt-1 text-sm text-ink-900/55">{f.text}</p>
                    </motion.div>
                  ))}
                </div>
                <SmartLink href={role.cta.href} className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500">
                  {role.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </SmartLink>
              </div>
              <div className="relative overflow-hidden rounded-[28px] border border-ink-900/[0.07] bg-[linear-gradient(160deg,#0c2a5c,#040f26)] p-4 shadow-[0_30px_80px_-30px_rgba(11,74,162,0.5)] md:p-6">
                <div aria-hidden className="absolute -right-32 -bottom-32 size-96" style={{ background: "radial-gradient(closest-side, rgba(18,196,106,0.3), transparent)" }} />
                <div className="relative h-[330px] sm:h-[400px]">
                  <Mockup kind={role.mockup} active />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
