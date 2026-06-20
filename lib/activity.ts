// Retention layer: a daily-activity streak plus the "last worked on" pointer.
//
// Like lib/storage.ts, everything lives under a single localStorage key as one
// small JSON blob — no account, no sync, just momentum that survives reloads.
// A long roadmap is a marathon; the streak is the drumbeat that keeps the
// learner coming back.

const ACTIVITY_KEY = "compound:activity:v1";

// Broadcast on every write so multiple readers in the same tab (the navbar
// streak chip and the dashboard banner) refresh together. The browser's native
// "storage" event only fires in *other* tabs, so we need our own for this one.
export const ACTIVITY_EVENT = "compound:activity-changed";

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
}

export interface LastWorked {
  /** Roadmap the learner last touched. */
  slug: string;
  title: string;
  /** Stage display index, e.g. "03". */
  stageIndex: string;
  stageTitle: string;
  /** Local date of that work, YYYY-MM-DD. */
  date: string;
}

export interface ActivityState {
  /** Most recent active local date, YYYY-MM-DD. */
  lastActiveDate: string;
  /** Consecutive-day streak ending on lastActiveDate. */
  streak: number;
  /** Longest streak ever reached, for a little extra pride. */
  longestStreak: number;
  /** Where to nudge the learner back to, if they've started something. */
  lastWorked?: LastWorked;
}

const EMPTY: ActivityState = {
  lastActiveDate: "",
  streak: 0,
  longestStreak: 0,
};

// Local calendar day as YYYY-MM-DD. Deliberately local (not UTC) so "today"
// matches what the learner sees on their own clock.
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Whole-day difference between two YYYY-MM-DD keys (b - a), via UTC midnight so
// daylight-saving shifts can't produce a fractional day.
function dayDiff(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const aMs = Date.UTC(ay, am - 1, ad);
  const bMs = Date.UTC(by, bm - 1, bd);
  return Math.round((bMs - aMs) / 86_400_000);
}

function read(): ActivityState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ActivityState>;
    if (!parsed || typeof parsed !== "object") return EMPTY;
    return {
      lastActiveDate:
        typeof parsed.lastActiveDate === "string" ? parsed.lastActiveDate : "",
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      longestStreak:
        typeof parsed.longestStreak === "number" ? parsed.longestStreak : 0,
      lastWorked: parsed.lastWorked,
    };
  } catch {
    return EMPTY;
  }
}

function write(state: ActivityState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(state));
    notify();
  } catch {
    // Storage full or blocked (e.g. private mode) — fail silently.
  }
}

// Fold today's visit into the streak. Same day → unchanged; yesterday →
// extend; any older gap → reset to 1. Returns the updated state.
function applyVisit(state: ActivityState, today: string): ActivityState {
  if (state.lastActiveDate === today) return state;

  let streak: number;
  if (state.lastActiveDate && dayDiff(state.lastActiveDate, today) === 1) {
    streak = state.streak + 1;
  } else {
    streak = 1;
  }

  return {
    ...state,
    lastActiveDate: today,
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
  };
}

// Read current state, but treat a stale streak as broken. A streak whose last
// active day is older than yesterday is dead — surface it as 0 without writing,
// so the dashboard never shows "🔥 4-day streak" the learner already lost.
export function getActivity(today: string = todayKey()): ActivityState {
  const state = read();
  if (!state.lastActiveDate) return state;
  const gap = dayDiff(state.lastActiveDate, today);
  if (gap >= 2) return { ...state, streak: 0 };
  return state;
}

// Record that the learner is active today (any meaningful interaction). Counts
// toward the streak and persists. Returns the fresh state for the UI.
export function recordVisit(today: string = todayKey()): ActivityState {
  const next = applyVisit(read(), today);
  write(next);
  return next;
}

// Record both a visit and which stage was just worked on, so the dashboard can
// nudge the learner straight back to it.
export function recordWork(
  worked: Omit<LastWorked, "date">,
  today: string = todayKey(),
): ActivityState {
  const visited = applyVisit(read(), today);
  const next: ActivityState = {
    ...visited,
    lastWorked: { ...worked, date: today },
  };
  write(next);
  return next;
}
