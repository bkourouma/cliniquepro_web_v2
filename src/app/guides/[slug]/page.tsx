import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoButton } from "@/components/demo-button";
import { FinalCta } from "@/components/final-cta";
import { ArticleJsonLd, BreadcrumbJsonLd, WebPageJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PageHero } from "@/components/page-hero";
import { Prose, Sections } from "@/components/page-sections";
import { pageUpdated } from "@/lib/dates";
import { GUIDE_AUTHOR, guideBySlug, guidePath, guides } from "@/lib/guides";
import { GUIDES_PATH } from "@/lib/intent-routes";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  const base = pageMetadata({ title: g.title, description: g.description, path: guidePath(g.slug) });
  return { ...base, authors: [{ name: GUIDE_AUTHOR }], openGraph: { ...base.openGraph, type: "article", publishedTime: g.published, modifiedTime: pageUpdated(guidePath(g.slug)) } };
}

const dateFr = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();
  const path = guidePath(g.slug);
  const modified = pageUpdated(path);
  return (
    <>
      <Navbar />
      <WebPageJsonLd path={path} name={g.h1} description={g.description} />
      <ArticleJsonLd path={path} headline={g.h1} description={g.description} datePublished={g.published} dateModified={modified} />
      <BreadcrumbJsonLd
        trail={[
          { name: "Guides", path: GUIDES_PATH },
          { name: g.title, path },
        ]}
      />
      <main className="bg-paper">
        <PageHero eyebrow="Guide" title={g.h1}>
          {g.lead}
          <span className="mt-3 block text-sm text-white/50">
            Par {GUIDE_AUTHOR} · publié le {dateFr(g.published)}
            {modified !== g.published && ` · mis à jour le ${dateFr(modified)}`}
          </span>
        </PageHero>
        <Prose>
          <Sections sections={g.sections} />
          <p className="mt-8">
            <Link href={GUIDES_PATH} className="font-semibold text-brand-600 hover:underline">
              ← Tous les guides
            </Link>
          </p>
          <div className="mt-6">
            <DemoButton className="rounded-full bg-gradient-to-r from-brand-500 to-leaf-500 px-8 py-4 font-semibold text-white shadow-[0_10px_40px_-10px_rgba(18,196,106,0.7)]">
              Demander une démonstration
            </DemoButton>
          </div>
        </Prose>
      </main>
      <FinalCta />
    </>
  );
}
