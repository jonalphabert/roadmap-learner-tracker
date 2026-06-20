"use client";

import { Flame } from "lucide-react";

import { useActivity } from "@/hooks/use-activity";

// Compact streak chip for the site header. Read-only (record=false) — it
// mirrors the streak the dashboard banner records, and updates live via the
// shared activity event when a task is checked off. Hidden until there's a
// streak to show, so first-time visitors see a clean nav.
export function NavStreak() {
  const { hydrated, activity } = useActivity();

  if (!hydrated || !activity || activity.streak < 1) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 font-mono text-xs font-medium text-orange-500"
      title={`${activity.streak}-day learning streak`}
      aria-label={`${activity.streak} day streak`}
    >
      <Flame className="h-3.5 w-3.5" />
      {activity.streak}
    </span>
  );
}
