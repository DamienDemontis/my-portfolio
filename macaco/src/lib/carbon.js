import { co2 } from '@tgwf/co2'

// Sustainable Web Design v4, via the Green Web Foundation library: the
// constants are theirs, so the figure can be defended to a technical reader.
// Figures are lower bounds: cache hits and cross-origin resources without
// Timing-Allow-Origin report a transferSize of 0.
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

function sizeOf(entry) {
  return Number.isFinite(entry?.transferSize) ? entry.transferSize : 0
}

export function measureTransfer() {
  const perf = typeof performance !== 'undefined' ? performance : undefined
  if (!perf?.getEntriesByType) return { firstPaint: 0, full: 0 }
  // The page's own HTML is part of the download, in both figures. Only a real
  // navigation entry counts (guards against stubs ignoring the type argument).
  const nav = (perf.getEntriesByType('navigation') ?? [])[0]
  const htmlBytes = nav?.entryType === 'navigation' ? sizeOf(nav) : 0
  let firstPaint = htmlBytes
  let full = htmlBytes
  for (const entry of perf.getEntriesByType('resource') ?? []) {
    const size = sizeOf(entry)
    full += size
    if (!isHeavy(entry.name)) firstPaint += size
  }
  return { firstPaint, full }
}
