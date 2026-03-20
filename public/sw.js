// Service Worker for caching static assets
const CACHE_NAME = 'portfolio-v2'
const STATIC_ASSETS = [
  '/',
]

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Skip non-http(s) schemes (chrome-extension, etc.)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return

  // Skip external API calls — don't intercept supabase, calendly, stripe, etc.
  if (url.origin !== self.location.origin) return

  // Only cache same-origin static assets and images
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request)
          .then((fetchResponse) => {
            if (fetchResponse.ok) {
              const clone = fetchResponse.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
            }
            return fetchResponse
          })
        )
        .catch(() => new Response('', { status: 408 }))
    )
  } else if (url.pathname.startsWith('/assets/')) {
    // Cache immutable hashed assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request)
          .then((fetchResponse) => {
            if (fetchResponse.ok) {
              const clone = fetchResponse.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
            }
            return fetchResponse
          })
        )
        .catch(() => new Response('', { status: 408 }))
    )
  }
  // All other requests (HTML, etc.) go straight to network — no SW interception
})