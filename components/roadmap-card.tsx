"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, TrendingUp } from "lucide-react";

import type { RoadmapSummary } from "@/lib/types";
import { loadCompleted } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function RoadmapCard({ roadmap }: { roadmap: RoadmapSummary }) {
  const [completed, setCompleted] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (roadmap.status !== "available") return;
    setCompleted(loadCompleted(roadmap.slug).length);
    setHydrated(true);
  }, [roadmap.slug, roadmap.status]);

  if (roadmap.status === "coming-soon") {
    return (
      <div className="flex h-full flex-col justify-between rounded-lg border border-dashed border-border bg-card/40 p-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="muted">Planned</Badge>
            <Lock className="h-4 w-4 text-muted-foreground/60" />
          </div>
          <h3 className="font-display text-lg font-medium text-foreground/70">
            {roadmap.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {roadmap.tagline}
          </p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Not yet published
        </p>
      </div>
    );
  }

  const percent =
    roadmap.taskCount === 0
      ? 0
      : Math.round((completed / roadmap.taskCount) * 100);
  const started = completed > 0;
  const done = percent === 100;

  return (
    <Link
      href={`/roadmap/${roadmap.slug}`}
      className={cn(
        "group flex h-full flex-col justify-between rounded-lg border bg-card p-5 shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Badge variant={done ? "gold" : "secondary"}>
            {done ? "Completed" : started ? "In progress" : "Start here"}
          </Badge>
          <TrendingUp className="h-4 w-4 text-primary/70" />
        </div>
        <h3 className="font-display text-lg font-medium leading-snug">
          {roadmap.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {roadmap.tagline}
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {roadmap.difficulty} · {roadmap.duration} · {roadmap.stageCount}{" "}
            stages
          </span>
          <span className="tabular font-mono">
            {hydrated ? `${percent}%` : "—"}
          </span>
        </div>
        <Progress
          value={hydrated ? percent : 0}
          indicatorClassName={done ? "bg-gold" : undefined}
        />
        <div className="mt-3 flex items-center text-sm font-medium text-primary">
          {started ? "Continue" : "Begin roadmap"}
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
