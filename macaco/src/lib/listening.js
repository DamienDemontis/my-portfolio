// Moteur d'ecoute : un seul <audio>, un seul AudioContext, un analyseur dont la
// scene 3D lit les bandes a chaque image (tick). L'interface DOM s'abonne aux
// changements d'etat (pas aux images). Une seule musique sur la page.
import { BANDS, REFERENCE_DT, bandEnergy, smoothBands, detectKick, createKickState } from '../three/music/audioBands.js'

export const FETCH_TIMEOUT_MS = 8000
// Une fois l'extrait pose, delai maximal avant que la lecture ne demarre (evenement playing).
export const START_TIMEOUT_MS = 10000
// Apres un play() reussi, delai laisse au contexte audio pour tourner (sinon : silence).
export const CONTEXT_GRACE_MS = 500

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
  // Minuteries : demarrage de la lecture (START_TIMEOUT_MS), contexte muet (CONTEXT_GRACE_MS).
  let minuteurDemarrage = null
  let minuteurContexte = null
  const annulerDemarrage = () => {
    clearTimeout(minuteurDemarrage)
    minuteurDemarrage = null
  }
  const annulerContexte = () => {
    clearTimeout(minuteurContexte)
    minuteurContexte = null
  }

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
    audio.addEventListener('ended', () => {
      // Ignore la fin d'une source abandonnee (fin arrivee juste apres le clic sur un autre morceau).
      if (srcSeq !== seq) return
      annulerContexte()
      endormir()
      set('idle')
    })
    audio.addEventListener('error', () => {
      // Ignore l'erreur d'une source abandonnee (autre play, stop).
      if (srcSeq !== seq) return
      // Code 4 (MEDIA_ERR_SRC_NOT_SUPPORTED) : URL signee expiree ou extrait retire.
      set('error', audio.error && audio.error.code === 4 ? 'unavailable' : 'network')
    })
    // Pauses et reprises venues d'ailleurs (touches media, ecouteurs, appel, centre de controle,
    // page mise en cache) : l'etat suit l'element. Celles du moteur ne changent rien : l'etat a
    // deja change quand l'evenement arrive. En fin d'extrait, le navigateur emet pause (ended
    // vrai) avant ended : ce n'est pas une pause.
    audio.addEventListener('pause', () => {
      if (state === 'playing' && !audio.ended) set('paused')
    })
    const reprise = () => {
      if (state !== 'paused' || srcSeq !== seq) return
      reveiller()
      set('playing')
      surveillerContexte(seq)
    }
    audio.addEventListener('play', reprise)
    audio.addEventListener('playing', reprise)
    // La lecture a demarre : le delai de demarrage n'a plus lieu d'etre.
    audio.addEventListener('playing', annulerDemarrage)
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

  // A appeler dans le geste du visiteur (iOS Safari refuse hors de la pile du clic). Tout etat
  // autre que running ou closed : suspended, et interrupted chez WebKit (appel, autre app).
  const reveiller = () => {
    if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') {
      try { Promise.resolve(ctx.resume()).catch(() => {}) } catch { /* ignore */ }
    }
  }

  // A l'arret et a la fin d'un extrait : le contexte cesse de calculer pour rien. Le play()
  // suivant le reprend, dans le geste (reveiller).
  const endormir = () => {
    if (ctx && ctx.state !== 'closed' && typeof ctx.suspend === 'function') {
      try { Promise.resolve(ctx.suspend()).catch(() => {}) } catch { /* ignore */ }
    }
  }

  // L'element joue, mais le son passe par le contexte : s'il ne tourne toujours pas peu apres
  // (reprise refusee hors du geste, contexte interrompu), on n'entendrait rien. L'extrait est
  // alors arrete et l'etat passe a « blocked » : la relance (resume(), dans le geste) reprend le
  // contexte et l'element.
  const surveillerContexte = (mon) => {
    annulerContexte()
    if (!ctx || ctx.state === 'running') return
    minuteurContexte = setTimeout(() => {
      minuteurContexte = null
      if (mon !== seq || state !== 'playing' || !ctx || ctx.state === 'running') return
      audio.pause()
      set('error', 'blocked')
    }, CONTEXT_GRACE_MS)
  }

  const lecture = async (mon) => {
    try {
      // Sans attendre : un resume() en suspens ne doit pas bloquer la lecture.
      reveiller()
      await audio.play()
      if (mon !== seq) return
      annulerDemarrage()
      set('playing')
      surveillerContexte(mon)
    } catch (e) {
      if (mon !== seq) return
      annulerDemarrage()
      const nom = e && e.name
      if (nom === 'NotAllowedError') set('error', 'blocked')
      // Source illisible (URL signee expiree) ; l'evenement error de l'element, arrive juste
      // avant, a deja pose « unavailable » : le rejet le confirme.
      else if (nom === 'NotSupportedError') set('error', 'unavailable')
      // Autre rejet (AbortError d'une pause, du delai de demarrage) : seul un chargement en
      // cours echoue ; une pause, ou une erreur deja posee pour cette lecture, reste.
      else if (state === 'loading') set('error', 'network')
    }
  }

  const listening = {
    get state() { return state },
    get error() { return error },
    get current() { return current },
    get bands() { return bands },

    async play(track) {
      const mon = ++seq
      annulerDemarrage()
      annulerContexte()
      preparer()
      reveiller() // synchrone, avant tout await : dans la pile du clic
      // Deverrouille l'element dans le geste : WebKit leve sa restriction sur un play() fait
      // dans la pile du clic, meme sans source ; la pause qui suit rejette cette promesse
      // (AbortError), avalee. La vraie lecture, apres la resolution, n'est plus refusee.
      try {
        const p = audio.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      } catch { /* play() qui leve (vieux navigateur) : la lecture tranchera */ }
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
      // Extrait pose mais lecture qui ne demarre pas (reseau qui cale) : on sort de loading.
      // L'element est arrete, pour qu'il ne demarre pas plus tard dans un etat d'erreur.
      minuteurDemarrage = setTimeout(() => {
        minuteurDemarrage = null
        if (mon !== seq || state !== 'loading') return
        audio.pause()
        set('error', 'network')
      }, START_TIMEOUT_MS)
      await lecture(mon)
    },

    pause() {
      if (state !== 'playing' || !audio) return
      audio.pause()
      set('paused')
    },

    // Reprend apres une pause. Relance aussi apres un refus du navigateur (« blocked ») : si
    // l'extrait du morceau courant est deja pose, la lecture repart tout de suite, dans le geste
    // du visiteur, sans nouvelle requete ; sinon, le morceau est redemande.
    async resume() {
      if (!audio) return
      if (state === 'paused') return lecture(seq)
      if (state !== 'error' || error !== 'blocked') return
      if (srcSeq === seq && audio.src) return lecture(seq)
      if (current) return listening.play(current.track)
    },

    stop() {
      seq++
      annulerDemarrage()
      annulerContexte()
      if (audio) {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
      endormir()
      current = null
      set('idle')
    },

    subscribe(fn) {
      abonnes.add(fn)
      return () => abonnes.delete(fn)
    },

    // Appele par la scene a chaque image, avec la duree de l'image (secondes) : lissage et
    // temps mort des coups suivent le temps ecoule, quelle que soit la cadence. Sans effet
    // hors lecture.
    tick(dt = REFERENCE_DT) {
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
      lisses = smoothBands(lisses, brut, dt)
      const k = detectKick(kickState, lisses.bass, dt)
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
