"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import AboutUs from "@/components/home/AboutUs"
import { useEffect, useState } from "react"

export default function AboutPageClient() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    setIsLoaded(true)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-48 md:pt-56 pb-20 px-6 lg:px-8">
        <Header scrollY={scrollY} isLoaded={isLoaded} />
        <AboutUs />
        <Footer />
      </section>
    </div>
  )
} 