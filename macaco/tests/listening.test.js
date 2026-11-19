import { createListening, fetchPreview } from '../src/lib/listening.js'

const TRACK = { id: 'feel-good-inc', title: 'Feel Good Inc', artist: 'Gorillaz', genre: 'Alternative', deezer: '3129407' }
const TRACK2 = { id: 'usseewa', title: 'x', artist: 'Ado', genre: 'J-Pop', deezer: '1110641342' }
const RES = { preview: 'https://cdn/p.mp3', link: 'https://deezer/t', cover: 'https://cdn/c.jpg' }

// Faux élément audio : play() espionné (son comportement par défaut vient de FakeAudio.jouer,
// remplaçable par test, ou d'un mockImplementationOnce sur l'instance), src qui se vide quand on
// retire l'attribut, et emit() pour les événements que le navigateur enverrait (pause, play,
// playing, ended, error).
let audios, contexts
class FakeAudio {
  constructor() {
    audios.push(this)
    this.listeners = {}
    this.src = ''
    this.ended = false
    this.error = null
    this.play = vi.fn(() => FakeAudio.jouer(this))
    this.pause = vi.fn()
    this.removeAttribute = vi.fn((nom) => { if (nom === 'src') this.src = '' })
    this.load = vi.fn()
  }
  addEventListener(n, f) { (this.listeners[n] ||= []).push(f) }
  emit(n) { (this.listeners[n] || []).forEach(f => f()) }
}
// Faux contexte : resume() le fait tourner, suspend() l'endort (comme un navigateur qui accepte).
class FakeContext {
  constructor() {
    contexts.push(this)
    this.state = 'running'
    this.destination = {}
    this.resume = vi.fn(async () => { this.state = 'running' })
    this.suspend = vi.fn(async () => { this.state = 'suspended' })
    this.analyser = { fftSize: 0, smoothingTimeConstant: 0, frequencyBinCount: 1024, connect: vi.fn(), getByteFrequencyData: vi.fn(a => a.fill(255)) }
    this.source = { connect: vi.fn(), disconnect: vi.fn() }
  }
  createAnalyser() { return this.analyser }
  createMediaElementSource() { return this.source }
}
// Rejet de play() tel que le navigateur le nomme (NotAllowedError, NotSupportedError, AbortError).
const refus = (name) => Object.assign(new Error(name), { name })

beforeEach(() => {
  audios = []
  contexts = []
  FakeAudio.jouer = () => Promise.resolve()
  vi.stubGlobal('Audio', FakeAudio)
  vi.stubGlobal('AudioContext', FakeContext)
})

afterEach(() => {
  vi.useRealTimers()
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
  FakeAudio.jouer = () => Promise.reject(refus('NotAllowedError'))
  await l.play(TRACK)
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

test('resume() qui reste en suspens ne bloque pas la lecture ; 500 ms plus tard, contexte muet -> blocked', async () => {
  vi.useFakeTimers()
  vi.stubGlobal('AudioContext', class extends FakeContext {
    constructor() { super(); this.state = 'suspended'; this.resume = vi.fn(() => new Promise(() => {})) }
  })
  const resolve = vi.fn(async () => RES)
  const l = createListening({ resolve })
  await l.play(TRACK)
  expect(l.state).toBe('playing')
  await vi.advanceTimersByTimeAsync(499)
  expect(l.state).toBe('playing')
  await vi.advanceTimersByTimeAsync(1)
  expect(l.state).toBe('error')
  expect(l.error).toBe('blocked')
  // l'extrait ne file pas en silence
  expect(audios[0].pause).toHaveBeenCalledTimes(2) // celle du déverrouillage, puis celle-ci
  // La relance (dans le geste) reprend le contexte et l'élément, sans nouvelle requête.
  const ctx = contexts[0]
  ctx.resume.mockImplementation(async () => { ctx.state = 'running' })
  const avant = ctx.resume.mock.calls.length
  const relance = l.resume()
  expect(ctx.resume).toHaveBeenCalledTimes(avant + 1)
  await relance
  expect(resolve).toHaveBeenCalledTimes(1)
  expect(l.state).toBe('playing')
  await vi.advanceTimersByTimeAsync(1000)
  expect(l.state).toBe('playing')
})

// ——— Vague finale : iOS (geste), événements de l'élément, délais, contexte endormi ———

test('play() appelle audio.play() de façon synchrone, avant que resolve ne se règle, puis le remet en pause', async () => {
  let fin
  const l = createListening({ resolve: () => new Promise(r => { fin = () => r(RES) }) })
  const p = l.play(TRACK)
  const a = audios[0]
  // dans la pile du clic : l'élément est déverrouillé (WebKit), puis remis en pause
  expect(a.play).toHaveBeenCalledTimes(1)
  expect(a.pause).toHaveBeenCalledTimes(1)
  expect(a.play.mock.invocationCallOrder[0]).toBeLessThan(a.pause.mock.invocationCallOrder[0])
  expect(l.state).toBe('loading')
  fin()
  await p
  expect(a.play).toHaveBeenCalledTimes(2)
  expect(l.state).toBe('playing')
})

test('le rejet du play() de déverrouillage (AbortError de la pause) est avalé', async () => {
  let n = 0
  FakeAudio.jouer = () => (n++ === 0 ? Promise.reject(refus('AbortError')) : Promise.resolve())
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(l.state).toBe('playing')
  expect(l.error).toBeNull()
})

test('play() de l élément rejeté une fois (NotAllowedError) : blocked ; la relance rejoue sans rappeler resolve', async () => {
  const resolve = vi.fn(async () => RES)
  const l = createListening({ resolve })
  const p = l.play(TRACK)
  const a = audios[0]
  a.play.mockImplementationOnce(() => Promise.reject(refus('NotAllowedError')))
  await p
  expect(l.state).toBe('error')
  expect(l.error).toBe('blocked')
  const appels = a.play.mock.calls.length
  const relance = l.resume()
  // synchrone : dans le geste du visiteur
  expect(a.play).toHaveBeenCalledTimes(appels + 1)
  await relance
  expect(resolve).toHaveBeenCalledTimes(1)
  expect(a.src).toBe(RES.preview)
  expect(l.state).toBe('playing')
  expect(l.current).toEqual({ track: TRACK, link: RES.link, cover: RES.cover })
})

test('relance après blocked sans extrait posé : nouvelle résolution ; resume() sans effet sur les autres erreurs', async () => {
  const resolve = vi.fn(async () => RES)
  const l = createListening({ resolve })
  const p = l.play(TRACK)
  audios[0].play.mockImplementationOnce(() => Promise.reject(refus('NotAllowedError')))
  await p
  audios[0].src = '' // source perdue
  await l.resume()
  expect(resolve).toHaveBeenCalledTimes(2)
  expect(l.state).toBe('playing')
  // Erreur « unavailable » : resume() ne fait rien (le bouton relance par play()).
  const l2 = createListening({ resolve: async () => { throw Object.assign(new Error('x'), { code: 'unavailable' }) } })
  await l2.play(TRACK)
  const appels = audios[1].play.mock.calls.length
  await l2.resume()
  expect(audios[1].play).toHaveBeenCalledTimes(appels)
  expect(l2.error).toBe('unavailable')
})

test('pause et reprise venues d ailleurs (touches média, écouteurs) : l état suit l élément', async () => {
  const l = createListening({ resolve: async () => RES })
  const vus = []
  l.subscribe(() => vus.push(l.state))
  await l.play(TRACK)
  const a = audios[0]
  a.emit('pause')
  expect(l.state).toBe('paused')
  a.emit('play')
  expect(l.state).toBe('playing')
  a.emit('pause')
  a.emit('playing')
  expect(l.state).toBe('playing')
  expect(vus).toEqual(['loading', 'playing', 'paused', 'playing', 'paused', 'playing'])
  // La pause du moteur : l'événement qui suit ne change rien.
  l.pause()
  a.emit('pause')
  expect(l.state).toBe('paused')
  a.emit('play')
  expect(l.state).toBe('playing')
  // Fin de l'extrait : le navigateur émet pause (ended vrai) puis ended -> repos, jamais paused.
  a.ended = true
  a.emit('pause')
  expect(l.state).toBe('playing')
  a.emit('ended')
  expect(l.state).toBe('idle')
})

test('pause et play d une source abandonnée ou pendant le chargement : sans effet', async () => {
  let fin
  const l = createListening({ resolve: t => (t === TRACK ? Promise.resolve(RES) : new Promise(r => { fin = () => r(RES) })) })
  await l.play(TRACK)
  l.pause()
  const p = l.play(TRACK2)
  const a = audios[0]
  a.emit('pause')
  a.emit('play')
  a.emit('playing')
  expect(l.state).toBe('loading')
  // fin de l'ancien extrait arrivée après le clic : ignorée
  a.emit('ended')
  expect(l.state).toBe('loading')
  fin()
  await p
  expect(l.state).toBe('playing')
})

test('élément en erreur (code 4) puis rejet NotSupportedError : unavailable', async () => {
  const l = createListening({ resolve: async () => RES })
  const p = l.play(TRACK)
  const a = audios[0]
  // L'ordre du navigateur : l'événement error, puis le rejet de la promesse de play().
  a.play.mockImplementationOnce(() => new Promise((_, rej) => {
    queueMicrotask(() => {
      a.error = { code: 4 }
      a.emit('error')
      rej(refus('NotSupportedError'))
    })
  }))
  await p
  expect(l.state).toBe('error')
  expect(l.error).toBe('unavailable')
  // Rejet NotSupportedError seul : unavailable aussi.
  const p2 = l.play(TRACK)
  a.play.mockImplementationOnce(() => Promise.reject(refus('NotSupportedError')))
  await p2
  expect(l.error).toBe('unavailable')
})

test('une pause pendant la reprise (AbortError) laisse la pause ; une erreur déjà posée reste', async () => {
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  l.pause()
  const a = audios[0]
  let rejeter
  a.play.mockImplementationOnce(() => new Promise((_, rej) => { rejeter = rej }))
  const r = l.resume()
  a.emit('play') // la reprise commence : l'état suit
  expect(l.state).toBe('playing')
  l.pause()
  rejeter(refus('AbortError'))
  await r
  expect(l.state).toBe('paused')
  // Erreur réseau de l'élément, puis rejet AbortError : l'erreur posée reste.
  const p = l.play(TRACK)
  a.play.mockImplementationOnce(() => new Promise((_, rej) => {
    queueMicrotask(() => {
      a.error = { code: 2 }
      a.emit('error')
      rej(refus('AbortError'))
    })
  }))
  await p
  expect(l.error).toBe('network')
})

test('contexte « interrupted » (WebKit) : repris au play', async () => {
  vi.stubGlobal('AudioContext', class extends FakeContext { constructor() { super(); this.state = 'interrupted' } })
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(contexts[0].resume).toHaveBeenCalled()
  expect(l.state).toBe('playing')
})

test('contexte fermé : pas de resume()', async () => {
  vi.stubGlobal('AudioContext', class extends FakeContext { constructor() { super(); this.state = 'closed' } })
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  expect(contexts[0].resume).not.toHaveBeenCalled()
})

test('lecture qui ne démarre pas : network après 10 s', async () => {
  vi.useFakeTimers()
  FakeAudio.jouer = () => new Promise(() => {})
  const l = createListening({ resolve: async () => RES })
  l.play(TRACK)
  await vi.advanceTimersByTimeAsync(9999)
  expect(l.state).toBe('loading')
  await vi.advanceTimersByTimeAsync(1)
  expect(l.state).toBe('error')
  expect(l.error).toBe('network')
  // l'élément est arrêté : il ne démarrera pas plus tard dans un état d'erreur
  expect(audios[0].pause).toHaveBeenCalledTimes(2)
})

test('délai de démarrage annulé par playing, par stop et par une nouvelle séquence', async () => {
  vi.useFakeTimers()
  let demarrer
  FakeAudio.jouer = () => new Promise(r => { demarrer = r })
  const l = createListening({ resolve: async () => RES })
  // playing (l'événement seul suffit à annuler le délai)
  const p = l.play(TRACK)
  await vi.advanceTimersByTimeAsync(5000)
  audios[0].emit('playing')
  await vi.advanceTimersByTimeAsync(10000)
  expect(l.state).not.toBe('error')
  demarrer()
  await p
  expect(l.state).toBe('playing')
  // stop
  l.play(TRACK)
  await vi.advanceTimersByTimeAsync(5000)
  l.stop()
  await vi.advanceTimersByTimeAsync(10000)
  expect(l.state).toBe('idle')
  expect(l.error).toBeNull()
  // nouvelle séquence : le délai repart de zéro
  l.play(TRACK)
  await vi.advanceTimersByTimeAsync(6000)
  l.play(TRACK2)
  await vi.advanceTimersByTimeAsync(6000)
  expect(l.state).toBe('loading')
  await vi.advanceTimersByTimeAsync(4000)
  expect(l.state).toBe('error')
  expect(l.current.track).toBe(TRACK2)
})

test('contexte endormi à l arrêt et à la fin d un extrait, repris au play suivant', async () => {
  const l = createListening({ resolve: async () => RES })
  await l.play(TRACK)
  const ctx = contexts[0]
  l.stop()
  expect(ctx.suspend).toHaveBeenCalledTimes(1)
  expect(ctx.state).toBe('suspended')
  const p = l.play(TRACK)
  expect(ctx.resume).toHaveBeenCalledTimes(1) // dans le geste
  await p
  expect(l.state).toBe('playing')
  audios[0].ended = true
  audios[0].emit('pause')
  audios[0].emit('ended')
  expect(l.state).toBe('idle')
  expect(ctx.suspend).toHaveBeenCalledTimes(2)
  // sans contexte : arrêt sans erreur
  vi.stubGlobal('AudioContext', undefined)
  const l2 = createListening({ resolve: async () => RES })
  l2.stop()
  await l2.play(TRACK)
  l2.stop()
  expect(l2.state).toBe('idle')
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

test('play(B) pendant le chargement de A : abonnes prevenus, etat toujours loading', async () => {
  const fins = {}
  const l = createListening({ resolve: t => new Promise(r => { fins[t.id] = () => r(RES) }) })
  const vus = []
  l.subscribe(() => vus.push({ state: l.state, track: l.current && l.current.track }))
  const a = l.play(TRACK)
  const b = l.play(TRACK2)
  expect(vus.at(-1)).toEqual({ state: 'loading', track: TRACK2 })
  fins[TRACK.id](); fins[TRACK2.id]()
  await Promise.all([a, b])
  expect(l.state).toBe('playing')
})
