import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { FinalCta } from "@/components/final-cta";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { faqGroups } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";

const description = "Tarifs, packs, essai gratuit, assurances, caisse, comptabilité : les réponses aux questions fréquentes sur le logiciel de gestion de clinique CliniquePro.";

export const metadata: Metadata = pageMetadata({ title: "FAQ : packs, assurances, caisse et comptabilité", description, path: "/faq" });

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <FaqJsonLd />
      <WebPageJsonLd path="/faq" name="Questions fréquentes sur CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "FAQ", path: "/faq" }]} />
      <main className="bg-paper">
        <PageHero eyebrow="FAQ" title="Vos questions sur CliniquePro">
          Packs, fonctionnalités, sécurité, démarrage : les réponses aux questions les plus fréquentes.
        </PageHero>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <FaqList groups={faqGroups} />
        </div>
      </main>
      <FinalCta />
    </>
  );
}
