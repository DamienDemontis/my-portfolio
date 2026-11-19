// Section Projets : la salle de projection. Une piste épinglée (CinematicSection) dont la 3D
// projette un projet par palier ; le texte, en DOM, montre la carte du projet à l'écran.
//
// Toutes les cartes restent dans le DOM (texte indexé, page complète sans WebGL 2) ; seule
// celle du palier courant est visible, les autres sont inert et aria-hidden. Avant le premier
// projet (l'amorce, LEADER), aucune carte : l'en-tête seul.
//
// « Jouer » ouvre un <dialog> modal ; l'iframe du jeu n'existe que dialogue ouvert : rien n'est
// téléchargé avant le clic, et la fermeture arrête le jeu.
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PROJECTS } from '../content/projects.js'
import { afterLoad } from '../lib/afterLoad.js'
import CinematicSection from '../three/cinematic/CinematicSection.jsx'
import { PROJECTION_SHOTS, PROJECTION_STILL } from '../three/projection/layout.js'
import { LEADER, projectAt } from '../three/projection/steps.js'
import '../styles/projects.css'

// Identités stables (voir l'en-tête de CinematicSection) : définies une fois, au module.
const ProjectionRoom = React.lazy(() => import('../three/projection/ProjectionRoom.jsx'))
const PRELOAD = ['/character/damien.glb', '/props/filmstrip_projector_8mm.glb']

const TOTAL = String(PROJECTS.length).padStart(2, '0')
const compteur = (i) => `${String(i + 1).padStart(2, '0')} / ${TOTAL}`

// Effets de post-traitement, importés après load : @react-three/postprocessing reste hors du
// premier chargement. undefined jusque-là, puis le tableau du module (une seule nouvelle identité).
function useEffetsDiffere() {
  const [effets, setEffets] = React.useState(undefined)
  React.useEffect(() => {
    let vivant = true
    const annuler = afterLoad(() => {
      import('../three/projection/effects.jsx')
        .then((module) => {
          if (vivant) setEffets(module.PROJECTION_EFFECTS)
        })
        .catch((error) => console.warn('[projets] effets non chargés :', error))
    })
    return () => {
      vivant = false
      annuler()
    }
  }, [])
  return effets
}

function Lien({ kind, href, t }) {
  return (
    <a className="projects__link" href={href} target="_blank" rel="noopener noreferrer">
      {t(`home.projects.${kind}`)}
      <span className="sr-only"> {t('home.projects.newTab')}</span>
    </a>
  )
}

function Carte({ projet, i, actif, onJouer, t }) {
  const { id, media, stack, links } = projet
  const cle = `home.projects.items.${id}`
  const libelle = `projets-${id}-pile`
  // React 18 ne connaît pas `inert` : une chaîne vide pose l'attribut, undefined le retire.
  return (
    <li
      className="projects__card"
      data-active={actif ? 'true' : 'false'}
      inert={actif ? undefined : ''}
      aria-hidden={actif ? undefined : 'true'}
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
                onClick={(event) => onJouer(event, href)}
                key={kind}
              >
                {t('home.projects.play')}
              </button>
            ) : (
              <Lien kind={kind} href={href} t={t} key={kind} />
            ),
          )}
        </div>
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
  const effects = useEffetsDiffere()

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

  // Point unique de sortie : l'événement « close » natif (bouton, Échap), ou l'appel direct
  // quand le dialogue n'a pas de close(). L'iframe est retirée, le focus rendu au bouton.
  const apresFermeture = React.useCallback(() => {
    setJeu(null)
    retourRef.current?.focus()
  }, [])

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

  return (
    <CinematicSection
      id="projets"
      track="1000svh"
      shots={PROJECTION_SHOTS}
      still={PROJECTION_STILL}
      stage={ProjectionRoom}
      stageProps={stageProps}
      animated
      depthOfField
      shadows
      effects={effects}
      preload={PRELOAD}
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
          <Carte projet={projet} i={i} actif={i === index} onJouer={jouer} t={t} key={projet.id} />
        ))}
      </ol>
      <dialog
        className="projects__game"
        ref={dialogRef}
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
          />
        )}
      </dialog>
    </CinematicSection>
  )
}
