"use client";

import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";

import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/use-lang";

// The dashboard's retention nudge: a daily streak counter plus a "pick up where
// you left off" pointer. Arriving here counts as today's activity (record=true),
// so just opening the app keeps the streak alive.
//
// Renders nothing until hydrated and until there's something to celebrate —
// a brand-new visitor with a streak of 1 and no history sees the clean hero
// rather than an empty momentum shell.
export function MomentumBanner() {
  const { lang, t } = useDictionary();
  const { hydrated, activity } = useActivity(true);

  if (!hydrated || !activity) return null;

  const { streak, longestStreak, lastWorked } = activity;
  const showStreak = streak >= 1;
  const showResume = Boolean(lastWorked);

  if (!showStreak && !showResume) return null;

  return (
    <div className="mb-12 sm:mb-14">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        {showStreak ? <StreakBadge streak={streak} longest={longestStreak} /> : <span />}

        {showResume && lastWorked ? (
          <Link
            href={`/${lang}/roadmap/${lastWorked.slug}`}
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary sm:min-w-[20rem]"
          >
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.momentum.pickUp}
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium text-foreground">
                {t.momentum.stageLabel(stageNumber(lastWorked.stageIndex), lastWorked.stageTitle)}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {lastWorked.title}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function StreakBadge({ streak, longest }: { streak: number; longest: number }) {
  const { t } = useDictionary();
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          "bg-gradient-to-b from-amber-400/25 to-orange-500/20 text-orange-500",
        )}
      >
        <Flame className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-lg font-medium leading-tight tracking-tight">
          {t.momentum.streakHeading(streak)}
        </p>
        <p className="text-sm text-muted-foreground">
          {streak === 1
            ? t.momentum.streakFirst
            : longest > streak
              ? t.momentum.streakBest(longest)
              : t.momentum.streakRecord}
        </p>
      </div>
    </div>
  );
}

// Stages are stored zero-padded ("03"); show the human number ("3") in prose.
function stageNumber(index: string): string {
  const n = Number(index);
  return Number.isFinite(n) && n > 0 ? String(n) : index;
}
