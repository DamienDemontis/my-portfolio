import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, ChevronDown } from 'lucide-react'
import { FlagIcon } from './FlagIcon'

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('')

  // Sync with i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng.split('-')[0])
    }
    
    // Set initial language
    setCurrentLang(i18n.language.split('-')[0])
    
    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChanged)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  const languages = [
    { code: 'en', label: 'EN', countryCode: 'gb', name: 'English' },
    { code: 'fr', label: 'FR', countryCode: 'fr', name: 'Français' },
    { code: 'ko', label: 'KO', countryCode: 'kr', name: '한국어' }
  ]

  // Use the state-managed current language for better sync
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-0 sm:gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-w-[36px] min-h-[36px] justify-center"
        aria-label={t('language.toggle')}
        title={t('language.toggle')}
      >
        <Languages className="hidden sm:block w-4 h-4" />
        <FlagIcon countryCode={currentLanguage.countryCode} size={28} />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage.label}
        </span>
        <ChevronDown className={`hidden sm:block w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                  currentLang === lang.code ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <FlagIcon countryCode={lang.countryCode} size={20} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {lang.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {lang.label}
                  </div>
                </div>
                {currentLang === lang.code && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 