import Link from "next/link";
import Image from "next/image";

import { getCategoryGroups } from "@/data/roadmaps";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavStreak } from "@/components/nav-streak";
import { GlobalSearch } from "@/components/global-search";
import { LanguageSwitcher } from "@/components/language-switcher";
import { asLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function SiteHeader({ lang }: { lang: string }) {
  const locale = asLocale(lang);
  const t = getDictionary(locale);
  // Flatten every roadmap (available + planned) so search works from any page.
  const roadmaps = getCategoryGroups(locale).flatMap((group) => group.roadmaps);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-3">
        <Link
          href={`/${locale}`}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <Image
            src="/brand/icon.svg"
            alt={t.brand.logoAlt}
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
            priority
          />
          <span className="hidden font-display text-lg font-medium tracking-tight sm:inline">
            {t.brand.name}
          </span>
        </Link>

        <div className="flex flex-1 justify-center px-1 sm:px-4">
          <GlobalSearch roadmaps={roadmaps} />
        </div>

        <nav className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
          <Link
            href={`/${locale}`}
            className="hidden rounded-md px-3 py-1.5 transition-colors hover:bg-secondary hover:text-foreground sm:inline"
          >
            {t.nav.roadmaps}
          </Link>
          <NavStreak />
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
