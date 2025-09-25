"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Building, 
  Users, 
  Target, 
  Award,
  ChevronDown,
  X,
  Plus,
  Minus,
  Play,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DynamicClientCase, ClientCaseFilters, AVAILABLE_SECTORS, AVAILABLE_TAGS } from '@/lib/types/cas-client'
import Loader from '@/components/home/Loader'

interface DynamicCasClientListingProps {
  initialCases?: DynamicClientCase[]
}

const sectorIcons = {
  'Technologie': Building,
  'Industrie': Building,
  'Santé': Users,
  'Éducation': Users,
  'Commerce': Building,
  'Automobile': Building,
  'Restauration': Building,
  'Immobilier': Building,
  'Finance': Building,
  'Logistique': Building,
  'Agriculture': Building,
  'Tourisme': Building,
  'Autre': Building,
}

const solutionIcons = {
  'hubspot': '🔵',
  'odoo': '🟢',
  'both': '🟡',
  'custom': '⚪'
}

const solutionLabels = {
  'hubspot': 'HubSpot CRM',
  'odoo': 'Odoo ERP',
  'both': 'HubSpot + Odoo',
  'custom': 'Solution Personnalisée'
}

export default function DynamicCasClientListing({ initialCases = [] }: DynamicCasClientListingProps) {
  const [cases, setCases] = useState<DynamicClientCase[]>(initialCases)
  const [filteredCases, setFilteredCases] = useState<DynamicClientCase[]>(initialCases)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<ClientCaseFilters>({
    search: '',
    solution: 'all',
    sector: 'all',
    tags: [],
    featured: false,
    published: true,
    sortBy: 'newest'
  })
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState({
    solutions: true,
    sectors: true,
    tags: false
  })

  // Fetch cases from API
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/cas-client')
        if (response.ok) {
          const data = await response.json()
          setCases(data.cases || [])
          setFilteredCases(data.cases || [])
        }
      } catch (error) {
        console.error('Error fetching cases:', error)
      } finally {
        setLoading(false)
      }
    }

    if (initialCases.length === 0) {
      fetchCases()
    }
  }, [initialCases.length])

  // Apply filters
  useEffect(() => {
    let filtered = [...cases]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(case_ => 
        case_.name.toLowerCase().includes(searchTerm) ||
        case_.headline.toLowerCase().includes(searchTerm) ||
        case_.summary.toLowerCase().includes(searchTerm) ||
        case_.company.sector.toLowerCase().includes(searchTerm) ||
        case_.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Solution filter
    if (filters.solution && filters.solution !== 'all') {
      filtered = filtered.filter(case_ => case_.project.solution === filters.solution)
    }

    // Sector filter
    if (filters.sector && filters.sector !== 'all') {
      filtered = filtered.filter(case_ => case_.company.sector === filters.sector)
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(case_ => 
        filters.tags!.some(tag => case_.tags.includes(tag))
      )
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(case_ => case_.featured)
    }

    // Published filter
    if (filters.published !== undefined) {
      filtered = filtered.filter(case_ => case_.published === filters.published)
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredCases(filtered)
  }, [cases, filters])

  // Get available sectors from cases
  const getAvailableSectors = () => {
    const sectors = new Set(cases.map(case_ => case_.company.sector))
    return ['all', ...Array.from(sectors)].sort()
  }

  // Get available tags from cases
  const getAvailableTags = () => {
    const allTags = cases.flatMap(case_ => case_.tags)
    return Array.from(new Set(allTags)).sort()
  }

  // Get solution count
  const getSolutionCount = (solution: string) => {
    if (solution === 'all') return cases.length
    return cases.filter(case_ => case_.project.solution === solution).length
  }

  // Get sector count
  const getSectorCount = (sector: string) => {
    if (sector === 'all') return cases.length
    return cases.filter(case_ => case_.company.sector === sector).length
  }

  // Get tag count
  const getTagCount = (tag: string) => {
    return cases.filter(case_ => case_.tags.includes(tag)).length
  }

  // Toggle filter
  const toggleFilter = (filterType: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType as keyof typeof prev]
    }))
  }

  // Update filter
  const updateFilter = (key: keyof ClientCaseFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      solution: 'all',
      sector: 'all',
      tags: [],
      featured: false,
      published: true,
      sortBy: 'newest'
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-main)]/10 border border-[var(--color-main)]/20 mb-8">
              <Award className="w-4 h-4 text-[var(--color-main)] mr-2" />
              <span className="text-sm font-medium text-[var(--color-main)] tracking-wider uppercase">Nos Réussites</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Études de <span className="text-[var(--color-main)]">Cas Clients</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez comment nous avons aidé nos clients à transformer leur entreprise avec nos solutions digitales.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client, un secteur ou un mot-clé..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-[var(--color-main)] focus:outline-none text-lg bg-white shadow-sm"
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
                Filtres ({Object.values(filters).filter(v => v && v !== 'all' && v !== false).length})
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
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
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Mode d'affichage</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-[var(--color-main)] text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-[var(--color-main)] text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Solution Filter */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <button
                  onClick={() => toggleFilter('solutions')}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">Solutions</h3>
                  {expandedFilters.solutions ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedFilters.solutions && (
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Toutes les solutions' },
                      { value: 'hubspot', label: 'HubSpot CRM' },
                      { value: 'odoo', label: 'Odoo ERP' },
                      { value: 'both', label: 'HubSpot + Odoo' },
                      { value: 'custom', label: 'Solution Personnalisée' }
                    ].map((solution) => (
                      <button
                        key={solution.value}
                        onClick={() => updateFilter('solution', solution.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                          filters.solution === solution.value
                            ? "bg-[var(--color-main)]/10 border border-[var(--color-main)]/20"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{solutionIcons[solution.value as keyof typeof solutionIcons] || '⚪'}</span>
                          <span className="font-medium text-gray-900">{solution.label}</span>
                        </div>
                        <div className="text-sm font-bold text-[var(--color-main)]">{getSolutionCount(solution.value)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sector Filter */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <button
                  onClick={() => toggleFilter('sectors')}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">Secteurs</h3>
                  {expandedFilters.sectors ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedFilters.sectors && (
                  <div className="space-y-1">
                    {getAvailableSectors().map((sector) => {
                      const IconComponent = sectorIcons[sector as keyof typeof sectorIcons] || Building
                      return (
                        <button
                          key={sector}
                          onClick={() => updateFilter('sector', sector)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                            filters.sector === sector
                              ? "bg-[var(--color-main)]/10 border border-[var(--color-main)]/20"
                              : "hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{sector === 'all' ? 'Tous les secteurs' : sector}</span>
                          </div>
                          <div className="text-sm font-bold text-[var(--color-main)]">{getSectorCount(sector)}</div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Tags Filter */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <button
                  onClick={() => toggleFilter('tags')}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">Mots-clés</h3>
                  {expandedFilters.tags ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedFilters.tags && (
                  <div className="space-y-2">
                    {getAvailableTags().map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                          filters.tags?.includes(tag)
                            ? "bg-[var(--color-main)]/10 border border-[var(--color-main)]/20"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900">#{tag}</span>
                        <div className="text-sm font-bold text-[var(--color-main)]">{getTagCount(tag)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Effacer tous les filtres
              </Button>
            </div>

            {/* Cases Grid/List */}
            <div className="flex-1">
              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {filteredCases.length} Études de Cas
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filters.solution !== 'all' && `Solution: ${solutionLabels[filters.solution as keyof typeof solutionLabels]}`}
                    {filters.sector !== 'all' && ` • Secteur: ${filters.sector}`}
                    {filters.tags && filters.tags.length > 0 && ` • Tags: ${filters.tags.join(', ')}`}
                  </p>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="newest">Plus récent</option>
                    <option value="oldest">Plus ancien</option>
                    <option value="name">Nom A-Z</option>
                    <option value="featured">Mis en avant</option>
                  </select>
                </div>
              </div>

              {/* Cases Display */}
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {filteredCases.map((case_, index) => (
                      <CaseCard key={case_.slug} case_={case_} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {filteredCases.map((case_, index) => (
                      <CaseListItem key={case_.slug} case_={case_} index={index} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredCases.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun cas client trouvé</h3>
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

// Case Card Component
const CaseCard: React.FC<{ case_: DynamicClientCase; index: number }> = ({ case_, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group relative bg-white rounded-2xl border border-gray-200 hover:border-[var(--color-main)]/30 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 overflow-hidden"
  >
    {/* Cover Image */}
    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
      <Image
        src={case_.media.coverImage}
        alt={case_.name}
        width={400}
        height={250}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      {/* Play Button for Video */}
      {case_.media.heroVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Featured Badge */}
      {case_.featured && (
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 bg-[var(--color-main)] text-white text-xs font-bold rounded-full">
            Mis en avant
          </div>
        </div>
      )}

      {/* Solution Badge */}
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full">
          {solutionIcons[case_.project.solution]}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      {/* Company Logo */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
          <Image
            src={case_.company.logo}
            alt={case_.company.sector}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div>
          <div className="text-sm text-gray-500">SECTEUR</div>
          <div className="text-sm font-medium text-gray-900">{case_.company.sector}</div>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--color-main)] transition-colors duration-300">
        {case_.headline}
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
        {case_.summary}
      </p>

      {/* Quick Stats */}
      {case_.quickStats && case_.quickStats.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          {case_.quickStats.slice(0, 2).map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-lg font-bold text-[var(--color-main)]">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {case_.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            #{tag}
          </span>
        ))}
        {case_.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{case_.tags.length - 3}
          </span>
        )}
      </div>

      {/* CTA Button */}
      <Link href={`/cas-client/${case_.slug}`}>
        <Button className="w-full bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white">
          Voir le cas client
        </Button>
      </Link>
    </div>
  </motion.div>
)

// Case List Item Component
const CaseListItem: React.FC<{ case_: DynamicClientCase; index: number }> = ({ case_, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group bg-white rounded-2xl border border-gray-200 hover:border-[var(--color-main)]/30 transition-all duration-500 hover:shadow-lg p-6"
  >
    <div className="flex items-center gap-6">
      {/* Cover Image */}
      <div className="flex-shrink-0">
        <div className="relative w-32 h-24 bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={case_.media.coverImage}
            alt={case_.name}
            width={128}
            height={96}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {case_.media.heroVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-main)] transition-colors duration-300">
              {case_.headline}
            </h3>
            <p className="text-sm text-gray-600">{case_.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-[var(--color-main)]/10 text-[var(--color-main)] text-xs font-bold rounded-full">
              {solutionIcons[case_.project.solution]}
            </div>
            {case_.featured && (
              <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                ⭐
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2">
          {case_.summary}
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Building className="w-4 h-4" />
            <span>{case_.company.sector}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{case_.company.size}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{case_.project.duration}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {case_.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
          {case_.tags.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{case_.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex-shrink-0">
        <Link href={`/cas-client/${case_.slug}`}>
          <Button className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white">
            Voir le cas
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
)
