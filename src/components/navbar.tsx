"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/content";
import { APP_LOGIN_URL } from "@/lib/site";
import { useDemo } from "./providers";
import { SmartLink } from "./smart-link";
import { Logo, MagneticButton } from "./ui";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const { open } = useDemo();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 md:px-5 ${
          scrolled
            ? "border-white/10 bg-ink-950/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <SmartLink href="#top" className="shrink-0 text-white" aria-label="CliniquePro — accueil">
          <Logo />
        </SmartLink>

        <ul className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((l) => (
            <li
              key={l.href}
              className="relative"
              onMouseEnter={() => setHovered(l.href)}
              onFocus={() => setHovered(l.href)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHovered(null)}
            >
              <SmartLink
                href={l.href}
                aria-haspopup={l.children ? "true" : undefined}
                aria-expanded={l.children ? hovered === l.href : undefined}
                className="relative z-10 flex items-center gap-1 px-4 py-2 text-sm font-medium whitespace-nowrap text-white/75 transition-colors hover:text-white"
              >
                {l.label}
                {l.children && <ChevronDown className={`size-3.5 transition-transform ${hovered === l.href ? "rotate-180" : ""}`} />}
              </SmartLink>
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <AnimatePresence>
                {l.children && hovered === l.href && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 ${l.wide ? "w-[640px]" : "w-[340px]"}`}
                  >
                    <div className="rounded-2xl border border-white/10 bg-ink-950/95 p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                      <div className={`grid gap-1 ${l.wide ? "grid-cols-2" : ""}`}>
                        {l.children.map((c) => (
                          <SmartLink key={c.href} href={c.href} onClick={() => setHovered(null)} className="group rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.07]">
                            <span className="block text-sm font-semibold text-white">{c.label}</span>
                            <span className="block text-xs text-white/50 group-hover:text-white/70">{c.text}</span>
                          </SmartLink>
                        ))}
                      </div>
                      {l.footer && (
                        <SmartLink
                          href={l.footer.href}
                          onClick={() => setHovered(null)}
                          className="group mt-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-brand-500/25 to-leaf-500/20 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10"
                        >
                          {l.footer.label}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </SmartLink>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={APP_LOGIN_URL} className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white lg:block">
            Connexion
          </a>
          <div className="hidden sm:block">
            <MagneticButton
              onClick={open}
              className="bg-gradient-to-r from-brand-500 to-leaf-500 px-5 py-2.5 text-sm whitespace-nowrap text-white shadow-[0_8px_30px_-8px_rgba(18,196,106,0.7)]"
            >
              Demander une démo
            </MagneticButton>
          </div>
          <button
            className="grid size-10 cursor-pointer place-items-center rounded-xl text-white hover:bg-white/10 lg:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menu}
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="absolute inset-x-3 top-[76px] max-h-[calc(100dvh-90px)] overflow-y-auto rounded-2xl border border-white/10 bg-ink-950/95 p-3 text-white backdrop-blur-xl lg:hidden"
          >
            {navLinks.map((l) =>
              l.children ? (
                <div key={l.href}>
                  <button
                    onClick={() => setSub((s) => (s === l.href ? null : l.href))}
                    aria-expanded={sub === l.href}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-white/10"
                  >
                    {l.label}
                    <ChevronDown className={`size-4 transition-transform ${sub === l.href ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {sub === l.href && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="grid gap-1 ps-3 pb-2">
                          {[...(l.footer ? [l.footer] : []), ...l.children].map((c) => (
                            <SmartLink key={c.href} href={c.href} onClick={() => setMenu(false)} className="rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
                              {c.label}
                            </SmartLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <SmartLink key={l.href} href={l.href} onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-white/10">
                  {l.label}
                </SmartLink>
              ),
            )}
            <a href={APP_LOGIN_URL} className="block rounded-xl px-4 py-3 text-base font-medium text-white/70 hover:bg-white/10">
              Connexion clients
            </a>
            <button
              onClick={() => {
                setMenu(false);
                open();
              }}
              className="mt-2 w-full cursor-pointer rounded-xl bg-gradient-to-r from-brand-500 to-leaf-500 py-3 font-semibold"
            >
              Demander une démo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
