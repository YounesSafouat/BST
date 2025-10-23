"use client"

import { Phone, MessageCircle, CheckCircle2, Sparkles, Zap, Target, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
)

export function ThankYouPageDark() {
  const [isVisible, setIsVisible] = useState(false)
  const [contactData, setContactData] = useState<any>(null)
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  
  // Use singleton geolocation service
  const { region: userRegion, loading: locationLoading } = useGeolocationSingleton()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch regional contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/content?type=settings')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            const settingsContent = data.find(item => item.type === 'settings')
            if (settingsContent && settingsContent.content?.regionalContact) {
              setContactData(settingsContent.content.regionalContact)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching contact data:', error)
      }
    }

    fetchContactData()
  }, [])

  // Update contact numbers based on detected region
  useEffect(() => {
    if (userRegion && contactData) {
      let phone: string | null = null
      let whatsapp: string | null = null
      
      switch (userRegion) {
        case 'france':
          phone = contactData.france?.phone || null
          whatsapp = contactData.france?.whatsapp || null
          break
        case 'morocco':
          phone = contactData.morocco?.phone || null
          whatsapp = contactData.morocco?.whatsapp || null
          break
        default:
          phone = contactData.other?.phone || null
          whatsapp = contactData.other?.whatsapp || null
          break
      }
      setPhoneNumber(phone)
      setWhatsappNumber(whatsapp)
    }
  }, [userRegion, contactData])

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite reverse",
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
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7), 0 0 0 10px rgba(37, 211, 102, 0.5), 0 0 0 20px rgba(37, 211, 102, 0.3);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(37, 211, 102, 0.5), 0 0 0 20px rgba(37, 211, 102, 0.3), 0 0 0 30px rgba(37, 211, 102, 0);
          }
        }
      `}</style>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              boxShadow: isVisible ? "0 0 30px rgba(13, 165, 233, 0.5)" : "none",
              transition: "all 0.7s ease-out",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h1
            className={`text-5xl sm:text-7xl font-bold text-white mb-6 text-balance transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Merci !
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
              {" "}
              Nous avons reçu votre demande.
            </span>
          </h1>

          <p
            className={`text-xl text-slate-300 mb-12 max-w-2xl mx-auto text-balance transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Notre équipe d'experts Odoo et HubSpot examine votre demande et vous contactera très bientôt pour discuter de votre transformation digitale.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: Zap, text: "Partenaire Officiel Odoo" },
              { icon: Target, text: "Partenaire Platinum HubSpot" },
              { icon: Globe, text: "Expertise Maroc" },
            ].map((badge, index) => (
              <div
                key={badge.text}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-200 backdrop-blur-sm transition-all duration-700 hover:border-cyan-500/50 hover:bg-slate-800/80 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
              >
                <badge.icon className="w-4 h-4" />
                {badge.text}
              </div>
            ))}
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Empty div to maintain spacing */}
          </div>
        </div>

        <div
          className={`relative mt-20 rounded-2xl overflow-hidden transition-all duration-1000 delay-700 border border-slate-700/50 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Gradient Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(13, 165, 233, 0.1) 0%, rgba(30, 41, 59, 0.5) 100%)`,
              backdropFilter: "blur(10px)",
            }}
          ></div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-cyan-500/30 animate-pulse"></div>
            <div
              className="absolute bottom-10 left-10 w-24 h-24 rounded-full border border-cyan-500/30 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative px-8 sm:px-12 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 mb-4 tracking-wide bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
              PROCHAINES ÉTAPES
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
              Transformons votre entreprise avec Odoo et HubSpot.
            </h2>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 text-balance">
              Notre équipe d'experts est prête à vous accompagner dans votre transformation digitale avec des solutions ERP et CRM sur mesure pour votre entreprise au Maroc.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {phoneNumber && (
                <a href={`tel:${phoneNumber.replace(/\D/g, '')}`}>
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 w-full sm:w-auto min-w-[200px]"
                  >
                    <Phone className="w-6 h-6 mr-3" />
                    Appelez-nous
                  </Button>
                </a>
              )}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Bonjour%2C%20j%27aimerais%20discuter%20de%20ma%20demande%20pour%20Odoo%20ou%20HubSpot`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto min-w-[200px]"
                    style={{
                      animation: "radar 2s infinite",
                    }}
                  >
                    <WhatsAppIcon className="w-6 h-6 mr-3" />
                    WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-slate-400">
            Des questions ? <span className="text-cyan-400 font-semibold">Contactez-nous</span> à tout moment.
          </p>
        </div>
      </main>
    </div>
  )
}

export function ThankYouPageLight() {
  const [isVisible, setIsVisible] = useState(false)
  const [contactData, setContactData] = useState<any>(null)
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  
  // Use singleton geolocation service
  const { region: userRegion, loading: locationLoading } = useGeolocationSingleton()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch regional contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/content?type=settings')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            const settingsContent = data.find(item => item.type === 'settings')
            if (settingsContent && settingsContent.content?.regionalContact) {
              setContactData(settingsContent.content.regionalContact)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching contact data:', error)
      }
    }

    fetchContactData()
  }, [])

  // Update contact numbers based on detected region
  useEffect(() => {
    if (userRegion && contactData) {
      let phone: string | null = null
      let whatsapp: string | null = null
      
      switch (userRegion) {
        case 'france':
          phone = contactData.france?.phone || null
          whatsapp = contactData.france?.whatsapp || null
          break
        case 'morocco':
          phone = contactData.morocco?.phone || null
          whatsapp = contactData.morocco?.whatsapp || null
          break
        default:
          phone = contactData.other?.phone || null
          whatsapp = contactData.other?.whatsapp || null
          break
      }
      setPhoneNumber(phone)
      setWhatsappNumber(whatsapp)
    }
  }, [userRegion, contactData])

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #0DA5E9 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite reverse",
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
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7), 0 0 0 10px rgba(37, 211, 102, 0.5), 0 0 0 20px rgba(37, 211, 102, 0.3);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(37, 211, 102, 0.5), 0 0 0 20px rgba(37, 211, 102, 0.3), 0 0 0 30px rgba(37, 211, 102, 0);
          }
        }
      `}</style>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{
              boxShadow: isVisible ? "0 0 30px rgba(13, 165, 233, 0.5)" : "none",
              transition: "all 0.7s ease-out",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h1
            className={`text-5xl sm:text-7xl font-bold text-slate-900 mb-6 text-balance transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Merci !
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-600">
              {" "}
              Nous avons reçu votre demande.
            </span>
          </h1>

          <p
            className={`text-xl text-slate-600 mb-12 max-w-2xl mx-auto text-balance transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Notre équipe d'experts Odoo et HubSpot examine votre demande et vous contactera très bientôt pour discuter de votre transformation digitale.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: Zap, text: "Partenaire Officiel Odoo" },
              { icon: Target, text: "Partenaire Platinum HubSpot" },
              { icon: Globe, text: "Expertise Internationale" },
            ].map((badge, index) => (
              <div
                key={badge.text}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 backdrop-blur-sm transition-all duration-700 hover:border-cyan-500 hover:bg-cyan-50 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
              >
                <badge.icon className="w-4 h-4" />
                {badge.text}
              </div>
            ))}
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Empty div to maintain spacing */}
          </div>
        </div>

        <div
          className={`relative mt-20 rounded-2xl overflow-hidden transition-all duration-1000 delay-700 border border-slate-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(13, 165, 233, 0.05) 0%, rgba(30, 41, 59, 0.05) 100%)`,
              backdropFilter: "blur(10px)",
            }}
          ></div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-cyan-500/50 animate-pulse"></div>
            <div
              className="absolute bottom-10 left-10 w-24 h-24 rounded-full border border-cyan-500/50 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative px-8 sm:px-12 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 mb-4 tracking-wide bg-cyan-50 px-4 py-2 rounded-full border border-cyan-200">
              <Sparkles className="w-4 h-4" />
              PROCHAINES ÉTAPES
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 text-balance">
              Transformons votre entreprise avec Odoo et HubSpot.
            </h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 text-balance">
              Notre équipe d'experts est prête à vous accompagner dans votre transformation digitale avec des solutions ERP et CRM sur mesure pour votre entreprise.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {phoneNumber && (
                <a href={`tel:${phoneNumber.replace(/\D/g, '')}`}>
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 w-full sm:w-auto min-w-[200px]"
                  >
                    <Phone className="w-6 h-6 mr-3" />
                    Appelez-nous
                  </Button>
                </a>
              )}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Bonjour%2C%20j%27aimerais%20discuter%20de%20ma%20demande%20pour%20Odoo%20ou%20HubSpot`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto min-w-[200px]"
                    style={{
                      animation: "radar 2s infinite",
                    }}
                  >
                    <WhatsAppIcon className="w-6 h-6 mr-3" />
                    WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-slate-600">
            Des questions ? <span className="text-cyan-600 font-semibold">Contactez-nous</span> à tout moment.
          </p>
        </div>
      </main>
    </div>
  )
}


