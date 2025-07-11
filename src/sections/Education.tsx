import Section from "@/components/common/Section";
import { useTranslation } from "react-i18next";

interface EducationEntry {
  institution: string;
  degree: string;
  date: string;
  details: string;
}

const EducationCard = ({ entry }: { entry: EducationEntry }) => (
  <div className="card bg-base-200 shadow-lg h-full">
    <div className="card-body">
      <h3 className="card-title font-display">{entry.institution}</h3>
      <p className="font-semibold text-primary">{entry.degree}</p>
      <p className="text-sm text-base-content/70 mb-2">{entry.date}</p>
      <p>{entry.details}</p>
    </div>
  </div>
);

const Education = () => {
  const { t } = useTranslation();
  const educationEntries: EducationEntry[] = t('education.entries', { returnObjects: true });

  return (
    <Section id="education" title={t('education.title')}>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {educationEntries.map((entry, index) => (
          <EducationCard key={index} entry={entry} />
        ))}
      </div>
    </Section>
  );
};

export default Education; 