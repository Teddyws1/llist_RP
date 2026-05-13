self.addEventListener('install', (e) => {
  console.log('Service Worker instalado!');
});

self.addEventListener('fetch', (e) => {
  // Isso permite que o app funcione mesmo sem internet após o primeiro acesso
  e.respondWith(fetch(e.request));
});
