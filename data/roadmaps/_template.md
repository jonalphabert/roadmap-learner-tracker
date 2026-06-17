# Roadmap JSON template

Copy `_template.json`, rename it to your roadmap's slug (e.g. `value-investing.json`),
fill it in, then register it (step at the bottom). The leading underscore on
`_template.json` is just a convention so it reads as "not a real roadmap" — it is
never imported unless you wire it up.

`✓` = required · `·` = optional

---

## Roadmap (top level)

| Field | Req | Type | Notes |
|---|:--:|---|---|
| `slug` | ✓ | string | URL id, kebab-case, **unique**. Becomes `/roadmap/<slug>`. |
| `title` | ✓ | string | Display name on the card and page header. |
| `category` | ✓ | string | Groups it on the dashboard, e.g. `Finance`, `Development`, `Design`. A new category name creates a new section automatically. |
| `tagline` | ✓ | string | One line on the dashboard card. |
| `description` | ✓ | string | Paragraph at the top of the roadmap page. |
| `difficulty` | ✓ | enum | `Beginner` · `Intermediate` · `Advanced`. |
| `duration` | ✓ | string | Freeform, e.g. `10 months`, `6 weeks`. |
| `outcome` | ✓ | string | Shown in the completion modal — the tangible end result. |
| `stages` | ✓ | array | One or more stages, in order. |

## Stage

| Field | Req | Type | Notes |
|---|:--:|---|---|
| `id` | ✓ | string | Unique within the file, e.g. `stage-1`. |
| `index` | ✓ | string | The number shown in the spine node, e.g. `"01"`. Keep it a string so `08` keeps its zero. |
| `title` | ✓ | string | Stage heading. |
| `duration` | ✓ | string | e.g. `Month 1`, `Months 3–4`. |
| `summary` | ✓ | string | One or two sentences under the heading. |
| `objectives` | · | string[] | Learning objectives (not currently rendered, kept for your reference / future use). |
| `caseStudies` | · | string[] | Real examples this stage references. |
| `mistakes` | · | string[] | Common pitfalls. |
| `tasks` | ✓ | array | The checkable items. Each task = one checkbox + one progress unit. |

## Task

| Field | Req | Type | Notes |
|---|:--:|---|---|
| `id` | ✓ | string | **Unique within the file** — this is the id stored in `localStorage` as progress. Changing it later resets that task for existing users. |
| `title` | ✓ | string | Shown on the row. |
| `type` | ✓ | enum | `reading` · `exercise` · `project` · `concept`. Drives the row icon and label. |
| `summary` | ✓ | string | One line on the row and at the top of the detail panel. |
| `whatYouGain` | · | string | The gold "What you'll gain" block at the top of the detail panel. Write it to motivate. |
| `details` | · | string[] | Bullets under "What to do" in the detail panel. |
| `resources` | · | array | Books, sites, tools (see below). |
| `checklist` | · | string[] | A checklist card in the detail panel. **Visual only** — not tracked separately. |

## Resource (inside a task's `resources`)

| Field | Req | Type | Notes |
|---|:--:|---|---|
| `label` | ✓ | string | e.g. `The Psychology of Money — Morgan Housel`. |
| `kind` | ✓ | string | Freeform, e.g. `Paid book`, `Website`, `Shareholder letter`, `Free`. |
| `tier` | · | enum | `Essential` · `Highly Recommended` · `Optional`. Renders as a badge. |
| `url` | · | string | If present, the resource becomes a link that opens in a new tab. |

---

## `type` values at a glance

| `type` | Icon | Use for |
|---|---|---|
| `reading` | book | Books, articles, docs to read. |
| `exercise` | ruler | Hands-on drills that produce something. |
| `project` | target | Milestones / capstone deliverables. |
| `concept` | bulb | Frameworks or ideas to internalise. |

---

## Register it

Open `data/roadmaps/index.ts` and add your file to the `roadmaps` array:

```ts
import dividendInvesting from "./dividend-investing.json";
import valueInvesting from "./value-investing.json"; // 1. import

const roadmaps: Roadmap[] = [
  dividendInvesting,
  valueInvesting as Roadmap,                          // 2. add here
];
```

That's all. It now appears on the dashboard under its `category`, gets a
`/roadmap/<slug>` page, live progress tracking, and is included in the static
build automatically.

To tease a roadmap before it's written, add a placeholder to `plannedRoadmaps`
in the same file instead — it renders as a locked "Planned" card.

## Sanity checks before you ship

- Every `id` (stage and task) is unique within the file.
- `slug` is unique across all roadmaps.
- `difficulty`, `type`, and `tier` use the exact enum spellings above.
- The file is valid JSON (no trailing commas, smart quotes are fine inside string values).
