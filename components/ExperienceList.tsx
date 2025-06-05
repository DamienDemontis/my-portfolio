'use client';
import cv from '@/data/cv.json';

interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
}

export default function ExperienceList() {
  const experiences = cv.experiences as Experience[];
  return (
    <ul className="space-y-4">
      {experiences.map((exp, i) => (
        <li key={i}>
          <strong>{exp.role}</strong> - {exp.company} ({exp.period})
          {exp.description && <p className="text-sm">{exp.description}</p>}
        </li>
      ))}
    </ul>
  );
}
