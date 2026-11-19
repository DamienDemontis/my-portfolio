# Portfolio v6 — Section Projets (salle de projection) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** La section 4 du storyboard : une salle de projection où le projecteur 8 mm projette vraiment les projets (sur l'écran, sur lui, avec son ombre), un travelling le long du faisceau qui passe d'un projet à l'autre par une brûlure de pellicule, et des cartes de projet en DOM.

**Architecture:** Une `CinematicSection` (socle) avec une scène `ProjectionRoom`. Le projecteur est une `SpotLight` à ombres dont la `map` est une cible de rendu : un petit shader « pellicule » y compose l'image du projet courant, la brûlure, le grain, le battement et l'amorce. L'écran (matériau mat) reçoit cette lumière et l'ombre du personnage ; un cône additif et des poussières dessinent le faisceau ; une lumière de rebond prend la couleur du projet pour éclairer son visage au contrechamp. La progression donne le projet courant par une fonction pure (`projectAt`), partagée par le texte et la scène.

**Tech Stack:** Vite 6, React 18, three r171, R3F 8, drei 9, @react-three/postprocessing, sharp (déjà en devDependencies), Vitest.

**Spec:** `docs/superpowers/specs/2026-11-19-storyboard-v6.md` (section 4, grammaire commune), puis `docs/superpowers/specs/2026-11-17-portfolio-v6-design.md`.

## Global Constraints

- Aucune formule qui signale une recherche d'emploi ; rien qui identifie MACACO dans `src/` ; ne retirer aucune scène ni aucun effet existant.
- PandaLab au niveau produit seulement : aucun nom de service interne, aucune capture (la carte e-santé est un intertitre dessiné).
- Au plus 1,5 Mo de décors et d'images pour la section (le personnage est partagé) ; images WebP ≤ 1024 px de large.
- `prefers-reduced-motion` : plan fixe, changement de projet en coupe franche (pas de brûlure), aucune animation de caméra.
- Le texte reste en DOM, lisible et cliquable sans WebGL ; la 3D se charge à l'approche (socle).
- Le jeu Wii Tanks (75 Mo) ne se charge qu'au clic sur « Jouer », dans un `<dialog>` ; les liens externes s'ouvrent dans un nouvel onglet avec `rel="noopener noreferrer"` et une mention pour lecteurs d'écran.
- Code lisible, commentaires en français ; tests dans `macaco/tests/`, ceux qui lisent le disque commencent par `// @vitest-environment node`.
- Ne pas toucher : `macaco/lab*`, `macaco/public/lab/`, `contenu-prive/`, `avatar-*`, `.playwright-mcp/`.

## Review Focus

1. **Arrivée par une ancre ou un saut de scroll** au milieu de la piste : le bon projet est à l'écran et dans le texte immédiatement (`projectAt` sans état). → tests des tâches 2 et 4.
2. **Mouvement réduit** : plan fixe, le projet affiché suit la progression du scroll en coupe franche, texte et écran d'accord. → tests des tâches 2 et 4.
3. **Clavier** : Tab n'atteint que les boutons de la carte visible ; « Jouer » ouvre le dialogue, Échap le ferme et rend le focus au bouton. → test de la tâche 4.
4. **390×844** : la carte tient sans masquer l'écran ; personnage et écran dans le cadre à chaque palier. → test de cadrage (tâche 2) et vérification navigateur (tâche 5).
5. **Sans WebGL 2** : affiche et texte complet, boutons utilisables. → test de la tâche 4.

---

### Task 1: Données, images et textes des projets

**Files:**
- Create: `macaco/scripts/projects/build.mjs` (`npm run projects`), `macaco/src/content/projects.js`, `macaco/src/content/projectMedia.json` (généré), `macaco/public/projects/*.webp`
- Modify: `macaco/package.json` (script), `macaco/src/i18n/locales/{fr,en,ko}.json` (clés `home.projects.*`)
- Test: `macaco/tests/projects-data.test.js`

**Interfaces:**
- Produces: `PROJECTS` (projects.js), dans l'ordre : `esante`, `jobneko`, `leonart`, `wiitanks`, `presence`, `msc`. Chaque entrée : `{ id, media, stack: string[], links: [{ kind: 'play'|'source'|'demo'|'video', href }] }` ; `media` = `{ kind: 'image', src: '/projects/<id>.webp', color: '#rrggbb' }` ou `{ kind: 'title', glyph: 'ecg'|'cat', color: '#rrggbb' }`.
- Produces: `projectMedia.json` : `{ <id>: { src, width, height, bytes, color } }` pour les projets à image, écrit par le script (couleur dominante de sharp).
- Le script lit `../public/projects/{leonart,tank_game,facial_recognition,msc_decouverte}.png` (racine du dépôt), recadre en 16:9, 1024×576, WebP qualité 80, écrit `public/projects/<id>.webp`. Source absente → erreur qui nomme le fichier, rien d'écrit.
- Textes exacts : `contenu` donné dans le brief de la tâche (FR, EN, KO).

- [ ] **Step 1: Tests** : chaque projet a `title`, `meta`, `line` dans les trois langues ; les images existent, ≤ 150 000 octets chacune, et le manifeste correspond au disque ; `play` n'existe que pour `wiitanks` et pointe vers `/games/wii-tanks/index.html` (fichier présent dans `public/`) ; tout autre lien est en `https://` ; les clés de boutons et de dialogue existent dans les trois langues.
- [ ] **Step 2–4:** échec, implémentation, `npm run projects`, `npm test` vert.
- [ ] **Step 5: Commit** — « Add the project data, screen images and texts for the screening room »

### Task 2: Progression des projets, plans de caméra et clip « regarde »

**Files:**
- Create: `macaco/src/three/projection/steps.js`, `macaco/src/three/projection/layout.js` (positions de la salle et plans), `macaco/src/three/character/sectionClips.js`
- Test: `macaco/tests/projection-steps.test.js`, `macaco/tests/projection-shots.test.js`, `macaco/tests/section-clips.test.js`

**Interfaces:**
- Produces (steps.js) : `PROJECT_ANCHORS` (6 progressions croissantes) ; `projectAt(p) → { index, from, to, burn }` : `index` = projet du palier le plus proche ; entre deux paliers, `burn` va de 0 à 1 sur une fenêtre centrée sur le milieu (largeur `BURN_WINDOW` × écart), `from` = projet précédent, `to` = suivant ; avant le premier palier : `{ index: 0, from: -1, to: 0, burn }` où `-1` = amorce (le projecteur démarre) ; sans état.
- Produces (layout.js) : `ROOM = { screen: { center, width, height }, projector: { position, lens }, character: { position, rotationY } }` ; `PROJECTION_SHOTS = { wide, narrow }` dont les ancres de travelling sont exactement `PROJECT_ANCHORS` ; `PROJECTION_STILL`.
- Produces (sectionClips.js) : `SECTION_CLIPS` (au moins `watch`, boucle de 4 s environ : debout, mains près des poches, tête levée vers l'écran, poids qui passe d'une jambe à l'autre) ; `sectionClipsFor(scene)` (cache par scène, comme `clipsFor`). `CLIPS` de l'intro ne change pas.

- [ ] **Step 1: Tests**
  - steps : bornes (p < 0, p > 1, NaN) ; `burn = 0` sur chaque ancre ; `burn` croît dans la fenêtre ; appels dans le désordre identiques ;
  - shots : `checkShots` passe pour `wide` et `narrow` ; chaque ancre de projet est une ancre de plan ; **cadrage** : au plan de chaque ancre de projet, le centre de l'écran se projette dans le cadre (NDC dans ±0,9) en 1440/900 pour `wide` et 390/844 pour `narrow` ; au plan par-dessus l'épaule et au contrechamp, la tête du personnage aussi ;
  - clip : durée, 30 images/s, valeurs finies, boucle sans couture, pose de liaison restaurée.
- [ ] **Step 2–4:** échec, implémentation, tests verts.
- [ ] **Step 5: Commit** — « Map scroll progress to projects and frame the screening room »

### Task 3: La scène `ProjectionRoom`

**Files:**
- Create: `macaco/src/three/projection/ProjectionRoom.jsx`, `macaco/src/three/projection/filmMaterial.js`, `macaco/src/three/projection/beam.js`
- Test: `macaco/tests/projection-film.test.js`

Salle noire, sol sombre légèrement réfléchissant, projecteur sur un pied, écran mat 16:9. `SpotLight` à ombres : `map` = cible de rendu composée par `filmMaterial` (images `from`/`to`, brûlure, grain, battement, vignette de fenêtre, amorce avant le premier projet), cadre 16:9 inscrit dans le cône. Le personnage (clip `watch`) projette son ombre sur l'écran. Cône additif et poussières dans le faisceau. Lumière de rebond depuis l'écran, couleur du projet. Bobines qui tournent. Intertitres dessinés (canvas) pour `title`. Sous mouvement réduit : projet de `stageProps.index`, `burn` à 0.

- [ ] **Step 1: Tests** (purs) : l'uniforme de brûlure, les textures `from`/`to` et la couleur de rebond suivent `projectAt` ; les intertitres sont créés pour chaque `media.kind === 'title'`.
- [ ] **Step 2: Vérification navigateur (contrôleur)** sur la page de labo : chaque plan en 1440×900 et 390×844.
- [ ] **Step 3: Commit** — « Build the screening room: a projector that lights the screen and him »

### Task 4: La section en DOM

**Files:**
- Create: `macaco/src/sections/Projects.jsx`, `macaco/src/styles/projects.css`
- Modify: `macaco/src/pages/Home.jsx` (`<Projects />` entre `<Rstage />` et `<Mcf />`)
- Test: `macaco/tests/projects-section.test.jsx`

**Interfaces:**
- Consumes : `CinematicSection` (socle), `PROJECTS`, `projectAt`, `PROJECTION_SHOTS`, `PROJECTION_STILL`, `ProjectionRoom` (React.lazy).
- Section `id="projets"`, `aria-labelledby`, titre `h2`, liste ordonnée des six projets : seule la carte du palier courant est visible, les autres `inert` et `aria-hidden` ; compteur « 03 / 06 » ; boutons selon `links`. « Jouer » ouvre un `<dialog>` (`showModal`) qui crée l'iframe du jeu à l'ouverture et la retire à la fermeture.

- [ ] **Step 1: Tests** (jsdom) : progression → carte visible et compteur ; saut direct à p = 0,7 → bonne carte ; les cartes cachées sont `inert` ; aucune iframe avant le clic sur « Jouer », une après, aucune après Échap ; focus rendu au bouton ; liens externes avec `rel` et mention lecteur d'écran ; sans WebGL 2, le texte est complet.
- [ ] **Step 2–4:** échec, implémentation, `npm test` et `npm run build` verts.
- [ ] **Step 5: Commit** — « Add the projects section with one card per projector step »

### Task 5: Intégration, affiche et vérification

- [ ] Réglage des plans et des lumières sur `/fr` (contrôleur) : captures à chaque palier en 1440×900 et 390×844 ; affiche WebP tirée d'un plan de la scène (`poster`) ; budget de la section mesuré.
- [ ] `npm test`, `npm run build` verts. **Commit** — « Tune the screening room and give it a poster »
