"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Star,
  Briefcase,
  HeadphonesIcon,
  Database,
  PieChart,
  Workflow,
  ShoppingCart,
  Calendar,
  Building,
  GraduationCap,
  TrendingUp,
  Target,
  Rocket,
  BarChart3,
  Zap,
  Users,
  Globe,
  MessageCircle,
  Home,
  FileText,
} from "lucide-react"
import { useState, useEffect } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { useGlobalLoader } from "@/components/LoaderProvider"
import { useRouter } from "next/navigation"
import { useButtonAnalytics } from '@/hooks/use-analytics'

interface HeaderProps {
  scrollY: number
  isLoaded: boolean
}

const iconMap: { [key: string]: any } = {
  Home,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Target,
  HeadphonesIcon,
  BarChart3,
  Rocket,
  GraduationCap,
  Zap,
  Database,
  ShoppingCart,
  Building,
  Globe,
  Star,
  Mail,
  CheckCircle,
  PieChart,
  Workflow,
  Calendar,
  MessageCircle,
}

export default function Header({ scrollY, isLoaded }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [headerData, setHeaderData] = useState<any>(null)
  const [headerClients, setHeaderClients] = useState<any[]>([])
  const [casClientMenuClients, setCasClientMenuClients] = useState<any[]>([])
  const [logoVersion, setLogoVersion] = useState(0)
  const { showLoader, hideLoader } = useGlobalLoader()
  const router = useRouter()
  const { trackButtonClick } = useButtonAnalytics()

  const fetchHeaderData = () => {
    // Fetch header data with cache busting
    fetch("/api/content?type=header&t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          console.log("Header data fetched:", data[0].content)
          console.log("Logo size:", data[0].content?.logo?.size)
          setHeaderData(data[0].content)
          setLogoVersion(prev => prev + 1)
        }
      })
      .catch((error) => {
        console.error("Error fetching header data:", error)
        setHeaderData(null)
      })
  }

  useEffect(() => {
    fetchHeaderData()
  }, [])

  useEffect(() => {
    if (headerData?.logo?.size) {
      console.log("Logo size changed to:", headerData.logo.size)
    }
  }, [headerData?.logo?.size])

  useEffect(() => {
    // Fetch clients data
    fetch("/api/content?type=clients-page")
      .then(res => res.json())
      .then(data => {
        const page = Array.isArray(data) ? data[0] : data
        const clients = page?.content?.clientCases || []
        const featured = clients.filter((c: any) => c.featuredInHeader).slice(0, 2)
        setHeaderClients(featured)
        setCasClientMenuClients(
          featured.length > 0 ? featured : clients.slice(0, 2)
        )
      })
      .catch(() => {
        setHeaderClients([])
        setCasClientMenuClients([])
      })
  }, [])

  const handleAppointmentClick = async () => {
    showLoader()
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      window.location.href = headerData?.cta?.url || '/rendez-vous'
    } finally {
      hideLoader()
    }
  }

  const handleNavClick = (path: string) => {
    showLoader();
    router.push(path);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 min-h-[64px] bg-[#f7f2f6]/80 backdrop-blur-md border-b border-[var(--color-secondary)]/10`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <nav className="flex items-center justify-between w-full px-8 h-16">
          {/* Left: Logo only, original image, smaller size */}
          <div className="flex items-center flex-shrink-0 w-auto h-full">
            <Link href="/" className="flex items-center h-full">
              <img
                key={`${headerData?.logo?.image}-${headerData?.logo?.size}-${logoVersion}`}
                src={`${headerData?.logo?.image || "/bst.png"}?v=${logoVersion}&t=${Date.now()}`}
                alt={headerData?.logo?.alt || "blackswantechnology"}
                className="object-contain w-20 h-20"
              />
            </Link>
          </div>
          {/* Center: Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8 h-full">
            <Link href="#solutions" className="text-gray-700 hover:text-[var(--color-secondary)] font-medium transition-colors">Solutions</Link>
            <Link href="#tarifs" className="text-gray-700 hover:text-[var(--color-secondary)] font-medium transition-colors">Tarifs</Link>
            <Link href="#temoignages" className="text-gray-700 hover:text-[var(--color-secondary)] font-medium transition-colors">Témoignages</Link>
            <Link href="#agence" className="text-gray-700 hover:text-[var(--color-secondary)] font-medium transition-colors">Notre Agence</Link>
          </div>
          {/* Right: Icons + Action Button, smaller */}
          <div className="flex items-center gap-4 ml-auto h-full">
            <Phone className="w-5 h-5 text-gray-700 hover:text-[var(--color-secondary)] cursor-pointer" />
            <MessageCircle className="w-5 h-5 text-gray-700 hover:text-[var(--color-secondary)] cursor-pointer" />
            <button
              onClick={handleAppointmentClick}
              className="ml-2 bg-[var(--color-secondary)] text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2 hover:bg-[var(--color-secondary)]/90 transition-all"
            >
              Prendre RDV <Calendar className="w-5 h-5 ml-2" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}