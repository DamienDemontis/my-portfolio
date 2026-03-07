# V2 Metal Portfolio Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the v2 metal portfolio with shader titles, improved hero, i18n, missing content, photography fixes, cat/fish counter, and Calendly widget.

**Architecture:** Component-based React 18 with WebGL2 shaders, i18next for translations, Lottie for animations. All new sections follow existing metal design system patterns. Shader titles use CSS background-clip:text over canvas elements.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, i18next, WebGL2 GLSL, lottie-web, Supabase (fish counter)

---

### Task 1: Add Metal Mania font and shader title CSS

**Files:**
- Modify: `src/v2/core/metal-theme.css`

**Step 1: Add Metal Mania to Google Fonts import and create shader title styles**

Update the `@import` line at top of `metal-theme.css` to add Metal Mania:
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Metal+Mania&family=Outfit:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
```

Add to `:root`:
```css
--font-metal: 'Metal Mania', 'Bebas Neue', Impact, cursive;
```

Add after `.font-body`:
```css
.font-metal { font-family: var(--font-metal); }
```

Add new class for shader title container:
```css
.metal-shader-title {
  position: relative;
  display: inline-block;
}

.metal-shader-title canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
  mix-blend-mode: normal;
}

.metal-shader-title-text {
  position: relative;
  z-index: 1;
  mix-blend-mode: multiply;
  color: white;
}

.metal-gallery-color-reveal {
  filter: grayscale(100%) brightness(0.7) contrast(1.1);
  transition: filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.metal-gallery-color-reveal:hover {
  filter: grayscale(0%) brightness(1) contrast(1);
}

.metal-gallery-lightbox-img {
  filter: grayscale(100%) brightness(0.85) contrast(1.1);
  animation: metal-color-wipe 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
}

@keyframes metal-color-wipe {
  0% {
    filter: grayscale(100%) brightness(0.85) contrast(1.1);
    clip-path: circle(0% at 50% 50%);
  }
  100% {
    filter: grayscale(0%) brightness(1) contrast(1);
    clip-path: circle(100% at 50% 50%);
  }
}

.metal-calendly-container {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--metal-surface);
}
```

**Step 2: Verify build**

Run: `npx vite build`
Expected: Clean build

**Step 3: Commit**
```bash
git add src/v2/core/metal-theme.css
git commit -m "feat(v2): add Metal Mania font and shader title CSS classes"
```

---

### Task 2: Create MetalShaderTitle component

**Files:**
- Create: `src/v2/components/MetalShaderTitle.tsx`

**Step 1: Create the component**

```tsx
import { useId, useMemo } from 'react';
import MetallicSurface from '../core/MetallicSurface';

interface MetalShaderTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  pattern?: 'edge' | 'noise' | 'radial' | 'wave' | 'diagonal';
}

const patterns = ['edge', 'noise', 'radial', 'wave', 'diagonal'] as const;

export default function MetalShaderTitle({
  children,
  as: Tag = 'h2',
  className = '',
  pattern,
}: MetalShaderTitleProps) {
  const id = useId();

  const shaderProps = useMemo(() => {
    const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pick = (arr: readonly string[]) => arr[seed % arr.length];
    const rand = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);

    return {
      pattern: (pattern || pick(patterns)) as any,
      speed: rand(0.03, 0.08),
      angle: rand(0, 360),
      noiseScale: rand(0.2, 0.6),
      waveAmplitude: rand(0.2, 0.6),
      chromaticSpread: rand(0.01, 0.04),
      brightness: rand(1.2, 1.6),
      contrast: rand(0.2, 0.5),
    };
  }, [id, pattern]);

  return (
    <span className="metal-shader-title">
      <MetallicSurface
        mode="procedural"
        pattern={shaderProps.pattern}
        speed={shaderProps.speed}
        brightness={shaderProps.brightness}
        contrast={shaderProps.contrast}
        scale={1.5}
        liquid={0.02}
        edgeFade={0}
        lightColor="#ffffff"
        darkColor="#111111"
        tintColor="#dddddd"
        noiseScale={shaderProps.noiseScale}
        waveAmplitude={shaderProps.waveAmplitude}
        chromaticSpread={shaderProps.chromaticSpread}
        angle={shaderProps.angle}
        style={{ width: '100%', height: '100%', borderRadius: 0 }}
      />
      <Tag className={`metal-shader-title-text font-metal ${className}`}>
        {children}
      </Tag>
    </span>
  );
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit && npx vite build`

**Step 3: Commit**
```bash
git add src/v2/components/MetalShaderTitle.tsx
git commit -m "feat(v2): create MetalShaderTitle component with randomized shader params"
```

---

### Task 3: Fix Hero shader to be non-repetitive + apply shader title

**Files:**
- Modify: `src/v2/sections/V2Hero.tsx`

**Step 1: Update hero**

Replace the MetallicSurface props with randomized values on mount, switch to pattern="wave", enable interactive mode. Replace the h1 text styling to use font-metal class. Add useMemo for randomized shader params.

Key changes:
- Import `useMemo` from react
- Add randomized shader params via `useMemo`:
```tsx
const shaderParams = useMemo(() => ({
  speed: 0.04 + Math.random() * 0.06,
  angle: Math.random() * 360,
  noiseScale: 0.2 + Math.random() * 0.4,
  waveAmplitude: 0.3 + Math.random() * 0.4,
  chromaticSpread: 0.02 + Math.random() * 0.03,
  distortion: 0.1 + Math.random() * 0.2,
}), []);
```
- Update MetallicSurface: `pattern="wave"`, `interactive={true}`, spread `shaderParams`
- Change h1 className to include `font-metal`
- Update both name divs to use `font-metal` with larger tracking

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Hero.tsx
git commit -m "feat(v2): randomize hero shader params and apply metal font"
```

---

### Task 4: Create i18n system for v2

**Files:**
- Create: `src/v2/i18n/config.ts`
- Create: `src/v2/i18n/locales/en.json`
- Create: `src/v2/i18n/locales/fr.json`
- Create: `src/v2/i18n/locales/ko.json`

**Step 1: Create i18n config**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';

const lazyLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  fr: () => import('./locales/fr.json'),
  ko: () => import('./locales/ko.json'),
};

const v2i18n = i18n.createInstance();

v2i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: enTranslations } },
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'v2-lang',
      convertDetectedLanguage: (lng: string) => lng.split('-')[0],
    },
    supportedLngs: ['en', 'fr', 'ko'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
  });

const loadLang = async (lng: string) => {
  if (lng === 'en' || v2i18n.hasResourceBundle(lng, 'translation')) return;
  const loader = lazyLoaders[lng];
  if (loader) {
    const mod = await loader();
    v2i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
  }
};

loadLang(v2i18n.language);
v2i18n.on('languageChanged', loadLang);

export default v2i18n;
```

**Step 2: Create en.json**

Port ALL content from v1's en.json, restructured for v2 sections. Include nav, hero, about, experience (all 7 positions with full details), skills (8 categories), projects (6 projects), education (3 schools), photography (26 photos), certifications (4 certs), interests (4 categories), languages (4 languages), contact, footer. Every hardcoded string in every v2 section file must have a translation key.

**Step 3: Create fr.json**

Port from v1's fr.json with same structure.

**Step 4: Create ko.json**

Port from v1's ko.json with same structure.

**Step 5: Verify build**

Run: `npx tsc --noEmit && npx vite build`

**Step 6: Commit**
```bash
git add src/v2/i18n/
git commit -m "feat(v2): add i18n system with EN/FR/KO translations"
```

---

### Task 5: Add language switcher to MetalNavbar

**Files:**
- Modify: `src/v2/components/MetalNavbar.tsx`

**Step 1: Add language switcher**

- Import `useTranslation` from `react-i18next`
- Add 3 language buttons (EN/FR/KR) to the right side of the navbar, before the mobile hamburger
- Use small flag-style buttons with 2-letter labels
- Active language gets `text-white`, others get `text-[#6b6b6b]`
- On click: `i18n.changeLanguage('en'|'fr'|'ko')`
- Also add to mobile menu

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/components/MetalNavbar.tsx
git commit -m "feat(v2): add language switcher to navbar"
```

---

### Task 6: Update V2Portfolio with i18n provider and new sections

**Files:**
- Modify: `src/v2/V2Portfolio.tsx`

**Step 1: Wrap with I18nextProvider, add new sections**

- Import `I18nextProvider` from `react-i18next`
- Import `v2i18n` from `./i18n/config`
- Import new sections: `V2Certifications`, `V2Languages`, `V2Interests`
- Wrap entire return in `<I18nextProvider i18n={v2i18n}>`
- Add sections between Education and Photography: Certifications, Languages, Interests
- Update navItems to include new sections with translated labels
- Update section numbers (Photography becomes 09, Contact becomes 10)

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/V2Portfolio.tsx
git commit -m "feat(v2): add i18n provider and new sections to portfolio"
```

---

### Task 7: Fix V2Photography — correct all photos and captions

**Files:**
- Modify: `src/v2/sections/V2Photography.tsx`

**Step 1: Replace photos array with all 26 photos from v1**

Use exact data from v1's PhotographyShowcase.tsx:
- All 26 photos with correct src, location (as alt), description (as caption)
- Add the 8 missing photos: IMG_20231107_164957, IMG_20240116_170340, IMG_20240419_184403, IMG_20240504_110833, IMG_20240504_114735, IMG_20240531_232815, IMG_20240626_184532, IMG_20240630_181716
- Fix captions to match v1 exactly (e.g., "Animal Rescue Coffee shop" not "Night scene")
- Replace hardcoded strings with `t()` calls

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Photography.tsx
git commit -m "fix(v2): correct all 26 photography entries with v1 captions"
```

---

### Task 8: Update MetalGallery with grayscale-to-color effect

**Files:**
- Modify: `src/v2/components/MetalGallery.tsx`

**Step 1: Add color reveal effects**

- Grid thumbnails: Replace inline `style={{ filter: 'grayscale(100%)...' }}` with className `metal-gallery-color-reveal` (CSS handles hover transition)
- Lightbox image: Replace inline `style={{ filter: 'grayscale(100%)...' }}` with className `metal-gallery-lightbox-img` (CSS handles radial wipe animation)
- Remove old inline filter styles from both img elements

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/components/MetalGallery.tsx
git commit -m "feat(v2): add grayscale-to-color reveal effect on photography"
```

---

### Task 9: Create V2Certifications section

**Files:**
- Create: `src/v2/sections/V2Certifications.tsx`

**Step 1: Create component**

4 IonisX certifications displayed as metal cards:
1. Agile Coaching (IonisX)
2. Team Management (IonisX)
3. Crisis Communication (IonisX)
4. IT Project Management (IonisX)

Each card shows: title, issuer, year, "Verified & Active" badge. Use MetalScrollReveal, MetalBadge, DecryptedText for section number, SpotlightCard for each cert. Use `t()` for all strings.

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Certifications.tsx
git commit -m "feat(v2): add Certifications section with 4 IonisX certs"
```

---

### Task 10: Create V2Languages section

**Files:**
- Create: `src/v2/sections/V2Languages.tsx`

**Step 1: Create component**

4 languages with proficiency visualization:
1. French - Native (100%)
2. English - C1/C2 Fluent (95%), TEPITECH 945/990
3. Italian - Conversational (60%), heritage
4. Korean - A2 Elementary (40%), study abroad

Use MetalSkillBar or MetalProgressRing for proficiency levels. MetalScrollReveal, DecryptedText for section number. Use `t()` for all strings.

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Languages.tsx
git commit -m "feat(v2): add Languages section with 4 languages"
```

---

### Task 11: Create V2Interests section

**Files:**
- Create: `src/v2/sections/V2Interests.tsx`

**Step 1: Create component**

4 interest categories displayed as a grid:
1. Musical Tastes: Japanese Pop, Electronic Music, Jazz, French Classics
2. Global Perspectives: Ecology, Geopolitics, Asian Culture
3. Tech Enthusiasm: Tech Innovation, AI/ML, Game Development
4. Personal Growth: Cultural Exchange, Continuous Learning, Community Building

Use MetalScrollReveal, MetalBadge for individual interests, DecryptedText for section number. Use `t()` for all strings.

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Interests.tsx
git commit -m "feat(v2): add Interests section with 4 categories"
```

---

### Task 12: Create MetalLottie and MetalFishCounter components

**Files:**
- Create: `src/v2/components/MetalLottie.tsx`
- Create: `src/v2/components/MetalFishCounter.tsx`

**Step 1: Create MetalLottie**

Port LottieAnimation from `src/components/LottieAnimation.tsx` — same logic, no style changes needed (it's just a container that loads lottie-web dynamically).

**Step 2: Create MetalFishCounter**

Port FishCounter from `src/components/FishCounter.tsx`. Restyle for metal theme:
- Replace orange/amber gradients with dark chrome styling
- Use `metal-chrome-text` for count display
- Replace colorful borders with `rgba(255,255,255,0.06)` borders
- Keep AnimatePresence floating fish animation
- Import `fishCounterRealtimeService` from `../../services/fishCounterRealtimeService`
- Remove `useTranslation` dependency (use hardcoded EN strings or v2 i18n)

**Step 3: Verify build**

Run: `npx tsc --noEmit`

**Step 4: Commit**
```bash
git add src/v2/components/MetalLottie.tsx src/v2/components/MetalFishCounter.tsx
git commit -m "feat(v2): add MetalLottie and MetalFishCounter components"
```

---

### Task 13: Update V2Contact with cat, fish counter, and Calendly

**Files:**
- Modify: `src/v2/sections/V2Contact.tsx`

**Step 1: Add cat + fish counter + Calendly**

- Import MetalLottie, MetalFishCounter
- Add Calendly type declaration (same as v1 Contact.tsx)
- Add `useEffect` to init Calendly widget
- After the form, add Calendly card:
  - Dark card with `metal-calendly-container` class
  - Title "Book a Meeting"
  - `<div className="calendly-inline-widget" style={{ minWidth: 320, height: 700 }} />`
- After contact info (left column), add cat section:
  - MetalLottie with `/JobNeko.json`
  - onClick triggers `window.__feedCat()`
  - MetalFishCounter below
- Replace hardcoded strings with `t()` calls

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Contact.tsx
git commit -m "feat(v2): add cat animation, fish counter, and Calendly widget"
```

---

### Task 14: Update V2About with missing content + i18n

**Files:**
- Modify: `src/v2/sections/V2About.tsx`

**Step 1: Add missing content**

- Add aspiration paragraph: "I'm actively seeking a full-time IT position from September 2025, aiming to merge technical expertise with my passion for Asian culture and technological innovations."
- Replace hardcoded strings with `t()` calls
- Import `useTranslation`

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2About.tsx
git commit -m "feat(v2): add missing about content and i18n"
```

---

### Task 15: Update V2Experience with full content + i18n

**Files:**
- Modify: `src/v2/sections/V2Experience.tsx`

**Step 1: Add full technology lists and company details**

- Expand technology arrays to match v1 (e.g., PandaLab: add Vuex, Vite, Security, Frontend Design, MCP)
- Add more achievements to match v1 detail level
- Replace hardcoded strings with `t()` calls
- Import `useTranslation`

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Experience.tsx
git commit -m "feat(v2): expand experience details and add i18n"
```

---

### Task 16: Update V2Skills with missing categories + i18n

**Files:**
- Modify: `src/v2/sections/V2Skills.tsx`

**Step 1: Add 4 missing skill categories**

Add to skillGroups array:
- Mobile Development: React Native (70), Flutter (45), Expo (65), Android (40)
- Testing & Quality: Jest (82), Cypress (70), Mocha (60), Unit/E2E Testing (80)
- AI/ML: TensorFlow (55), PyTorch (60), OpenCV (58), LLM Integration (72), RAG (68)
- Tools & Design: Git (92), Figma (60), Unity (55), Blender (35), Zapier (50)

Note: Data & AI category already exists, so merge AI/ML into it or keep separate. Currently 4 categories, need to reach ~8.

Replace "Also experienced with" text to not duplicate skills now shown.
Replace hardcoded strings with `t()` calls.

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Skills.tsx
git commit -m "feat(v2): add missing skill categories and i18n"
```

---

### Task 17: Update V2Projects with full content + i18n

**Files:**
- Modify: `src/v2/sections/V2Projects.tsx`

**Step 1: Expand project descriptions**

- MSC Decouverte: Add "Sold to EPITECH in 2025" and "800+ external resources"
- All projects: Ensure descriptions match v1 detail level
- Replace hardcoded strings with `t()` calls
- Import `useTranslation`

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Projects.tsx
git commit -m "feat(v2): expand project details and add i18n"
```

---

### Task 18: Update V2Education with full content + i18n

**Files:**
- Modify: `src/v2/sections/V2Education.tsx`

**Step 1: Add missing education details**

- EPITECH: Add "Campus Leader recognition", "Coding Club Member", full highlight list from v1
- Keimyung: Keep YouTube video link, add more details
- Henri Poincare: Add "physics fundamentals", "scientific methodology"
- Replace hardcoded strings with `t()` calls
- Import `useTranslation`

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Education.tsx
git commit -m "feat(v2): expand education details and add i18n"
```

---

### Task 19: Update V2Footer with cat reference + i18n

**Files:**
- Modify: `src/v2/sections/V2Footer.tsx`

**Step 1: Add i18n and update footer**

- Replace hardcoded strings with `t()` calls
- Import `useTranslation`
- Update copyright year dynamically

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**
```bash
git add src/v2/sections/V2Footer.tsx
git commit -m "feat(v2): add i18n to footer"
```

---

### Task 20: Apply MetalShaderTitle to all section headings

**Files:**
- Modify: All v2 section files (V2About, V2Experience, V2Skills, V2Projects, V2Education, V2Photography, V2Contact, V2Certifications, V2Languages, V2Interests)

**Step 1: Replace h2 headings with MetalShaderTitle**

In each section, replace:
```tsx
<h2 className="text-3xl md:text-5xl font-heading font-bold metal-chrome-text">Title</h2>
```
with:
```tsx
<MetalShaderTitle className="text-3xl md:text-5xl tracking-wide">{t('section.title')}</MetalShaderTitle>
```

Each section gets a different shader pattern for variety.

**Step 2: Verify build**

Run: `npx tsc --noEmit && npx vite build`

**Step 3: Commit**
```bash
git add src/v2/sections/
git commit -m "feat(v2): apply MetalShaderTitle to all section headings"
```

---

### Task 21: Final build verification

**Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 2: Vite build**

Run: `npx vite build`
Expected: Clean build

**Step 3: Final commit if needed**

Fix any remaining issues and commit.

---

## Parallelization Groups

Tasks that can be executed in parallel (no dependencies between them):

**Group A (foundations, sequential):** Task 1 → Task 2 → Task 4
**Group B (independent sections, parallel after Group A):**
- Task 7 + Task 8 (photography)
- Task 9 (certifications)
- Task 10 (languages)
- Task 11 (interests)
- Task 12 (lottie + fish counter)

**Group C (section updates, parallel after Task 4):**
- Task 14 (about)
- Task 15 (experience)
- Task 16 (skills)
- Task 17 (projects)
- Task 18 (education)
- Task 19 (footer)

**Group D (integration, after B + C):**
- Task 3 (hero shader)
- Task 5 (navbar language switcher)
- Task 6 (portfolio layout)
- Task 13 (contact with cat + calendly)
- Task 20 (shader titles on all sections)

**Group E (final):** Task 21
