// Kill-switch : le site v5 enregistrait ici un service worker cache-first qui ne
// revalidait jamais. Ce fichier le remplace (le navigateur le re-telecharge,
// /sw.js etant servi en no-cache), puis il purge les caches, se desinscrit et
// recharge les onglets controles. Volontairement sans gestionnaire de requetes.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) client.navigate(client.url)
    })(),
  )
})
