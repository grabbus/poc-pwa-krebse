var cacheName = 'pwa-krebse';
var filesToCache = [
    '/',
    '/index.html',
    '/form.html',
    '/list.html',
    '/css/style.css',
    '/js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return cache.addAll(filesToCache);
      })
    );
  });
  
  /* Serve cached content when offline */
  self.addEventListener('fetch', function(event) {
	// We will cache all POST requests, but in the real world, you will probably filter for
	// specific URLs like if(... || event.request.url.href.match(...))
	if(event.request.method === "POST"){
		
		// Init the cache. We use Dexie here to simplify the code. You can use any other
		// way to access IndexedDB of course.
		var db = new Dexie("post_cache");
		db.version(1).stores({
			post_cache: 'key,response,timestamp'
		})
	
		event.respondWith(
			// First try to fetch the request from the server
			fetch(event.request.clone())
			.then(function(response) {
				// If it works, put the response into IndexedDB
				cachePut(event.request.clone(), response.clone(), db.post_cache);
				return response;
			})
			.catch(function() {
				// If it does not work, return the cached response. If the cache does not
				// contain a response for our request, it will give us a 503-response
				return cacheMatch(event.request.clone(), db.post_cache);
			})
		);
	}
})

self.addEventListener('fetch', async function (event) {
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin')
		return;
	if (event.request.method === 'GET') {
		if (event.request.url.includes('/static/') || event.request.mode !== 'cors') {
			event.respondWith(fetchResponseFromCache(event.request))
			return
		}
		if (navigator.onLine) {
			event.respondWith(cacheRequest(event.request));
		} else {
			var resp = await fetchResponseFromCache(event.request).catch((e) => { return })
			if (resp){
				event.respondWith(resp)
			}
		}
	}
	else {
		if(!navigator.onLine){
			//here you can check for specific urls to be saved in indexed db
			var authHeader = event.request.headers.get('Authorization');
			var reqUrl = event.request.url;
			Promise.resolve(event.request.text()).then((payload) => {
				//save offline requests to indexed db
				saveIntoIndexedDb(reqUrl, authHeader, payload)
			})
		}
		
	}
});

// Activate service worker
self.addEventListener('activate', (event) => {
	console.info('Event: Activate');
	event.waitUntil(
		self.clients.claim(),
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== CACHE.name + CACHE.version) {
						//delete all old caches or else new version of service worker won't get installed
						return caches.delete(cache);
					}
				})
			);
		})
	);
});
