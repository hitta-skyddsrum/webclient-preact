import Raven from 'raven-js';

/* eslint-disable compat/compat */

const { assets } = global.serviceWorkerOption;

const CACHE_NAME = process.env.COMMITHASH;
// const CACHE_NAME = new Date().toString();
const assetsToCache = [...assets, './']
  .filter(path =>
    [
      '/_redirects',
      '/sitemap.xml',
      '/sitemap2.xml',
      '/index.html',
    ].indexOf(path) === -1
  )
  .map(path => new URL(path, global.location).toString());

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

const handleInstall = event => {
  console.log('[SW] Install event', event);

  event.waitUntil(
    global.caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => {
        console.log('Cached assets: main', assetsToCache);
      })
      .catch(error => {
        Raven.captureException(error);
      })
  );
};

self.addEventListener('install', handleInstall);

const handleActivate = event => {
  console.log('[SW] Activate event');

  event.waitUntil(
    global.caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(cacheName => cacheName.indexOf(CACHE_NAME) === -1)
            .map(cacheName => global.caches.delete(cacheName))
        ))
      .catch(error => {
        Raven.captureException(error);
      })
  );
};

self.addEventListener('activate', handleActivate);

const handleFetch = event => {
  const { request } = event;

  if (request.method !== 'GET') {
    console.log(`[SW] Ignore non GET request ${request.method}`);
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== location.origin) {
    console.log(`[SW] Ignore difference origin ${requestUrl.origin}`);
    return;
  }

  const resource = global.caches.match(request).then(response => {
    if (response) {
      console.log(`[SW] fetch URL ${requestUrl.href} from cache`);

      return response;
    }

    return fetch(request)
      .then(responseNetwork => {
        if (!responseNetwork || !responseNetwork.ok) {
          console.log(
            `[SW] URL [${requestUrl.toString()}] wrong responseNetwork: ${responseNetwork.status} ${responseNetwork.type}`
          );

          return responseNetwork;
        }

        console.log(`[SW] URL ${requestUrl.href} fetched`);

        const responseCache = responseNetwork.clone();

        global.caches
          .open(CACHE_NAME)
          .then(cache => {
            return cache.put(request, responseCache);
          })
          .then(() => {
            console.log(`[SW] Cache asset: ${requestUrl.href}`);
          })
          .catch(error => Raven.captureException(error));

        return responseNetwork;
      });
  });

  event.respondWith(resource);
};

self.addEventListener('fetch', handleFetch);
