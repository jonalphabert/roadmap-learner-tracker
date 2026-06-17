# Compound — a roadmap.sh-style learning tracker

Self-guided learning roadmaps with progress saved in the browser. **No login, no
backend** — each visitor's progress lives in their own `localStorage`. The first
published roadmap is a ~10-month path to becoming an independent long-term
**dividend investor**.

Built with **Next.js (App Router) · TypeScript · Tailwind CSS · shadcn-style
components · GSAP**.

---

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000  (Next picks the next free port if 3000 is taken)
```

Production build:

```bash
npm run build
npm run start
```

Requires Node 18.17+ (tested on Node 22).

---

## What's inside

- **Dashboard (`/`)** — every roadmap grouped by category (Finance, Development,
  Design …). Published roadmaps show your live progress; unpublished ones show
  as locked "Planned" cards.
- **Roadmap page (`/roadmap/[slug]`)** — the roadmap rendered as a vertical
  "growth spine" that fills in as you complete tasks. Each stage is a node that
  locks in with a gold seal when finished.
  - **Collapsible stages** — every stage is an accordion. Open or close any
    number of them to keep the page focused.
  - **Resume where you left off** — when you return to a roadmap, the first
    stage you haven't fully completed is opened automatically (completed stages
    stay collapsed). Finishing a stage live also reveals the next one.
  - **Check tasks done** — click the checkbox on any task.
  - **See progress** — a live percentage at the top, plus the spine fill, which
    grows to the marker of the stage you're currently on; per-stage counts show
    on each card.
  - **See task detail** — click a task title to open a side panel with what to
    do, resources (tagged Essential / Highly Recommended / Optional), and any
    checklist.
  - **Celebrations** — finishing a *stage* fires a confetti burst + a toast;
    finishing the *whole roadmap* opens a congratulations modal with confetti.
    These only fire on the click that completes them, so reloading never
    re-triggers them.
- **Responsive** — the spine, stage markers, cards and typography scale down for
  phones; the task detail panel becomes a full-width sheet on small screens.

Progress is stored under a single key, `compound:progress:v1`, as a small JSON
map of `slug → [completed task ids]`. Reset per-roadmap from the progress card.

---

## Data model — roadmaps are JSON

Each roadmap is one JSON file in `data/roadmaps/`. The dividend roadmap lives at
`data/roadmaps/dividend-investing.json`. Shape (see `lib/types.ts` for the full
types):

```jsonc
{
  "slug": "dividend-investing",
  "title": "Long-Term Dividend Investing",
  "category": "Finance",
  "tagline": "…",            // short line on the dashboard card
  "description": "…",        // paragraph on the roadmap page
  "difficulty": "Beginner",
  "duration": "10 months",
  "outcome": "…",            // shown in the completion modal
  "stages": [
    {
      "id": "stage-1",
      "index": "01",
      "title": "…",
      "duration": "Month 1",
      "summary": "…",
      "objectives": ["…"],   // optional "what you'll be able to do" list
      "mistakes": ["…"],     // optional "mistakes to avoid" list
      "caseStudies": ["…"],  // optional case-study list
      "tasks": [
        {
          "id": "s1-t1",
          "title": "…",
          "type": "reading",  // reading | exercise | project | concept
          "summary": "…",      // one line on the task row
          "details": ["…"],    // bullets in the detail panel
          "whatYouGain": "…",  // optional highlight in the detail panel
          "resources": [
            { "label": "…", "kind": "Paid book", "tier": "Essential", "url": "…" }
          ],
          "checklist": ["…"]   // optional checklist in the detail panel
        }
      ]
    }
  ]
}
```

### Add a new roadmap

1. Create `data/roadmaps/your-roadmap.json` using the shape above. Keep every
   `id` unique within the file (task ids are what get stored as progress).
2. Register it in `data/roadmaps/index.ts`:

   ```ts
   import yourRoadmap from "./your-roadmap.json";
   const roadmaps: Roadmap[] = [dividendInvesting, yourRoadmap as Roadmap];
   ```

That's it — it appears on the dashboard under its category, gets its own
`/roadmap/your-roadmap` page, and is included in static generation
automatically. To advertise a roadmap before it's written, add a placeholder to
`plannedRoadmaps` in the same file instead.

---

## Branding & icons

Brand assets live in one place, `public/brand/`, and are served as static URLs:

```
public/brand/
  favicon.ico        Browser tab icon
  icon.svg           Rounded green sprout mark (favicon + header logo)
  icon-circle.svg    Circular variant
  icon-mono.svg      Transparent green sprout
  apple-icon.png     512px iOS home-screen icon
  png/               Full raster size set (16–512)
```

The favicon and apple-touch icon are wired through `metadata.icons` in
`app/layout.tsx`, and the header logo in `components/site-header.tsx` points at
`icon.svg`. To move or rename the folder, update those two references — nothing
else depends on the paths. The original exported source files are kept in
`export/` as the master copy.

---

## Project structure

```
app/
  layout.tsx                 Root layout + font imports + icon metadata
  page.tsx                   Dashboard
  globals.css                Theme tokens (evergreen + gold palette)
  roadmap/[slug]/page.tsx    Roadmap page (static per slug)
  roadmap/[slug]/not-found.tsx
components/
  ui/                        shadcn-style primitives (button, card, sheet, accordion, …)
  roadmap-journey.tsx        The interactive spine, collapsible stages, celebrations
  task-detail-sheet.tsx      Side panel for a task
  celebration.tsx            Completion modal
  roadmap-card.tsx           Dashboard card (reads saved progress)
  category-section.tsx, site-header.tsx, reveal.tsx
hooks/use-progress.ts        localStorage-backed progress state
lib/
  storage.ts                 localStorage read/write
  confetti.ts                Dependency-free canvas confetti
  types.ts, utils.ts
data/roadmaps/               The "database": one JSON per roadmap + index.ts
public/brand/                Favicon, logo, and icon set
global.d.ts                  Ambient declarations for CSS-only / asset imports
```

---

## Notes

- **Fonts are self-hosted** via Fontsource (`@fontsource-variable/*`), so there
  are no external font requests and the app works fully offline. The display
  face is Fraunces, UI is Inter, and numbers use JetBrains Mono.
- **Accessibility / motion:** keyboard focus is visible, the checkboxes are real
  buttons with `aria-pressed`, and all motion (GSAP + confetti) is skipped when
  the OS requests reduced motion.
- **Educational only.** The dividend content is for learning, not financial
  advice.
```
