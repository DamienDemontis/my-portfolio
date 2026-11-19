// Effets de post-traitement d'une section cinématique, importés après load : le module des
// effets (et @react-three/postprocessing) reste hors du premier chargement.
//
// `charger` renvoie la promesse du tableau d'effets, par exemple
//   const chargerEffets = () => import('./effects.jsx').then((m) => m.EFFETS)
// Il est défini au niveau du module chez l'appelant : une identité stable, sans quoi l'effet
// relancerait l'import à chaque rendu.
//
// Renvoie undefined jusque-là, puis le tableau du module : une seule nouvelle identité, que
// CinematicSection transmet au composer sans reconstruire ses passes à chaque rendu.
import React from 'react'
import { afterLoad } from '../../lib/afterLoad.js'

export function useDeferredEffects(charger) {
  const [effets, setEffets] = React.useState(undefined)
  React.useEffect(() => {
    let vivant = true
    const annuler = afterLoad(() => {
      charger()
        .then((tableau) => {
          if (vivant) setEffets(tableau)
        })
        .catch((error) => console.warn('[cinematique] effets non chargés :', error))
    })
    return () => {
      vivant = false
      annuler()
    }
  }, [charger])
  return effets
}
