"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Calendar, Play, CheckCircle, Zap, Shield, FolderSync as Sync, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/app/types/content"
import { useRouter } from "next/navigation"

export default function HeroSection6() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSync, setActiveSync] = useState(0)
  const [matrixText, setMatrixText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [currentPlatform, setCurrentPlatform] = useState(0)
  const [integrationStatus, setIntegrationStatus] = useState(0)
  const [isTextFlipping, setIsTextFlipping] = useState(false)

  const syncSteps = [
    "Audit des systèmes", 
    "Développement Agile", 
    "Déploiement Sécurisé", 
    "Optimisation Continue"
  ]

  const integrationStatuses = [
    { text: "Architectes de votre transformation", icon: Activity, color: "green", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { text: "Experts Odoo & HubSpot", icon: Sync, color: "blue", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { text: "Solutions 100% sur-mesure", icon: Shield, color: "purple", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
    { text: "Automatisation de vos processus", icon: Zap, color: "orange", bgColor: "bg-orange-50", borderColor: "border-orange-200" }
  ]

  const platforms = ["ODOO", "HUBSPOT"]
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?"

  // Matrix text effect
  useEffect(() => {
    const targetText = platforms[currentPlatform]
    let currentIndex = 0
    let scrambleCount = 0
    const maxScrambles = 8

    const interval = setInterval(() => {
      if (scrambleCount < maxScrambles) {
        // Scramble phase
        let scrambled = ""
        for (let i = 0; i < targetText.length; i++) {
          if (i < currentIndex) {
            scrambled += targetText[i]
          } else {
            scrambled += matrixChars[Math.floor(Math.random() * matrixChars.length)]
          }
        }
        setMatrixText(scrambled)
        scrambleCount++
      } else {
        // Reveal next character
        currentIndex++
        if (currentIndex > targetText.length) {
          clearInterval(interval)
          // Switch to next platform after a delay
          setTimeout(() => {
            setCurrentPlatform((prev) => (prev + 1) % platforms.length)
          }, 2000)
        } else {
          scrambleCount = 0
        }
      }
    }, 50)

    return () => clearInterval(interval)
  }, [currentPlatform])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    setIsVisible(true)
    
    // Sync steps animation
    const syncInterval = setInterval(() => {
      setActiveSync((prev) => (prev + 1) % syncSteps.length)
    }, 3000)
    
    // Integration status animation with text flip effect
    const statusInterval = setInterval(() => {
      setIsTextFlipping(true)
      setTimeout(() => {
        setIntegrationStatus((prev) => (prev + 1) % integrationStatuses.length)
        setTimeout(() => {
          setIsTextFlipping(false)
        }, 150)
      }, 300)
    }, 4000)
    
    return () => {
      clearInterval(syncInterval)
      clearInterval(statusInterval)
    }
  }, [])

  const currentStatus = integrationStatuses[integrationStatus]
  const StatusIcon = currentStatus.icon

  return (
    <section className="min-h-screen bg-white flex items-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Animated Status with Text-Only Flip */}
            <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-full border transition-all duration-1000 ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
              <div className="relative">
                <div className={`w-2 h-2 bg-${currentStatus.color}-500 rounded-full animate-pulse`}></div>
                <div className={`absolute inset-0 w-2 h-2 bg-${currentStatus.color}-500 rounded-full animate-ping opacity-75`}></div>
              </div>
              <StatusIcon className={`w-4 h-4 text-${currentStatus.color}-600 transition-all duration-300`} />
              <div className="relative overflow-hidden">
                <span 
                  className={`text-sm font-medium text-${currentStatus.color}-700 transition-all duration-300 inline-block`}
                  style={{
                    transform: isTextFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center'
                  }}
                >
                  {currentStatus.text}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                L'automatisation au cœur
                <br />
                <span style={{ color: 'var(--color-secondary)' }}>de votre </span>
                <span style={{ color: 'var(--color-main)' }}>métier.</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg">
                Nous concevons votre écosystème digital sur-mesure avec Odoo ou HubSpot pour transformer vos opérations et accélérer votre croissance.
              </p>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <button 
                className="group w-[18em] bg-[var(--color-main)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-black)] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
              >
                Démo gratuite
                <ArrowRight className="ml-5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                className="group w-[18em] bg-transparent text-[var(--color-main)] border-2 border-[var(--color-main)] px-4 py-2 rounded-lg hover:bg-[var(--color-main)] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
              >
                Voir comment ça marche
                <ArrowRight className="ml-5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

           
          </div>

          {/* Right Column - White Terminal */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-600 text-sm ml-2">Console de Déploiement</span>
              </div>

              {/* Terminal Content */}
              <div className="p-8 space-y-8">
                
                {/* Matrix Text Display */}
                <div className="text-center py-6">
                  <div className="font-mono text-5xl font-bold mb-3">
                    <span 
                      style={{ 
                        color: currentPlatform === 0 ? 'var(--color-secondary)' : 'var(--color-main)',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {matrixText}
                    </span>
                    <span 
                      className={`inline-block w-1 h-12 ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                      style={{ 
                        backgroundColor: currentPlatform === 0 ? 'var(--color-secondary)' : 'var(--color-main)',
                        transition: 'all 0.1s ease'
                      }}
                    ></span>
                  </div>
                  <div className="text-gray-500 text-sm">Déploiement de la solution...</div>
                </div>

                {/* Platform Logos */}
                <div className="flex justify-center items-center gap-12">
                  {/* Odoo Logo */}
                  <div className={`transition-all duration-700 ${currentPlatform === 0 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
                    <div 
                      className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-500"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: currentPlatform === 0 ? 'var(--color-secondary)' : 'var(--color-gray)',
                        transform: currentPlatform === 0 ? 'translateY(-4px)' : 'translateY(0)'
                      }}
                    >
                      <img src="/Odoo.svg" alt="Odoo Logo" className="w-16 h-16" />
                    </div>
                    <div className="text-center mt-3 text-sm font-semibold" style={{ color: currentPlatform === 0 ? 'var(--color-secondary)' : 'var(--color-gray)' }}>
                      Solution Odoo
                    </div>
                  </div>

                  {/* HubSpot Logo */}
                  <div className={`transition-all duration-700 ${currentPlatform === 1 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
                    <div 
                      className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-500"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: currentPlatform === 1 ? 'var(--color-main)' : 'var(--color-gray)',
                        transform: currentPlatform === 1 ? 'translateY(-4px)' : 'translateY(0)'
                      }}
                    >
                      <img src="/hubspot.svg" alt="HubSpot Logo" className="w-16 h-16" />
                    </div>
                    <div className="text-center mt-3 text-sm font-semibold" style={{ color: currentPlatform === 1 ? 'var(--color-main)' : 'var(--color-gray)' }}>
                      Solution HubSpot
                    </div>
                  </div>
                </div>

                {/* Sync Status */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-sm font-medium">{syncSteps[activeSync]}</span>
                  </div>
                </div>

                {/* Enhanced Success Message with Text-Only Flip */}
                <div className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-1000 ${currentStatus.bgColor} ${currentStatus.borderColor} border`}>
                  <div className="relative">
                    <StatusIcon className={`w-5 h-5 text-${currentStatus.color}-600`} />
                    <div className={`absolute inset-0 w-5 h-5 text-${currentStatus.color}-600 animate-pulse opacity-50`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <span 
                      className={`text-${currentStatus.color}-700 text-sm font-semibold inline-block`}
                      style={{
                        transform: isTextFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center'
                      }}
                    >
                      {currentStatus.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}