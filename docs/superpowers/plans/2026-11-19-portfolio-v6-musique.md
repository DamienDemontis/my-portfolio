# Portfolio v6 — Section Musique (salle d'écoute) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** La section 5 du storyboard : une salle d'écoute au sol noir réfléchissant et aux néons cuivre, lui au centre avec un casque, un anneau de particules qui suit la vraie musique, une orbite à 360° et un dolly zoom ; un lecteur en DOM qui ne télécharge rien avant le clic.

**Architecture:** Une `CinematicSection` (socle) avec une scène `ListeningRoom`. Le son passe par un moteur d'écoute (`listening.js` : élément audio, Web Audio, AnalyserNode) qui publie à chaque image l'énergie lissée des graves, des médiums et des aigus et les coups de grosse caisse (logique du visualiseur du v5, portée en fonctions pures). La scène lit ces valeurs dans `useFrame` : l'anneau de particules se dilate sur les graves, tourbillonne sur les médiums, frémit sur les aigus ; des ondes partent au sol sur les coups. Les extraits viennent des aperçus officiels de 30 s de Deezer : une fonction Vercel (`api/preview.js`) donne, pour un identifiant de la liste, l'URL signée de l'extrait, que le navigateur lit en CORS.

**Tech Stack:** Vite 6, React 18, three r171, R3F 8, drei 9 (MeshReflectorMaterial), Web Audio API, fonction Vercel (Node), Vitest.

**Spec:** `docs/superpowers/specs/2026-11-19-storyboard-v6.md` (section 5, grammaire commune), puis `docs/superpowers/specs/2026-11-17-portfolio-v6-design.md`.

## Global Constraints

- Aucune formule qui signale une recherche d'emploi ; rien qui identifie MACACO dans `src/` ; ne retirer aucune scène ni aucun effet existant.
- Droits : aucun fichier audio du commerce dans le dépôt ni dans `dist/`, aucune parole ; seulement les extraits officiels de 30 s, lus depuis Deezer, avec la mention « Extrait de 30 s · Deezer » et un lien vers le morceau.
- Rien ne se télécharge avant le clic sur un morceau (ni audio ni pochette) ; le contexte audio se crée au premier clic.
- La fonction n'accepte que les identifiants de la liste (pas de proxy ouvert) ; elle ne transmet aucune donnée du visiteur.
- `prefers-reduced-motion` : plan fixe, l'anneau ne bouge pas sur la musique (la musique reste jouable).
- Le texte reste en DOM ; la 3D se charge à l'approche (socle) ; au plus 1,5 Mo de décors par section.
- Rythme des coupes : la section Projets finit sur un gros plan fixe au téléobjectif ; Musique commence large, en hauteur et en mouvement.
- Code lisible, commentaires en français ; tests dans `macaco/tests/`.
- Ne pas toucher : `macaco/lab*`, `macaco/public/lab/`, `contenu-prive/`, `avatar-*`, `.playwright-mcp/`, `apercus-v6/`.

## Review Focus

1. **Extrait expiré ou indisponible** (Deezer refuse, réseau coupé) : message clair dans le lecteur, aucun plantage, l'anneau revient au repos. → tests des tâches 1 et 4.
2. **Navigateur sans Web Audio ou contexte suspendu** (iOS) : la lecture démarre au clic ou se signale, l'anneau reste au repos. → test de la tâche 1.
3. **On quitte la section en écoutant** : la musique continue (choix du visiteur) mais l'anneau ne coûte rien hors écran ; « Arrêter » est toujours atteignable. → tâche 4.
4. **Mouvement réduit** : plan fixe, anneau immobile. → tâches 3 et 4.
5. **390×844** : le lecteur tient sans masquer le personnage ; casque et anneau dans le cadre. → tests de cadrage (tâche 2), navigateur (tâche 5).

---

### Task 1: Morceaux, extraits et moteur d'écoute

**Files:**
- Create: `macaco/src/content/music.js`, `macaco/src/lib/listening.js`, `macaco/src/three/music/audioBands.js`, `macaco/api/preview.js`, `macaco/scripts/dev-preview-plugin.mjs` (sert `/api/preview` au serveur de dev)
- Modify: `macaco/vite.config.js` (le plugin de dev), `macaco/src/i18n/locales/{fr,en,ko}.json` (`home.music.*`)
- Test: `macaco/tests/music-data.test.js`, `macaco/tests/audio-bands.test.js`, `macaco/tests/listening.test.js`, `macaco/tests/preview-api.test.js`

**Interfaces:**
- Produces: `TRACKS` (music.js) : `[{ id, title, artist, genre, deezer }]` (identifiants dans le brief).
- Produces (audioBands.js, pur) : `bandEnergy(data, from, to)`, `smoothBands(prev, raw) → { bass, mid, high }` (attaque rapide, retombée lente, constantes du v5), `detectKick(state, bass) → { kick: boolean, state }` (seuil, saut, temps mort du v5).
- Produces (listening.js) : `createListening({ resolve = fetchPreview })` → `{ play(track), pause(), resume(), stop(), state, bands, subscribe(fn) }` ; `bands` = `{ bass, mid, high, kick, playing }` mis à jour par `tick()` à chaque image (appelé par la scène) ; `state` ∈ `idle | loading | playing | paused | error`. `fetchPreview(track)` appelle `/api/preview?id=<deezer>` → `{ preview, link, cover, title, artist }`.
- Produces (api/preview.js) : `GET /api/preview?id=` ; refuse (400) un id hors de `TRACKS` ; interroge `https://api.deezer.com/track/<id>` ; répond `{ preview, link, cover }` avec `Cache-Control: public, max-age=300` ; 502 si Deezer échoue ou n'a pas d'extrait.

- [ ] Step 1 — tests : données (19 morceaux, ids uniques, un identifiant Deezer chacun) ; bandes (énergie normalisée, lissage asymétrique, coup de grosse caisse détecté une fois puis temps mort) ; moteur (audio et contexte créés au premier `play` seulement ; `error` si la résolution échoue ; `stop` libère l'élément ; sans `AudioContext`, lecture sans bandes) ; fonction (id refusé, réponse réduite aux trois champs, 502 sur échec, en-tête de cache).
- [ ] Step 2–4 : échec, implémentation, tests verts, `npm run build` vert.
- [ ] Step 5 — commit « Add the playlist, the listening engine and a preview endpoint ».

### Task 2: Plans, étapes et animations

**Files:** Create `macaco/src/three/music/layout.js` ; Modify `macaco/src/three/character/sectionClips.js` (clips `listen` et `listen_beat`) ; Test `macaco/tests/music-shots.test.js`, `macaco/tests/section-clips.test.js`.

Plans (`MUSIC_SHOTS = { wide, narrow }`, `MUSIC_STILL`) : grue en plongée large qui descend vers lui (ouverture, en mouvement, ≈ 24 mm) ; très gros plan sur une coque du casque, liseré néon ; **orbite à 360°** lente (signature) ; contre-plongée au travers de l'anneau ; **dolly zoom** sur la fin. Clips : `listen` (respiration, tête qui suit vaguement) et `listen_beat` (la tête bat la mesure, les épaules suivent), mêlés par la scène selon la lecture.

- [ ] Tests : `checkShots` ; cadrage (tête et casque dans le cadre au gros plan, personnage dans le cadre sur toute l'orbite en paysage et en portrait) ; clips en boucle, cuits en pose de liaison.
- [ ] Commit « Frame the listening room and teach him to nod to the beat ».

### Task 3: La scène `ListeningRoom`

**Files:** Create `macaco/src/three/music/ListeningRoom.jsx`, `macaco/src/three/music/ring.js`, `macaco/src/three/music/headphones.js`, `macaco/src/three/music/effects.jsx` ; Test `macaco/tests/music-ring.test.js`.

Sol noir réfléchissant (MeshReflectorMaterial, résolution réduite sur mobile), néons cuivre émissifs (bloom), boombox (`/props/boombox.glb`) à ses pieds, casque procédural (arceau et coques, liseré néon) attaché à l'os de la tête du clone, anneau de particules (Points, shader : dilatation sur les graves, tourbillon sur les médiums, frémissement sur les aigus), ondes au sol sur les coups de grosse caisse, couleur tirée du cuivre et teintée par la pochette quand elle est connue. Sans musique : l'anneau respire doucement. Mouvement réduit : rien ne bouge.

- [ ] Tests purs (uniformes de l'anneau à partir des bandes ; ondes : naissance sur un coup, extinction ; au repos sans musique).
- [ ] Vérification navigateur (contrôleur) sur la page de labo.
- [ ] Commit « Build the listening room: a ring that hears the music ».

### Task 4: La section en DOM

**Files:** Create `macaco/src/sections/Music.jsx`, `macaco/src/styles/music.css` ; Modify `macaco/src/pages/Home.jsx` (`<Music />` après `<Projects />`, la réserve sous le rideau après Musique) ; Test `macaco/tests/music-section.test.jsx`.

En-tête (surtitre, titre `h2`), liste des morceaux (boutons « Titre — Artiste », genre), lecteur (lecture, pause, arrêter, morceau en cours, pochette après le clic, mention « Extrait de 30 s · Deezer » et lien), états de chargement et d'erreur annoncés (`aria-live`). Rien n'est téléchargé avant un clic.

- [ ] Tests (jsdom, moteur factice) : aucun appel réseau avant le clic ; clic → `play` ; états annoncés ; erreur lisible ; arrêter ; clavier ; sans WebGL 2, la liste et le lecteur fonctionnent.
- [ ] Commit « Add the music section with a click-to-listen player ».

### Task 5: Intégration, affiche et vérification

- [ ] Réglage des plans et des lumières sur `/fr` (contrôleur) en 1440×900 et 390×844 ; affiche par cadrage ; budget mesuré ; écoute réelle d'un extrait (dev, via le plugin).
- [ ] `npm test`, `npm run build` verts. Commit « Tune the listening room and give it a poster ».
