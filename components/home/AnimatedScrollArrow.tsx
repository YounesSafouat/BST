"use client"

import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from "react"

export default function AnimatedScrollArrow() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`mt-10 animate-bounce transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="cursor-pointer flex items-center justify-center" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <ChevronDown className="w-8 h-8 text-[#714b67]" />
      </div>
    </div>
  )
} 