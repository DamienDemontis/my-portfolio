import { useTranslation } from 'react-i18next'
import { Github, Linkedin, Mail, Heart, Instagram, MapPin, Clock, Code, Sparkles } from 'lucide-react'

export const Footer = () => {
  const { t } = useTranslation()

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/damiendemontis',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-white',
      bgColor: 'hover:bg-gray-100 dark:hover:bg-gray-800'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/damien-demontis/',
      icon: Linkedin,
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/damien.demontis/',
      icon: Instagram,
      color: 'hover:text-pink-600',
      bgColor: 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
    },
    {
      name: 'Email',
      href: 'mailto:damien.demontis@epitech.eu',
      icon: Mail,
      color: 'hover:text-green-600',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-900/20'
    }
  ]

  const quickLinks = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.experience'), href: '#experience' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.contact'), href: '#contact' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto container-padding pb-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">D²</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Damien Demontis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full-Stack Developer</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {t('footer.craftedWith')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-700/30 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-200 ${link.color} ${link.bgColor} hover:scale-105 hover:shadow-lg`}
                    aria-label={link.name}
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              {t('footer.quickNavigation')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center justify-center md:justify-start gap-2">
              <Code className="w-5 h-5 text-purple-500" />
              {t('footer.letsConnect')}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{t('contact.info.location')}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm">{t('contact.info.availability')}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <a 
                  href="mailto:damien.demontis@epitech.eu"
                  className="text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  damien.demontis@epitech.eu
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 pb-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <p className="text-sm flex items-center gap-1">
                © {currentYear} Damien Demontis. {t('footer.craftedWith')}{' '}
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                {t('footer.inFrance')}
              </p>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-right">
              <p>{t('footer.builtWith')}</p>
              <p className="mt-1">{t('footer.openToOpportunities')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 