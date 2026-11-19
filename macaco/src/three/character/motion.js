// Mouvement du personnage : regard, respiration, politique d'animation.

const DEG = Math.PI / 180;

const borne = (v) => (Number.isFinite(v) ? Math.max(-1, Math.min(1, v)) : 0);

// Entrée : coordonnées normalisées [-1, 1] ; sortie : radians.
// Convention de signe : x > 0 (pointeur à droite) → yaw > 0 ;
// y > 0 → pitch > 0. La tâche du canvas les applique à la tête.
export function lookAngles(x, y, { maxYaw = 25, maxPitch = 15 } = {}) {
  return {
    yaw: borne(x) * maxYaw * DEG,
    pitch: borne(y) * maxPitch * DEG,
  };
}

// Respiration : sinus pur, période 4 s, amplitude 0,6°, en radians (os Spine2).
export function breathing(seconds) {
  return 0.6 * DEG * Math.sin((2 * Math.PI * seconds) / 4);
}

// Politique de mouvement ; les clés absentes comptent pour false.
// reducedMotion l'emporte sur tout. Écran tactile (pas de curseur à suivre, batterie)
// ou personnage figé : ni respiration ni regard, rendu à la demande.
// `idle` dit si le personnage respire ; `animate` si une scène peut s'animer (décor, effets),
// faux seulement sous mouvement réduit : un écran tactile ne fige pas les sections.
export function motionPolicy({ reducedMotion = false, coarsePointer = false, frozen = false } = {}) {
  if (reducedMotion) {
    return { idle: false, lookAt: false, blend: 'snap', frameloop: 'demand', animate: false };
  }
  if (frozen || coarsePointer) {
    return { idle: false, lookAt: false, blend: 'smooth', frameloop: 'demand', animate: true };
  }
  return { idle: true, lookAt: true, blend: 'smooth', frameloop: 'always', animate: true };
}
