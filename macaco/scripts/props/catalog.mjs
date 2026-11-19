// Décors CC0 (Poly Haven) mis en scène par section.
// - simplify : part des triangles gardée (absent = maillage intact) ;
// - simplifyError : écart toléré à la silhouette, en fraction de l'emprise (1 % par défaut) ;
// - textureSize : côté max des textures (1024 par défaut).
// Les valeurs tiennent le budget de 1,5 Mo par section (SECTION_BUDGET).
export const SECTION_BUDGET = 1_500_000;

export const PROPS = [
  // Projets
  { id: 'filmstrip_projector_8mm', section: 'projets' },
  // Musique
  { id: 'boombox', section: 'musique' },
  // Corée
  { id: 'modular_urban_apartments_facade', section: 'coree', simplify: 0.04, simplifyError: 0.05, textureSize: 512 },
  { id: 'rollershutter_door', section: 'coree', textureSize: 256 },
  { id: 'exterior_aircon_unit', section: 'coree', simplify: 0.15, simplifyError: 0.02, textureSize: 256 },
  { id: 'modular_electricity_poles', section: 'coree', simplify: 0.05, simplifyError: 0.02, textureSize: 256 },
  { id: 'street_lamp_01', section: 'coree', simplify: 0.2, simplifyError: 0.02, textureSize: 256 },
  { id: 'covered_car', section: 'coree', simplify: 0.4, simplifyError: 0.02, textureSize: 256 },
  { id: 'water_manhole_cover', section: 'coree', simplify: 0.5, simplifyError: 0.02, textureSize: 256 },
  // Monde vivant
  { id: 'root_cluster_01', section: 'vivant', simplify: 0.04, simplifyError: 0.02, textureSize: 512 },
  { id: 'tree_stump_01', section: 'vivant', simplify: 0.3, simplifyError: 0.02, textureSize: 512 },
  { id: 'rock_moss_set_01', section: 'vivant', simplify: 0.2, simplifyError: 0.02, textureSize: 512 },
  { id: 'flower_gazania', section: 'vivant', textureSize: 512 },
  { id: 'dandelion_01', section: 'vivant', simplify: 0.2, simplifyError: 0.02, textureSize: 512 },
  { id: 'dead_tree_trunk', section: 'vivant', simplify: 0.1, simplifyError: 0.02, textureSize: 512 },
  // Transmission
  { id: 'standing_chalkboard_01', section: 'transmission' },
  { id: 'SchoolDesk_01', section: 'transmission' },
  { id: 'SchoolChair_01', section: 'transmission' },
  // Sortie
  { id: 'large_iron_gate', section: 'sortie' },
];
