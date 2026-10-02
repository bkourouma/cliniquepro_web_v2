import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité — CliniquePro",
  alternates: { canonical: "/confidentialite" },
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="À renseigner">
      <h2>Données collectées sur ce site</h2>
      <p>
        Lorsque vous demandez une démonstration, nous collectons les informations que vous saisissez : structure, taille de l&apos;équipe médicale, pack qui vous intéresse, fonction, nom, clinique, e-mail professionnel et téléphone.
      </p>
      <h2>Finalité</h2>
      <p>Ces informations servent uniquement à organiser votre démonstration et à vous recontacter au sujet de CliniquePro.</p>
      <h2>Conservation et destinataires</h2>
      <p>
        Les demandes sont transmises à l&apos;équipe commerciale de l&apos;éditeur. La durée de conservation et les éventuels sous-traitants sont à préciser par l&apos;éditeur.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant à <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
      <h2>Données de santé</h2>
      <p>
        Ce site vitrine ne collecte aucune donnée de santé. Les données traitées dans l&apos;application CliniquePro par les cliniques clientes font l&apos;objet d&apos;engagements contractuels distincts.
      </p>
    </LegalPage>
  );
}
