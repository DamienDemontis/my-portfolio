// Liste des langues du site : pure (aucune dependance), partagee par le
// runtime, le routeur, le SEO et le prerendu Node.
export const LANGUAGES = ['fr', 'en', 'ko']
export const DEFAULT_LANGUAGE = 'en'

export function isSupportedLanguage(l) {
  return LANGUAGES.includes(l)
}
