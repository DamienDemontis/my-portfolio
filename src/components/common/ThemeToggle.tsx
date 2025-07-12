import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={t('theme.toggle')}
      title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
} 