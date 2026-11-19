// Le personnage dans le décor d'une section : un clone de la scène partagée, remis en pose de
// liaison (la scène en cache garde la pose que l'intro lui a laissée, que clone() copie ; or la
// boîte d'un maillage skinné suit la pose, et avec elle la taille et les pieds), mis à la
// hauteur voulue, pieds au sol, centré, avec son mélangeur d'animations et les clips des
// sections (cuits une fois par scène, sur une copie en pose de liaison).
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Box3, Vector3 } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { readySkinned } from './clips.js'
import { poseDeLiaison, sectionClipsFor } from './sectionClips.js'

export const PERSONNAGE = '/character/damien.glb'

/**
 * @param {{ height: number, castShadow?: boolean }} options
 * @returns {{ rig, k, offset: number[], mixer, clip(name) }}
 *   À rendre : <group scale={k} position={offset}><primitive object={rig} /></group>.
 *   `k` sert aussi à convertir des mètres en unités du rig (accessoires attachés aux os).
 */
export function useStageRig({ height, castShadow = false }) {
  const { scene, parser } = useGLTF(PERSONNAGE, false, true)
  const rig = React.useMemo(() => {
    const r = readySkinned(poseDeLiaison(clone(scene), scene, parser))
    r.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = castShadow
        o.frustumCulled = false
      }
    })
    return r
  }, [scene, parser, castShadow])
  const { k, offset } = React.useMemo(() => {
    const b = new Box3().setFromObject(rig)
    const taille = new Vector3()
    const centre = new Vector3()
    b.getSize(taille)
    b.getCenter(centre)
    const echelle = height / (taille.y || 1)
    return { k: echelle, offset: [-centre.x * echelle, -b.min.y * echelle, -centre.z * echelle] }
  }, [rig, height])
  const mixer = React.useMemo(() => new AnimationMixer(rig), [rig])
  React.useEffect(() => () => mixer.stopAllAction(), [mixer])
  const clip = React.useCallback((name) => sectionClipsFor(scene, parser).find((c) => c.name === name), [scene, parser])
  return { rig, k, offset, mixer, clip }
}
