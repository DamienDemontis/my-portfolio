import Section from "@/components/common/Section";
import { useTranslation } from "react-i18next";
import { FaGithub } from 'react-icons/fa';

interface ProjectEntry {
  name: string;
  description: string;
  image: string;
  repoUrl: string;
  tech: string[];
}

const ProjectCard = ({ project }: { project: ProjectEntry }) => {
  const { t } = useTranslation();
  return (
    <div className="card bg-base-200 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <figure><img src={project.image} alt={project.name} className="h-56 w-full object-cover" /></figure>
      <div className="card-body">
        <h3 className="card-title font-display">{project.name}</h3>
        <p className="text-base-content/80 flex-grow">{project.description}</p>
        <div className="card-actions justify-start py-2">
            {project.tech.map(t => <div key={t} className="badge badge-outline">{t}</div>)}
        </div>
        <div className="card-actions justify-end">
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <FaGithub className="h-4 w-4 mr-2" />
            {t('projects.view_on_github')}
          </a>
        </div>
      </div>
    </div>
  );
};


const Projects = () => {
  const { t } = useTranslation();
  const projects: ProjectEntry[] = t('projects.entries', { returnObjects: true });

  return (
    <Section id="projects" title={t('projects.title')}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default Projects; 