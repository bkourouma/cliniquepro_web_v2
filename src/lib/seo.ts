// Métadonnées par page. Next.js ne fusionne pas « openGraph » en profondeur : une page qui ne définit que title et
// description hérite du titre et de la description Open Graph de l'accueil. Ce helper pose donc, pour chaque page,
// le titre, la description, le canonical, og:url et la carte Twitter cohérents entre eux.

import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "./site";

// Un « openGraph » explicite remplace l'image issue du fichier opengraph-image.tsx : on la redéclare ici.
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "CliniquePro — Logiciel de gestion pour cliniques ophtalmologiques" };

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} — ${SITE_NAME}`;
  return {
    title, // complété par le gabarit « %s — CliniquePro » du layout
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "fr_CI", url: absoluteUrl(path), title: fullTitle, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}
