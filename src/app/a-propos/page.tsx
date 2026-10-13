import type { Metadata } from "next";
import Link from "next/link";
import { DemoButton } from "@/components/demo-button";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { roles } from "@/lib/content";
import { features } from "@/lib/features";
import { fcfa } from "@/lib/format";
import { packs, TRIAL_TEXT } from "@/lib/pricing";
import { AUDIENCE, DATA_LAW, NOT_COVERED, PUBLISHED_BY, SERVICE_POINTS } from "@/lib/positionnement";
import { pageMetadata } from "@/lib/seo";
import { contact, legal, social } from "@/lib/site";
import { wikiDomains, wikiTotal } from "@/lib/wiki";

const description =
  "CliniquePro est édité par Alliance Consultants à Abidjan : à qui il s'adresse, ce qu'il couvre, ce qu'il ne fait pas et ce qui est en développement.";

export const metadata: Metadata = pageMetadata({ title: "À propos : l'éditeur Alliance Consultants", description, path: "/a-propos" });

// Actions du wiki signalées « en cours de développement » : annoncées telles quelles, jamais présentées comme disponibles.
const inDevelopment = wikiDomains.reduce(
  (n, d) => n + d.modules.reduce((k, m) => k + m.features.reduce((j, f) => j + f.items.filter((i) => i.status === "developpement").length, 0), 0),
  0,
);

const link = "font-semibold text-brand-600 hover:underline";

export default function AProposPage() {
  return (
    <>
      <Navbar />
      <WebPageJsonLd path="/a-propos" type="AboutPage" name="À propos de CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "À propos", path: "/a-propos" }]} />
      <main className="bg-paper">
        <PageHero eyebrow="À propos" title={<>Un logiciel de gestion pensé pour <span className="text-gradient">les cliniques, centres de santé et cabinets.</span></>}>
          CliniquePro réunit dans une seule application web la gestion des patients, des consultations, des assurances, de la caisse et de la comptabilité, pour toutes les spécialités.
        </PageHero>

        <article className="mx-auto max-w-3xl px-5 py-16 text-ink-900/75 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-ink-900 first:[&_h2]:mt-0 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:text-ink-900 [&_ul]:mb-4 [&_ul]:space-y-1.5">
          <h2>Ce qu&apos;est CliniquePro</h2>
          <p>
            <strong>CliniquePro est un logiciel web de gestion pour {AUDIENCE}, toutes spécialités.</strong> Il centralise le parcours du patient dans un seul outil, utilisé par
            l&apos;accueil, les médecins, la caisse et la direction, chacun avec les droits d&apos;accès de son métier.
          </p>
          <p>
            L&apos;application couvre {features.length} modules : du dossier patient et de l&apos;agenda jusqu&apos;à la facturation, aux honoraires des médecins et à la
            comptabilité. Les modèles de consultation sont paramétrables pour toutes les spécialités ; l&apos;ophtalmologie est la plus détaillée, avec ses examens intégrés
            (acuité visuelle, pression intraoculaire, réfraction, OCT, champ visuel, biométrie). La liste complète est dans les{" "}
            <Link href="/fonctionnalites" className={link}>fonctionnalités</Link>.
          </p>

          <h2>À qui il s&apos;adresse</h2>
          <p>
            Aux {AUDIENCE} qui veulent suivre leur activité sans double saisie, en commençant par la Côte d&apos;Ivoire. La <Link href="/faq" className={link}>FAQ</Link> répond aux questions les plus fréquentes. L&apos;application distingue quatre espaces de travail :
          </p>
          <ul>
            {roles.map((r) => (
              <li key={r.id}>
                <strong>{r.label}</strong> : {r.headline}
              </li>
            ))}
          </ul>

          <h2>Ce qui compte au quotidien</h2>
          <ul>
            <li>
              <strong>Saisie hors connexion.</strong> La saisie peut continuer sans Internet, puis elle est synchronisée au retour du réseau.
            </li>
            <li>
              <strong>Hébergement au choix du client.</strong> Dans le cloud, ou sur un serveur local installé dans la clinique.
            </li>
            <li>
              <strong>Plusieurs sites ou cabinets.</strong> Ils se gèrent sous un même compte.
            </li>
            <li>
              <strong>Assurances, mutuelles et Mobile Money.</strong> La prise en charge est suivie prestation par prestation, et le paiement Mobile Money est intégré à la caisse.
            </li>
            <li>
              <strong>Fonctions d&apos;IA optionnelles.</strong> Elles reposent sur un service tiers, servent d&apos;aide et ne posent aucun diagnostic.
            </li>
            <li>
              <strong>Données personnelles.</strong> CliniquePro respecte la {DATA_LAW}.
            </li>
          </ul>

          <h2>Ce que CliniquePro ne fait pas</h2>
          <p>
            Par souci de clarté : CliniquePro ne couvre pas {NOT_COVERED[0]}, {NOT_COVERED[1]} ni {NOT_COVERED[2]}. Il couvre le parcours de la consultation à la comptabilité.
          </p>

          <h2>Mise en route et support</h2>
          <ul>
            {SERVICE_POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <h2>Qui édite CliniquePro</h2>
          <p>
            {PUBLISHED_BY}. {legal.publisher} est une société basée à {contact.city} (RCCM {legal.rccm}, compte contribuable {legal.taxId}). Le
            directeur de la publication est {legal.publicationDirector}. Les informations complètes figurent dans les{" "}
            <Link href="/mentions-legales" className={link}>mentions légales</Link> ; le site de l&apos;éditeur est{" "}
            <a href={legal.publisherSite} target="_blank" rel="noopener noreferrer" className={link}>{legal.publisherSite.replace("https://", "")}</a>.
          </p>

          <h2>Notre façon de présenter le produit</h2>
          <ul>
            <li>
              <strong>Nous ne présentons que ce que l&apos;application fait.</strong> Le <Link href="/wiki" className={link}>wiki</Link> détaille {wikiTotal} actions, domaine par
              domaine.
              {inDevelopment > 0 && ` ${inDevelopment} d'entre elles sont signalées « en cours de développement » : elles ne sont pas présentées comme disponibles.`}
            </li>
            <li>
              <strong>Des prix publics.</strong> {packs.map((p) => `${p.name} : ${fcfa(p.monthly)} HT par mois`).join(" ; ")}. {TRIAL_TEXT}. Détail sur la page{" "}
              <Link href="/tarifs" className={link}>tarifs</Link>.
            </li>
            <li>
              <strong>Une démonstration avant tout engagement.</strong> Trente minutes pour voir CliniquePro appliqué à l&apos;organisation de votre clinique, de votre centre ou de votre cabinet.
            </li>
          </ul>

          <h2>Nous contacter</h2>
          <ul>
            <li>
              E-mail : <a href={`mailto:${contact.email}`} className={link}>{contact.email}</a>
            </li>
            <li>
              Téléphone et WhatsApp : <a href={contact.phoneHref} className={link}>{contact.phone}</a>
            </li>
            <li>
              Facebook : <a href={social.facebook} target="_blank" rel="noopener noreferrer me" className={link}>page CliniquePro</a>
            </li>
            <li>Adresse : {contact.city}</li>
          </ul>
          <div className="mt-8">
            <DemoButton className="rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 px-8 py-4 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(18,196,106,0.7)]">
              Demander une démonstration
            </DemoButton>
          </div>
        </article>
      </main>
      <FinalCta />
    </>
  );
}
