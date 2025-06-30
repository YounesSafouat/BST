"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Sparkles,
  Compass,
  Rocket,
  Heart,
  Users,
  Zap,
  Target,
  Coffee,
  Code,
  Briefcase,
  Clock,
  Star,
  Award,
  TrendingUp,
  Shield,
  Globe,
  Lightbulb,
  Building,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  BarChart3,
  Crown,
  ChevronRight,
  GraduationCap,
  HeadphonesIcon,
  Database,
  PieChart,
  Workflow,
  ShoppingCart,
  Calendar,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AboutUs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [currentYear] = useState(new Date().getFullYear())
  const isVisible = true
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleMissionClick = () => {
    router.push('/contact')
  }

  const handleProjectsClick = () => {
    router.push('/contact')
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
          background: `
            radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255, 92, 53, 0.15) 0%, 
              rgba(113, 75, 103, 0.12) 25%, 
              rgba(255, 92, 53, 0.08) 50%, 
              transparent 70%),
            linear-gradient(135deg, 
              rgba(255, 92, 53, 0.03) 0%, 
              rgba(113, 75, 103, 0.05) 50%, 
              rgba(255, 92, 53, 0.02) 100%)
          `,
        }}
      >
        {/* Floating Geometric Shapes */}
        <div
          className="absolute w-32 h-32 border border-[#ff5c35]/20 rounded-full animate-pulse"
          style={{
            left: mousePosition.x * 0.05 + 100,
            top: mousePosition.y * 0.08 + 200,
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute w-24 h-24 bg-gradient-to-br from-[#714b67]/10 to-[#ff5c35]/10 rounded-2xl rotate-45 animate-pulse"
          style={{
            right: mousePosition.x * 0.03 + 150,
            top: mousePosition.y * 0.06 + 300,
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-16 h-16 border-2 border-[#714b67]/30 rotate-12 animate-spin"
          style={{
            left: mousePosition.x * 0.02 + 300,
            bottom: mousePosition.y * 0.04 + 200,
            animationDuration: "20s",
          }}
        />
      </div>

      {/* Animated Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff5c35]/30 to-transparent opacity-60 animate-pulse"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#714b67]/40 to-transparent opacity-50 animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#ff5c35]/20 to-transparent opacity-40 animate-pulse delay-500"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#714b67]/30 to-transparent opacity-50 animate-pulse delay-1500"></div>
        </div>
      </div>

      {/* Hero: The Story Begins */}
      <section className="relative z-10 px-6 lg:px-8 pt-20 pb-20 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            
            <h1 className="text-6xl md:text-9xl font-black text-black mb-12 leading-none tracking-tighter">
              <span className="block">Nous Sommes</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] via-[#714b67] to-[#ff5c35] animate-pulse">
                Les Visionnaires
              </span>
              <span className="block text-3xl md:text-4xl font-light text-gray-600 mt-8 tracking-normal">
                qui transforment le Maroc digital
              </span>
            </h1>

            <div className="max-w-5xl mx-auto mb-20">
               

              <div className="flex flex-wrap items-center justify-center gap-12 text-lg text-gray-600">
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50">
                  <Clock className="w-6 h-6 text-[#ff5c35]" />
                  <span className="font-medium">{currentYear - 2019} années d'excellence</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50">
                  <Heart className="w-6 h-6 text-[#714b67]" />
                  <span className="font-medium">100% passion marocaine</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50">
                  <Rocket className="w-6 h-6 text-black" />
                  <span className="font-medium">Innovation continue</span>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </section>

      
      {/* The People: Our Soul */}
      <section className="relative z-10 py-40 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5c35]/10 to-[#714b67]/10 border border-gray-200 mb-12 shadow-lg">
              <Users className="w-6 h-6 text-[#ff5c35] mr-4" />
              <span className="text-base font-bold text-gray-700 tracking-wider">NOTRE ÂME</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-black mb-12 leading-tight">
              L'Humain au{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] to-[#714b67]">Cœur</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Derrière chaque ligne de code, chaque intégration réussie, il y a des passionnés qui croient en la
              puissance transformatrice de la technologie.
            </p>
          </div>

          {/* Team Composition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              {
                role: "Visionnaires",
                count: "3",
                description: "Qui imaginent l'avenir digital du Maroc",
                icon: Target,
                color: "#ff5c35",
                bgGradient: "from-[#ff5c35]/20 to-[#ff5c35]/5",
              },
              {
                role: "Développeurs",
                count: "12",
                description: "Qui donnent vie aux idées les plus audacieuses",
                icon: Code,
                color: "#714b67",
                bgGradient: "from-[#714b67]/20 to-[#714b67]/5",
              },
              {
                role: "Consultants",
                count: "8",
                description: "Qui accompagnent nos clients vers l'excellence",
                icon: Briefcase,
                color: "#000000",
                bgGradient: "from-black/20 to-black/5",
              },
              {
                role: "Créatifs",
                count: "5",
                description: "Qui pensent différemment et innovent",
                icon: Sparkles,
                color: "#ff5c35",
                bgGradient: "from-[#ff5c35]/20 to-[#ff5c35]/5",
              },
            ].map((team, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${team.bgGradient} rounded-3xl transform -rotate-2 group-hover:-rotate-3 transition-transform duration-700`}
                ></div>
                <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-105">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundColor: `${team.color}15` }}
                  >
                    <team.icon className="w-10 h-10" style={{ color: team.color }} />
                  </div>
                  <div className="text-5xl font-black mb-4" style={{ color: team.color }}>
                    {team.count}
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">{team.role}</h3>
                  <p className="text-gray-600 leading-relaxed">{team.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Culture Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Café & Innovation",
                description:
                  "Nos meilleures idées naissent autour d'un café marocain, dans une atmosphère détendue où la créativité s'épanouit librement.",
                icon: Coffee,
                color: "#ff5c35",
                bgPattern: "bg-gradient-to-br from-[#ff5c35]/10 via-white to-[#ff5c35]/5",
              },
              {
                title: "Excellence Continue",
                description:
                  "Nous investissons 20% de notre temps dans la recherche et l'expérimentation de nouvelles technologies révolutionnaires.",
                icon: Zap,
                color: "#714b67",
                bgPattern: "bg-gradient-to-br from-[#714b67]/10 via-white to-[#714b67]/5",
              },
              {
                title: "Passion Partagée",
                description:
                  "Chaque membre de l'équipe partage la même passion pour l'excellence et l'impact positif sur l'écosystème marocain.",
                icon: Heart,
                color: "#000000",
                bgPattern: "bg-gradient-to-br from-black/10 via-white to-black/5",
              },
            ].map((culture, index) => (
              <div
                key={index}
                className={`group relative p-10 rounded-3xl ${culture.bgPattern} border border-gray-200/50 hover:shadow-2xl transition-all duration-700 hover:scale-105`}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: `${culture.color}15` }}
                >
                  <culture.icon className="w-8 h-8" style={{ color: culture.color }} />
                </div>
                <h3 className="text-2xl font-bold text-black mb-6">{culture.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{culture.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mission: Our Purpose */}
      <section className="relative z-10 py-40 px-6 lg:px-8 bg-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff5c35]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#714b67]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 border border-white/20 mb-16 shadow-2xl">
            <Shield className="w-6 h-6 text-white mr-4" />
            <span className="text-base font-bold text-white/90 tracking-wider">NOTRE MISSION</span>
          </div>

          <h2 className="text-6xl md:text-9xl font-black text-white mb-12 leading-tight">
            Nous Existons pour
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] via-white to-[#714b67]">
              Transformer
            </span>
          </h2>
     

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-20">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#ff5c35] to-[#714b67] text-white hover:from-[#ff5c35]/90 hover:to-[#714b67]/90 shadow-2xl shadow-[#ff5c35]/30 hover:shadow-3xl transition-all duration-500 px-16 py-8 text-xl font-bold hover:scale-105 group rounded-2xl"
              onClick={handleMissionClick}
            >
              Rejoignez Notre Mission
              <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-16 py-8 text-xl font-bold transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm"
              onClick={handleProjectsClick}
            >
              <Globe className="mr-4 w-6 h-6" />
              Découvrir Nos Projets
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
