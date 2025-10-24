"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { EducationSection } from "@/components/education-section"
import { ContactSection } from "@/components/contact-section"
import { useEffect } from "react"


export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"

    // Add scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll("section")
    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      document.documentElement.style.scrollBehavior = "auto"
    }
    // </CHANGE>
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
    </main>
  )
}
