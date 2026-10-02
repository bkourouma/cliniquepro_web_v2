import { Ecosystem } from "@/components/ecosystem";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HomeFaq } from "@/components/home-faq";
import { SoftwareJsonLd } from "@/components/json-ld";
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
