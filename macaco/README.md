# Portfolio de Damien Demontis — base v6

Base du portfolio : Vite 6 + React 18 + react-three-fiber. Le code a été
reconstruit à partir d'un build de production (sans source maps), puis
débarrassé de toute l'identité du site d'origine. L'accueil est fait de huit
scènes en texte, devant un personnage 3D rendu dans un canvas fixe ; le texte
définitif, les accessoires et la mise en scène viennent au plan 3.

## Démarrer

```bash
npm install
npm run dev     # http://localhost:5180
npm test        # vitest
npm run build
```

## Organisation

```
src/
  main.jsx                      point d'entrée
  App.jsx                       routeur : redirection de langue, gabarit /:lang, accueil en lazy
  config.js                     réglages hérités (scroll, lumières, post-traitement)
  components/
    ScenesTrack.jsx             les huit <section data-scene>, mesurées par le canvas
    ReadingMode.jsx             mode lecture (?lecture=1) : les scènes en document texte
    Cursor.jsx                  curseur personnalisé
    DitherFill.jsx              remplissage dithéré WebGL (bayer 8x8 + fbm)
    Nav.jsx                     navigation, lien applicatif, panneau mobile
    PageTransition.jsx          contexte + voile de transition entre pages
    ScrollProgress.jsx          barre de progression et bandeau de chargement
    SiteDither.jsx              voile dithéré plein écran
    VideoPlayer.jsx             lecteur vidéo et requêtes media partagées
  pages/Home.jsx                accueil : couche du personnage, scènes, pied de page
  three/
    CharacterLayer.jsx          couche légère : attend load, sonde WebGL 2 et le GLB, importe le canvas
    CharacterCanvas.jsx         canvas R3F persistant : poses, caméra, tramage, regard, respiration
    character/poses.js          une pose par scène (données), mélange des poses
    character/motion.js         regard, respiration, politique de mouvement
    ditherMaterial.js           matériau tramé
  content/scenes.js             manifeste des huit scènes (source unique du texte)
  content/site.js               identité du site et liens sociaux
  seo/                          Seo.jsx (runtime), meta.js (données pures, partagées avec le prérendu)
  i18n/                         langues (fr, en, ko), init i18next, locales/{fr,en,ko}.json
  lib/
    sceneProgress.js            position de scroll -> (scène de départ, scène d'arrivée, t)
    afterLoad.js                différer un appel après load et un créneau d'inactivité
    device, ramp, routing, scroll, carbon, shared
  state/accent.jsx              couleur d'accent courante
  styles/                       tokens, feuille globale, accueil, scènes, personnage, lecteur vidéo
scripts/
  character/                    pipeline du personnage (npm run character)
  prerender*.mjs                pages statiques par langue après vite build
assets-src/character/           source Tripo du personnage, non servie
public/character/damien.glb     personnage servi
tests/                          vitest (globals) ; les tests qui lisent le disque tournent en environnement node
```

Pile : Vite + React 18, react-router 6, i18next, framer-motion,
three r171 + @react-three/fiber / drei / postprocessing.

## Personnage

Le personnage vient d'un export Tripo riggé par Mixamo. `npm run character`
transforme la source `assets-src/character/damien-tripo.glb` (non servie) en
`public/character/damien.glb`, le fichier que le site charge. Le pipeline
corrige les poids du manteau (l'auto-rig colle le bas du manteau aux mains),
réduit les textures à 1024 px en WebP et compresse en meshopt.

Changer de modèle :

1. Remplacer `assets-src/character/damien-tripo.glb` par le nouvel export, sous
   le même nom. Le squelette doit être Mixamo (`mixamorig:*`) avec `Hips`,
   `Head` et, pour chaque bras, `Arm`, `ForeArm` et `Hand` ; positions et
   poids en flottants (pas de quantification). Sinon le build s'arrête avec un
   message qui dit ce qui manque.
2. `npm run character`, puis `npm test`. La sortie affiche :
   - `octets` : taille du GLB servi. Budget : 2 000 000 octets pour le
     personnage seul, le million restant des 3 Mo va aux accessoires ;
   - `triangles` : identique à la source (ni soudure ni simplification) ;
   - `os` : 65 pour un squelette Mixamo complet ;
   - `sommets corrigés` : sommets du manteau détachés des os du bras (953 sur
     le modèle actuel). Zéro veut dire que le correctif n'a rien trouvé à faire.
3. Commiter la source et `public/character/damien.glb` ensemble.

Le script demande Node 20.9 ou plus, à cause de sharp (`engines` dans
`package.json`). Les poses par scène se règlent dans
`src/three/character/poses.js`.

## Garde-fous

`tests/identity.test.js` refuse toute trace de l'identité d'origine (nom,
jaune, police d'affichage, bannière cookies, rayures de danger), toute
formule de recherche d'emploi, et toute référence à un fichier de `public/`
qui n'existe pas : le serveur de dev répond `index.html` en 200 pour un
fichier absent, ce qui masque le trou.

## Limites connues

- Le découpage en modules est reconstitué : les frontières suivent le graphe
  de dépendances, pas le projet d'origine.
- Les symboles exportés sont nommés d'après leur usage ; les variables
  locales non exportées gardent des noms de minifieur (`Ka`, `rn`, …).
- Quelques constantes de timing du hero (`si`, `li`, `ci`) restent
  minifiées : leur rôle exact n'est pas déductible du build.
- `lib/shared.js` est un fourre-tout assumé : ce que plusieurs modules
  utilisent sans propriétaire évident.
- Des noms hérités restent (préfixe de classes `mc-`, variables CSS
  `--yellow`, modificateur `mc-nav--on-yellow`) : leur valeur suit
  désormais la rampe d'oxydation.
