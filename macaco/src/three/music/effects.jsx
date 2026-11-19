// Post-traitement de la salle d'écoute, rendu dans l'EffectComposer de la section (avec la
// profondeur de champ). Importé en paresseux par la section, après load. Le bloom fait vivre
// les néons, le liseré du casque et l'anneau.
import { Bloom, Noise, Vignette } from '@react-three/postprocessing'

// Constante de module : une identité stable, sans quoi le composer reconstruirait ses passes.
export const MUSIC_EFFECTS = [
  <Bloom key="bloom" intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />,
  <Noise key="grain" premultiply opacity={0.22} />,
  <Vignette key="vignette" offset={0.3} darkness={0.75} />,
]
