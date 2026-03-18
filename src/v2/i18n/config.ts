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

// Preload the initially-detected language bundle before anything renders
loadLang(v2i18n.language);

// Wrap changeLanguage so the bundle is loaded BEFORE the switch happens
const originalChangeLanguage = v2i18n.changeLanguage.bind(v2i18n);
v2i18n.changeLanguage = async (lng?: string, callback?: Parameters<typeof originalChangeLanguage>[1]) => {
  if (lng) await loadLang(lng);
  return originalChangeLanguage(lng, callback);
};

export default v2i18n;
