const cacheName = "tic-tac-toe-v1";
const assets = [
  "./",
  "./index.html",
  "./game.js",
  "./manifest.json",
  "./icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
