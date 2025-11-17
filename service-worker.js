const CACHE_NAME = "overlords-pwa-v1";

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

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
