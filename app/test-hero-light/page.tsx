"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import CompaniesCarousel from "@/components/CompaniesCarousel"
import { useGeolocationSingleton } from "@/hooks/useGeolocationSingleton"

export default function HeroSection() {
  const [homePageData, setHomePageData] = useState<any>(null)
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)
  const { region: userRegion } = useGeolocationSingleton()

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--color-main)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[var(--color-main)] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center space-y-8 lg:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-3 sm:mb-4"
          >
            <div className="w-[120px] sm:w-[180px] h-[50px] sm:h-[70px] flex items-center justify-center">
              <img
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/silverBadge.png"
                alt="Odoo Silver Partner Badge"
                className="h-auto w-full object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pb-4"
          >
            <div className="flex -space-x-3">
              {['A', 'B', 'C', '+50'].map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="w-12 h-12 rounded-full bg-[var(--color-main)] border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-transform cursor-default"
                >
                  {letter}
                </motion.div>
              ))}
            </div>
            <span className="text-sm sm:text-base text-gray-900 flex items-center gap-1.5">
              <span className="text-yellow-400 text-lg sm:text-xl">⭐⭐⭐⭐⭐</span>
              <span>100% de satisfaction</span>
            </span>
          </motion.div>

          <div className="space-y-6 lg:space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight max-w-5xl mx-auto"
              style={{ lineHeight: '1.1' }}
            >
              Intégration{" "}
              <span className="italic font-semibold" style={{ color: 'var(--color-main)' }}>
                Odoo
              </span>{" "}
              ERP
              <br />
              <span className="text-gray-900">clé en main</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Automatisez, centralisez et optimisez votre entreprise avec une solution Odoo sur mesure.
              <br />
              <span className="font-semibold text-gray-900">Intégration fluide en 60 jours.</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4"
          >
            {[0, 1, 2].map((badgeIndex) => {
              const currentText = features[(currentFeatureIndex + badgeIndex) % features.length]
              return (
                <motion.div
                  key={badgeIndex}
                  layout
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 hover:border-gray-300"
                  transition={{
                    layout: { 
                      duration: 0.5, 
                      ease: [0.25, 0.1, 0.25, 1],
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }
                  }}
                >
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--color-main)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <motion.div 
                    layout
                    className="relative h-5 sm:h-6"
                    transition={{
                      layout: { 
                        duration: 0.5, 
                        ease: [0.25, 0.1, 0.25, 1],
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${badgeIndex}-${currentFeatureIndex + badgeIndex}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          delay: badgeIndex * 0.05
                        }}
                        className="inline-block text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap"
                      >
                        {currentText}
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4"
          >
            <Button
              size="lg"
              className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full group shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Prendre un rendez-vous
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[var(--color-main)] hover:bg-[var(--color-main)] text-[var(--color-main)] hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300"
            >
              Voir nos projets
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base text-gray-700 font-medium pt-4"
          >
            + de 2000 entreprises nous font confiance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="pt-12 sm:pt-16 border-t border-gray-200 mt-12 sm:mt-16"
          >
            <CompaniesCarousel
              companies={companies}
              userRegion={userRegion}
              text={carouselText}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

