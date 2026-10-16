import { absoluteUrl, contact, legal, SITE_NAME, SITE_URL, social } from "@/lib/site";
import { pageUpdated } from "@/lib/dates";
import { features } from "@/lib/features";
import { packs } from "@/lib/pricing";
import { faqGroups } from "@/lib/faq";
import { stripLinks, type FaqItem } from "@/lib/page-content";
import { GUIDE_AUTHOR } from "@/lib/guides";
import { AUDIENCE, EXTRA_CAPABILITIES, SOFTWARE_CATEGORY, SOFTWARE_DESCRIPTION } from "@/lib/positionnement";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const PUBLISHER_ID = `${SITE_URL}/#publisher`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software`;

/** Données structurées : JSON sérialisé avec « < » échappé, seul usage autorisé de dangerouslySetInnerHTML. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Adresse postale d'Alliance Consultants, telle que publiée sur allianceconsultants.net (ville et pays ; rue seulement si site.ts en contient une). */
const postalAddress = {
  "@type": "PostalAddress",
  ...(contact.address.streetAddress ? { streetAddress: contact.address.streetAddress } : {}),
  addressLocality: contact.address.locality,
  ...(contact.address.postalCode ? { postalCode: contact.address.postalCode } : {}),
  addressCountry: contact.address.country,
};

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
            description: `CliniquePro est un logiciel web de gestion pour ${AUDIENCE}, édité par ${legal.publisher} à Abidjan (Côte d'Ivoire).`,
            address: postalAddress,
            parentOrganization: { "@id": PUBLISHER_ID },
            areaServed: "CI",
            sameAs: [social.facebook],
            contactPoint: { "@type": "ContactPoint", telephone: contact.phone, email: contact.email, contactType: "sales", areaServed: "CI", availableLanguage: "fr" },
          },
          {
            // L'éditeur : mêmes coordonnées que sur allianceconsultants.net. Pas de « LocalBusiness » : aucune rue ni
            // horaire d'ouverture publics (la fiche locale supposerait un bureau ouvert au public).
            "@type": "Organization",
            "@id": PUBLISHER_ID,
            name: legal.publisher,
            url: legal.publisherSite,
            address: postalAddress,
            areaServed: "CI",
            brand: { "@id": ORGANIZATION_ID },
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
        applicationSubCategory: SOFTWARE_CATEGORY,
        operatingSystem: "Web",
        inLanguage: "fr",
        description: SOFTWARE_DESCRIPTION,
        audience: { "@type": "BusinessAudience", audienceType: AUDIENCE },
        featureList: [...features.map((f) => f.title), ...EXTRA_CAPABILITIES],
        publisher: { "@id": ORGANIZATION_ID },
        offers: packs.map((p) => ({
          "@type": "Offer",
          name: p.name,
          description: p.audience,
          url: absoluteUrl("/tarifs"),
          price: p.monthly,
          priceCurrency: "XOF",
          // Offre en vente, ouverte à la Côte d'Ivoire d'abord (décision de l'éditeur du 13 octobre 2026).
          availability: "https://schema.org/InStock",
          eligibleRegion: { "@type": "Country", name: "Côte d'Ivoire", identifier: "CI" },
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
export function WebPageJsonLd({
  path,
  name,
  description,
  dateModified,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
  type?: "WebPage" | "AboutPage" | "ContactPage";
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
        "@id": `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name,
        description,
        inLanguage: "fr",
        dateModified: dateModified ?? pageUpdated(path),
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

/** FAQ d'une page : les questions doivent rester identiques au texte affiché sur la page. */
export function FaqPageJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: stripLinks(f.a) } })),
      }}
    />
  );
}

/** Article d'un guide : l'auteur est l'équipe éditrice, jamais une personne inventée. */
export function ArticleJsonLd({
  path,
  headline,
  description,
  datePublished,
  dateModified,
}: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${absoluteUrl(path)}#article`,
        headline,
        description,
        inLanguage: "fr",
        datePublished,
        dateModified: dateModified ?? pageUpdated(path),
        mainEntityOfPage: absoluteUrl(path),
        image: absoluteUrl("/opengraph-image"),
        author: { "@type": "Organization", name: GUIDE_AUTHOR, url: SITE_URL },
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": SOFTWARE_ID },
      }}
    />
  );
}
