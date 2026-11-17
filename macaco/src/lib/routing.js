// Langue inconnue dans l'URL : renvoie le chemin corrige vers /en, ou null.
import { isSupportedLanguage } from '../i18n/languages.js'

export function resolveLanguagePath(pathname) {
  const m = /^\/([A-Za-z]{2})(?=\/|$)/.exec(pathname)
  if (!m || isSupportedLanguage(m[1].toLowerCase())) return null
  return '/en' + pathname.slice(3)
}
