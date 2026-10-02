import type { Metadata } from "next";
import { FinalCta } from "@/components/final-cta";
import { SoftwareJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/pricing";

export const metadata: Metadata = {
  title: "Tarifs — CliniquePro",
  description: "Deux packs : Gestion opérationnelle (35 000 FCFA/mois) et Gestion financière et comptable (45 000 FCFA/mois). Comparez et composez votre offre.",
  alternates: { canonical: "/tarifs" },
};

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <SoftwareJsonLd />
      <main>
        <PageHero eyebrow="Tarifs" title={<>Deux packs, <span className="text-gradient">un seul outil.</span></>}>
          Gestion opérationnelle à 35 000 FCFA par mois, gestion financière et comptable à 45 000 FCFA par mois.
        </PageHero>
        <Pricing comparisonOpen />
      </main>
      <FinalCta />
    </>
  );
}
