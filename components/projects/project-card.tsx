
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import { forwardRef } from "react"
import type { Project } from "./projects-data"

interface ProjectCardProps {
  project: Project
  index: number
  isVisible: boolean
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, index, isVisible }, ref) => {
    return (
      <Card
        ref={ref}
        data-index={index}
        className={`relative group overflow-hidden rounded-2xl backdrop-blur-md 
          bg-white/70 dark:bg-black/70 border border-white/20 dark:border-white/10
          shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-[0.5deg]
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}

        style={{ transitionDelay: `${index * 120}ms` }}
      >
        {/* Project Image */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-48 object-cover transform transition-all duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4"
          >
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full bg-white/90 text-black hover:scale-110 transition-transform duration-300"
              asChild
            >
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full bg-white/90 text-black hover:scale-110 transition-transform duration-300"
              asChild
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                Github
              </a>
            </Button>
          </div>
        </div>

        {/* Card Content */}
        <CardHeader className="px-5 pt-5">
          <CardTitle className="text-xl font-semibold text-primary transition-colors duration-300">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge
              key={tech}
              variant="outline"
              className="px-3 py-1 text-xs rounded-full border border-border
                        bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105
                        transition-all duration-300 dark:bg-primary/15"
            >
              {tech}
            </Badge>

            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
)

ProjectCard.displayName = "ProjectCard"





