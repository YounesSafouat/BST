"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Copy,
  Image as ImageIcon,
  Video,
  BarChart3,
  Text,
  Calendar,
  Users,
  Building,
  Target,
  Award,
  CheckCircle,
  TrendingUp,
  Quote,
  Grid3X3,
  List,
  Clock,
  MapPin,
  Zap,
  Star,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minus,
  ChevronDown,
  Headphones,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DynamicClientCase, ClientCaseFormData, ContentBlock, ContentBlockType, CONTENT_BLOCK_TEMPLATES, AVAILABLE_SECTORS, AVAILABLE_TAGS } from '@/lib/types/cas-client'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

// Icon options for dropdowns
const ICON_OPTIONS = [
  { value: 'trending-up', label: 'Trending Up', icon: TrendingUp },
  { value: 'bar-chart-3', label: 'Bar Chart', icon: BarChart3 },
  { value: 'check-circle', label: 'Check Circle', icon: CheckCircle },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'building', label: 'Building', icon: Building },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'quote', label: 'Quote', icon: Quote },
  { value: 'external-link', label: 'External Link', icon: ExternalLink },
  { value: 'grid-3x3', label: 'Grid', icon: Grid3X3 },
  { value: 'list', label: 'List', icon: List },
  { value: 'map-pin', label: 'Map Pin', icon: MapPin },
  { value: 'play', label: 'Play', icon: Play },
  { value: 'pause', label: 'Pause', icon: Pause },
  { value: 'volume-2', label: 'Volume', icon: Volume2 },
  { value: 'volume-x', label: 'Volume X', icon: VolumeX },
  { value: 'maximize-2', label: 'Maximize', icon: Maximize2 },
  { value: 'copy', label: 'Copy', icon: Copy },
  { value: 'edit', label: 'Edit', icon: Edit },
  { value: 'eye', label: 'Eye', icon: Eye },
  { value: 'save', label: 'Save', icon: Save },
  { value: 'trash-2', label: 'Trash', icon: Trash2 },
  { value: 'arrow-up', label: 'Arrow Up', icon: ArrowUp },
  { value: 'arrow-down', label: 'Arrow Down', icon: ArrowDown },
  { value: 'arrow-left', label: 'Arrow Left', icon: ArrowLeft },
  { value: 'arrow-right', label: 'Arrow Right', icon: ArrowRight },
  { value: 'plus', label: 'Plus', icon: Plus },
  { value: 'minus', label: 'Minus', icon: Minus },
  { value: 'x', label: 'X', icon: X },
  { value: 'chevron-down', label: 'Chevron Down', icon: ChevronDown },
  { value: 'headphones', label: 'Headphones', icon: Headphones }
]

interface CasClientEditorProps {
  initialData?: DynamicClientCase
  onSave: (data: ClientCaseFormData) => Promise<void>
  onCancel: () => void
  mode: 'create' | 'edit'
}

export default function CasClientEditor({ initialData, onSave, onCancel, mode }: CasClientEditorProps) {
  const [formData, setFormData] = useState<ClientCaseFormData>({
    slug: '',
    name: '',
    headline: '',
    summary: '',
    company: {
      logo: '',
      size: '',
      sector: '',
      customSector: '',
      location: '',
      website: ''
    },
    project: {
      solution: 'hubspot',
      customSolution: '',
      duration: '',
      teamSize: '',
      budget: '',
      status: 'completed'
    },
    media: {
      coverImage: '',
      heroVideo: '',
      heroVideoThumbnail: '',
      cardBackgroundImage: '',
      gallery: []
    },
    contentBlocks: [],
    seo: {
      title: '',
      description: '',
      keywords: [],
      ogImage: ''
    },
    testimonial: undefined,
    quickStats: [],
    tags: [],
    featured: false,
    published: false
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData({
        slug: initialData.slug,
        name: initialData.name,
        headline: initialData.headline,
        summary: initialData.summary,
        company: initialData.company,
        project: initialData.project,
        media: initialData.media,
        contentBlocks: initialData.contentBlocks.map(block => ({
          id: block.id,
          type: block.type,
          order: block.order,
          data: block
        })),
        seo: initialData.seo,
        testimonial: initialData.testimonial,
        quickStats: initialData.quickStats || [],
        tags: initialData.tags,
        featured: initialData.featured,
        published: initialData.published
      })
    }
  }, [initialData])

  // Update form data
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Update nested form data
  const updateNestedFormData = (parentKey: string, childKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey as keyof ClientCaseFormData] as any || {}),
        [childKey]: value
      }
    }))
  }

  // Add content block
  const addContentBlock = (type: ContentBlockType) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      order: formData.contentBlocks.length,
      data: { ...CONTENT_BLOCK_TEMPLATES[type], id: `block_${Date.now()}` }
    }
    
    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }))
  }

  // Update content block
  const updateContentBlock = (blockId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(block => 
        block.id === blockId ? { 
          ...block, 
          data: { ...block.data, ...data }
        } : block
      )
    }))
  }

  // Delete content block
  const deleteContentBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks
        .filter(block => block.id !== blockId)
        .map((block, index) => ({ ...block, order: index }))
    }))
  }

  // Move content block
  const moveContentBlock = (blockId: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      const blocks = [...prev.contentBlocks]
      const index = blocks.findIndex(block => block.id === blockId)
      
      if (direction === 'up' && index > 0) {
        [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]]
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]]
      }
      
      return {
        ...prev,
        contentBlocks: blocks.map((block, idx) => ({ ...block, order: idx }))
      }
    })
  }

  // Add quick stat
  const addQuickStat = () => {
    setFormData(prev => ({
      ...prev,
      quickStats: [...(prev.quickStats || []), {
        label: '',
        value: '',
        icon: 'trending-up',
        description: ''
      }]
    }))
  }

  // Update quick stat
  const updateQuickStat = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      quickStats: prev.quickStats?.map((stat, idx) => 
        idx === index ? { ...stat, [field]: value } : stat
      ) || []
    }))
  }

  // Delete quick stat
  const deleteQuickStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      quickStats: prev.quickStats?.filter((_, idx) => idx !== index) || []
    }))
  }

  // Add tag
  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  // Handle save
  const handleSave = async () => {
    // Client-side validation
    const requiredFields = [
      { field: 'slug', value: formData.slug, label: 'Slug' },
      { field: 'name', value: formData.name, label: 'Nom du client' },
      { field: 'headline', value: formData.headline, label: 'Titre principal' },
      { field: 'summary', value: formData.summary, label: 'Résumé' },
      { field: 'company.logo', value: formData.company.logo, label: 'Logo de l\'entreprise' },
      { field: 'company.sector', value: formData.company.sector, label: 'Secteur' },
      { field: 'company.size', value: formData.company.size, label: 'Taille de l\'entreprise' },
      { field: 'project.solution', value: formData.project.solution, label: 'Solution' },
      { field: 'project.duration', value: formData.project.duration, label: 'Durée du projet' },
      { field: 'project.teamSize', value: formData.project.teamSize, label: 'Taille de l\'équipe' },
      { field: 'media.coverImage', value: formData.media.coverImage, label: 'Image de couverture' }
    ]

    // Add custom sector validation when "Autre" is selected
    if (formData.company.sector === 'Autre' && !formData.company.customSector) {
      requiredFields.push({ 
        field: 'company.customSector', 
        value: formData.company.customSector || '', 
        label: 'Précisez le secteur' 
      })
    }

    const missingFields = requiredFields.filter(field => !field.value)
    
    if (missingFields.length > 0) {
      // Show both toast and alert for better visibility
      toast({
        title: "Champs requis manquants",
        description: `Veuillez remplir: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      })
      
      // Also show alert for immediate feedback
      alert(`❌ Champs requis manquants:\n\n${missingFields.map(f => `• ${f.label}`).join('\n')}\n\nVeuillez remplir ces champs avant de sauvegarder.`)
      
      return
    }

    // Flatten contentBlocks structure before sending
    const flattenedFormData = {
      ...formData,
      contentBlocks: formData.contentBlocks.map(block => ({
        id: block.id,
        type: block.type,
        order: block.order,
        ...block.data
      }))
    }
    
    setIsSaving(true)
    try {
      await onSave(flattenedFormData)
    } catch (error: any) {
      console.error('Error saving:', error)
      
      // Check if it's a duplicate slug error
      if (error?.error === 'Client with this slug already exists') {
        toast({
          title: "Client déjà existant",
          description: `Un client avec le slug "${flattenedFormData.slug}" existe déjà. Voulez-vous l'éditer à la place ?`,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Erreur",
          description: error?.error || "Erreur lors de l'enregistrement",
          variant: "destructive"
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Nouveau Cas Client' : 'Modifier le Cas Client'}
              </h1>
              <p className="text-gray-600">
                {mode === 'create' ? 'Créez un nouveau cas client' : 'Modifiez les informations du cas client'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Éditer' : 'Aperçu'}
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {previewMode ? (
          <PreviewMode formData={formData} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="company">Entreprise</TabsTrigger>
              <TabsTrigger value="project">Projet</TabsTrigger>
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="seo">SEO & Médias</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom de l'entreprise *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          updateFormData('name', e.target.value)
                          if (mode === 'create') {
                            updateFormData('slug', generateSlug(e.target.value))
                          }
                        }}
                        placeholder="Ex: TechCorp Solutions"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug (URL) *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => updateFormData('slug', e.target.value)}
                        placeholder="Ex: techcorp-solutions"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="headline">Titre principal *</Label>
                    <Input
                      id="headline"
                      value={formData.headline}
                      onChange={(e) => updateFormData('headline', e.target.value)}
                      placeholder="Ex: Migration Réussie vers Odoo 18"
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">Résumé *</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => updateFormData('summary', e.target.value)}
                      placeholder="Décrivez brièvement le projet..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => updateFormData('featured', checked)}
                      />
                      <Label htmlFor="featured">Mis en avant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => updateFormData('published', checked)}
                      />
                      <Label htmlFor="published">Publié</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Information Tab */}
            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'entreprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-logo">Logo de l'entreprise</Label>
                      <Input
                        id="company-logo"
                        value={formData.company.logo}
                        onChange={(e) => updateNestedFormData('company', 'logo', e.target.value)}
                        placeholder="URL du logo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-sector">Secteur d'activité *</Label>
                      <Select
                        value={formData.company.sector}
                        onValueChange={(value) => updateNestedFormData('company', 'sector', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_SECTORS.map(sector => (
                            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Custom sector input - appears when "Autre" is selected */}
                      {formData.company.sector === 'Autre' && (
                        <div className="mt-3">
                          <Label htmlFor="company-custom-sector">Précisez le secteur</Label>
                          <Input
                            id="company-custom-sector"
                            type="text"
                            value={formData.company.customSector || ''}
                            onChange={(e) => updateNestedFormData('company', 'customSector', e.target.value)}
                            placeholder="Ex: Immobilier de luxe, Fintech, EdTech..."
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-size">Taille de l'entreprise *</Label>
                      <Input
                        id="company-size"
                        value={formData.company.size}
                        onChange={(e) => updateNestedFormData('company', 'size', e.target.value)}
                        placeholder="Ex: 50-100 employés"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-location">Localisation</Label>
                      <Input
                        id="company-location"
                        value={formData.company.location || ''}
                        onChange={(e) => updateNestedFormData('company', 'location', e.target.value)}
                        placeholder="Ex: Casablanca, Maroc"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company-website">Site web</Label>
                    <Input
                      id="company-website"
                      value={formData.company.website || ''}
                      onChange={(e) => updateNestedFormData('company', 'website', e.target.value)}
                      placeholder="https://www.example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Information Tab */}
            <TabsContent value="project" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-solution">Solution implémentée *</Label>
                      <Select
                        value={formData.project.solution}
                        onValueChange={(value) => updateNestedFormData('project', 'solution', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une solution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hubspot">HubSpot CRM</SelectItem>
                          <SelectItem value="odoo">Odoo ERP</SelectItem>
                          <SelectItem value="both">HubSpot + Odoo</SelectItem>
                          <SelectItem value="custom">Solution Personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="project-duration">Durée du projet *</Label>
                      <Input
                        id="project-duration"
                        value={formData.project.duration}
                        onChange={(e) => updateNestedFormData('project', 'duration', e.target.value)}
                        placeholder="Ex: 6 mois"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-team-size">Taille de l'équipe</Label>
                      <Input
                        id="project-team-size"
                        value={formData.project.teamSize}
                        onChange={(e) => updateNestedFormData('project', 'teamSize', e.target.value)}
                        placeholder="Ex: 5 personnes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-budget">Budget</Label>
                      <Input
                        id="project-budget"
                        value={formData.project.budget || ''}
                        onChange={(e) => updateNestedFormData('project', 'budget', e.target.value)}
                        placeholder="Ex: 50 000€"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="project-status">Statut du projet</Label>
                    <Select
                      value={formData.project.status}
                      onValueChange={(value) => updateNestedFormData('project', 'status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="on-hold">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.project.solution === 'custom' && (
                    <div>
                      <Label htmlFor="project-custom-solution">Solution personnalisée</Label>
                      <Input
                        id="project-custom-solution"
                        value={formData.project.customSolution || ''}
                        onChange={(e) => updateNestedFormData('project', 'customSolution', e.target.value)}
                        placeholder="Décrivez la solution personnalisée"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenu dynamique</CardTitle>
                  <p className="text-sm text-gray-600">
                    Ajoutez des sections de contenu pour raconter l'histoire du projet
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Content Blocks */}
                  <div className="space-y-4">
                    {formData.contentBlocks
                      .sort((a, b) => a.order - b.order)
                      .map((block, index) => (
                        <ContentBlockEditor
                          key={block.id}
                          block={block.data || block}
                          onUpdate={(data) => updateContentBlock(block.id, data)}
                          onDelete={() => deleteContentBlock(block.id)}
                          onMoveUp={() => moveContentBlock(block.id, 'up')}
                          onMoveDown={() => moveContentBlock(block.id, 'down')}
                          canMoveUp={index > 0}
                          canMoveDown={index < formData.contentBlocks.length - 1}
                        />
                      ))}
                  </div>

                  {/* Add Content Block */}
                  <div className="mt-6">
                    <Label className="text-sm font-medium mb-3 block">Ajouter une section</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(CONTENT_BLOCK_TEMPLATES).map(([type, template]) => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          onClick={() => addContentBlock(type as ContentBlockType)}
                          className="h-auto p-3 flex flex-col items-center gap-2"
                        >
                          {getBlockIcon(type as ContentBlockType)}
                          <span className="text-xs">{getBlockLabel(type as ContentBlockType)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO & Media Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Médias et SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Médias</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cover-image">Image de couverture *</Label>
                        <Input
                          id="cover-image"
                          value={formData.media.coverImage}
                          onChange={(e) => updateNestedFormData('media', 'coverImage', e.target.value)}
                          placeholder="URL de l'image de couverture"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-video">Vidéo principale</Label>
                        <Input
                          id="hero-video"
                          value={formData.media.heroVideo || ''}
                          onChange={(e) => updateNestedFormData('media', 'heroVideo', e.target.value)}
                          placeholder="URL de la vidéo YouTube"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-background">Image de fond pour les cartes</Label>
                        <Input
                          id="card-background"
                          value={formData.media.cardBackgroundImage || ''}
                          onChange={(e) => updateNestedFormData('media', 'cardBackgroundImage', e.target.value)}
                          placeholder="URL de l'image de fond pour les cartes"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">SEO</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="seo-title">Titre SEO</Label>
                        <Input
                          id="seo-title"
                          value={formData.seo.title || ''}
                          onChange={(e) => updateNestedFormData('seo', 'title', e.target.value)}
                          placeholder="Titre pour les moteurs de recherche"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seo-description">Description SEO</Label>
                        <Textarea
                          id="seo-description"
                          value={formData.seo.description || ''}
                          onChange={(e) => updateNestedFormData('seo', 'description', e.target.value)}
                          placeholder="Description pour les moteurs de recherche"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mots-clés</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[var(--color-main)]/10 text-[var(--color-main)] rounded-full text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-[var(--color-main)] hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un mot-clé"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Ajouter un mot-clé"]') as HTMLInputElement
                          if (input?.value) {
                            addTag(input.value)
                            input.value = ''
                          }
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

// Helper functions
const getBlockIcon = (type: ContentBlockType) => {
  const icons = {
    'text-only': <Text className="w-4 h-4" />,
    'text-image-left': <ImageIcon className="w-4 h-4" />,
    'text-image-right': <ImageIcon className="w-4 h-4" />,
    'image-stats-left': <BarChart3 className="w-4 h-4" />,
    'image-stats-right': <BarChart3 className="w-4 h-4" />,
    'text-stats': <TrendingUp className="w-4 h-4" />,
    'cards-layout': <Grid3X3 className="w-4 h-4" />,
    'video': <Video className="w-4 h-4" />,
    'testimonial': <Quote className="w-4 h-4" />,
    'contact-form': <Mail className="w-4 h-4" />,
    'cta': <Target className="w-4 h-4" />
  }
  return icons[type] || <Text className="w-4 h-4" />
}

const getBlockLabel = (type: ContentBlockType) => {
  const labels = {
    'text-only': 'Texte seul',
    'text-image-left': 'Texte + Image (gauche)',
    'text-image-right': 'Texte + Image (droite)',
    'image-stats-left': 'Image + Stats (gauche)',
    'image-stats-right': 'Image + Stats (droite)',
    'text-stats': 'Texte + Statistiques',
    'cards-layout': 'Cartes de services',
    'video': 'Vidéo',
    'testimonial': 'Témoignage',
    'contact-form': 'Formulaire de contact',
    'cta': 'Call to Action'
  }
  return labels[type] || type
}

// Content Block Editor Component
const ContentBlockEditor: React.FC<{
  block: ContentBlock
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}> = ({ block, onUpdate, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) => {
  // Add null checks to prevent crashes
  if (!block) {
    return <div>Error: Block data is missing</div>
  }

  // Ensure block has required properties with defaults
  const safeBlock = {
    title: block.title || '',
    subtitle: (block as any).subtitle || '',
    content: block.content || '',
    sectionBadge: block.sectionBadge || '',
    sectionBadgeIcon: block.sectionBadgeIcon || '',
    imageUrl: block.imageUrl || '',
    imageAlt: block.imageAlt || '',
    sectionImageUrl: block.sectionImageUrl || '',
    sectionImageAlt: block.sectionImageAlt || '',
    stats: block.stats || [],
    cards: block.cards || [],
    testimonial: block.testimonial || null,
    cta: block.cta || null,
    videoUrl: block.videoUrl || '',
    videoThumbnail: block.videoThumbnail || '',
    ...block
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getBlockIcon(safeBlock.type)}
            <span className="font-medium">{getBlockLabel(safeBlock.type)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={safeBlock.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Titre de la section"
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={safeBlock.subtitle || ''}
                  onChange={(e) => onUpdate({ subtitle: e.target.value })}
                  placeholder="Sous-titre (optionnel)"
                />
              </div>
            </div>

            {/* Section Badge Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Badge de section</Label>
                <Input
                  value={safeBlock.sectionBadge || ''}
                  onChange={(e) => onUpdate({ sectionBadge: e.target.value })}
                  placeholder="Ex: Section Projet, Statistiques, etc."
                />
              </div>
              <div>
                <Label>Icône du badge</Label>
                <Select
                  value={safeBlock.sectionBadgeIcon || ''}
                  onValueChange={(value) => onUpdate({ sectionBadgeIcon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((iconOption) => {
                      const IconComponent = iconOption.icon
                      return (
                        <SelectItem key={iconOption.value} value={iconOption.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{iconOption.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

          {/* Type-specific fields */}
          {block.type === 'text-only' && (
            <div>
              <Label>Contenu</Label>
              <Textarea
                value={safeBlock.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Contenu HTML de la section"
                rows={6}
              />
            </div>
          )}

          {(block.type === 'text-image-left' || block.type === 'text-image-right') && (
            <>
              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={safeBlock.content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  placeholder="Contenu HTML de la section"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>URL de l'image</Label>
                  <Input
                    value={safeBlock.imageUrl}
                    onChange={(e) => onUpdate({ 
                      imageUrl: e.target.value
                    })}
                    placeholder="URL de l'image"
                  />
                </div>
                <div>
                  <Label>Texte alternatif</Label>
                  <Input
                    value={safeBlock.imageAlt}
                    onChange={(e) => onUpdate({ 
                      imageAlt: e.target.value
                    })}
                    placeholder="Description de l'image"
                  />
                </div>
              </div>
            </>
          )}

          {/* Stats blocks */}
          {(block.type === 'image-stats-left' || block.type === 'image-stats-right' || block.type === 'text-stats') && (
            <>
              {/* Image fields for image-stats blocks */}
              {(block.type === 'image-stats-left' || block.type === 'image-stats-right') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>URL de l'image</Label>
                    <Input
                      value={safeBlock.imageUrl}
                      onChange={(e) => onUpdate({ 
                        imageUrl: e.target.value
                      })}
                      placeholder="URL de l'image"
                    />
                  </div>
                  <div>
                    <Label>Texte alternatif</Label>
                    <Input
                      value={safeBlock.imageAlt}
                      onChange={(e) => onUpdate({ 
                        imageAlt: e.target.value
                      })}
                      placeholder="Description de l'image"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label>Statistiques</Label>
              <div className="space-y-2">
                {(safeBlock.stats || []).map((stat: any, index: number) => (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <Input
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newStats = [...(safeBlock.stats || [])]
                        newStats[index] = { ...stat, label: e.target.value }
                        onUpdate({ stats: newStats })
                      }}
                      placeholder="Label"
                    />
                    <Input
                      value={stat.value || ''}
                      onChange={(e) => {
                        const newStats = [...(safeBlock.stats || [])]
                        newStats[index] = { ...stat, value: e.target.value }
                        onUpdate({ stats: newStats })
                      }}
                      placeholder="Valeur"
                    />
                    <Select
                      value={stat.icon || ''}
                      onValueChange={(value) => {
                        const newStats = [...(safeBlock.stats || [])]
                        newStats[index] = { ...stat, icon: value }
                        onUpdate({ stats: newStats })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une icône" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((iconOption) => {
                          const IconComponent = iconOption.icon
                          return (
                            <SelectItem key={iconOption.value} value={iconOption.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <span>{iconOption.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newStats = (safeBlock.stats || []).filter((_: any, i: number) => i !== index)
                        onUpdate({ stats: newStats })
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newStats = [...(safeBlock.stats || []), { label: '', value: '', icon: '', description: '' }]
                    onUpdate({ stats: newStats })
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une statistique
                </Button>
              </div>
              </div>
            </>
          )}

          {/* Cards layout */}
          {block.type === 'cards-layout' && (
            <div>
              <Label>Cartes de services</Label>
              
              {/* Section Background Image */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium mb-2 block">Image de fond de la section</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={safeBlock.sectionImageUrl || ''}
                    onChange={(e) => onUpdate({ sectionImageUrl: e.target.value })}
                    placeholder="URL de l'image de fond de la section"
                  />
                  <Input
                    value={safeBlock.sectionImageAlt || ''}
                    onChange={(e) => onUpdate({ sectionImageAlt: e.target.value })}
                    placeholder="Texte alternatif de l'image de fond"
                  />
                </div>
                {safeBlock.sectionImageUrl && (
                  <div className="mt-3">
                    <img 
                      src={safeBlock.sectionImageUrl} 
                      alt={safeBlock.sectionImageAlt || 'Aperçu de l\'image de fond'}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {(safeBlock.cards || []).map((card: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={card.title || ''}
                        onChange={(e) => {
                          const newCards = [...(safeBlock.cards || [])]
                          newCards[index] = { ...card, title: e.target.value }
                          onUpdate({ cards: newCards })
                        }}
                        placeholder="Titre de la carte"
                      />
                      <Select
                        value={card.icon || ''}
                        onValueChange={(value) => {
                          const newCards = [...(safeBlock.cards || [])]
                          newCards[index] = { ...card, icon: value }
                          onUpdate({ cards: newCards })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une icône" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((iconOption) => {
                            const IconComponent = iconOption.icon
                            return (
                              <SelectItem key={iconOption.value} value={iconOption.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  <span>{iconOption.label}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      value={card.description || ''}
                      onChange={(e) => {
                        const newCards = [...(safeBlock.cards || [])]
                        newCards[index] = { ...card, description: e.target.value }
                        onUpdate({ cards: newCards })
                      }}
                      placeholder="Description de la carte"
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newCards = (safeBlock.cards || []).filter((_: any, i: number) => i !== index)
                        onUpdate({ cards: newCards })
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Supprimer cette carte
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCards = [...(safeBlock.cards || []), { title: '', description: '', icon: '', imageUrl: '', imageAlt: '' }]
                    onUpdate({ cards: newCards })
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une carte
                </Button>
              </div>
            </div>
          )}

          {/* Video block */}
          {block.type === 'video' && (
            <div className="space-y-4">
              <div>
                <Label>Type de contenu</Label>
                <Select
                  value={safeBlock.videoUrl ? 'video' : 'image'}
                  onValueChange={(value) => {
                    if (value === 'image') {
                      onUpdate({ videoUrl: '', videoThumbnail: '' })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {safeBlock.videoUrl ? (
                <>
                  <div>
                    <Label>URL de la vidéo</Label>
                    <Input
                      value={safeBlock.videoUrl}
                      onChange={(e) => onUpdate({ videoUrl: e.target.value })}
                      placeholder="URL YouTube, Vimeo, ou autre vidéo"
                    />
                  </div>
                  <div>
                    <Label>Miniature de la vidéo (optionnel)</Label>
                    <Input
                      value={safeBlock.videoThumbnail || ''}
                      onChange={(e) => onUpdate({ videoThumbnail: e.target.value })}
                      placeholder="URL de l'image de miniature"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>URL de l'image</Label>
                    <Input
                      value={safeBlock.imageUrl}
                      onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                      placeholder="URL de l'image"
                    />
                  </div>
                  <div>
                    <Label>Texte alternatif</Label>
                    <Input
                      value={safeBlock.imageAlt}
                      onChange={(e) => onUpdate({ imageAlt: e.target.value })}
                      placeholder="Description de l'image"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Testimonial block */}
          {block.type === 'testimonial' && (
            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Quote className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-semibold text-gray-900">Configuration du témoignage</Label>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Citation du témoignage</Label>
                    <Textarea
                      value={safeBlock.testimonial?.quote || ''}
                      onChange={(e) => onUpdate({ 
                        testimonial: { 
                          ...safeBlock.testimonial, 
                          quote: e.target.value 
                        } 
                      })}
                      placeholder="Entrez le témoignage complet..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Nom de l'auteur</Label>
                      <Input
                        value={safeBlock.testimonial?.author?.name || ''}
                        onChange={(e) => onUpdate({ 
                          testimonial: { 
                            ...safeBlock.testimonial, 
                            author: { 
                              ...safeBlock.testimonial?.author, 
                              name: e.target.value 
                            } 
                          } 
                        })}
                        placeholder="Ex: Sacha Samama"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Poste/Fonction</Label>
                      <Input
                        value={safeBlock.testimonial?.author?.role || ''}
                        onChange={(e) => onUpdate({ 
                          testimonial: { 
                            ...safeBlock.testimonial, 
                            author: { 
                              ...safeBlock.testimonial?.author, 
                              role: e.target.value 
                            } 
                          } 
                        })}
                        placeholder="Ex: Cofondateur & CTO"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Entreprise</Label>
                      <Input
                        value={safeBlock.testimonial?.author?.company || ''}
                        onChange={(e) => onUpdate({ 
                          testimonial: { 
                            ...safeBlock.testimonial, 
                            author: { 
                              ...safeBlock.testimonial?.author, 
                              company: e.target.value 
                            } 
                          } 
                        })}
                        placeholder="Ex: Allisone"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Note (1-5)</Label>
                      <Select
                        value={safeBlock.testimonial?.rating?.toString() || ''}
                        onValueChange={(value) => onUpdate({ 
                          testimonial: { 
                            ...safeBlock.testimonial, 
                            rating: parseInt(value) 
                          } 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une note" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 étoile</SelectItem>
                          <SelectItem value="2">2 étoiles</SelectItem>
                          <SelectItem value="3">3 étoiles</SelectItem>
                          <SelectItem value="4">4 étoiles</SelectItem>
                          <SelectItem value="5">5 étoiles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Photo de profil (URL)</Label>
                    <div className="space-y-3">
                      <Input
                        value={safeBlock.testimonial?.author?.avatar || ''}
                        onChange={(e) => onUpdate({ 
                          testimonial: { 
                            ...safeBlock.testimonial, 
                            author: { 
                              ...safeBlock.testimonial?.author, 
                              avatar: e.target.value 
                            } 
                          } 
                        })}
                        placeholder="URL de la photo de profil"
                      />
                      {safeBlock.testimonial?.author?.avatar && (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                            <img 
                              src={safeBlock.testimonial.author.avatar} 
                              alt="Photo de profil"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Aperçu de la photo de profil</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              {safeBlock.testimonial?.quote && (
                <div className="border rounded-lg p-6 bg-gray-900 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Aperçu du témoignage</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 bg-gray-700 flex items-center justify-center">
                        {safeBlock.testimonial?.author?.avatar ? (
                          <img 
                            src={safeBlock.testimonial.author.avatar} 
                            alt="Photo de profil"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-white">
                              {(safeBlock.testimonial?.author?.name || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="border-l-2 border-white/20 pl-4 mb-4">
                        <p className="text-gray-100 leading-relaxed text-lg">
                          "{safeBlock.testimonial.quote}"
                        </p>
                      </div>
                      <div className="text-sm text-gray-300">
                        <p className="font-semibold">{safeBlock.testimonial.author?.name || 'Nom'}</p>
                        <p>{safeBlock.testimonial.author?.role || 'Poste'} • {safeBlock.testimonial.author?.company || 'Entreprise'}</p>
                        {safeBlock.testimonial.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < (safeBlock.testimonial?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Form block */}
          {block.type === 'contact-form' && (
            <div className="space-y-4">
             
              
              {/* Preview */}
              <div className="border rounded-lg p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Aperçu du formulaire</span>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {safeBlock.title || 'Intéressé par notre travail?'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {safeBlock.content || 'Découvrez comment nous pouvons transformer votre entreprise...'}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      📝 Formulaire de contact avec champs: Nom, Email, Téléphone, Entreprise, Message
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Preview Mode Component
const PreviewMode: React.FC<{ formData: ClientCaseFormData }> = ({ formData }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Aperçu du cas client</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{formData.headline}</h3>
          <p className="text-gray-600">{formData.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Entreprise:</strong> {formData.name}
          </div>
          <div>
            <strong>Secteur:</strong> {formData.company.sector}
          </div>
          <div>
            <strong>Solution:</strong> {formData.project.solution}
          </div>
          <div>
            <strong>Durée:</strong> {formData.project.duration}
          </div>
        </div>
        <div>
          <strong>Tags:</strong> {formData.tags.join(', ')}
        </div>
      </div>
    </div>
  )
}
