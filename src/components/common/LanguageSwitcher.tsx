import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const currentLanguage = i18n.language
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLanguage)
  }

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'en' ? 'FR' : 'EN'
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={t('language.toggle')}
      title={t('language.toggle')}
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">
        {getCurrentLanguageLabel()}
      </span>
    </button>
  )
} 