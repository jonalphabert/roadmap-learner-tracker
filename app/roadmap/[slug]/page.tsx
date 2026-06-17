import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRoadmap, getAllRoadmapSlugs } from "@/data/roadmaps";
import { SiteHeader } from "@/components/site-header";
import { RoadmapJourney } from "@/components/roadmap-journey";

export function generateStaticParams() {
  return getAllRoadmapSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const roadmap = getRoadmap(params.slug);
  if (!roadmap) return { title: "Roadmap not found — Compound" };
  return {
    title: `${roadmap.title} — Compound`,
    description: roadmap.tagline,
  };
}

export default function RoadmapPage({
  params,
}: {
  params: { slug: string };
}) {
  const roadmap = getRoadmap(params.slug);
  if (!roadmap) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <RoadmapJourney roadmap={roadmap} />
    </div>
  );
}
