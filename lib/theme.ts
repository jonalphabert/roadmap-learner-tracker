// Theme persistence + the no-flash boot script.
//
// A user's choice is one of three modes:
//   "system" — follow the OS preference (the default before any choice)
//   "light" / "dark" — an explicit override that wins until changed
//
// Only an explicit override is stored. With nothing stored we resolve from the
// OS, so "system preference first" is the natural default, and the latest
// explicit selection is what gets remembered.

export const THEME_KEY = "compound:theme:v1";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    // localStorage blocked (private mode) — fall back to system.
  }
  return "system";
}

export function setStoredMode(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    if (mode === "system") window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, mode);
  } catch {
    // Ignore write failures (storage full or blocked).
  }
}

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;
  return systemPrefersDark() ? "dark" : "light";
}

export function applyTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

// Runs before paint (injected into <head>) so the first frame already matches
// the saved/preferred theme — no light-mode flash on a dark-mode device.
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_KEY}",s=localStorage.getItem(k),t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;
