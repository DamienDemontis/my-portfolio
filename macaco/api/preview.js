// Fonction Vercel (runtime Node) : GET /api/preview?id=<identifiant Deezer>.
// Renvoie l'extrait de 30 s d'un morceau de la playlist. Les URL d'extrait de
// Deezer sont signees et expirent (~12 min) : on ne peut pas les figer dans le
// code, d'ou ce relais. Rien du visiteur n'est transmis a Deezer.
import { TRACKS } from '../src/content/music.js'

const JSON_UTF8 = 'application/json; charset=utf-8'
export const DEEZER_TIMEOUT_MS = 5000
const IDS = new Set(TRACKS.map(t => t.deezer))

// Succes : 5 min dans le navigateur et sur le CDN de Vercel (l'URL signee dure ~12 min).
const CACHE_SUCCES = 'public, max-age=300, s-maxage=300'

const reponse = (status, body, cache) => ({
  status,
  headers: { 'Content-Type': JSON_UTF8, 'Cache-Control': cache },
  body,
})
const erreur = (status, code) => reponse(status, { error: code }, 'no-store')

// Une adresse renvoyee par Deezer n'est relayee que si elle pointe vers son CDN, en https
// (un hote qui finit par .dzcdn.net) : jamais un autre site dans la page du visiteur.
function surCdnDeezer(adresse) {
  if (typeof adresse !== 'string') return false
  try {
    const u = new URL(adresse)
    return u.protocol === 'https:' && u.hostname.endsWith('.dzcdn.net')
  } catch {
    return false
  }
}

export async function previewFor(id, fetchImpl = fetch) {
  // Liste blanche : un id doit etre numerique ET present dans la playlist.
  if (typeof id !== 'string' || !/^\d+$/.test(id) || !IDS.has(id)) return erreur(400, 'unknown')
  // Si Deezer ne repond pas, on abandonne : le visiteur ne reste pas en attente.
  const ctl = new AbortController()
  const minuteur = setTimeout(() => ctl.abort(), DEEZER_TIMEOUT_MS)
  try {
    const r = await fetchImpl(`https://api.deezer.com/track/${id}`, { signal: ctl.signal })
    if (!r.ok || r.status !== 200) return erreur(502, 'unavailable')
    const d = await r.json()
    if (!d || d.error || !d.preview) return erreur(502, 'unavailable')
    // Sans pochette, le lecteur garde son disque ; une pochette hors du CDN est refusee.
    const cover = d.album?.cover_medium ?? null
    if (!surCdnDeezer(d.preview) || (cover !== null && !surCdnDeezer(cover))) return erreur(502, 'unavailable')
    // Le lien est construit depuis l'id (deja verifie), jamais repris de la reponse.
    return reponse(200, { preview: d.preview, link: `https://www.deezer.com/track/${id}`, cover }, CACHE_SUCCES)
  } catch {
    return erreur(502, 'unavailable')
  } finally {
    clearTimeout(minuteur)
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
