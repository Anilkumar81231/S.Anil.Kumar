
"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"
import { useSkills, useProfile } from "@/hooks/use-api"
import { LoadingSpinner, ErrorMessage } from "@/components/ui/loading-spinner"
import { link } from "fs"



// Add this new interface
interface ExperienceCardProps {
  company: string;
  title: string;
  dates: string;
  description: string;
  index: number;
}

// ====================================================================
// 1. COMPONENT: ExperienceCard (Simplified Single-Column)
// ====================================================================
function ExperienceCard({ company, title, dates, description, index }: ExperienceCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative pl-8 md:pl-10 py-4 transition-all duration-700 ease-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 150}ms` }} 
    >
      {/* Circle Marker */}
      <div className="absolute -left-2.5 top-6 w-5 h-5 bg-primary rounded-full shadow-md z-10"></div>
      
      {/* Content */}
      <p className="text-sm text-primary font-medium mb-1">{dates}</p>
      <h5 className="text-lg font-semibold text-primary">{title}</h5>
      <p className="text-base font-normal text-primary mb-2">{company}</p>
      <br />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}




// ====================================================================
// 2. MAIN COMPONENT: AboutSection
// ====================================================================
export function AboutSection() {
  const [skillsVisible, setSkillsVisible] = useState(false)
  const skillsRef = useRef<HTMLDivElement>(null)
  
  // 🟢 NEW STATE: Controls the page zoom-in effect
  const [isZoomed, setIsZoomed] = useState(false) 

  const { data: skills, loading: skillsLoading, error: skillsError } = useSkills()
  const { data: profile, loading: profileLoading } = useProfile()

  const [activeSkillId, setActiveSkillId] = useState<string | null>(null)
  const [bubble, setBubble] = useState<
    | { id: string; text: string; x: number; y: number; placedBelow: boolean }
    | null
  >(null)

  useEffect(() => {
    // 🟢 TRIGGER ZOOM: Start the zoom animation on mount
    setTimeout(() => {
        setIsZoomed(true);
    }, 100); 

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === skillsRef.current) {
            setSkillsVisible(true)
          }
        })
      },
      { threshold: 0.2 },
    )

    // 🏆 FIXED THE TYPO: calling observer.observe() only once
    if (skillsRef.current) observer.observe(skillsRef.current)
    
    return () => observer.disconnect()
  }, [])

  // 🔹 Knowledge messages with emojis (ALL ORIGINAL SKILLS RESTORED)
  const funMessages: Record<string, string> = {
    // 🛠️ MODIFY: Add/change messages for skill hover bubbles
    Git: "Version control system 🗂️",
    GitHub: "Code hosting & collaboration platform 🤝",
    "HTML/CSS": "Structure & style of the web 🌐🎨",
    JavaScript: "The language of the web ⚡",
    "Next.js": "React framework for SSR & SSG ⚡",
    "React.js": "Component-based UI library ⚛️",
    "Tailwind CSS": "Utility-first CSS framework 🎨",
    "Data Structures & Algorithms": "The building blocks of problem solving 🧩",
    "Database Management": "Organizing and handling data 📊",
    Docker: "Containerization for apps 🐳",
    "Express.js": "Minimalist web framework for Node 🚀",
    Figma: "Collaborative UI/UX design tool 🎨",
    Java: "Robust, platform-independent language ☕",
    "Node.js": "JavaScript runtime for servers 🌍",
    "Problem Solving": "Logical thinking & solutions 🧠",
    Python: "Simple yet powerful language 🐍",
    "Software Engineering": "Principles of building reliable software 🏗️",
    SQL: "Language for relational databases 🧾",
    TypeScript: "JavaScript with types 🔒",
    "Angular.js": "Framework for dynamic web apps 🅰️",
    "Artificial Intelligence": "Machines that learn & think 🤖",
    C: "Low-level, powerful programming language ⚙️",
    "C++": "C with OOP features 💻",
    "Cloud Computing": "On-demand computing power ☁️",
    Kubernetes: "Container orchestration at scale ☸️",
    MongoDB: "NoSQL database for flexible data 🌱",
    "Operating Systems": "The backbone of computing 💻",
    PostgreSQL: "Advanced open-source relational DB 🐘",
  }

  // 2. 🛠️ MODIFY: Professional Experience Data (One Company)
  const experienceData = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "EPICMINDS SERVICES LLP", 
      dates: "July 2025 - September 2025",     
      description: `Contributed as a Full Stack Developer at EpicMinds — a leading technology solutions provider specializing in Digital Transformation, Cloud Computing, and Field Staff Management Applications. I worked on both frontend and backend projects, building scalable web and mobile solutions using Next.js, TypeScript, and PostgreSQL. 
  Developed and optimized the “MyDay” SaaS-based tracking app for real-time field data, attendance, and expense management, improving operational visibility and efficiency. 
  Collaborated with cross-functional teams to deliver enterprise-grade, responsive, and high-performance applications tailored for sectors like Government, Agriculture, and Pharma.`,
},
  ]

  // 🔹 Handle skill click (bubble logic)
  function handleSkillClick(e: React.MouseEvent, skillId: string, skillName: string) {
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()

    const bubbleWidth = 260
    const bubbleHeight = 80
    const padding = 4

    let left = rect.left + rect.width / 2 - bubbleWidth / 2
    const viewportWidth = window.innerWidth
    left = Math.max(8, Math.min(left, viewportWidth - bubbleWidth - 8))

    let top = rect.top - bubbleHeight - padding
    let placedBelow = false
    if (top < 8) {
      top = rect.bottom + padding
      placedBelow = true
    }

    const msg = funMessages[skillName] || `${skillName} ✨`

    setActiveSkillId(skillId)
    setBubble({ id: skillId, text: msg, x: left, y: top, placedBelow })

    setTimeout(() => setActiveSkillId(null), 700)
    setTimeout(() => setBubble((b) => (b?.id === skillId ? null : b)), 2500)
  }

  // 🔹 Keyboard activation
  function handleKeyActivate(e: React.KeyboardEvent, skillId: string, skillName: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      const syntheticEvent = { currentTarget: target } as unknown as React.MouseEvent
      handleSkillClick(syntheticEvent, skillId, skillName)
    }
  }

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden pt-16"
     
    >
      {/* 🟢 ZOOM-IN WRAPPER */}
      <div 
        className="transition-all duration-[1200ms] ease-out origin-center" 
        style={{
            // Initial state: scaled down (0.8) and semi-transparent
            // Final state (isZoomed=true): scale(1) and fully opaque
            transform: isZoomed ? 'scale(1)' : 'scale(0.8)',
            opacity: isZoomed ? 1 : 0.5,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 animate-fade-in-up">
                About Me
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6 animate-pulse"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6 animate-fade-in-up px-2">
                {profileLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  `I'm Professional ${profile?.title || "Web Developer"} With Dedicated Experience.`
                )}
              </h3>
              <div className="text-muted-foreground mb-6 md:mb-8 text-pretty text-base md:text-lg animate-fade-in-up px-2">
                {profileLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  profile?.bio ||
                  "As a passionate Full Stack Developer, I thrive on building robust, scalable applications from the ground up, focusing on clean code and exceptional user experience."
                )}
              </div>

              {/* --- SKILLS SECTION --- */}
              <div className="mb-12 md:mb-16" ref={skillsRef}>
                <h4 className="font-semibold mb-3 md:mb-4 text-lg md:text-xl text-center">
                  Skills & Technologies
                </h4>
                {skillsLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : skillsError ? (
                  <ErrorMessage message="Failed to load skills" />
                ) : (
                  // Skills are rendered here. Data comes from useSkills() hook.
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2">
                    {(skills || []).map((skill, index) => {
                      const isActive = activeSkillId === skill.id
                      return (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className={`text-xs md:text-sm px-2 md:px-3 py-1 hover:scale-110 transition-all duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                            skillsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                          } ${isActive ? "animate-skill-pop" : ""}`}
                          style={{
                            transitionDelay: `${index * 50}ms`,
                            animationDelay: `${index * 50}ms`,
                          }}
                          onClick={(e) => handleSkillClick(e, skill.id, skill.name)}
                          onKeyDown={(e) => handleKeyActivate(e, skill.id, skill.name)}
                          role="button"
                          tabIndex={0}
                        >
                          {skill.name}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* --- EXPERIENCE SECTION - SIMPLIFIED SINGLE COLUMN --- */}
              <div className="text-left w-full max-w-xl mx-auto py-8"> 
                <h4 className="font-semibold mb-6 md:mb-8 text-center text-lg md:text-xl">
                  Professional Experience
                </h4>
                {/* Vertical Line Container */}
                <div className="relative border-l-2 border-primary/50">
                  {experienceData.map((exp, index) => (
                    <ExperienceCard
                      key={exp.id}
                      company={exp.company}
                      title={exp.title}
                      dates={exp.dates}
                      description={exp.description}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              {/* --- END EXPERIENCE SECTION --- */}

            </div>
          </div>
        </div>
      </div> {/* 🟢 END ZOOM-IN WRAPPER */}

      {/* 🔹 Speech Bubble */}
      {bubble && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: bubble.x, top: bubble.y, width: 260 }}
        >
          <div className="relative">
            <div className="pointer-events-auto bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg text-sm text-gray-800">
              <div className="font-semibold text-primary mb-1">💡 skill </div>
              <div>{bubble.text}</div>
            </div>
            {/* Arrow */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-gray-200 ${
                bubble.placedBelow ? "border-b border-r -top-1" : "border-t border-l -bottom-1"
              }`}
            />
          </div>
        </div>
      )}

      {/* 🔹 Animations */}
      <style>{`
        @keyframes skillPop {
          0% { transform: scale(1) rotate(0deg); }
          40% { transform: scale(1.14) rotate(-6deg); }
          70% { transform: scale(0.98) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-skill-pop {
          animation: skillPop 700ms cubic-bezier(.2,.9,.3,1);
        }
      `}</style>
    </section>
  )
}