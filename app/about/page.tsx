"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import AboutUs from "@/components/home/AboutUs"
import { useEffect, useState } from "react"

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    setIsLoaded(true)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Header scrollY={scrollY} isLoaded={isLoaded} />
      <AboutUs />
      <Footer />
    </>
  )
}
