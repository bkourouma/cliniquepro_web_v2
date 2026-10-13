import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import { contact, legal, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Mentions légales", description: "Éditeur, hébergeur et conditions d'utilisation du site CliniquePro.", path: "/mentions-legales" });

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="2 octobre 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>{SITE_URL.replace("https://", "")}</strong> est édité par <strong>{legal.publisher}</strong>, {contact.city}.
      </p>
      <ul>
        <li>RCCM : {legal.rccm}</li>
        <li>Compte contribuable (CC) : {legal.taxId}</li>
        <li>Directeur de la publication : {legal.publicationDirector}</li>
        <li>Téléphone : {contact.phone}</li>
        <li>
          E-mail : <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        <li>
          Site : <a href={legal.publisherSite}>{legal.publisherSite.replace("https://", "")}</a>
        </li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <strong>{legal.host}</strong>, {legal.hostAddress} (<a href={legal.hostSite}>{legal.hostSite.replace("https://", "")}</a>).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus du site (textes, visuels, logo, interfaces, code) est la propriété de {legal.publisher} ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite. Le nom WhatsApp est une marque de son propriétaire, citée pour décrire un canal de communication.
      </p>

      <h2>Tarifs</h2>
      <p>
        Les prix affichés sont exprimés en francs CFA hors taxes. Seul le devis ou le contrat signé fait foi. Le total combiné des packs est une estimation indicative.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données collectées sur ce site est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </LegalPage>
  );
}
