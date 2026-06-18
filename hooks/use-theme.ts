"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredMode,
  resolveTheme,
  setStoredMode,
  type ResolvedTheme,
  type ThemeMode,
} from "@/lib/theme";

// Client-side theme controller. The boot script in <head> has already applied
// the correct class before hydration; this hook keeps React state in sync,
// persists explicit choices, and re-resolves when the OS preference changes
// while in "system" mode.
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getStoredMode();
    setMode(initial);
    setResolved(resolveTheme(initial));
    setMounted(true);
  }, []);

  // Follow the OS only while no explicit override is set.
  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = resolveTheme("system");
      setResolved(next);
      applyTheme(next);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  const setTheme = useCallback((next: ThemeMode) => {
    setMode(next);
    setStoredMode(next);
    const r = resolveTheme(next);
    setResolved(r);
    applyTheme(r);
  }, []);

  // System -> Light -> Dark -> System
  const cycle = useCallback(() => {
    setTheme(mode === "system" ? "light" : mode === "light" ? "dark" : "system");
  }, [mode, setTheme]);

  return { mode, resolved, mounted, setTheme, cycle };
}
