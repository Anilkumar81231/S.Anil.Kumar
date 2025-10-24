"use client"

interface HeroImageProps {
  isVisible: boolean
}

export function HeroImage({ isVisible }: HeroImageProps) {
  return (
    <div
      className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center hover:rotate-3 transition-all duration-500 hover:scale-105">
        <img
          src="/anilkumar.png"
          alt="Anil - Full Stack Developer"
          className="w-64 h-64 lg:w-80 lg:h-80 rounded-xl object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>
  )
}
