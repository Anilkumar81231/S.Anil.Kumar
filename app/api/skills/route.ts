import { NextResponse } from "next/server"
import type { Skill, ApiResponse } from "@/lib/types"

// Mock data - in a real app, this would come from a database
const mockSkills: Skill[] = [
  { "id": "1", "name": "React.js", "category": "frontend", "level": 5 },
  { "id": "2", "name": "Next.js", "category": "frontend", "level": 5 },
  { "id": "3", "name": "Angular.js", "category": "frontend", "level": 3 },
  { "id": "4", "name": "JavaScript", "category": "frontend", "level": 5 },
  { "id": "5", "name": "TypeScript", "category": "frontend", "level": 4 },
  { "id": "6", "name": "HTML/CSS", "category": "frontend", "level": 5 },
  { "id": "7", "name": "Tailwind CSS", "category": "frontend", "level": 5 },

  { "id": "8", "name": "Node.js", "category": "backend", "level": 4 },
  { "id": "9", "name": "Express.js", "category": "backend", "level": 4 },
  { "id": "10", "name": "Python", "category": "backend", "level": 4 },
  { "id": "11", "name": "Java", "category": "backend", "level": 4 },
  { "id": "12", "name": "C", "category": "backend", "level": 3 },
  { "id": "13", "name": "C++", "category": "backend", "level": 3 },

  { "id": "14", "name": "SQL", "category": "database", "level": 4 },
  { "id": "15", "name": "MongoDB", "category": "database", "level": 3 },
  { "id": "16", "name": "PostgreSQL", "category": "database", "level": 3 },

  { "id": "17", "name": "Git", "category": "tools", "level": 5 },
  { "id": "18", "name": "GitHub", "category": "tools", "level": 5 },
  { "id": "19", "name": "Docker", "category": "tools", "level": 4 },
  { "id": "20", "name": "Kubernetes", "category": "tools", "level": 3 },
  { "id": "21", "name": "Figma", "category": "tools", "level": 4 },

  { "id": "22", "name": "Software Engineering", "category": "concepts", "level": 4 },
  { "id": "23", "name": "Database Management", "category": "concepts", "level": 4 },
  { "id": "24", "name": "Operating Systems", "category": "concepts", "level": 3 },
  { "id": "25", "name": "Cloud Computing", "category": "concepts", "level": 3 },
  { "id": "26", "name": "Data Structures & Algorithms", "category": "concepts", "level": 4 },
  { "id": "27", "name": "Problem Solving", "category": "concepts", "level": 4 },
  { "id": "28", "name": "Artificial Intelligence", "category": "concepts", "level": 3 }
]




export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let skills = [...mockSkills]

    // Filter by category if requested
    if (category && ["frontend", "backend", "database", "tools", "other"].includes(category)) {
      skills = skills.filter((skill) => skill.category === category)
    }

    // Sort by level (highest first), then by name
    skills.sort((a, b) => {
      if (a.level !== b.level) {
        return b.level - a.level
      }
      return a.name.localeCompare(b.name)
    })

    const response: ApiResponse<Skill[]> = {
      success: true,
      data: skills,
      message: `Retrieved ${skills.length} skills`,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch skills",
      message: "An error occurred while retrieving skills",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
