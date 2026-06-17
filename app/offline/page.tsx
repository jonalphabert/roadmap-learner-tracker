import Link from "next/link";
import { CloudOff } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

// Shown by the service worker when a page is requested offline and we have no
// cached copy of it. Pages you've already visited load from cache instead.
export default function OfflinePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container flex flex-col items-center justify-center py-32 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <CloudOff className="h-7 w-7 text-muted-foreground" />
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          You&apos;re offline
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          This page hasn&apos;t been saved for offline use yet. Reconnect to load
          it, or head back to a roadmap you&apos;ve already opened.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to all roadmaps</Link>
        </Button>
      </div>
    </div>
  );
}
