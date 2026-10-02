import type { FaqGroup } from "@/lib/faq";

/** Groupes de questions en accordéon natif (<details>), sans JavaScript. */
export function FaqList({ groups }: { groups: FaqGroup[] }) {
  return (
    <>
      {groups.map((g) => (
        <section key={g.title} className="mb-12">
          <h2 className="font-display text-2xl font-bold tracking-tight">{g.title}</h2>
          <div className="mt-5 divide-y divide-ink-900/[0.07] rounded-[22px] bg-white ring-1 ring-ink-900/[0.07]">
            {g.items.map((f) => (
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
        </section>
      ))}
    </>
  );
}
