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

// F11 : une seule liste de langues, pure (sans init d'i18next).
test('languages.js est la source unique', async () => {
  const pure = await import('../src/i18n/languages.js')
  const idx = await import('../src/i18n/index.js')
  expect(pure.LANGUAGES).toBe(idx.LANGUAGES)
  expect(pure.DEFAULT_LANGUAGE).toBe(idx.DEFAULT_LANGUAGE)
  expect(pure.isSupportedLanguage).toBe(idx.isSupportedLanguage)
  const meta = await import('../src/seo/meta.js')
  expect(meta.SEO_LANGUAGES).toBeUndefined()
  expect(meta.hreflangs().map(h => h.hreflang)).toEqual([...pure.LANGUAGES, 'x-default'])
})

// F10 : plus de coreen automatique non marque, plus d'anglais dans fr.json.
test('ko.json : le coreen non relu est marque [KO]', async () => {
  const ko = (await import('../src/i18n/locales/ko.json')).default
  const texte = JSON.stringify(ko)
  const cles = []
  const walk = (o, p) => { for (const [k, v] of Object.entries(o)) typeof v === 'string' ? (/[가-힣]/.test(v) && cles.push(p + k)) : walk(v, p + k + '.') }
  walk(ko, '')
  // seuls la scene coreenne (titres de reference) et home.projects (coreen fourni et relu) peuvent contenir du hangul.
  expect(cles.filter(k => !k.startsWith('scenes.coree') && !k.startsWith('home.projects.'))).toEqual([])
  expect(texte).not.toMatch(/\{포트폴리오\}/)
})

test('fr.json : libelles d interface en francais', async () => {
  const fr = (await import('../src/i18n/locales/fr.json')).default
  expect(fr.nav.home).toBe('Accueil')
  expect(fr.intro.scroll).toBe('Défiler pour explorer')
})
