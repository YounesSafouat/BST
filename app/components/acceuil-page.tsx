"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Play,
  Shield,
  Award,
  Users,
  Zap,
  Settings,
  BarChart3,
  Quote,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  Rocket,
  ChevronDown,
  MapPin,
  CheckCircle,
  Star,
  HeadphonesIcon,
  Database,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import * as LucideIcons from "lucide-react"
import HeroSection from "@/components/home/hero/HeroSection"
import ChallengeSection from "@/components/home/challenge/ChallengeSection"
import SolutionSection from "@/components/home/solution/SolutionSection"
import TransformationSection from "@/components/home/transformation/TransformationSection"
import SuccessSection from "@/components/home/success/SuccessSection"
import CTASection from "@/components/home/cta/CTASection"
import Loader from "@/components/home/Loader"
import HeroSection2 from "@/components/home/hero/HeroSection2"
import HeroSection3 from "@/components/home/hero/HeroSection3"
import HeroSection4 from "@/components/home/hero/HeroSection4"
import HeroSection5 from "@/components/home/hero/HeroSection5"
import HeroSection6 from "@/components/home/hero/Herosection6"

interface AcceuilPageProps {
  previewOnly?: boolean;
}

interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: any;
  metadata?: {
    color?: string;
    image?: string;
    order?: number;
  };
  isActive: boolean;
}

function getIconComponent(name: string) {
  return LucideIcons[name as keyof typeof LucideIcons] || LucideIcons.Star;
}

export default function AcceuilPage({ previewOnly = false }: AcceuilPageProps) {
  const [sections, setSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        const res = await fetch("/api/content")
        if (!res.ok) throw new Error("Failed to fetch content")
        const data = await res.json()
        console.log("Raw API Response:", data)
        
        // Ensure we have valid data
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data)
          return
        }

        // Filter active sections and sort by order
        const activeSections = data
          .filter((s: ContentSection) => s.isActive !== false)
          .sort((a: ContentSection, b: ContentSection) => 
            (a.metadata?.order || 0) - (b.metadata?.order || 0)
          )
        
        console.log("Active Sections:", activeSections)
        setSections(activeSections)
      } catch (err) {
        console.error("Erreur lors du chargement du contenu:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  // Helper to get section by type
  const getSection = (type: string) => {
    const section = sections.find((s) => s.type === type)
    console.log(`Looking for section ${type}:`, section)
    if (!section) {
      console.warn(`Section ${type} not found in data`)
    }
    return section
  }

  if (loading) {
    return <Loader />
  }

  if (sections.length === 0) {
    return <div className="text-center py-12 text-gray-400">Aucun contenu trouvé</div>
  }

  const hero = getSection("hero")
  const challenge = getSection("challenge")
  const solution = getSection("solution")
  const transformation = getSection("transformation")

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Parallax Background Effects */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255, 92, 53, 0.08) 0%, 
            rgba(113, 75, 103, 0.06) 25%, 
            rgba(255, 92, 53, 0.04) 50%, 
            transparent 70%)`,
        }}
      >
        <div
          className="absolute w-96 h-96 rounded-full border border-gray-200/30 animate-ping"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            animationDuration: "3s",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full border border-gray-300/40 animate-ping"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
            animationDuration: "2s",
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* Animated Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-40 animate-pulse"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30 animate-pulse delay-500"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-40 animate-pulse delay-1500"></div>
        </div>
      </div>

      <main className="relative z-10">
        {hero && <HeroSection2 hero={hero} />}
        {challenge && <ChallengeSection challenge={challenge} />}
        {solution && <SolutionSection solution={solution} />}
        {transformation && <TransformationSection transformation={transformation} />}
        <SuccessSection />
        <CTASection />
      </main>
    </div>
  );
} 