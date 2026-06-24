import type { Locale } from "@/lib/i18n/config";
import type { Roadmap } from "@/lib/types";
import en from "./dividend-investing.en.json";
import id from "./dividend-investing.id.json";

// One roadmap bundled with its translations. The default locale (en) is
// required; others are optional and fall back to it (see ../index.ts).
const roadmap: Partial<Record<Locale, Roadmap>> = {
  en: en as Roadmap,
  id: id as Roadmap,
};

export default roadmap;
