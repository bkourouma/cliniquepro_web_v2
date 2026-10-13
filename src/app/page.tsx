import { Ecosystem } from "@/components/ecosystem";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HomeFaq } from "@/components/home-faq";
import { SoftwareJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Journey } from "@/components/journey";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Pricing } from "@/components/pricing";
import { Roles } from "@/components/roles";

export default function Home() {
  return (
    <>
      <Navbar />
      <SoftwareJsonLd />
      <WebPageJsonLd
        path="/"
        name="CliniquePro — Logiciel de gestion pour cliniques ophtalmologiques"
        description="Logiciel web de gestion de clinique ophtalmologique : patients, consultations, examens, assurances, caisse, facturation, honoraires et comptabilité."
      />
      <main>
        <Hero />
        <Marquee />
        <Roles />
        <Ecosystem />
        <Journey />
        <Pricing />
        <HomeFaq />
      </main>
      <FinalCta />
    </>
  );
}
