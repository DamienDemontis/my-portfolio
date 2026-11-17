# Portfolio de Damien Demontis — base v6

Base du portfolio : Vite 6 + React 18 + react-three-fiber. Le code a été
reconstruit à partir d'un build de production (sans source maps), puis
débarrassé de toute l'identité du site d'origine. Le corps de la page
d'accueil, le personnage 3D et les scènes sont remplacés par les plans
suivants.

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
  config.js                     scroll, caméras, lumières, post-traitement
  components/
    Cursor.jsx                  curseur personnalisé
    DitherFill.jsx              remplissage dithéré WebGL (bayer 8x8 + fbm)
    Nav.jsx                     navigation, lien applicatif, panneau mobile
    PageTransition.jsx          contexte + voile de transition entre pages
    ScrollProgress.jsx          barre de progression et bandeau de chargement
    SiteDither.jsx              voile dithéré plein écran
    VideoPlayer.jsx             lecteur vidéo et requêtes media partagées
    intro/Intro.jsx             hero : titre glitché, décors, scènes 3D
    intro/Hud.jsx               panneaux HUD du hero
  pages/Home.jsx                accueil
  three/                        RobotScene, CityScene, RobotStage, ditherMaterial
  seo/Seo.jsx                   titres, metas, hreflang, Open Graph, JSON-LD
  i18n/index.js                 langues (fr, en, ko) et init i18next
  i18n/locales/{fr,en,ko}.json  traductions
  content/site.js               identité du site et liens sociaux
  lib/                          device, ramp, scroll, shared
  state/accent.jsx              couleur d'accent courante
  hooks/useCanHover.js
  styles/                       tokens, feuille globale, accueil, lecteur vidéo
tests/                          vitest (globals) ; les tests qui lisent le disque tournent en environnement node
```

Pile : Vite + React 18, react-router 6, i18next, framer-motion,
three r171 + @react-three/fiber / drei / postprocessing.

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
- `onSceneRefresh` est un registre d'abonnés que plus rien ne déclenche.
- Des noms hérités restent (préfixe de classes `mc-`, variables CSS
  `--yellow`, modificateur `mc-nav--on-yellow`) : leur valeur suit
  désormais la rampe d'oxydation.
