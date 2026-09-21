import type {
  ContactInfo,
  DesignWorkItem,
  EducationItem,
  ExperienceItem,
  ProfileInfo,
  ProjectItem,
  VideoWorkItem,
} from '@/types'

/**
 * Adarsh Pathak Portfolio Content Data
 * Rule: Never fabricate achievements, statistics, or clients.
 * Content fields awaiting details from Adarsh are explicitly documented.
 */
export const profileData: ProfileInfo = {
  name: 'Adarsh Pathak',
  role: 'Student Developer & Creative Technologist',
  location: 'India',
  headline: 'Building modern web applications, experimenting with creative interfaces, and exploring new technologies.',
  about: [
    "Hi, I'm Adarsh, a student developer passionate about building high-performance web applications, interactive digital experiences, and exploring modern front-end architectures.",
    'I focus on combining clean software engineering with thoughtful UI/UX interaction design.',
  ],
  coreSkills: {
    languages: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Python'],
    frameworks: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
    tools: ['Git', 'GitHub', 'Vercel', 'Figma', 'VS Code'],
    design: ['UI/UX Design', 'Motion Design', 'Visual Hierarchy', 'Responsive Layouts'],
  },
}

export const contactData: ContactInfo = {
  email: '',    // Primary email (supplied separately)
  phone: '',    // Phone number (supplied separately)
  github: '',   // GitHub handle (supplied separately)
  linkedin: '', // LinkedIn profile (supplied separately)
  location: 'India',
}

// Collections initialized empty until real project data is supplied
export const projectsData: ProjectItem[] = []
export const designWorkData: DesignWorkItem[] = []
export const videoWorkData: VideoWorkItem[] = []
export const experienceData: ExperienceItem[] = []
export const educationData: EducationItem[] = []
