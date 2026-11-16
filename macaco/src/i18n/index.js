// Langues supportees, detection depuis l'URL ou le navigateur, init i18next.
import enCommon from "./locales/en.json";
import itCommon from "./locales/it.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
const LANGUAGES = ["it", "en"];
const DEFAULT_LANGUAGE = "it";
const FALLBACK_LANGUAGE = "en";
function isSupportedLanguage(e) {
  return LANGUAGES.includes(e);
}
function detectBrowserLanguage() {
  var e;
  return typeof navigator < "u" && ((e = navigator.languages) != null && e.length ? navigator.languages : [navigator.language]).some(o => (o || "").slice(0, 2).toLowerCase() === "it") ? "it" : FALLBACK_LANGUAGE;
}
const oa = {
  en: {
    common: enCommon
  },
  it: {
    common: itCommon
  }
};
const St = typeof window < "u" ? window.location.pathname.split("/")[1] : "";
const ra = isSupportedLanguage(St) ? St : detectBrowserLanguage();
i18next.use(initReactI18next).init({
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
