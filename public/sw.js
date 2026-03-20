// Service Worker for caching static assets
const CACHE_NAME = 'portfolio-v1'
const STATIC_ASSETS = [
  '/',
  '/Damien.jpg',
  '/photography/IMG_20240701_151842.jpg', // First photo only
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
  // Only cache GET requests over http(s)
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return

  // Cache strategy: Cache First for images, Network First for HTML/API
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(event.request)
            .then((fetchResponse) => {
              const responseClone = fetchResponse.clone()
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone))
              return fetchResponse
            })
        })
        .catch(() => {
          // Fallback for offline
          return new Response('Image not available offline')
        })
    )
  } else {
    // Network first for other resources
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone))
          }
          return response
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(event.request)
        })
    )
  }
})