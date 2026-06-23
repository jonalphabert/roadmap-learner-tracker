"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  ArrowLeft,
  Check,
  Clock,
  RotateCcw,
  PartyPopper,
  Target,
  AlertTriangle,
  Microscope,
} from "lucide-react";

import type { Roadmap, RoadmapStage, RoadmapTask } from "@/lib/types";
import { useProgress } from "@/hooks/use-progress";
import { recordWork } from "@/lib/activity";
import { fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CelebrationModal } from "@/components/celebration";
import {
  TaskDetailSheet,
  TASK_ICONS,
  taskLabel,
} from "@/components/task-detail-sheet";
import { useDictionary } from "@/lib/i18n/use-lang";

interface CelebrationState {
  open: boolean;
  title: string;
  message: string;
}

export function RoadmapJourney({ roadmap }: { roadmap: Roadmap }) {
  const { lang, t } = useDictionary();
  const allTaskIds = useMemo(
    () => roadmap.stages.flatMap((s) => s.tasks.map((t) => t.id)),
    [roadmap],
  );
  const progress = useProgress(roadmap.slug, allTaskIds);

  const [activeTask, setActiveTask] = useState<RoadmapTask | null>(null);
  const [activeStageTitle, setActiveStageTitle] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationState>({
    open: false,
    title: "",
    message: "",
  });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // Which stage cards are expanded. Defaults to the first stage so SSR and the
  // initial client render agree; corrected to the resume stage after hydration.
  const [openStages, setOpenStages] = useState<string[]>(() =>
    roadmap.stages[0] ? [roadmap.stages[0].id] : [],
  );
  const didInitOpen = useRef(false);

  const fillRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The green spine fill is positioned against the real stage-marker geometry
  // rather than a flat task percentage. A percentage of the spine's pixel
  // height has no relation to where the markers sit (stages have different
  // task counts and heights) — and the accordion changes those heights as it
  // expands/collapses. So instead we grow the fill to the marker of the stage
  // you're currently on, interpolating within that stage by how many of its
  // tasks are done.
  const recalcFill = useCallback(
    (animate: boolean) => {
      const container = spineRef.current;
      const fill = fillRef.current;
      if (!container || !fill) return;

      const cTop = container.getBoundingClientRect().top;
      const centerOf = (i: number) => {
        const el = markerRefs.current[i];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.top - cTop + r.height / 2;
      };

      const TOP = 24; // matches `top-6` on the track
      const stages = roadmap.stages;
      const currentIdx = stages.findIndex(
        (s) => !s.tasks.every((t) => progress.completed.has(t.id)),
      );

      let frontier: number | null;
      if (currentIdx === -1) {
        // Everything done — reach the last marker.
        frontier = centerOf(stages.length - 1);
      } else {
        const baseY = centerOf(currentIdx);
        if (baseY == null) return;
        const stage = stages[currentIdx];
        const doneInStage = stage.tasks.filter((t) =>
          progress.completed.has(t.id),
        ).length;
        const frac = stage.tasks.length ? doneInStage / stage.tasks.length : 0;
        const nextY = centerOf(currentIdx + 1) ?? container.clientHeight - TOP;
        frontier = baseY + frac * (nextY - baseY);
      }
      if (frontier == null) return;

      const height = Math.max(0, frontier - TOP);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // Kill any in-flight tween first: a stale grow animation must never
      // outlive — and overwrite — a fresh measurement taken during a layout
      // shift (e.g. one stage collapsing as another expands).
      gsap.killTweensOf(fill);
      if (animate && !reduce) {
        gsap.to(fill, { height, duration: 0.5, ease: "power2.out" });
      } else {
        gsap.set(fill, { height });
      }
    },
    [roadmap.stages, progress.completed],
  );

  // Latest recalc, so the resize/observer listeners (set up once) never go stale.
  const recalcRef = useRef(recalcFill);
  recalcRef.current = recalcFill;

  // Grow the fill (animated) whenever progress changes, after hydration.
  useEffect(() => {
    if (!progress.hydrated) return;
    recalcFill(true);
  }, [recalcFill, progress.hydrated]);

  // Keep the fill glued to the markers while the layout shifts — accordion
  // open/close animations and viewport resizes both move them. Snap (no tween)
  // here so it tracks frame-by-frame; the progress effect above owns the grow
  // animation.
  useEffect(() => {
    const container = spineRef.current;
    if (!container) return;
    let first = true;
    const onResize = () => recalcRef.current(false);
    const onObserve = () => {
      // Skip the initial fire so it can't clobber the grow animation on mount.
      if (first) {
        first = false;
        return;
      }
      recalcRef.current(false);
    };
    const ro = new ResizeObserver(onObserve);
    ro.observe(container);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // When stages expand/collapse, marker positions shift even if the container's
  // total height doesn't change (one stage opens as another closes) — so a
  // ResizeObserver can miss it entirely. Track the fill every frame across the
  // accordion's ~200ms animation so it always settles on the right marker.
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      recalcRef.current(false);
      if (now - start < 280) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [openStages]);

  // On first load (after progress hydrates from storage), open the stage the
  // user is currently on — the first one not yet fully complete — so coming
  // back to a roadmap resumes where they left off. Runs once; any manual
  // open/close the user does afterwards is preserved.
  useEffect(() => {
    if (!progress.hydrated || didInitOpen.current) return;
    didInitOpen.current = true;
    const current =
      roadmap.stages.find(
        (s) => !s.tasks.every((t) => progress.completed.has(t.id)),
      ) ?? roadmap.stages[roadmap.stages.length - 1];
    if (current) setOpenStages([current.id]);
  }, [progress.hydrated, progress.completed, roadmap.stages]);

  function showToast(text: string) {
    setToast(text);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3600);
  }

  function handleToggle(task: RoadmapTask, stage: RoadmapStage) {
    const wasDone = progress.isDone(task.id);
    const nextDone = !wasDone;

    // Build the hypothetical next set to drive celebration logic.
    const next = new Set(progress.completed);
    if (nextDone) next.add(task.id);
    else next.delete(task.id);

    progress.toggle(task.id);

    if (!nextDone) return;

    // Checking off a task is the clearest "I worked on this" signal — it keeps
    // the streak alive and points the dashboard's resume nudge at this stage.
    recordWork({
      slug: roadmap.slug,
      title: roadmap.title,
      stageIndex: stage.index,
      stageTitle: stage.title,
    });

    const roadmapDoneBefore = allTaskIds.every((id) =>
      progress.completed.has(id),
    );
    const roadmapDoneAfter = allTaskIds.every((id) => next.has(id));
    const stageDoneBefore = stage.tasks.every((t) =>
      progress.completed.has(t.id),
    );
    const stageDoneAfter = stage.tasks.every((t) => next.has(t.id));

    if (roadmapDoneAfter && !roadmapDoneBefore) {
      setCelebration({
        open: true,
        title: t.roadmap.roadmapCompleteTitle,
        message: t.roadmap.roadmapCompleteMessage(roadmap.title, roadmap.outcome),
      });
    } else if (stageDoneAfter && !stageDoneBefore) {
      fireConfetti({ count: 70, spread: 0.9 });
      showToast(t.roadmap.stageComplete(stage.title));
      // Reveal the next stage so the journey keeps moving forward. Additive —
      // this never collapses a stage the user chose to open.
      const idx = roadmap.stages.findIndex((s) => s.id === stage.id);
      const next = roadmap.stages[idx + 1];
      if (next) {
        setOpenStages((prev) =>
          prev.includes(next.id) ? prev : [...prev, next.id],
        );
      }
    }
  }

  function openTask(task: RoadmapTask, stage: RoadmapStage) {
    setActiveTask(task);
    setActiveStageTitle(stage.title);
    setSheetOpen(true);
  }

  function handleReset() {
    if (window.confirm(t.roadmap.resetConfirm)) {
      progress.reset();
      showToast(t.roadmap.progressReset);
    }
  }

  const done = progress.percent === 100 && progress.hydrated;

  return (
    <div className="container max-w-4xl py-8 sm:py-10">
      <Link
        href={`/${lang}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.roadmap.back}
      </Link>

      {/* Header */}
      <header>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{roadmap.category}</Badge>
          <Badge variant="outline">{roadmap.difficulty}</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {roadmap.duration}
          </span>
        </div>
        <h1 className="text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {roadmap.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {roadmap.description}
        </p>
      </header>

      {/* Progress summary */}
      <div className="mt-8 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.roadmap.yourProgress}
            </p>
            <p className="mt-1 font-mono text-3xl font-medium tabular">
              {progress.hydrated ? `${progress.percent}%` : "—"}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {progress.hydrated
                  ? t.roadmap.tasksOf(progress.completedCount, progress.total)
                  : t.roadmap.tasksTotal(progress.total)}
              </span>
            </p>
          </div>
          {progress.completedCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" />
              {t.roadmap.reset}
            </Button>
          ) : null}
        </div>
        <Progress
          className="mt-4 h-2.5"
          value={progress.hydrated ? progress.percent : 0}
          indicatorClassName={done ? "bg-gold" : undefined}
        />
        {done ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-foreground">
            <PartyPopper className="h-4 w-4 text-gold" />
            {t.roadmap.complete}
          </p>
        ) : null}
      </div>

      {/* The growth spine */}
      <div ref={spineRef} className="relative mt-10 sm:mt-12">
        {/* track */}
        <div className="absolute left-[18px] top-6 bottom-6 w-[3px] -translate-x-1/2 rounded-full bg-border sm:left-[22px]" />
        {/* fill (grows to the current stage marker) */}
        <div
          ref={fillRef}
          className="absolute left-[18px] top-6 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary to-primary/60 sm:left-[22px]"
          style={{ height: 0 }}
        />

        <Accordion
          type="multiple"
          value={openStages}
          onValueChange={setOpenStages}
          className="space-y-3"
        >
          {roadmap.stages.map((stage, i) => (
            <StageBlock
              key={stage.id}
              stage={stage}
              isDone={(id) => progress.isDone(id)}
              hydrated={progress.hydrated}
              onToggle={(task) => handleToggle(task, stage)}
              onOpen={(task) => openTask(task, stage)}
              markerRef={(el) => {
                markerRefs.current[i] = el;
              }}
            />
          ))}
        </Accordion>
      </div>

      <TaskDetailSheet
        task={activeTask}
        stageTitle={activeStageTitle}
        isDone={activeTask ? progress.isDone(activeTask.id) : false}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onToggle={() => {
          if (!activeTask) return;
          const stage = roadmap.stages.find((s) =>
            s.tasks.some((t) => t.id === activeTask.id),
          );
          if (stage) handleToggle(activeTask, stage);
        }}
      />

      <CelebrationModal
        open={celebration.open}
        onClose={() => setCelebration((c) => ({ ...c, open: false }))}
        title={celebration.title}
        message={celebration.message}
      />

      {/* Toast */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-all duration-300",
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        aria-live="polite"
      >
        {toast ? (
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border bg-card px-4 py-2.5 text-sm font-medium shadow-lg">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20">
              <Check className="h-3 w-3 text-gold" />
            </span>
            {toast}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StageBlock({
  stage,
  isDone,
  hydrated,
  onToggle,
  onOpen,
  markerRef,
}: {
  stage: RoadmapStage;
  isDone: (id: string) => boolean;
  hydrated: boolean;
  onToggle: (task: RoadmapTask) => void;
  onOpen: (task: RoadmapTask) => void;
  markerRef?: (el: HTMLDivElement | null) => void;
}) {
  const { t } = useDictionary();
  const doneCount = stage.tasks.filter((t) => isDone(t.id)).length;
  const stageDone = hydrated && doneCount === stage.tasks.length;
  const started = doneCount > 0;

  return (
    <div className="relative flex gap-3 sm:gap-5">
      {/* Marker on the spine */}
      <div className="relative z-10 flex shrink-0 flex-col items-center">
        <div
          ref={markerRef}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-sm font-medium transition-colors sm:h-11 sm:w-11",
            stageDone
              ? "border-gold bg-gold text-gold-foreground"
              : started
                ? "border-primary bg-card text-primary"
                : "border-border bg-card text-muted-foreground",
          )}
        >
          {stageDone ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : stage.index}
        </div>
      </div>

      {/* Stage card (collapsible) */}
      <AccordionItem
        value={stage.id}
        className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <AccordionTrigger className="gap-3 px-4 py-4 hover:no-underline sm:px-5">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-0.5 text-left">
            <div>
              <h2 className="font-display text-lg font-medium tracking-tight sm:text-xl">
                {stage.title}
              </h2>
              <p className="text-sm font-normal text-muted-foreground">
                {stage.duration}
              </p>
            </div>
            <Badge variant={stageDone ? "gold" : started ? "secondary" : "muted"}>
              {hydrated
                ? t.roadmap.stageTasks(doneCount, stage.tasks.length)
                : t.roadmap.stageTasksTotal(stage.tasks.length)}
            </Badge>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 sm:px-5">
          <p className="text-sm leading-relaxed text-foreground/80">
            {stage.summary}
          </p>

          {stage.objectives?.length ||
          stage.caseStudies?.length ||
          stage.mistakes?.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {stage.objectives?.length ? (
                <StageInfo
                  icon={Target}
                  label={t.roadmap.objectives}
                  items={stage.objectives}
                  tone="primary"
                />
              ) : null}
              {stage.mistakes?.length ? (
                <StageInfo
                  icon={AlertTriangle}
                  label={t.roadmap.mistakes}
                  items={stage.mistakes}
                  tone="warning"
                />
              ) : null}
              {stage.caseStudies?.length ? (
                <div className="sm:col-span-2">
                  <StageInfo
                    icon={Microscope}
                    label={t.roadmap.caseStudies}
                    items={stage.caseStudies}
                    tone="muted"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 space-y-1.5">
            {stage.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                done={isDone(task.id)}
                onToggle={() => onToggle(task)}
                onOpen={() => onOpen(task)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function StageInfo({
  icon: Icon,
  label,
  items,
  tone,
}: {
  icon: typeof Target;
  label: string;
  items: string[];
  tone: "primary" | "warning" | "muted";
}) {
  const toneStyles = {
    primary: {
      box: "border-primary/20 bg-primary/5",
      icon: "text-primary",
      dot: "bg-primary/60",
    },
    warning: {
      box: "border-amber-500/25 bg-amber-500/5",
      icon: "text-amber-500",
      dot: "bg-amber-500/70",
    },
    muted: {
      box: "border-border bg-secondary/40",
      icon: "text-muted-foreground",
      dot: "bg-muted-foreground/50",
    },
  }[tone];

  return (
    <div className={cn("rounded-lg border p-3.5", toneStyles.box)}>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className={cn("h-3.5 w-3.5", toneStyles.icon)} />
        {label}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
            <span
              className={cn(
                "mt-[7px] h-1 w-1 shrink-0 rounded-full",
                toneStyles.dot,
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TaskRow({
  task,
  done,
  onToggle,
  onOpen,
}: {
  task: RoadmapTask;
  done: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const { t } = useDictionary();
  const Icon = TASK_ICONS[task.type];

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-secondary/50",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? t.roadmap.markNotDone(task.title) : t.roadmap.markDone(task.title)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          done
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card hover:border-primary",
        )}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : null}
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            done ? "text-muted-foreground/60" : "text-primary/70",
          )}
        />
        <span className="min-w-0">
          <span
            className={cn(
              "block truncate text-sm font-medium transition-colors",
              done && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>
        </span>
      </button>

      <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
        {taskLabel(t, task.type)}
      </span>
    </div>
  );
}
