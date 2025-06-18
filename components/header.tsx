"use client"

import { Button } from "@/components/ui/button"
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
import { useState } from "react"
import { FaWhatsapp } from "react-icons/fa"

interface HeaderProps {
  scrollY: number
  isLoaded: boolean
}

export default function Header({ scrollY, isLoaded }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 lg:px-8 transition-all duration-500 rounded-full w-[95%] max-w-7xl mx-auto ${
        scrollY > 50
          ? "backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-2xl shadow-black/10"
          : "backdrop-blur-md bg-white/60 border border-gray-100/30 shadow-lg"
      } ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
    >
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <a href="/"  className="relative">
            <img src="bst.png" alt="blackswantechnology" className="w-1/2"/>
            </a>
           
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {/* HubSpot Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("hubspot")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-4">
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
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-4">
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
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-4">
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
            <a
              href="/contact"
              className="text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-4"
            >
              Contact
            </a>
          </div>

          {/* Cas Client Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("cas-client")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-4">
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

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        name: "Client 1",
                        industry: "Technologie",
                        description: "Transformation digitale complète avec HubSpot",
                        results: "ROI +150% en 6 mois"
                      },
                      {
                        name: "Client 2",
                        industry: "Manufacturing",
                        description: "Implémentation Odoo ERP sur mesure",
                        results: "Réduction des coûts de 30%"
                      },
                      {
                        name: "Client 3",
                        industry: "Services",
                        description: "Automatisation des processus marketing",
                        results: "Augmentation des leads de 200%"
                      },
                      {
                        name: "Client 4",
                        industry: "Retail",
                        description: "Solution CRM intégrée",
                        results: "Amélioration de la satisfaction client"
                      },
                      {
                        name: "Client 5",
                        industry: "Finance",
                        description: "Migration vers HubSpot Enterprise",
                        results: "Croissance des ventes de 80%"
                      }
                    ].map((client, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-black">{client.name}</h5>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{client.industry}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{client.description}</p>
                          <p className="text-xs text-[#ff5c35] font-medium mt-1">{client.results}</p>
                        </div>
                      </div>
                    ))}
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
            <Button
              className="rounded-full bg-black text-white px-6 py-2 shadow-none overflow-hidden relative transition group border border-transparent hover:border-black"
            >
              <span className="relative z-10 transition group-hover:shimmer-text">
                PRENDRE UN RENDEZ-VOUS
              </span>
            </Button>
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
          <a href="#hubspot" className="block text-gray-600 hover:text-black transition-colors font-medium">
            HubSpot
          </a>
          <a href="#odoo" className="block text-gray-600 hover:text-black transition-colors font-medium">
            Odoo
          </a>
          <a href="#about" className="block text-gray-600 hover:text-black transition-colors font-medium">
            À Propos
          </a>
          <a href="#contact" className="block text-gray-600 hover:text-black transition-colors font-medium">
            Contact
          </a>
          <a href="/cas-client" className="block text-gray-600 hover:text-black transition-colors font-medium">
            Cas Client
          </a>
          <div className="pt-6">
            <Button className="w-full bg-black text-white">Commencer</Button>
          </div>
        </div>
      )}
    </header>
  )
}
