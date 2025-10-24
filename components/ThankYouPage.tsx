"use client"

import { CheckCircle2, Sparkles, Zap, Target, Globe, ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Link from 'next/link'

export function ThankYouPageDark() {
  const [isVisible, setIsVisible] = useState(false)
  const [clientCase, setClientCase] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch Qweekle client case
  useEffect(() => {
    const fetchClientCase = async () => {
      try {
        const response = await fetch('/api/cas-client/qweekle')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setClientCase(data)
          }
        }
      } catch (error) {
        console.error('Error fetching client case:', error)
      }
    }

    fetchClientCase()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(13, 165, 233, 0.5) 0%, transparent 70%)",
            animation: "float 7s ease-in-out infinite",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes radar {
          0% {
            box-shadow: 0 0 0 0 rgba(13, 165, 233, 0.7), 0 0 0 10px rgba(13, 165, 233, 0.5), 0 0 0 20px rgba(13, 165, 233, 0.3);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(13, 165, 233, 0.5), 0 0 0 20px rgba(13, 165, 233, 0.3), 0 0 0 30px rgba(13, 165, 233, 0);
          }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(13, 165, 233, 0.3), inset 0 0 20px rgba(13, 165, 233, 0.1); }
          50% { box-shadow: 0 0 30px rgba(13, 165, 233, 0.5), inset 0 0 30px rgba(13, 165, 233, 0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 mb-10 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              boxShadow: isVisible ? "0 0 40px rgba(13, 165, 233, 0.6), 0 0 80px rgba(13, 165, 233, 0.3)" : "none",
              transition: "all 0.7s ease-out",
            }}
          >
            <CheckCircle2 className="w-12 h-12 text-white drop-shadow-lg" />
          </div>

          <h1
            className={`text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 text-balance transition-all duration-700 delay-100 leading-tight ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Merci !
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500">
              Nous avons reçu votre message.
            </span>
          </h1>

          <p
            className={`text-xl sm:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto text-balance transition-all duration-700 delay-200 font-light leading-relaxed ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Notre équipe d'experts Odoo examine votre demande et vous contactera très bientôt pour discuter de votre transformation digitale. 
            En attendant, vous pouvez nous appeler ou nous écrire sur WhatsApp.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {[
              { icon: Zap, text: "Partenaire Officiel Odoo" },
              { icon: Target, text: "Expertise ERP" },
              { icon: Globe, text: "Expertise Internationale" },
            ].map((badge, index) => (
              <div
                key={badge.text}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800/60 backdrop-blur-xl border border-cyan-200/50 text-slate-200 transition-all duration-500 hover:bg-slate-800/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 group ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
              >
                <badge.icon className="w-5 h-5 text-cyan-600 group-hover:text-cyan-500 transition-colors" />
                <span className="font-semibold text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Case Section */}
        {clientCase && (
          <div
            className={`relative mt-32 transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Notre dernier projet : Qweekle
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Premium grid layout with enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Large featured image - spans 2 columns */}
              <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl group cursor-pointer h-96 md:h-full shadow-2xl">
                <img
                  src={clientCase.media?.coverImage || clientCase.media?.cardBackgroundImage}
                  alt={clientCase.name || "Project"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 group-hover:to-black/60 transition-all duration-700"></div>

                {/* Client logo overlay with enhanced styling */}
                <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl">
                  <img
                    src={clientCase.company?.logo}
                    alt={clientCase.name}
                    className="h-8 w-auto opacity-100 drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Top right - Metric 1 with enhanced gradient */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border border-cyan-400/60 p-8 flex flex-col justify-center hover:border-cyan-300 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400 to-transparent opacity-30 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-6xl font-black text-cyan-400 mb-3 relative z-10">
                  {clientCase.sidebarInfo?.find((item: any) => item.key === "Taux de conversion (lead → signature)")?.value?.replace(/[^\d]/g, '') || '+42%'}
                </p>
                <p className="text-sm text-slate-200 font-bold relative z-10 uppercase tracking-wide">
                  Amélioration conversion
                </p>
              </div>

              {/* Bottom right - Metric 2 with enhanced styling */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border border-cyan-400/40 p-8 flex flex-col justify-center hover:from-slate-600 hover:to-slate-600 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-cyan-500/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400 to-transparent opacity-25 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-6xl font-black text-white mb-3 relative z-10">
                  {clientCase.project?.duration?.replace(/[^\d]/g, '') || '30'}j
                </p>
                <p className="text-sm text-cyan-300 font-bold relative z-10 uppercase tracking-wide">Déploiement</p>
              </div>
            </div>

            {/* Bottom section - Headline and CTA */}
            <div className="relative">
              <div className="max-w-4xl">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight text-balance">
                  {clientCase.headline?.split(':')[0] || 'Structurer le pilotage commercial'}
                </h2>

                <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl font-light leading-relaxed">
                  {clientCase.summary || 'Découvrez comment nous avons aidé Qweekle à transformer sa gestion commerciale et augmenter ses conversions de 42% en seulement 30 jours avec Odoo.'}
                </p>

                <Link href={`/cas-client/${clientCase.slug}`} className="inline-block">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-cyan-500 via-cyan-500 to-blue-600 hover:from-cyan-400 hover:via-cyan-400 hover:to-blue-500 text-white font-bold px-12 py-7 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center gap-3 text-lg group shadow-lg"
                  >
                    Découvrir tous nos cas client
                    <ExternalLink className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div
          className={`text-center mt-20 transition-all duration-700 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-slate-400 text-lg">
            Des questions sur votre transformation digitale ?{" "}
            <span className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors cursor-pointer">
              Contactez-nous
            </span>{" "}
            à tout moment.
          </p>
        </div>
      </main>
    </div>
  )
}

export function ThankYouPageLight() {
  const [isVisible, setIsVisible] = useState(false)
  const [clientCase, setClientCase] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch Qweekle client case
  useEffect(() => {
    const fetchClientCase = async () => {
      try {
        const response = await fetch('/api/cas-client/qweekle')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setClientCase(data)
          }
        }
      } catch (error) {
        console.error('Error fetching client case:', error)
      }
    }

    fetchClientCase()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/30 to-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(13, 165, 233, 0.5) 0%, transparent 70%)",
            animation: "float 7s ease-in-out infinite",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes radar {
          0% {
            box-shadow: 0 0 0 0 rgba(13, 165, 233, 0.7), 0 0 0 10px rgba(13, 165, 233, 0.5), 0 0 0 20px rgba(13, 165, 233, 0.3);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(13, 165, 233, 0.5), 0 0 0 20px rgba(13, 165, 233, 0.3), 0 0 0 30px rgba(13, 165, 233, 0);
          }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(13, 165, 233, 0.3), inset 0 0 20px rgba(13, 165, 233, 0.1); }
          50% { box-shadow: 0 0 30px rgba(13, 165, 233, 0.5), inset 0 0 30px rgba(13, 165, 233, 0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 mb-10 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              boxShadow: isVisible ? "0 0 40px rgba(13, 165, 233, 0.6), 0 0 80px rgba(13, 165, 233, 0.3)" : "none",
              transition: "all 0.7s ease-out",
            }}
          >
            <CheckCircle2 className="w-12 h-12 text-white drop-shadow-lg" />
          </div>

          <h1
            className={`text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 mb-6 text-balance transition-all duration-700 delay-100 leading-tight ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Merci !
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500">
              Nous avons reçu votre message.
            </span>
          </h1>

          <p
            className={`text-xl sm:text-2xl text-slate-600 mb-14 max-w-3xl mx-auto text-balance transition-all duration-700 delay-200 font-light leading-relaxed ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Notre équipe d'experts Odoo examine votre demande et vous contactera très bientôt pour discuter de votre transformation digitale. 
            En attendant, vous pouvez nous appeler ou nous écrire sur WhatsApp.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {[
              { icon: Zap, text: "Partenaire Officiel Odoo" },
              { icon: Target, text: "Expertise ERP" },
              { icon: Globe, text: "Expertise Internationale" },
            ].map((badge, index) => (
              <div
                key={badge.text}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/60 backdrop-blur-xl border border-cyan-200/50 text-slate-700 transition-all duration-500 hover:bg-white/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 group ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
              >
                <badge.icon className="w-5 h-5 text-cyan-600 group-hover:text-cyan-500 transition-colors" />
                <span className="font-semibold text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Case Section */}
        {clientCase && (
          <div
            className={`relative mt-32 transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                Notre dernier projet : Qweekle
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Premium grid layout with enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Large featured image - spans 2 columns */}
              <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl group cursor-pointer h-96 md:h-full shadow-2xl">
                <img
                  src={clientCase.media?.coverImage || clientCase.media?.cardBackgroundImage}
                  alt={clientCase.name || "Project"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 group-hover:to-black/60 transition-all duration-700"></div>

                {/* Client logo overlay with enhanced styling */}
                <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl">
                  <img
                    src={clientCase.company?.logo}
                    alt={clientCase.name}
                    className="h-8 w-auto opacity-100 drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Top right - Metric 1 with enhanced gradient */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-blue-50 border border-cyan-200/60 p-8 flex flex-col justify-center hover:border-cyan-400 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-300 to-transparent opacity-20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-3 relative z-10">
                  {clientCase.sidebarInfo?.find((item: any) => item.key === "Taux de conversion (lead → signature)")?.value?.replace(/[^\d]/g, '') || '+42%'}
                </p>
                <p className="text-sm text-slate-700 font-bold relative z-10 uppercase tracking-wide">
                  Amélioration conversion
                </p>
              </div>

              {/* Bottom right - Metric 2 with enhanced styling */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col justify-center hover:from-slate-800 hover:to-slate-800 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-cyan-500/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500 to-transparent opacity-15 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-6xl font-black text-white mb-3 relative z-10">
                  {clientCase.project?.duration?.replace(/[^\d]/g, '') || '30'}j
                </p>
                <p className="text-sm text-cyan-300 font-bold relative z-10 uppercase tracking-wide">Déploiement</p>
              </div>
            </div>

            {/* Bottom section - Headline and CTA */}
            <div className="relative">
              <div className="max-w-4xl">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight text-balance">
                  {clientCase.headline?.split(':')[0] || 'Structurer le pilotage commercial'}
                </h2>

                <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl font-light leading-relaxed">
                  {clientCase.summary || 'Découvrez comment nous avons aidé Qweekle à transformer sa gestion commerciale et augmenter ses conversions de 42% en seulement 30 jours avec Odoo.'}
                </p>

                <Link href={`/cas-client/${clientCase.slug}`} className="inline-block">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-cyan-500 via-cyan-500 to-blue-600 hover:from-cyan-400 hover:via-cyan-400 hover:to-blue-500 text-white font-bold px-12 py-7 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center gap-3 text-lg group shadow-lg"
                  >
                    Découvrir tous nos cas client
                    <ExternalLink className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div
          className={`text-center mt-20 transition-all duration-700 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-slate-600 text-lg">
            Des questions sur votre transformation digitale ?{" "}
            <span className="text-cyan-600 font-bold hover:text-cyan-500 transition-colors cursor-pointer">
              Contactez-nous
            </span>{" "}
            à tout moment.
          </p>
        </div>
      </main>
    </div>
  )
}