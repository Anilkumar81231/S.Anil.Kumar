

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award, BookOpen, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useEducation } from "@/hooks/use-api"
import { LoadingSection, ErrorSection } from "@/components/ui/loading-spinner"

export function EducationSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState("")
  const [lightboxAlt, setLightboxAlt] = useState("")
  const [lightboxTitle, setLightboxTitle] = useState("")

  const { data: allEducation, loading, error, refetch } = useEducation()
  const { data: degrees } = useEducation("degree")
  const { data: certifications } = useEducation("certification")
  const { data: courses } = useEducation("course")

  const certificationsAndCourses = [...(certifications || []), ...(courses || [])]

  useEffect(() => {
    if (certificationsAndCourses.length > 0) {
      setVisibleCards(certificationsAndCourses.map((_, index) => index))

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
              const type = entry.target.getAttribute("data-type")

              if (type === "education") {
                setVisibleCards((prev) => [...new Set([...prev, index])])
              }
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
  }, []) // Removed certificationsAndCourses from dependencies

  useEffect(() => {
    // close on ESC
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
    }
    if (lightboxOpen) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [lightboxOpen])

  if (loading) {
    return <LoadingSection title="Education" count={4} />
  }

  if (error) {
    return <ErrorSection title="Education" message={error} onRetry={refetch} />
  }

  const getIconComponent = (type: string) => {
    switch (type) {
      case "degree":
        return GraduationCap
      case "certification":
        return Award
      case "course":
        return BookOpen
      default:
        return GraduationCap
    }
  }

  const collegeEducation = degrees?.[0] // Get the first degree

  const openLightbox = (src: string, alt = "", title = "") => {
    setLightboxSrc(src)
    setLightboxAlt(alt)
    setLightboxTitle(title)
    setLightboxOpen(true)
  }

  return (
    <section id="education" className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6 animate-pulse"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              My educational background and certifications that drive my passion for web development.
            </p>
          </div>

          {collegeEducation && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">College Education</h3>
              <Card className="hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* College Photo - Left Side */}
                    <div
                      className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => openLightbox(collegeEducation.image || "/placeholder.svg", collegeEducation.imageAlt || `${collegeEducation.institution} campus`, collegeEducation.title)}
                    >
                      <Image
                        src={
                          collegeEducation.image ||
                          "/placeholder.svg?height=320&width=400&query=university campus building" ||
                          "/placeholder.svg"
                        }
                        alt={collegeEducation.imageAlt || `${collegeEducation.institution} campus`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* College Description - Right Side */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          {(() => {
                            const IconComponent = getIconComponent(collegeEducation.type)
                            return (
                              <IconComponent className="h-6 w-6 text-primary group-hover:scale-125 transition-transform duration-300" />
                            )
                          })()}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                            {collegeEducation.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-xs hover:scale-105 transition-transform duration-300"
                          >
                            {collegeEducation.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-primary font-medium text-lg">{collegeEducation.institution}</p>
                      <p className="text-muted-foreground font-medium">{collegeEducation.period}</p>
                      <p className="text-pretty leading-relaxed">{collegeEducation.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {certificationsAndCourses.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">Certifications</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificationsAndCourses.map((item, index) => {
                  const IconComponent = getIconComponent(item.type)
                  return (
                    <Card
                      key={item.id}
                      ref={(el) => { cardRefs.current[index] = el; }}
                      data-index={index}
                      data-type="education"
                      onClick={() => openLightbox(item.image || "/placeholder.svg?height=128&width=200&query=certificate", item.imageAlt || `${item.title} certificate`, item.title)}
                      role="button" 
                      tabIndex={0}
                      className={`relative hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group cursor-pointer ${
                        visibleCards.includes(index) ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100"
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg?height=128&width=200&query=certificate"}
                              alt={item.imageAlt || `${item.title} certificate`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                            <IconComponent className="h-5 w-5 text-primary group-hover:scale-125 transition-transform duration-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-xs hover:scale-105 transition-transform duration-300"
                              >
                                {item.type}
                              </Badge>
                            </div>
                            <p className="text-primary font-medium text-sm mb-1">{item.institution}</p>
                            <p className="text-xs text-muted-foreground mb-2">{item.period}</p>
                            <p className="text-xs text-pretty">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {!collegeEducation && certificationsAndCourses.length === 0 && (
            <div className="text-center">
              <p className="text-muted-foreground">No education data found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="Close"
              className="absolute top-3 right-3 z-20 rounded-full bg-white/10 backdrop-blur px-2 py-1 hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <div className="w-full h-[70vh] md:h-[80vh] relative rounded">
              {/* Use Image with priority for better UX on open */}
              <Image src={lightboxSrc || "/placeholder.svg"} alt={lightboxAlt} fill className="object-contain" />
            </div>

            {lightboxTitle && <p className="mt-3 text-center text-white/90">{lightboxTitle}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
