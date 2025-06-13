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
import Header from "./components/header"

// Mock client data
const clientsData = [
  {
    id: 1,
    name: "Worqbox",
    sector: "deco",
    solution: "odoo",
    description: "ERP complet pour optimisation des processus",
    results: "+300% Leads qualifiés",
    logo: "WO",
    color: "#714b67",
    url: "/client/worqbox",
  },
  {
    id: 2,
    name: "TEST 2",
    sector: "Industrie",
    solution: "odoo",
    description: "ERP complet pour optimisation production",
    results: "-40% Coûts opérationnels",
    logo: "AM",
    color: "#714b67",
    url: "/client/worqbox",
  },
  {
    id: 3,
    name: "TEST 3",
    sector: "Santé",
    solution: "hubspot",
    description: "CRM patient et marketing médical",
    results: "+250% Rendez-vous",
    logo: "MP",
    color: "#ff5c35",
    url: "/client/worqbox",
  },
  {
    id: 4,
    name: "TEST 4",
    sector: "Éducation",
    solution: "odoo",
    description: "Gestion complète établissement scolaire",
    results: "+90% Efficacité admin",
    logo: "EA",
    color: "#714b67",
    url: "/client/worqbox",
  },
  {
    id: 5,
    name: "TEST 5",
    sector: "Commerce",
    solution: "both",
    description: "Intégration ERP + CRM pour chaîne retail",
    results: "+180% ROI",
    logo: "RM",
    color: "#000000",
    url: "/client/worqbox",
  },
  {
    id: 6,
    name: "TEST 6",
    sector: "Automobile",
    solution: "odoo",
    description: "ERP spécialisé pièces automobiles",
    results: "-50% Temps gestion stock",
    logo: "AP",
    color: "#714b67",
    url: "/client/worqbox",
  },
  {
    id: 7,
    name: "TEST 7",
    sector: "Restauration",
    solution: "hubspot",
    description: "CRM et marketing pour chaîne restaurants",
    results: "+400% Commandes en ligne",
    logo: "FC",
    color: "#ff5c35",
    url: "/client/worqbox",
  },
  {
    id: 8,
    name: "TEST 8",
    sector: "Immobilier",
    solution: "both",
    description: "Solution complète gestion immobilière",
    results: "+220% Ventes",
    logo: "PT",
    color: "#000000",
    url: "/client/worqbox",
  },
]

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
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSolution, setSelectedSolution] = useState("all")
  const [selectedSector, setSelectedSector] = useState("Tous")
  const [filteredClients, setFilteredClients] = useState(clientsData)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    let filtered = clientsData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [searchTerm, selectedSolution, selectedSector])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header scrollY={scrollY} isLoaded={isLoaded} />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 mb-8">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-700 tracking-wide">NOS RÉUSSITES</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Cas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#714b67] to-[#ff5c35]">Client</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez comment nous avons transformé les entreprises marocaines avec nos solutions Odoo et HubSpot.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-black">Solution Implémentée</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { value: "all", label: "Toutes les solutions", color: "#000000" },
                    { value: "hubspot", label: "HubSpot CRM", color: "#ff5c35" },
                    { value: "odoo", label: "Odoo ERP", color: "#714b67" },
                    { value: "both", label: "HubSpot + Odoo", color: "#000000" },
                  ].map((solution) => (
                    <button
                      key={solution.value}
                      onClick={() => setSelectedSolution(solution.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        selectedSolution === solution.value
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: solution.color }}></div>
                      <span className="font-medium text-gray-700">{solution.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector Filter */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-black">Secteur d'Activité</h3>
                </div>
                <div className="space-y-2">
                  {sectors.map((sector) => (
                    <button
                      key={sector.name}
                      onClick={() => setSelectedSector(sector.name)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        selectedSector === sector.name
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <sector.icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">{sector.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Cards */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">
                  {filteredClients.length} Client{filteredClients.length > 1 ? "s" : ""} Trouvé
                  {filteredClients.length > 1 ? "s" : ""}
                </h2>
                <div className="text-sm text-gray-500">
                  {selectedSolution !== "all" && `Filtré par solution • `}
                  {selectedSector !== "Tous" && `Secteur: ${selectedSector}`}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredClients.map((client, index) => (
                  <div
                    key={client.id}
                    className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Solution Indicator */}
                    <div
                      className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                      style={{ backgroundColor: client.color }}
                    ></div>

                    {/* Client Logo */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.logo}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">SECTEUR</div>
                        <div className="text-sm font-medium text-gray-700">{client.sector}</div>
                      </div>
                    </div>

                    {/* Client Info */}
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors duration-300">
                      {client.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{client.description}</p>

                    {/* Results */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">RÉSULTATS</div>
                        <div className="font-bold text-black">{client.results}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <a href={client.url} className="inline-flex items-center">
                        Voir le cas <ArrowRight className="ml-2 w-4 h-4" /></a>
                      </Button>
                    </div>

                    {/* Solution Badge */}
                    <div className="absolute top-4 right-4">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.solution === "hubspot" && "HubSpot"}
                        {client.solution === "odoo" && "Odoo"}
                        {client.solution === "both" && "HubSpot + Odoo"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Aucun client trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
