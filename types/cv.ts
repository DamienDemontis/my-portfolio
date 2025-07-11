export interface PersonalInfo {
  name: string;
  title: string;
  dateOfBirth: string;
  age: number;
  location: string;
  phone: string;
  email: string;
  linkedIn: string;
  github: string;
  youtube: string;
  instagram: string;
  portfolio: string;
  driverLicense: string;
  careerObjective: string;
}

export interface Language {
  name: string;
  level: string;
  code: string;
  score?: string;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa?: string;
  status?: string;
  description: string;
  activities?: string[];
  specializations?: string[];
  honors?: string;
  specialization?: string;
}

export interface Experience {
  company: string;
  position: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  videoUrl?: string;
}

export interface Project {
  name: string;
  type: string;
  role: string;
  description: string;
  url?: string;
  technologies: string[];
  features?: string[];
  achievements?: string[];
}

export interface Skills {
  programming: string[];
  frontend: string[];
  backend: string[];
  mobile: string[];
  gamedev: string[];
  devops: string[];
  ai: string[];
  other: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  category: string;
}

export interface Video {
  title: string;
  url: string;
  description: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  languages: Language[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
  certifications: Certification[];
  interests: string[];
  videos: Video[];
  socialLinks: SocialLink[];
} 