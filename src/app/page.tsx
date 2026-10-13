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
import { SOFTWARE_DESCRIPTION } from "@/lib/positionnement";

export default function Home() {
  return (
    <>
      <Navbar />
      <SoftwareJsonLd />
      <WebPageJsonLd
        path="/"
        name="CliniquePro : logiciel de gestion de clinique, centre de santé et cabinet médical"
        description={SOFTWARE_DESCRIPTION}
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
