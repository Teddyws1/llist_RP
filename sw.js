const CACHE_NAME = "llist-rp-09";

self.addEventListener("install", event => {
  console.log("Service Worker instalado");
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./roots.css",
        "./style.css",
        "./atualizacao.css",
        "./atualizacao.js",
        "./bancodedado.js",
        "./script.js",
        "./anticopia.js"
      ]);
    })
  );
  
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker ativado");
  
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
  
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
    .then(response => {
      const copy = response.clone();
      
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, copy);
      });
      
      return response;
    })
    .catch(() => caches.match(event.request))
  );
});
