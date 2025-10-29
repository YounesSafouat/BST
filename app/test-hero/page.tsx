"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import CompaniesCarousel from "@/components/CompaniesCarousel"
import { useGeolocationSingleton } from "@/hooks/useGeolocationSingleton"

export default function HeroSection() {
  const [homePageData, setHomePageData] = useState<any>(null)
  const { region: userRegion } = useGeolocationSingleton()

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-main)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-main)] via-blue-600 to-[var(--color-main)]"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center space-y-8 lg:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="w-[200px] sm:w-[250px] h-[80px] sm:h-[100px] flex items-center justify-center">
              <img
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png"
                alt="Odoo Silver Partner Badge"
                className="h-auto w-full object-contain"
              />
            </div>
          </motion.div>

          <div className="space-y-6 lg:space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-5xl mx-auto"
              style={{ lineHeight: '1.1' }}
            >
              Intégration{" "}
              <span className="italic font-semibold" style={{ color: 'var(--color-secondary)' }}>
                Odoo
              </span>{" "}
              ERP
              <br />
              <span className="text-white">clé en main</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Automatisez, centralisez et optimisez votre entreprise avec une solution Odoo sur mesure.
              <br />
              <span className="font-semibold text-white">Intégration fluide en 60 jours.</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4"
          >
            {[
              { label: "Intégration rapide" },
              { label: "Support 24/7" },
              { label: "Depuis la France" }
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4"
          >
            <Button
              size="lg"
              className="bg-[var(--color-secondary)] hover:bg-white text-white hover:text-[var(--color-main)] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full group shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Prendre un rendez-vous
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 hover:bg-white/20 hover:border-white/60 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300"
            >
              Voir nos projets
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base text-white/90 font-medium pt-4"
          >
            + de 2000 entreprises nous font confiance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="pt-12 sm:pt-16 border-t border-white/20 mt-12 sm:mt-16"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
              <div className="flex -space-x-3">
                {['A', 'B', 'C', '+50'].map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="w-12 h-12 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-main)] flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-transform cursor-default"
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
              <span className="text-sm sm:text-base text-white flex items-center gap-1.5">
                <span className="text-yellow-400 text-lg sm:text-xl">⭐⭐⭐⭐⭐</span>
                <span>100% de satisfaction</span>
              </span>
            </div>

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

