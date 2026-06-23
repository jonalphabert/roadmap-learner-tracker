import type { Roadmap, RoadmapSummary, CategoryGroup } from "@/lib/types";
import { asLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import dividendEn from "./dividend-investing.en.json";
import dividendId from "./dividend-investing.id.json";

// Per-locale roadmap content. A locale only needs entries for the roadmaps it
// translates; anything missing falls back to the default-locale version below.
const roadmapsByLocale: Record<Locale, Roadmap[]> = {
  en: [dividendEn as Roadmap],
  id: [dividendId as Roadmap],
};

// Default-locale list is canonical: it defines which roadmaps exist and their
// order. Translations swap in per slug; untranslated ones fall back to default.
function localeRoadmaps(lang: Locale): Roadmap[] {
  const canonical = roadmapsByLocale[defaultLocale];
  const bySlug = new Map((roadmapsByLocale[lang] ?? []).map((r) => [r.slug, r]));
  return canonical.map((r) => bySlug.get(r.slug) ?? r);
}

export function getRoadmap(slug: string, lang: string): Roadmap | undefined {
  return localeRoadmaps(asLocale(lang)).find((r) => r.slug === slug);
}

export function getAllRoadmapSlugs(): string[] {
  return roadmapsByLocale[defaultLocale].map((r) => r.slug);
}

export function countTasks(roadmap: Roadmap): number {
  return roadmap.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
}

function categoryLabel(dict: Dictionary, key: string): string {
  return dict.catalog.categories[key]?.name ?? key;
}

function toSummary(roadmap: Roadmap, dict: Dictionary): RoadmapSummary {
  return {
    slug: roadmap.slug,
    title: roadmap.title,
    category: roadmap.category,
    categoryLabel: categoryLabel(dict, roadmap.category),
    tagline: roadmap.tagline,
    difficulty: roadmap.difficulty,
    duration: roadmap.duration,
    taskCount: countTasks(roadmap),
    stageCount: roadmap.stages.length,
    status: "available",
  };
}

// Planned roadmaps render as locked "Planned" cards. Their stable metadata
// lives here; the display copy (title/tagline) comes from the dictionary so it
// localizes with the rest of the catalog.
const plannedMeta: {
  slug: string;
  category: string;
  difficulty: Roadmap["difficulty"];
}[] = [
  { slug: "value-investing", category: "Finance", difficulty: "Intermediate" },
  { slug: "frontend-engineering", category: "Development", difficulty: "Beginner" },
  { slug: "backend-engineering", category: "Development", difficulty: "Intermediate" },
  { slug: "product-design", category: "Design", difficulty: "Beginner" },
];

function plannedSummaries(dict: Dictionary): RoadmapSummary[] {
  return plannedMeta.map((m) => {
    const copy = dict.catalog.planned[m.slug];
    return {
      slug: m.slug,
      title: copy?.title ?? m.slug,
      category: m.category,
      categoryLabel: categoryLabel(dict, m.category),
      tagline: copy?.tagline ?? "",
      difficulty: m.difficulty,
      duration: "—",
      taskCount: 0,
      stageCount: 0,
      status: "coming-soon",
    };
  });
}

const categoryOrder = ["Finance", "Development", "Design"];

export function getCategoryGroups(lang: string): CategoryGroup[] {
  const dict = getDictionary(lang);
  const summaries: RoadmapSummary[] = [
    ...localeRoadmaps(asLocale(lang)).map((r) => toSummary(r, dict)),
    ...plannedSummaries(dict),
  ];

  const byCategory = new Map<string, RoadmapSummary[]>();
  for (const s of summaries) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  const orderedKeys = [
    ...categoryOrder.filter((c) => byCategory.has(c)),
    ...Array.from(byCategory.keys()).filter((c) => !categoryOrder.includes(c)),
  ];

  return orderedKeys.map((key) => ({
    key,
    name: categoryLabel(dict, key),
    blurb: dict.catalog.categories[key]?.blurb ?? "",
    // Available roadmaps first, then planned.
    roadmaps: (byCategory.get(key) ?? []).sort((a, b) => {
      if (a.status === b.status) return a.title.localeCompare(b.title);
      return a.status === "available" ? -1 : 1;
    }),
  }));
}

export function getSiteStats() {
  const roadmaps = roadmapsByLocale[defaultLocale];
  return {
    roadmapCount: roadmaps.length,
    plannedCount: plannedMeta.length,
    totalTasks: roadmaps.reduce((sum, r) => sum + countTasks(r), 0),
  };
}
