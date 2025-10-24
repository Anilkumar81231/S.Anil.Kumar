"use client"

import { useState, useEffect } from "react"
import { projectsApi, educationApi, skillsApi, profileApi } from "@/lib/api"
import type { Project, Education, Skill, PersonalInfo } from "@/lib/types"

// Generic hook for API data fetching
function useApiData<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiCall()
        
        if (isMounted) {
          if (response.success && response.data) {
            setData(response.data)
          } else {
            setError(response.error || "Failed to fetch data")
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error, refetch: () => setLoading(true) }
}

// Specific hooks for each data type
export function useProjects(params?: { featured?: boolean; limit?: number }) {
  return useApiData<Project[]>(
    () => projectsApi.getAll(params),
    [params?.featured, params?.limit]
  )
}

export function useEducation(type?: "degree" | "certification" | "course") {
  return useApiData<Education[]>(
    () => educationApi.getAll(type),
    [type]
  )
}

export function useSkills(category?: "frontend" | "backend" | "database" | "tools" | "other") {
  return useApiData<Skill[]>(
    () => skillsApi.getAll(category),
    [category]
  )
}

export function useProfile() {
  return useApiData<PersonalInfo>(
    () => profileApi.get(),
    []
  )
}

// Hook for creating new data
export function useCreateProject() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    setError(null)

    try {
      const response = await projectsApi.create(project)
      
      if (response.success) {
        return response.data
      } else {
        setError(response.error || "Failed to create project")
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createProject, loading, error }
}

export function useCreateEducation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEducation = async (education: Omit<Education, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    setError(null)

    try {
      const response = await educationApi.create(education)
      
      if (response.success) {
        return response.data
      } else {
        setError(response.error || "Failed to create education item")
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createEducation, loading, error }
}
