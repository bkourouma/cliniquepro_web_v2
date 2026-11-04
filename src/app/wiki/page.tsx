import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { WikiSearch } from "@/components/wiki/wiki-search";
import { scopeLabel } from "@/lib/features";
import { functionRoutes } from "@/lib/intent-routes";
import { pageMetadata } from "@/lib/seo";
import { countItems, searchIndex, wikiDomains, wikiTotal, WIKI_UPDATED_ON } from "@/lib/wiki";

const description = `${wikiTotal} actions du logiciel de gestion de clinique CliniquePro, détaillées par domaine : patients, accueil, consultations, assurances, caisse, comptabilité.`;

/** Quelques actions clés par domaine : titres repris de l'inventaire (wiki.generated.json). */
const keyActions: Record<string, string[]> = {
  patients: ["Rechercher / lister les patients", "Détecter les doublons avant création", "Modifier un patient", "Archiver (supprimer) un patient"],
  reception: ["Créer une réception", "Envoyer la demande à l'assurance", "Ajouter une prestation à une réception", "Consultation de suivi gratuite"],
  clinique: ["File de consultation", "Étape Examens", "Étape Certificat", "Assistance IA de consultation"],
  assurances: ["Lister les compagnies", "Rechercher une assurance", "Créer une compagnie", "Créer un compte assureur"],
  medecins: ["Lister les médecins", "Créer un médecin", "Téléverser la photo", "Téléverser la signature"],
  argent: ["Ouverture de caisse", "Encaissement", "Fermeture de caisse", "Remboursements"],
  documents: ["Imprimer l'ordonnance médicale", "Télécharger le bulletin d'examens", "Imprimer la liste d'examens demandés", "Catalogue des types de certificat"],
  communication: ["Rechercher des contacts", "Rédiger le message", "Envoyer un message WhatsApp manuel", "Exporter le rapport d'envoi"],
  pilotage: ["Afficher le tableau de bord", "Rendez-vous du jour", "Alertes / notifications", "Indicateurs du médecin"],
  administration: ["Créer un utilisateur", "Réinitialiser un mot de passe", "Désactiver un utilisateur", "Consulter le journal d'audit"],
};

export const metadata: Metadata = pageMetadata({ title: `Fonctionnalités logiciel clinique : ${wikiTotal} actions`, description, path: "/wiki" });

export default function WikiPage() {
  return (
    <>
      <Navbar />
      <WebPageJsonLd path="/wiki" name="Wiki des fonctionnalités de CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "Wiki des fonctionnalités", path: "/wiki" }]} />
      <main className="bg-paper">
        <PageHero eyebrow="Wiki des fonctionnalités" title={<>Chaque action de l&apos;application, <span className="text-gradient">une par une.</span></>}>
          {wikiTotal} fonctionnalités détaillées du logiciel de gestion de clinique, regroupées par domaine, avec les profils qui y ont accès. Inventaire arrêté au {WIKI_UPDATED_ON}. Pour une vue d&apos;ensemble par module, voir les <Link href="/fonctionnalites" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">fonctionnalités</Link> et les <Link href="/tarifs" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">tarifs</Link>.
        </PageHero>
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="mb-10 max-w-3xl space-y-4 text-ink-900/70">
            <p>
              Ce wiki est la liste complète des {wikiTotal} actions que l&apos;on peut faire dans CliniquePro : chercher un patient, créer une réception, ouvrir une caisse, imprimer une ordonnance ou envoyer un message WhatsApp. Chaque action est décrite par son objectif et les profils qui y ont accès. Les actions sont regroupées en {wikiDomains.length} domaines, du dossier patient jusqu&apos;à l&apos;administration.
            </p>
            <p>
              Pour évaluer un logiciel de clinique, parcourez cette liste avec votre propre organisation en tête : repérez les domaines qui correspondent à vos tâches quotidiennes, comparez les actions décrites à vos pratiques et vérifiez, pour chaque profil, ce qu&apos;il peut faire. La recherche ci-dessous permet de tester rapidement un besoin précis. Chaque domaine ouvre sa page détaillée.
            </p>
          </div>
          <p className="mb-10 text-ink-900/70">
            Le wiki est un inventaire détaillé. Pour une présentation par besoin, voir les pages{" "}
            {functionRoutes.map((r, i) => (
              <span key={r.slug}>
                {i > 0 && (i === functionRoutes.length - 1 ? " et " : ", ")}
                <Link href={r.path} className="font-semibold text-brand-600 hover:underline">{r.label.toLowerCase()}</Link>
              </span>
            ))}
            .
          </p>
          <WikiSearch entries={searchIndex} />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {wikiDomains.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 0.06} className="h-full">
                <Link href={`/wiki/${d.slug}`} className="group flex h-full flex-col rounded-[24px] border border-ink-900/[0.07] bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                  <span className="w-fit rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-bold tracking-wide text-brand-600 uppercase">{scopeLabel[d.pack]}</span>
                  <h2 className="mt-4 font-display text-2xl font-bold">{d.title}</h2>
                  <p className="mt-2 text-sm text-ink-900/60">{d.summary}</p>
                  <ul className="mt-3 flex-1 list-disc space-y-1 pl-5 text-sm text-ink-900/70">
                    {(keyActions[d.slug] ?? []).map((a) => <li key={a}>{a}</li>)}
                  </ul>
                  <p className="mt-5 flex items-center justify-between text-sm font-semibold text-brand-600">
                    {countItems(d)} actions
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
