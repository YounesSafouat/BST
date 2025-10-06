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
} from "lucide-react"
import { useState, useEffect } from "react"
import Loader from "@/components/home/Loader"

// Dynamic client data from API

const sectors = [
  { name: "Tous", icon: Building },
  { name: "Technologie", icon: Smartphone },
  { name: "Industrie", icon: Building },
  { name: "Santé", icon: Heart },
  { name: "Éducation", icon: GraduationCap },
  { name: "Commerce", icon: ShoppingCart },
  { name: "Automobile", icon: Car },
  { name: "Restauration", icon: Utensils },
  { name: "Immobilier", icon: Home },
]

export default function CasClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSolution, setSelectedSolution] = useState("all")
  const [selectedSector, setSelectedSector] = useState("Tous")
  const [clientsData, setClientsData] = useState<any[]>([])
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-color-black mb-8 tracking-tight">
              Études de <span className="text-color-main">Cas Clients</span>
            </h1>
            <p className="text-2xl text-color-gray max-w-3xl mx-auto leading-relaxed">
              Découvrez comment nous avons aidé nos clients à transformer leur entreprise avec nos solutions digitales.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray" />
              <input
                type="text"
                placeholder="Rechercher un client ou un secteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-gray-300 focus:outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 space-y-8">
              {/* Solution Filter */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Filter className="w-5 h-5 text-gray" />
                  <h3 className="text-lg font-bold text-black">Solution Implémentée</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { value: "all", label: "Toutes les solutions", color: "var(--color-black)" },
                    { value: "hubspot", label: "HubSpot CRM", color: "var(--color-main)" },
                    { value: "odoo", label: "Odoo ERP", color: "var(--color-secondary)" },
                    { value: "both", label: "HubSpot + Odoo", color: "var(--color-black)" },
                  ].map((solution) => (
                    <button
                      key={solution.value}
                      onClick={() => setSelectedSolution(solution.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${selectedSolution === solution.value
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: solution.color }}></div>
                      <span className="font-medium text-gray">{solution.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector Filter */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-5 h-5 text-gray" />
                  <h3 className="text-lg font-bold text-black">Secteur d'Activité</h3>
                </div>
                <div className="space-y-2">
                  {sectors.map((sector) => (
                    <button
                      key={sector.name}
                      onClick={() => setSelectedSector(sector.name)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${selectedSector === sector.name
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                    >
                      <sector.icon className="w-4 h-4 text-gray" />
                      <span className="font-medium text-gray">{sector.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Cards */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">
                  {filteredClients.length} Études de Cas
                </h2>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <Loader />
                ) : filteredClients.map((client, index) => (
                  <div
                    key={client.slug || client.name}
                    className="group relative p-6 rounded-2xl border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 bg-white hover:shadow-lg transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Solution Indicator */}
                    {/* Optionally use a color or featured flag */}
                    {/* Client Logo */}
                    <div className="flex items-start justify-between mb-4">
                      {client.logo ? (
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-50">
                          <img
                            src={client.logo.startsWith('http') ? client.logo : `/logos/${client.logo}`}
                            alt={client.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300 bg-[var(--color-secondary)]"
                        >
                          {client.name[0]}
                        </div>
                      )}
                      <div className="text-right">
                        <div className="text-xs text-gray mb-1">SECTEUR</div>
                        <div className="text-sm font-medium text-gray">{client.sector}</div>
                      </div>
                    </div>

                    {/* Client Info */}
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray transition-colors duration-300">
                      {client.name}
                    </h3>
                    <p className="text-gray mb-4 leading-relaxed">{client.summary}</p>

                    {/* Results/Stats */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray mb-1">RÉSULTATS</div>
                        <div className="font-bold text-black">{client.projectStats?.find?.((s: any) => s.label === "ROI atteint")?.value || ""}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <a href={`/cas-client/${client.slug}`} className="inline-flex items-center">
                          Voir le cas <ArrowRight className="ml-2 w-4 h-4" /></a>
                      </Button>
                    </div>

                    {/* Solution Badge */}
                    <div className="absolute top-4 right-4">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[var(--color-secondary)]"
                      >
                        {client.migration || client.sector}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Aucun client trouvé</h3>
                  <p className="text-gray">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
