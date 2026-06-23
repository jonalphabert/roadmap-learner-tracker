"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight, Lock } from "lucide-react";

import type { RoadmapSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/use-lang";

function matchesQuery(roadmap: RoadmapSummary, query: string): boolean {
  const haystack = [roadmap.title, roadmap.tagline, roadmap.categoryLabel]
    .join("\n")
    .toLowerCase();
  return haystack.includes(query);
}

export function GlobalSearch({ roadmaps }: { roadmaps: RoadmapSummary[] }) {
  const router = useRouter();
  const { lang, t } = useDictionary();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return [];
    return roadmaps.filter((r) => matchesQuery(r, trimmed));
  }, [roadmaps, trimmed]);

  // Keep the highlighted row valid as results change.
  useEffect(() => {
    setActiveIndex(0);
  }, [trimmed]);

  const showDropdown = open && trimmed !== "";

  function clearQuery() {
    setQuery("");
    inputRef.current?.focus();
  }

  function goTo(roadmap: RoadmapSummary) {
    if (roadmap.status !== "available") return;
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(`/${lang}/roadmap/${roadmap.slug}`);
  }

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Global shortcuts (progressive enhancement, desktop).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!showDropdown || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const choice = results[activeIndex];
      if (choice) {
        event.preventDefault();
        goTo(choice);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="global-search-results"
        aria-label={t.nav.searchLabel}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onInputKeyDown}
        placeholder={t.nav.searchPlaceholder}
        className={cn(
          "h-9 w-full rounded-full border border-input bg-card pl-9 pr-16 text-sm shadow-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
        {query ? (
          <button
            type="button"
            onClick={clearQuery}
            aria-label={t.nav.clearSearch}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="hidden items-center gap-1 sm:flex" aria-hidden>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
          </span>
        )}
      </div>

      {showDropdown ? (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(70vh,24rem)] overflow-auto rounded-lg border border-border bg-popover p-1.5 shadow-lg"
        >
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {t.nav.noMatch(query.trim())}
            </p>
          ) : (
            <>
              <p
                className="px-2 pb-1 pt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                aria-live="polite"
              >
                {t.nav.resultCount(results.length)}
              </p>
              <ul>
                {results.map((roadmap, index) => (
                  <ResultRow
                    key={roadmap.slug}
                    roadmap={roadmap}
                    lang={lang}
                    plannedLabel={t.nav.planned}
                    active={index === activeIndex}
                    onHover={() => setActiveIndex(index)}
                    onSelect={() => goTo(roadmap)}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ResultRow({
  roadmap,
  lang,
  plannedLabel,
  active,
  onHover,
  onSelect,
}: {
  roadmap: RoadmapSummary;
  lang: string;
  plannedLabel: string;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  const planned = roadmap.status !== "available";

  const inner = (
    <>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">
          {roadmap.title}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {roadmap.categoryLabel} · {roadmap.tagline}
        </span>
      </span>
      {planned ? (
        <span className="ml-2 flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <Lock className="h-3 w-3" /> {plannedLabel}
        </span>
      ) : (
        <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-primary/70" />
      )}
    </>
  );

  const rowClass = cn(
    "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left",
    active && !planned && "bg-secondary",
    active && planned && "bg-muted/60",
    planned && "cursor-default opacity-70",
  );

  if (planned) {
    return (
      <li role="option" aria-selected={active} aria-disabled>
        <div className={rowClass} onMouseMove={onHover}>
          {inner}
        </div>
      </li>
    );
  }

  return (
    <li role="option" aria-selected={active}>
      <Link
        href={`/${lang}/roadmap/${roadmap.slug}`}
        className={cn(
          rowClass,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        onMouseMove={onHover}
        onClick={(e) => {
          e.preventDefault();
          onSelect();
        }}
      >
        {inner}
      </Link>
    </li>
  );
}
