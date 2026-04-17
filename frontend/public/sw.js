const CACHE_NAME = 'talikhata-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install: cache core shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for API calls, cache-first for static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always pass API requests to network
  if (url.hostname === 'localhost' && url.port === '8000') {
    return event.respondWith(fetch(event.request).catch(() => new Response('[]', { headers: { 'Content-Type': 'application/json' } })));
  }

  // For navigation requests serve index.html (SPA fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
