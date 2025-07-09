"use client"

import { ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from "react"

export default function AnimatedScrollArrow() {
  const [isVisible, setIsVisible] = useState(false)
  const arrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleScrollToNextSection = () => {
    // Find the closest parent section
    let parentSection = arrowRef.current?.closest('section') as HTMLElement | null
    if (parentSection) {
      // Find the next sibling section
      let nextSection = parentSection.nextElementSibling as HTMLElement | null
      while (nextSection && nextSection.tagName.toLowerCase() !== 'section') {
        nextSection = nextSection.nextElementSibling as HTMLElement | null
      }
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div
      ref={arrowRef}
      className={`mt-10 animate-bounce transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="cursor-pointer flex items-center justify-center" onClick={handleScrollToNextSection}>
        <ChevronDown className="w-8 h-8 text-[var(--color-secondary)]" />
      </div>
    </div>
  )
} 