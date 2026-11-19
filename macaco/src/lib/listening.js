// Moteur d'ecoute : un seul <audio>, un seul AudioContext, un analyseur dont la
// scene 3D lit les bandes a chaque image (tick). L'interface DOM s'abonne aux
// changements d'etat (pas aux images). Une seule musique sur la page.
import { BANDS, bandEnergy, smoothBands, detectKick, createKickState } from '../three/music/audioBands.js'

export const FETCH_TIMEOUT_MS = 8000

const erreurCode = (code) => Object.assign(new Error(code), { code })

// Demande a la fonction /api/preview l'extrait d'un morceau.
export async function fetchPreview(track) {
  // Delai maximal : si le serveur ne repond pas, on sort de `loading`.
  const ctl = new AbortController()
  const minuteur = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS)
  try {
    let r
    try {
      r = await fetch(`/api/preview?id=${track.deezer}`, { signal: ctl.signal })
    } catch {
      throw erreurCode('network')
    }
    if (!r.ok) throw erreurCode('unavailable')
    try {
      return await r.json()
    } catch {
      throw erreurCode('network')
    }
  } finally {
    clearTimeout(minuteur)
  }
}

export function createListening({ resolve = fetchPreview } = {}) {
  let audio = null
  let ctx = null
  let analyser = null
  let data = null
  let state = 'idle'
  let error = null
  let current = null
  let seq = 0
  let srcSeq = -1 // numero du play qui a pose la source de l'element
  let lisses = { bass: 0, mid: 0, high: 0 }
  let kickState = createKickState()
  const bands = { bass: 0, mid: 0, high: 0, kick: false, playing: false }
  const abonnes = new Set()

  // Previent l'interface quand l'etat, l'erreur ou le morceau courant change
  // (pas a chaque image).
  let vu = null
  const set = (s, e = null) => {
    if (s === state && e === error && current === vu) return
    state = s
    error = e
    vu = current
    abonnes.forEach(fn => fn())
  }

  // Cree l'element audio et la chaine d'analyse au premier play (dans le geste
  // du visiteur). Sans AudioContext, ou s'il echoue : lecture seule, sans bandes.
  const preparer = () => {
    if (audio) return
    audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audio.addEventListener('ended', () => set('idle'))
    audio.addEventListener('error', () => {
      // Ignore l'erreur d'une source abandonnee (autre play, stop).
      if (srcSeq !== seq) return
      // Code 4 (MEDIA_ERR_SRC_NOT_SUPPORTED) : URL signee expiree ou extrait retire.
      set('error', audio.error && audio.error.code === 4 ? 'unavailable' : 'network')
    })
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext
    if (!Ctx) return
    try {
      ctx = new Ctx()
      analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.6
      ctx.createMediaElementSource(audio).connect(analyser)
      analyser.connect(ctx.destination)
      data = new Uint8Array(analyser.frequencyBinCount)
    } catch {
      try { ctx && ctx.close && ctx.close() } catch { /* deja ferme */ }
      ctx = analyser = data = null
    }
  }

  // A appeler dans le geste du visiteur (iOS Safari refuse hors de la pile du clic).
  const reveiller = () => {
    if (ctx && ctx.state === 'suspended') {
      try { Promise.resolve(ctx.resume()).catch(() => {}) } catch { /* ignore */ }
    }
  }

  const lecture = async (mon) => {
    try {
      // Sans attendre : un resume() en suspens ne doit pas bloquer la lecture.
      reveiller()
      await audio.play()
      if (mon === seq) set('playing')
    } catch (e) {
      if (mon !== seq) return
      set('error', e && e.name === 'NotAllowedError' ? 'blocked' : 'network')
    }
  }

  const listening = {
    get state() { return state },
    get error() { return error },
    get current() { return current },
    get bands() { return bands },

    async play(track) {
      const mon = ++seq
      preparer()
      reveiller() // synchrone, avant tout await : dans la pile du clic
      audio.pause()
      lisses = { bass: 0, mid: 0, high: 0 }
      kickState = createKickState()
      current = { track, link: null, cover: null } // jamais le morceau precedent pendant loading ou error
      set('loading')
      let r
      try {
        r = await resolve(track)
      } catch (e) {
        if (mon === seq) set('error', e && e.code === 'unavailable' ? 'unavailable' : 'network')
        return
      }
      if (mon !== seq) return
      current = { track, link: r.link, cover: r.cover }
      srcSeq = mon
      audio.src = r.preview
      await lecture(mon)
    },

    pause() {
      if (state !== 'playing' || !audio) return
      audio.pause()
      set('paused')
    },

    async resume() {
      if (state !== 'paused' || !audio) return
      await lecture(seq)
    },

    stop() {
      seq++
      if (audio) {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
      current = null
      set('idle')
    },

    subscribe(fn) {
      abonnes.add(fn)
      return () => abonnes.delete(fn)
    },

    // Appele par la scene a chaque image ; sans effet hors lecture.
    tick() {
      const jouer = state === 'playing'
      bands.playing = jouer
      if (!jouer || !analyser) {
        lisses = { bass: 0, mid: 0, high: 0 }
        bands.bass = bands.mid = bands.high = 0
        bands.kick = false
        return
      }
      analyser.getByteFrequencyData(data)
      const brut = {
        bass: bandEnergy(data, ...BANDS.bass),
        mid: bandEnergy(data, ...BANDS.mid),
        high: bandEnergy(data, ...BANDS.high),
      }
      lisses = smoothBands(lisses, brut)
      const k = detectKick(kickState, lisses.bass)
      kickState = k.state
      bands.bass = lisses.bass
      bands.mid = lisses.mid
      bands.high = lisses.high
      bands.kick = k.kick
    },
  }
  return listening
}

// Instance partagee : une seule musique a la fois sur la page.
export const listening = createListening()
