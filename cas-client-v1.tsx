"use client"

import { Button } from "@/components/ui/button"
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
          description: "Voir tous les projets"
     },
     {
          value: "hubspot",
          label: "HubSpot CRM",
          color: "var(--color-main)",
          description: "Gestion de la relation client"
     },
     {
          value: "odoo",
          label: "Odoo ERP",
          color: "var(--color-secondary)",
          description: "Gestion d'entreprise complète"
     },
     {
          value: "both",
          label: "HubSpot + Odoo",
          color: "var(--color-main)",
          description: "Solution hybride complète"
     },
]

export default function CasClientV1() {
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedSolution, setSelectedSolution] = useState("all")
     const [selectedSector, setSelectedSector] = useState("Tous")
     const [clientsData, setClientsData] = useState<any[]>([])
     const [filteredClients, setFilteredClients] = useState<any[]>([])
     const [loading, setLoading] = useState(true)
     const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
     const [showMobileFilters, setShowMobileFilters] = useState(false)
     const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
          solutions: true,
          sectors: true
     })

     // Dynamic filtering functions
     const getSectorCount = (sectorName: string) => {
          if (sectorName === "Tous") return clientsData.length
          return clientsData.filter(client => client.sector === sectorName).length
     }

     const getSolutionCount = (solutionValue: string) => {
          if (solutionValue === "all") return clientsData.length
          return clientsData.filter(client =>
               client.solution === solutionValue ||
               (solutionValue === "both" && client.solution === "both")
          ).length
     }

     const getAvailableSectors = () => {
          const sectors = ["Tous", ...new Set(clientsData.map(client => client.sector).filter(Boolean))]
          return sectors
     }

     const toggleFilter = (filterType: string) => {
          setExpandedFilters(prev => ({
               ...prev,
               [filterType]: !prev[filterType]
          }))
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
               filtered = filtered.filter(
                    (client) => client.solution === selectedSolution || (selectedSolution === "both" && client.solution === "both"),
               )
          }

          // Filter by sector
          if (selectedSector !== "Tous") {
               filtered = filtered.filter((client) => client.sector === selectedSector)
          }

          setFilteredClients(filtered)
     }, [searchTerm, selectedSolution, selectedSector, clientsData])

     if (loading) {
          return <Loader />
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
               {/* Hero Section - Minimalist Design */}
               <section className="relative pt-24 pb-16 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                         <div className="text-center mb-16">
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-main)]/5 border border-[var(--color-main)]/10 mb-8">
                                   <Sparkles className="w-3 h-3 text-[var(--color-main)] mr-2" />
                                   <span className="text-xs font-medium text-[var(--color-main)] tracking-wider uppercase">NOS RÉUSSITES</span>
                              </div>
                              <h1 className="text-5xl md:text-7xl font-light text-black mb-8 tracking-tight">
                                   Études de <span className="font-bold text-[var(--color-main)]">Cas</span>
                              </h1>
                              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                                   Découvrez comment nous avons aidé nos clients à transformer leur entreprise avec nos solutions digitales.
                              </p>
                         </div>

                         {/* Minimalist Search - No Shadow */}
                         <div className="max-w-xl mx-auto mb-12">
                              <div className="relative">
                                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                   <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-[var(--color-main)] focus:outline-none text-sm transition-all duration-200 bg-white"
                                   />
                              </div>
                         </div>
                    </div>
               </section>

               {/* Main Content */}
               <section className="pb-20 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                         {/* Mobile Filter Toggle */}
                         <div className="lg:hidden mb-8">
                              <Button
                                   onClick={() => setShowMobileFilters(!showMobileFilters)}
                                   variant="outline"
                                   className="w-full justify-between rounded-full border-gray-200"
                              >
                                   <span className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        Filtres
                                   </span>
                                   <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                              </Button>
                         </div>

                         <div className="flex flex-col lg:flex-row gap-12">
                              {/* Minimalist Filters Sidebar */}
                              <div className={`lg:w-72 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                                   {/* Mobile Close Button */}
                                   <div className="lg:hidden flex justify-end">
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => setShowMobileFilters(false)}
                                             className="rounded-full"
                                        >
                                             <X className="w-4 h-4" />
                                        </Button>
                                   </div>

                                   {/* View Mode Toggle */}
                                   <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4">
                                        <div className="flex items-center justify-between">
                                             <span className="text-sm font-medium text-gray-600">Affichage</span>
                                             <div className="flex bg-gray-100 rounded-full p-1">
                                                  <button
                                                       onClick={() => setViewMode('grid')}
                                                       className={`p-2 rounded-full transition-all duration-200 ${viewMode === 'grid'
                                                            ? 'bg-white text-[var(--color-main)] shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                  >
                                                       <Grid3X3 className="w-4 h-4" />
                                                  </button>
                                                  <button
                                                       onClick={() => setViewMode('list')}
                                                       className={`p-2 rounded-full transition-all duration-200 ${viewMode === 'list'
                                                            ? 'bg-white text-[var(--color-main)] shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                  >
                                                       <List className="w-4 h-4" />
                                                  </button>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Solution Filter */}
                                   <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4">
                                        <button
                                             onClick={() => toggleFilter('solutions')}
                                             className="w-full flex items-center justify-between mb-4"
                                        >
                                             <h3 className="text-sm font-semibold text-gray-800">Solutions</h3>
                                             {expandedFilters.solutions ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                                        </button>
                                        {expandedFilters.solutions && (
                                             <div className="space-y-2">
                                                  {solutions.map((solution) => {
                                                       const count = getSolutionCount(solution.value)
                                                       return (
                                                            <button
                                                                 key={solution.value}
                                                                 onClick={() => setSelectedSolution(solution.value)}
                                                                 className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${selectedSolution === solution.value
                                                                      ? "bg-[var(--color-main)]/10 border border-[var(--color-main)]/20"
                                                                      : "hover:bg-gray-50 border border-transparent"
                                                                      }`}
                                                            >
                                                                 <div className="flex items-center gap-3">
                                                                      <div
                                                                           className="w-3 h-3 rounded-full"
                                                                           style={{ backgroundColor: solution.color }}
                                                                      ></div>
                                                                      <div className="text-left">
                                                                           <div className="text-sm font-medium text-gray-900">{solution.label}</div>
                                                                           <div className="text-xs text-gray-500">{solution.description}</div>
                                                                      </div>
                                                                 </div>
                                                                 <div className="text-sm font-bold text-[var(--color-main)]">{count}</div>
                                                            </button>
                                                       )
                                                  })}
                                             </div>
                                        )}
                                   </div>

                                   {/* Sector Filter */}
                                   <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4">
                                        <button
                                             onClick={() => toggleFilter('sectors')}
                                             className="w-full flex items-center justify-between mb-4"
                                        >
                                             <h3 className="text-sm font-semibold text-gray-800">Secteurs</h3>
                                             {expandedFilters.sectors ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                                        </button>
                                        {expandedFilters.sectors && (
                                             <div className="space-y-1">
                                                  {getAvailableSectors().map((sectorName) => {
                                                       const IconComponent = sectorIcons[sectorName as keyof typeof sectorIcons] || Building
                                                       const count = getSectorCount(sectorName)
                                                       return (
                                                            <button
                                                                 key={sectorName}
                                                                 onClick={() => setSelectedSector(sectorName)}
                                                                 className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${selectedSector === sectorName
                                                                      ? "bg-[var(--color-main)]/10 border border-[var(--color-main)]/20"
                                                                      : "hover:bg-gray-50 border border-transparent"
                                                                      }`}
                                                            >
                                                                 <div className="flex items-center gap-2">
                                                                      <IconComponent className="w-3 h-3 text-gray-500" />
                                                                      <span className="text-sm font-medium text-gray-900">{sectorName}</span>
                                                                 </div>
                                                                 {count > 0 && (
                                                                      <div className="text-xs font-bold text-[var(--color-main)]">{count}</div>
                                                                 )}
                                                            </button>
                                                       )
                                                  })}
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Client Cards */}
                              <div className="flex-1">
                                   <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                             <h2 className="text-2xl font-light text-gray-900">
                                                  {filteredClients.length} <span className="font-bold">projets</span>
                                             </h2>
                                             <p className="text-sm text-gray-500 mt-1">
                                                  {selectedSolution !== "all" && `Solution: ${solutions.find(s => s.value === selectedSolution)?.label}`}
                                                  {selectedSector !== "Tous" && ` • Secteur: ${selectedSector}`}
                                             </p>
                                        </div>

                                        {/* Minimalist Stats */}
                                        <div className="flex items-center gap-8">
                                             <div className="text-center">
                                                  <div className="text-lg font-bold text-[var(--color-main)]">48</div>
                                                  <div className="text-xs text-gray-400">Projets</div>
                                             </div>
                                             <div className="text-center">
                                                  <div className="text-lg font-bold text-[var(--color-secondary)]">98%</div>
                                                  <div className="text-xs text-gray-400">Satisfaction</div>
                                             </div>
                                             <div className="text-center">
                                                  <div className="text-lg font-bold text-[var(--color-main)]">15</div>
                                                  <div className="text-xs text-gray-400">Secteurs</div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Client Cards Grid/List */}
                                   {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                             {filteredClients.map((client, index) => (
                                                  <div
                                                       key={client.slug || client.name}
                                                       className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:border-[var(--color-main)]/30 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 overflow-hidden"
                                                       style={{ animationDelay: `${index * 100}ms` }}
                                                  >
                                                       {/* Header with Logo and Badge */}
                                                       <div className="p-6 pb-4">
                                                            <div className="flex items-start justify-between mb-4">
                                                                 {client.logo ? (
                                                                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50/50 border border-gray-200/50">
                                                                           <Image
                                                                                src={client.logo.startsWith('http') ? client.logo : `https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg`}
                                                                                alt={client.name}
                                                                                width={40}
                                                                                height={40}
                                                                                className="object-contain"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)]">
                                                                           {client.name[0]}
                                                                      </div>
                                                                 )}

                                                                 {/* Solution Badge */}
                                                                 <div className="text-right">
                                                                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-[var(--color-main)] bg-[var(--color-main)]/10 border border-[var(--color-main)]/20">
                                                                           {client.solution === 'hubspot' ? 'HubSpot' :
                                                                                client.solution === 'odoo' ? 'Odoo' :
                                                                                     client.solution === 'both' ? 'Hybride' : client.sector}
                                                                      </div>
                                                                 </div>
                                                            </div>

                                                            {/* Client Info */}
                                                            <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-[var(--color-main)] transition-colors duration-300">
                                                                 {client.name}
                                                            </h3>
                                                            <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                                                                 {client.summary}
                                                            </p>

                                                            {/* Sector */}
                                                            <div className="flex items-center gap-2 mb-4">
                                                                 <Building className="w-3 h-3 text-gray-400" />
                                                                 <span className="text-xs text-gray-500">{client.sector}</span>
                                                            </div>
                                                       </div>

                                                       {/* Results/Stats */}
                                                       <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-gray-100/50 border-t border-gray-200/50">
                                                            <div className="flex items-center justify-between">
                                                                 <div>
                                                                      <div className="text-xs text-gray-400 mb-1">RÉSULTATS</div>
                                                                      <div className="font-bold text-[var(--color-secondary)] text-sm">
                                                                           {client.projectStats?.find?.((s: any) => s.label === "ROI atteint")?.value || "ROI +150%"}
                                                                      </div>
                                                                 </div>
                                                                 <Button
                                                                      size="sm"
                                                                      className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white rounded-full px-4 py-2"
                                                                 >
                                                                      <Link href={`/cas-client/${client.slug}`} className="inline-flex items-center text-xs">
                                                                           Voir <ArrowRight className="ml-1 w-3 h-3" />
                                                                      </Link>
                                                                 </Button>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="space-y-4">
                                             {filteredClients.map((client, index) => (
                                                  <div
                                                       key={client.slug || client.name}
                                                       className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:border-[var(--color-main)]/30 transition-all duration-500 hover:shadow-lg p-6"
                                                  >
                                                       <div className="flex items-center gap-6">
                                                            {/* Logo */}
                                                            <div className="flex-shrink-0">
                                                                 {client.logo ? (
                                                                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50/50 border border-gray-200/50">
                                                                           <Image
                                                                                src={client.logo.startsWith('http') ? client.logo : `https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg`}
                                                                                alt={client.name}
                                                                                width={40}
                                                                                height={40}
                                                                                className="object-contain"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)]">
                                                                           {client.name[0]}
                                                                      </div>
                                                                 )}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                 <div className="flex items-start justify-between mb-2">
                                                                      <h3 className="text-lg font-semibold text-black group-hover:text-[var(--color-main)] transition-colors duration-300">
                                                                           {client.name}
                                                                      </h3>
                                                                      <div className="flex items-center gap-2">
                                                                           <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-[var(--color-main)] bg-[var(--color-main)]/10 border border-[var(--color-main)]/20">
                                                                                {client.solution === 'hubspot' ? 'HubSpot' :
                                                                                     client.solution === 'odoo' ? 'Odoo' :
                                                                                          client.solution === 'both' ? 'Hybride' : client.sector}
                                                                           </div>
                                                                      </div>
                                                                 </div>

                                                                 <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                                                                      {client.summary}
                                                                 </p>

                                                                 <div className="flex items-center gap-6 text-xs text-gray-500">
                                                                      <div className="flex items-center gap-1">
                                                                           <Building className="w-3 h-3" />
                                                                           <span>{client.sector}</span>
                                                                      </div>
                                                                      <div className="flex items-center gap-1">
                                                                           <TrendingUp className="w-3 h-3" />
                                                                           <span>{client.projectStats?.find?.((s: any) => s.label === "ROI atteint")?.value || "ROI +150%"}</span>
                                                                      </div>
                                                                 </div>
                                                            </div>

                                                            {/* Action */}
                                                            <div className="flex-shrink-0">
                                                                 <Button
                                                                      size="sm"
                                                                      className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white rounded-full px-4 py-2"
                                                                 >
                                                                      <Link href={`/cas-client/${client.slug}`} className="inline-flex items-center text-xs">
                                                                           Voir <ArrowRight className="ml-1 w-3 h-3" />
                                                                      </Link>
                                                                 </Button>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   )}

                                   {filteredClients.length === 0 && (
                                        <div className="text-center py-20">
                                             <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                  <Search className="w-6 h-6 text-gray-400" />
                                             </div>
                                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun client trouvé</h3>
                                             <p className="text-gray-500 text-sm">Essayez de modifier vos critères de recherche.</p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </section>
          </div>
     )
}
