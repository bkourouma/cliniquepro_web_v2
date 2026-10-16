import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { features, scopeLabel } from "@/lib/features";
import { intentRoute } from "@/lib/intent-routes";
import { wikiDomainPages } from "@/lib/intent-pages";
import { pageMetadata } from "@/lib/seo";
import { countItems, domainBySlug, domainEditorial, wikiDomains, WIKI_UPDATED_ON } from "@/lib/wiki";

export function generateStaticParams() {
  return wikiDomains.map((d) => ({ domaine: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/wiki/[domaine]">): Promise<Metadata> {
  const { domaine } = await params;
  const d = domainBySlug(domaine);
  if (!d) return {};
  return pageMetadata({ title: domainEditorial[d.slug]?.seoTitle ?? `${d.title} : wiki des fonctionnalités`, description: `${d.summary} ${countItems(d)} actions détaillées du logiciel CliniquePro.`, path: `/wiki/${d.slug}` });
}

export default async function WikiDomainPage({ params }: PageProps<"/wiki/[domaine]">) {
  const { domaine } = await params;
  const d = domainBySlug(domaine);
  if (!d) notFound();
  const editorial = domainEditorial[d.slug];
  const related = editorial ? features.filter((f) => editorial.featureIds.includes(f.id)) : [];
  const landings = (wikiDomainPages[d.slug] ?? []).map((slug) => intentRoute(slug));

  return (
    <>
      <Navbar />
      <WebPageJsonLd path={`/wiki/${d.slug}`} name={`${d.title} : wiki CliniquePro`} description={d.summary} />
      <BreadcrumbJsonLd
        trail={[
          { name: "Wiki des fonctionnalités", path: "/wiki" },
          { name: d.title, path: `/wiki/${d.slug}` },
        ]}
      />
      <main className="bg-paper">
        <PageHero eyebrow={scopeLabel[d.pack]} title={d.title}>
          {d.summary}
          <span className="mt-2 block text-sm text-white/45">Inventaire arrêté au {WIKI_UPDATED_ON}</span>
        </PageHero>
        {editorial && (
          <section className="mx-auto max-w-6xl px-5 pt-14">
            <div className="rounded-[22px] border border-ink-900/[0.07] bg-white p-6 text-ink-900/75 shadow-sm md:p-8 [&_p]:mb-3 [&_p:last-child]:mb-0">
              <p className="text-lg text-ink-900/85">{editorial.intro}</p>
              {editorial.more?.map((t) => <p key={t}>{t}</p>)}
              <p>
                Ce domaine regroupe {d.modules.length} module{d.modules.length > 1 ? "s" : ""} et {countItems(d)} actions :{" "}
                {d.modules.map((m, i) => (
                  <span key={m.slug}>
                    {i > 0 && ", "}
                    <a href={`#${m.slug}`} className="font-semibold text-brand-600 hover:underline">{m.title}</a>
                  </span>
                ))}
                .
              </p>
              <p>
                Pour les fonctions décrites ici, voir aussi{" "}
                {related.map((f, i) => (
                  <span key={f.id}>
                    {i > 0 && (i === related.length - 1 ? " et " : ", ")}
                    <Link href={`/fonctionnalites#${f.id}`} className="font-semibold text-brand-600 hover:underline">{f.title.toLowerCase()}</Link>
                  </span>
                ))}
                {related.length > 0 && " dans les fonctionnalités, "}le <Link href="/tarifs" className="font-semibold text-brand-600 hover:underline">pack {scopeLabel[d.pack]}</Link> sur la page des tarifs et la{" "}
                <Link href="/faq" className="font-semibold text-brand-600 hover:underline">FAQ</Link>.
              </p>
              {landings.length > 0 && (
                <p>
                  Présentations par besoin :{" "}
                  {landings.map((r, i) => (
                    <span key={r.slug}>
                      {i > 0 && (i === landings.length - 1 ? " et " : ", ")}
                      <Link href={r.path} className="font-semibold text-brand-600 hover:underline">{r.label.toLowerCase()}</Link>
                    </span>
                  ))}
                  .
                </p>
              )}
            </div>
          </section>
        )}
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Link href="/wiki" className="text-sm font-semibold text-brand-600 hover:underline">
              ← Tous les domaines
            </Link>
            <nav aria-label="Modules" className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {d.modules.map((m) => (
                <a key={m.slug} href={`#${m.slug}`} className="rounded-full bg-white px-3.5 py-2 text-sm text-ink-900/70 ring-1 ring-ink-900/[0.07] transition-colors hover:text-ink-900 lg:rounded-xl">
                  {m.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-14">
            {d.modules.map((m) => (
              <section key={m.slug} id={m.slug}>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-3xl font-bold tracking-tight">{m.title}</h2>
                  <span className="rounded-full bg-ink-900/[0.06] px-3 py-1 text-[11px] font-bold tracking-wide text-ink-900/70 uppercase">{scopeLabel[m.pack]}</span>
                </div>
                <div className="mt-6 space-y-4">
                  {m.features.map((f) => (
                    <details key={f.title} className="group rounded-[22px] border border-ink-900/[0.07] bg-white p-6 shadow-sm" open={m.features.length === 1}>
                      <summary className="cursor-pointer list-none marker:hidden">
                        <h3 className="flex items-center justify-between gap-4 font-display text-xl font-bold">
                          {f.title}
                          <span className="flex shrink-0 items-center gap-3 text-sm font-medium text-ink-900/50">
                            {f.items.length} action{f.items.length > 1 ? "s" : ""}
                            <span className="text-brand-600 transition-transform group-open:rotate-45" aria-hidden>
                              +
                            </span>
                          </span>
                        </h3>
                      </summary>
                      <ul className="mt-5 space-y-4">
                        {f.items.map((it, i) => (
                          <li key={i} className="border-t border-ink-900/[0.06] pt-4 first:border-0 first:pt-0">
                            <p className="text-ink-900/80">
                              {it.goal}
                              {it.status === "developpement" && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-[10px] font-bold tracking-wide text-amber-800 uppercase">En cours de développement</span>
                              )}
                            </p>
                            {(it.profiles || it.menu) && (
                              <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-900/50">
                                {it.profiles && <span>Profils : {it.profiles.join(", ")}</span>}
                                {it.menu && <span>Menu : {it.menu}</span>}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
