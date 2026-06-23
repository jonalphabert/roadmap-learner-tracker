import { getCategoryGroups, getSiteStats } from "@/data/roadmaps";
import { SiteHeader } from "@/components/site-header";
import { DashboardExplorer } from "@/components/dashboard-explorer";
import { MomentumBanner } from "@/components/momentum-banner";
import { asLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function DashboardPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = asLocale(params.lang);
  const t = getDictionary(lang);
  const groups = getCategoryGroups(lang);
  const stats = getSiteStats();

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />

      {/* Hero — the thesis: compounding over a long horizon */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-ledger opacity-60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="container relative py-16 sm:py-24">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {t.home.eyebrow}
          </p>
          <h1 className="max-w-3xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            {t.home.titleLead}{" "}
            <span className="text-primary">{t.home.titleEmphasis}</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            {t.home.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <Stat value={String(stats.roadmapCount)} label={t.home.statRoadmaps} />
            <Stat value={String(stats.totalTasks)} label={t.home.statTasks} />
            <Stat
              value={String(stats.plannedCount)}
              label={t.home.statPlanned}
            />
          </div>
        </div>
      </section>


      {/* Catalogue grouped by category */}
      <main className="container py-14">
        {/* Streak counter + "pick up where you left off" nudge */}
        <MomentumBanner />
        <DashboardExplorer groups={groups} />
      </main>

      <footer className="border-t border-border">
        <div className="container flex flex-col items-start justify-between gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>{t.home.footerNote}</p>
          <p className="font-mono text-xs">{t.home.footerStorage}</p>
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
