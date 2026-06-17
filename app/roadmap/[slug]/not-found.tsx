import Link from "next/link";
import { Compass } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function RoadmapNotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container flex flex-col items-center justify-center py-32 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <Compass className="h-7 w-7 text-muted-foreground" />
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          This roadmap isn&apos;t here yet
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The roadmap you&apos;re looking for hasn&apos;t been published. Browse
          the ones that are ready to start.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to all roadmaps</Link>
        </Button>
      </div>
    </div>
  );
}
