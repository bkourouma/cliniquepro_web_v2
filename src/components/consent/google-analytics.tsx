"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { shouldLoadAnalytics } from "@/lib/consent";
import { GA_SCRIPT_SRC, buildGtagInitScript } from "@/lib/ga";
import { getConsentSnapshot, getServerConsentSnapshot, subscribeConsent } from "./consent-store";

/**
 * Google Analytics 4, uniquement en production, sur le vrai site et après accord explicite du visiteur.
 * Aucun appel à Google tant que « Accepter » n'a pas été choisi. Umami (sans cookie) reste dans analytics.tsx.
 */
export function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
  const hostname = typeof window === "undefined" ? "" : window.location.hostname;
  if (!shouldLoadAnalytics({ nodeEnv: process.env.NODE_ENV, hostname, consent })) return null;

  return (
    <>
      <Script src={GA_SCRIPT_SRC} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {buildGtagInitScript()}
      </Script>
    </>
  );
}
