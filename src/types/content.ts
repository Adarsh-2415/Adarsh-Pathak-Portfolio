export interface ProfileInfo {
  name: string
  role: string
  location: string
  headline: string
  about: string[]
  coreSkills: {
    languages: string[]
    frameworks: string[]
    tools: string[]
    design: string[]
  }
}

export interface ProjectItem {
  id: string
  title: string
  category: 'website' | 'app' | 'experiment'
  summary: string
  role: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  previewImage?: string
  canEmbed?: boolean
}

export interface DesignWorkItem {
  id: string
  title: string
  category: string
  description: string
  tools: string[]
  thumbnailUrl: string
  fullImageUrl: string
  aspectRatio?: string
  year?: string
}

export interface VideoWorkItem {
  id: string
  title: string
  category: string
  description: string
  videoUrl: string
  posterUrl: string
  duration?: string
  year?: string
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  location: string
  description: string[]
  technologies: string[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  period: string
  field: string
  highlights?: string[]
}

export interface ContactInfo {
  email: string
  phone?: string
  github: string
  linkedin: string
  twitter?: string
  location: string
}
