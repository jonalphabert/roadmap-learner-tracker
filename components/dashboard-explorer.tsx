"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import type { CategoryGroup } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategorySection } from "@/components/category-section";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function DashboardExplorer({ groups }: { groups: CategoryGroup[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => groups.map((g) => g.name), [groups]);

  const visibleGroups = useMemo(
    () =>
      groups.filter((g) => activeCategory === "all" || g.name === activeCategory),
    [groups, activeCategory],
  );

  const resultCount = useMemo(
    () => visibleGroups.reduce((sum, g) => sum + g.roadmaps.length, 0),
    [visibleGroups],
  );

  const totalCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.roadmaps.length, 0),
    [groups],
  );

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPill
            label="All"
            count={totalCount}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((name) => {
            const group = groups.find((g) => g.name === name);
            return (
              <CategoryPill
                key={name}
                label={name}
                count={group?.roadmaps.length ?? 0}
                active={activeCategory === name}
                onClick={() => setActiveCategory(name)}
              />
            );
          })}
        </div>

        <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
          Showing {resultCount} {resultCount === 1 ? "roadmap" : "roadmaps"}
        </p>
      </div>

      {visibleGroups.length > 0 ? (
        <FadeInOnce className="space-y-16">
          {visibleGroups.map((group) => (
            <CategorySection key={group.name} group={group} />
          ))}
        </FadeInOnce>
      ) : (
        <EmptyState onClear={() => setActiveCategory("all")} />
      )}
    </div>
  );
}

interface CategoryPillProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function CategoryPill({ label, count, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
    >
      {label}
      <span
        className={cn(
          "ml-1.5 font-mono text-xs",
          active ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <p className="font-display text-lg font-medium">No roadmaps here yet</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        This category is empty. Reset to see every roadmap.
      </p>
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "mt-5 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        Show all roadmaps
      </button>
    </div>
  );
}

/**
 * Plays a one-time entrance animation on first mount only. Unlike <Reveal>,
 * it does not re-run when its children change, so switching categories stays
 * smooth.
 */
function FadeInOnce({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        immediateRender: true,
      });
    }, el);

    return () => ctx.revert();
    // Intentionally empty deps: animate once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
