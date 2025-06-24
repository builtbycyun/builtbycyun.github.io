export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface TechStack {
  category: string;
  technologies: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  website?: string;
  location: string;
}

export interface TerminalCommand {
  command: string;
  description: string;
  output?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  yearsOfExperience: number;
  specialties: string[];
}

export interface TerminalSectionProps {
  command: string;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}