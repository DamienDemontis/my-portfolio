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
