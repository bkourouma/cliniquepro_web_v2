import type { Metadata } from "next";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { LinkCards, Prose, RichText } from "@/components/page-sections";
import { GUIDE_AUTHOR, guidePath, guides } from "@/lib/guides";
import { GUIDES_PATH } from "@/lib/intent-routes";
import { pageMetadata } from "@/lib/seo";

const description = "Guides de gestion pour cliniques, centres de santé et cabinets médicaux : choisir un logiciel, comparer les options, éviter les erreurs courantes.";

export const metadata: Metadata = pageMetadata({ title: "Guides pour choisir un logiciel de clinique", description, path: GUIDES_PATH });

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <WebPageJsonLd path={GUIDES_PATH} name="Guides CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "Guides", path: GUIDES_PATH }]} />
      <main className="bg-paper">
        <PageHero eyebrow="Guides" title="Guides pour cliniques, centres de santé et cabinets">
          Des repères concrets pour choisir et mettre en place un logiciel de gestion, rédigés par {GUIDE_AUTHOR}.
        </PageHero>
        <Prose>
          <section>
            <h2>Les guides</h2>
            <p>
              Ces guides parlent de gestion d&apos;établissement : choix d&apos;un outil, organisation, coûts. Ils ne donnent aucun conseil médical. Pour voir le produit,
              consultez les <RichText text="[fonctionnalités](/fonctionnalites)" />, les <RichText text="[tarifs](/tarifs)" /> ou la <RichText text="[FAQ](/faq)" />.
            </p>
            <p>
              Chaque guide propose des critères de choix et une liste de questions à poser à n&apos;importe quel éditeur de logiciel. Les prix cités sont ceux de la page des tarifs : aucun chiffre ne vient d&apos;une source extérieure. Pour une question précise, écrivez-nous par WhatsApp ou réservez une démonstration de 30 minutes sur la page <RichText text="[contact](/contact)" />.
            </p>
            <LinkCards links={guides.map((g) => ({ href: guidePath(g.slug), label: g.h1, text: g.description }))} />
          </section>
        </Prose>
      </main>
      <FinalCta />
    </>
  );
}
