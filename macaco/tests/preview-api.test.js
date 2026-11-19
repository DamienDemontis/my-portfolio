// @vitest-environment node
import handler, { previewFor } from '../api/preview.js'

const ok = (body, status = 200) => async () => ({ ok: status === 200, status, json: async () => body })

test('id refuse : absent, non numerique, hors playlist -> 400', async () => {
  for (const id of [undefined, '', 'abc', '1', '3129407; DROP']) {
    const r = await previewFor(id, async () => { throw new Error('ne doit pas etre appele') })
    expect(r.status).toBe(400)
    expect(r.body).toEqual({ error: 'unknown' })
  }
})

test('succes : reponse reduite a trois champs et en-tete de cache', async () => {
  const fetchImpl = vi.fn(ok({
    id: 3129407, title: 'Feel Good Inc', preview: 'https://cdn/p.mp3', link: 'https://www.deezer.com/track/3129407',
    artist: { name: 'x' }, album: { cover_medium: 'https://cdn/c.jpg', cover_big: 'z' }, secret: 1,
  }))
  const r = await previewFor('3129407', fetchImpl)
  expect(fetchImpl).toHaveBeenCalledWith('https://api.deezer.com/track/3129407')
  expect(r.status).toBe(200)
  expect(r.body).toEqual({ preview: 'https://cdn/p.mp3', link: 'https://www.deezer.com/track/3129407', cover: 'https://cdn/c.jpg' })
  expect(r.headers['Cache-Control']).toBe('public, max-age=300')
  expect(r.headers['Content-Type']).toBe('application/json; charset=utf-8')
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
  vi.stubGlobal('fetch', ok({ preview: 'p', link: 'l', album: { cover_medium: 'c' } }))
  const headers = {}
  const res = { setHeader: (k, v) => { headers[k] = v }, end: vi.fn() }
  await handler({ url: '/api/preview?id=3129407' }, res)
  expect(res.statusCode).toBe(200)
  expect(headers['Cache-Control']).toBe('public, max-age=300')
  expect(JSON.parse(res.end.mock.calls[0][0])).toEqual({ preview: 'p', link: 'l', cover: 'c' })
  const res2 = { setHeader: () => {}, end: vi.fn() }
  await handler({ url: '/api/preview' }, res2)
  expect(res2.statusCode).toBe(400)
})
