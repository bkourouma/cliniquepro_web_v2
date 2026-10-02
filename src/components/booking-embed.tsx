"use client";

import dynamic from "next/dynamic";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

const Frame = dynamic(() => import("./booking-frame").then((m) => m.BookingFrame), {
  ssr: false,
  loading: () => <div className="h-[680px] w-full animate-pulse bg-white/5" />,
});

/** Calendrier de réservation affiché directement dans une page (ex. /contact) */
export function BookingEmbed() {
  if (!BOOKING_URL) return null;
  return <Frame url={BOOKING_URL} className="h-[680px]" />;
}
