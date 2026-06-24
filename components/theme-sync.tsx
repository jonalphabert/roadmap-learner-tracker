"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { applyTheme, getStoredMode, resolveTheme } from "@/lib/theme";

// Re-asserts the stored theme on every client navigation.
//
// The no-flash boot script in <head> only runs on full page loads. Switching
// locale (/en <-> /id) is a soft navigation that re-renders the root layout and
// drops the `dark` class set imperatively on <html>, with nothing to put it
// back — so the page would flip to light. Keying this effect on the pathname
// re-applies the saved choice after each navigation. Renders nothing.
export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    applyTheme(resolveTheme(getStoredMode()));
  }, [pathname]);

  return null;
}
