import { DemoButton } from "@/components/demo-button";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, FaqPageJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { FaqBlock, LinkCards, Prose, RichText, Sections } from "@/components/page-sections";
import { intentRoute } from "@/lib/intent-routes";
import type { IntentPage } from "@/lib/intent-pages";

/** Gabarit commun des pages d'intention : en-tête, sections, FAQ visible, liens croisés, données structurées. */
export function IntentPageView({ page }: { page: IntentPage }) {
  const route = intentRoute(page.slug);
  const links = page.related.map((slug) => {
    const r = intentRoute(slug);
    return { href: r.path, label: r.label, text: r.text };
  });
  return (
    <>
      <Navbar />
      <WebPageJsonLd path={route.path} name={`${page.title} | CliniquePro`} description={page.description} />
      <BreadcrumbJsonLd trail={[{ name: route.label, path: route.path }]} />
      <FaqPageJsonLd items={page.faq} />
      <main className="bg-paper">
        <PageHero eyebrow={page.eyebrow} title={page.h1}>
          {page.lead}
        </PageHero>
        <Prose>
          <Sections sections={page.sections} />
          <FaqBlock items={page.faq} />
          <section>
            <h2>Pour aller plus loin</h2>
            <LinkCards links={links} />
            <p>
              <RichText text="Consultez les [tarifs](/tarifs), la [FAQ](/faq) ou les [fonctionnalités](/fonctionnalites), ou [demandez une démonstration](/contact) de 30 minutes." />
            </p>
            <ul>
              {page.wiki.map((w) => (
                <li key={w.href}>
                  <RichText text={`[${w.label}](${w.href})`} />
                </li>
              ))}
            </ul>
          </section>
          <div className="mt-8">
            <DemoButton className="rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 px-8 py-4 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(18,196,106,0.7)]">
              Demander une démonstration
            </DemoButton>
          </div>
        </Prose>
      </main>
      <FinalCta />
    </>
  );
}
