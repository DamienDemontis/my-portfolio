# Portfolio v6 — Socle cinématique — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poser ce qu'il faut pour tourner les sections du storyboard (décors CC0 optimisés, scène cinématique réutilisable) et corriger les deux cadrages faits pour le robot.

**Architecture:** Un script Node récupère les modèles CC0 de Poly Haven et les fait passer par le pipeline du personnage (WebP, simplification, meshopt), avec un manifeste de licences. Un composant `CinematicSection` épingle une section, convertit le scroll en progression 0→1 et l'applique à une timeline de plans de caméra (dolly zoom, orbite, profondeur de champ), avec chargement à l'approche et plan fixe sous mouvement réduit. L'intro et la scène des expertises gardent leur code ; seules leurs données de plans et l'orientation du personnage changent.

**Tech Stack:** Vite 6, React 18, three r171, R3F 8, drei 9, @react-three/postprocessing, @gltf-transform 4 (déjà en devDependencies), Vitest.

**Spec:** `docs/superpowers/specs/2026-11-19-storyboard-v6.md` (fait autorité pour les sections), puis `docs/superpowers/specs/2026-11-17-portfolio-v6-design.md`.

## Global Constraints

- Aucune formule qui signale une recherche d'emploi ; rien qui identifie MACACO dans `src/` (le test `tests/identity.test.js` refuse le mot) ; ne jamais retirer une scène ou un effet existant sans que la tâche le dise.
- Modèles : CC0 seulement (Poly Haven), manifeste avec source, URL et licence ; au plus 1,5 Mo de décors par section après compression ; textures WebP ≤ 1024 px ; meshopt.
- « `prefers-reduced-motion` respecté » : un plan fixe par section, aucune animation de caméra.
- Le texte reste en DOM ; la 3D se charge à l'approche (une hauteur d'écran avant la section), jamais avant `load`.
- Le personnage regarde vers +Z dans son fichier ; ses clips viennent de `src/three/character/clips.js` (`clipsFor`, `readySkinned`). Mesurer un rig avec `readySkinned` puis `Box3` non précis, et `<Center precise={false}>`.
- Code neuf lisible, commentaires en français ; tests dans `macaco/tests/`, ceux qui lisent le disque commencent par `// @vitest-environment node`.
- Ne pas toucher : `macaco/lab*`, `macaco/public/lab/`, `contenu-prive/`, `avatar-*`, `.playwright-mcp/`.

## Review Focus

1. **Un modèle Poly Haven indisponible ou modifié** : le script s'arrête avec un message clair sans écrire de fichier partiel. → test dans la tâche 1.
2. **Section atteinte par une ancre ou un saut de scroll** : la timeline donne le bon plan immédiatement, sans état. → test dans la tâche 2.
3. **Mouvement réduit** : un seul plan, aucune interpolation. → test dans la tâche 2.
4. **Portrait / mobile** : le personnage reste dans le cadre (pas de tête coupée). → vérification navigateur des tâches 3 et 4.
5. **Une section jamais atteinte** ne télécharge rien. → test dans la tâche 2.

---

### Task 1: Décors CC0 — récupération, optimisation, manifeste

**Files:**
- Create: `macaco/scripts/props/catalog.mjs` (liste des modèles : id Poly Haven, section, réduction de maillage), `macaco/scripts/props/fetch.mjs`, `macaco/scripts/props/build-cli.mjs` (`npm run props`)
- Modify: `macaco/scripts/character/build.mjs` (extraire `optimizeGlb({ document, textureSize, simplifyRatio })` réutilisable, sans changer la sortie du personnage)
- Create: `macaco/public/props/*.glb`, `macaco/public/props/manifest.json`
- Delete: `macaco/public/intro/Mecha_Full.glb` (plus référencé : le personnage remplace le robot, demande de Damien)
- Test: `macaco/tests/props.test.js`

**Interfaces:**
- Produces: `PROPS` (catalog.mjs) : `[{ id, section, simplify? }]` avec, au minimum : projets `filmstrip_projector_8mm` ; musique `boombox` ; Corée `modular_urban_apartments_facade`, `rollershutter_door`, `exterior_aircon_unit`, `modular_electricity_poles`, `street_lamp_01`, `covered_car`, `water_manhole_cover` ; vivant `root_cluster_01`, `tree_stump_01`, `rock_moss_set_01`, `flower_gazania`, `dandelion_01`, `dead_tree_trunk` ; transmission `standing_chalkboard_01`, `SchoolDesk_01`, `SchoolChair_01` ; sortie `large_iron_gate`.
- Produces: `public/props/manifest.json` : `[{ id, section, file: "/props/<id>.glb", bytes, source: "Poly Haven", url: "https://polyhaven.com/a/<id>", license: "CC0" }]`.
- `fetch.mjs` : `fetchProp(id, dir)` lit `https://api.polyhaven.com/files/<id>`, télécharge le glTF 1k et ses dépendances (bin, textures) dans un dossier temporaire, renvoie le chemin du `.gltf`. Échec réseau ou format inattendu → erreur claire nommant l'id, rien d'écrit dans `public/props/`.

- [ ] **Step 1: Tests** (`// @vitest-environment node`, réseau mocké pour les cas d'erreur) :
  - `every catalog entry is served` : pour chaque id du catalogue, `public/props/<id>.glb` existe et figure au manifeste ;
  - `licenses are CC0 from Poly Haven` ;
  - `each section stays within 1.5 MB` (somme des octets par section ≤ 1 500 000) ;
  - `props use meshopt and webp, textures ≤ 1024 px` ;
  - `fetchProp fails clearly on an unknown id` (API mockée qui renvoie 404 → `toThrow(/<id>/)`) ;
  - `the character build is unchanged by the refactor` : relancer `buildCharacter` sur la source donne le même nombre de triangles, d'os et de sommets corrigés qu'avant (576 240 octets ± 2 %).
- [ ] **Step 2: Lancer, vérifier l'échec.**
- [ ] **Step 3: Implémenter** ; réduire les maillages lourds (racines, poteaux, troncs : `simplify` de gltf-transform, ratio dans le catalogue) jusqu'à tenir le budget ; supprimer le mécha.
- [ ] **Step 4: `npm run props`**, puis `npm test` et `npm run build` → verts.
- [ ] **Step 5: Commit** — « Fetch and optimise the CC0 set dressing for the v6 sections »

### Task 2: `CinematicSection` et la timeline de plans

**Files:**
- Create: `macaco/src/three/cinematic/shots.js` (fonctions pures), `macaco/src/three/cinematic/CinematicSection.jsx`, `macaco/src/styles/cinematic.css`
- Test: `macaco/tests/cinematic-shots.test.js`, `macaco/tests/cinematic-section.test.jsx`

**Interfaces:**
- Produces (shots.js) :
  - `shotAt(shots, p) → { pos, look, fov, roll, focus }` : `shots` = `[{ at, pos, look, fov, roll = 0, focus? , ease = 'inout' }]` triés par `at` dans [0, 1] ; interpolation entre les deux plans qui encadrent `p`, easing par segment ; avant le premier → le premier, après le dernier → le dernier ; sans état.
  - `orbit({ center, radius, height, from, to, fov }, u) → { pos, look, fov }` (angle en degrés, u ∈ [0,1]).
  - `dollyZoom({ subject, dir, fovFrom, fovTo, width }, u) → { pos, look, fov }` : la largeur cadrée au sujet reste constante (`distance = width / (2·tan(fov/2))`).
- Produces (CinematicSection) : `CinematicSection({ id, track = '300svh', shots, children, still, onProgress, preload })` : section `position: relative; height: track`, enfant collant `position: sticky; top: 0; height: 100svh` qui contient le canvas (aria-hidden) et les `children` DOM du texte ; progression 0→1 calculée sur la racine de scroll (`lib/scroll.js`) ; le canvas n'est monté qu'à moins d'une hauteur d'écran de la section ET après `afterLoad` ; sous `prefers-reduced-motion`, la caméra prend `still` (ou le plan de `p = 0.5`) et ne bouge plus ; `frameloop: 'demand'` + `invalidate()` au scroll.
- Les plans peuvent nommer un mouvement : `{ at, move: { type: 'orbit' | 'dollyZoom', ... } }` → la valeur vient de `orbit`/`dollyZoom` sur le segment qui suit.

- [ ] **Step 1: Tests**
  - shots : bornes (avant/après), milieu exact, plusieurs appels dans le désordre donnent les mêmes valeurs (saut par ancre), `roll` et `focus` interpolés ;
  - orbit : u=0 et u=1 aux angles demandés, distance au centre constante ;
  - dollyZoom : largeur cadrée constante à 1e-6 près sur 10 valeurs de u ;
  - CinematicSection (jsdom, canvas mocké) : rien n'est monté tant que la section est à plus d'un écran ; monté quand elle approche et après `load` ; sous mouvement réduit, une seule pose de caméra.
- [ ] **Step 2–4:** échec, implémentation, `npm test` vert.
- [ ] **Step 5: Commit** — « Add a pinned cinematic section with a scroll-driven shot timeline »

### Task 3: Ouverture — contre-plongée en grue après la réception

**Files:**
- Modify: `macaco/src/config.js` (les plans de caméra de l'intro à partir du plan `descent`, `at: 9900`, et le suivant `at: 14e3`)

Le personnage (2,4 unités, centré, pieds vers y ≈ −1,2) est debout là où le robot était accroupi : la caméra actuelle vise y ≈ −0,45 et coupe la tête. Remplacer par une grue : départ au ras des bottes en contre-plongée, montée jusqu'au visage (y ≈ 0,9) en gardant la ville derrière ; fin du mouvement quand le titre arrive. Garder les plans précédents, la secousse et l'enchaînement vers la sortie de l'intro.

- [ ] **Step 1:** ajuster les plans ; `npm test` vert.
- [ ] **Step 2: Vérification navigateur (faite par le contrôleur)** : captures de 8 500 à 12 500 px de scroll sur `/fr` en 1440×900 et 390×844 ; tête jamais coupée, ville visible derrière.
- [ ] **Step 3: Commit** — « Frame the landing as a low-angle crane on the character »

### Task 4: Expertises — le personnage face caméra, six plans sur son corps

**Files:**
- Modify: `macaco/src/three/RobotStage.jsx` (rotation du groupe : le personnage regarde la caméra, qui vient de −X : `rotation={[0, -Math.PI / 2, 0]}`), `macaco/src/pages/Home.jsx` (tableaux de plans bureau `ct` et portrait `Os`, points chauds `ke`)

Passer de 4 à 6 plans, un par expertise (`ke[i].shot = i`), avec les focales et hauteurs du storyboard : e-santé très gros plan sur l'œil (fov ≈ 12) ; interfaces macro sur la main (≈ 28) ; tests plongée zénithale (≈ 40) ; produits IA profil (≈ 24) ; 3D et jeux contre-plongée débullée large (≈ 50, `roll` si le moteur le permet, sinon un décalage de `look`) ; transmission recul large (≈ 34). Placer chaque point chaud sur la partie du corps correspondante (œil, main, pieds, tête, buste, épaules). Vérifier comment la section `Rstage` répartit `camT` sur le nombre de plans et l'adapter à 6.

- [ ] **Step 1:** implémenter ; `npm test` vert ; `npm run build` vert.
- [ ] **Step 2: Vérification navigateur (contrôleur)** : une capture par expertise en 1440×900 et 390×844 ; chaque étiquette pointe la bonne partie du corps, personnage jamais coupé de façon involontaire.
- [ ] **Step 3: Commit** — « Stage the six expertises on the character's body »
