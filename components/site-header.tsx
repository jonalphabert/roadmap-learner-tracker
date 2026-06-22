import Link from "next/link";
import Image from "next/image";

import { getCategoryGroups } from "@/data/roadmaps";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavStreak } from "@/components/nav-streak";
import { GlobalSearch } from "@/components/global-search";

export function SiteHeader() {
  // Flatten every roadmap (available + planned) so search works from any page.
  const roadmaps = getCategoryGroups().flatMap((group) => group.roadmaps);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/icon.svg"
            alt="Compound logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
            priority
          />
          <span className="hidden font-display text-lg font-medium tracking-tight sm:inline">
            Compound
          </span>
        </Link>

        <div className="flex flex-1 justify-center px-1 sm:px-4">
          <GlobalSearch roadmaps={roadmaps} />
        </div>

        <nav className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/"
            className="hidden rounded-md px-3 py-1.5 transition-colors hover:bg-secondary hover:text-foreground sm:inline"
          >
            Roadmaps
          </Link>
          <NavStreak />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
