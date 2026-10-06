import { absoluteUrl, contact, legal, SITE_NAME, SITE_UPDATED, SITE_URL } from "@/lib/site";
import { features } from "@/lib/features";
import { packs } from "@/lib/pricing";
import { faqGroups } from "@/lib/faq";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software`;

/** Données structurées : JSON sérialisé avec « < » échappé, seul usage autorisé de dangerouslySetInnerHTML. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Organisation et site, déclarés une fois pour toutes dans le layout (les autres blocs s'y réfèrent par @id). */
export function SiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo/logo-cliniquepro.png`,
            description: "Éditeur du logiciel web de gestion de clinique ophtalmologique CliniquePro.",
            address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
            parentOrganization: { "@type": "Organization", name: legal.publisher, url: legal.publisherSite },
            areaServed: "CI",
            contactPoint: { "@type": "ContactPoint", telephone: contact.phone, email: contact.email, contactType: "sales", areaServed: "CI", availableLanguage: "fr" },
          },
          { "@type": "WebSite", "@id": WEBSITE_ID, url: SITE_URL, name: SITE_NAME, inLanguage: "fr", publisher: { "@id": ORGANIZATION_ID } },
        ],
      }}
    />
  );
}

/** Le logiciel et ses deux offres : prix mensuels hors taxes (période et TVA explicites pour les moteurs de réponse). */
export function SoftwareJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": SOFTWARE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Logiciel de gestion de clinique ophtalmologique",
        operatingSystem: "Web",
        inLanguage: "fr",
        description:
          "Application web de gestion de clinique ophtalmologique : patients, rendez-vous, consultations, examens, assurances, facturation, caisse, honoraires médecins et comptabilité.",
        featureList: features.map((f) => f.title),
        publisher: { "@id": ORGANIZATION_ID },
        offers: packs.map((p) => ({
          "@type": "Offer",
          name: p.name,
          description: p.audience,
          url: absoluteUrl("/tarifs"),
          price: p.monthly,
          priceCurrency: "XOF",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: p.monthly,
            priceCurrency: "XOF",
            unitCode: "MON",
            billingDuration: 1,
            valueAddedTaxIncluded: false,
          },
        })),
      }}
    />
  );
}

/** Fil d'Ariane : l'accueil est ajouté automatiquement en tête. */
export function BreadcrumbJsonLd({ trail }: { trail: { name: string; path: string }[] }) {
  const items = [{ name: "Accueil", path: "/" }, ...trail];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
      }}
    />
  );
}

/** Description d'une page (date de dernière modification comprise), rattachée au site et au logiciel. */
export function WebPageJsonLd({ path, name, description, dateModified = SITE_UPDATED }: { path: string; name: string; description: string; dateModified?: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name,
        description,
        inLanguage: "fr",
        dateModified,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": SOFTWARE_ID },
      }}
    />
  );
}

/** Toute la FAQ : doit rester identique aux questions affichées sur /faq. */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqGroups.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }}
    />
  );
}
