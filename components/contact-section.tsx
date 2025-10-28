
"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const contactInfo = [
  { icon: Mail,  title: "Email",    value: "akstifen2@gmail.com", href: "mailto:akstifen2@gmail.com" },
  { icon: Phone, title: "Phone",    value: "+91 81231 93971",     href: "tel:+918123193971" },
  { icon: MapPin,title: "Location", value: "Bangalore, KA",       href: "https://maps.app.goo.gl/tX7cZu9BkZkfwCws7" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isVisible, setIsVisible] = useState(false)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === sectionRef.current) {
              setIsVisible(true)
            } else {
              const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
              setVisibleItems((prev) => (prev.includes(index) ? prev : [...prev, index]))
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    itemRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)

    // basic client validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setResult({ type: "error", text: "Please fill all fields." })
      return
    }

    setLoading(true)
    try {
      // Formspree endpoint (set in .env.local). Fallback to your provided URL.
      const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "https://formspree.io/f/xwprgzkk"

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      const data = await res.json().catch(() => ({} as any))

      if (res.ok) {
        setResult({ type: "success", text: data?.message || "Message sent successfully!" })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        const errText = data?.message || "Failed to send message. Try again later."
        setResult({ type: "error", text: errText })
      }
    } catch (err) {
      console.error("Send error:", err)
      setResult({ type: "error", text: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="py-12 md:py-20 overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Contact Me</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6 animate-pulse"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty px-2">
              Let's work together! Feel free to reach out for collaborations or just a friendly hello.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <div className={`transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 px-2 lg:px-0">Get In Touch</h3>
              <p className="text-muted-foreground mb-6 md:mb-8 text-pretty px-2 lg:px-0">
                I'm always interested in hearing about new projects and opportunities. Whether you're a company looking
                to hire, or you're a fellow developer wanting to collaborate, I'd love to hear from you.
              </p>

              <div className="space-y-4 md:space-y-6 px-2 lg:px-0">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    data-index={index}
                    className={`flex items-center gap-3 md:gap-4 hover:scale-105 transition-all duration-300 cursor-pointer group ${
                      visibleItems.includes(index) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <info.icon className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:scale-125 transition-transform duration-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors duration-300">
                        {info.title}
                      </h4>
                      <a
                        href={info.href}
                        className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-300"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <Card className={`hover:shadow-xl transition-all duration-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`} style={{ transitionDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                      <Input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <Input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                  </div>

                  <div>
                    <Textarea name="message" placeholder="Your Message" rows={5} value={formData.message} onChange={handleChange} required />
                  </div>

                  {result && (
                    <div role="status" className={`p-2 text-sm rounded ${result.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {result.text}
                    </div>
                  )}

                  <Button type="submit" className="w-full hover:scale-105 transition-all duration-300 group" disabled={loading}>
                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    {/* Footer Note */}
<div
  className={`mt-12 flex flex-col items-center transition-all duration-1000 ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  {/* subtle divider */}
  <div className="h-px w-full max-w-xl bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

  {/* tagline */}
  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-6 py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm hover:bg-muted/50 transition-all duration-500">
    <span className="font-medium text-muted-foreground">
      Built with <span className="font-semibold text-primary">passion</span> & <span className="font-semibold text-primary">creativity</span>  By
    </span>
    <span className="font-semibold text-primary">Anil ✨</span>
  </div>
</div>

 
    </section>
    
  )
}
