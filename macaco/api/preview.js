// Fonction Vercel (runtime Node) : GET /api/preview?id=<identifiant Deezer>.
// Renvoie l'extrait de 30 s d'un morceau de la playlist. Les URL d'extrait de
// Deezer sont signees et expirent (~12 min) : on ne peut pas les figer dans le
// code, d'ou ce relais. Rien du visiteur n'est transmis a Deezer.
import { TRACKS } from '../src/content/music.js'

const JSON_UTF8 = 'application/json; charset=utf-8'
const IDS = new Set(TRACKS.map(t => t.deezer))

const reponse = (status, body, cache) => ({
  status,
  headers: { 'Content-Type': JSON_UTF8, 'Cache-Control': cache },
  body,
})
const erreur = (status, code) => reponse(status, { error: code }, 'no-store')

export async function previewFor(id, fetchImpl = fetch) {
  // Liste blanche : un id doit etre numerique ET present dans la playlist.
  if (typeof id !== 'string' || !/^\d+$/.test(id) || !IDS.has(id)) return erreur(400, 'unknown')
  try {
    const r = await fetchImpl(`https://api.deezer.com/track/${id}`)
    if (!r.ok || r.status !== 200) return erreur(502, 'unavailable')
    const d = await r.json()
    if (!d || d.error || !d.preview) return erreur(502, 'unavailable')
    return reponse(200, { preview: d.preview, link: d.link, cover: d.album?.cover_medium }, 'public, max-age=300')
  } catch {
    return erreur(502, 'unavailable')
  }
}

// Gestionnaire neutre : seulement req.url et res.statusCode/setHeader/end, pour
// servir aussi bien sur Vercel que dans le middleware du serveur de dev.
export default async function handler(req, res) {
  const id = new URL(req.url, 'http://localhost').searchParams.get('id') ?? undefined
  const { status, headers, body } = await previewFor(id)
  res.statusCode = status
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  res.end(JSON.stringify(body))
}
