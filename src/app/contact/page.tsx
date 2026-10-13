import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { BookingEmbed } from "@/components/booking-embed";
import { DemoButton } from "@/components/demo-button";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { PUBLISHED_BY, SERVICE_POINTS } from "@/lib/positionnement";
import { pageMetadata } from "@/lib/seo";
import { contact, legal, whatsappLink } from "@/lib/site";

const description = "Contactez l'équipe CliniquePro à Abidjan (téléphone, WhatsApp, e-mail) ou réservez une démonstration de 30 minutes du logiciel de gestion de clinique.";

export const metadata: Metadata = pageMetadata({ title: "Contact et démonstration à Abidjan", description, path: "/contact" });

export default function ContactPage() {
  const cards = [
    { icon: Phone, label: "Téléphone", value: contact.phone, href: contact.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: "Écrire sur WhatsApp", href: whatsappLink() },
    { icon: Mail, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Adresse", value: `${legal.publisher}, ${contact.city}` },
  ];
  return (
    <>
      <Navbar />
      <WebPageJsonLd path="/contact" type="ContactPage" name="Contacter CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "Contact", path: "/contact" }]} />
      <main className="bg-paper">
        <PageHero eyebrow="Contact" title={<>Parlons de <span className="text-gradient">votre structure.</span></>}>
          Clinique, centre de santé ou cabinet médical : échangeons 30 minutes pour voir CliniquePro appliqué à votre organisation.
        </PageHero>
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-leaf-500 text-white">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wide text-ink-900/50 uppercase">{label}</span>
                    <span className="block font-semibold break-all">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} className="flex items-center gap-4 rounded-[22px] border border-ink-900/[0.07] bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
                  {body}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 rounded-[22px] border border-ink-900/[0.07] bg-white p-5 shadow-sm">
                  {body}
                </div>
              );
            })}
          </div>
          <section className="mt-12 text-ink-900/75">
            <h2 className="font-display text-2xl font-bold text-ink-900">Qui vous répond</h2>
            <p className="mt-3">
              {PUBLISHED_BY}. Écrivez-nous par WhatsApp, par e-mail ou par téléphone, ou réservez directement un créneau ci-dessous. Vous pouvez aussi consulter les{" "}
              <Link href="/faq" className="font-semibold text-brand-600 hover:underline">questions fréquentes</Link>, les{" "}
              <Link href="/tarifs" className="font-semibold text-brand-600 hover:underline">tarifs</Link> et la page{" "}
              <Link href="/a-propos" className="font-semibold text-brand-600 hover:underline">À propos</Link>.
            </p>
            <ul className="mt-4 grid gap-1.5 sm:grid-cols-2 [&_li]:ml-5 [&_li]:list-disc">
              {SERVICE_POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
          <div className="mt-10 overflow-hidden rounded-[28px] bg-ink-900">
            <BookingEmbed />
          </div>
          <div className="mt-8 text-center">
            <DemoButton className="rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 px-8 py-4 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(18,196,106,0.7)]">
              Demander une démonstration
            </DemoButton>
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
