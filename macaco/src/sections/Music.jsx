// Section Musique : la salle d'écoute. Une piste épinglée (CinematicSection) dont la 3D le
// montre casque sur les oreilles, au milieu d'un anneau de particules qui suit la musique ; le
// lecteur, en DOM, reste à l'écran d'un bout à l'autre de la section.
//
// Rien n'est téléchargé avant un clic : la liste ne contient que du texte (titres, artistes,
// genres) ; l'extrait, sa pochette et son lien Deezer ne sont demandés qu'au choix d'un
// morceau, par le moteur d'écoute (src/lib/listening.js), une instance partagée avec la scène.
//
// L'état du moteur entre dans React par useSyncExternalStore : un rendu à chaque changement
// d'état (chargement, lecture, pause, erreur, arrêt), jamais à chaque image. Une région live
// annonce le chargement, l'erreur, puis le morceau au début de la lecture.
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TRACKS } from '../content/music.js'
import { listening } from '../lib/listening.js'
import CinematicSection from '../three/cinematic/CinematicSection.jsx'
import { useDeferredEffects } from '../three/cinematic/useDeferredEffects.js'
import { MUSIC_SHOTS, MUSIC_STILL } from '../three/music/layout.js'
import '../styles/music.css'

const ID = 'musique'
// L'en-tête se montre sur l'ouverture (la grue large), puis s'efface quand elle descend.
const FIN_EN_TETE = 0.2

// Identités stables (voir l'en-tête de CinematicSection) : définies une fois, au module.
const ListeningRoom = React.lazy(() => import('../three/music/ListeningRoom.jsx'))
const STAGE_PROPS = { listening }
const DEPTH_OF_FIELD = { focusRange: 1.4, bokehScale: 3 }
const PRELOAD = ['/character/damien.glb', '/props/boombox.glb']
const chargerEffets = () => import('../three/music/effects.jsx').then((module) => module.MUSIC_EFFECTS)

const ERREURS = {
  unavailable: 'home.music.errorUnavailable',
  network: 'home.music.errorNetwork',
  blocked: 'home.music.errorBlocked',
}

// Instantané de l'état du moteur, recréé seulement quand l'une de ses valeurs change :
// useSyncExternalStore exige la même identité tant que rien n'a bougé.
const abonner = (prevenir) => listening.subscribe(prevenir)
let instantane = null
function lireMoteur() {
  const { state, error, current } = listening
  const i = instantane
  if (!i || i.state !== state || i.error !== error || i.current !== current) instantane = { state, error, current }
  return instantane
}

function useListening() {
  return React.useSyncExternalStore(abonner, lireMoteur, lireMoteur)
}

const memeMorceau = (a, b) => Boolean(a && b && a.id === b.id)

// Un morceau de la liste : titre, artiste et genre, lus dans cet ordre (les séparateurs ne
// sont que pour les lecteurs d'écran ; à l'œil, la mise en page les remplace).
function Morceau({ track, actif, etat, onChoisir }) {
  return (
    <li className="music__item">
      <button
        className="music__track"
        type="button"
        aria-current={actif ? 'true' : undefined}
        data-state={actif ? etat : undefined}
        onClick={() => onChoisir(track)}
        data-track={track.id}
      >
        <span className="music__track-title">{track.title}</span>
        <span className="sr-only"> — </span>
        <span className="music__track-artist">{track.artist}</span>
        <span className="sr-only">, </span>
        <span className="music__track-genre">{track.genre}</span>
        {actif && (
          <span className="music__eq" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </button>
    </li>
  )
}

// Libellé du bouton principal : Pause en lecture (et pendant le chargement, bouton inactif) ;
// Reprendre en pause ; Écouter après une erreur ou à la fin de l'extrait (le moteur repasse
// alors au repos en gardant le morceau), pour le rejouer.
const LIBELLES = {
  loading: 'home.music.pause',
  playing: 'home.music.pause',
  paused: 'home.music.resume',
  error: 'home.music.play',
  idle: 'home.music.play',
}

// La zone « en écoute » : le morceau choisi, ses commandes, la mention et le lien Deezer, posés
// dans la grille de la platine (.music__deck). Pochette et lien n'existent qu'une fois connus
// (le moteur les donne avec l'extrait) ; leurs places sont gardées, rien ne bouge à leur arrivée.
function EnEcoute({ current, state, onBasculer, onArreter, t }) {
  const { track, cover, link } = current
  const enAttente = state === 'loading'
  return (
    <>
      <div className="music__cover">
        {cover ? (
          <img src={cover} alt="" width="250" height="250" decoding="async" />
        ) : (
          <span className="music__disc" aria-hidden="true" />
        )}
      </div>
      <div className="music__meta">
        <p className="music__label">{t('home.music.nowPlaying')}</p>
        <p className="music__title-now">{track.title}</p>
        <p className="music__artist-now">{track.artist}</p>
      </div>
      <div className="music__controls">
        {/* Pendant le chargement : aria-disabled plutôt que disabled, le focus reste sur le
            bouton (relance au clavier après une erreur). */}
        <button
          className="music__button music__button--main"
          type="button"
          aria-disabled={enAttente ? 'true' : undefined}
          onClick={enAttente ? undefined : onBasculer}
        >
          {t(LIBELLES[state] ?? LIBELLES.idle)}
        </button>
        <button className="music__button" type="button" onClick={onArreter}>
          {t('home.music.stop')}
        </button>
      </div>
      <p className="music__preview">{t('home.music.preview')}</p>
      {link && (
        <a className="music__deezer" href={link} target="_blank" rel="noopener noreferrer">
          {t('home.music.openDeezer')}
          <span className="sr-only"> {t('home.music.newTab')}</span>
        </a>
      )}
    </>
  )
}

export default function Music() {
  const { t, i18n } = useTranslation()
  const { state, error, current } = useListening()

  // En-tête : l'état ne change (et React ne rend) qu'au passage du seuil.
  const [enTete, setEnTete] = React.useState(true)
  const enTeteRef = React.useRef(true)
  const onProgress = React.useCallback((p) => {
    const visible = p < FIN_EN_TETE
    if (visible === enTeteRef.current) return
    enTeteRef.current = visible
    setEnTete(visible)
  }, [])
  const effects = useDeferredEffects(chargerEffets)

  // La liste : Arrêter rend le focus à l'un de ses boutons.
  const listeRef = React.useRef(null)

  // Les commandes lisent le moteur lui-même (sa vérité au moment du clic) et l'appellent dans
  // le geste : iOS refuse de lancer l'audio hors de la pile du clic.
  const choisir = React.useCallback((track) => {
    const enCours = memeMorceau(listening.current?.track, track)
    if (enCours && listening.state === 'playing') listening.pause()
    else if (enCours && listening.state === 'paused') listening.resume()
    else listening.play(track)
  }, [])

  // Le bouton principal : pause, reprise, ou nouvelle lecture (après une erreur, ou à la fin
  // de l'extrait). Pendant le chargement, il n'est pas branché.
  const basculer = React.useCallback(() => {
    const { state: etat, current: courant } = listening
    if (etat === 'playing') listening.pause()
    else if (etat === 'paused') listening.resume()
    else if ((etat === 'error' || etat === 'idle') && courant) listening.play(courant.track)
  }, [])

  // La zone « en écoute » disparaît avec l'arrêt : le focus revient au morceau dans la liste.
  const arreter = React.useCallback(() => {
    const id = listening.current?.track?.id
    listening.stop()
    if (id) listeRef.current?.querySelector(`[data-track="${id}"]`)?.focus()
  }, [])

  // Annonce de la région live : visible pour le chargement et l'erreur ; au début de la
  // lecture, pour les lecteurs d'écran seulement (la zone montre déjà le morceau). En pause,
  // l'annonce reste la même : rien de nouveau à dire.
  const deuxPoints = (i18n.resolvedLanguage || i18n.language || '').startsWith('fr') ? ' : ' : ': '
  let annonce = null
  if (state === 'loading') annonce = <span className="music__status-text">{t('home.music.loading')}</span>
  else if (state === 'error')
    annonce = (
      <span className="music__status-text music__status-text--error">{t(ERREURS[error] ?? ERREURS.network)}</span>
    )
  else if ((state === 'playing' || state === 'paused') && current)
    annonce = (
      <span className="sr-only">
        {`${t('home.music.nowPlaying')}${deuxPoints}${current.track.title} — ${current.track.artist}`}
      </span>
    )

  return (
    <CinematicSection
      id={ID}
      track="700svh"
      shots={MUSIC_SHOTS}
      still={MUSIC_STILL}
      stage={ListeningRoom}
      stageProps={STAGE_PROPS}
      animated
      depthOfField={DEPTH_OF_FIELD}
      effects={effects}
      preload={PRELOAD}
      onProgress={onProgress}
      className="music"
      aria-labelledby="music-title"
    >
      <header className="music__head" data-visible={enTete ? 'true' : 'false'}>
        <p className="music__kicker">{t('home.music.kicker')}</p>
        <h2 id="music-title" className="music__title">
          {t('home.music.title')}
        </h2>
      </header>
      <div className="music__panel">
        <div className="music__now">
          <div className="music__deck" data-state={current ? state : 'empty'}>
            {current ? (
              <EnEcoute current={current} state={state} onBasculer={basculer} onArreter={arreter} t={t} />
            ) : (
              <p className="music__hint">{t('home.music.hint')}</p>
            )}
          </div>
          <p className="music__status" aria-live="polite">
            {annonce}
          </p>
        </div>
        <h3 className="music__list-title" id="music-list-title">
          {t('home.music.listTitle')}
        </h3>
        {/* data-native-touch : le défilement tactile du site (useTouchScroll, App.jsx) laisse le
            toucher au navigateur, et la liste défile à la main (horizontale en portrait). */}
        <ol className="music__list" ref={listeRef} aria-labelledby="music-list-title" data-native-touch="">
          {TRACKS.map((track) => (
            <Morceau
              track={track}
              actif={memeMorceau(current?.track, track)}
              etat={state}
              onChoisir={choisir}
              key={track.id}
            />
          ))}
        </ol>
      </div>
    </CinematicSection>
  )
}
