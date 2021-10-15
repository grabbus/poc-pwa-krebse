const cache = 'pwa-krebse';
const filesToCache = [
    '/',
    '/index.html',
    '/form.html',
    'list.html',
    '/css/style.css',
    '/js/main.js'
];

/* Start the service worker and cache the content */
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cache).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    )
});