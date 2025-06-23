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
} from "lucide-react"
import { useState, useEffect } from "react"
import { FaWhatsapp } from "react-icons/fa"

interface HeaderProps {
  scrollY: number
  isLoaded: boolean
}

export default function Header({ scrollY, isLoaded }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [headerClients, setHeaderClients] = useState<any[]>([])
  const [casClientMenuClients, setCasClientMenuClients] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/content?type=clients-page")
      .then(res => res.json())
      .then(data => {
        const page = Array.isArray(data) ? data[0] : data
        const clients = page?.content?.clientCases || []
        const featured = clients.filter((c: any) => c.featuredInHeader).slice(0, 2)
        setHeaderClients(featured)
        // For mega menu: fallback to first two if none are featured
        setCasClientMenuClients(
          featured.length > 0 ? featured : clients.slice(0, 2)
        )
      })
      .catch(() => {
        setHeaderClients([])
        setCasClientMenuClients([])
      })
  }, [])

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-5 lg:px-8 transition-all duration-500 rounded-full w-[95%] max-w-7xl mx-auto ${
        scrollY > 50
          ? "backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-2xl shadow-black/10"
          : "backdrop-blur-md bg-white/60 border border-gray-100/30 shadow-lg"
      } ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
    >
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/" className="relative">
            <img src="/bst.png" alt="blackswantechnology" className="w-1/2"/>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-12">
          {/* HubSpot Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("hubspot")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2">
              HubSpot
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {activeDropdown === "hubspot" && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[700px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-1">Solutions HubSpot</h3>
                      <p className="text-gray-600 text-sm">Plateforme CRM et Marketing Complète</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#ff5c35] text-white text-xs font-bold">
                      ★ Partenaire Platinum
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[#ff5c35]/20 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-[#ff5c35]" />
                        </div>
                        <h4 className="font-semibold text-black">Logiciels CRM</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: TrendingUp, title: "Sales Hub", desc: "Automatisation des ventes" },
                          { icon: Mail, title: "Marketing Hub", desc: "Email marketing avancé" },
                          { icon: HeadphonesIcon, title: "Service Hub", desc: "Support client professionnel" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-[#ff5c35]" />
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[#ff5c35]/20 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-[#ff5c35]" />
                        </div>
                        <h4 className="font-semibold text-black">Nos Services</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: Target, title: "Audit HubSpot", desc: "Évaluation complète" },
                          { icon: Rocket, title: "Implémentation", desc: "Configuration sur mesure" },
                          { icon: GraduationCap, title: "Formation", desc: "Équipes certifiées" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-[#ff5c35]" />
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button className="bg-[#ff5c35] text-white hover:bg-[#ff5c35]/90 transition-colors duration-200 px-6 py-2 text-sm rounded-xl">
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
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2">
              Odoo
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {activeDropdown === "odoo" && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[700px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-1">Solutions Odoo</h3>
                      <p className="text-gray-600 text-sm">ERP Intégré et Gestion d'Entreprise</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#714b67] text-white text-xs font-bold">
                      ★ Partenaire Officiel
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[#714b67]/20 rounded-lg flex items-center justify-center">
                          <Database className="w-4 h-4 text-[#714b67]" />
                        </div>
                        <h4 className="font-semibold text-black">Modules ERP</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: ShoppingCart, title: "Ventes & CRM", desc: "Gestion commerciale" },
                          { icon: BarChart3, title: "Comptabilité", desc: "Gestion financière" },
                          { icon: Building, title: "Inventaire", desc: "Gestion des stocks" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[#714b67]/10 rounded-lg flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-[#714b67]" />
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-[#714b67]/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-[#714b67]" />
                        </div>
                        <h4 className="font-semibold text-black">Nos Expertises</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: PieChart, title: "Analyse & Audit", desc: "Évaluation des processus" },
                          { icon: Workflow, title: "Personnalisation", desc: "Modules sur mesure" },
                          { icon: Database, title: "Migration", desc: "Transfert sécurisé" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-8 h-8 bg-[#714b67]/10 rounded-lg flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-[#714b67]" />
                            </div>
                            <div>
                              <h5 className="font-medium text-black text-sm">{item.title}</h5>
                              <p className="text-xs text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button className="bg-[#714b67] text-white hover:bg-[#714b67]/90 transition-colors duration-200 px-6 py-2 text-sm rounded-xl">
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
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2 whitespace-nowrap">
              À Propos
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {activeDropdown === "about" && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[600px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black mb-1">À Propos de Blackswantechnology</h3>
                    <p className="text-gray-600 text-sm">Votre Partenaire de Transformation Digitale</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Star, title: "5+ Années", desc: "D'expérience au Maroc" },
                      { icon: Users, title: "200+ Clients", desc: "Entreprises accompagnées" },
                      { icon: CheckCircle, title: "100% Réussite", desc: "Taux de satisfaction" },
                      { icon: Globe, title: "Casablanca", desc: "Expertise internationale" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h5 className="font-medium text-black text-sm">{item.title}</h5>
                          <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button className="bg-black text-white hover:bg-gray-900 transition-colors duration-200 px-6 py-2 text-sm rounded-xl">
                      Notre Histoire <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Link */}
          <div className="relative group">
            <Link
              href="/contact"
              className="text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2"
            >
              Contact
            </Link>
          </div>

          {/* Cas Client Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("cas-client")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2 whitespace-nowrap">
              Cas Client
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {activeDropdown === "cas-client" && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[700px] mt-1 z-50">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-200 ease-out">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black mb-1">Nos Références Clients</h3>
                    <p className="text-gray-600 text-sm">Découvrez nos succès clients</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {casClientMenuClients.length > 0 ? (
                      casClientMenuClients.map((client) => (
                        <Link
                          key={client.slug}
                          href={`/cas-client/${client.slug}`}
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
                            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-[#714b67] transition-colors duration-300 line-clamp-2">
                              {client.name}
                            </h3>
                            <p className="text-gray-600 mb-2 line-clamp-2">{client.headline || client.summary}</p>
                            <div className="text-xs text-[#ff5c35] font-medium mt-auto">
                              {client.projectStats && client.projectStats.length > 0 ? client.projectStats[0].value : ''}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-400">Aucun client sélectionné</div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Button className="bg-black text-white hover:bg-gray-900 transition-colors duration-200 px-6 py-2 text-sm rounded-xl">
                      Voir Tous les Cas <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Button Group - Right Side */}
        <div className="flex items-center gap-2 ml-4">
          {/* Rendez-vous Button with Red Dot */}
          <div className="relative">
            <Link href="/rendez-vous" className="relative">
              <Button
                className="rounded-full bg-black text-white px-6 py-2 shadow-none overflow-hidden relative transition group border border-transparent hover:border-black"
              >
                <span className="relative z-10 transition group-hover:shimmer-text">
                  PRENDRE UN RENDEZ-VOUS
                </span>
              </Button>
            </Link>
          </div>
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
            <a href="https://wa.me/212XXXXXXXXX" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp className="w-6 h-6 text-white group-hover:text-green-500 transition-colors duration-200" />
            </a>
          </Button>
          {/* Phone Button */}
          <Button
            asChild
            className="
              rounded-full
              bg-[#ff5c35]
              border-2 border-white
              p-0 w-12 h-12
              flex items-center justify-center
              shadow-none
              transition-all
              duration-200
              hover:bg-white
              hover:border-[#ff5c35]
              hover:scale-110
              focus:outline-none
              group
            "
          >
            <a href="tel:+212XXXXXXXXX" aria-label="Téléphone">
              <Phone className="w-6 h-6 text-white group-hover:text-[#ff5c35] transition-colors duration-200" />
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
          <Link href="/hubspot" className="block text-gray-600 hover:text-black transition-colors font-medium">
            HubSpot
          </Link>
          <Link href="/odoo" className="block text-gray-600 hover:text-black transition-colors font-medium">
            Odoo
          </Link>
          <Link href="/about" className="block text-gray-600 hover:text-black transition-colors font-medium">
            À Propos
          </Link>
          <Link href="/contact" className="block text-gray-600 hover:text-black transition-colors font-medium">
            Contact
          </Link>
          <Link href="/cas-client" className="block text-gray-600 hover:text-black transition-colors font-medium">
            Cas Client
          </Link>
          <div className="pt-6">
            <Button className="w-full bg-black text-white">Commencer</Button>
          </div>
        </div>
      )}
    </header>
  )
}
