"use client"
import { useEffect, useState } from "react"
import { HeroContent } from "./hero/hero-content"
import { HeroImage } from "./hero/hero-image"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden pt-16"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <HeroContent isVisible={isVisible} />
            <HeroImage isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  )
}
