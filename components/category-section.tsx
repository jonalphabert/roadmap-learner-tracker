"use client";

import type { CategoryGroup } from "@/lib/types";
import { RoadmapCard } from "@/components/roadmap-card";
import { useDictionary } from "@/lib/i18n/use-lang";

export function CategorySection({ group }: { group: CategoryGroup }) {
  const { t } = useDictionary();
  const liveCount = group.roadmaps.filter(
    (r) => r.status === "available",
  ).length;

  return (
    <section className="scroll-mt-20" id={group.key.toLowerCase()}>
      <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight">
            {group.name}
          </h2>
          {group.blurb ? (
            <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
          ) : null}
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {t.dashboard.live(liveCount)}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
        ))}
      </div>
    </section>
  );
}
