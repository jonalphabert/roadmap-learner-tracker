// Central locale configuration. Add a locale here and create its dictionary
// (lib/i18n/dictionaries/<locale>.ts) plus any per-locale roadmap JSON.
export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Coerce any string to a supported locale, falling back to the default. */
export function asLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Prefix an app path with a locale, e.g. localePath("id", "/roadmap/x"). */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean}`;
}
