/*
 * Service worker for Compound.
 *
 * The site is fully static (content is bundled at build time, no runtime API
 * calls), so we don't maintain a fixed precache list — Next.js asset filenames
 * are content-hashed and change every deploy. Instead we cache at runtime:
 *
 *   - Navigations (HTML pages): network-first, falling back to the cached page,
 *     then to a generic offline page. This keeps content fresh online while
 *     letting previously visited roadmaps load offline.
 *   - Static assets (_next/static, fonts, images): stale-while-revalidate, so
 *     they load instantly from cache and refresh in the background.
 *
 * Bump CACHE_VERSION to invalidate everything on a breaking change.
 */
const CACHE_VERSION = "compound-v2";
// One offline fallback page per locale (pages live under /<locale>/...).
const OFFLINE_URLS = ["/en/offline", "/id/offline"];
const DEFAULT_OFFLINE_URL = "/en/offline";

// Pick the offline fallback that matches the request's locale prefix.
function offlineUrlFor(request) {
  const path = new URL(request.url).pathname;
  const match = OFFLINE_URLS.find((url) => path.startsWith(`/${url.split("/")[1]}/`));
  return match || DEFAULT_OFFLINE_URL;
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

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests on our own origin.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // HTML navigations: network-first.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(CACHE_VERSION);
          cache.put(request, response.clone());
          return response;
        } catch {
          const cache = await caches.open(CACHE_VERSION);
          const cached = await cache.match(request);
          return cached || (await cache.match(offlineUrlFor(request)));
        }
      })(),
    );
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
