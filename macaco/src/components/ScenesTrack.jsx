// Les huit scenes en sections DOM simples. Le personnage 3D (canvas fixe, tache 7)
// mesure ces [data-scene] pour savoir quelle scene est a l'ecran.
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SCENES, sceneText } from '../content/scenes.js'
import '../styles/scenes.css'

function ScenesTrack() {
  const { t } = useTranslation()
  return (
    <div className="scenes-track">
      {SCENES.map(scene => {
        const { title, body } = sceneText(scene, t)
        const titleId = `scene-${scene.id}-title`
        return (
          <section
            key={scene.id}
            className="scene"
            id={`scene-${scene.id}`}
            data-scene={scene.id}
            aria-labelledby={titleId}
          >
            <div className="scene__text">
              <h2 id={titleId}>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export { ScenesTrack }
