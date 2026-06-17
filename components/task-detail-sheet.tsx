"use client";

import {
  BookOpen,
  PencilRuler,
  Target,
  Lightbulb,
  Check,
  CircleDashed,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import type { RoadmapTask, TaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const TASK_META: Record<
  TaskType,
  { label: string; icon: typeof BookOpen }
> = {
  reading: { label: "Reading", icon: BookOpen },
  exercise: { label: "Exercise", icon: PencilRuler },
  project: { label: "Milestone", icon: Target },
  concept: { label: "Concept", icon: Lightbulb },
};

const TIER_VARIANT: Record<string, "default" | "secondary" | "muted"> = {
  Essential: "default",
  "Highly Recommended": "secondary",
  Optional: "muted",
};

interface TaskDetailSheetProps {
  task: RoadmapTask | null;
  stageTitle: string;
  isDone: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: () => void;
}

export function TaskDetailSheet({
  task,
  stageTitle,
  isDone,
  open,
  onOpenChange,
  onToggle,
}: TaskDetailSheetProps) {
  if (!task) return null;
  const meta = TASK_META[task.type];
  const Icon = meta.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto p-5 sm:p-6">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Icon className="h-3 w-3" />
              {meta.label}
            </Badge>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {stageTitle}
            </span>
          </div>
          <SheetTitle>{task.title}</SheetTitle>
          <SheetDescription>{task.summary}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 py-2">
          {task.whatYouGain ? (
            <section className="rounded-lg border border-gold/30 bg-gold/10 p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                What you gain
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90">
                {task.whatYouGain}
              </p>
            </section>
          ) : null}

          {task.details && task.details.length > 0 ? (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What to do
              </h4>
              <ul className="space-y-2">
                {task.details.map((d, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {task.checklist && task.checklist.length > 0 ? (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Checklist
              </h4>
              <ul className="space-y-2 rounded-lg border bg-secondary/40 p-4">
                {task.checklist.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                    <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {task.resources && task.resources.length > 0 ? (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resources
              </h4>
              <ul className="space-y-2">
                {task.resources.map((r, i) => {
                  const inner = (
                    <>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {r.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.kind}
                          {r.url ? " · opens in new tab" : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {r.tier ? (
                          <Badge variant={TIER_VARIANT[r.tier] ?? "muted"}>
                            {r.tier}
                          </Badge>
                        ) : null}
                        {r.url ? (
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : null}
                      </div>
                    </>
                  );
                  const base =
                    "flex items-center justify-between gap-3 rounded-lg border p-3";
                  return r.url ? (
                    <li key={i}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(base, "transition-colors hover:bg-secondary")}
                      >
                        {inner}
                      </a>
                    </li>
                  ) : (
                    <li key={i} className={base}>
                      {inner}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <Button
            onClick={onToggle}
            variant={isDone ? "outline" : "default"}
            className="w-full"
            size="lg"
          >
            {isDone ? (
              <>
                <CircleDashed className="h-4 w-4" />
                Mark as not done
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Mark complete
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
