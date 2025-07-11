'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { CalendarIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Badge } from './ui/Badge';
import cvData from '../data/cv.json';

export function ExperienceSection() {
  const t = useTranslations('experience');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Present') return t('current');
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

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
        </motion.div>

        <div className="space-y-8">
          {cvData.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{exp.description}</p>

                  {exp.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('responsibilities')}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('achievements')}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('technologies')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-8 gradient-text text-center">
            Formation
          </h3>
          <div className="space-y-6">
            {cvData.education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {edu.degree}
                    </h4>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span className="font-medium">{edu.institution}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{edu.location}</span>
                      </div>
                      {edu.gpa && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          {edu.gpa}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{edu.description}</p>
                    
                    {edu.activities && edu.activities.length > 0 && (
                      <div className="mb-3">
                        <h5 className="font-medium text-foreground text-sm mb-1">
                          Activités et associations
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                          {edu.activities.map((activity, idx) => (
                            <li key={idx}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {edu.specializations && edu.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {edu.specializations.map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 