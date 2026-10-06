import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { SiteJsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { fcfa } from "@/lib/format";
import { packs } from "@/lib/pricing";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const HOME_TITLE = "CliniquePro — Logiciel de gestion pour cliniques ophtalmologiques";
// Le prix vient de pricing.ts : un changement de tarif se répercute ici sans retouche
const HOME_DESCRIPTION = `CliniquePro est un logiciel web de gestion de clinique ophtalmologique, édité à Abidjan (Côte d'Ivoire) : patients, rendez-vous, consultations, examens, assurances, caisse, facturation, honoraires et comptabilité. Dès ${fcfa(Math.min(...packs.map((p) => p.monthly)))} HT par mois, premier mois offert.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s — ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: "CliniquePro — La plateforme tout-en-un pour piloter votre clinique",
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    locale: "fr_CI",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
  // Vérification Search Console (propriété « Préfixe d'URL » du site) : le code est public par nature, il figure dans le HTML.
  // GOOGLE_SITE_VERIFICATION le remplace au besoin ; la balise Bing n'est posée que si BING_SITE_VERIFICATION est renseignée.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "WCtsnzYFVt9ud_pN59hcfuJ4L-lZ1eOoUAKbVyPd6u8",
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
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
        <SiteJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
