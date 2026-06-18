"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import type { ThemeMode } from "@/lib/theme";

const NEXT_LABEL: Record<ThemeMode, string> = {
  system: "Switch to light theme",
  light: "Switch to dark theme",
  dark: "Switch to system theme",
};

export function ThemeToggle() {
  const { mode, mounted, cycle } = useTheme();

  // Before mount we don't know the stored mode, so render a stable placeholder
  // of the same size to avoid layout shift and a hydration mismatch.
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-hidden
        tabIndex={-1}
        className="text-muted-foreground"
      >
        <Monitor />
      </Button>
    );
  }

  const Icon = mode === "system" ? Monitor : mode === "light" ? Sun : Moon;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={NEXT_LABEL[mode]}
      title={NEXT_LABEL[mode]}
      className="text-muted-foreground hover:text-foreground"
    >
      <Icon />
    </Button>
  );
}
