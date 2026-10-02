import Link from "next/link";

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
      </div>
    </main>
  );
}
