import type { Metadata } from "next";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, SoftwareJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/pricing";
import { packs } from "@/lib/pricing";
import { fcfa } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

// Les prix viennent de pricing.ts : titre, description et page restent cohérents (toujours « HT par mois »).
const [operationnel, financier] = packs;
const description = `Deux packs, prix hors taxes par mois : ${operationnel.name} ${fcfa(operationnel.monthly)} HT, ${financier.name} ${fcfa(financier.monthly)} HT. Premier mois offert, sans engagement. Comparez et composez votre offre.`;

export const metadata: Metadata = pageMetadata({ title: `Tarifs : dès ${fcfa(operationnel.monthly)} HT par mois`, description, path: "/tarifs" });

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <SoftwareJsonLd />
      <WebPageJsonLd path="/tarifs" name="Tarifs CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "Tarifs", path: "/tarifs" }]} />
      <main>
        <PageHero eyebrow="Tarifs" title={<>Deux packs, <span className="text-gradient">un seul outil.</span></>}>
          Gestion opérationnelle à 35 000 FCFA HT par mois, gestion financière et comptable à 45 000 FCFA HT par mois.
        </PageHero>
        <Pricing comparisonOpen />
      </main>
      <FinalCta />
    </>
  );
}
