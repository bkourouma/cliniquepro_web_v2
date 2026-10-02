"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/wiki";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Recherche instantanée dans toutes les actions du wiki. */
export function WikiSearch({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const index = useMemo(() => entries.map((e) => ({ e, text: norm(`${e.dt} ${e.m} ${e.f} ${e.g}`) })), [entries]);
  const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
  const results = terms.length ? index.filter(({ text }) => terms.every((t) => text.includes(t))).slice(0, 30) : [];

  return (
    <div className="mx-auto max-w-2xl">
      <label className="relative block">
        <span className="sr-only">Rechercher une fonctionnalité</span>
        <Search className="absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-900/40" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une action : « ordonnance », « clôture de caisse »…"
          className="w-full rounded-full border border-ink-900/10 bg-white py-4 pr-5 pl-13 text-base shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
        />
      </label>
      {terms.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/[0.07]" role="region" aria-live="polite">
          {results.length === 0 ? (
            <p className="p-5 text-sm text-ink-900/60">Aucun résultat. Essayez un autre mot.</p>
          ) : (
            <ul className="divide-y divide-ink-900/[0.06]">
              {results.map(({ e }, i) => (
                <li key={i}>
                  <Link href={`/wiki/${e.d}`} className="block p-4 transition-colors hover:bg-brand-500/[0.04]">
                    <p className="text-xs font-semibold text-brand-600">
                      {e.dt} › {e.m} › {e.f}
                    </p>
                    <p className="mt-1 text-sm text-ink-900/75">{e.g}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
