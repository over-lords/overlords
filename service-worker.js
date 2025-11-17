const CACHE_NAME = "overlords-pwa-v1";

const ASSETS = [
  "/", 
  "/overlords/index.html",
  "/overlords/style.css",
  "/overlords/game.html",
  "/overlords/play.html",
  "/overlords/manifest.json",

  // Data files
  "/overlords/data/faceCards.js",
  "/overlords/data/overlords.js",
  "/overlords/data/tactics.js",
  "/overlords/data/enemies.js",
  "/overlords/data/allies.js",
  "/overlords/data/bystanders.js",
  "/overlords/data/scenarios.js",
  "/overlords/data/henchmen.js",
  "/overlords/data/villains.js",

  // Images
  "/overlords/Public/Images/Site Assets/Board.jpg",
  "/overlords/Public/Images/Site Assets/BoardReduced.jpg",
  "/overlords/Public/Images/Site Assets/favicon.png"
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
