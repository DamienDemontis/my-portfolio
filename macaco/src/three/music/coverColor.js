// La teinte de la pochette, comme dans le visualiseur du v5 : la couleur la plus fréquente de
// l'image (ni trop sombre ni trop claire), mêlée au cuivre de la salle et relevée pour rester
// lumineuse ; la salle y glisse en une seconde environ. Les couleurs sont en sRGB, de 0 à 1.

/** Part de la pochette dans le mélange avec le cuivre. */
export const COVER_MIX = 0.6
/** Luminance minimale de la pochette avant mélange (0..1) : une pochette sombre est relevée. */
export const TINT_MIN_LUMINANCE = 0.5
/** Constante de temps du fondu (s) : environ 1 s pour atteindre la nouvelle couleur. */
export const GLIDE_TIME = 0.25

// Luminance des pixels gardés (0..255), comme le v5 : ni les noirs ni les blancs du fond.
const LUM_MIN = 30
const LUM_MAX = 225

/** Luminance (pondérations Rec. 601, comme le v5) d'une couleur [r, g, b] en 0..1. */
export const luminance = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b

/**
 * Couleur dominante d'une image : `data` en RGBA 0..255 (ImageData.data). Les pixels sont
 * rangés en seaux (4 bits par canal) ; on écarte les transparents et ceux dont la luminance
 * sort de ]30, 225[ ; le seau le plus peuplé l'emporte, et l'on rend la moyenne de ses pixels
 * en [r, g, b] 0..1. Rien à garder : null (la salle reste cuivre).
 */
export function dominantColor(data) {
  const compte = new Uint32Array(4096)
  const somme = new Float64Array(4096 * 3)
  let meilleur = -1
  for (let i = 0; i + 3 < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (data[i + 3] < 128) continue
    const l = 0.299 * r + 0.587 * g + 0.114 * b
    if (l <= LUM_MIN || l >= LUM_MAX) continue
    const k = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
    compte[k]++
    somme[k * 3] += r
    somme[k * 3 + 1] += g
    somme[k * 3 + 2] += b
    if (meilleur < 0 || compte[k] > compte[meilleur]) meilleur = k
  }
  if (meilleur < 0) return null
  const n = compte[meilleur] * 255
  return [somme[meilleur * 3] / n, somme[meilleur * 3 + 1] / n, somme[meilleur * 3 + 2] / n]
}

/**
 * La couleur entre `base` (un cuivre de la salle) et `cover` (la couleur de la pochette) :
 * la pochette d'abord relevée à TINT_MIN_LUMINANCE (multipliée, ce qui garde sa teinte, puis,
 * si un canal sature, mêlée de blanc), puis le mélange à COVER_MIX vers elle. Sans pochette :
 * la base telle quelle.
 */
export function tintToward(base, cover, mix = COVER_MIX) {
  if (!cover) return base.slice()
  let vive = cover.slice()
  const l = luminance(vive)
  if (l < TINT_MIN_LUMINANCE) {
    const k = l > 1e-4 ? TINT_MIN_LUMINANCE / l : 0
    vive = k > 0 ? vive.map((v) => Math.min(1, v * k)) : [0, 0, 0]
    const reste = luminance(vive)
    if (reste < TINT_MIN_LUMINANCE) {
      // blanc : luminance 1 ; la part qui manque, prise sur lui
      const w = (TINT_MIN_LUMINANCE - reste) / (1 - reste)
      vive = vive.map((v) => v + (1 - v) * w)
    }
  }
  return base.map((v, i) => v + (vive[i] - v) * mix)
}

/**
 * Part du chemin vers la couleur cible à faire pendant `dt` secondes : un fondu exponentiel
 * d'environ une seconde ; 1 (la couleur change d'un coup) quand la scène ne s'anime pas.
 */
export function glideStep(dt, animate) {
  if (!animate) return 1
  return 1 - Math.exp(-Math.max(0, dt) / GLIDE_TIME)
}

// Une lecture par pochette (les échecs sont oubliés : la prochaine écoute réessaie).
const LUES = new Map()

/**
 * Couleur dominante d'une pochette (URL), lue dans le navigateur : l'image (CORS anonyme, les
 * pochettes Deezer l'autorisent) réduite sur un petit canvas hors écran. Promesse de
 * [r, g, b] 0..1, ou null (image illisible, sans couleur franche).
 */
export function readCoverColor(url, size = 40) {
  if (!LUES.has(url)) {
    const lecture = new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.decoding = 'async'
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = canvas.height = size
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          if (!ctx) return resolve(null)
          ctx.drawImage(img, 0, 0, size, size)
          resolve(dominantColor(ctx.getImageData(0, 0, size, size).data))
        } catch {
          // canvas « sali » (CORS refusé) : pas de teinte
          resolve(null)
        }
      }
      img.onerror = () => {
        LUES.delete(url)
        resolve(null)
      }
      img.src = url
    })
    LUES.set(url, lecture)
  }
  return LUES.get(url)
}
