// Lepton's site offline. Pages: the network first, the last copy when offline, else the offline
// page. Hashed build files (/_astro/) never change, so the cache answers them; everything else
// (fonts, icons, the search index) is answered from the cache and refreshed behind it.
// A docs page asks for the whole docs in its language (offline-docs.json, written at build), so
// docs read offline after one visit; the landing page alone downloads none of it.
const VERSION = 'v1';
const PAGES = `pages-${VERSION}`;
const FILES = `files-${VERSION}`;
const OFFLINE = { en: '/offline/', tr: '/tr/offline/' };
// The installed app starts on these, so they are kept from the first visit on.
const START = ['/', '/tr/'];
// A stored request has no Origin header and the page's font and module requests do; a server
// answering `Vary: Origin` would make them never match.
const MATCH = { ignoreVary: true };

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(PAGES)
			.then((cache) => cache.addAll([...Object.values(OFFLINE), ...START]))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.filter((key) => key !== PAGES && key !== FILES).map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('message', (event) => {
	if (event.data?.type !== 'cache-docs') return;
	const lang = event.data.lang === 'tr' ? 'tr' : 'en';
	event.waitUntil(
		fetch('/offline-docs.json')
			.then((response) => response.json())
			.then(async (list) => {
				const pages = await caches.open(PAGES);
				const files = await caches.open(FILES);
				for (const url of list.pages[lang])
					if (!(await pages.match(url, MATCH))) await pages.add(url).catch(() => {});
				for (const url of list.files)
					if (!(await files.match(url, MATCH))) await files.add(url).catch(() => {});
			})
			.catch(() => {}),
	);
});

self.addEventListener('fetch', (event) => {
	const request = event.request;
	if (request.method !== 'GET') return;
	const url = new URL(request.url);
	if (url.origin !== location.origin) return;

	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const copy = response.clone();
						caches.open(PAGES).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(
					async () =>
						(await caches.match(request, { ignoreSearch: true, ignoreVary: true })) ??
						(await caches.match(url.pathname.startsWith('/tr/') ? OFFLINE.tr : OFFLINE.en, MATCH)),
				),
		);
		return;
	}

	if (url.pathname.startsWith('/_astro/')) {
		event.respondWith(
			caches.match(request, MATCH).then(
				(cached) =>
					cached ??
					fetch(request).then((response) => {
						if (response.ok) {
							const copy = response.clone();
							caches.open(FILES).then((cache) => cache.put(request, copy));
						}
						return response;
					}),
			),
		);
		return;
	}

	event.respondWith(
		caches.open(FILES).then(async (cache) => {
			const cached = await cache.match(request, MATCH);
			const fresh = fetch(request)
				.then((response) => {
					if (response.ok) cache.put(request, response.clone());
					return response;
				})
				.catch((error) => {
					if (cached) return cached;
					throw error;
				});
			if (cached) event.waitUntil(fresh.catch(() => {}));
			return cached ?? fresh;
		}),
	);
});
