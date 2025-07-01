"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Save, 
  Plus, 
  Trash2, 
  X, 
  Menu, 
  ChevronDown,
  Star,
  TrendingUp,
  Mail,
  HeadphonesIcon,
  Target,
  Rocket,
  GraduationCap,
  Briefcase,
  Globe,
  Building,
  Users,
  FileText,
  Phone,
  MapPin
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface HeaderContent {
  logo: {
    image: string;
    alt: string;
  };
  navigation: {
    main: NavigationItem[];
    hubspot: HubSpotDropdown;
    odoo: OdooDropdown;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  cta: {
    text: string;
    url: string;
    isActive: boolean;
  };
}

interface NavigationItem {
  label: string;
  url: string;
  icon: string;
  isActive: boolean;
}

interface HubSpotDropdown {
  title: string;
  subtitle: string;
  badge: string;
  crmItems: DropdownItem[];
  serviceItems: DropdownItem[];
  isActive: boolean;
}

interface OdooDropdown {
  title: string;
  subtitle: string;
  badge: string;
  modules: DropdownItem[];
  services: DropdownItem[];
  isActive: boolean;
}

interface DropdownItem {
  icon: string;
  title: string;
  description: string;
  url?: string;
}

const iconOptions = [
  { value: "TrendingUp", label: "Trending Up", icon: TrendingUp },
  { value: "Mail", label: "Mail", icon: Mail },
  { value: "HeadphonesIcon", label: "Headphones", icon: HeadphonesIcon },
  { value: "Target", label: "Target", icon: Target },
  { value: "Rocket", label: "Rocket", icon: Rocket },
  { value: "GraduationCap", label: "Graduation Cap", icon: GraduationCap },
  { value: "Briefcase", label: "Briefcase", icon: Briefcase },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Building", label: "Building", icon: Building },
  { value: "Users", label: "Users", icon: Users },
  { value: "FileText", label: "File Text", icon: FileText },
  { value: "Phone", label: "Phone", icon: Phone },
  { value: "MapPin", label: "Map Pin", icon: MapPin },
]

export default function HeaderDashboard() {
  const [headerData, setHeaderData] = useState<HeaderContent>({
    logo: {
      image: "/bst.png",
      alt: "Black Swan Technology"
    },
    navigation: {
      main: [
        { label: "Accueil", url: "/", icon: "Home", isActive: true },
        { label: "À Propos", url: "/about", icon: "Users", isActive: true },
        { label: "Services", url: "/services", icon: "Briefcase", isActive: true },
        { label: "Cas Clients", url: "/cas-client", icon: "Building", isActive: true },
        { label: "Blog", url: "/blog", icon: "FileText", isActive: true },
        { label: "Contact", url: "/contact", icon: "Phone", isActive: true }
      ],
      hubspot: {
        title: "Solutions HubSpot",
        subtitle: "Plateforme CRM et Marketing Complète",
        badge: "★ Partenaire Platinum",
        crmItems: [
          { icon: "TrendingUp", title: "Sales Hub", description: "Automatisation des ventes" },
          { icon: "Mail", title: "Marketing Hub", description: "Email marketing avancé" },
          { icon: "HeadphonesIcon", title: "Service Hub", description: "Support client professionnel" }
        ],
        serviceItems: [
          { icon: "Target", title: "Audit HubSpot", description: "Évaluation complète" },
          { icon: "Rocket", title: "Implémentation", description: "Configuration sur mesure" },
          { icon: "GraduationCap", title: "Formation", description: "Équipes certifiées" }
        ],
        isActive: true
      },
      odoo: {
        title: "Solutions Odoo",
        subtitle: "ERP Complet et Modulaire",
        badge: "★ Partenaire Officiel",
        modules: [
          { icon: "Building", title: "CRM", description: "Gestion de la relation client" },
          { icon: "ShoppingCart", title: "Ventes", description: "Gestion des ventes" },
          { icon: "Database", title: "Inventaire", description: "Gestion des stocks" }
        ],
        services: [
          { icon: "Target", title: "Audit Odoo", description: "Évaluation complète" },
          { icon: "Rocket", title: "Implémentation", description: "Configuration sur mesure" },
          { icon: "GraduationCap", title: "Formation", description: "Équipes certifiées" }
        ],
        isActive: true
      }
    },
    contact: {
      phone: "+212 5 22 22 22 22",
      email: "contact@blackswantechnology.ma",
      address: "Casablanca, Maroc"
    },
    cta: {
      text: "Prendre RDV",
      url: "/contact",
      isActive: true
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHeaderData()
  }, [])

  const fetchHeaderData = async () => {
    try {
      const response = await fetch("/api/content?type=header")
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setHeaderData(data[0].content)
        }
      }
    } catch (error) {
      console.error("Error fetching header data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveHeaderData = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "header",
          title: "Header Navigation",
          description: "Header navigation and dropdown menus",
          content: headerData,
          isActive: true
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Configuration du header sauvegardée avec succès.",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la configuration.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (path: string, value: any) => {
    setHeaderData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      
      return newData
    })
  }

  const addNavigationItem = () => {
    setHeaderData(prev => {
      if (!prev) return prev
      
      return {
        ...prev,
        navigation: {
          ...prev.navigation,
          main: [...(prev.navigation?.main || []), {
            label: "Nouveau lien",
            url: "/",
            icon: "Home",
            isActive: true
          }]
        }
      }
    })
  }

  const removeNavigationItem = (index: number) => {
    setHeaderData(prev => {
      if (!prev) return prev
      
      return {
        ...prev,
        navigation: {
          ...prev.navigation,
          main: (prev.navigation?.main || []).filter((_, i) => i !== index)
        }
      }
    })
  }

  const addDropdownItem = (dropdownType: 'hubspot' | 'odoo', section: 'crmItems' | 'serviceItems' | 'modules' | 'services') => {
    setHeaderData(prev => {
      if (!prev) return prev
      
      const newData = { ...prev }
      if (dropdownType === 'hubspot') {
        if (section === 'crmItems' || section === 'serviceItems') {
          newData.navigation.hubspot[section] = [...newData.navigation.hubspot[section], {
            icon: "Home",
            title: "Nouvel élément",
            description: "Description"
          }]
        }
      } else if (dropdownType === 'odoo') {
        if (section === 'modules' || section === 'services') {
          newData.navigation.odoo[section] = [...newData.navigation.odoo[section], {
            icon: "Home",
            title: "Nouvel élément",
            description: "Description"
          }]
        }
      }
      
      return newData
    })
  }

  const removeDropdownItem = (dropdownType: 'hubspot' | 'odoo', section: 'crmItems' | 'serviceItems' | 'modules' | 'services', index: number) => {
    setHeaderData(prev => {
      if (!prev) return prev
      
      const newData = { ...prev }
      if (dropdownType === 'hubspot') {
        if (section === 'crmItems' || section === 'serviceItems') {
          newData.navigation.hubspot[section] = newData.navigation.hubspot[section].filter((_: any, i: number) => i !== index)
        }
      } else if (dropdownType === 'odoo') {
        if (section === 'modules' || section === 'services') {
          newData.navigation.odoo[section] = newData.navigation.odoo[section].filter((_: any, i: number) => i !== index)
        }
      }
      
      return newData
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuration du Header</h1>
          <p className="text-gray-600 mt-2">Gérez la navigation, les logos et les menus déroulants de votre site</p>
        </div>
        <Button onClick={saveHeaderData} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Logo de l'entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>URL de l'image</Label>
              <Input
                value={headerData?.logo?.image || ""}
                onChange={(e) => updateField('logo.image', e.target.value)}
                placeholder="/bst.png"
              />
            </div>
            <div>
              <Label>Texte alternatif</Label>
              <Input
                value={headerData?.logo?.alt || ""}
                onChange={(e) => updateField('logo.alt', e.target.value)}
                placeholder="Black Swan Technology"
              />
            </div>
          </div>
          {headerData?.logo?.image && (
            <div className="mt-4">
              <Label>Aperçu du logo</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                <img src={headerData.logo.image} alt={headerData.logo.alt} className="h-12 object-contain" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            Liens de navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {headerData?.navigation?.main?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Libellé</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...(headerData?.navigation?.main || [])]
                        newItems[index].label = e.target.value
                        updateField('navigation.main', newItems)
                      }}
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...(headerData?.navigation?.main || [])]
                        newItems[index].url = e.target.value
                        updateField('navigation.main', newItems)
                      }}
                    />
                  </div>
                  <div>
                    <Label>Icône</Label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) => {
                        const newItems = [...(headerData?.navigation?.main || [])]
                        newItems[index].icon = value
                        updateField('navigation.main', newItems)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={(checked) => {
                        const newItems = [...(headerData?.navigation?.main || [])]
                        newItems[index].isActive = checked
                        updateField('navigation.main', newItems)
                      }}
                    />
                    <Label>Actif</Label>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeNavigationItem(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addNavigationItem} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un lien
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* HubSpot Dropdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChevronDown className="w-5 h-5" />
            Menu déroulant HubSpot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={headerData?.navigation?.hubspot?.isActive || false}
              onCheckedChange={(checked) => updateField('navigation.hubspot.isActive', checked)}
            />
            <Label>Activer le menu HubSpot</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={headerData?.navigation?.hubspot?.title || ""}
                onChange={(e) => updateField('navigation.hubspot.title', e.target.value)}
              />
            </div>
            <div>
              <Label>Sous-titre</Label>
              <Input
                value={headerData?.navigation?.hubspot?.subtitle || ""}
                onChange={(e) => updateField('navigation.hubspot.subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Badge</Label>
              <Input
                value={headerData?.navigation?.hubspot?.badge || ""}
                onChange={(e) => updateField('navigation.hubspot.badge', e.target.value)}
              />
            </div>
          </div>

          {/* CRM Items */}
          <div>
            <h4 className="font-semibold mb-3">Éléments CRM</h4>
            <div className="space-y-3">
              {headerData?.navigation?.hubspot?.crmItems?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select
                      value={item.icon}
                      onValueChange={(value) => {
                        const newItems = [...(headerData?.navigation?.hubspot?.crmItems || [])]
                        newItems[index].icon = value
                        updateField('navigation.hubspot.crmItems', newItems)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...(headerData?.navigation?.hubspot?.crmItems || [])]
                        newItems[index].title = e.target.value
                        updateField('navigation.hubspot.crmItems', newItems)
                      }}
                      placeholder="Titre"
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...(headerData?.navigation?.hubspot?.crmItems || [])]
                        newItems[index].description = e.target.value
                        updateField('navigation.hubspot.crmItems', newItems)
                      }}
                      placeholder="Description"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDropdownItem('hubspot', 'crmItems', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                onClick={() => addDropdownItem('hubspot', 'crmItems')} 
                variant="outline" 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un élément CRM
              </Button>
            </div>
          </div>

          {/* Service Items */}
          <div>
            <h4 className="font-semibold mb-3">Éléments Services</h4>
            <div className="space-y-3">
              {headerData?.navigation?.hubspot?.serviceItems?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select
                      value={item.icon}
                      onValueChange={(value) => {
                        const newItems = [...(headerData?.navigation?.hubspot?.serviceItems || [])]
                        newItems[index].icon = value
                        updateField('navigation.hubspot.serviceItems', newItems)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...(headerData?.navigation?.hubspot?.serviceItems || [])]
                        newItems[index].title = e.target.value
                        updateField('navigation.hubspot.serviceItems', newItems)
                      }}
                      placeholder="Titre"
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...(headerData?.navigation?.hubspot?.serviceItems || [])]
                        newItems[index].description = e.target.value
                        updateField('navigation.hubspot.serviceItems', newItems)
                      }}
                      placeholder="Description"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDropdownItem('hubspot', 'serviceItems', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                onClick={() => addDropdownItem('hubspot', 'serviceItems')} 
                variant="outline" 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un élément Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Informations de contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Téléphone</Label>
              <Input
                value={headerData?.contact?.phone || ""}
                onChange={(e) => updateField('contact.phone', e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={headerData?.contact?.email || ""}
                onChange={(e) => updateField('contact.email', e.target.value)}
              />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input
                value={headerData?.contact?.address || ""}
                onChange={(e) => updateField('contact.address', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Bouton d'action principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={headerData?.cta?.isActive || false}
              onCheckedChange={(checked) => updateField('cta.isActive', checked)}
            />
            <Label>Activer le bouton CTA</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Texte du bouton</Label>
              <Input
                value={headerData?.cta?.text || ""}
                onChange={(e) => updateField('cta.text', e.target.value)}
              />
            </div>
            <div>
              <Label>URL de destination</Label>
              <Input
                value={headerData?.cta?.url || ""}
                onChange={(e) => updateField('cta.url', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 