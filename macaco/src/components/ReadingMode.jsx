// Mode lecture : les huit scenes aplaties en document texte, sans animation.
// Le texte passe par i18next avec la langue demandee, independamment de la
// langue globale ; seule la scene coreenne bascule titre et typographie en ko.
import React from 'react'
import i18next from 'i18next'
import '../i18n/index.js'
import { SCENES, sceneText } from '../content/scenes.js'

function ReadingMode({ lang }) {
  const t = i18next.getFixedT(lang)
  const tKo = i18next.getFixedT('ko')
  return (
    <main className="reading-mode" id="lecture">
      <p className="reading-mode__back">
        <a href={`/${lang}`}>{t('reading.back')}</a>
      </p>
      {SCENES.map(scene => {
        const isKo = scene.id === 'coree'
        const { title, body } = sceneText(scene, t)
        return (
          <article key={scene.id} data-scene={scene.id} lang={isKo ? 'ko' : undefined}>
            <h2>{isKo ? sceneText(scene, tKo).title : title}</h2>
            <p lang={isKo ? lang : undefined}>{body}</p>
          </article>
        )
      })}
    </main>
  )
}

export { ReadingMode }
