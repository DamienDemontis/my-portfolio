// The oxidation ramp: the site's accent is not one colour but a function of
// scroll position, running from polished chrome to moss. Two stops (A18166,
// 5E5441) are the channel-wise sRGB mean of their neighbours, so the eight
// stops can sit evenly at i/7.
const COLORS = [
  ['chrome', '#D6D9DC'],
  ['acier', '#8A8F98'],
  ['acier-cuivre', '#A18166'],
  ['cuivre', '#B87333'],
  ['rouille', '#8C3A1E'],
  ['rouille-verdigris', '#5E5441'],
  ['verdigris', '#2F6E63'],
  ['mousse', '#3A4A3C'],
]

export const OXIDATION_RAMP = COLORS.map(([name, hex], i) => ({
  stop: i / (COLORS.length - 1),
  hex,
  name,
}))

const toRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
const toHex = rgb =>
  '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()

export function accentForProgress(p) {
  const t = Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0
  const last = OXIDATION_RAMP.length - 1
  let i = 0
  while (i < last - 1 && t > OXIDATION_RAMP[i + 1].stop) i++
  const a = OXIDATION_RAMP[i]
  const b = OXIDATION_RAMP[i + 1]
  const k = (t - a.stop) / (b.stop - a.stop)
  const ca = toRgb(a.hex)
  const cb = toRgb(b.hex)
  return toHex(ca.map((c, n) => Math.round(c + (cb[n] - c) * k)))
}
