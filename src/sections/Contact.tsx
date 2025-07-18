import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, MapPin, Clock, Send, Download, FileText, Github, Linkedin, MessageCircle, Instagram } from 'lucide-react'

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
      value: 'Frouard, Grand Est, France',
      href: 'https://maps.google.com/maps?q=Frouard,+Grand+Est,+France'
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
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/damiendemontis',
      icon: Github,
      color: 'from-gray-600 to-gray-800'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/damien.demontis/',
      icon: Instagram,
      color: 'from-pink-500 to-rose-600'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 35, 0],
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-16 right-8 w-36 h-36 bg-green-400/6 dark:bg-green-400/3 rounded-full blur-2xl"
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -30, 0],
            y: [0, 35, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
          className="absolute bottom-20 left-12 w-40 h-40 bg-emerald-400/6 dark:bg-emerald-400/3 rounded-2xl blur-2xl"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Glass container for header */}
          <div 
            className="backdrop-blur-xl bg-white/80 dark:bg-black/40 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl max-w-3xl mx-auto"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('contact.title')}
              </h2>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-6"></div>
            <h3 className="text-xl md:text-2xl text-green-600 dark:text-green-400 font-semibold mb-4">
              {t('contact.subtitle')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('contact.description')}
            </p>
          </div>
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
            <div 
              className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
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
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 dark:text-gray-100 transition-all duration-200 backdrop-blur-sm"
                      placeholder={t('contact.form.namePlaceholder')}
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
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
                      className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 dark:text-gray-100 transition-all duration-200 backdrop-blur-sm"
                      placeholder={t('contact.form.emailPlaceholder')}
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
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
                    className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 dark:text-gray-100 transition-all duration-200 backdrop-blur-sm"
                    placeholder={t('contact.form.subjectPlaceholder')}
                    style={{
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
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
                    className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 dark:text-gray-100 transition-all duration-200 resize-none backdrop-blur-sm"
                    placeholder={t('contact.form.messagePlaceholder')}
                    style={{
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
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
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Resume */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Contact Information */}
            <div 
              className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.info.contactInfo')}
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Resume Download */}
            <div 
              className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.resume.download')}
              </h3>
              
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleResumeDownload('en')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 border border-white/30 dark:border-gray-600/30 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-5 h-5 text-white" />
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
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
                </motion.button>
                
                <motion.button
                  onClick={() => handleResumeDownload('fr')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 border border-white/30 dark:border-gray-600/30 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-5 h-5 text-white" />
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
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
                </motion.button>
              </div>
            </div>

            {/* Social Links */}
            <div 
              className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('contact.social.connect')}
              </h3>
              
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${social.color} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-7 h-7" />
                    </motion.a>
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