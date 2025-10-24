"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin,  Twitter,  X } from "lucide-react"
import type { PersonalInfo } from "@/lib/types"

interface SocialLinksProps {
  profile?: PersonalInfo | null
}

export function SocialLinks({ profile }: SocialLinksProps) {
  const socialLinks = [
    {
      icon: Github,
      href: profile?.socialLinks?.github || "#",
      label: "GitHub",
      show: true,
    },
    {
      icon: Linkedin,
      href: profile?.socialLinks?.linkedin || "#",
      label: "LinkedIn",
      show: true,
    },
    {
      icon: X,
      href: profile?.socialLinks?.twitter || "#",
      label: "X",
      show: !!profile?.socialLinks?.twitter,
    },
    // {
    //   icon: Globe,
    //   href: profile?.socialLinks?.website || "#",
    //   label: "Website",
    //   show: !!profile?.socialLinks?.website,
    // },
    // {
    //   icon: Mail,
    //   href: profile?.email ? `mailto:${profile.email}` : "#",
    //   label: "Email",
    //   show: true,
    // },
  ].filter((link) => link.show) // Filter out links that shouldn't be shown

  return (
    <div className="flex items-center justify-center lg:justify-start gap-4">
      {socialLinks.map(({ icon: Icon, href, label }) => (
        <Button
          key={label}
          variant="ghost"
          size="icon"
          className="rounded-full hover:scale-110 hover:rotate-12 transition-all duration-300"
          asChild
        >
          <a
            href={href}
            aria-label={label}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <Icon className="h-5 w-5" />
          </a>
        </Button>
      ))}
    </div>
  )
}
