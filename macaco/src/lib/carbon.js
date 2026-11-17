import { co2 } from '@tgwf/co2'

// Sustainable Web Design v4, via the Green Web Foundation library: the
// constants are theirs, so the figure can be defended to a technical reader.
const estimator = new co2({ model: 'swd', version: 4 })

// Heavy assets excluded from the "first display" figure but kept in "full".
const HEAVY = /\.(glb|gltf|bin|hdr|ktx2|mp3|mp4|webm|ogg|opus|m4a)$/i

export function gramsForBytes(bytes, { green = false } = {}) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 0
  return estimator.perByte(bytes, green)
}

function isHeavy(url) {
  const path = String(url ?? '').split(/[?#]/)[0]
  return HEAVY.test(path)
}

export function measureTransfer() {
  const entries =
    typeof performance !== 'undefined' && performance?.getEntriesByType
      ? performance.getEntriesByType('resource')
      : []
  let firstPaint = 0
  let full = 0
  for (const entry of entries) {
    const size = Number.isFinite(entry.transferSize) ? entry.transferSize : 0
    full += size
    if (!isHeavy(entry.name)) firstPaint += size
  }
  return { firstPaint, full }
}
