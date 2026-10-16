import Link from "next/link";
import type { ReactNode } from "react";
import type { FaqItem, Section } from "@/lib/page-content";
import { priceParagraphs } from "@/lib/page-content";

const linkClass = "font-semibold text-brand-600 hover:underline";

/** Texte avec liens internes : [libellé](/chemin) devient un lien du routeur. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={m.index} href={m[2]} className={linkClass}>
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Colonne de lecture commune aux pages d'intention et aux guides (mêmes réglages que « À propos »). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 text-ink-900/75 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-ink-900 first:[&_h2]:mt-0 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:text-ink-900 [&_ul]:mb-4 [&_ul]:space-y-1.5">
      {children}
    </article>
  );
}

/** Sections H2 : paragraphes, puces et, au besoin, bloc de prix lu dans pricing.ts. */
export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.h2}>
          <h2>{s.h2}</h2>
          {[...(s.paragraphs ?? []), ...(s.price ? priceParagraphs(s.price) : [])].map((t, i) => (
            <p key={i}>
              <RichText text={t} />
            </p>
          ))}
          {s.bullets && (
            <ul>
              {s.bullets.map((b) => (
                <li key={b}>
                  <RichText text={b} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}

/** FAQ visible (questions et réponses affichées en clair) ; le balisage FAQPage reprend ces mêmes textes. */
export function FaqBlock({ items, title = "Questions fréquentes" }: { items: FaqItem[]; title?: string }) {
  return (
    <section>
      <h2>{title}</h2>
      {items.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>
            <RichText text={f.a} />
          </p>
        </div>
      ))}
    </section>
  );
}

/** Cartes de liens croisés (3 à 5 par page). */
export function LinkCards({ links }: { links: { href: string; label: string; text: string }[] }) {
  return (
    <ul className="not-prose !mb-6 grid gap-3 sm:grid-cols-2 [&_li]:!ml-0 [&_li]:!list-none">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="block h-full rounded-2xl border border-ink-900/[0.07] bg-white p-4 shadow-sm transition-shadow hover:shadow-lg">
            <span className="block font-semibold text-brand-600">{l.label} →</span>
            <span className="mt-1 block text-sm text-ink-900/60">{l.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
