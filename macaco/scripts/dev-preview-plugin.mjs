// Plugin Vite (serveur de dev seulement) : sert /api/preview avec le meme
// gestionnaire que la fonction Vercel, pour tester l'ecoute sans `vercel dev`.
import handler from '../api/preview.js'

export default function devPreviewPlugin() {
  return {
    name: 'dev-preview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/preview', (req, res) => {
        // Connect retire le prefixe monte : on le remet pour le gestionnaire.
        handler({ url: '/api/preview' + (req.url ?? '') }, res).catch(() => {
          res.statusCode = 502
          res.end('{"error":"unavailable"}')
        })
      })
    },
  }
}
