// CLI : ../public/projects/*.png (racine du dépôt) -> public/projects/<id>.webp + src/content/projectMedia.json.
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../../', import.meta.url))
const sources = join(root, '../public/projects')
const out = join(root, 'public/projects')

export const SOURCES = [
  { id: 'leonart', file: 'leonart.png' },
  { id: 'wiitanks', file: 'tank_game.png' },
  { id: 'presence', file: 'facial_recognition.png' },
  { id: 'msc', file: 'msc_decouverte.png' },
]

const hex = ({ r, g, b }) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
const luma = ({ r, g, b }) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
const saturation = ({ r, g, b }) => {
  const max = Math.max(r, g, b)
  return max === 0 ? 0 : (max - Math.min(r, g, b)) / max
}

// La couleur dominante sert de lumière : presque noire ou presque blanche (luma < 0,12 ou > 0,9),
// elle ne colorerait rien. On échantillonne alors une grille 16x9 et on garde la couleur la plus saturée
// dont la luminosité reste utilisable ; à défaut, on éclaircit la dominante jusqu'à une luma de 0,25.
async function pickColor(image) {
  const { dominant } = await image.clone().stats()
  if (luma(dominant) >= 0.12 && luma(dominant) <= 0.9) return hex(dominant)
  const { data } = await image.clone().resize(16, 9, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let best = null
  for (let i = 0; i < data.length; i += 3) {
    const c = { r: data[i], g: data[i + 1], b: data[i + 2] }
    if (luma(c) < 0.18 || luma(c) > 0.85) continue
    if (!best || saturation(c) > saturation(best)) best = c
  }
  if (best) return hex(best)
  const k = Math.min(255 / Math.max(dominant.r, dominant.g, dominant.b, 1), 0.25 / Math.max(luma(dominant), 0.01))
  return hex({ r: dominant.r * k, g: dominant.g * k, b: dominant.b * k })
}

// Vérifie toutes les sources avant d'écrire quoi que ce soit.
const missing = SOURCES.map((s) => join(sources, s.file)).filter((p) => !existsSync(p))
if (missing.length) throw new Error(`image source absente : ${missing.join(', ')}`)

mkdirSync(out, { recursive: true })
const manifest = {}
for (const s of SOURCES) {
  const image = sharp(join(sources, s.file)).resize(1024, 576, { fit: 'cover', position: sharp.strategy.attention })
  const dest = join(out, `${s.id}.webp`)
  await image.clone().webp({ quality: 80 }).toFile(dest)
  const color = await pickColor(image.clone().png())
  const bytes = statSync(dest).size
  manifest[s.id] = { src: `/projects/${s.id}.webp`, width: 1024, height: 576, bytes, color }
  console.log(`${s.id.padEnd(10)} ${String(bytes).padStart(7)} octets  ${color}`)
}
writeFileSync(join(root, 'src/content/projectMedia.json'), `${JSON.stringify(manifest, null, 2)}\n`)
