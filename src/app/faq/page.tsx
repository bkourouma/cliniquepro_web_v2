import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { FinalCta } from "@/components/final-cta";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { faqGroups } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ — CliniquePro",
  description: "Tarifs, packs, fonctionnalités, assurances, caisse, comptabilité : les réponses aux questions fréquentes sur CliniquePro.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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
