import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Only eagerly load English (fallback). French & Korean are lazy-loaded on demand.
import enTranslations from './locales/en.json'

const lazyLanguageLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  fr: () => import('./locales/fr.json'),
  ko: () => import('./locales/ko.json'),
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations }
    },
    fallbackLng: 'en',
    debug: false,

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      // Convert language codes to base language (fr-FR -> fr)
      convertDetectedLanguage: (lng: string) => lng.split('-')[0]
    },

    // Supported languages
    supportedLngs: ['en', 'fr', 'ko'],
    // Don't use country-specific variants
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false
    }
  })

// Lazy-load non-English languages when requested
const loadLanguageIfNeeded = async (lng: string) => {
  if (lng === 'en' || i18n.hasResourceBundle(lng, 'translation')) return
  const loader = lazyLanguageLoaders[lng]
  if (loader) {
    const module = await loader()
    i18n.addResourceBundle(lng, 'translation', module.default, true, true)
  }
}

// Load the detected language on startup (if not English)
loadLanguageIfNeeded(i18n.language)

// Load language bundles on language change
i18n.on('languageChanged', loadLanguageIfNeeded)

export default i18n 