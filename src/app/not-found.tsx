import type { Metadata } from "next";
import Link from "next/link";

// Métadonnées propres à la 404 : sans elles, elle reprenait le titre, la description et le canonical de l'accueil.
export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page demandée n'existe pas ou a été déplacée.",
  alternates: {},
  openGraph: { title: "Page introuvable | CliniquePro" },
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Accueil" },
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink-950 px-5 text-center text-white">
      <div>
        <p className="font-display text-7xl font-bold text-gradient">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Page introuvable</h1>
        <p className="mt-2 text-white/60">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950">
          Retour à l&apos;accueil
        </Link>
        <nav aria-label="Pages principales" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="underline decoration-white/25 underline-offset-4 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
