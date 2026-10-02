import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { contact, legal, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales — CliniquePro",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="À renseigner">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>{SITE_URL.replace("https://", "")}</strong> est édité par <strong>{legal.publisher}</strong> ({legal.legalForm}).
      </p>
      <ul>
        <li>RCCM : {legal.rccm}</li>
        <li>Numéro de compte contribuable : {legal.taxId}</li>
        <li>Directeur de la publication : {legal.publicationDirector}</li>
        <li>Adresse : {contact.city}</li>
        <li>
          Téléphone : <a href={contact.phoneHref}>{contact.phone}</a>
        </li>
        <li>
          E-mail : <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
      </ul>
      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par {legal.host}, {legal.hostAddress}.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus du site (textes, logos, interfaces, images) est la propriété de l&apos;éditeur ou de ses partenaires. Toute reproduction sans autorisation écrite préalable est interdite.
      </p>
      <h2>Responsabilité</h2>
      <p>
        Les informations présentées sont données à titre indicatif. Les fonctionnalités et les tarifs peuvent évoluer ; la démonstration et le devis font foi.
      </p>
    </LegalPage>
  );
}
