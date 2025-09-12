"use client"

import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/ui/TestimonialCard"
import {
     Search,
     Filter,
     ArrowRight,
     Building,
     ShoppingCart,
     GraduationCap,
     Heart,
     Car,
     Home,
     Utensils,
     Smartphone,
     TrendingUp,
     Users,
     Calendar,
     CheckCircle,
     Star,
     ExternalLink,
     Eye,
     BarChart3,
     Grid3X3,
     List,
     MapPin,
     Clock,
     Award,
     Zap,
     Target,
     ChevronDown,
     X,
     Plus,
     Minus,
     Sparkles,
     Rocket,
     Play,
     Pause,
     Volume2,
     VolumeX,
     Layers,
     Hexagon,
     Triangle,
     Circle,
     Square,
} from "lucide-react"
import { useState, useEffect } from "react"
import Loader from "@/components/home/Loader"
import Image from "next/image"
import Link from "next/link"

const sectorIcons = {
     "Tous": Building,
     "Technologie": Smartphone,
     "Industrie": Building,
     "Santé": Heart,
     "Éducation": GraduationCap,
     "Commerce": ShoppingCart,
     "Automobile": Car,
     "Restauration": Utensils,
     "Immobilier": Home,
}

const solutions = [
     {
          value: "all",
          label: "Toutes les solutions",
          color: "var(--color-secondary)",
          description: "Voir tous les projets",
          icon: Layers
     },
     {
          value: "hubspot",
          label: "HubSpot",
          color: "var(--color-main)",
          description: "Gestion de la relation client",
          icon: null,
          logoUrl: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/hubspot-favicone.webp"
     },
     {
          value: "odoo",
          label: "Odoo",
          color: "var(--color-secondary)",
          description: "Gestion d'entreprise complète",
          icon: null,
          logoUrl: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/Odoo.svg"
     },
     {
          value: "both",
          label: "HubSpot + Odoo",
          color: "var(--color-main)",
          description: "Solution hybride complète",
          icon: Circle
     },
]

export default function CasClientV2() {
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedSolution, setSelectedSolution] = useState("all")
     const [selectedSector, setSelectedSector] = useState("Tous")
     const [clientsData, setClientsData] = useState<any[]>([])
     const [filteredClients, setFilteredClients] = useState<any[]>([])
     const [loading, setLoading] = useState(true)
     const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
     const [showMobileFilters, setShowMobileFilters] = useState(false)
     const [hoveredCard, setHoveredCard] = useState<number | null>(null)
     const [isPlaying, setIsPlaying] = useState(false)

     // Dynamic filtering functions
     const getSectorCount = (sectorName: string) => {
          if (sectorName === "Tous") return clientsData.length
          return clientsData.filter(client => client.sector === sectorName).length
     }

     const getSolutionCount = (solutionValue: string) => {
          if (solutionValue === "all") return clientsData.length

          return clientsData.filter(client => {
               const clientSolution = client.solution?.toLowerCase()

               // Handle different solution value formats
               switch (solutionValue) {
                    case "hubspot":
                         return clientSolution === "hubspot" || clientSolution === "hubspot crm"
                    case "odoo":
                         return clientSolution === "odoo" || clientSolution === "odoo erp"
                    case "both":
                         return clientSolution === "both" ||
                              clientSolution === "hubspot + odoo" ||
                              clientSolution === "hybride" ||
                              (clientSolution && clientSolution.includes("hubspot") && clientSolution.includes("odoo"))
                    default:
                         return clientSolution === solutionValue
               }
          }).length
     }

     const getAvailableSectors = () => {
          const sectors = ["Tous", ...new Set(clientsData.map(client => client.sector).filter(Boolean))]
          return sectors
     }

     // Calculate real statistics
     const getRealStats = () => {
          const totalProjects = clientsData.length
          const uniqueSectors = new Set(clientsData.map(client => client.sector).filter(Boolean)).size

          // Calculate satisfaction from testimonials or default to high percentage
          const clientsWithTestimonials = clientsData.filter(client => client.testimonial?.quote).length
          const satisfactionRate = clientsWithTestimonials > 0 ? Math.round((clientsWithTestimonials / totalProjects) * 100) : 95

          return {
               projects: totalProjects,
               satisfaction: satisfactionRate,
               sectors: uniqueSectors
          }
     }

     // Fetch client cases from API
     useEffect(() => {
          const fetchClients = async () => {
               setLoading(true)
               try {
                    const res = await fetch("/api/content?type=clients-page")
                    const data = await res.json()
                    const page = Array.isArray(data) ? data.find(item => item.type === 'clients-page') : data
                    const cases = page?.content?.clientCases || []
                    setClientsData(cases)
                    setFilteredClients(cases)
               } catch (err) {
                    setClientsData([])
                    setFilteredClients([])
               } finally {
                    setLoading(false)
               }
          }
          fetchClients()
     }, [])

     useEffect(() => {
          let filtered = clientsData

          // Filter by search term
          if (searchTerm) {
               filtered = filtered.filter(
                    (client) =>
                         client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.summary?.toLowerCase?.() || "").includes(searchTerm.toLowerCase()),
               )
          }

          // Filter by solution
          if (selectedSolution !== "all") {
               filtered = filtered.filter((client) => {
                    const clientSolution = client.solution?.toLowerCase()

                    switch (selectedSolution) {
                         case "hubspot":
                              return clientSolution === "hubspot" || clientSolution === "hubspot crm"
                         case "odoo":
                              return clientSolution === "odoo" || clientSolution === "odoo erp"
                         case "both":
                              return clientSolution === "both" ||
                                   clientSolution === "hubspot + odoo" ||
                                   clientSolution === "hybride" ||
                                   (clientSolution && clientSolution.includes("hubspot") && clientSolution.includes("odoo"))
                         default:
                              return clientSolution === selectedSolution
                    }
               })
          }

          // Filter by sector
          if (selectedSector !== "Tous") {
               filtered = filtered.filter((client) => client.sector === selectedSector)
          }

          setFilteredClients(filtered)
     }, [searchTerm, selectedSolution, selectedSector, clientsData])

     // Debug: Log actual solution values in CMS data
     useEffect(() => {
          if (clientsData.length > 0) {
               console.log("🔍 Client solutions in CMS:", clientsData.map(client => ({
                    name: client.name,
                    solution: client.solution,
                    solutionLower: client.solution?.toLowerCase()
               })))
          }
     }, [clientsData])

     if (loading) {
          return <Loader />
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">


                         {/* Hero Section - Copernic Style */}
                         <section className="relative pt-16 pb-20 px-6 lg:px-8">
                              <div className="max-w-7xl mx-auto">
                                   <div className="text-center mb-16">
                                        <h2 className="text-sm font-medium text-[var(--color-secondary)] mb-4">Nos cas clients</h2>
                                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                                             Nos clients ont vu leur croissance augmenter, parfois de manière spectaculaire...
                                        </h1>
                                        <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] mx-auto"></div>
                                   </div>

                                   {/* Featured Video Testimonials - À la une */}
                                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                                        {clientsData.slice(0, 2).map((client, index) => (
                                             <TestimonialCard
                                                  key={client.slug || client.name}
                                                  title={client.name}
                                                  description={client.summary}
                                                  videoThumbnail={client.videoThumbnail}
                                                  logo={client.logo}
                                                  solution={client.solution}
                                                  interviewee={client.interviewee}
                                                  variant={index === 0 ? 'primary' : 'secondary'}
                                                  size="large"
                                                  slug={client.slug}
                                             />
                                        ))}
                                   </div>

                              </div>
                         </section>

                         {/* Main Content */}
                         <section className="pb-20 relative">
                              <div className="flex flex-col lg:flex-row">
                                   {/* Mobile Filter Toggle */}
                                   <div className="lg:hidden mb-8 px-6">
                                        <Button
                                             onClick={() => setShowMobileFilters(!showMobileFilters)}
                                             variant="outline"
                                             className="w-full justify-between bg-white/80 border-gray-300 text-gray-900 hover:bg-gray-50"
                                        >
                                             <span className="flex items-center gap-2">
                                                  <Filter className="w-4 h-4" />
                                                  Filtres
                                             </span>
                                             <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                                        </Button>
                                   </div>

                                   {/* Futuristic Filters Sidebar - Fixed Left Position */}
                                   <div className={`lg:w-96 space-y-6 px-6 lg:px-8 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                                        {/* Mobile Close Button */}
                                        <div className="lg:hidden flex justify-end">
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setShowMobileFilters(false)}
                                                  className="text-gray-900 hover:bg-gray-100"
                                             >
                                                  <X className="w-4 h-4" />
                                             </Button>
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
                                             <div className="flex items-center justify-between mb-4">
                                                  <span className="text-sm font-medium text-gray-700">Mode d'affichage</span>
                                                  <div className="flex bg-gray-100 rounded-lg p-1">
                                                       <button
                                                            type="button"
                                                            onClick={() => setViewMode('grid')}
                                                            title="Vue grille"
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === 'grid'
                                                                 ? 'bg-[var(--color-main)] text-white shadow-sm'
                                                                 : 'text-gray-500 hover:text-gray-700'
                                                                 }`}
                                                       >
                                                            <Grid3X3 className="w-4 h-4" />
                                                       </button>
                                                       <button
                                                            type="button"
                                                            onClick={() => setViewMode('list')}
                                                            title="Vue liste"
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === 'list'
                                                                 ? 'bg-[var(--color-main)] text-white shadow-sm'
                                                                 : 'text-gray-500 hover:text-gray-700'
                                                                 }`}
                                                       >
                                                            <List className="w-4 h-4" />
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Search Bar */}
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4">
                                             <div className="relative">
                                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                  <input
                                                       type="text"
                                                       placeholder="Rechercher un client..."
                                                       value={searchTerm}
                                                       onChange={(e) => setSearchTerm(e.target.value)}
                                                       className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-main)] focus:outline-none text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                                                  />
                                             </div>
                                        </div>

                                        {/* Solution Filter */}
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
                                             <div className="flex items-center gap-3 mb-6">
                                                  <div className="w-8 h-8 bg-[var(--color-main)]/20 rounded-lg flex items-center justify-center">
                                                       <Filter className="w-4 h-4 text-[var(--color-main)]" />
                                                  </div>
                                                  <h3 className="text-lg font-bold text-gray-900">Solution Implémentée</h3>
                                             </div>
                                             <div className="space-y-3">
                                                  {solutions.map((solution) => {
                                                       const count = getSolutionCount(solution.value)
                                                       const IconComponent = solution.icon
                                                       return (
                                                            <button
                                                                 key={solution.value}
                                                                 onClick={() => setSelectedSolution(solution.value)}
                                                                 className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${selectedSolution === solution.value
                                                                      ? "bg-[var(--color-main)]/20 border-2 border-[var(--color-main)]/30 shadow-lg"
                                                                      : "hover:bg-gray-100 border-2 border-transparent hover:border-gray-300"
                                                                      }`}
                                                            >
                                                                 <div className="flex items-center gap-3">
                                                                      <div className="w-8 h-8 bg-[var(--color-main)]/20 rounded-lg flex items-center justify-center">
                                                                           {solution.logoUrl ? (
                                                                                <Image
                                                                                     src={solution.logoUrl}
                                                                                     alt={solution.label}
                                                                                     width={24}
                                                                                     height={24}
                                                                                     className="object-contain"
                                                                                />
                                                                           ) : IconComponent ? (
                                                                                <IconComponent className="w-6 h-6 text-[var(--color-main)]" />
                                                                           ) : null}
                                                                      </div>
                                                                      <div className="text-left">
                                                                           <div className="font-medium text-gray-900">{solution.label}</div>
                                                                           <div className="text-xs text-gray-500">{solution.description}</div>
                                                                      </div>
                                                                 </div>
                                                                 <div className="text-right">
                                                                      <div className="text-sm font-bold text-[var(--color-main)]">{count}</div>
                                                                      <div className="text-xs text-gray-400">projets</div>
                                                                 </div>
                                                            </button>
                                                       )
                                                  })}
                                             </div>
                                        </div>

                                        {/* Sector Filter */}
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
                                             <div className="flex items-center gap-3 mb-6">
                                                  <div className="w-8 h-8 bg-[var(--color-main)]/20 rounded-lg flex items-center justify-center">
                                                       <Building className="w-4 h-4 text-[var(--color-main)]" />
                                                  </div>
                                                  <h3 className="text-lg font-bold text-gray-900">Secteur d'Activité</h3>
                                             </div>
                                             <div className="space-y-2">
                                                  {getAvailableSectors().map((sectorName) => {
                                                       const IconComponent = sectorIcons[sectorName as keyof typeof sectorIcons] || Building
                                                       const count = getSectorCount(sectorName)
                                                       return (
                                                            <button
                                                                 key={sectorName}
                                                                 onClick={() => setSelectedSector(sectorName)}
                                                                 className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${selectedSector === sectorName
                                                                      ? "bg-[var(--color-main)]/20 border-2 border-[var(--color-main)]/30 shadow-lg"
                                                                      : "hover:bg-gray-100 border-2 border-transparent hover:border-gray-300"
                                                                      }`}
                                                            >
                                                                 <div className="flex items-center gap-3">
                                                                      <IconComponent className="w-4 h-4 text-gray-500" />
                                                                      <span className="font-medium text-gray-900">{sectorName}</span>
                                                                 </div>
                                                                 {count > 0 && (
                                                                      <div className="text-sm font-bold text-[var(--color-main)]">{count}</div>
                                                                 )}
                                                            </button>
                                                       )
                                                  })}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Client Cards - Main Content Area */}
                                   <div className="flex-1 px-6 lg:px-8">
                                        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                             <div>
                                                  <h2 className="text-3xl font-bold text-gray-900">
                                                       {filteredClients.length} Études de Cas
                                                  </h2>
                                                  <p className="text-gray-600 mt-1">
                                                       {selectedSolution !== "all" && `Solution: ${solutions.find(s => s.value === selectedSolution)?.label}`}
                                                       {selectedSector !== "Tous" && ` • Secteur: ${selectedSector}`}
                                                  </p>
                                             </div>

                                             {/* Real Stats */}
                                             <div className="flex items-center gap-8">
                                                  <div className="text-center">
                                                       <div className="text-3xl font-bold text-[var(--color-main)]">{getRealStats().projects}</div>
                                                       <div className="text-xs text-gray-500">Projets</div>
                                                  </div>
                                                  <div className="text-center">
                                                       <div className="text-3xl font-bold text-[var(--color-secondary)]">{getRealStats().satisfaction}%</div>
                                                       <div className="text-xs text-gray-500">Satisfaction</div>
                                                  </div>
                                                  <div className="text-center">
                                                       <div className="text-3xl font-bold text-[var(--color-main)]">{getRealStats().sectors}</div>
                                                       <div className="text-xs text-gray-500">Secteurs</div>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Client Cards Grid/List */}
                                        {viewMode === 'grid' ? (
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                  {filteredClients.map((client, index) => (
                                                       <TestimonialCard
                                                            key={client.slug || client.name}
                                                            title={client.name}
                                                            description={client.summary}
                                                            videoThumbnail={client.videoThumbnail}
                                                            logo={client.logo}
                                                            solution={client.solution}
                                                            interviewee={client.interviewee}
                                                            variant={index % 2 === 0 ? 'primary' : 'secondary'}
                                                            size="small"
                                                            slug={client.slug}
                                                            hidePlayIcon={true}
                                                       />
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="space-y-6">
                                                  {filteredClients.map((client, index) => (
                                                       <TestimonialCard
                                                            key={client.slug || client.name}
                                                            title={client.name}
                                                            description={client.summary}
                                                            videoThumbnail={client.videoThumbnail}
                                                            logo={client.logo}
                                                            solution={client.solution}
                                                            interviewee={client.interviewee}
                                                            variant={index % 2 === 0 ? 'primary' : 'secondary'}
                                                            size="small"
                                                            slug={client.slug}
                                                            hidePlayIcon={true}
                                                       />
                                                  ))}
                                             </div>
                                        )}

                                        {filteredClients.length === 0 && (
                                             <div className="text-center py-20">
                                                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                       <Search className="w-8 h-8 text-gray-400" />
                                                  </div>
                                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun client trouvé</h3>
                                                  <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </section>
          </div>
     )
}