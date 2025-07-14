"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Calendar, ArrowUpRight, ArrowRight } from "lucide-react"
import { useAnimation } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { ContentSection, HeroContent } from "@/app/types/content"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface HeroSection2Props {
  hero: ContentSection
}

export default function HeroSection({ hero }: HeroSection2Props) {
  const router = useRouter()
  const [logoRotationIndex, setLogoRotationIndex] = useState(0)
  const [integrationIndex, setIntegrationIndex] = useState(0)
  const [specificationIndex, setSpecificationIndex] = useState(0)
  const [locationIndex, setLocationIndex] = useState(0)

  // Get data from hero content
  const heroContent = hero.content as any
  const integrations = heroContent?.integrations || []
  const specifications = heroContent?.specifications || []
  const locations = heroContent?.locations || []
  const logos = heroContent?.logos || {}
  const ctaButtons = heroContent?.ctaButtons || {}
  const companies = heroContent?.companies || []
  const animations = heroContent?.animations || {}

  const logoControls = useAnimation()
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (integrations.length > 0) {
        setIntegrationIndex((prev) => (prev + 1) % integrations.length)
      }
      if (specifications.length > 0) {
        setSpecificationIndex((prev) => (prev + 1) % specifications.length)
      }
      if (locations.length > 0) {
        setLocationIndex((prev) => (prev + 1) % locations.length)
      }
    }, animations.rouletteInterval || 5000)
    return () => clearInterval(interval)
  }, [integrations.length, specifications.length, locations.length, animations.rouletteInterval])

  // Separate interval for logo rotation
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setLogoRotationIndex((prev) => (prev + 1) % 2)
    }, animations.logoRotationInterval || 2000)
    return () => clearInterval(logoInterval)
  }, [animations.logoRotationInterval])

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

  const handleAppointmentClick = () => {
    router.push(ctaButtons.primary?.url || '/contact')
  }

  const handleProjectsClick = () => {
    router.push(ctaButtons.secondary?.url || '/cas-client')
  }

  if (!hero) return null

  return (
    <>
      <style jsx>{`
        .logo-container {
          position: relative;
          height: 80px;
          width: 100%;
          overflow: hidden;
          margin-top: -10px;
        }

        .logo-track {
          position: absolute;
          width: 100%;
          height: 200%;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .logo-item {
          height: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .logo-item-inner {
          width: 300px;
          height: 80px;
          position: relative;
        }

        .bg-odoo {
          padding: 8px;
        }

        .bg-hubspot {
          padding: 8px;
        }

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
          color: var(--color-gray);
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .companies-scroll {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          padding: 0.5rem 0;
        }

        .companies-track {
          display: inline-flex;
          animation: scroll 30s linear infinite;
        }

        .company-item {
          display: inline-block;
          padding: 0 2rem;
          font-size: var(--heading-font-size);
          font-weight: 600;
          color: var(--color-gray);
          white-space: nowrap;
        }
        .company-item img, .company-item .object-contain {
          opacity: 1 !important;
          filter: none !important;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cta-button-primary {
          background: linear-gradient(135deg, var(--color-main) 0%, var(--color-secondary) 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-width: 280px;
          box-shadow: 
            0 8px 32px rgba(102, 126, 234, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .cta-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .cta-button-primary:hover::before {
          left: 100%;
        }

        .cta-button-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 12px 40px var(--color-white),
            0 6px 20px var(--color-black);
        }

        .cta-button-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-main);
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 14px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-width: 280px;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .cta-button-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <section className="relative min-h-screen pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Description in one line */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-black)' }}>
            {hero.description}
          </h1>

          {/* "avec" in a separate line */}
          <div className="text-4xl md:text-6xl font-bold mb-8" style={{ color: 'var(--color-black)' }}>
            de A à Z grâce à
          </div>

          {/* Logo Section with vertical rotation */}
          {logos.odoo && logos.hubspot && (
            <div className="logo-container mb-12">
              <div
                className="logo-track"
                style={{
                  transform: `translateY(-${logoRotationIndex * 50}%)`
                }}
              >
                <div className="logo-item bg-odoo">
                  <div className="logo-item-inner">
                    <Image
                      src={logos.odoo.url}
                      alt={logos.odoo.alt}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div className="logo-item bg-hubspot">
                  <div className="logo-item-inner">
                    <Image
                      src={logos.hubspot.url}
                      alt={logos.hubspot.alt}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtitle */}
          <div
            className="text-lg mb-4 max-w-4xl mx-auto leading-relaxed"
            style={{
              color: 'var(--color-gray)',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--font-size)',
              lineHeight: 'var(--line-height)',
            }}
            dangerouslySetInnerHTML={{ __html: heroContent.subtitle || "" }}
          />

          {/* Feature Badges - WITH ROULETTE ANIMATIONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 relative z-10">
            {/* First Badge - What we integrate */}
            {integrations.length > 0 && (
              <div className="smooth-badge">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-3 h-3" style={{ color: 'var(--color-main)' }} />
                </div>
                <div className="roulette-container">
                  <div
                    className="roulette-track"
                    style={{
                      transform: `translateY(${-integrationIndex * 20}px)`,
                    }}
                  >
                    {integrations.map((integration: any, i: number) => (
                      <div key={i} className="roulette-item">
                        {integration.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Second Badge - Our specifications */}
            {specifications.length > 0 && (
              <div className="smooth-badge">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-3 h-3" style={{ color: 'var(--color-main)' }} />
                </div>
                <div className="roulette-container">
                  <div
                    className="roulette-track"
                    style={{
                      transform: `translateY(${-specificationIndex * 20}px)`,
                    }}
                  >
                    {specifications.map((specification: any, i: number) => (
                      <div key={i} className="roulette-item">
                        {specification.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Third Badge - Locations */}
            {locations.length > 0 && (
              <div className="smooth-badge">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-3 h-3" style={{ color: 'var(--color-main)' }} />
                </div>
                <div className="roulette-container">
                  <div
                    className="roulette-track"
                    style={{
                      transform: `translateY(${-locationIndex * 20}px)`,
                    }}
                  >
                    {locations.map((location: any, i: number) => (
                      <div key={i} className="roulette-item">
                        {location.text}
                      </div>
                    ))}
                  </div>
                </div>
                <span className="ml-1 text-xs bg-white px-1 py-0.5 rounded font-semibold flex-shrink-0 shadow-sm" style={{ color: 'var(--color-secondary)' }}>
                  {locations[locationIndex]?.code}
                </span>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 relative z-10">
            {ctaButtons.primary && (
              <button
                onClick={handleAppointmentClick}
                className="cta-button-primary"
              >
                {ctaButtons.primary.text}
                <Calendar className="w-5 h-5" />
              </button>
            )}

            {ctaButtons.secondary && (
              <button
                onClick={handleProjectsClick}
                className="cta-button-secondary"
              >
                {ctaButtons.secondary.text}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Companies Carousel */}
          {companies.length > 0 && (
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 w-20 h-full z-10" style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }}></div>
              <div className="absolute right-0 top-0 w-20 h-full z-10" style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }}></div>

              <div className="companies-scroll">
                <div
                  className="companies-track"
                  style={{ animationDuration: `${animations.companyScrollDuration || 30}s` }}
                >
                  {/* First set */}
                  {companies.map((company: any, index: number) => (
                    <div key={`first-${index}`} className="company-item">
                      {company.logo ? (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={120}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        company.name
                      )}
                    </div>
                  ))}

                  {/* Duplicate for seamless loop */}
                  {companies.map((company: any, index: number) => (
                    <div key={`second-${index}`} className="company-item">
                      {company.logo ? (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={120}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        company.name
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}