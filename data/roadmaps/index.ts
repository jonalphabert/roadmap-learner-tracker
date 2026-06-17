import type {
  Roadmap,
  RoadmapSummary,
  CategoryGroup,
} from "@/lib/types";
import dividendInvesting from "./dividend-investing.json";

// Every fully-authored roadmap lives here. Add new JSON files and register them
// in this array to make them appear across the site automatically.
const roadmaps: Roadmap[] = [dividendInvesting as Roadmap];

const roadmapBySlug = new Map(roadmaps.map((r) => [r.slug, r]));

export function getRoadmap(slug: string): Roadmap | undefined {
  return roadmapBySlug.get(slug);
}

export function getAllRoadmapSlugs(): string[] {
  return roadmaps.map((r) => r.slug);
}

export function countTasks(roadmap: Roadmap): number {
  return roadmap.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
}

function toSummary(roadmap: Roadmap): RoadmapSummary {
  return {
    slug: roadmap.slug,
    title: roadmap.title,
    category: roadmap.category,
    tagline: roadmap.tagline,
    difficulty: roadmap.difficulty,
    duration: roadmap.duration,
    taskCount: countTasks(roadmap),
    stageCount: roadmap.stages.length,
    status: "available",
  };
}

// Placeholders communicate the intended structure without inventing content.
// They render as locked "Planned" cards on the dashboard.
const plannedRoadmaps: RoadmapSummary[] = [
  {
    slug: "value-investing",
    title: "Value Investing Foundations",
    category: "Finance",
    tagline: "Margin of safety, intrinsic value, and the contrarian temperament.",
    difficulty: "Intermediate",
    duration: "—",
    taskCount: 0,
    stageCount: 0,
    status: "coming-soon",
  },
  {
    slug: "frontend-engineering",
    title: "Frontend Engineering",
    category: "Development",
    tagline: "HTML, CSS, JavaScript, and modern frameworks from first principles.",
    difficulty: "Beginner",
    duration: "—",
    taskCount: 0,
    stageCount: 0,
    status: "coming-soon",
  },
  {
    slug: "backend-engineering",
    title: "Backend Engineering",
    category: "Development",
    tagline: "APIs, databases, and systems that stay up under load.",
    difficulty: "Intermediate",
    duration: "—",
    taskCount: 0,
    stageCount: 0,
    status: "coming-soon",
  },
  {
    slug: "product-design",
    title: "Product Design",
    category: "Design",
    tagline: "Research, interaction, and visual craft for real products.",
    difficulty: "Beginner",
    duration: "—",
    taskCount: 0,
    stageCount: 0,
    status: "coming-soon",
  },
];

const categoryBlurbs: Record<string, string> = {
  Finance: "Money, markets, and the long game of compounding.",
  Development: "Build software that lasts, from the ground up.",
  Design: "Make things people understand and want to use.",
};

const categoryOrder = ["Finance", "Development", "Design"];

export function getCategoryGroups(): CategoryGroup[] {
  const summaries: RoadmapSummary[] = [
    ...roadmaps.map(toSummary),
    ...plannedRoadmaps,
  ];

  const byCategory = new Map<string, RoadmapSummary[]>();
  for (const s of summaries) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  const orderedNames = [
    ...categoryOrder.filter((c) => byCategory.has(c)),
    ...Array.from(byCategory.keys()).filter((c) => !categoryOrder.includes(c)),
  ];

  return orderedNames.map((name) => ({
    name,
    blurb: categoryBlurbs[name] ?? "",
    // Available roadmaps first, then planned.
    roadmaps: (byCategory.get(name) ?? []).sort((a, b) => {
      if (a.status === b.status) return a.title.localeCompare(b.title);
      return a.status === "available" ? -1 : 1;
    }),
  }));
}

export function getSiteStats() {
  return {
    roadmapCount: roadmaps.length,
    plannedCount: plannedRoadmaps.length,
    totalTasks: roadmaps.reduce((sum, r) => sum + countTasks(r), 0),
  };
}
