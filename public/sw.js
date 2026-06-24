/*
 * Service worker for Compound.
 *
 * The site is fully static (content is bundled at build time, no runtime API
 * calls), so we don't maintain a fixed precache list — Next.js asset filenames
 * are content-hashed and change every deploy. Instead we cache at runtime:
 *
 *   - Navigations (HTML pages): network-first, falling back to the cached page,
 *     then a cached locale home, then a generic offline page. This keeps content
 *     fresh online while letting previously visited roadmaps load offline.
 *   - Static assets (_next/static, fonts, images): stale-while-revalidate, so
 *     they load instantly from cache and refresh in the background.
 *
 * i18n note: routes are locale-prefixed (/en, /id) and the bare "/" is a 307
 * redirect from middleware. Redirected responses can't satisfy a navigation, so
 * we never cache them and rebuild any that slip through (safeResponse). When the
 * PWA launches offline at "/", we fall back to a cached locale home — which has
 * its JS chunks cached from the online visit — instead of the offline page,
 * whose chunks were never fetched.
 *
 * Bump CACHE_VERSION to invalidate everything on a breaking change.
 */
const CACHE_VERSION = "compound-v3";
const DEFAULT_LOCALE = "en";
const LOCALES = ["en", "id"];
// One offline fallback page per locale (pages live under /<locale>/...).
const OFFLINE_URLS = LOCALES.map((l) => `/${l}/offline`);
// Cached locale homes, used as the offline fallback for "/" and unknown pages.
const HOME_URLS = LOCALES.map((l) => `/${l}`);

// The locale prefix of a request, or the default when there isn't one (e.g. "/").
function localeOf(request) {
  const seg = new URL(request.url).pathname.split("/")[1];
  return LOCALES.includes(seg) ? seg : DEFAULT_LOCALE;
}

function offlineUrlFor(request) {
  return `/${localeOf(request)}/offline`;
}

function homeUrlFor(request) {
  return `/${localeOf(request)}`;
}

// A response stored as a redirect (response.redirected === true) cannot be used
// to satisfy a navigation request — the browser rejects it. Rebuild it so the
// body is served through a clean, non-redirected response.
function safeResponse(response) {
  if (!response || !response.redirected) return response;
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(OFFLINE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function handleNavigate(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const response = await fetch(request);
    // Only cache real pages — never redirects (e.g. "/" -> "/en") or errors,
    // since those can't be replayed for a navigation while offline.
    if (response.ok && !response.redirected) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline. Prefer the exact page, then the locale home (fully cached from
    // the online visit), then the offline page. safeResponse guards against any
    // redirected entry left over from an older cache.
    const cached = await cache.match(request);
    if (cached) return safeResponse(cached);

    // Prefer the request's own locale home, then any other cached home. This
    // covers a bare "/" launch (no locale) and visitors who only ever cached
    // one locale.
    for (const url of [homeUrlFor(request), ...HOME_URLS]) {
      const home = await cache.match(url);
      if (home) return safeResponse(home);
    }

    const offline = await cache.match(offlineUrlFor(request));
    if (offline) return safeResponse(offline);

    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests on our own origin.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // HTML navigations: network-first with offline fallbacks.
  if (request.mode === "navigate") {
    event.respondWith(handleNavigate(request));
    return;
  }

  // Everything else (scripts, styles, fonts, images): stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })(),
  );
});