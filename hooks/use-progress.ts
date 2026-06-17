"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadCompleted, saveCompleted, clearRoadmap } from "@/lib/storage";

export function useProgress(slug: string, allTaskIds: string[]) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once on the client to avoid SSR mismatch.
  useEffect(() => {
    setCompleted(new Set(loadCompleted(slug)));
    setHydrated(true);
  }, [slug]);

  const persist = useCallback(
    (next: Set<string>) => {
      setCompleted(next);
      saveCompleted(slug, Array.from(next));
    },
    [slug],
  );

  const toggle = useCallback(
    (taskId: string) => {
      const next = new Set(completed);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      persist(next);
      return next.has(taskId); // true if now completed
    },
    [completed, persist],
  );

  const reset = useCallback(() => {
    clearRoadmap(slug);
    setCompleted(new Set());
  }, [slug]);

  const completeAll = useCallback(() => {
    persist(new Set(allTaskIds));
  }, [allTaskIds, persist]);

  const validCount = useMemo(
    () => allTaskIds.filter((id) => completed.has(id)).length,
    [allTaskIds, completed],
  );

  const total = allTaskIds.length;
  const percent = total === 0 ? 0 : Math.round((validCount / total) * 100);

  return {
    hydrated,
    completed,
    completedCount: validCount,
    total,
    percent,
    isDone: (id: string) => completed.has(id),
    toggle,
    reset,
    completeAll,
  };
}
