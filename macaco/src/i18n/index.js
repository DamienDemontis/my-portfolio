// Langues supportees, detection depuis l'URL ou le navigateur, init i18next.
import enCommon from "./locales/en.json";
import frCommon from "./locales/fr.json";
import koCommon from "./locales/ko.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
const LANGUAGES = ["fr", "en", "ko"];
const DEFAULT_LANGUAGE = "en";
function isSupportedLanguage(e) {
  return LANGUAGES.includes(e);
}
// Premiere langue du navigateur dont le prefixe a deux lettres est supporte.
function detectBrowserLanguage() {
  if (typeof navigator > "u") return DEFAULT_LANGUAGE;
  const e = navigator.languages != null && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const o of e) {
    const t = (o || "").slice(0, 2).toLowerCase();
    if (isSupportedLanguage(t)) return t;
  }
  return DEFAULT_LANGUAGE;
}
const oa = {
  en: {
    common: enCommon
  },
  fr: {
    common: frCommon
  },
  ko: {
    common: koCommon
  }
};
const St = typeof window < "u" ? window.location.pathname.split("/")[1] : "";
const ra = isSupportedLanguage(St) ? St : detectBrowserLanguage();
i18next.use(initReactI18next).init({
  initAsync: !1,
  resources: oa,
  lng: ra,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: LANGUAGES,
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: !1
  },
  react: {
    useSuspense: !1
  }
});
export { DEFAULT_LANGUAGE, LANGUAGES, detectBrowserLanguage, isSupportedLanguage };
