import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

// Redirects locale-less paths (e.g. "/", "/roadmap/x") to a localized one. The
// target locale is taken from the Accept-Language header, falling back to the
// default. Static assets, the manifest, and the service worker are skipped via
// the matcher below so they keep serving from the root.
function preferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
      if ((locales as readonly string[]).includes(code)) return code;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the metadata/manifest routes, the service worker, and
  // anything with a file extension (static assets under /public, /brand, etc.).
  matcher: [
    "/((?!_next/|api/|manifest.webmanifest|sw.js|.*\\.[\\w]+$).*)",
  ],
};
