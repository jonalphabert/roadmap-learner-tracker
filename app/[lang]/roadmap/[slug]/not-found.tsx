"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/use-lang";

// not-found.tsx does not receive route params, so the locale is read from the
// pathname on the client.
export default function RoadmapNotFound() {
  const { lang, t } = useDictionary();
  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />
      <div className="container flex flex-col items-center justify-center py-32 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <Compass className="h-7 w-7 text-muted-foreground" />
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          {t.notFound.title}
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">{t.notFound.body}</p>
        <Button asChild className="mt-6">
          <Link href={`/${lang}`}>{t.notFound.back}</Link>
        </Button>
      </div>
    </div>
  );
}
