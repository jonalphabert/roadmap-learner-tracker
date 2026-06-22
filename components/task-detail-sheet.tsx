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

/** Clean a resource's link list: drop empties, trim, and de-duplicate. */
function effectiveUrls(urls?: string[]): string[] {
  if (!urls) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const url = raw?.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

/** A friendly button label derived from a URL's hostname. */
function linkLabel(url: string): string {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return url;
  }
  if (/(^|\.)amazon\./.test(host) || host === "a.co") return "Kindle";
  if (/(^|\.)books\.google\./.test(host)) return "Google Books";
  if (/(^|\.)play\.google\./.test(host)) return "Play Books";
  if (/(^|\.)audible\./.test(host)) return "Audible";
  return host.replace(/^www\./, "");
}

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
                  const links = effectiveUrls(r.urls);
                  return (
                    <li
                      key={i}
                      className="rounded-lg border p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{r.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.kind}
                          </p>
                        </div>
                        {r.tier ? (
                          <Badge
                            variant={TIER_VARIANT[r.tier] ?? "muted"}
                            className="shrink-0"
                          >
                            {r.tier}
                          </Badge>
                        ) : null}
                      </div>
                      {links.length > 0 ? (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {links.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary",
                                "transition-colors hover:bg-primary/10",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              )}
                            >
                              <ExternalLink className="h-3 w-3" />
                              {linkLabel(url)}
                            </a>
                          ))}
                        </div>
                      ) : null}
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
