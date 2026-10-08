import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  // Balise de validation de la propriété Google Search Console (valeur publique, servie dans le HTML).
  verification: { google: "WCtsnzYFVt9ud_pN59hcfuJ4L-lZ1eOoUAKbVyPd6u8" },
  title: "CliniquePro — Logiciel de gestion pour cliniques ophtalmologiques",
  description:
    "CliniquePro centralise patients, rendez-vous, consultations, examens, assurances, caisse, facturation, honoraires et comptabilité dans une application web conçue pour les cliniques ophtalmologiques.",
  openGraph: {
    title: "CliniquePro — La plateforme tout-en-un pour piloter votre clinique",
    description: "Gestion opérationnelle (35 000 FCFA HT/mois) et gestion financière et comptable (45 000 FCFA HT/mois) : choisissez votre pack.",
    locale: "fr_CI",
    type: "website",
    siteName: "CliniquePro",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#040f26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior : Next 16 coupe le défilement fluide (globals.css) pendant un changement de page ;
    // sans lui, la remontée en haut de la nouvelle page est interrompue et on arrive en bas.
    <html lang="fr" data-scroll-behavior="smooth" className={`${inter.variable} ${bricolage.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <OrganizationJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
