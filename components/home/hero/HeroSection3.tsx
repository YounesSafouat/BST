"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, ArrowUpRight, ArrowRight } from "lucide-react"
import { useAnimation } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import dynamic from 'next/dynamic'
import { ContentSection, HeroContent } from "@/app/types/content"
import { useRouter } from "next/navigation"

// Import SplineScene with no SSR to avoid hydration issues
const SplineScene = dynamic(() => import('./SplineScene'), { ssr: false })

interface HeroSection3Props {
  hero: ContentSection
}

export default function HeroSection3({ hero }: HeroSection3Props) {
  const router = useRouter()
  const [logoRotationIndex, setLogoRotationIndex] = useState(0)
  const [integrationIndex, setIntegrationIndex] = useState(0)
  const [specificationIndex, setSpecificationIndex] = useState(0)
  const [locationIndex, setLocationIndex] = useState(0)

  // What we integrate
  const integrations = [
    "Intégration Odoo",
    "Synchronisation HubSpot",
    "Connexion Salesforce",
    "API Microsoft",
    "Intégration Shopify",
  ]

  // Our specifications
  const specifications = [
    "Livraison rapide",
    "Solutions sur mesure",
    "Support 24/7",
    "Formation incluse",
    "Maintenance garantie",
  ]

  // Locations
  const locations = [
    { text: "Depuis Casablanca", flag: "🇲🇦", code: "MA" },
    { text: "Depuis Paris", flag: "🇫🇷", code: "FR" },
    { text: "Depuis Dubai", flag: "🇦🇪", code: "AE" },
    { text: "Depuis Londres", flag: "🇬🇧", code: "GB" },
  ]

  const logoControls = useAnimation()
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrationIndex((prev) => (prev + 1) % integrations.length)
      setSpecificationIndex((prev) => (prev + 1) % specifications.length)
      setLocationIndex((prev) => (prev + 1) % locations.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [integrations.length, specifications.length, locations.length])

  // Separate interval for logo rotation (2 seconds)
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setLogoRotationIndex((prev) => (prev + 1) % 2)
    }, 2000)
    return () => clearInterval(logoInterval)
  }, [])

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          logoControls.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } })
        }
      },
      { threshold: 0.5 },
    )
    if (logoRef.current) observer.observe(logoRef.current)
    return () => {
      if (logoRef.current) observer.unobserve(logoRef.current)
    }
  }, [logoControls])

  const handleAppointmentClick = async () => {
    await router.push('/contact')
  }

  const handleProjectsClick = async () => {
    await router.push('/contact')
  }

  if (!hero) return null

  return (
    <>
      <style jsx>{`
        .smooth-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .smooth-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .roulette-container {
          position: relative;
          height: 20px;
          min-width: 140px;
          overflow: hidden;
        }

        .roulette-track {
          position: absolute;
          width: 100%;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .roulette-item {
          height: 20px;
          font-size: var(--font-size);
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .spline-column {
          position: sticky;
          top: 0;
          height: 100vh;
        }

        @media (max-width: 768px) {
          .spline-column {
            position: relative;
            height: 50vh;
          }
        }
      `}</style>

      <section className="relative mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column - Text and Buttons */}
            <div className="px-6 pt-20 md:pt-32 pb-20">
              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {hero.description}
              </h1>

              {/* Subtitle */}
              <div
                className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: (hero.content as any).subtitle || "" }}
              />

              {/* Feature Badges */}
              <div className="flex flex-wrap items-start gap-4 mb-12">
                {/* First Badge - What we integrate */}
                <div className="smooth-badge">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--color-main)]" />
                  </div>
                  <div className="roulette-container">
                    <div
                      className="roulette-track"
                      style={{
                        transform: `translateY(${-integrationIndex * 20}px)`,
                      }}
                    >
                      {integrations.map((text, i) => (
                        <div key={i} className="roulette-item">
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Second Badge - Our specifications */}
                <div className="smooth-badge">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--color-main)]" />
                  </div>
                  <div className="roulette-container">
                    <div
                      className="roulette-track"
                      style={{
                        transform: `translateY(${-specificationIndex * 20}px)`,
                      }}
                    >
                      {specifications.map((text, i) => (
                        <div key={i} className="roulette-item">
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Third Badge - Locations */}
                <div className="smooth-badge">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--color-main)]" />
                  </div>
                  <div className="roulette-container">
                    <div
                      className="roulette-track"
                      style={{
                        transform: `translateY(${-locationIndex * 20}px)`,
                      }}
                    >
                      {locations.map((location, i) => (
                        <div key={i} className="roulette-item">
                          {location.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="ml-1 text-xs bg-white text-[var(--color-main)] px-1 py-0.5 rounded font-semibold flex-shrink-0 shadow-sm">
                    {locations[locationIndex].code}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <button
                  onClick={handleAppointmentClick}
                  className="group w-[18em] bg-[var(--color-main)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-black)] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                  style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                >
                  PRENDRE UN RENDEZ-VOUS
                  <ArrowRight className="ml-5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleProjectsClick}
                  className="group w-[18em] bg-transparent text-[var(--color-main)] border-2 border-[var(--color-main)] px-4 py-2 rounded-lg hover:bg-[var(--color-main)] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                  style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                >
                  NOS PROJETS
                  <ArrowRight className="ml-5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="md:fixed md:top-0 md:right-0 md:w-1/2 md:h-screen relative">
              <div className="relative w-full h-[50vh] md:h-screen">
                <Image
                  src="/hero-digital-transformation.png"
                  alt="Digital Transformation"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 