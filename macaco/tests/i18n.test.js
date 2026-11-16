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
