const CACHE_NAME = 'flinc-pwa-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            cache.addAll([
                '/',
                '/index.html',
                '/favicon.svg',
                '/manifest.webmanifest',
                '/icons/icon-192.png',
                '/icons/icon-512.png',
                '/icons/apple-touch-icon-180.png'
            ]).catch(() => void 0)
        )
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }
    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => cached);
            return cached || fetchPromise;
        })
    );
});


