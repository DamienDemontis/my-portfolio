import { createListening, fetchPreview } from '../src/lib/listening.js'

const TRACK = { id: 'feel-good-inc', title: 'Feel Good Inc', artist: 'Gorillaz', genre: 'Alternative', deezer: '3129407' }
const TRACK2 = { id: 'usseewa', title: 'x', artist: 'Ado', genre: 'J-Pop', deezer: '1110641342' }
const RES = { preview: 'https://cdn/p.mp3', link: 'https://deezer/t', cover: 'https://cdn/c.jpg' }

let audios, contexts
class FakeAudio {
  constructor() {
    audios.push(this)
    this.listeners = {}
    this.pause = vi.fn()
    this.removeAttribute = vi.fn()
    this.load = vi.fn()
  }
  addEventListener(n, f) { (this.listeners[n] ||= []).push(f) }
  emit(n) { (this.listeners[n] || []).forEach(f => f()) }
  play() { return Promise.resolve() }
}
class FakeContext {
  constructor() {
    contexts.push(this)
    this.state = 'running'
    this.destination = {}
    this.resume = vi.fn(async () => {})
    this.analyser = { fftSize: 0, smoothingTimeConstant: 0, frequencyBinCount: 1024, connect: vi.fn(), getByteFrequencyData: vi.fn(a => a.fill(255)) }
    this.source = { connect: vi.fn(), disconnect: vi.fn() }
  }
  createAnalyser() { return this.analyser }
  createMediaElementSource() { return this.source }
}

beforeEach(() => {
  audios = []
  contexts = []
  vi.stubGlobal('Audio', FakeAudio)
  vi.stubGlobal('AudioContext', FakeContext)
})

test('rien n est cree avant le premier play', () => {
  createListening({ resolve: async () => RES })
  expect(audios).toHaveLength(0)
  expect(contexts).toHaveLength(0)
})

test('play : audio et contexte crees une seule fois, chaine source -> analyseur -> sortie', async () => {
  const l = createListening({ resolve: async () => RES })
  const states = []
  l.subscribe(() => states.push(l.state))
  const p = l.play(TRACK)
  expect(l.state).toBe('loading')
  await p
  expect(l.state).toBe('playing')
  expect(l.current).toEqual({ track: TRACK, link: RES.link, cover: RES.cover })
  expect(audios).toHaveLength(1)
  expect(audios[0].crossOrigin).toBe('anonymous')
  expect(audios[0].preload).toBe('none')
  expect(audios[0].src).toBe(RES.preview)
  expect(contexts).toHaveLength(1)
  expect(contexts[0].analyser.fftSize).toBe(2048)
  expect(contexts[0].analyser.smoothingTimeConstant).toBe(0.6)
  expect(contexts[0].source.connect).toHaveBeenCalledWith(contexts[0].analyser)
  expect(contexts[0].analyser.connect).toHaveBeenCalledWith(contexts[0].destination)
  await l.play(TRACK2)
  expect(audios).toHaveLength(1)
  expect(contexts).toHaveLength(1)
  expect(states).toEqual(['loading', 'playing', 'loading', 'playing'])
})

test('contexte suspendu : resume() est appele', async () => {
  vi.stubGlobal('AudioContext', class extends FakeContext { constructor() { super(); this.state = 'suspended' } })
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(contexts[0].resume).toHaveBeenCalled()
})

test('erreur de resolution : error "unavailable" ou "network"', async () => {
  const l = createListening({ resolve: async () => { throw Object.assign(new Error('x'), { code: 'unavailable' }) } })
  await l.play(TRACK)
  expect(l.state).toBe('error')
  expect(l.error).toBe('unavailable')
  const l2 = createListening({ resolve: async () => { throw new TypeError('Failed to fetch') } })
  await l2.play(TRACK)
  expect(l2.state).toBe('error')
  expect(l2.error).toBe('network')
})

test('autoplay refuse : error "blocked"', async () => {
  const l = createListening({ resolve: async () => RES })
  const orig = FakeAudio.prototype.play
  FakeAudio.prototype.play = () => Promise.reject(Object.assign(new Error('no'), { name: 'NotAllowedError' }))
  try { await l.play(TRACK) } finally { FakeAudio.prototype.play = orig }
  expect(l.state).toBe('error')
  expect(l.error).toBe('blocked')
})

test('le dernier play gagne', async () => {
  let release
  const resolve = vi.fn(t => t === TRACK
    ? new Promise(r => { release = () => r({ ...RES, preview: 'first' }) })
    : Promise.resolve({ ...RES, preview: 'second' }))
  const l = createListening({ resolve })
  const first = l.play(TRACK)
  await l.play(TRACK2)
  release()
  await first
  expect(audios[0].src).toBe('second')
  expect(l.current.track).toBe(TRACK2)
  expect(l.state).toBe('playing')
})

test('pause, resume, fin d extrait, stop', async () => {
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  l.pause()
  expect(l.state).toBe('paused')
  expect(audios[0].pause).toHaveBeenCalled()
  await l.resume()
  expect(l.state).toBe('playing')
  audios[0].emit('ended')
  expect(l.state).toBe('idle')
  await l.play(TRACK)
  l.stop()
  expect(l.state).toBe('idle')
  expect(l.current).toBeNull()
  expect(audios[0].removeAttribute).toHaveBeenCalledWith('src')
  expect(audios[0].load).toHaveBeenCalled()
})

test('tick : bandes lues sur l analyseur, nulles hors lecture', async () => {
  const l = createListening({ resolve: async () => RES })
  l.tick()
  expect(l.bands).toEqual({ bass: 0, mid: 0, high: 0, kick: false, playing: false })
  await l.play(TRACK)
  l.tick()
  expect(l.bands.playing).toBe(true)
  expect(l.bands.bass).toBeCloseTo(0.5, 5)
  expect(l.bands.kick).toBe(true)
  l.tick()
  expect(l.bands.kick).toBe(false)
  l.pause()
  l.tick()
  expect(l.bands.playing).toBe(false)
})

test('sans AudioContext : lecture sans bandes', async () => {
  vi.stubGlobal('AudioContext', undefined)
  vi.stubGlobal('webkitAudioContext', undefined)
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(l.state).toBe('playing')
  l.tick()
  expect(l.bands).toEqual({ bass: 0, mid: 0, high: 0, kick: false, playing: true })
})

test('AudioContext qui echoue : lecture quand meme', async () => {
  vi.stubGlobal('AudioContext', class { constructor() { throw new Error('boom') } })
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(l.state).toBe('playing')
  l.tick()
  expect(l.bands.bass).toBe(0)
})

test('fetchPreview : appelle /api/preview?id= et renvoie les champs', async () => {
  const f = vi.fn(async () => ({ ok: true, status: 200, json: async () => RES }))
  vi.stubGlobal('fetch', f)
  expect(await fetchPreview(TRACK)).toEqual(RES)
  expect(f).toHaveBeenCalledWith('/api/preview?id=3129407', { signal: expect.any(AbortSignal) })
  vi.stubGlobal('fetch', async () => ({ ok: false, status: 502, json: async () => ({ error: 'unavailable' }) }))
  await expect(fetchPreview(TRACK)).rejects.toMatchObject({ code: 'unavailable' })
  vi.stubGlobal('fetch', async () => { throw new TypeError('x') })
  await expect(fetchPreview(TRACK)).rejects.toMatchObject({ code: 'network' })
})

test('fetchPreview : serveur muet -> network apres 8 s', async () => {
  vi.useFakeTimers()
  try {
    vi.stubGlobal('fetch', (url, { signal }) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(new Error('abort')))))
    const verdict = expect(fetchPreview(TRACK)).rejects.toMatchObject({ code: 'network' })
    await vi.advanceTimersByTimeAsync(8000)
    await verdict
  } finally { vi.useRealTimers() }
})

test('resume() du contexte appele dans le geste, avant la fin de resolve', async () => {
  vi.stubGlobal('AudioContext', class extends FakeContext { constructor() { super(); this.state = 'suspended' } })
  let fin
  const l = createListening({ resolve: () => new Promise(r => { fin = () => r(RES) }) })
  const p = l.play(TRACK)
  expect(contexts[0].resume).toHaveBeenCalledTimes(1) // synchrone, resolve toujours en attente
  expect(l.state).toBe('loading')
  fin()
  await p
  expect(l.state).toBe('playing')
})

test('resume() qui reste en suspens ne bloque pas la lecture', async () => {
  vi.stubGlobal('AudioContext', class extends FakeContext {
    constructor() { super(); this.state = 'suspended'; this.resume = vi.fn(() => new Promise(() => {})) }
  })
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(l.state).toBe('playing')
})

test('current vaut le nouveau morceau des le debut, meme en erreur', async () => {
  let echec
  const l = createListening({ resolve: t => t === TRACK ? Promise.resolve(RES) : new Promise((_, rej) => { echec = rej }) })
  await l.play(TRACK)
  const p = l.play(TRACK2)
  expect(l.current).toEqual({ track: TRACK2, link: null, cover: null })
  echec(new TypeError('x'))
  await p
  expect(l.state).toBe('error')
  expect(l.current.track).toBe(TRACK2)
})

test('erreur de l element : code 4 -> unavailable, autre -> network, source abandonnee ignoree', async () => {
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  audios[0].error = { code: 4 }
  audios[0].emit('error')
  expect(l.error).toBe('unavailable')
  await l.play(TRACK)
  audios[0].error = { code: 2 }
  audios[0].emit('error')
  expect(l.error).toBe('network')
  l.stop()
  audios[0].emit('error') // source abandonnee : sans effet
  expect(l.state).toBe('idle')
})

test('createMediaElementSource qui echoue : le contexte cree est ferme', async () => {
  vi.stubGlobal('AudioContext', class extends FakeContext {
    constructor() { super(); this.close = vi.fn(); this.createMediaElementSource = () => { throw new Error('boom') } }
  })
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(contexts[0].close).toHaveBeenCalled()
  expect(l.state).toBe('playing')
})
