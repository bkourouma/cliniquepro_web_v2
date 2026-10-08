import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { contact, legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité — CliniquePro",
  description: "Données collectées, finalités, durée de conservation et droits des personnes sur le site CliniquePro.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="6 octobre 2026">
      <p>
        {legal.publisher}, éditeur de CliniquePro, s&apos;engage à protéger vos données personnelles conformément à la loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Demande de démonstration</strong> : type de structure, taille de l&apos;équipe médicale, pack qui vous intéresse, fonction, nom, clinique, e-mail et téléphone ; ou, si un calendrier de réservation est affiché, nom, e-mail et créneau choisi.
        </li>
        <li>
          <strong>Échanges par WhatsApp, téléphone ou e-mail</strong> : les informations que vous choisissez de nous transmettre.
        </li>
      </ul>
      <p>
        Ce site vitrine ne collecte <strong>aucune donnée de santé</strong>. Les données traitées dans l&apos;application CliniquePro par les cliniques clientes relèvent d&apos;engagements contractuels distincts.
      </p>

      <h2>Finalités</h2>
      <ul>
        <li>organiser et préparer la démonstration demandée ;</li>
        <li>répondre à vos questions et assurer le suivi commercial de votre demande ;</li>
        <li>vous envoyer une proposition ou un devis, si vous le demandez.</li>
      </ul>
      <p>Vos données ne sont ni vendues ni cédées à des tiers à des fins commerciales.</p>

      <h2>Destinataires et sous-traitants</h2>
      <p>
        Les données sont destinées à l&apos;équipe commerciale de CliniquePro. Elles peuvent être traitées, pour notre compte, par des prestataires techniques : notre hébergeur {legal.host}, un outil de prise de rendez-vous le cas échéant, et nos outils internes de suivi des demandes. Certains de ces prestataires peuvent être situés hors de Côte d&apos;Ivoire.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données des prospects sont conservées au maximum 3 ans après le dernier contact, puis supprimées. Les données des clients sont conservées pendant la durée de la relation contractuelle et les délais légaux qui s&apos;y appliquent.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise pas de cookies publicitaires. Il mesure sa fréquentation avec Umami, un outil libre que nous hébergeons nous-mêmes : sans cookie, sans conserver votre adresse IP, et sans envoyer de données à un service de mesure d&apos;audience tiers. Il enregistre les pages consultées, la page d&apos;origine, le pays, la région et la ville approximatifs, ainsi que le type d&apos;appareil, de navigateur et d&apos;écran. Un éventuel calendrier de réservation intégré peut déposer ses propres cookies nécessaires à son fonctionnement.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données, ou vous opposer à leur traitement, en écrivant à <a href={`mailto:${contact.email}`}>{contact.email}</a>. Vous pouvez également saisir l&apos;autorité de protection des données de Côte d&apos;Ivoire (ARTCI).
      </p>
    </LegalPage>
  );
}
