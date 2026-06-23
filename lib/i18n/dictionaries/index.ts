import { asLocale, type Locale } from "@/lib/i18n/config";
import en, { type Dictionary } from "./en";
import id from "./id";

// Dictionaries are plain bundled objects (small), so this is synchronous and
// safe to call from both Server and Client Components.
const dictionaries: Record<Locale, Dictionary> = { en, id };

export function getDictionary(lang: string | undefined): Dictionary {
  return dictionaries[asLocale(lang)];
}

export type { Dictionary };
