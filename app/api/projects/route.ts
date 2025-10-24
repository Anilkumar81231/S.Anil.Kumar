import { NextResponse } from "next/server"
import type { Project, ApiResponse } from "@/lib/types"

// Mock data - in a real app, this would come from a database
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Studdy Buddy AI ",
    description:
      "StudyBuddy — AI-driven app to upload PDFs, chat with content, and auto-generate quizzes for smarter learning. 📚🤖",
    image: "/studybuddy.png",
    technologies: ["React+Vite", "Python ( FastAPI )", "MongoDB", ],
    liveUrl: "https://github.com/Anilkumar81231/-studybuddy-frontend?tab=readme-ov-file",
    githubUrl: "https://github.com/Anilkumar81231/-studybuddy-frontend?tab=readme-ov-file",
    featured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "YouTube Clone",
    description: "A responsive YouTube interface clone, built to replicate the platform's visual layout and user experience. 🎥",
    image: "/youtube.jpg",
    technologies: ["HTML", "Css", "JavaScript",  ],
    liveUrl: "https://github.com/Anilkumar81231/youtube_clone?tab=readme-ov-file",
    githubUrl: "https://github.com/Anilkumar81231/youtube_clone",
    featured: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    title: "Earthquake-Visualizer ",
    description: "A responsive Earthquake application with location-based forecasts and interactive maps.",
    image: "/earth.jpg",
    technologies: ["React", "API Integration", "Chart.js", "Tailwind"],
    liveUrl: "https://github.com/Anilkumar81231/Earthquake-Visualizer",
    githubUrl: "https://github.com/Anilkumar81231/Earthquake-Visualizer",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    title: "Portfolio Website",
    description: "A modern portfolio website with smooth animations and responsive design.",
    image: "/modern-portfolio-website.png",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
  {
    id: "5",
    title: "Spamshield Sentiment Analysis Of YouTube Comments",
    description: "SpamShield Sentiment Analyzer — analyzes YouTube video comments to detect spam and determine overall audience sentiment.",
    image: "/sentimental_analysis.png",
    technologies: ["Python", "Flask", " Machine Learning", "NLP"],
    liveUrl: "https://github.com/Anilkumar81231/SpamShield-Sentiment-Analyzer-of-youtube-comments",
    githubUrl: "https://github.com/Anilkumar81231/SpamShield-Sentiment-Analyzer-of-youtube-comments",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  // {
  //   id: "6",
  //   title: "Social Media App",
  //   description: "A social networking platform with real-time messaging and content sharing.",
  //   image: "/social-media-app-interface.png",
  //   technologies: ["React Native", "Firebase", "Redux", "Node.js"],
  //   liveUrl: "#",
  //   githubUrl: "#",
  //   createdAt: new Date("2024-06-20"),
  //   updatedAt: new Date("2024-06-20"),
  // },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")

    let projects = [...mockProjects]

    // Filter featured projects if requested
    if (featured === "true") {
      projects = projects.filter((project) => project.featured)
    }

    // Limit results if requested
    if (limit) {
      const limitNum = Number.parseInt(limit)
      if (!isNaN(limitNum)) {
        projects = projects.slice(0, limitNum)
      }
    }

    // Sort by creation date (newest first)
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const response: ApiResponse<Project[]> = {
      success: true,
      data: projects,
      message: `Retrieved ${projects.length} projects`,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch projects",
      message: "An error occurred while retrieving projects",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { title, description, technologies, liveUrl, githubUrl } = body
    if (!title || !description || !technologies || !liveUrl || !githubUrl) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Missing required fields",
        message: "Title, description, technologies, liveUrl, and githubUrl are required",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      image: body.image || "/project-management-team.png",
      technologies,
      liveUrl,
      githubUrl,
      featured: body.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In a real app, save to database
    mockProjects.push(newProject)

    const response: ApiResponse<Project> = {
      success: true,
      data: newProject,
      message: "Project created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create project",
      message: "An error occurred while creating the project",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
