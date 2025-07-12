import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, MapPin, Clock, Send, Download, FileText, Github, Linkedin } from 'lucide-react'

export const Contact = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      alert(t('contact.form.success'))
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleResumeDownload = (language: 'en' | 'fr') => {
    const resumeUrls = {
      en: '/RESUME_Demontis_Damien_2024_LINKEDIN_EN.pdf',
      fr: '/CV_Demontis_Damien_2024_LINKEDIN_FR.pdf'
    }
    
    const link = document.createElement('a')
    link.href = resumeUrls[language]
    link.download = `Damien_Demontis_Resume_${language.toUpperCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: 'damien.demontis@epitech.eu',
      href: 'mailto:damien.demontis@epitech.eu'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: t('contact.info.location'),
      href: null
    },
    {
      icon: Clock,
      label: 'Availability',
      value: t('contact.info.availability'),
      href: null
    }
  ]

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/damien-demontis/',
      icon: Linkedin,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/damiendemontis',
      icon: Github,
      color: 'hover:bg-gray-800'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-6"></div>
          <h3 className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-semibold mb-4">
            {t('contact.subtitle')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.form.send')} Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200 resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Resume */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Contact Information */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.info.contactInfo')}
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Resume Download */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.resume.download')}
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleResumeDownload('en')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {t('contact.resume.english')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('contact.resume.englishDesc')}
                      </p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
                </button>
                
                <button
                  onClick={() => handleResumeDownload('fr')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {t('contact.resume.french')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('contact.resume.frenchDesc')}
                      </p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.social.connect')}
              </h3>
              
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg ${social.color} hover:text-white transition-all duration-200 hover:scale-110`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 