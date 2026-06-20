"use client";

import { useEffect, useState } from "react";
import {
  getActivity,
  recordVisit,
  type ActivityState,
} from "@/lib/activity";

// Reads (and on the dashboard, records) the learner's daily-activity streak.
//
// Pass `record: true` on a page where simply arriving should count as activity
// — the dashboard. Elsewhere pass false (the default) to read the streak
// without minting a fresh visit. Hydrates on the client to avoid SSR mismatch.
export function useActivity(record = false) {
  const [activity, setActivity] = useState<ActivityState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setActivity(record ? recordVisit() : getActivity());
    setHydrated(true);
  }, [record]);

  return { hydrated, activity };
}
