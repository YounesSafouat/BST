"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import { useAnimation } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

interface ContentSection {
  _id: string
  type: string
  title: string
  description: string
  content: {
    subtitle?: string
  }
  metadata?: {
    color?: string
    image?: string
    order?: number
  }
  isActive: boolean
}

interface HeroSectionProps {
  hero: ContentSection
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const [integrationIndex, setIntegrationIndex] = useState(0)
  const [specificationIndex, setSpecificationIndex] = useState(0)
  const [locationIndex, setLocationIndex] = useState(0)
  const [logoRotationIndex, setLogoRotationIndex] = useState(0)

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

  if (!hero) return null

  // Replace this with your GIF URL
  const rendezVousGif = "/rendez-vous.gif"

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
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .companies-scroll {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .companies-track {
          display: inline-flex;
          animation: scroll 30s linear infinite;
        }

        .company-item {
          display: inline-block;
          padding: 0 2rem;
          font-size: 1.3rem;
          font-weight: 600;
          color: #6b7280;
          white-space: nowrap;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .text-flip-container {
          position: relative;
          height: 90px;
          overflow: hidden;
          display: inline-block;
          min-width: 400px;
          vertical-align: baseline;
        }

        .text-flip-track {
          position: absolute;
          width: 100%;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          top: 10px;
          left: 0;
        }

        .text-flip-item {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          line-height: 1;
        }

        .flip-logo {
          perspective: 1000px;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .flip-face {
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          position: absolute;
          top: 0; left: 0;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
        }

        .flip-front {
          z-index: 2;
          transform: rotateY(0deg);
        }

        .flip-back {
          transform: rotateY(180deg);
        }

        .flip-logo.flipped .flip-front {
          transform: rotateY(-180deg);
        }

        .flip-logo.flipped .flip-back {
          transform: rotateY(0deg);
          z-index: 2;
        }

        .logo-roulette-track {
          width: 100%;
          position: relative;
        }
        .logo-roulette-item {
          width: 100%;
          position: relative;
        }
      `}</style>

      <section className="relative min-h-screen pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2 leading-tight">
            {hero.description}
          </h1>

          {/* Avec Text Section */}
          <div className="flex items-center justify-center mb-8 gap-2">
            <span className="text-4xl md:text-6xl font-bold text-gray-900 align-middle">avec</span>
            <span
              className="inline-block align-middle relative overflow-hidden"
              style={{ height: "9em", width: "13em", fontSize: "inherit" }}
            >
              <div
                className="logo-roulette-track ml-1"
                style={{
                  transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                  transform: `translateY(-${(logoRotationIndex % 2) * 46.5}%)`,
                  height: "18em", // 2 * 9em
                  width: logoRotationIndex % 2 === 1 ? "11em" : "9em",
                  marginTop: logoRotationIndex % 2 === 1 ? "0" : "3px",
                  marginBottom: logoRotationIndex % 2 === 1 ? "2px" : "0"
                }}
              >
                <div className="logo-roulette-item " style={{ height: "9em" }}>
                  <Image
                    src="/odoo.svg"
                    alt="Odoo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="logo-roulette-item " style={{ height: "9em" }}>
                  <Image
                    src="/hubspot.svg"
                    alt="HubSpot"
                    fill
                    className="object-contain "
                    priority
                    
                  />
                </div>
              </div>
            </span>
          </div>

          {/* Subtitle */}
          <div
            className="text-lg text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: hero.content.subtitle || "" }}
          />

          {/* Feature Badges - WITH ROULETTE ANIMATIONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 relative z-10">
            {/* First Badge - What we integrate */}
            <div className="smooth-badge">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle className="w-3 h-3 text-orange-500" />
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
                <CheckCircle className="w-3 h-3 text-orange-500" />
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
                <CheckCircle className="w-3 h-3 text-orange-500" />
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
              <span className="ml-1 text-xs bg-white text-orange-500 px-1 py-0.5 rounded font-semibold flex-shrink-0 shadow-sm">
                {locations[locationIndex].code}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 relative z-10">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-6 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 bg-transparent">
                <Image
                  src="/calendar.png"
                  alt="Prendre un rendez-vous"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </span>
              PRENDRE UN RENDEZ-VOUS
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-6 font-bold border border-gray-300 text-gray-900 bg-white "
            >
              TOUS NOS PROJETS
            </Button>
          </div>

          {/* Companies Carousel */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

            <div className="companies-scroll">
              <div className="companies-track">
                {/* First set */}
                <div className="company-item">Odoo</div>
                <div className="company-item">HubSpot</div>
                <div className="company-item">Salesforce</div>
                <div className="company-item">Microsoft</div>
                <div className="company-item">Google</div>
                <div className="company-item">Zapier</div>
                <div className="company-item">Shopify</div>
                <div className="company-item">Stripe</div>

                {/* Duplicate for seamless loop */}
                <div className="company-item">Odoo</div>
                <div className="company-item">HubSpot</div>
                <div className="company-item">Salesforce</div>
                <div className="company-item">Microsoft</div>
                <div className="company-item">Google</div>
                <div className="company-item">Zapier</div>
                <div className="company-item">Shopify</div>
                <div className="company-item">Stripe</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
