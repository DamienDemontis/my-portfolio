'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Badge } from './ui/Badge';
import cvData from '../data/cv.json';

export function ContactSection() {
  const t = useTranslations('contact');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: cvData.personalInfo.linkedIn,
      icon: '💼',
    },
    {
      name: 'GitHub',
      url: cvData.personalInfo.github,
      icon: '💻',
    },
    {
      name: 'Instagram',
      url: cvData.personalInfo.instagram,
      icon: '📸',
    },
    {
      name: 'YouTube',
      url: cvData.personalInfo.youtube,
      icon: '🎥',
    },
  ];

  return (
    <section ref={ref} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t('title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">{t('getInTouch')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('email')}</p>
                    <a
                      href={`mailto:${cvData.personalInfo.email}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {cvData.personalInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('location')}</p>
                    <p className="text-foreground">{cvData.personalInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('phone')}</p>
                    <a
                      href={`tel:${cvData.contact.phone}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {cvData.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('languages')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cvData.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                  >
                    <span className="font-medium">{lang.language}</span>
                    <Badge variant="secondary">{lang.level}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('social')}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="text-sm font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skills Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">{t('skills')}</h3>
              
              <div className="space-y-6">
                {cvData.skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-foreground mb-3">
                      {skillCategory.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.items.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">{t('currentStatus')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">
                    {t('availableForWork')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('statusDescription')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 