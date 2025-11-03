"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import CompaniesCarousel from "@/components/CompaniesCarousel"
import { useGeolocationSingleton } from "@/hooks/useGeolocationSingleton"

export default function HeroSection() {
  const [homePageData, setHomePageData] = useState<any>(null)
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)
  const { region: userRegion } = useGeolocationSingleton()

  // Base colors (light mode defaults). Dark mode overrides via CSS variables below.
  const COLORS = {
    brandOrange: '#F25519',
    badgeText: '#410e09',
    sectionBg: '#F5FAFF',
    badgeBorder: '#e5e7eb',
    textPrimary: '#1e2844',
    orangeBorder: '#FED7AA',
    gradientTo: '#E33E13',
    glowSoft: 'rgba(242,85,25,0.28)',
    glowRing: 'rgba(242,85,25,0.26)'
  }

  const features = [
    "Intégration rapide",
    "Support 24/7",
    "Depuis la France"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [features.length])

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const cachedData = sessionStorage.getItem('homePageData')
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData)
            if (parsed.timestamp && (Date.now() - parsed.timestamp) < 5 * 60 * 1000) {
              setHomePageData(parsed.data)
              return
            }
          } catch (e) {
            // Cache parse error, fetch fresh data
          }
        }

        const response = await fetch('/api/content?type=home-page', {
          cache: 'force-cache',
          headers: {
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
            const homePageContent = data.find((item: any) => item.type === 'home-page')
            if (homePageContent && homePageContent.content) {
              setHomePageData(homePageContent.content)
              sessionStorage.setItem('homePageData', JSON.stringify({
                data: homePageContent.content,
                timestamp: Date.now()
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error fetching home page data:', error)
      }
    }

    fetchHomePageData()
  }, [])

  const companies = homePageData?.hero?.carousel?.companies || []
  const carouselText = homePageData?.hero?.carousel?.text || "Nos clients"

  return (
    <section 
      className="relative overflow-hidden px-6 py-44 hero-ctx"
      style={{ backgroundColor: 'var(--section-bg)' }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/hero BG.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'min(1400px, 92vw)',
          opacity: 'var(--bg-opacity)'
        }}
      />

      <div className="relative mx-auto max-w-6xl pt-6 md:pt-10">
        {/* Floating Orb Icons */}
        <div className="absolute -left-12 top-28 animate-float" style={{ animation: "float 6s ease-in-out infinite" }}>
          <div className="rounded-full p-3.5 w-16 h-16 flex items-center justify-center bg-white dark:bg-white/10" style={{ boxShadow: `0 0 0 8px rgba(255,255,255,0.6), 0 0 34px var(--glow-ring), 0 22px 64px rgba(17,0,56,0.1)` }}>
            <img src="/icones/odoo/inventory.svg" alt="Inventory" className="w-8 h-8" />
          </div>
        </div>
        <div className="absolute -right-14 top-32 animate-float" style={{ animation: "float 6s ease-in-out infinite 1s" }}>
          <div className="rounded-full p-3.5 w-16 h-16 flex items-center justify-center bg-white dark:bg-white/10" style={{ boxShadow: `0 0 0 8px rgba(255,255,255,0.6), 0 0 34px var(--glow-ring), 0 22px 64px rgba(17,0,56,0.1)` }}>
            <img src="/icones/odoo/manufacturing.svg" alt="Manufacturing" className="w-8 h-8" />
          </div>
        </div>
        <div className="absolute left-0 top-1/2 animate-float" style={{ animation: "float 6s ease-in-out infinite 0.5s" }}>
          <div className="rounded-full p-3.5 w-16 h-16 flex items-center justify-center bg-white dark:bg-white/10" style={{ boxShadow: `0 0 0 8px rgba(255,255,255,0.6), 0 0 34px var(--glow-ring), 0 22px 64px rgba(17,0,56,0.1)` }}>
            <img src="/icones/odoo/point-of-sale.svg" alt="Point of Sale" className="w-8 h-8" />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 animate-float" style={{ animation: "float 6s ease-in-out infinite 1.5s" }}>
          <div className="rounded-full p-3.5 w-16 h-16 flex items-center justify-center bg-white dark:bg-white/10" style={{ boxShadow: `0 0 0 8px rgba(255,255,255,0.6), 0 0 34px var(--glow-ring), 0 22px 64px rgba(17,0,56,0.1)` }}>
            <img src="/icones/odoo/CRM.svg" alt="CRM" className="w-8 h-8" />
          </div>
        </div>

        {/* Features Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-6 max-w-max mx-auto "
        >
          {features.map((text, idx) => {
            const Icon = () => {
              if (text.toLowerCase().includes('intégration')) {
                // lightning bolt
                return (
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden style={{ color: 'var(--brand)' }}>
                    <path d="M11 3L6 13h5l-2 8 8-13h-6l2-5z" fill="currentColor" />
                  </svg>
                )
              }
              if (text.toLowerCase().includes('support')) {
                // headset
                return (
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden style={{ color: 'var(--brand)' }}>
                    <path d="M6 13v-1a6 6 0 1112 0v1a3 3 0 01-3 3h-1v-3h3v-1a5 5 0 10-10 0v1h3v3H9a3 3 0 01-3-3z" fill="currentColor" />
                  </svg>
                )
              }
              // location/pin for France
              return (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden style={{ color: 'var(--brand)' }}>
                  <path d="M12 6a5 5 0 00-5 5c0 3.6 5 7.5 5 7.5S17 14.6 17 11a5 5 0 00-5-5zm0 7a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor" />
                </svg>
              )
            }
            return (
              <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-white/96 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <Icon />
                <span className="text-[14px] sm:text-[15px] font-medium uppercase leading-none tracking-wide whitespace-nowrap" style={{ color: 'var(--badge-text)' }}>{text}</span>
              </div>
            )
          })}
        </motion.div>

        <div className="text-center mb-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.15] max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-1"
            style={{ color: 'var(--text)' }}
          >
            <span className="font-semibold" style={{ color: 'var(--brand)' }}>Nous intégrons</span>
            <span className="font-semibold ml-2 flex items-center" style={{ color: 'var(--brand)' }}>Odoo
              <span className="inline-flex items-center align-baseline ml-1">
                <span className="rounded-full p-[4px] flex items-center justify-center w-10 h-10 animate-float bg-white dark:bg-white/10" style={{ border: `1px solid var(--orange-border)`, animation: "float 6s ease-in-out infinite", boxShadow: `0 0 0 6px rgba(255,255,255,0.65), 0 0 30px var(--glow-soft)` }}>
                  <img src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/Odoo.ico" alt="Odoo Icon" className="w-7 h-7 align-bottom" />
                </span>
              </span>
            </span>
            <span className="ml-2">pour piloter toute votre entreprise.</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.33 }}
          className="mb-6 text-center text-[15px] sm:text-base text-gray-500 font-normal max-w-2xl mx-auto"
        >
          Automatisez, centralisez et optimisez votre entreprise avec une solution Odoo sur mesure.
        </motion.p>

        <div className="flex flex-col items-center gap-3 mb-6">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            <Button
              size="lg"
              className="flex items-center gap-2 rounded-full px-6 py-2.5 text-white font-semibold transition shadow-[0_0_0_6px_rgba(0,0,0,0.05)] hover:brightness-105"
              style={{ backgroundImage: `linear-gradient(var(--brand), var(--gradient-to))` }}
            >
              Planifier un rendez-vous
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className="text-xs text-gray-400 font-normal">
            Sans engagement • 20 minutes
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }} className="pt-2 pb-0 mb-12">
          <CompaniesCarousel companies={companies} userRegion={userRegion} text={carouselText} speed={60} />
        </motion.div>
        
      </div>

      <style jsx>{`
        /* Light mode defaults for this hero context */
        .hero-ctx {
          --brand: ${COLORS.brandOrange};
          --text: ${COLORS.textPrimary};
          --section-bg: ${COLORS.sectionBg};
          --badge-text: ${COLORS.badgeText};
          --badge-border: ${COLORS.badgeBorder};
          --orange-border: ${COLORS.orangeBorder};
          --gradient-to: ${COLORS.gradientTo};
          --glow-soft: ${COLORS.glowSoft};
          --glow-ring: ${COLORS.glowRing};
          --bg-opacity: 0.25;
        }

        /* Dark mode overrides */
        :global(.dark) .hero-ctx {
          --brand: #1AD3BB;                 /* teal brand in dark */
          --text: #FFFFFF;                  /* white text */
          --section-bg: #000000;            /* black background */
          --badge-text: #E5E7EB;            /* light gray text on badges */
          --badge-border: rgba(255,255,255,0.12);
          --orange-border: rgba(255,255,255,0.25);
          --gradient-to: #f6ff47;          /* teal to lime */
          --glow-soft: rgba(26,211,187,0.35);
          --glow-ring: rgba(26,211,187,0.28);
          --bg-opacity: 0.15;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  )
}

