// Section Projets : la salle de projection. Une piste épinglée (CinematicSection) dont la 3D
// projette un projet par palier ; le texte, en DOM, montre la carte du projet à l'écran.
//
// Toutes les cartes restent dans le DOM et dans l'arbre d'accessibilité (texte indexé, page
// complète sans WebGL 2, six projets annoncés) ; seule celle du palier courant se voit. Les
// autres sont effacées à l'œil (opacité), leurs liens hors de la tabulation (tabIndex -1) : Tab
// n'atteint que la carte visible. Un lecteur d'écran peut quand même y amener le focus (liste
// des liens, par exemple) : la piste défile alors jusqu'au palier de la carte, et ce qui est lu
// est aussi ce qui est montré. Avant le premier projet (l'amorce, LEADER), aucune carte :
// l'en-tête seul.
//
// « Jouer » ouvre un <dialog> modal ; l'iframe du jeu n'existe que dialogue ouvert : rien n'est
// téléchargé avant le clic, et la fermeture arrête le jeu.
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PROJECTS } from '../content/projects.js'
import { getOffsetBottom, getOffsetTop, getViewportHeight, scrollRootTo } from '../lib/scroll.js'
import CinematicSection from '../three/cinematic/CinematicSection.jsx'
import { useDeferredEffects } from '../three/cinematic/useDeferredEffects.js'
import { PROJECTION_SHOTS, PROJECTION_STILL } from '../three/projection/layout.js'
import { LEADER, PROJECT_ANCHORS, projectAt } from '../three/projection/steps.js'
import '../styles/projects.css'

const ID = 'projets'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// Identités stables (voir l'en-tête de CinematicSection) : définies une fois, au module.
const ProjectionRoom = React.lazy(() => import('../three/projection/ProjectionRoom.jsx'))
const PRELOAD = ['/character/damien.glb', '/props/filmstrip_projector_8mm.glb']
// Affiche pendant le chargement et sans WebGL 2 : le premier plan de la scène (la bobine), une
// image par cadrage, au même seuil que les plans (NARROW_ASPECT, 1,15 = 23/20).
const POSTER = (
  <picture>
    <source media="(max-aspect-ratio: 23/20)" srcSet="/projects/poster-narrow.webp" />
    <img src="/projects/poster-wide.webp" alt="" decoding="async" loading="lazy" />
  </picture>
)

const TOTAL = String(PROJECTS.length).padStart(2, '0')
const compteur = (i) => `${String(i + 1).padStart(2, '0')} / ${TOTAL}`

// Fait défiler la racine de scroll jusqu'au palier du projet i : l'inverse de la mesure de
// CinematicSection (p = 0 quand le haut de la piste touche le haut de l'écran, 1 quand son bas
// touche le bas). Sous mouvement réduit, un saut sans animation.
function allerAuPalier(piste, i) {
  const haut = getOffsetTop(piste)
  const course = Math.max(1, getOffsetBottom(piste) - haut - getViewportHeight())
  const reduit = typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION).matches
  scrollRootTo({ top: haut + PROJECT_ANCHORS[i] * course, behavior: reduit ? 'auto' : 'smooth' })
}

// Effets de post-traitement, importés après load (useDeferredEffects) : au module, pour une
// identité stable.
const chargerEffets = () => import('../three/projection/effects.jsx').then((module) => module.PROJECTION_EFFECTS)

function Lien({ kind, href, tabIndex, t }) {
  return (
    <a className="projects__link" href={href} target="_blank" rel="noopener noreferrer" tabIndex={tabIndex}>
      {t(`home.projects.${kind}`)}
      <span className="sr-only"> {t('home.projects.newTab')}</span>
    </a>
  )
}

function Carte({ projet, i, actif, onJouer, onFocusCachee, t }) {
  const { id, media, stack, links } = projet
  const cle = `home.projects.items.${id}`
  const libelle = `projets-${id}-pile`
  // Carte cachée : contrôles hors de la tabulation, mais focalisables (lecteur d'écran).
  const tabIndex = actif ? undefined : -1
  const jouable = links.some((l) => l.kind === 'play')
  const note = `projets-${id}-jeu`
  return (
    <li
      className="projects__card"
      data-active={actif ? 'true' : 'false'}
      onFocus={actif ? undefined : (event) => onFocusCachee(event, i)}
      style={{ '--projet': media.color }}
    >
      <p className="projects__count" aria-hidden="true">
        {compteur(i)}
      </p>
      <h3 className="projects__name">{t(`${cle}.title`)}</h3>
      <p className="projects__meta">{t(`${cle}.meta`)}</p>
      <p className="projects__line">{t(`${cle}.line`)}</p>
      <p className="sr-only" id={libelle}>
        {t('home.projects.stack')}
      </p>
      <ul className="projects__stack" aria-labelledby={libelle}>
        {stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {links.length > 0 && (
        <div className="projects__links">
          {links.map(({ kind, href }) =>
            kind === 'play' ? (
              <button
                className="projects__link projects__link--play"
                type="button"
                tabIndex={tabIndex}
                aria-describedby={note}
                onClick={(event) => onJouer(event, href)}
                key={kind}
              >
                {t('home.projects.play')}
              </button>
            ) : (
              <Lien kind={kind} href={href} tabIndex={tabIndex} t={t} key={kind} />
            ),
          )}
        </div>
      )}
      {/* Ce que « Jouer » lance, avant de cliquer : lu aussi avec le bouton (aria-describedby). */}
      {jouable && (
        <p className="projects__note" id={note}>
          {t('home.projects.playNote')}
        </p>
      )}
    </li>
  )
}

export default function Projects() {
  const { t } = useTranslation()
  const [index, setIndex] = React.useState(LEADER)
  // Copie de l'index lue au scroll : l'état ne change (et React ne rend) qu'au changement de palier.
  const indexRef = React.useRef(LEADER)
  const onProgress = React.useCallback((p) => {
    const suivant = projectAt(p).index
    if (suivant === indexRef.current) return
    indexRef.current = suivant
    setIndex(suivant)
  }, [])
  const stageProps = React.useMemo(() => ({ projects: PROJECTS, index }), [index])
  const effects = useDeferredEffects(chargerEffets)

  // Focus arrivé dans une carte cachée : la piste va à son palier, la carte s'y montrera.
  const montrer = React.useCallback((event, i) => {
    const piste = event.currentTarget.closest(`#${ID}`)
    if (piste) allerAuPalier(piste, i)
  }, [])

  const dialogRef = React.useRef(null)
  // Le bouton qui a ouvert le jeu : le focus y revient à la fermeture.
  const retourRef = React.useRef(null)
  // Adresse du jeu ouvert (le lien `play` du projet), null dialogue fermé.
  const [jeu, setJeu] = React.useState(null)

  const jouer = React.useCallback((event, href) => {
    retourRef.current = event.currentTarget
    const d = dialogRef.current
    if (!d) return
    // Ouverture dans le geste de l'utilisateur ; sans showModal, l'attribut open suffit.
    if (typeof d.showModal === 'function') {
      if (!d.open) d.showModal()
    } else d.setAttribute('open', '')
    setJeu(href)
  }, [])

  // Échap dans le jeu : une fois le focus dans l'iframe, les touches vont à son document (Unity
  // les capte) et le dialogue n'émet pas « cancel ». Le jeu est de même origine : à chaque
  // chargement de l'iframe, un écouteur keydown en capture sur sa fenêtre ferme le dialogue par
  // le chemin commun ; il est retiré à la fermeture. { fenetre, ecouteur }, null sans jeu.
  const echapRef = React.useRef(null)
  const retirerEchap = React.useCallback(() => {
    const echap = echapRef.current
    echapRef.current = null
    if (!echap) return
    try {
      echap.fenetre.removeEventListener('keydown', echap.ecouteur, true)
    } catch {
      // fenêtre déjà détruite avec son iframe : rien à retirer
    }
  }, [])
  React.useEffect(() => retirerEchap, [retirerEchap])

  // Point unique de sortie : l'événement « close » natif (bouton, Échap), ou l'appel direct
  // quand le dialogue n'a pas de close(). L'iframe est retirée, le focus rendu au bouton.
  const apresFermeture = React.useCallback(() => {
    retirerEchap()
    setJeu(null)
    retourRef.current?.focus()
  }, [retirerEchap])

  const fermer = React.useCallback(() => {
    const d = dialogRef.current
    if (!d) return
    if (typeof d.close === 'function') d.close()
    else {
      d.removeAttribute('open')
      apresFermeture()
    }
  }, [apresFermeture])

  // Échap : le navigateur émet « cancel » ; on ferme nous-mêmes, pour un seul chemin partout.
  const annuler = React.useCallback(
    (event) => {
      event.preventDefault()
      fermer()
    },
    [fermer],
  )

  // Iframe chargée (sa fenêtre change à chaque chargement) : l'Échap du jeu, voir echapRef.
  const brancherEchap = React.useCallback(
    (event) => {
      retirerEchap()
      const fenetre = event.currentTarget.contentWindow
      if (!fenetre) return
      const ecouteur = (e) => {
        if (e.key === 'Escape') fermer()
      }
      try {
        fenetre.addEventListener('keydown', ecouteur, true)
        echapRef.current = { fenetre, ecouteur }
      } catch {
        // page d'une autre origine : Échap reste au jeu, le bouton Fermer demeure
      }
    },
    [fermer, retirerEchap],
  )

  return (
    <CinematicSection
      id={ID}
      track="1000svh"
      shots={PROJECTION_SHOTS}
      still={PROJECTION_STILL}
      stage={ProjectionRoom}
      stageProps={stageProps}
      // Jeu ouvert : la scène, cachée derrière, ne tourne plus à chaque image (rendu à la demande).
      animated={jeu === null}
      depthOfField
      shadows
      effects={effects}
      preload={PRELOAD}
      poster={POSTER}
      onProgress={onProgress}
      className="projects"
      aria-labelledby="projects-title"
    >
      <header className="projects__head" data-visible={index === LEADER ? 'true' : 'false'}>
        <p className="projects__kicker">{t('home.projects.kicker')}</p>
        <h2 id="projects-title" className="projects__title">
          {t('home.projects.title')}
        </h2>
      </header>
      <ol className="projects__list">
        {PROJECTS.map((projet, i) => (
          <Carte
            projet={projet}
            i={i}
            actif={i === index}
            onJouer={jouer}
            onFocusCachee={montrer}
            t={t}
            key={projet.id}
          />
        ))}
      </ol>
      {/* data-native-touch : le défilement tactile du site (useTouchScroll, App.jsx) laisse le
          toucher au navigateur ; sans lui, il ferait défiler la page sous le dialogue. */}
      <dialog
        className="projects__game"
        ref={dialogRef}
        data-native-touch=""
        aria-label={t('home.projects.gameLabel')}
        onCancel={annuler}
        onClose={apresFermeture}
      >
        <button className="projects__link projects__close" type="button" onClick={fermer}>
          {t('home.projects.close')}
        </button>
        {jeu && (
          <iframe
            className="projects__frame"
            src={jeu}
            title={t('home.projects.gameLabel')}
            allow="fullscreen; autoplay; gamepad"
            onLoad={brancherEchap}
          />
        )}
      </dialog>
    </CinematicSection>
  )
}
