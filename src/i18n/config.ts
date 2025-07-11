import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en/translation.json';
import fr from './fr/translation.json';

export const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    resources,
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n; 