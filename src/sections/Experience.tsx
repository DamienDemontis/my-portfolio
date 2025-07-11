import Section from "@/components/common/Section";
import { useTranslation } from "react-i18next";

interface ExperienceEntry {
  role: string;
  company: string;
  date: string;
  stack: string[];
  achievements: string[];
}

const TimelineItem = ({ entry, isLast }: { entry: ExperienceEntry, isLast: boolean }) => (
  <li className="mb-10 ms-6">
    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -start-3 ring-8 ring-base-100">
      <svg className="w-2.5 h-2.5 text-primary-content" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
      </svg>
    </span>
    <div className="bg-base-200 rounded-lg p-4 shadow-md transition-shadow hover:shadow-xl">
        <h3 className="flex items-center mb-1 text-lg font-semibold font-display">
            {entry.role} <span className="text-primary mx-2">@</span> {entry.company}
        </h3>
        <time className="block mb-3 text-sm font-normal leading-none text-base-content/70">{entry.date}</time>
        <div className="mb-4">
            {entry.stack.map(tech => (
                <span key={tech} className="badge badge-outline mr-2 mb-2">{tech}</span>
            ))}
        </div>
        <ul className="list-disc list-inside text-base-content/90 space-y-1">
            {entry.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
            ))}
        </ul>
    </div>
  </li>
);


const Experience = () => {
  const { t } = useTranslation();
  const experiences: ExperienceEntry[] = t('experience.entries', { returnObjects: true });

  return (
    <Section id="experience" title={t('experience.title')}>
      <div className="max-w-3xl mx-auto">
        <ol className="relative border-s border-base-300">
          {experiences.map((entry, index) => (
            <TimelineItem key={index} entry={entry} isLast={index === experiences.length - 1} />
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default Experience; 