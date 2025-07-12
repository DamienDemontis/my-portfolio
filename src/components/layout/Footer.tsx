import { useTranslation } from 'react-i18next'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export const Footer = () => {
  const { t } = useTranslation()

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/damiendemontis',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/damien-demontis/',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Email',
      href: 'mailto:damien.demontis@epitech.eu',
      icon: Mail,
      color: 'hover:text-primary-600'
    }
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto container-padding py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            {socialLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 dark:text-gray-400 transition-colors duration-200 ${link.color}`}
                  aria-label={link.name}
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center md:justify-end gap-1">
              © {new Date().getFullYear()} Damien Demontis. Made with{' '}
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              in France
            </p>
          </div>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('contact.info.availability')} • {t('contact.info.location')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 