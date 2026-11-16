# macaco — reconstruction de studiomacaco.ch

Source reconstruite du site **studiomacaco.ch** à partir du build déployé.
Le projet d'origine n'était plus disponible et le build en production n'expose
aucune source map : tout ce qui suit a été récupéré depuis les bundles servis
par CloudFront, puis remis en forme. Le site tourne à l'identique.

État : **reproduction fidèle, non modifiée**. C'est le point de départ, pas la
destination.

## Démarrer

```bash
npm install
npm run fetch-media   # images des case studies (~28 Mo, hors dépôt)
npm run dev           # http://localhost:5180
```

Les vidéos des case studies (~1 Go) ne sont pas rapatriées par défaut :
`npm run fetch-media -- --video` si tu les veux en local.

## Ce qui a été récupéré

| Couche | État | Détail |
|---|---|---|
| CSS | **à l'identique** | 8 feuilles, classes et variables d'origine intactes |
| Contenu | **à l'identique** | 25 case studies, traductions EN/IT complètes |
| Shaders GLSL | **à l'identique** | dither WebGL, matériaux three.js, commentaires compris |
| Markup | **à l'identique** | 890 éléments JSX restaurés depuis les appels `jsx()` |
| Logique | **à l'identique** | sémantique inchangée ; une partie des noms locaux reste minifiée |
| Prérendu SEO | **absent** | fait au déploiement par un script hors bundle |

## Organisation

```
src/
  main.jsx                      point d'entrée
  app-core.jsx                  shell : routeur, i18n, nav, curseur, intro, footer, SEO
  pages/                        Home, Projects, ProjectDetail, Laboratory, Contact, DevSections
  components/case-detail/       CaseSectionRenderer, CaseVideoPlayer
  three/                        RobotScene, CityScene, RobotStage, CaseDeviceScene, ditherMaterial
  hooks/                        useCanHover, useFitHeading
  content/caseHistories.js      les 25 case studies
  i18n/locales/{en,it}.json     traductions
  styles/                       CSS d'origine, une feuille par chunk
```

Pile : Vite + React 18, react-router 6, i18next, framer-motion,
three r171 + @react-three/fiber / drei / postprocessing.

## Limites connues

- `app-core.jsx` regroupe encore plusieurs responsabilités (nav, curseur, intro,
  footer, SEO). Le découpage par fichier du projet d'origine n'est pas
  déductible du bundle : Vite les avait concaténés.
- Les noms internes non exportés restent ceux du minifieur (`Ta`, `qn`, …).
  Les composants ont été renommés d'après leur classe CSS racine, les symboles
  publics d'après leur usage.
- Le markup `index.html` conserve la configuration iubenda et l'ID de site du
  client : à retirer avant toute réutilisation.
- Les blocs SEO `data-seo` du HTML déployé ont été retirés : ils sont générés
  au build par un script absent du bundle, et `useSeo` les réinjecte au runtime.

## Méthode

1. Miroir du site : 58 routes, 28 chunks JS/CSS, 530 assets.
2. Analyse statique des bundles (`rea analyze-javascript-application`) pour le
   graphe applicatif, puis identification des exports vendor par empreinte
   (prototypes three.js, signatures R3F/drei).
3. Codemod Babel : restauration du JSX depuis les appels `jsx()`/`jsxs()`,
   remappage des imports vendor vers les paquets npm, renommage des composants
   d'après leur classe CSS, mise en PascalCase, découpage en modules.
4. Extraction des données (case studies, traductions) vers des modules dédiés.
5. Vérification : validation statique des références, build Vite, comparaison
   visuelle avec le site en ligne sur les deux langues et les cinq gabarits.
