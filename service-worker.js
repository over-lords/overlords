const CACHE_NAME = "overlords-alpha-v0.1"; // Version number - update when something significant happens

const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",

  "/play.html",
  "/deckList.html",
  "/rules.html",
  "/login.html",
  "/register.html",

  // JS
  "/utils/login.js",
  "/utils/register.js",
  "/supabaseClient.js",

  // Data files
  "/data/news.js",
  "/data/issues.js",

  // Images
  "/Public/Images/Site Assets/favicon.png",
];

// -------------------------------------------
// 1. INSTALL → skip waiting + pre-cache fresh
// -------------------------------------------
self.addEventListener("install", event => {
  self.skipWaiting(); // Immediately activate new SW

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// -----------------------------------------------------
// 2. ACTIVATE → delete ALL old caches + take control
// -----------------------------------------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            return caches.delete(k); // delete EVERYTHING old
          }
        })
      );

      await self.clients.claim(); // take over all pages immediately

      // Optional but strong: force reload all tabs
      const tabs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const tab of tabs) tab.navigate(tab.url);
    })()
  );
});

// -----------------------------------------------------
// 3. FETCH → network-first (forces updated assets)
// -----------------------------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Update cache in background with fresh version
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback only
  );
});