// Compact localStorage layer. Everything lives under a single key so a user's
// whole journey across every roadmap is one small JSON blob (task ids only).

const STORAGE_KEY = "compound:progress:v1";

type ProgressMap = Record<string, string[]>; // slug -> completed task ids

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage full or blocked (e.g. private mode) — fail silently.
  }
}

export function loadCompleted(slug: string): string[] {
  const all = readAll();
  return Array.isArray(all[slug]) ? all[slug] : [];
}

export function saveCompleted(slug: string, ids: string[]) {
  const all = readAll();
  if (ids.length === 0) {
    delete all[slug];
  } else {
    all[slug] = ids;
  }
  writeAll(all);
}

export function clearRoadmap(slug: string) {
  const all = readAll();
  delete all[slug];
  writeAll(all);
}
