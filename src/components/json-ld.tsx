import { contact, SITE_NAME, SITE_URL } from "@/lib/site";
import { packs } from "@/lib/pricing";

/** Données structurées : JSON sérialisé avec « < » échappé, seul usage autorisé de dangerouslySetInnerHTML. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo/logo-cliniquepro.png`,
        contactPoint: { "@type": "ContactPoint", telephone: contact.phone, email: contact.email, contactType: "sales", areaServed: "CI", availableLanguage: "fr" },
      }}
    />
  );
}

export function SoftwareJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Application web de gestion de clinique ophtalmologique : patients, rendez-vous, consultations, examens, assurances, facturation, caisse, honoraires médecins et comptabilité.",
        offers: packs.map((p) => ({ "@type": "Offer", name: p.name, price: p.monthly, priceCurrency: "XOF", description: p.audience })),
      }}
    />
  );
}
