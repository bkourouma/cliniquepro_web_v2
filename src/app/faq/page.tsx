import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { FinalCta } from "@/components/final-cta";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { faqGroups } from "@/lib/faq";
import { guidePath, guides } from "@/lib/guides";
import { intentRoutes } from "@/lib/intent-routes";
import { pageMetadata } from "@/lib/seo";

const description = "Réponses sur CliniquePro : packs, prise en charge assurance, caisse, saisie hors ligne, hébergement des données, formation et démonstration.";

export const metadata: Metadata = pageMetadata({ title: "FAQ : assurance, caisse, hors ligne et tarifs", description, path: "/faq" });

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <FaqJsonLd />
      <WebPageJsonLd path="/faq" name="Questions fréquentes sur CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "FAQ", path: "/faq" }]} />
      <main className="bg-paper">
        <PageHero eyebrow="FAQ" title="Vos questions sur CliniquePro">
          Structures concernées, spécialités, hors connexion, hébergement, assurance, caisse, tarifs, mise en route et ce que CliniquePro ne fait pas : les réponses aux questions les plus fréquentes.
        </PageHero>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <FaqList groups={faqGroups} />
          <section className="rounded-[22px] border border-ink-900/[0.07] bg-white p-6 text-ink-900/75">
            <h2 className="font-display text-2xl font-bold text-ink-900">Pour aller plus loin</h2>
            <p className="mt-3">
              Une page détaillée existe pour chaque besoin :{" "}
              {intentRoutes.map((r, i) => (
                <span key={r.slug}>
                  {i > 0 && ", "}
                  <Link href={r.path} className="font-semibold text-brand-600 hover:underline">{r.label.toLowerCase()}</Link>
                </span>
              ))}
              . Pour choisir entre un logiciel prêt à l&apos;emploi et un développement sur mesure, lisez{" "}
              <Link href={guidePath(guides[0].slug)} className="font-semibold text-brand-600 hover:underline">notre guide</Link>. Les prix sont sur la page des{" "}
              <Link href="/tarifs" className="font-semibold text-brand-600 hover:underline">tarifs</Link>.
            </p>
          </section>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
