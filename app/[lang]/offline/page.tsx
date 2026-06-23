import Link from "next/link";
import { CloudOff } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { asLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// Shown by the service worker when a page is requested offline and we have no
// cached copy of it. Pages you've already visited load from cache instead.
export default function OfflinePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = asLocale(params.lang);
  const t = getDictionary(lang);
  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />
      <div className="container flex flex-col items-center justify-center py-32 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <CloudOff className="h-7 w-7 text-muted-foreground" />
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          {t.offline.title}
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">{t.offline.body}</p>
        <Button asChild className="mt-6">
          <Link href={`/${lang}`}>{t.offline.back}</Link>
        </Button>
      </div>
    </div>
  );
}
