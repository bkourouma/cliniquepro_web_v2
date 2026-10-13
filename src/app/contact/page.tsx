import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BookingEmbed } from "@/components/booking-embed";
import { DemoButton } from "@/components/demo-button";
import { FinalCta } from "@/components/final-cta";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";
import { contact, whatsappLink } from "@/lib/site";

const description = "Contactez l'équipe CliniquePro à Abidjan (téléphone, WhatsApp, e-mail) ou réservez une démonstration de 30 minutes du logiciel de gestion de clinique.";

export const metadata: Metadata = pageMetadata({ title: "Contact et démonstration", description, path: "/contact" });

export default function ContactPage() {
  const cards = [
    { icon: Phone, label: "Téléphone", value: contact.phone, href: contact.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: "Écrire sur WhatsApp", href: whatsappLink() },
    { icon: Mail, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Adresse", value: contact.city },
  ];
  return (
    <>
      <Navbar />
      <WebPageJsonLd path="/contact" type="ContactPage" name="Contacter CliniquePro" description={description} />
      <BreadcrumbJsonLd trail={[{ name: "Contact", path: "/contact" }]} />
      <main className="bg-paper">
        <PageHero eyebrow="Contact" title={<>Parlons de <span className="text-gradient">votre clinique.</span></>}>
          Une question, un besoin précis ? Échangeons 30 minutes pour voir CliniquePro appliqué à votre organisation.
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
