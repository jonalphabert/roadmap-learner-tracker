# Compound — a roadmap.sh-style learning tracker

Self-guided learning roadmaps with progress saved in the browser. **No login, no
backend** — each visitor's progress, streak, theme, and language preference live
in their own `localStorage`. The first published roadmap is a ~10-month path to
becoming an independent long-term **dividend investor**.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn-style
components (Radix UI) · GSAP**. Ships as an installable, **offline-capable PWA**
with **dark mode** and **English / Bahasa Indonesia** localization.

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

- **Dashboard (`/[lang]`)** — every roadmap grouped by category (Finance,
  Development, Design …). Published roadmaps show your live progress; unpublished
  ones show as locked "Planned" cards.
  - **Global search & category filter** — find any roadmap by title/tagline and
    narrow the dashboard to a single category.
  - **Daily streak & momentum** — arriving on the dashboard records a visit; a
    streak counter and a "pick up where you left off" banner nudge you back to
    the roadmap you were last working on.
- **Roadmap page (`/[lang]/roadmap/[slug]`)** — the roadmap rendered as a
  vertical "growth spine" that fills in as you complete tasks. Each stage is a
  node that locks in with a gold seal when finished.
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
    do, resources (tagged Essential / Highly Recommended / Optional, each able to
    carry multiple links), and any checklist.
  - **Celebrations** — finishing a *stage* fires a confetti burst + a toast;
    finishing the *whole roadmap* opens a congratulations modal with confetti.
    These only fire on the click that completes them, so reloading never
    re-triggers them.
- **Dark mode** — follows the OS preference by default and can be toggled
  manually; the choice persists in `localStorage`.
- **Internationalization** — every route is locale-prefixed (`/en`, `/id`).
  Middleware redirects bare paths to the visitor's locale, and a language
  switcher swaps between English and Bahasa Indonesia. UI copy lives in
  per-locale dictionaries; roadmap content has per-locale JSON.
- **Installable PWA / works offline** — a service worker and web manifest let
  the app be installed to the home screen and used with no network; a dedicated
  offline page handles uncached navigations.
- **Responsive** — the spine, stage markers, cards and typography scale down for
  phones; the task detail panel becomes a full-width sheet on small screens.

Progress is stored under a single key, `compound:progress:v1`, as a small JSON
map of `slug → [completed task ids]`. Reset per-roadmap from the progress card.

---

## Data model — roadmaps are JSON

Each roadmap is a JSON file in `data/roadmaps/`, one file **per locale**. The
dividend roadmap lives at `data/roadmaps/dividend-investing.en.json` and
`dividend-investing.id.json`. Shape (see `lib/types.ts` for the full types):

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
            { "label": "…", "kind": "Paid book", "tier": "Essential", "urls": ["…"] }
          ],
          "checklist": ["…"]   // optional checklist in the detail panel
        }
      ]
    }
  ]
}
```

### Add a new roadmap

1. Create `data/roadmaps/your-roadmap.en.json` using the shape above (start from
   `_template.json`). Keep every `id` unique within the file — task ids are what
   get stored as progress, and they must match across locales so progress carries
   over when the language is switched.
2. Add any translations as `your-roadmap.<locale>.json`. A locale only needs
   files for the roadmaps it translates; anything missing falls back to the
   default-locale (`en`) version.
3. Register it in `data/roadmaps/index.ts` under the matching locale:

   ```ts
   import yourRoadmapEn from "./your-roadmap.en.json";

   const roadmapsByLocale: Record<Locale, Roadmap[]> = {
     en: [dividendEn, yourRoadmapEn as Roadmap],
     id: [dividendId],
   };
   ```

That's it — it appears on the dashboard under its category, gets its own
`/[lang]/roadmap/your-roadmap` page, and is included in static generation
automatically. To advertise a roadmap before it's written, add a placeholder to
`plannedMeta` in the same file (with display copy in the dictionaries) instead.

---

## Internationalization

- Supported locales are declared in `lib/i18n/config.ts` (`en`, `id`; default
  `en`). Add a locale there, then create its dictionary and any per-locale
  roadmap JSON.
- `middleware.ts` redirects un-prefixed paths to a locale, so every page renders
  under `/[lang]`.
- UI strings live in `lib/i18n/dictionaries/<locale>.ts`; `use-lang.ts` exposes
  the active locale to client components, and `components/language-switcher.tsx`
  switches between them.

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
`app/[lang]/layout.tsx`, and the header logo in `components/site-header.tsx`
points at `icon.svg`. The same sprout mark feeds the PWA manifest
(`app/manifest.ts`). The original exported source files are kept in `export/` as
the master copy.

---

## Project structure

```
app/
  [lang]/
    layout.tsx               Localized layout + font imports + icon metadata
    page.tsx                 Dashboard
    roadmap/[slug]/page.tsx  Roadmap page (static per slug)
    roadmap/[slug]/not-found.tsx
    offline/page.tsx         Fallback shown for uncached navigations
  globals.css                Theme tokens (evergreen + gold palette, light/dark)
  manifest.ts                PWA web manifest
components/
  ui/                        shadcn-style primitives (button, card, sheet, accordion, …)
  roadmap-journey.tsx        The interactive spine, collapsible stages, celebrations
  task-detail-sheet.tsx      Side panel for a task
  celebration.tsx            Completion modal
  roadmap-card.tsx           Dashboard card (reads saved progress)
  dashboard-explorer.tsx     Search + category filtering
  global-search.tsx, language-switcher.tsx, theme-toggle.tsx
  nav-streak.tsx, momentum-banner.tsx
  category-section.tsx, site-header.tsx, reveal.tsx
  service-worker-register.tsx
hooks/
  use-progress.ts            localStorage-backed progress state
  use-activity.ts            daily-streak / "last visited" tracking
  use-theme.ts               dark-mode state
lib/
  storage.ts                 localStorage read/write
  activity.ts                streak + momentum logic
  theme.ts                   theme resolution + persistence
  confetti.ts                dependency-free canvas confetti
  i18n/                      locale config, dictionaries, helpers
  types.ts, utils.ts
data/roadmaps/               The "database": per-locale JSON per roadmap + index.ts
middleware.ts                Locale routing
public/
  brand/                     Favicon, logo, and icon set
  sw.js                      Service worker (offline caching)
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