const CACHE_NAME = "overlords-static-v0.1.4"; // Version number - update when something significant happens

const ASSETS = [
  // Unchanging - air quotes...
  "Public/Images/Site Assets/favicon.png",
  "manifest.json",
  "supabaseClient.js",
  "utils/session.js",

  // Unlikely to change much
  "login.html",
  "utils/login.js",
  "register.html",
  "utils/register.js",

  // Yeah, these are why this is gonna have to be iterated
  "style.css",
  "index.html",
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
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith("http")) return;

  const requestUrl = new URL(event.request.url);

  // Only cache same-origin requests (your HTML/CSS/JS/Images),
  // let Supabase, GitHub, etc. just go straight to network.
  if (requestUrl.origin !== self.location.origin) {
    return; // do not hijack
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
