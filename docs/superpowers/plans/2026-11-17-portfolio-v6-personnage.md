# Portfolio v6 — Plan 2 : le personnage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer l'intro et le mécha hérités de MACACO par le personnage de Damien, rendu dans un canvas persistant derrière huit sections DOM, avec une pose par scène.

**Architecture:** Un script Node (gltf-transform) transforme le GLB Tripo en asset web : correctif de poids du manteau, texture WebP 1024 px, compression meshopt, budget testé. Côté site, un canvas R3F fixe, chargé après l'événement `load`, lit la position de scroll, calcule entre quelles scènes on se trouve et mélange les poses, la caméra et la couleur d'oxydation. Le texte reste en flux natif dans huit `<section data-scene>`.

**Tech Stack:** Vite 6, React 18, three r171, @react-three/fiber 8, @react-three/drei 9, Vitest. Nouveau, en devDependencies seulement : @gltf-transform/core, @gltf-transform/extensions, @gltf-transform/functions (4.x), meshoptimizer, sharp.

**Spec:** `docs/superpowers/specs/2026-11-17-portfolio-v6-design.md` (sections « Le personnage », « Les huit scènes », « Performance », « Décisions de construction »). Référence pour les poses et le poids web : `docs/superpowers/notes/2026-11-17-personnage-feuille-de-route.md`, phases 4, 6 et 7.

## Global Constraints

- Aucune formule qui signale une recherche d'emploi (spec, contrainte 1) — ni dans le texte, ni dans les noms de fichiers ou commentaires visibles.
- Rien qui identifie MACACO : `tests/identity.test.js` doit rester vert.
- « GLB du personnage sous 3 Mo », « textures 1024 px », « compression meshopt ou Draco » → ici meshopt.
- **Décision de ce plan :** le personnage seul ≤ 2 000 000 octets, pour laisser 1 Mo aux accessoires du plan 3 dans le budget système de 3 Mo.
- « Le LCP doit être le titre, pas le canvas. Le 3D se charge après. »
- « `prefers-reduced-motion` respecté sur toutes les scènes. »
- « Mobile : parité narrative, qualité dégradée […] personnage figé sous un seuil de performance. »
- Squelette Mixamo (noms `mixamorig:*`, 65 os). Rien sous licence de recherche ou non commerciale.
- Le personnage regarde vers +Z dans le fichier source (vérifié au labo le 2026-11-17).
- Code neuf lisible, commentaires en français, modules ES. Tests dans `macaco/tests/` ; un test qui lit le disque commence par `// @vitest-environment node` et résout la racine avec `fileURLToPath(new URL('..', import.meta.url))`.
- Aucune dépendance d'exécution nouvelle : les nouveaux paquets ne servent qu'au script de build.
- `useGLTF(url, false, true)` : meshopt oui, Draco non (pas de décodeur chargé depuis un CDN).

## Review Focus

1. **Scroll au-delà de la dernière scène, dans le pied de page** : la pose reste celle de `sortie`, sans saut ni NaN. → test dans la tâche 4.
2. **Le GLB ne charge pas** (404, hors ligne, décodage impossible) : la page reste lisible, aucun écran blanc, rien dans la console au-delà d'un avertissement. → test dans la tâche 7.
3. **`prefers-reduced-motion: reduce`** : pas de respiration, pas de regard, poses posées sans transition, rendu à la demande. → test dans la tâche 5.
4. **Écran tactile** : pas de regard qui suit un curseur absent. → test dans la tâche 5.
5. **Un autre export Tripo sans os `Hips` ou `Head`** (Damien régénère le modèle) : le build échoue avec un message clair au lieu de produire un personnage cassé. → test dans la tâche 1.

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `macaco/assets-src/character/damien-tripo.glb` | Source, copie de `man in grey coat 3d model.glb`. Remplaçable par un autre essai Tripo sans autre changement. Non servi. |
| `macaco/scripts/character/weights.mjs` | Correctif de poids du manteau, fonction pure. |
| `macaco/scripts/character/build.mjs` | Pipeline gltf-transform : correctif, nettoyage, WebP, meshopt. |
| `macaco/scripts/character/build-cli.mjs` | Point d'entrée `npm run character`. |
| `macaco/public/character/damien.glb` | Sortie servie, commitée. |
| `macaco/src/three/character/poses.js` | Poses par scène en données, application et mélange. |
| `macaco/src/lib/sceneProgress.js` | Position de scroll → (scène de départ, scène d'arrivée, t). |
| `macaco/src/three/character/motion.js` | Regard, respiration, politique de mouvement. |
| `macaco/src/lib/afterLoad.js` | Différer un appel après `load` + inactivité. |
| `macaco/src/components/ScenesTrack.jsx` + `src/styles/scenes.css` | Les huit sections DOM. |
| `macaco/src/three/CharacterCanvas.jsx` | Le canvas persistant. |

Supprimés (tâche 6) : `src/components/intro/` (Intro.jsx, Hud.jsx), `src/three/RobotScene.jsx`, `src/three/RobotStage.jsx`, `src/three/CityScene.jsx`, `public/intro/Mecha_Full.glb`, les sections `Craft` et `Rstage` de `Home.jsx` et leurs styles, `public/home/*.svg` s'ils n'ont plus d'usage.

---

### Task 1: Correctif de poids du manteau

**Files:**
- Create: `macaco/scripts/character/weights.mjs`
- Test: `macaco/tests/character-weights.test.js`

**Interfaces:**
- Produces: `stripArmInfluence({ positions, joints, weights, jointNames, jointPositions, radiusFactor }) → { joints, weights, changed }`
  - `positions` : `Float32Array` (n×3), espace du maillage ; `joints` : `Uint8Array | Uint16Array` (n×4) ; `weights` : `Float32Array` (n×4) ; `jointNames` : `string[]` ; `jointPositions` : `number[][]` (position de chaque os en pose de liaison, même espace que `positions`) ; `radiusFactor` : `number`.
  - Retourne des **copies** (les entrées ne sont pas modifiées) et `changed`, le nombre de sommets modifiés.
- Produces: `normalizeJointName(name: string) → string` (retire `mixamorig:` ou `mixamorig`).

Règle (validée au labo sur les trois essais, avec `radiusFactor` 0,18) :
- os du bras = noms normalisés qui contiennent `Arm`, `ForeArm` ou `Hand`, sauf `Shoulder` ;
- chaîne de chaque côté : `{S}Arm → {S}ForeArm → {S}Hand → {S}HandMiddle4` (ou `{S}Hand` s'il manque), `S ∈ {Left, Right}` ;
- `R = radiusFactor × distance(Hips, Head)` ;
- un sommet influencé par un os du bras et à plus de `R` de la chaîne la plus proche perd ces influences ; les autres sont renormalisées ; s'il n'en reste aucune, poids 1 sur l'os le plus proche parmi `Hips, Spine, Spine1, Spine2, LeftUpLeg, RightUpLeg`.

- [ ] **Step 1: Écrire les tests** (`// @vitest-environment node`). Squelette synthétique : `Hips [0,1,0]`, `Spine [0,1.15,0]`, `Spine1 [0,1.3,0]`, `Spine2 [0,1.45,0]`, `Head [0,1.7,0]`, `LeftArm [0.2,1.45,0]`, `LeftForeArm [0.45,1.2,0]`, `LeftHand [0.6,1.0,0]`, `LeftHandMiddle4 [0.68,0.9,0]`, le côté droit en miroir sur x, `LeftUpLeg [0.1,0.95,0]`, `RightUpLeg [-0.1,0.95,0]`. Donc `R = 0.18 × 0.7 = 0.126`.
  - `keeps a sleeve vertex` : sommet `[0.5,1.15,0]`, poids `LeftForeArm 1` → inchangé, `changed === 0`.
  - `drops hand influence on a coat vertex` : sommet `[0.3,0.75,0]`, `LeftHand 0.6, Hips 0.4` → `LeftHand 0`, `Hips 1`.
  - `falls back to the nearest trunk or leg bone` : sommet `[0.12,0.8,0]`, `LeftHand 1` → poids 1 sur `LeftUpLeg`.
  - `leaves vertices without arm influence untouched`.
  - `weights still sum to one` : sur 200 sommets aléatoires (graine fixe), chaque somme vaut 1 à 1e-6 près.
  - `does not mutate its inputs`.
  - `accepts mixamorig: and mixamorig prefixes`.
  - `fails clearly without Hips or Head` : `toThrow(/Hips.*Head|squelette Mixamo/)`.
- [ ] **Step 2: Lancer, vérifier l'échec** — `npx vitest run tests/character-weights.test.js` → FAIL (module absent).
- [ ] **Step 3: Implémenter `stripArmInfluence` et `normalizeJointName`** dans `weights.mjs`. Distance point-segment classique ; aucune dépendance.
- [ ] **Step 4: Lancer, vérifier le succès** — même commande → PASS.
- [ ] **Step 5: Commit** — `git add macaco/scripts/character/weights.mjs macaco/tests/character-weights.test.js && git commit -m "Add the coat weight fix for Tripo auto-rigs"`

### Task 2: Pipeline de l'asset

**Files:**
- Create: `macaco/assets-src/character/damien-tripo.glb` (copie de `C:\Users\elswift\Downloads\man in grey coat 3d model.glb`)
- Create: `macaco/scripts/character/build.mjs`, `macaco/scripts/character/build-cli.mjs`
- Create: `macaco/public/character/damien.glb` (sortie du build)
- Modify: `macaco/package.json` (devDependencies ; script `"character": "node scripts/character/build-cli.mjs"`)
- Test: `macaco/tests/character-build.test.js`

**Interfaces:**
- Consumes: `stripArmInfluence`, `normalizeJointName` (tâche 1).
- Produces: `buildCharacter({ input, output, radiusFactor = 0.18, textureSize = 1024 }) → Promise<{ bytes, triangles, joints, changed }>`.
- Produces: `/character/damien.glb`, servi par Vite depuis `public/`.

Étapes du pipeline, dans l'ordre :
1. Lire avec `NodeIO`, `ALL_EXTENSIONS` et les dépendances meshopt enregistrées (encodeur et décodeur `meshoptimizer`, après `await MeshoptEncoder.ready`).
2. Correctif de poids sur chaque primitive skinnée. Positions = `POSITION` brut. Position de liaison de l'os *i* = translation de l'inverse de `inverseBindMatrices[i]`.
3. Retirer `KHR_materials_volume` ; `FB_ngon_encoding` disparaît à l'écriture.
4. `textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [textureSize, textureSize] })`.
5. `prune()`, `dedup()`. Ni `weld` ni `simplify` : le nombre de triangles ne change pas.
6. `meshopt({ encoder: MeshoptEncoder, level: 'medium' })`, puis écrire.

La CLI lit `assets-src/character/damien-tripo.glb` et écrit `public/character/damien.glb`. Elle affiche octets, triangles, os et sommets corrigés.

- [ ] **Step 1: Écrire les tests** (`// @vitest-environment node`, timeout 120 s). Un `beforeAll` construit la source dans `os.tmpdir()`.
  - `stays within the character budget` : `bytes <= 2_000_000`.
  - `keeps the Mixamo skeleton` : une seule skin, 65 os, dont `Hips` et `Head` une fois normalisés.
  - `keeps every triangle` : même nombre de triangles que la source.
  - `uses meshopt and webp, nothing else exotic` : `extensionsUsed` contient `EXT_meshopt_compression` et `EXT_texture_webp`, ne contient ni `KHR_materials_volume` ni `FB_ngon_encoding`.
  - `textures are at most 1024 px` : chaque image fait au plus 1024 dans chaque dimension (`sharp(buffer).metadata()`).
  - `the fix is idempotent` : relu, le résultat repassé dans `stripArmInfluence` avec 0,18 donne `changed === 0`.
  - `the served file is the built file` : `public/character/damien.glb` existe, fait au plus 2 000 000 octets, a 65 os.
- [ ] **Step 2: Lancer, vérifier l'échec** — `npx vitest run tests/character-build.test.js` → FAIL.
- [ ] **Step 3: Installer les devDependencies, copier la source, implémenter `build.mjs` et `build-cli.mjs`.**
- [ ] **Step 4: Construire l'asset servi** — `npm run character` dans `macaco/`. La sortie affiche moins de 2 000 000 octets et au moins 900 sommets corrigés : le labo en mesurait 953 sur ce modèle avec 0,18.
- [ ] **Step 5: Lancer les tests** — même commande que l'étape 2 → PASS. Puis `npm test` → tout vert.
- [ ] **Step 6: Commit** — `git add macaco/assets-src macaco/scripts/character macaco/public/character macaco/package.json macaco/package-lock.json macaco/tests/character-build.test.js && git commit -m "Build the web character from the Tripo export"`

### Task 3: Poses par scène

**Files:**
- Create: `macaco/src/three/character/poses.js`
- Test: `macaco/tests/character-poses.test.js`

**Interfaces:**
- Consumes: `SCENES` (`src/content/scenes.js`), `normalizeJointName` (même règle ; la dupliquer ici en une ligne, `scripts/` n'est pas importé par `src/`).
- Produces:
  - `SCENE_POSES : Record<sceneId, { bones: [boneName, 'x'|'y'|'z', degrees][], yaw: degrees, camera: { pos: [x,y,z], look: [x,y,z], fov } }>` : une entrée par id de `SCENES`, ni plus ni moins.
  - `bonesByName(root: Object3D) → Record<string, Bone>` : noms normalisés ; mémorise la pose de liaison dans `bone.userData.bind` (une seule fois).
  - `poseQuaternions(bones, recipe) → Record<string, Quaternion>` : part de la liaison, applique chaque rotation **autour de l'axe du monde** dans l'ordre listé, relève les quaternions locaux de tous les os, puis remet la liaison.
  - `blendPose(bones, from, to, t)` : chaque os de l'union reçoit `slerp(from[n] ?? bind, to[n] ?? bind, t)`, les autres reprennent leur liaison.

Repère : le personnage est normalisé à 1,80 m, pieds à y = 0, face vers +Z. `yaw` 180 le montre de dos. Les poses expriment la colonne « Le personnage » du tableau des scènes. Leur réglage fin est laissé au constructeur, comme le dit le spec :

| id | intention |
|---|---|
| ouverture | de dos, bras le long du corps |
| metier | de trois-quarts, tête légèrement levée vers un mur |
| construire | avant-bras levés devant lui, paumes vers le haut |
| musique | les deux mains aux oreilles (casque, plan 3) |
| coree | épaules rentrées, bras serrés contre le corps |
| vivant | tête baissée, une main tendue vers le sol |
| transmission | buste penché en avant, un bras ouvert |
| sortie | de dos, en marche |

Règle de cadrage, à corriger par le plan 3 si besoin : le texte occupe la colonne gauche aux index pairs et la droite aux index impairs. La caméra place le personnage dans l'autre moitié.

- [ ] **Step 1: Écrire les tests.**
  - `has one pose per scene` : `Object.keys(SCENE_POSES)` égale `SCENES.map(s => s.id)`.
  - `only uses bones of the source skeleton` (`// @vitest-environment node` dans un fichier séparé, `tests/character-poses-bones.test.js`) : lire le chunk JSON de `assets-src/character/damien-tripo.glb` et vérifier que chaque nom de `SCENE_POSES[*].bones` figure parmi ses os normalisés.
  - `cameras are sane` : nombres finis, `20 <= fov <= 60`, `look[1]` entre 0 et 1.8.
  - `applies a rotation in world axes and restores bind` : hiérarchie synthétique `Hips → Spine → LeftArm [0.2,0,0] → LeftForeArm [0.25,0,0] → LeftHand [0.25,0,0]`. `poseQuaternions(b, [['LeftArm','z',-45]])` : appliqué via `blendPose(b, {}, q, 1)`, la position monde de `LeftHand` descend (y plus petit qu'en liaison). Après l'appel à `poseQuaternions`, tous les os sont revenus en liaison.
  - `blends between two poses` : t=0 donne `from`, t=1 donne `to`, t=0,5 donne un angle moitié (`angleTo` à 1e-6 près).
- [ ] **Step 2: Lancer, vérifier l'échec** — `npx vitest run tests/character-poses` → FAIL.
- [ ] **Step 3: Implémenter `poses.js`.** Rotation monde d'un os : `local = parentWorld⁻¹ · R(axe, angle) · boneWorld`, puis `updateMatrixWorld(true)` avant l'os suivant.
- [ ] **Step 4: Lancer, vérifier le succès** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Add per-scene character poses as data"`

### Task 4: De la position de scroll aux scènes

**Files:**
- Create: `macaco/src/lib/sceneProgress.js`
- Test: `macaco/tests/scene-progress.test.js`

**Interfaces:**
- Produces: `HOLD = 0.25`.
- Produces: `sceneBlend(center: number, anchors: number[]) → { from: number, to: number, t: number }`. `center` = haut du scroll + demi-hauteur de vue ; `anchors` = centres des sections, croissants.
  - avant la première ancre → `{ from: 0, to: 0, t: 0 }` ; après la dernière → `{ from: last, to: last, t: 0 }` ;
  - entre `i` et `i+1` : `u = (center − a[i]) / (a[i+1] − a[i])`, puis `t = smoothstep(clamp((u − HOLD) / (1 − 2·HOLD)))`. La pose tient sur le premier et le dernier quart de l'intervalle, le temps de lire.
- Produces: `progressAt({ from, to, t }) → number` = `lerp(SCENES[from].progress, SCENES[to].progress, t)`, à passer à `accentForProgress`.

- [ ] **Step 1: Écrire les tests.**
  - `holds the first scene before the first anchor` ; `holds the last scene past the last anchor (footer)` : `center` = dernière ancre + 5000.
  - `holds a pose near each anchor` : à `u = 0.2`, `t === 0` ; à `u = 0.8`, `t === 1`.
  - `is monotonic between anchors` : sur 50 positions croissantes, `from + t` ne décroît jamais.
  - `is stateless` : mêmes entrées, même sortie, quel que soit l'ordre des appels (saut par ancre `#scene-coree`).
  - `never returns NaN` : `anchors` vide → `{0,0,0}` ; deux ancres égales ; `center` = `NaN` → traité comme 0.
  - `progressAt matches the ramp ends` : `progressAt({from:0,to:0,t:0}) === 0`, `progressAt({from:7,to:7,t:0}) === 1`.
- [ ] **Step 2: Lancer, vérifier l'échec.**
- [ ] **Step 3: Implémenter.** Recherche linéaire sur huit ancres, pas besoin de dichotomie.
- [ ] **Step 4: Lancer, vérifier le succès.**
- [ ] **Step 5: Commit** — `git commit -m "Map scroll position to a scene blend"`

### Task 5: Regard, respiration, politique de mouvement, chargement différé

**Files:**
- Create: `macaco/src/three/character/motion.js`, `macaco/src/lib/afterLoad.js`
- Test: `macaco/tests/character-motion.test.js`, `macaco/tests/after-load.test.js`

**Interfaces:**
- Produces: `lookAngles(x, y, { maxYaw = 25, maxPitch = 15 } = {}) → { yaw, pitch }`. Entrée en coordonnées normalisées [-1, 1], bornée ; sortie en radians ; une valeur non finie compte pour 0.
- Produces: `breathing(seconds) → radians` : oscillation de période 4 s, amplitude 0,6°, appliquée à `Spine2`.
- Produces: `motionPolicy({ reducedMotion, coarsePointer, frozen }) → { idle, lookAt, blend: 'smooth'|'snap', frameloop: 'always'|'demand' }`.
- Produces: `afterLoad(callback, { timeout = 2000 } = {}) → cancel()`. Appelle après l'événement `load` (tout de suite si `document.readyState === 'complete'`), puis `requestIdleCallback` avec `timeout`, ou `setTimeout(…, 200)` s'il est absent.

- [ ] **Step 1: Écrire les tests.**
  - `lookAngles` : `(0,0)` → `{0,0}` ; `(1,1)` → `{ yaw: 25°, pitch: 15° }` en radians ; `(5,-5)` borné ; `(NaN, Infinity)` → `{0,0}`.
  - `breathing` : `|breathing(t)| <= 0.6° + 1e-9` sur 100 valeurs ; `breathing(0) === breathing(4)` à 1e-9 près.
  - `motionPolicy`, par cas :
    - par défaut → `{ idle: true, lookAt: true, blend: 'smooth', frameloop: 'always' }` ;
    - `reducedMotion` → `{ idle: false, lookAt: false, blend: 'snap', frameloop: 'demand' }` ;
    - `coarsePointer` → `lookAt: false`, le reste par défaut ;
    - `frozen` → `{ idle: false, lookAt: false, blend: 'smooth', frameloop: 'demand' }` ;
    - `reducedMotion` gagne sur tout.
  - `afterLoad` (jsdom, faux timers) :
    - ne s'appelle pas avant `load` ;
    - s'appelle après `load` et le délai d'inactivité ;
    - `cancel()` avant l'appel l'empêche ;
    - si `readyState` vaut déjà `complete`, n'attend pas `load`.
- [ ] **Step 2: Lancer, vérifier l'échec.**
- [ ] **Step 3: Implémenter.**
- [ ] **Step 4: Lancer, vérifier le succès.**
- [ ] **Step 5: Commit** — `git commit -m "Add character motion policy and deferred loading"`

### Task 6: Les huit sections, sans intro ni mécha

**Files:**
- Create: `macaco/src/components/ScenesTrack.jsx`, `macaco/src/styles/scenes.css`
- Modify: `macaco/src/pages/Home.jsx` (garder `HomeContent`, `Mcf` et ce dont ils dépendent ; retirer `Craft`, `Rstage` et l'import d'Intro), `macaco/src/App.jsx` (retirer `<Intro active={n} />` et son import)
- Delete: `src/components/intro/`, `src/three/RobotScene.jsx`, `src/three/RobotStage.jsx`, `src/three/CityScene.jsx`, `public/intro/Mecha_Full.glb`. Retirer aussi les règles CSS dont le sélecteur commence par `.intro-`, `.craft`, `.rstage` ou `.hud`, et les `public/home/*.svg` devenus orphelins.
- Modify: `macaco/tests/identity.test.js`
- Test: `macaco/tests/scenes-track.test.jsx`

**Interfaces:**
- Consumes: `SCENES`, `sceneText` (`src/content/scenes.js`) ; i18n comme `ReadingMode.jsx`.
- Produces: `ScenesTrack()` rend, dans l'ordre de `SCENES`, `<section className="scene" id={'scene-' + id} data-scene={id} aria-labelledby={'scene-' + id + '-title'}>` avec un `<h2 id=…-title>` et un `<p>`. `CharacterCanvas` (tâche 7) mesure ces `[data-scene]`.
- `scenes.css` : `min-height: 100svh`, fond transparent, colonne de texte à gauche aux index pairs et à droite aux index impairs (`.scene:nth-child(even)`), largeur ≤ 38ch. Typographie et mise en scène : plan 3.
- `config.js` garde ses clés mortes de l'intro : le nettoyage du minifié est laissé au plan 3.

- [ ] **Step 1: Écrire les tests.**
  - `scenes-track.test.jsx` : rend `ScenesTrack` (i18n en `fr`) ; 8 `section[data-scene]` dans l'ordre de `SCENES` ; chaque section a un `h2` relié par `aria-labelledby`.
  - `identity.test.js`, deux ajouts :
    - `no reference to the inherited mecha or intro` : aucun fichier de `src/` ne contient `Mecha_Full`, `RobotScene`, `RobotStage`, `CityScene` ni `components/intro` ;
    - `the mecha asset is gone` : `public/intro/Mecha_Full.glb` n'existe pas.
- [ ] **Step 2: Lancer, vérifier l'échec.**
- [ ] **Step 3: Créer `ScenesTrack`, restructurer Home et App, supprimer les fichiers.** `HomeContent` rend `<main className="home-content">` avec `UseSeo`, le `h1` masqué, `<ScenesTrack />` et `<Mcf />`.
- [ ] **Step 4: Lancer `npm test`** → tout vert. Lancer `npm run build` → succès, puis `rg "Mecha_Full" dist` → aucun résultat.
- [ ] **Step 5: Vérifier dans le navigateur** — `preview_start` `macaco`, ouvrir `/fr`. Les huit titres défilent, la console n'a pas d'erreur, et `?lecture=1` fonctionne toujours.
- [ ] **Step 6: Commit** — `git commit -m "Replace the inherited intro and mecha with eight scene sections"`. Dans `docs/superpowers/notes/2026-11-17-fondations-suivi.md`, marquer levé le bloquant « texture de Mecha_Full.glb porte le mot MACACO », dans le même commit.

### Task 7: Le canvas persistant

**Files:**
- Create: `macaco/src/three/CharacterCanvas.jsx`, `macaco/src/styles/character.css`
- Modify: `macaco/src/pages/Home.jsx` (monter le canvas)
- Test: `macaco/tests/character-canvas.test.jsx`

**Interfaces:**
- Consumes:
  - tâche 3 : `SCENE_POSES`, `bonesByName`, `poseQuaternions`, `blendPose` ;
  - tâche 4 : `sceneBlend`, `progressAt` ;
  - tâche 5 : `lookAngles`, `breathing`, `motionPolicy`, `afterLoad` ;
  - le site : `accentForProgress` (`lib/ramp.js`), `makeDitherMaterial` (`three/ditherMaterial.js`), `getScrollTop`, `getViewportHeight`, `getOffsetTop`, `onScroll`, `getScrollRoot` (`lib/scroll.js`), `pixelRatioFor`, `isCoarsePointer` (`lib/device.js`) ;
  - l'asset `/character/damien.glb`.
- Produces: `CharacterLayer()` exporté par défaut. Il ne rend rien tant que `afterLoad` n'a pas répondu, puis charge en paresseux le module du canvas. Il est enveloppé dans une barrière d'erreur `QuietBoundary` (exportée, testée) qui rend `null` et logue un `console.warn` si le canvas jette.

Comportement :
- **Couche :** `position: fixed; inset: 0; z-index: 0; pointer-events: none; aria-hidden`. Le contenu de `.scroll-root` passe au-dessus.
- **Chargement :** `useGLTF('/character/damien.glb', false, true)`. Normalisation une fois : `Box3().setFromObject(scene, true)`, l'option `precise` étant nécessaire pour un maillage skinné ; hauteur 1,80 m, pieds à y = 0, centré en x et z.
- **Matériau :** `makeDitherMaterial({ transparent: false, pixel: 2, gain: 1.7, colorDark: '#0A0B0C' })`, avec la `map` d'origine. `colorLight` suit `accentForProgress(progressAt(blend))` à chaque image.
- **Ancres :** centres des `[data-scene]` (`getOffsetTop(el) + el.offsetHeight / 2`). Mesurées au montage, puis remesurées par `ResizeObserver` sur la racine de scroll.
- **Image :**
  - `sceneBlend` donne la pose (`blendPose`), le `yaw` et la caméra, interpolés par `t` ;
  - en mode `snap`, `t` est arrondi ;
  - puis la respiration sur `Spine2` si `idle`, et le regard sur `Head` (et `Neck` à moitié) si `lookAt`.
- **Performance :**
  - `dpr` vient de `pixelRatioFor(innerWidth, innerHeight)` ;
  - `PerformanceMonitor` en `onDecline` fige le personnage (`frozen: true`) ;
  - en `frameloop: 'demand'`, `invalidate()` est appelé à chaque événement de scroll.
- **Lumières :** ambiante 0,35, clé `[2,3,4]` à 1,6, contre-jour neutre `[-3,2,-3]` à 0,9. Le dither lit la luminance : pas d'`Environment`.

- [ ] **Step 1: Écrire les tests** (jsdom).
  - `QuietBoundary renders nothing when its child throws` : un enfant qui jette → conteneur vide, `console.warn` appelé une fois.
  - `CharacterLayer waits for load` : avant `load`, rien n'est rendu et aucune requête vers `damien.glb` n'est faite (`fetch` espionné) ; le module de canvas est mocké.
- [ ] **Step 2: Lancer, vérifier l'échec.**
- [ ] **Step 3: Implémenter `CharacterCanvas.jsx` et `character.css`** ; monter `<CharacterLayer />` au début de `HomeContent`.
- [ ] **Step 4: `npm test`** → tout vert ; `npm run build` → succès.
- [ ] **Step 5: Vérifier dans le navigateur.** `preview_start` `macaco`, `/fr` ; le panneau doit être visible, ou utiliser le navigateur Playwright sans affichage.
  - Dans les requêtes réseau, `damien.glb` part après la fin du chargement du document.
  - Faire défiler jusqu'à chaque `#scene-*` et prendre une capture : la pose correspond au tableau de la tâche 3, le manteau n'est pas déchiré, le personnage est dans la moitié sans texte.
  - Dans le pied de page, la pose de `sortie` tient.
  - `resize_window` en `mobile` puis `desktop` : les ancres suivent, rien ne saute.
  - Émuler `prefers-reduced-motion: reduce` (`javascript_tool`, `matchMedia` surchargé avant chargement) : les poses changent sans transition, rien ne bouge au repos.
  - Bloquer `damien.glb` (renommer le fichier le temps du test) : la page reste lisible, un seul `console.warn`.
- [ ] **Step 6: Commit** — `git commit -m "Render the character in a persistent canvas behind the scenes"`

---

## Hors plan 2, prévu ailleurs

- **Accessoires** (casque scène 4, écharpe scène 5), matières par scène (chrome → verdigris), racines, visualizer, silhouettes de la scène 7 : plan 3, avec le texte.
- **Reprojection du visage** sur la texture, si Damien veut regagner de la ressemblance : tâche optionnelle, à décider après avoir vu le personnage tramé dans le site.
- **Animations Mixamo** (marche de la sortie) : le squelette est compatible. On y vient si les poses fixes ne suffisent pas.
