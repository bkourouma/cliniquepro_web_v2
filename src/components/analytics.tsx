import Script from "next/script";
import { analytics } from "@/lib/site";

/**
 * Mesure d'audience Umami (pages vues, origine, pays, appareil), sans cookie.
 * Rien n'est chargé en développement : le script n'existe que dans la version de production.
 * Les changements de page (navigation interne) sont suivis par Umami lui-même.
 */
export function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;
  return <Script src={analytics.scriptUrl} data-website-id={analytics.websiteId} data-domains={analytics.domains} strategy="afterInteractive" />;
}
