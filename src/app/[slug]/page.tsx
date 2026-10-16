import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntentPageView } from "@/components/intent-page";
import { intentRoute } from "@/lib/intent-routes";
import { intentPageBySlug, intentPages } from "@/lib/intent-pages";
import { pageMetadata } from "@/lib/seo";

// Pages d'intention (profils, fonctions, page locale) : un seul gabarit, les textes sont dans src/lib/intent-pages.ts.
// Toute autre adresse à la racine répond 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return intentPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = intentPageBySlug(slug);
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: intentRoute(page.slug).path });
}

export default async function IntentPageRoute({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = intentPageBySlug(slug);
  if (!page) notFound();
  return <IntentPageView page={page} />;
}
