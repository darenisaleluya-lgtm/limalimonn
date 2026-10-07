/* Zona Caribe · cache offline V14 */
const CACHE_NAME = 'zona-caribe-evento-v14';

/*
  Estos recursos se guardan después de la primera visita.
  La instalación ocurre en segundo plano y no bloquea el primer render.
*/
const CORE = [
  './',
  './index.html',
  './css/menu.css',
  './css/agenda.css',
  './css/servicios.css',
  './css/evaluador.css',
  './js/menu.js',
  './js/agenda-data.js',
  './js/agenda.js',
  './js/evaluador-data.js',
  './js/evaluador.js',
  './assets/hero-campus.webp',
  './assets/evento-titulo.png',
  './assets/hoteles/dubay.webp',
  './assets/hoteles/posada.webp',
  './assets/hoteles/mayumir.webp',
  './assets/hoteles/jahdai.webp',
  './assets/hoteles/solymar.webp',
  './assets/hoteles/hawai.webp',
  './assets/hoteles/central.webp'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.allSettled(
      CORE.map(async url => {
        try {
          const response = await fetch(url, { cache: 'reload' });
          if (response && response.ok) {
            await cache.put(url, response.clone());
          }
        } catch (_) {
          /* Un recurso ausente no impide instalar el resto del sitio. */
        }
      })
    );

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key.startsWith('zona-caribe-evento-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackUrl = null) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request, { cache: 'no-store' });

    if (response && response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch (_) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl, { ignoreSearch: true });
      if (fallback) return fallback;
    }

    return Response.error();
  }
}

async function cacheFirstImage(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });

  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* HTML siempre intenta obtener la versión más reciente. */
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  /* Código y estilos: red primero para no quedar atrapados en una versión vieja. */
  if (/\.(?:css|js|txt)$/i.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  /* Imágenes: caché primero para que Hoteles y Portada abran rápido y funcionen offline. */
  if (/\.(?:webp|png|jpg|jpeg|svg)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstImage(request));
  }
});
