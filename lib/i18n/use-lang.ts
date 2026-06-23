"use client";

import { usePathname } from "next/navigation";
import { asLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

/** Current locale, read from the first path segment (e.g. /id/roadmap/...). */
export function useLang(): Locale {
  const pathname = usePathname();
  const seg = pathname?.split("/")[1];
  return asLocale(seg);
}

/** Convenience: the dictionary for the current locale, in client components. */
export function useDictionary(): { lang: Locale; t: Dictionary } {
  const lang = useLang();
  return { lang, t: getDictionary(lang) };
}
