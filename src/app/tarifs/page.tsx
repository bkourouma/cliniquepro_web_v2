import type { Metadata } from "next";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { FaqBlock, Prose, RichText } from "@/components/page-sections";
import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/pricing";
import { pricingFaq } from "@/lib/faq";
import { features, scopeLabel, type ModuleScope } from "@/lib/features";
import { fcfa } from "@/lib/format";
import { SERVICE_POINTS } from "@/lib/positionnement";
import { COMBO_DISCOUNT, comboPrice, packs, TRIAL_TEXT } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

// Les prix viennent de pricing.ts : titre, description et page restent cohérents (toujours « HT par mois »).
const [operationnel, financier] = packs;
const combo = comboPrice(packs);
const description = `${operationnel.name} ${fcfa(operationnel.monthly)} HT/mois, ${financier.name.toLowerCase()} ${fcfa(financier.monthly)} HT/mois. Premier mois offert, sans engagement.`;

export const metadata: Metadata = pageMetadata({ title: `Tarifs : dès ${fcfa(operationnel.monthly)} HT par mois`, description, path: "/tarifs" });

const modulesOf = (scope: ModuleScope) => features.filter((f) => f.scope === scope).map((f) => f.title);

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <SoftwareJsonLd />
      <WebPageJsonLd path="/tarifs" name="Tarifs CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "Tarifs", path: "/tarifs" }]} />
      <FaqPageJsonLd items={pricingFaq} />
      <main>
        <PageHero eyebrow="Tarifs" title={<>Deux packs, <span className="text-gradient">un seul outil.</span></>}>
          {operationnel.name} à {fcfa(operationnel.monthly)} HT par mois, {financier.name.toLowerCase()} à {fcfa(financier.monthly)} HT par mois.
        </PageHero>
        <Pricing comparisonOpen />
        <div className="bg-paper">
          <Prose>
            <section>
              <h2>Ce qui est inclus dans l&apos;abonnement</h2>
              <p>L&apos;abonnement comprend l&apos;accompagnement suivant.</p>
              <ul>
                <li>{TRIAL_TEXT}.</li>
                {SERVICE_POINTS.filter((p) => p !== "Abonnement sans engagement").map((p) => (
                  <li key={p}>{p}.</li>
                ))}
                <li>Hébergement des données au choix : cloud, ou serveur local installé dans la clinique.</li>
              </ul>
            </section>

            <section>
              <h2>Ce que comprend chaque pack</h2>
              {(["operationnel", "financier", "commun"] as const).map((scope) => (
                <div key={scope}>
                  <h3>
                    {scopeLabel[scope]}
                    {scope !== "commun" && ` : ${fcfa(packs.find((p) => p.id === scope)!.monthly)} HT par mois`}
                  </h3>
                  <ul>
                    {modulesOf(scope).map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p>
                <RichText text="Chaque module est décrit sur la page des [fonctionnalités](/fonctionnalites), et action par action dans le [wiki](/wiki)." />
              </p>
            </section>

            <section>
              <h2>Quel pack pour quelle structure ?</h2>
              <p>
                <RichText text={`Un cabinet médical peut démarrer avec la ${operationnel.name} seule : agenda, dossier patient, consultations, ordonnances et prise en charge par l'assurance. Une clinique ou un centre de santé qui veut aussi suivre la caisse, la facturation, les honoraires des médecins et la comptabilité y associe la ${financier.name}. Voir le [logiciel de cabinet médical](/logiciel-cabinet-medical), le [logiciel pour centre de santé](/logiciel-centre-de-sante) et le [logiciel de gestion de clinique](/logiciel-gestion-clinique-cote-ivoire).`} />
              </p>
            </section>

            <section>
              <h2>Prix, taxes et facturation</h2>
              <p>
                <RichText text="Les prix sont exprimés en FCFA, hors taxes, par mois. Aucun prix toutes taxes comprises n'est publié : seul le devis ou le contrat signé fait foi. Les prix sont publics, vous n'avez pas besoin de demander un devis pour les connaître." />
              </p>
            </section>

            <section>
              <h2>Combiner les deux packs</h2>
              <p>
                Les deux packs sont complémentaires. Souscrits ensemble, ils bénéficient de {Math.round(COMBO_DISCOUNT * 100)} % de remise sur le moins cher : {fcfa(combo.total)} HT par mois au lieu de{" "}
                {fcfa(combo.subtotal)}, soit {fcfa(combo.discount)} d&apos;économie chaque mois.
              </p>
            </section>

            <FaqBlock items={pricingFaq} title="Questions sur les prix" />
          </Prose>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
