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
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-8 lg:px-8 min-h-[120px] transition-all duration-500 rounded-full w-[95%] max-w-7xl mx-auto hidden md:block ${
        scrollY > 50
          ? "backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-2xl shadow-black/10"
          : "backdrop-blur-md bg-white/60 border border-gray-100/30 shadow-lg"
      } ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
    >
      <nav className="flex items-stretch max-w-6xl mx-auto w-full px-2 sm:px-4">
        <div className="flex items-center flex-shrink-0 w-auto">
          <Link href="/" className="relative flex-shrink-0">
            <img
              key={`${headerData?.logo?.image}-${headerData?.logo?.size}-${logoVersion}`}
              src={`${headerData?.logo?.image || "/bst.png"}?v=${logoVersion}&t=${Date.now()}`}
              alt={headerData?.logo?.alt || "blackswantechnology"} 
              style={{
                width: headerData?.logo?.size || "10em",
                height: "auto",
                maxWidth: "200px",
              }}
              className="object-contain transition-all duration-300 flex-shrink-0 max-w-[200px] sm:max-w-[150px] xs:max-w-[100px]"
              onLoad={() => console.log("Logo loaded with size:", headerData?.logo?.size)}
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8 ml-auto pl-6">
          {/* HubSpot Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("hubspot")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
          <button
            onClick={() => { trackButtonClick('header-hubspot'); handleNavClick('/hubspot'); }}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide py-2"
          >
            HubSpot
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>
            {activeDropdown === "hubspot" && headerData?.navigation?.hubspot && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[700px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-1">{headerData.navigation.hubspot.title}</h3>
                      <p className="text-gray-600 text-sm">{headerData.navigation.hubspot.subtitle}</p>
                    </div>
                    {headerData.navigation.hubspot.badge && (
                      <div className="px-3 py-1 rounded-full bg-[var(--color-main)] text-white text-xs font-bold">
                        ★ {headerData.navigation.hubspot.badge}
                      </div>
                    )}
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[var(--color-main)]/20 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-[var(--color-main)]" />
                        </div>
                        <h4 className="font-semibold text-black">Logiciels CRM</h4>
                      </div>
                      <div className="space-y-3">
                        {headerData.navigation.hubspot.sections.crm.items?.map((item: any, idx: number) => (
                          <Link
                            key={idx}
                            href={item.url}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[var(--color-main)]/10 rounded-lg flex items-center justify-center">
                              {getIcon(item.icon)}
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[var(--color-main)]/20 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-[var(--color-main)]" />
                        </div>
                        <h4 className="font-semibold text-black">Nos Services</h4>
                      </div>
                      <div className="space-y-3">
                        {headerData.navigation.hubspot.sections.services.items?.map((item: any, idx: number) => (
                          <Link
                            key={idx}
                            href={item.url}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[var(--color-main)]/10 rounded-lg flex items-center justify-center">
                              {getIcon(item.icon)}
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button 
                      className="bg-[var(--color-main)] text-white hover:bg-[var(--color-main)]/90 transition-colors duration-200 px-6 py-2 text-sm rounded-xl"
                      onClick={() => { trackButtonClick('header-hubspot'); handleNavClick('/hubspot'); }}
                    >
                      En Savoir Plus <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Odoo Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("odoo")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
          <button
            onClick={() => { trackButtonClick('header-odoo'); handleNavClick('/odoo'); }}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide case py-2"
            >
              Odoo
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {activeDropdown === "odoo" && headerData?.navigation?.odoo && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[700px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-1">{headerData.navigation.odoo.title}</h3>
                      <p className="text-gray-600 text-sm">{headerData.navigation.odoo.subtitle}</p>
                    </div>
                    {headerData.navigation.odoo.badge && (
                      <div className="px-3 py-1 rounded-full bg-[var(--color-secondary)] text-white text-xs font-bold">
                        ★ {headerData.navigation.odoo.badge}
                      </div>
                    )}
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[var(--color-secondary)]/20 rounded-lg flex items-center justify-center">
                          <Database className="w-4 h-4 text-[var(--color-secondary)]" />
                        </div>
                        <h4 className="font-semibold text-black">Modules ERP</h4>
                      </div>
                      <div className="space-y-3">
                        {headerData.navigation.odoo.sections.modules.items?.slice(0, 3).map((item: any, idx: number) => (
                          <Link
                            key={idx}
                            href={item.url}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center">
                              {getIcon(item.icon)}
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[var(--color-secondary)]/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-[var(--color-secondary)]" />
                        </div>
                        <h4 className="font-semibold text-black">Nos Expertises</h4>
                      </div>
                      <div className="space-y-3">
                        {headerData.navigation.odoo.sections.services.items?.slice(0, 3).map((item: any, idx: number) => (
                          <Link
                            key={idx}
                            href={item.url}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center">
                              {getIcon(item.icon)}
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button 
                      className="bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary)]/90 transition-colors duration-200 px-6 py-2 text-sm rounded-xl"
                      onClick={() => { trackButtonClick('header-odoo'); handleNavClick('/odoo'); }}
                    >
                      En Savoir Plus <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* À Propos Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => { trackButtonClick('header-about'); handleNavClick('/about'); }}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide case py-2 whitespace-nowrap"
            >
              À Propos
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>
            {activeDropdown === "about" && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[600px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black mb-1">{headerData.navigation.about.title}</h3>
                    <p className="text-gray-600 text-sm">{headerData.navigation.about.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {headerData.navigation.about.stats?.map((stat: any, idx: number) => {
                      const IconComponent = iconMap[stat.icon]
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                            {IconComponent && <IconComponent className="w-5 h-5 text-black" />}
                          </div>
                          <div>
                            <h5 className="font-medium text-black text-sm">{stat.title}</h5>
                            <p className="text-xs text-gray-600">{stat.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button 
                      className="bg-black text-white hover:bg-gray-900 transition-colors duration-200 px-6 py-2 text-sm rounded-xl"
                      onClick={() => { trackButtonClick('header-about'); handleNavClick('/about'); }}
                    >
                      Notre Histoire <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Link */}
          <div className="relative group">
          <button
              onClick={() => { trackButtonClick('header-contact'); handleNavClick('/contact'); }}
            className="text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide case py-2"
            >
              Contact
            </button>
          </div>

          {/* Cas Client Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("cas-client")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
          <button
            onClick={() => { trackButtonClick('header-cas-client'); handleNavClick('/cas-client'); }}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide case py-2 whitespace-nowrap"
          >
            Cas Client
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {activeDropdown === "cas-client" && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[700px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black mb-1">{headerData.navigation.casClient.title}</h3>
                    <p className="text-gray-600 text-sm">{headerData.navigation.casClient.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {headerData.navigation.casClient.selectedClients.length > 0 ? (
                      headerData.navigation.casClient.selectedClients.map((client: any) => (
                        <button
                          key={client.clientId}
                          onClick={() => { trackButtonClick(`header-cas-client-${client.clientId}`); handleNavClick(`/cas-client/${client.clientId}`); }}
                          className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-500 flex flex-col"
                        >
                          <div className="relative h-32 overflow-hidden flex items-center justify-center bg-gray-50">
                            <img
                              src={client.logo && client.logo.startsWith('http') ? client.logo : (client.logo ? `/logos/${client.logo}` : "/placeholder-logo.png")}
                              alt={client.name}
                              className="w-24 h-24 object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-[var(--color-secondary)] transition-colors duration-300 line-clamp-2">
                              {client.name}
                            </h3>
                            <p className="text-gray-600 mb-2 line-clamp-2">{client.headline}</p>
                            <div className="text-xs text-[var(--color-main)] font-medium mt-auto">
                              {client.projectStats && client.projectStats.length > 0 ? client.projectStats[0].value : ''}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-400">Aucun client sélectionné</div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button 
                      className="bg-black text-white hover:bg-gray-900 transition-colors duration-200 px-6 py-2 text-sm rounded-xl"
                      onClick={() => { trackButtonClick('header-cas-client'); handleNavClick('/cas-client'); }}
                    >
                      {headerData.navigation.casClient.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Button Group - Right Side */}
        <div className="flex items-center gap-2 ml-4">
          {/* Rendez-vous Button */}
          {headerData?.cta?.isActive && (
            <div className="relative">
              <button
                className="group w-[18em] bg-[var(--color-black)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-main)] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                onClick={handleAppointmentClick}
              >
                {headerData.cta.text || "Prendre rendez-vous"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          {/* WhatsApp Button */}
          <Button
            asChild
            className="
              rounded-full
              bg-green-500
              border-2 border-white
              p-0 w-12 h-12
              flex items-center justify-center
              shadow-none
              transition-all
              duration-200
              hover:bg-white
              hover:border-green-500
              hover:scale-110
              focus:outline-none
              group
            "
          >
            <a href={`https://wa.me/${headerData?.contact?.phone?.replace(/\D/g, '') || '212XXXXXXXXX'}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp className="w-6 h-6 text-white group-hover:text-green-500 transition-colors duration-200" />
            </a>
          </Button>
          
          {/* Phone Button */}
          <Button
            asChild
            className="
              rounded-full
              bg-[var(--color-main)]
              border-2 border-white
              p-0 w-12 h-12
              flex items-center justify-center
              shadow-none
              transition-all
              duration-200
              hover:bg-white
              hover:border-[var(--color-main)]
              hover:scale-110
              focus:outline-none
              group
            "
          >
            <a href={`tel:${headerData?.contact?.phone || '+212XXXXXXXXX'}`} aria-label="Téléphone">
              <Phone className="w-6 h-6 text-white group-hover:text-[var(--color-main)] transition-colors duration-200" />
            </a>
          </Button>
        </div>

        <button
          className="md:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-8 space-y-6 rounded-b-3xl">
          <button onClick={() => { trackButtonClick('header-hubspot'); handleNavClick('/hubspot'); }} className="block text-gray-600 hover:text-black transition-colors font-medium">
            HubSpot
          </button>
          <button onClick={() => { trackButtonClick('header-odoo'); handleNavClick('/odoo'); }} className="block text-gray-600 hover:text-black transition-colors font-medium">
            Odoo
          </button>
          <button onClick={() => { trackButtonClick('header-about'); handleNavClick('/about'); }} className="block text-gray-600 hover:text-black transition-colors font-medium">
            À Propos
          </button>
          <button onClick={() => { trackButtonClick('header-contact'); handleNavClick('/contact'); }} className="block text-gray-600 hover:text-black transition-colors font-medium">
            Contact
          </button>
          <button onClick={() => { trackButtonClick('header-cas-client'); handleNavClick('/cas-client'); }} className="block text-gray-600 hover:text-black transition-colors font-medium">
            Cas Client
          </button>
          <div className="pt-6">
              <Button 
                className="w-full bg-black text-white"
              onClick={() => { trackButtonClick('header-hubspot'); handleNavClick('/hubspot'); }}
            >
              Commencer
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}