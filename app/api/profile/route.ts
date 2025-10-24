import { NextResponse } from "next/server"
import type { PersonalInfo, ApiResponse } from "@/lib/types"

// Mock data - in a real app, this would come from a database
const mockProfile: PersonalInfo = {
  id: "1",
  name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  avatar: "",
  resume: "",
  socialLinks: {
    github: "https://github.com/Anilkumar81231",
    linkedin: "https://www.linkedin.com/in/s-anil-kumar-46b71a2b2/",
    twitter: "https://x.com/Ak_stifens",
    website: "https://anil.dev",
  },
  updatedAt: new Date("2024-01-01"),
}

export async function GET() {
  try {
    const response: ApiResponse<PersonalInfo> = {
      success: true,
      data: mockProfile,
      message: "Profile retrieved successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch profile",
      message: "An error occurred while retrieving profile information",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Update profile data (in a real app, save to database)
    const updatedProfile: PersonalInfo = {
      ...mockProfile,
      ...body,
      id: mockProfile.id, // Ensure ID doesn't change
      updatedAt: new Date(),
    }

    const response: ApiResponse<PersonalInfo> = {
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to update profile",
      message: "An error occurred while updating profile information",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
