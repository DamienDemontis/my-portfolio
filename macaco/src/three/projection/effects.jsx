// Post-traitement de la salle de projection, rendu dans l'EffectComposer de la section (avec la
// profondeur de champ). Module importé en paresseux par la section, après load : il tire
// @react-three/postprocessing, qui ne doit pas peser sur le premier chargement.
import { Bloom, Noise, Vignette } from '@react-three/postprocessing'

// Constante de module : une identité stable, sans quoi le composer reconstruirait ses passes.
export const PROJECTION_EFFECTS = [
  <Bloom key="bloom" intensity={0.7} luminanceThreshold={0.72} luminanceSmoothing={0.2} mipmapBlur />,
  <Noise key="grain" premultiply opacity={0.32} />,
  <Vignette key="vignette" offset={0.28} darkness={0.72} />,
]
