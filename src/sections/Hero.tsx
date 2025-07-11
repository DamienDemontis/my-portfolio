import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const Hero = () => {
  const { t } = useTranslation();

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center text-center -mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-display font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('hero.name')}
        </motion.h1>

        <TypeAnimation
          sequence={[
            t('hero.title1'),
            2000,
            t('hero.title2'),
            2000,
          ]}
          wrapper="h2"
          speed={50}
          className="text-2xl md:text-4xl font-semibold text-primary mb-8"
          repeat={Infinity}
        />

        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button 
            className="btn btn-primary" 
            onClick={() => handleDownload('/cv/RESUME_Demontis_Damien_2024_EN.pdf')}
          >
            {t('hero.cta_cv_en')}
          </button>
          <button 
            className="btn btn-primary btn-outline"
            onClick={() => handleDownload('/cv/CV_Demontis_Damien_2024_FR.pdf')}
          >
            {t('hero.cta_cv_fr')}
          </button>
          <a href="#contact" className="btn btn-secondary">
            {t('hero.cta_contact')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 