import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { FinalCta } from "@/components/final-cta";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { faqGroups } from "@/lib/faq";
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
        </div>
      </main>
      <FinalCta />
    </>
  );
}
