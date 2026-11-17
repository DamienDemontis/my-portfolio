import { gramsForBytes, measureTransfer } from '../src/lib/carbon.js'

const stubPerf = (byType) =>
  vi.stubGlobal('performance', { getEntriesByType: (type) => byType[type] ?? [] })

test('zero octet, zero gramme', () => {
  expect(gramsForBytes(0)).toBe(0)
})

test('plus d octets, plus de grammes', () => {
  expect(gramsForBytes(2_000_000)).toBeGreaterThan(gramsForBytes(1_000_000))
})

test('l hebergement vert pese moins', () => {
  expect(gramsForBytes(1_000_000, { green: true })).toBeLessThan(gramsForBytes(1_000_000))
})

test('une entree absurde ne casse pas l affichage', () => {
  expect(gramsForBytes(-1)).toBe(0)
  expect(gramsForBytes(NaN)).toBe(0)
  expect(gramsForBytes(Infinity)).toBe(0)
})

test('la mesure separe le premier affichage de l experience complete', () => {
  stubPerf({
    resource: [
      { name: '/a.js', transferSize: 100_000, initiatorType: 'script' },
      { name: '/perso.glb', transferSize: 1_400_000, initiatorType: 'fetch' },
    ],
  })
  const { firstPaint, full } = measureTransfer()
  expect(firstPaint).toBe(100_000)
  expect(full).toBe(1_500_000)
})

test('la classification ignore la casse, la query et le hash, et les tailles absentes', () => {
  stubPerf({
    resource: [
      { name: 'https://x.io/a.js?v=1.glb', transferSize: 10 },
      { name: 'https://x.io/Perso.GLB?v=2#x', transferSize: 1000 },
      { name: '/son.mp3', transferSize: 500 },
      { name: '/env.hdr', transferSize: 200 },
      { name: '/b.css', transferSize: undefined },
      { name: '/c.css', transferSize: NaN },
    ],
  })
  expect(measureTransfer()).toEqual({ firstPaint: 10, full: 1710 })
})

test('sans API performance, la mesure vaut zero', () => {
  vi.stubGlobal('performance', undefined)
  expect(measureTransfer()).toEqual({ firstPaint: 0, full: 0 })
})

test('le document HTML compte dans les deux chiffres', () => {
  stubPerf({
    navigation: [{ entryType: 'navigation', name: '/', transferSize: 12_000 }],
    resource: [
      { name: '/a.js', transferSize: 100_000, initiatorType: 'script' },
      { name: '/perso.glb', transferSize: 1_400_000, initiatorType: 'fetch' },
    ],
  })
  expect(measureTransfer()).toEqual({ firstPaint: 112_000, full: 1_512_000 })
})

test('une revalidation 304 ou un cache memoire ne cachent pas le poids', () => {
  stubPerf({
    resource: [
      { name: '/intro/Mecha_Full.glb', transferSize: 300, encodedBodySize: 2_667_520 },
      { name: '/a.js', transferSize: 0, encodedBodySize: 100_000 },
    ],
  })
  expect(measureTransfer()).toEqual({ firstPaint: 100_000, full: 2_767_520 })
})

test('le document HTML utilise aussi encodedBodySize', () => {
  stubPerf({
    navigation: [{ entryType: 'navigation', name: '/', transferSize: 0, encodedBodySize: 12_000 }],
    resource: [{ name: '/a.js', transferSize: 0, encodedBodySize: 100_000 }],
  })
  expect(measureTransfer()).toEqual({ firstPaint: 112_000, full: 112_000 })
})
