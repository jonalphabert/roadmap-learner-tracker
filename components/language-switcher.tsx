"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { locales, localeNames, asLocale } from "@/lib/i18n/config";
import { useDictionary } from "@/lib/i18n/use-lang";

// Cycles through the available locales, swapping the first path segment so the
// user stays on the same page. Progress is keyed by roadmap slug (not locale),
// so switching language preserves the user's checkmarks.
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, t } = useDictionary();

  const next = locales[(locales.indexOf(lang) + 1) % locales.length];

  function switchTo() {
    const segments = (pathname ?? "/").split("/");
    // segments[1] is the locale segment; replace it (or insert if absent).
    if (asLocale(segments[1]) === segments[1]) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const target = segments.join("/") || `/${next}`;
    router.push(target);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchTo}
      aria-label={`${t.languageSwitcher.label} — ${localeNames[next]}`}
      title={localeNames[next]}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Languages className="h-4 w-4" />
      <span className="font-mono text-xs uppercase">{lang}</span>
    </Button>
  );
}
