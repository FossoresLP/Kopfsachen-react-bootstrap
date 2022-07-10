/// <reference lib="WebWorker" />

import { CacheDatabase, IWikiEntry } from "./db.ts"

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare var self: ServiceWorkerGlobalScope;

var db = new CacheDatabase();

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

precacheAndRoute([
	{url: 'buecher.png', revision: null},
	{url: 'Herz.png', revision: null},
	{url: 'kreativ.png', revision: null},
	{url: 'logo.png', revision: null},
	{url: 'logoBig.png', revision: null},
	{url: 'logoSquare96.png', revision: null},
	{url: 'logoSquare192.png', revision: null},
	{url: 'notfall.svg', revision: null},
	{url: 'Oberarm.png', revision: null},
	{url: 'personen.png', revision: null},
	{url: 'Platzhalter-1.png', revision: null},
	{url: 'reframing.png', revision: null},
	{url: 'sicherheitsnetz.png', revision: null},
	{url: 'situationskontrolle.png', revision: null},
	{url: 'sonstiges.png', revision: null},
	{url: 'starkmacher.png', revision: null},
	{url: 'tagebuch.jpg', revision: null},
	{url: 'tagebuch.svg', revision: null},
	{url: 'testbild.jpg', revision: null},
	{url: 'tier.png', revision: null},
	{url: 'video.png', revision: null},
	{url: 'manifest.json', revision: null}
]);

const re_ext = new RegExp('/[^/?]+\\.[^/]+$');

// Handle requests using index.html by default due to SPA routing
registerRoute(
	({ request, url }: { request: Request; url: URL }) => {
		if (request.mode !== 'navigate') {
			return false;
		}
		if (url.pathname.startsWith('/_') || url.pathname.startsWith('/api')) {
			return false;
		}
		// If path has an extension, handle seperately
		if (url.pathname.match(re_ext)) {
			return false;
		}
		// Handle other paths using index.html
		return true;
	},
	createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Wiki

registerRoute(
	({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/api/wiki"),
	async ({url, request, event, params}) => {
		if (await db.updated.get("wiki") !== undefined) {
			let count = await db.wiki.count();
			let entries = await db.wiki.toArray();
			return new Response(JSON.stringify({
				"entry_count": count,
				"entries": entries
			}));
		} else {
			return await fetch(request);
		}
	}
);

// User

registerRoute(
	({ url }) => url.origin === self.location.origin && (url.pathname.startsWith('/api/sessions/whoami') || url.pathname.startsWith("/api/user")),
	new NetworkFirst({
		cacheName: 'user',
	})
)

/*self.addEventListener("activate", async e => {
	const status = await navigator.permissions.query({
		name: 'periodic-background-sync' as any,
	});
	if (status.state === 'granted') {
		// Periodic background sync can be used.
	} else {
		// Periodic background sync cannot be used.
	}
  
	const registration = await navigator.serviceWorker.ready;
	if ('periodicSync' in registration) {
		try {
			await registration.periodicSync.register('content-sync', {
				minInterval: 24 * 60 * 60 * 1000,
			});
		} catch (error) {
			// Periodic background sync cannot be used.
		}
	}
});

self.addEventListener('periodicsync', (event) => {
	if (event.tag === 'content-sync') {
		event.waitUntil(syncWiki());
	}
});*/

self.addEventListener("activate", e => {
	e.waitUntil(syncWiki());
})

self.addEventListener("fetch", e => {
	e.waitUntil(syncWiki());
});

async function syncWiki() {
	let upd = await db.updated.get("wiki");
	if (upd === undefined || (upd !== undefined && upd.time.valueOf() - Date.now() > 1000*60*60*24)) {
		let res = await fetch("/api/wiki");
		if (res.status == 200) {
			let data = await res.json()
			let entries: IWikiEntry[] = data.entries;
			await db.wiki.clear();
			for (const entry of entries) {
				await db.wiki.add(entry, entry.id);
				await db.updated.put({name: "wiki", time: new Date()}, "wiki");
			}
		}
	}
}

// Retry change requests when reconnected
self.addEventListener("sync", e => {
	e.waitUntil((async () => {
		// retry requests
	})());
});
