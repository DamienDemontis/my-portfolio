// @vitest-environment node
import { readFileSync } from 'node:fs'
import handler, { previewFor } from '../api/preview.js'

const ok = (body, status = 200) => async () => ({ ok: status === 200, status, json: async () => body })

// Des adresses comme celles que Deezer renvoie : extrait et pochette sur son CDN (dzcdn.net).
const PREVIEW = 'https://cdnt-preview.dzcdn.net/api/1/1/a/b/c/0/abc.mp3?hdnea=exp=1~acl=/api/1/1/a/b/c/0/abc.mp3*~data=user_id=0~hmac=x'
const COVER = 'https://cdn-images.dzcdn.net/images/cover/feel/250x250-000000-80-0-0.jpg'
const LINK = 'https://www.deezer.com/track/3129407'
const SUCCES = 'public, max-age=300, s-maxage=300'

test('id refuse : absent, non numerique, hors playlist -> 400', async () => {
  for (const id of [undefined, '', 'abc', '1', '3129407; DROP']) {
    const r = await previewFor(id, async () => { throw new Error('ne doit pas etre appele') })
    expect(r.status).toBe(400)
    expect(r.body).toEqual({ error: 'unknown' })
  }
})

test('succes : reponse reduite a trois champs et en-tete de cache (navigateur et CDN)', async () => {
  const fetchImpl = vi.fn(ok({
    id: 3129407, title: 'Feel Good Inc', preview: PREVIEW, link: 'https://www.deezer.com/track/3129407',
    artist: { name: 'x' }, album: { cover_medium: COVER, cover_big: 'z' }, secret: 1,
  }))
  const r = await previewFor('3129407', fetchImpl)
  expect(fetchImpl).toHaveBeenCalledWith('https://api.deezer.com/track/3129407', { signal: expect.any(AbortSignal) })
  expect(r.status).toBe(200)
  expect(r.body).toEqual({ preview: PREVIEW, link: LINK, cover: COVER })
  expect(r.headers['Cache-Control']).toBe(SUCCES)
  expect(r.headers['Content-Type']).toBe('application/json; charset=utf-8')
})

test('le lien Deezer est construit depuis l id, jamais repris de la reponse', async () => {
  const r = await previewFor('3129407', ok({ preview: PREVIEW, link: 'https://evil.example/phish', album: { cover_medium: COVER } }))
  expect(r.status).toBe(200)
  expect(r.body.link).toBe(LINK)
  const sansLien = await previewFor('3129407', ok({ preview: PREVIEW, album: { cover_medium: COVER } }))
  expect(sansLien.body.link).toBe(LINK)
})

test('extrait ou pochette hors du CDN de Deezer en https : 502', async () => {
  const mauvaises = [
    'http://cdnt-preview.dzcdn.net/p.mp3', // pas https
    'https://evil.example/p.mp3',
    'https://dzcdn.net.evil.example/p.mp3',
    'https://evildzcdn.net/p.mp3',
    'javascript:alert(1)',
    'pas une url',
  ]
  for (const preview of mauvaises) {
    const r = await previewFor('3129407', ok({ preview, album: { cover_medium: COVER } }))
    expect(r.status, preview).toBe(502)
    expect(r.body).toEqual({ error: 'unavailable' })
    expect(r.headers['Cache-Control']).toBe('no-store')
  }
  for (const cover of mauvaises) {
    const r = await previewFor('3129407', ok({ preview: PREVIEW, album: { cover_medium: cover } }))
    expect(r.status, cover).toBe(502)
    expect(r.body).toEqual({ error: 'unavailable' })
  }
})

test('sans pochette : extrait servi, pochette nulle', async () => {
  const r = await previewFor('3129407', ok({ preview: PREVIEW }))
  expect(r.status).toBe(200)
  expect(r.body).toEqual({ preview: PREVIEW, link: LINK, cover: null })
})

test('502 : erreur Deezer, statut en echec, pas d extrait, exception', async () => {
  const cas = [
    ok({ error: { type: 'DataException' } }),
    ok({}, 500),
    ok({ preview: '', link: 'l' }),
    async () => { throw new Error('reseau') },
  ]
  for (const f of cas) {
    const r = await previewFor('3129407', f)
    expect(r.status).toBe(502)
    expect(r.body).toEqual({ error: 'unavailable' })
    expect(r.headers['Cache-Control']).toBe('no-store')
  }
})

test('le gestionnaire ecrit statut, en-tetes et corps JSON', async () => {
  vi.stubGlobal('fetch', ok({ preview: PREVIEW, link: 'l', album: { cover_medium: COVER } }))
  const headers = {}
  const res = { setHeader: (k, v) => { headers[k] = v }, end: vi.fn() }
  await handler({ url: '/api/preview?id=3129407' }, res)
  expect(res.statusCode).toBe(200)
  expect(headers['Cache-Control']).toBe(SUCCES)
  expect(JSON.parse(res.end.mock.calls[0][0])).toEqual({ preview: PREVIEW, link: LINK, cover: COVER })
  const res2 = { setHeader: () => {}, end: vi.fn() }
  await handler({ url: '/api/preview' }, res2)
  expect(res2.statusCode).toBe(400)
})

test('Deezer muet : 502 apres 5 s (signal abandonne)', async () => {
  vi.useFakeTimers()
  try {
    const muet = (url, { signal }) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(new Error('abort'))))
    const p = previewFor('3129407', muet)
    let fini = false
    p.then(() => { fini = true })
    await vi.advanceTimersByTimeAsync(4999)
    expect(fini).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    const r = await p
    expect(r.status).toBe(502)
    expect(r.body).toEqual({ error: 'unavailable' })
  } finally { vi.useRealTimers() }
})

test('les fonctions tournent en France (cdg1), pres du public et du catalogue Deezer FR', () => {
  const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  expect(vercel.regions).toEqual(['cdg1'])
})
