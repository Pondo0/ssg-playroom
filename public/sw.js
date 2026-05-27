/* ══ PlayRoom Service Worker v1.0 ══ */
const CACHE = 'playroom-v1';
const ASSETS = [
  '/hub.html',
  '/playroom-ppt.html',
  '/playroom-domino.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap',
];

/* ── Install: pre-cache all assets ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(ASSETS).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

/* ── Activate: delete old caches ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first for app shell, network-first for Firebase ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always go to network for Firebase (real-time DB + auth)
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis.com')) {
    return;
  }

  // Cache-first for HTML/CSS/JS/fonts
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache successful GET responses for app assets
        if (e.request.method === 'GET' && response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return hub.html for navigation requests
        if (e.request.mode === 'navigate') {
          return caches.match('/hub.html');
        }
      });
    })
  );
});
