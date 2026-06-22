const CACHE = 'galex-entregas-v1';
const ARCHIVOS = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Solo cachear peticiones GET al propio origen
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guardar copia fresca en cache
        const copia = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
