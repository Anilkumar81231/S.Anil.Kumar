

"use client"

import { Button } from "@/components/ui/button"
import { SocialLinks } from "./social-links"
import { useProfile } from "@/hooks/use-api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useState, useEffect } from "react"

interface HeroContentProps {
  isVisible: boolean
}

// ✨ Typing Hook (only once, no repeat)
function useTypingEffect(text: string, typeSpeed = 120) {
  const [displayed, setDisplayed] = useState<string>("")

  useEffect(() => {
    if (!text) {
      setDisplayed("")
      return
    }

    let i = 0
    setDisplayed("")
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i === text.length) {
        clearInterval(interval) // ✅ stop when finished
      }
    }, typeSpeed + Math.random() * 80) // ✨ little randomness for human feel

    return () => clearInterval(interval)
  }, [text, typeSpeed])

  return displayed
}

export function HeroContent({ isVisible }: HeroContentProps) {
  const { data: profile, loading } = useProfile()

  const name = profile?.name || "Anil"
  const typedName = useTypingEffect(loading ? "" : name, 120)

  if (loading) {
    return (
      <div
        className={`text-center lg:text-left transition-all duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
      >
        <div className="flex items-center justify-center lg:justify-start mb-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  const bio =
    profile?.bio ||
    "A passionate Full Stack Developer with expertise in building clean, scalable, and user-friendly web applications. I love creating Digital Experiences that make a difference."

  return (
    <div
      className={`text-center lg:text-left transition-all duration-1000 ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
      }`}
    >
      <div className="inline-block px-6 py-3 bg-primary/10 rounded-full text-primary font-bold text-2xl md:text-3xl mb-4 md:mb-6">
        Hey there,
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance mb-4 md:mb-6">
        I'm{" "}
        <span className="text-primary relative">
          {typedName}
          {/* ✨ sleek blinking cursor */}
          <span className="ml-1 w-[2px] h-8  bg-primary inline-block animate-blink"></span>
        </span>{" "}
        👋
      </h1>

      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>

      <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl lg:max-w-none mb-6 md:mb-8 text-pretty px-2 sm:px-0">
        — {bio}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 md:mb-8 px-4 sm:px-0">
        <Button
          size="lg"
          className="font-medium hover:scale-105 transition-transform duration-300 w-full sm:w-auto bg-primary text-primary-foreground"
          onClick={() =>
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          View My Work
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="font-medium bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
        >
          <a href="/ANILKUMAR.pdf" target="_blank" rel="noopener noreferrer">
            Download CV
          </a>
        </Button>
      </div>

      <SocialLinks profile={profile} />
    </div>
  )
}

