export type TaskType = "reading" | "exercise" | "project" | "concept";

export interface ResourceLink {
  label: string;
  /** Free | Paid book | Shareholder letter | Website */
  kind: string;
  tier?: "Essential" | "Highly Recommended" | "Optional";
  /** One or more links (e.g. a website plus a Kindle link). Each renders as its own chip. */
  urls?: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  type: TaskType;
  /** One-line summary shown on the task row. */
  summary: string;
  /** The concrete payoff — what the learner walks away with. */
  whatYouGain?: string;
  /** Longer body shown in the detail panel. */
  details?: string[];
  resources?: ResourceLink[];
  /** Optional checklist rendered inside the detail panel. */
  checklist?: string[];
}

export interface RoadmapStage {
  id: string;
  /** Display order number, e.g. "01". */
  index: string;
  title: string;
  duration: string;
  summary: string;
  objectives?: string[];
  caseStudies?: string[];
  mistakes?: string[];
  tasks: RoadmapTask[];
}

export interface Roadmap {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  outcome: string;
  stages: RoadmapStage[];
}

export interface RoadmapSummary {
  slug: string;
  title: string;
  /** Stable English category key, used for grouping/anchors. */
  category: string;
  /** Localized category label, for display and search. */
  categoryLabel: string;
  tagline: string;
  difficulty: Roadmap["difficulty"];
  duration: string;
  taskCount: number;
  stageCount: number;
  status: "available" | "coming-soon";
}

export interface CategoryGroup {
  /** Stable English key, used for the section anchor and ordering. */
  key: string;
  /** Localized display name. */
  name: string;
  blurb: string;
  roadmaps: RoadmapSummary[];
}
