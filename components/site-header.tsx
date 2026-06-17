import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/brand/icon.svg"
            alt="Compound logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
            priority
          />
          <span className="font-display text-lg font-medium tracking-tight">
            Compound
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Roadmaps
          </Link>
          <span className="hidden rounded-md px-3 py-1.5 sm:inline">
            Progress saved on this device
          </span>
        </nav>
      </div>
    </header>
  );
}
