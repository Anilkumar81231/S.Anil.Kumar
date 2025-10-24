"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Contact Me", href: "#contact" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 100

      setIsScrolled(window.scrollY > 50)

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 w-auto max-w-[90vw] ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border border-border shadow-xl"
          : "bg-background/90 backdrop-blur-md border border-border/50 shadow-lg"
      } rounded-full px-4 sm:px-6 py-2`}
    >
      <div className="flex items-center justify-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item, index) => (
            <Button
              key={item.name}
              variant={activeSection === item.href.slice(1) ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToSection(item.href)}
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 rounded-full px-4 py-2 ${
                activeSection === item.href.slice(1)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-primary/10 text-foreground/80 hover:text-foreground"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {item.name}
            </Button>
          ))}
          <div className="ml-2 pl-2 border-l border-border/30">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2 hover:bg-primary/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border shadow-xl rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1 p-3">
            {navItems.map((item, index) => (
              <Button
                key={item.name}
                variant={activeSection === item.href.slice(1) ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium justify-start rounded-full transition-all duration-200 hover:scale-[1.02] ${
                  activeSection === item.href.slice(1)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-primary/10"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
