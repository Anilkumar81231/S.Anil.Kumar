
"use client"

import { useEffect, useRef, useState } from "react"
import { ProjectsHeader } from "./projects/projects-header"
import { ProjectCard } from "./projects/project-card"
import { useProjects } from "@/hooks/use-api"
import { LoadingSection, ErrorSection } from "@/components/ui/loading-spinner"

export function ProjectsSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const { data: projects, loading, error, refetch } = useProjects()

  useEffect(() => {
    if (projects) {
      setVisibleCards(projects.map((_, index) => index))

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
              setVisibleCards((prev) => [...new Set([...prev, index])])
            }
          })
        },
        { threshold: 0.1 },
      )

      setTimeout(() => {
        cardRefs.current.forEach((ref) => {
          if (ref) observer.observe(ref)
        })
      }, 100)

      return () => observer.disconnect()
    }
  }, [projects])

  if (loading) {
    return <LoadingSection title="Projects" count={6} />
  }

  if (error) {
    return <ErrorSection title="Projects" message={error} onRetry={refetch} />
  }

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <ProjectsHeader />
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="projects"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden pt-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ProjectsHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={visibleCards.includes(index)}
                ref={(el) => (cardRefs.current[index] = el)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
