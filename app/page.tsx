import { getCategoryGroups, getSiteStats } from "@/data/roadmaps";
import { SiteHeader } from "@/components/site-header";
import { CategorySection } from "@/components/category-section";
import { Reveal } from "@/components/reveal";
import { MomentumBanner } from "@/components/momentum-banner";

export default function DashboardPage() {
  const groups = getCategoryGroups();
  const stats = getSiteStats();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero — the thesis: compounding over a long horizon */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-ledger opacity-60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="container relative py-16 sm:py-24">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Self-guided learning · progress saved on this device
          </p>
          <h1 className="max-w-3xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            Learn one durable skill at a time, and let it{" "}
            <span className="text-primary">compound</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Structured roadmaps that remember where you left off. Check off a
            task, watch the path fill in, and earn each milestone. No login, no
            account — your journey lives in your browser.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <Stat value={String(stats.roadmapCount)} label="Roadmap live" />
            <Stat value={String(stats.totalTasks)} label="Tracked tasks" />
            <Stat
              value={String(stats.plannedCount)}
              label="More in progress"
            />
          </div>
        </div>
      </section>

      {/* Streak + resume nudge — overlaps the hero's lower edge */}
      <MomentumBanner />

      {/* Catalogue grouped by category */}
      <main className="container py-14">
        <Reveal className="space-y-16" stagger={0.12} y={24}>
          {groups.map((group) => (
            <CategorySection key={group.name} group={group} />
          ))}
        </Reveal>
      </main>

      <footer className="border-t border-border">
        <div className="container flex flex-col items-start justify-between gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            Compound — an open learning tracker. Educational only, not financial
            advice.
          </p>
          <p className="font-mono text-xs">Progress stored in localStorage</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-3xl font-medium tabular text-foreground">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
