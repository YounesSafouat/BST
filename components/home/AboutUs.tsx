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
import * as LucideIcons from "lucide-react"

interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    stats: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  team: {
    title: string;
    subtitle: string;
    description: string;
    members: Array<{
      name: string;
      role: string;
      description: string;
      avatar: string;
      icon: string;
    }>;
  };
  values: {
    title: string;
    subtitle: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  mission: {
    title: string;
    subtitle: string;
    description: string;
    cta: {
      text: string;
      url: string;
    };
  };
}

function getIconComponent(name: string) {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] || LucideIcons.Star;
  return IconComponent as React.ComponentType<any>;
}

export default function AboutUs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [currentYear] = useState(new Date().getFullYear())
  const [aboutContent, setAboutContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch("/api/content?type=about")
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setAboutContent(data[0].content)
          }
        }
      } catch (error) {
        console.error("Error fetching about content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  const handleMissionClick = () => {
    router.push(aboutContent?.mission?.cta?.url || '/contact')
  }

  const handleProjectsClick = () => {
    router.push('/contact')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ff5c35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Use dynamic content if available, otherwise fall back to static content
  const heroTitle = aboutContent?.hero?.title || "Nous Sommes"
  const heroSubtitle = aboutContent?.hero?.subtitle || "Les Visionnaires"
  const heroDescription = aboutContent?.hero?.description || "qui transforment le Maroc digital"
  const heroStats = aboutContent?.hero?.stats || [
    { title: `${currentYear - 2019} années d'excellence`, icon: "Clock" },
    { title: "100% passion marocaine", icon: "Heart" },
    { title: "Innovation continue", icon: "Rocket" }
  ]

  const teamTitle = aboutContent?.team?.title || "L'Humain au Cœur"
  const teamDescription = aboutContent?.team?.description || "Derrière chaque ligne de code, chaque intégration réussie, il y a des passionnés qui croient en la puissance transformatrice de la technologie."
  const teamMembers = aboutContent?.team?.members || [
    {
      name: "Ahmed Mansouri",
      role: "CEO & Fondateur",
      description: "Visionnaire de la transformation digitale au Maroc",
      icon: "Crown"
    },
    {
      name: "Salma Benali",
      role: "CTO",
      description: "Experte en architecture technique et innovation",
      icon: "Code"
    },
    {
      name: "Youssef Kadiri",
      role: "Directeur Commercial",
      description: "Spécialiste en solutions CRM et ERP",
      icon: "Target"
    },
    {
      name: "Fatima Zahra",
      role: "Lead Developer",
      description: "Passionnée de développement et d'intégration",
      icon: "Zap"
    }
  ]

  const valuesTitle = aboutContent?.values?.title || "Nos Valeurs Fondamentales"
  const valuesDescription = aboutContent?.values?.description || "Des principes qui guident chacune de nos actions et décisions."
  const valuesItems = aboutContent?.values?.items || [
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque projet, chaque ligne de code, chaque interaction client.",
      icon: "Star"
    },
    {
      title: "Innovation",
      description: "Nous repoussons constamment les limites de la technologie pour créer des solutions innovantes.",
      icon: "Lightbulb"
    },
    {
      title: "Collaboration",
      description: "Nous croyons en la puissance du travail d'équipe et de la collaboration avec nos clients.",
      icon: "Users"
    },
    {
      title: "Intégrité",
      description: "Nous agissons avec honnêteté, transparence et éthique dans toutes nos relations.",
      icon: "Shield"
    },
    {
      title: "Passion",
      description: "Notre passion pour la technologie et l'innovation nous pousse à toujours faire mieux.",
      icon: "Heart"
    },
    {
      title: "Impact",
      description: "Nous créons un impact positif sur les entreprises et la société marocaine.",
      icon: "Globe"
    }
  ]

  const missionTitle = aboutContent?.mission?.title || "Transformer le Maroc Digital"
  const missionDescription = aboutContent?.mission?.description || "Notre mission est d'accompagner les entreprises marocaines dans leur transformation digitale en leur offrant des solutions innovantes, sur mesure et performantes."
  const missionCtaText = aboutContent?.mission?.cta?.text || "Découvrir Notre Mission"

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
              <span className="block">{heroTitle}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] via-[#714b67] to-[#ff5c35] animate-pulse">
                {heroSubtitle}
              </span>
              <span className="block text-3xl md:text-4xl font-light text-gray-600 mt-8 tracking-normal">
                {heroDescription}
              </span>
            </h1>

            <div className="max-w-5xl mx-auto mb-20">
               

              <div className="flex flex-wrap items-center justify-center gap-12 text-lg text-gray-600">
                {heroStats.map((stat: any, index: number) => {
                  const Icon = getIconComponent(stat.icon);
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50">
                      <Icon className="w-6 h-6 text-[#ff5c35]" />
                      <span className="font-medium">{stat.title}</span>
                </div>
                  );
                })}
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
              {teamTitle}
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {teamDescription}
            </p>
          </div>

          {/* Team Composition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {teamMembers.map((member: any, index: number) => {
              const Icon = getIconComponent(member.icon);
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-[#ff5c35] to-[#714b67]"></div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-[#ff5c35]/10 to-[#714b67]/10">
                    <Icon className="w-8 h-8 text-[#ff5c35]" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{member.name}</h3>
                  <h4 className="text-sm font-medium text-gray-600 mb-4 tracking-wide uppercase">
                    {member.role}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative z-10 py-40 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#714b67]/10 to-[#ff5c35]/10 border border-gray-200 mb-12 shadow-lg">
              <Heart className="w-6 h-6 text-[#714b67] mr-4" />
              <span className="text-base font-bold text-gray-700 tracking-wider">NOS VALEURS</span>
              </div>
            <h2 className="text-6xl md:text-8xl font-black text-black mb-12 leading-tight">
              {valuesTitle}
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {valuesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesItems.map((value: any, index: number) => {
              const Icon = getIconComponent(value.icon);
              return (
              <div
                key={index}
                  className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                  <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-[#714b67] to-[#ff5c35]"></div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-[#714b67]/10 to-[#ff5c35]/10">
                    <Icon className="w-8 h-8 text-[#714b67]" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-40 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5c35]/10 to-[#714b67]/10 border border-gray-200 mb-12 shadow-lg">
              <Rocket className="w-6 h-6 text-[#ff5c35] mr-4" />
              <span className="text-base font-bold text-gray-700 tracking-wider">NOTRE MISSION</span>
        </div>
            <h2 className="text-6xl md:text-8xl font-black text-black mb-12 leading-tight">
              {missionTitle}
          </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              {missionDescription}
            </p>
            <Button
              onClick={handleMissionClick}
              className="group bg-black text-white hover:bg-gray-900 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {missionCtaText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
