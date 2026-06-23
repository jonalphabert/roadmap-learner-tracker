import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

import { getRoadmap, getAllRoadmapSlugs } from "@/data/roadmaps";
import { SiteHeader } from "@/components/site-header";
import { RoadmapJourney } from "@/components/roadmap-journey";
import { Button } from "@/components/ui/button";
import { locales, asLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllRoadmapSlugs().map((slug) => ({ lang, slug })),
  );
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Metadata {
  const roadmap = getRoadmap(params.slug, params.lang);
  if (!roadmap) {
    const t = getDictionary(params.lang);
    return { title: `${t.notFound.title} — Compound` };
  }
  return {
    title: `${roadmap.title} — Compound`,
    description: roadmap.tagline,
  };
}

export default function RoadmapPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang = asLocale(params.lang);
  const roadmap = getRoadmap(params.slug, lang);

  if (!roadmap) {
    const t = getDictionary(lang);
    return (
      <div className="min-h-screen">
        <SiteHeader lang={lang} />
        <div className="container flex flex-col items-center justify-center py-32 text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Compass className="h-7 w-7 text-muted-foreground" />
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            {t.notFound.title}
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">{t.notFound.body}</p>
          <Button asChild className="mt-6">
            <Link href={`/${lang}`}>{t.notFound.back}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />
      <RoadmapJourney roadmap={roadmap} />
    </div>
  );
}
