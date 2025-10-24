export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl: string
  githubUrl: string
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Education {
  id: string
  type: "degree" | "certification" | "course"
  title: string
  institution: string
  period: string
  description: string
  image?: string
  imageAlt?: string
  createdAt: Date
  updatedAt: Date
}

export interface Skill {
  id: string
  name: string
  category: "frontend" | "backend" | "database" | "tools" | "other" | "concepts"
  level: number // 1-5
  icon?: string
}

export interface PersonalInfo {
  id: string
  name: string
  title: string
  bio: string
  email: string
  phone?: string
  location: string
  avatar?: string
  resume?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
