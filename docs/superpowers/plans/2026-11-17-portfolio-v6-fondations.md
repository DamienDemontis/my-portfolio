# Portfolio v6 — Fondations (plan 1/3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer la reconstruction MACACO en une base neutre et
mesurable — trois langues, identité propre, contenu structuré, SEO et
mode lecture — sans toucher ni au personnage 3D ni aux huit scènes.

**Architecture:** Un manifeste de scènes (`src/content/scenes.js`) devient
la source unique du texte : les scènes, le `<noscript>`, le mode lecture
et le prérendu le consomment tous. La couleur d'accent passe d'une
constante de site à une fonction de la position de scroll. Tout ce qui
identifie MACACO est retiré et verrouillé par un test.

**Tech Stack:** Vite 6, React 18, i18next, Vitest + jsdom, `@tgwf/co2`

**Spec:** `docs/superpowers/specs/2026-11-17-portfolio-v6-design.md`

## Découpage en trois plans

Ce plan est le premier de trois. Les deux suivants ne peuvent pas être
écrits utilement aujourd'hui :

- **Plan 2 — Le personnage et le canvas persistant.** Dépend d'un asset
  qui n'existe pas encore. On ne planifie pas l'intégration d'un GLB dont
  on ignore la topologie, le squelette et le poids réel.
- **Plan 3 — Les huit scènes.** Dépend du texte. Planifier la mise en
  scène de 1 200 mots qui ne sont pas écrits produirait des tâches à
  réécrire.

Ce plan-ci ne dépend d'aucun des deux. Il livre un site qui tourne, en
trois langues, référencé et mesuré, prêt à recevoir le personnage et les
scènes.

## Global Constraints

- **Aucune formule de recherche d'emploi** nulle part : ni « disponible »,
  ni « ouvert aux opportunités », ni « recherche », ni « available »,
  ni « open to work », ni « hiring ». Verrouillé par un test.
- **Rien ne doit identifier MACACO** : ni `#feff00` / `#FEFF00`, ni
  `Syncopate`, ni `iubenda`, ni la chaîne `MACACO`, ni les rayures
  jaune/noir. Verrouillé par un test.
- **150 mots par scène**, tolérance 120 à 180. Verrouillé par un test.
- **Langues : `fr`, `en`, `ko`.** `en` est la langue par défaut et de
  repli — les postes visés sont majoritairement anglophones.
  *Mon choix, à corriger si tu préfères `fr` par défaut.*
- **Déploiement : la racine Vercel pointera sur `macaco/`.** Pas de
  déplacement de fichiers, pas de réécriture d'historique. `vercel.json`
  vit donc dans `macaco/`.
- Les deux CV PDF restent servis mais sortent du sitemap et ne sont liés
  de nulle part.
- `/games/wii-tanks/` continue de répondre.

## Review Focus

Classes d'entrées que le spec implique sans qu'aucune tâche ne les
exerce naturellement. Chaque ligne a son test, rattaché à la tâche qui
possède le code.

1. **Navigateur dans une langue non gérée** (japonais, allemand) : doit
   arriver sur `/en`, pas sur une page vide ni sur `/fr`. → Tâche 1.
2. **URL de langue inconnue** (`/de/`, `/it/`) : doit rediriger vers
   `/en`, pas rendre une coquille blanche. → Tâche 1.
3. **JavaScript désactivé ou robot sans exécution** : le `<noscript>`
   doit contenir le texte complet des huit scènes, pas un message
   d'erreur. → Tâche 6.
4. **`prefers-reduced-motion: reduce`** : le site reste lisible et
   navigable, le mode lecture reste atteignable. → Tâche 5.
5. **Ancienne URL indexée `?lng=ko`** : doit rediriger en 301 vers
   `/ko`, pas répondre 404. → Tâche 8.

---

### Task 1: Passage en FR/EN/KO

**Files:**
- Create: `macaco/vitest.config.js`
- Create: `macaco/tests/i18n.test.js`
- Create: `macaco/src/i18n/locales/fr.json`, `macaco/src/i18n/locales/ko.json`
- Modify: `macaco/src/i18n/index.js`
- Modify: `macaco/package.json` (scripts `test`, devDeps `vitest@^2.1.8`, `jsdom@^25.0.1`, `@testing-library/react@^16.1.0`)
- Delete: `macaco/src/i18n/locales/it.json`

**Interfaces:**
- Consumes: rien.
- Produces: `LANGUAGES: readonly ["fr","en","ko"]`, `DEFAULT_LANGUAGE: "en"`,
  `isSupportedLanguage(code: string): boolean`,
  `detectBrowserLanguage(): "fr"|"en"|"ko"`.

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/i18n.test.js
import { LANGUAGES, DEFAULT_LANGUAGE, isSupportedLanguage, detectBrowserLanguage } from '../src/i18n/index.js'

test('les trois langues du site', () => {
  expect(LANGUAGES).toEqual(['fr', 'en', 'ko'])
  expect(DEFAULT_LANGUAGE).toBe('en')
  expect(isSupportedLanguage('it')).toBe(false)
})

test('un navigateur francais arrive en francais', () => {
  vi.stubGlobal('navigator', { languages: ['fr-FR', 'en'] })
  expect(detectBrowserLanguage()).toBe('fr')
})

test('un navigateur coreen arrive en coreen', () => {
  vi.stubGlobal('navigator', { languages: ['ko-KR'] })
  expect(detectBrowserLanguage()).toBe('ko')
})

// Review Focus 1
test('un navigateur japonais tombe sur la langue par defaut', () => {
  vi.stubGlobal('navigator', { languages: ['ja-JP', 'de'] })
  expect(detectBrowserLanguage()).toBe('en')
})

// Review Focus 2
test('un code de langue inconnu n est pas supporte', () => {
  expect(isSupportedLanguage('de')).toBe(false)
  expect(isSupportedLanguage('')).toBe(false)
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- i18n`
Attendu : ÉCHEC, `LANGUAGES` vaut `['it','en']`.

- [ ] **Step 3: Implémenter**

Dans `macaco/src/i18n/index.js` : remplacer `LANGUAGES`, `DEFAULT_LANGUAGE`
et `FALLBACK_LANGUAGE` par les valeurs ci-dessus, et `detectBrowserLanguage`
par une correspondance sur le préfixe à deux lettres (`fr` → `fr`,
`ko` → `ko`, sinon `DEFAULT_LANGUAGE`). Remplacer l'import `itCommon` par
`frCommon` et `koCommon`, et les clés de `resources` en conséquence.

`fr.json` et `ko.json` reprennent la structure exacte de `en.json` (mêmes
clés, aux huit namespaces près qui arrivent en tâche 4). Le coréen reste
en attente de la réponse de Damien sur la provenance du `ko.json` de v5 :
en attendant, dupliquer l'anglais et marquer chaque valeur d'un préfixe
`[KO]` pour que le test de tâche 4 le repère.

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

Run : `npm --prefix macaco test -- i18n` → PASS

- [ ] **Step 5: Vérifier que le site démarre toujours**

Run : `npm --prefix macaco run build`
Attendu : build réussi, aucune référence à `it.json`.

- [ ] **Step 6: Commit**

```bash
git add macaco/vitest.config.js macaco/tests/i18n.test.js macaco/src/i18n macaco/package.json
git commit -m "Switch the site to fr/en/ko"
```

---

### Task 2: La rampe d'oxydation

Remplace l'accent unique par une fonction de la position de scroll.

**Files:**
- Create: `macaco/src/lib/ramp.js`
- Create: `macaco/tests/ramp.test.js`
- Create: `macaco/src/styles/tokens.css`
- Create: `macaco/public/fonts/redaction-*.woff2`, `macaco/public/fonts/martian-mono-*.woff2`
- Modify: `macaco/src/styles/index.css` (importer `tokens.css`, remplacer les `@font-face` Syncopate)
- Modify: `macaco/index.html` (préchargement des deux polices)

**Interfaces:**
- Consumes: rien.
- Produces: `OXIDATION_RAMP: { stop: number, hex: string, name: string }[]`
  (8 arrêts, `stop` croissant de 0 à 1),
  `accentForProgress(p: number): string` (hex, interpolation linéaire en
  sRGB entre les deux arrêts encadrants, bornée hors de [0,1]).

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/ramp.test.js
import { OXIDATION_RAMP, accentForProgress } from '../src/lib/ramp.js'

test('la rampe va du chrome a la mousse', () => {
  expect(OXIDATION_RAMP).toHaveLength(8)
  expect(OXIDATION_RAMP[0].hex).toBe('#D6D9DC')
  expect(OXIDATION_RAMP.at(-1).hex).toBe('#3A4A3C')
  expect(OXIDATION_RAMP.map(s => s.stop)).toEqual([...OXIDATION_RAMP.map(s => s.stop)].sort((a, b) => a - b))
})

test('les bornes rendent les couleurs extremes', () => {
  expect(accentForProgress(0)).toBe('#D6D9DC')
  expect(accentForProgress(1)).toBe('#3A4A3C')
})

test('hors bornes, on borne au lieu de casser', () => {
  expect(accentForProgress(-3)).toBe('#D6D9DC')
  expect(accentForProgress(42)).toBe('#3A4A3C')
  expect(accentForProgress(NaN)).toBe('#D6D9DC')
})

test('le milieu interpole entre deux arrets', () => {
  const mid = accentForProgress(0.5)
  expect(mid).toMatch(/^#[0-9A-F]{6}$/)
  expect(OXIDATION_RAMP.map(s => s.hex)).not.toContain(mid)
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- ramp`
Attendu : ÉCHEC, module introuvable.

- [ ] **Step 3: Implémenter `OXIDATION_RAMP` et `accentForProgress`**

Les huit arrêts, dans l'ordre, avec les valeurs du spec : chrome `#D6D9DC`,
acier `#8A8F98`, cuivre `#B87333`, rouille `#8C3A1E`, verdigris `#2F6E63`,
mousse `#3A4A3C` — répartis sur huit arrêts en insérant deux
intermédiaires entre acier et cuivre, et entre rouille et verdigris.

- [ ] **Step 4: Auto-héberger les deux polices**

Redaction se télécharge depuis `https://www.redaction.us` (gratuite,
plusieurs degrés de dégradation — prendre Redaction 20 et Redaction 70,
le choix du degré par scène appartient au plan 3). Martian Mono vient de
Google Fonts en 400 et 700. Convertir en `woff2`, sous-régler au latin
plus le hangul pour Martian Mono, déposer dans `public/fonts/`.

Vérifier la licence de Redaction avant de commiter les fichiers : si elle
interdit la redistribution, basculer sur Cinzel (OFL), repli nommé dans
le spec.

- [ ] **Step 5: Écrire `tokens.css`**

Les mêmes valeurs en variables CSS sur `:root` (`--chrome`, `--acier`,
`--cuivre`, `--rouille`, `--verdigris`, `--mousse`, `--fond: #0A0B0C`,
`--os: #E6E1D8`), plus `--font-display: 'Redaction'` et
`--font-body: 'Martian Mono'`, et les `@font-face` correspondants en
`font-display: swap`. Importer depuis `index.css`.

- [ ] **Step 6: Lancer les tests et le build**

Run : `npm --prefix macaco test -- ramp` → PASS
Run : `npm --prefix macaco run build` → réussi

- [ ] **Step 7: Commit**

```bash
git add macaco/src/lib/ramp.js macaco/tests/ramp.test.js macaco/src/styles macaco/public/fonts macaco/index.html
git commit -m "Replace the single accent with a scroll-driven oxidation ramp"
```

---

### Task 3: Retrait de l'identité MACACO

**Files:**
- Create: `macaco/tests/identity.test.js`
- Modify: `macaco/index.html` (retirer les blocs iubenda, le manifest, le titre)
- Modify: `macaco/src/styles/*.css` (retirer le jaune et Syncopate)
- Modify: `macaco/src/components/intro/Intro.jsx`, `macaco/src/components/ScrollProgress.jsx`, `macaco/src/pages/Home.jsx` (retirer les rayures de danger)
- Delete: `macaco/src/content/caseHistories.js`, `macaco/src/pages/Projects.jsx`, `macaco/src/pages/ProjectDetail.jsx`, `macaco/src/pages/Laboratory.jsx`, `macaco/src/components/case-detail/`, `macaco/public/general/`, `macaco/public/llms.txt`, `macaco/public/site.webmanifest`
- Modify: `macaco/src/App.jsx` (retirer les routes supprimées)

**Interfaces:**
- Consumes: rien.
- Produces: rien. Tâche de suppression.

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/identity.test.js
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const INTERDIT = [/#fe{2}00/i, /Syncopate/, /iubenda/i, /MACACO/, /hazard/i]

function fichiers(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) fichiers(p, acc)
    else if (/\.(jsx?|css|html|json)$/.test(e)) acc.push(p)
  }
  return acc
}

test('plus rien n identifie MACACO', () => {
  const coupables = []
  for (const f of [...fichiers('macaco/src'), 'macaco/index.html']) {
    const texte = readFileSync(f, 'utf8')
    for (const motif of INTERDIT) if (motif.test(texte)) coupables.push(`${f} :: ${motif}`)
  }
  expect(coupables).toEqual([])
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- identity`
Attendu : ÉCHEC, une longue liste de coupables.

- [ ] **Step 3: Supprimer**

Retirer les fichiers listés, les routes correspondantes dans `App.jsx`,
les blocs iubenda de `index.html`, et remplacer chaque occurrence de
`#feff00` par `var(--cuivre)`. Les classes `.intro-hazard*` et leurs
styles partent entièrement : la scène 1 sera redessinée au plan 3.

- [ ] **Step 4: Lancer le test et le build**

Run : `npm --prefix macaco test -- identity` → PASS
Run : `npm --prefix macaco run build` → réussi

- [ ] **Step 5: Commit**

```bash
git add -A macaco
git commit -m "Strip every MACACO identity marker"
```

---

### Task 4: Le manifeste des scènes

La source unique du texte. Consommée ensuite par les scènes, le
`<noscript>`, le mode lecture et le prérendu.

**Files:**
- Create: `macaco/src/content/scenes.js`
- Create: `macaco/tests/scenes.test.js`
- Modify: `macaco/src/i18n/locales/{fr,en,ko}.json` (namespace `scenes`)

**Interfaces:**
- Consumes: rien. `progress` est un nombre ; la couleur est dérivée à
  l'affichage par `accentForProgress` (tâche 2).
- Produces: `SCENES: { id: string, progress: number, titleKey: string, bodyKey: string }[]`
  — 8 entrées, `id` unique, `progress` croissant de 0 à 1 ;
  `sceneText(scene, t): { title: string, body: string }`.

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/scenes.test.js
import { SCENES } from '../src/content/scenes.js'
import fr from '../src/i18n/locales/fr.json'
import en from '../src/i18n/locales/en.json'
import ko from '../src/i18n/locales/ko.json'

const LOCALES = { fr, en, ko }

test('huit scenes, identifiants uniques, progression croissante', () => {
  expect(SCENES).toHaveLength(8)
  expect(new Set(SCENES.map(s => s.id)).size).toBe(8)
  expect(SCENES.map(s => s.progress)).toEqual([...SCENES.map(s => s.progress)].sort((a, b) => a - b))
  expect(SCENES.map(s => s.id)).toEqual([
    'ouverture', 'metier', 'construire', 'musique', 'coree', 'vivant', 'transmission', 'sortie',
  ])
})

test.each(Object.entries(LOCALES))('%s : chaque scene a son titre et son corps', (nom, locale) => {
  for (const s of SCENES) {
    expect(locale.scenes?.[s.id]?.title, `${nom}/${s.id}/title`).toBeTruthy()
    expect(locale.scenes?.[s.id]?.body, `${nom}/${s.id}/body`).toBeTruthy()
  }
})

test.each(Object.entries(LOCALES))('%s : le budget de 150 mots est tenu', (nom, locale) => {
  for (const s of SCENES) {
    const mots = locale.scenes[s.id].body.trim().split(/\s+/).length
    expect(mots, `${nom}/${s.id} : ${mots} mots`).toBeGreaterThanOrEqual(120)
    expect(mots, `${nom}/${s.id} : ${mots} mots`).toBeLessThanOrEqual(180)
  }
})

test('le coreen n est plus un doublon de l anglais', () => {
  for (const s of SCENES) expect(ko.scenes[s.id].body.startsWith('[KO]')).toBe(false)
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- scenes`
Attendu : ÉCHEC, module introuvable.

- [ ] **Step 3: Implémenter `SCENES` et remplir les locales**

Les huit identifiants ci-dessus, dans cet ordre, `progress` réparti de 0
à 1. Le texte de remplissage respecte le budget de mots — c'est ce qui
permet de caler la typographie avant que Damien n'écrive. Le dernier test
(`[KO]`) reste rouge jusqu'à ce que le coréen soit produit : le laisser
échouer est le signal.

- [ ] **Step 4: Lancer les tests**

Run : `npm --prefix macaco test -- scenes`
Attendu : tout PASS sauf le test coréen, rouge tant que le `ko.json` n'est
pas tranché.

- [ ] **Step 5: Commit**

```bash
git add macaco/src/content/scenes.js macaco/tests/scenes.test.js macaco/src/i18n/locales
git commit -m "Add the scene manifest as the single source of copy"
```

---

### Task 5: Le mode lecture

**Files:**
- Create: `macaco/src/components/ReadingMode.jsx`
- Create: `macaco/tests/reading-mode.test.jsx`
- Modify: `macaco/src/App.jsx` (bouton de bascule, état dans l'URL `?lecture=1`)

**Interfaces:**
- Consumes: `SCENES`, `sceneText` (tâche 4).
- Produces: `<ReadingMode lang={string} />` — rend un `<article>` avec un
  `<h2>` et un `<p>` par scène, dans l'ordre de `SCENES`.

- [ ] **Step 1: Écrire le test qui échoue**

```jsx
// macaco/tests/reading-mode.test.jsx
import { render, screen } from '@testing-library/react'
import { ReadingMode } from '../src/components/ReadingMode.jsx'
import { SCENES } from '../src/content/scenes.js'

test('les huit scenes sont rendues dans l ordre', () => {
  render(<ReadingMode lang="fr" />)
  const titres = screen.getAllByRole('heading', { level: 2 })
  expect(titres).toHaveLength(8)
  expect(titres[0].textContent).toBeTruthy()
})

test('la scene coreenne porte son attribut lang', () => {
  const { container } = render(<ReadingMode lang="fr" />)
  const coree = container.querySelector('[data-scene="coree"]')
  expect(coree.getAttribute('lang')).toBe('ko')
})

// Review Focus 4
test('le mode lecture ne depend d aucune animation', () => {
  const { container } = render(<ReadingMode lang="fr" />)
  expect(container.querySelector('canvas')).toBeNull()
  expect(container.textContent.split(/\s+/).length).toBeGreaterThan(900)
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- reading-mode` → ÉCHEC

- [ ] **Step 3: Implémenter `ReadingMode`**

Un `<article>` par scène, `data-scene` à l'identifiant, `lang="ko"` sur la
scène `coree` uniquement (décision du spec : la typographie et les titres
basculent, le corps reste dans la langue active — donc `lang` sur le
conteneur et `lang` de la langue active sur le `<p>` du corps).

- [ ] **Step 4: Lancer le test** → PASS

- [ ] **Step 5: Commit**

```bash
git add macaco/src/components/ReadingMode.jsx macaco/tests/reading-mode.test.jsx macaco/src/App.jsx
git commit -m "Add reading mode built from the scene manifest"
```

---

### Task 6: Prérendu et `<noscript>`

**Files:**
- Create: `macaco/scripts/prerender.mjs`
- Create: `macaco/tests/prerender.test.js`
- Modify: `macaco/package.json` (`"build": "vite build && node scripts/prerender.mjs"`)
- Modify: `macaco/src/seo/Seo.jsx` (JSON-LD `Person`, `hreflang` fr/en/ko)

**Interfaces:**
- Consumes: `SCENES`, les locales (tâche 4).
- Produces: `prerender(outDir: string): Promise<string[]>` — écrit
  `<outDir>/{fr,en,ko}/index.html` et renvoie les chemins écrits.

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/prerender.test.js
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { prerender } from '../scripts/prerender.mjs'
import { SCENES } from '../src/content/scenes.js'
import fr from '../src/i18n/locales/fr.json'

const INTERDIT = /disponible|ouvert aux opportunit|recherche un poste|available for|open to work|hiring|seeking/i

test('trois pages de langue sont ecrites', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pre-'))
  const ecrits = await prerender(dir)
  expect(ecrits).toHaveLength(3)
})

// Review Focus 3
test('le noscript contient le texte complet des huit scenes', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pre-'))
  await prerender(dir)
  const html = readFileSync(join(dir, 'fr', 'index.html'), 'utf8')
  const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1]
  for (const s of SCENES) expect(noscript).toContain(fr.scenes[s.id].title)
})

test('les trois hreflang et le JSON-LD Person sont presents', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pre-'))
  await prerender(dir)
  const html = readFileSync(join(dir, 'en', 'index.html'), 'utf8')
  for (const l of ['fr', 'en', 'ko']) expect(html).toContain(`hreflang="${l}"`)
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  expect(ld['@type']).toBe('Person')
  expect(ld.name).toBe('Damien Demontis')
  expect(ld.knowsAbout).toContain('WebGL')
})

test('aucune formule de recherche d emploi', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pre-'))
  await prerender(dir)
  for (const l of ['fr', 'en', 'ko']) {
    expect(readFileSync(join(dir, l, 'index.html'), 'utf8')).not.toMatch(INTERDIT)
  }
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- prerender` → ÉCHEC

- [ ] **Step 3: Implémenter `prerender(outDir)`**

Lit `dist/index.html`, et pour chaque langue : remplace `<title>` et la
meta description, injecte les trois `<link rel="alternate" hreflang>`,
le JSON-LD `Person` (`name`, `url`, `sameAs` GitHub/LinkedIn,
`knowsAbout` incluant `WebGL`, `alumniOf`, `worksFor`), et un `<noscript>`
contenant titre et corps des huit scènes dans la langue. Aucune propriété
qui signale une recherche de poste.

- [ ] **Step 4: Lancer le test et le build complet**

Run : `npm --prefix macaco test -- prerender` → PASS
Run : `npm --prefix macaco run build` → `dist/{fr,en,ko}/index.html` existent

- [ ] **Step 5: Commit**

```bash
git add macaco/scripts/prerender.mjs macaco/tests/prerender.test.js macaco/package.json macaco/src/seo/Seo.jsx
git commit -m "Prerender one indexable page per language"
```

---

### Task 7: Le compteur carbone

**Files:**
- Create: `macaco/src/lib/carbon.js`
- Create: `macaco/tests/carbon.test.js`
- Modify: `macaco/package.json` (dep `@tgwf/co2@^0.16.4`)

**Interfaces:**
- Consumes: rien.
- Produces: `gramsForBytes(bytes: number, opts?: { green?: boolean }): number`,
  `measureTransfer(): { firstPaint: number, full: number }` — octets
  transférés, lus via `performance.getEntriesByType('resource')`,
  `firstPaint` excluant les ressources de type `fetch` postérieures au LCP
  et les `.glb`.

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/carbon.test.js
import { gramsForBytes, measureTransfer } from '../src/lib/carbon.js'

test('zero octet, zero gramme', () => {
  expect(gramsForBytes(0)).toBe(0)
})

test('plus d octets, plus de grammes', () => {
  expect(gramsForBytes(2_000_000)).toBeGreaterThan(gramsForBytes(1_000_000))
})

test('l hebergement vert pese moins', () => {
  expect(gramsForBytes(1_000_000, { green: true })).toBeLessThan(gramsForBytes(1_000_000))
})

test('une entree absurde ne casse pas l affichage', () => {
  expect(gramsForBytes(-1)).toBe(0)
  expect(gramsForBytes(NaN)).toBe(0)
})

test('la mesure separe le premier affichage de l experience complete', () => {
  vi.stubGlobal('performance', {
    getEntriesByType: () => [
      { name: '/a.js', transferSize: 100_000, initiatorType: 'script' },
      { name: '/perso.glb', transferSize: 1_400_000, initiatorType: 'fetch' },
    ],
  })
  const { firstPaint, full } = measureTransfer()
  expect(firstPaint).toBe(100_000)
  expect(full).toBe(1_500_000)
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- carbon` → ÉCHEC

- [ ] **Step 3: Implémenter**

`gramsForBytes` délègue au modèle `swd` v4 de `@tgwf/co2` — on ne
réinvente pas les constantes, et le chiffre est défendable devant un
lecteur technique. Bornes à zéro pour les entrées négatives ou `NaN`.

- [ ] **Step 4: Lancer le test** → PASS

- [ ] **Step 5: Commit**

```bash
git add macaco/src/lib/carbon.js macaco/tests/carbon.test.js macaco/package.json
git commit -m "Add the two-number carbon measurement"
```

L'affichage dans la scène 6 appartient au plan 3. Ici on livre la mesure,
testée.

---

### Task 8: Redirections, sitemap, Wii Tanks

**Files:**
- Create: `macaco/vercel.json`
- Create: `macaco/tests/routing.test.js`
- Modify: `macaco/scripts/prerender.mjs` (génération du `sitemap.xml`)

**Interfaces:**
- Consumes: `prerender` (tâche 6), `LANGUAGES` (tâche 1).
- Produces: `buildSitemap(origin: string): string` exporté depuis
  `scripts/prerender.mjs`.

- [ ] **Step 1: Écrire le test qui échoue**

```js
// macaco/tests/routing.test.js
import { readFileSync } from 'node:fs'
import { buildSitemap } from '../scripts/prerender.mjs'

const vercel = JSON.parse(readFileSync('macaco/vercel.json', 'utf8'))

// Review Focus 5
test('les anciennes URL de langue redirigent en 301', () => {
  const cibles = Object.fromEntries(vercel.redirects.map(r => [r.source, r]))
  for (const l of ['fr', 'ko']) {
    const r = vercel.redirects.find(x => x.source.includes(`lng=${l}`) || x.has?.some(h => h.value === l))
    expect(r, `redirection manquante pour lng=${l}`).toBeTruthy()
    expect(r.permanent).toBe(true)
  }
})

// Review Focus 2
test('une langue inconnue retombe sur en', () => {
  const r = vercel.redirects.find(x => x.destination === '/en')
  expect(r).toBeTruthy()
})

test('le jeu reste servi', () => {
  const casse = vercel.redirects.find(r => r.source.startsWith('/games'))
  expect(casse).toBeUndefined()
})

test('le sitemap liste trois URL et aucun PDF', () => {
  const xml = buildSitemap('https://demontis.dev')
  expect(xml.match(/<loc>/g)).toHaveLength(3)
  expect(xml).not.toMatch(/\.pdf/)
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run : `npm --prefix macaco test -- routing` → ÉCHEC, `vercel.json` absent.

- [ ] **Step 3: Écrire `vercel.json` et `buildSitemap`**

Redirections permanentes `/?lng=fr` → `/fr`, `/?lng=ko` → `/ko`,
`/?lng=en` → `/en`, et toute langue non gérée → `/en`. Aucune règle ne
touche `/games/`. `buildSitemap` ne liste que les trois pages de langue.

- [ ] **Step 4: Lancer le test et le build** → PASS

- [ ] **Step 5: Commit**

```bash
git add macaco/vercel.json macaco/tests/routing.test.js macaco/scripts/prerender.mjs
git commit -m "Add language redirects and a sitemap without the CV PDFs"
```

---

## Ce que ce plan ne fait pas

- Le personnage 3D et le canvas persistant : plan 2.
- La mise en scène des huit scènes et le texte définitif : plan 3.
- L'affichage du compteur carbone : plan 3 (la mesure est ici).
- La bascule Vercel vers `macaco/` : au moment de la mise en ligne.
