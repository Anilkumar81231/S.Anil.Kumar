import { NextResponse } from "next/server"
import type { Education, ApiResponse } from "@/lib/types"

// Mock data - in a real app, this would come from a database
const mockEducation: Education[] = [
  {
    id: "1",
    type: "degree",
    title: "Bachelor of Technology in Computer Science",
    institution: "  PES University",
    period: "2021 - 2025",
    description:
      "Pursuing Computer Science at PES University, where I built a strong foundation in software development, web technologies, and emerging tech innovations through practical, project-based learning.",
    image: "/university-campus.png",
    imageAlt: "University of Technology campus building",
    createdAt: new Date("2022-06-15"),
    updatedAt: new Date("2022-06-15"),
  },
  {
    id: "2",
    type: "certification",
    title: " Linux Kernel Development",
    institution: "Credly",
    period: "2025",
    description: "Earned “LFD103: A Beginner’s Guide to Linux Kernel Development” from The Linux Foundation — covering Linux system fundamentals, shell commands, and hands-on kernel module development.",
    image: "/linux.png",
    imageAlt: "Credly Linux Course Certificate",
    createdAt: new Date("2022-08-20"),
    updatedAt: new Date("2022-08-20"),
  },
  {
    id: "3",
    type: "certification",
    title: "Frontend Development with React and Next.js",
    institution: "EPICMINDS SERVICES LLP",
    period: "2025",
    description: "Successfully completed a 3-month internship, strengthening practical skills in software development and team collaboration.",
    image: "epciminds certificate.jpg",
    imageAlt: "React and Next.js Course Certificate",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
  {
    id: "4",
    type: "certification",
    title: "Java Programming Certification",
    institution: "HackerRank",
    period: "2025",
    description: "Java  Certification – HackerRank: Validated core proficiency in Java programming and problem-solving fundamentals.",
    image: "/java_basic.jpg",
    imageAlt: "Java Certificate",
    createdAt: new Date("2023-07-15"),
    updatedAt: new Date("2023-07-15"),
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let education = [...mockEducation]

    // Filter by type if requested
    if (type && ["degree", "certification", "course"].includes(type)) {
      education = education.filter((item) => item.type === type)
    }

    // Sort by creation date (newest first)
    education.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const response: ApiResponse<Education[]> = {
      success: true,
      data: education,
      message: `Retrieved ${education.length} education items`,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch education data",
      message: "An error occurred while retrieving education information",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { type, title, institution, period, description } = body
    if (!type || !title || !institution || !period || !description) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Missing required fields",
        message: "Type, title, institution, period, and description are required",
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (!["degree", "certification", "course"].includes(type)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid type",
        message: "Type must be one of: degree, certification, course",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const newEducation: Education = {
      id: Date.now().toString(),
      type,
      title,
      institution,
      period,
      description,
      image: body.image,
      imageAlt: body.imageAlt,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In a real app, save to database
    mockEducation.push(newEducation)

    const response: ApiResponse<Education> = {
      success: true,
      data: newEducation,
      message: "Education item created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create education item",
      message: "An error occurred while creating the education item",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
