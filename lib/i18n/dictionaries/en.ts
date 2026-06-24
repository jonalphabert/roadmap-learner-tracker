// English dictionary — the canonical shape. Other locales are typed against
// this object (see ./index.ts), so adding a key here flags every locale that
// is missing it at compile time.
const en = {
  brand: {
    name: "Compound",
    logoAlt: "Compound logo",
  },
  nav: {
    roadmaps: "Roadmaps",
    searchPlaceholder: "Search roadmaps…",
    searchLabel: "Search roadmaps",
    clearSearch: "Clear search",
    noMatch: (q: string) => `No roadmaps match “${q}”.`,
    resultCount: (n: number) => `${n} ${n === 1 ? "result" : "results"}`,
    planned: "Planned",
    streakTitle: (n: number) => `${n}-day learning streak`,
    streakLabel: (n: number) => `${n} day streak`,
  },
  home: {
    eyebrow: "Self-guided learning · progress saved on this device",
    titleLead: "Learn one durable skill at a time, and let it",
    titleEmphasis: "compound",
    subtitle:
      "Structured roadmaps that remember where you left off. Check off a task, watch the path fill in, and earn each milestone. No login, no account — your journey lives in your browser.",
    statRoadmaps: "Roadmap live",
    statTasks: "Tracked tasks",
    statPlanned: "More in progress",
    footerNote:
      "Compound — an open learning tracker. Educational only, not financial advice.",
    footerStorage: "Progress stored in localStorage",
  },
  dashboard: {
    all: "All",
    showing: (n: number) => `Showing ${n} ${n === 1 ? "roadmap" : "roadmaps"}`,
    emptyTitle: "No roadmaps here yet",
    emptyBody: "This category is empty. Reset to see every roadmap.",
    showAll: "Show all roadmaps",
    live: (n: number) => `${n} live`,
  },
  card: {
    planned: "Planned",
    notPublished: "Not yet published",
    completed: "Completed",
    inProgress: "In progress",
    startHere: "Start here",
    continue: "Continue",
    begin: "Begin roadmap",
    stages: (n: number) => `${n} stages`,
  },
  momentum: {
    streakHeading: (n: number) => `🔥 ${n}-day streak`,
    streakFirst: "You're back — keep it rolling tomorrow.",
    streakBest: (n: number) => `Best so far: ${n} days. Keep going.`,
    streakRecord: "This is your best streak yet. Don't break it.",
    pickUp: "Pick up where you left off",
    stageLabel: (n: string, title: string) => `Stage ${n}: ${title}`,
  },
  roadmap: {
    back: "All roadmaps",
    yourProgress: "Your progress",
    tasksOf: (done: number, total: number) => `${done} / ${total} tasks`,
    tasksTotal: (total: number) => `${total} tasks`,
    reset: "Reset",
    resetConfirm:
      "Reset all progress for this roadmap? This clears your saved checkmarks on this device.",
    progressReset: "Progress reset",
    complete: "Roadmap complete — you have built the full skill.",
    stageTasks: (done: number, total: number) => `${done}/${total}`,
    stageTasksTotal: (total: number) => `${total} tasks`,
    objectives: "What you'll be able to do",
    mistakes: "Mistakes to avoid",
    caseStudies: "Case studies",
    stageComplete: (title: string) => `Stage complete — ${title}`,
    roadmapCompleteTitle: "Roadmap complete",
    roadmapCompleteMessage: (title: string, outcome: string) =>
      `You finished ${title}. ${outcome}`,
    markDone: (title: string) => `Mark "${title}" done`,
    markNotDone: (title: string) => `Mark "${title}" not done`,
  },
  taskTypes: {
    reading: "Reading",
    exercise: "Exercise",
    project: "Milestone",
    concept: "Concept",
  },
  taskSheet: {
    whatYouGain: "What you gain",
    whatToDo: "What to do",
    checklist: "Checklist",
    resources: "Resources",
    markComplete: "Mark complete",
    markNotDone: "Mark as not done",
  },
  celebration: {
    keepGoing: "Keep going",
    close: "Close",
  },
  notFound: {
    title: "This roadmap isn’t here yet",
    body: "The roadmap you’re looking for hasn’t been published. Browse the ones that are ready to start.",
    back: "Back to all roadmaps",
  },
  offline: {
    title: "You’re offline",
    body: "This page hasn’t been saved for offline use yet. Reconnect to load it, or head back to a roadmap you’ve already opened.",
    back: "Back to all roadmaps",
  },
  languageSwitcher: {
    label: "Change language",
  },
  // Catalog copy that lives outside the roadmap JSON: category display names +
  // blurbs (keyed by the stable English category key) and the "planned" cards.
  catalog: {
    categories: {
      Finance: {
        name: "Finance",
        blurb: "Money, markets, and the long game of compounding.",
      },
      Programming: {
        name: "Programming",
        blurb: "Algorithms, data structures, and the craft of problem-solving.",
      },
      Development: {
        name: "Development",
        blurb: "Build software that lasts, from the ground up.",
      },
      Design: {
        name: "Design",
        blurb: "Make things people understand and want to use.",
      },
    } as Record<string, { name: string; blurb: string }>,
    planned: {
      "value-investing": {
        title: "Value Investing Foundations",
        tagline:
          "Margin of safety, intrinsic value, and the contrarian temperament.",
      },
      "frontend-engineering": {
        title: "Frontend Engineering",
        tagline:
          "HTML, CSS, JavaScript, and modern frameworks from first principles.",
      },
      "backend-engineering": {
        title: "Backend Engineering",
        tagline: "APIs, databases, and systems that stay up under load.",
      },
      "product-design": {
        title: "Product Design",
        tagline: "Research, interaction, and visual craft for real products.",
      },
    } as Record<string, { title: string; tagline: string }>,
  },
};

export default en;

export type Dictionary = typeof en;
