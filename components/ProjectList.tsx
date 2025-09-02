'use client';
import { projects } from '@/data/projects';
import ProjectCard from './ProjectCard';

export default function ProjectList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.id} {...p} />
      ))}
    </div>
  );
}
