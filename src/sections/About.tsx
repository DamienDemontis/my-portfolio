import Section from "@/components/common/Section";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaRocket, FaLanguage, FaSmile } from 'react-icons/fa';

const InfoItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-content">
        {React.createElement(icon, { className: 'h-6 w-6' })}
      </div>
    </div>
    <div className="ml-4">
      <dt className="text-lg leading-6 font-medium font-display">{label}</dt>
      <dd className="mt-1 text-base text-base-content/80">{value}</dd>
    </div>
  </div>
);

const About = () => {
  const { t } = useTranslation();

  const aboutItems = [
    { icon: FaMapMarkerAlt, label: t('about.location_label'), value: t('about.location_value') },
    { icon: FaRocket, label: t('about.relocating_label'), value: t('about.relocating_value') },
    { icon: FaLanguage, label: t('about.languages_label'), value: t('about.languages_value') },
    { icon: FaSmile, label: t('about.fun_fact_label'), value: t('about.fun_fact_value') },
  ];

  return (
    <Section id="about" title={t('about.title')}>
      <div className="max-w-4xl mx-auto grid gap-12">
        <p className="text-lg md:text-xl text-center leading-relaxed">
          {t('about.bio')}
        </p>
        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          {aboutItems.map((item) => (
            <InfoItem key={item.label} {...item} />
          ))}
        </dl>
      </div>
    </Section>
  );
};

export default About; 