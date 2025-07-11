import Section from "@/components/common/Section";
import { useTranslation } from "react-i18next";
import {
  SiJavascript, SiTypescript, SiPython, SiPhp, SiC, SiCplusplus, SiCsharp, SiGnubash,
  SiReact, SiNuxtdotjs, SiNodedotjs, SiDjango, SiDeno,
  SiDocker, SiKubernetes, SiJenkins, SiFirebase, SiGitlab,
  SiGit, SiLinux, SiFigma, SiSlack, SiJira
} from "react-icons/si";

const skillsData = {
  languages: [
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'Python', icon: SiPython },
    { name: 'PHP', icon: SiPhp },
    { name: 'C', icon: SiC },
    { name: 'C++', icon: SiCplusplus },
    { name: 'C#', icon: SiCsharp },
    { name: 'Bash', icon: SiGnubash },
  ],
  frameworks: [
    { name: 'React', icon: SiReact },
    { name: 'Nuxt.js', icon: SiNuxtdotjs },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'Django', icon: SiDjango },
    { name: 'Deno', icon: SiDeno },
  ],
  devops: [
    { name: 'Docker', icon: SiDocker },
    { name: 'Kubernetes', icon: SiKubernetes },
    { name: 'Jenkins', icon: SiJenkins },
    { name: 'Firebase', icon: SiFirebase },
    { name: 'GitLab CI/CD', icon: SiGitlab },
  ],
  tools: [
    { name: 'Git', icon: SiGit },
    { name: 'Linux', icon: SiLinux },
    { name: 'Figma', icon: SiFigma },
    { name: 'Slack', icon: SiSlack },
    { name: 'Jira', icon: SiJira },
  ],
};

const SkillCategory = ({ title, skills }: { title: string, skills: { name: string, icon: React.ElementType }[] }) => (
  <div>
    <h3 className="text-xl font-bold font-display mb-4 text-center">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {skills.map(({ name, icon: Icon }) => (
        <div key={name} className="flex flex-col items-center p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
          <Icon className="h-10 w-10 mb-2 text-primary" />
          <span className="text-sm font-medium">{name}</span>
        </div>
      ))}
    </div>
  </div>
);

const Skills = () => {
  const { t } = useTranslation();

  return (
    <Section id="skills" title={t('skills.title')}>
      <div className="max-w-6xl mx-auto space-y-12">
        <SkillCategory title={t('skills.groups.languages')} skills={skillsData.languages} />
        <SkillCategory title={t('skills.groups.frameworks')} skills={skillsData.frameworks} />
        <SkillCategory title={t('skills.groups.devops')} skills={skillsData.devops} />
        <SkillCategory title={t('skills.groups.tools')} skills={skillsData.tools} />
      </div>
    </Section>
  );
};

export default Skills; 