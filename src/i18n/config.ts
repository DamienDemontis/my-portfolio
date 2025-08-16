import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import frTranslations from './locales/fr.json'
import koTranslations from './locales/ko.json'

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  },
  ko: {
    translation: koTranslations
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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

export default i18n 