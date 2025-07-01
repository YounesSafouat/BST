"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { 
  Save, 
  Plus, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Building,
  FileText,
  Users,
  Briefcase,
  Award,
  Shield
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FooterContent {
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  companyInfo: {
    logo: {
      image: string;
      alt: string;
    };
    description: string;
    contact: {
      address: {
        icon: string;
        text: string;
      };
      phone: {
        icon: string;
        text: string;
      };
      email: {
        icon: string;
        text: string;
      };
    };
  };
  quickLinks: {
    title: string;
    links: Array<{
      text: string;
      url: string;
    }>;
  };
  services: {
    title: string;
    links: Array<{
      text: string;
      url: string;
    }>;
  };
  social: {
    title: string;
    networks: Array<{
      name: string;
      icon: string;
      url: string;
      color: string;
    }>;
  };
  certifications: {
    title: string;
    badges: string[];
  };
  legal: {
    copyright: string;
    links: Array<{
      text: string;
      url: string;
    }>;
  };
}

const iconOptions = [
  { value: "Mail", label: "Mail", icon: Mail },
  { value: "Phone", label: "Phone", icon: Phone },
  { value: "MapPin", label: "Map Pin", icon: MapPin },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "Twitter", label: "Twitter", icon: Twitter },
  { value: "Linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Building", label: "Building", icon: Building },
  { value: "FileText", label: "File Text", icon: FileText },
  { value: "Users", label: "Users", icon: Users },
  { value: "Briefcase", label: "Briefcase", icon: Briefcase },
  { value: "Award", label: "Award", icon: Award },
  { value: "Shield", label: "Shield", icon: Shield }
]

const socialColorOptions = [
  { value: "bg-blue-600", label: "Facebook Blue" },
  { value: "bg-sky-500", label: "Twitter Blue" },
  { value: "bg-blue-700", label: "LinkedIn Blue" },
  { value: "bg-pink-600", label: "Instagram Pink" },
  { value: "bg-red-600", label: "Red" },
  { value: "bg-green-600", label: "Green" },
  { value: "bg-purple-600", label: "Purple" },
  { value: "bg-yellow-500", label: "Yellow" }
]

export default function FooterDashboard() {
  const [footerData, setFooterData] = useState<FooterContent>({
    newsletter: {
      title: "Restez à la pointe de l'innovation",
      description: "Recevez nos dernières actualités, études de cas et conseils d'experts directement dans votre boîte mail.",
      placeholder: "Votre email professionnel",
      buttonText: "S'inscrire"
    },
    companyInfo: {
      logo: {
        image: "/bst.png",
        alt: "Blackswantechnology"
      },
      description: "Nous transformons les entreprises marocaines grâce à des solutions digitales innovantes et sur mesure.",
      contact: {
        address: {
          icon: "MapPin",
          text: "Twin Center, Casablanca, Maroc"
        },
        phone: {
          icon: "Phone",
          text: "+212 6 XX XX XX XX"
        },
        email: {
          icon: "Mail",
          text: "contact@blackswantechnology.ma"
        }
      }
    },
    quickLinks: {
      title: "Liens Rapides",
      links: [
        { text: "Accueil", url: "/" },
        { text: "Services", url: "/services" },
        { text: "À Propos", url: "/about" },
        { text: "Témoignages", url: "/testimonials" },
        { text: "Blog", url: "/blog" },
        { text: "Carrières", url: "/careers" },
        { text: "Contact", url: "/contact" }
      ]
    },
    services: {
      title: "Nos Services",
      links: [
        { text: "HubSpot CRM", url: "/hubspot" },
        { text: "Odoo ERP", url: "/odoo" },
        { text: "Intégration API", url: "/api-integration" },
        { text: "Développement Web", url: "/web-development" },
        { text: "Marketing Digital", url: "/digital-marketing" },
        { text: "Formation & Support", url: "/training" },
        { text: "Audit Digital", url: "/audit" }
      ]
    },
    social: {
      title: "Suivez-nous",
      networks: [
        { name: "Facebook", icon: "Facebook", url: "#", color: "bg-blue-600" },
        { name: "Twitter", icon: "Twitter", url: "#", color: "bg-sky-500" },
        { name: "LinkedIn", icon: "Linkedin", url: "#", color: "bg-blue-700" },
        { name: "Instagram", icon: "Instagram", url: "#", color: "bg-pink-600" }
      ]
    },
    certifications: {
      title: "Certifications",
      badges: ["HubSpot Platinum", "Odoo Partner", "ISO 27001", "GDPR Compliant"]
    },
    legal: {
      copyright: "© 2025 Blackswantechnology. Tous droits réservés.",
      links: [
        { text: "Politique de confidentialité", url: "/privacy" },
        { text: "Conditions d'utilisation", url: "/terms" },
        { text: "Mentions légales", url: "/legal" }
      ]
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      const response = await fetch("/api/content?type=footer")
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setFooterData(data[0].content)
        }
      }
    } catch (error) {
      console.error("Error fetching footer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveFooterData = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "footer",
          title: "Footer",
          description: "Pied de page du site",
          content: footerData,
          isActive: true,
          metadata: { order: 99 }
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Contenu du footer mis à jour avec succès",
        })
      } else {
        throw new Error("Failed to save footer data")
      }
    } catch (error) {
      console.error("Error saving footer data:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du contenu",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (path: string, value: any) => {
    setFooterData(prev => {
      const newData = { ...prev } as any
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData as FooterContent
    })
  }

  const addLink = (section: 'quickLinks' | 'services' | 'legal') => {
    setFooterData(prev => {
      const newData = { ...prev } as any
      newData[section].links = [...newData[section].links, { text: "", url: "" }]
      return newData as FooterContent
    })
  }

  const removeLink = (section: 'quickLinks' | 'services' | 'legal', index: number) => {
    setFooterData(prev => {
      const newData = { ...prev } as any
      newData[section].links = newData[section].links.filter((_: any, i: number) => i !== index)
      return newData as FooterContent
    })
  }

  const addSocialNetwork = () => {
    setFooterData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        networks: [...prev.social.networks, { name: "", icon: "Facebook", url: "#", color: "bg-blue-600" }]
      }
    }))
  }

  const removeSocialNetwork = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        networks: prev.social.networks.filter((_, i) => i !== index)
      }
    }))
  }

  const addCertification = () => {
    setFooterData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        badges: [...prev.certifications.badges, ""]
      }
    }))
  }

  const removeCertification = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        badges: prev.certifications.badges.filter((_, i) => i !== index)
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ff5c35]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Footer</h1>
        <Button onClick={saveFooterData} disabled={saving} className="bg-[#ff5c35] hover:bg-[#ff5c35]/90">
          {saving ? "Sauvegarde..." : "Sauvegarder"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Newsletter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={footerData.newsletter.title}
                onChange={(e) => updateField('newsletter.title', e.target.value)}
                placeholder="Titre de la newsletter"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={footerData.newsletter.description}
                onChange={(e) => updateField('newsletter.description', e.target.value)}
                placeholder="Description de la newsletter"
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={footerData.newsletter.placeholder}
                onChange={(e) => updateField('newsletter.placeholder', e.target.value)}
                placeholder="Placeholder du champ email"
              />
            </div>
            <div>
              <Label>Texte du bouton</Label>
              <Input
                value={footerData.newsletter.buttonText}
                onChange={(e) => updateField('newsletter.buttonText', e.target.value)}
                placeholder="Texte du bouton d'inscription"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Logo (URL)</Label>
              <Input
                value={footerData.companyInfo.logo.image}
                onChange={(e) => updateField('companyInfo.logo.image', e.target.value)}
                placeholder="/bst.png"
              />
            </div>
            <div>
              <Label>Alt du logo</Label>
              <Input
                value={footerData.companyInfo.logo.alt}
                onChange={(e) => updateField('companyInfo.logo.alt', e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={footerData.companyInfo.description}
                onChange={(e) => updateField('companyInfo.description', e.target.value)}
                placeholder="Description de l'entreprise"
              />
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <Label>Informations de contact</Label>
              
              <div className="space-y-2">
                <Label className="text-sm">Adresse</Label>
                <div className="flex gap-2">
                  <Select
                    value={footerData.companyInfo.contact.address.icon}
                    onValueChange={(value) => updateField('companyInfo.contact.address.icon', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={footerData.companyInfo.contact.address.text}
                    onChange={(e) => updateField('companyInfo.contact.address.text', e.target.value)}
                    placeholder="Adresse"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Téléphone</Label>
                <div className="flex gap-2">
                  <Select
                    value={footerData.companyInfo.contact.phone.icon}
                    onValueChange={(value) => updateField('companyInfo.contact.phone.icon', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={footerData.companyInfo.contact.phone.text}
                    onChange={(e) => updateField('companyInfo.contact.phone.text', e.target.value)}
                    placeholder="Téléphone"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <div className="flex gap-2">
                  <Select
                    value={footerData.companyInfo.contact.email.icon}
                    onValueChange={(value) => updateField('companyInfo.contact.email.icon', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={footerData.companyInfo.contact.email.text}
                    onChange={(e) => updateField('companyInfo.contact.email.text', e.target.value)}
                    placeholder="Email"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Liens Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={footerData.quickLinks.title}
                onChange={(e) => updateField('quickLinks.title', e.target.value)}
                placeholder="Titre de la section"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Liens</Label>
                <Button onClick={() => addLink('quickLinks')} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {footerData.quickLinks.links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...footerData.quickLinks.links]
                      newLinks[index].text = e.target.value
                      updateField('quickLinks.links', newLinks)
                    }}
                    placeholder="Texte du lien"
                    className="flex-1"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...footerData.quickLinks.links]
                      newLinks[index].url = e.target.value
                      updateField('quickLinks.links', newLinks)
                    }}
                    placeholder="URL"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeLink('quickLinks', index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={footerData.services.title}
                onChange={(e) => updateField('services.title', e.target.value)}
                placeholder="Titre de la section"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Services</Label>
                <Button onClick={() => addLink('services')} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {footerData.services.links.map((service, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={service.text}
                    onChange={(e) => {
                      const newServices = [...footerData.services.links]
                      newServices[index].text = e.target.value
                      updateField('services.links', newServices)
                    }}
                    placeholder="Nom du service"
                    className="flex-1"
                  />
                  <Input
                    value={service.url}
                    onChange={(e) => {
                      const newServices = [...footerData.services.links]
                      newServices[index].url = e.target.value
                      updateField('services.links', newServices)
                    }}
                    placeholder="URL"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeLink('services', index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Networks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Réseaux Sociaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={footerData.social.title}
                onChange={(e) => updateField('social.title', e.target.value)}
                placeholder="Titre de la section"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Réseaux</Label>
                <Button onClick={addSocialNetwork} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {footerData.social.networks.map((network, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={network.name}
                      onChange={(e) => {
                        const newNetworks = [...footerData.social.networks]
                        newNetworks[index].name = e.target.value
                        updateField('social.networks', newNetworks)
                      }}
                      placeholder="Nom du réseau"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeSocialNetwork(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select
                      value={network.icon}
                      onValueChange={(value) => {
                        const newNetworks = [...footerData.social.networks]
                        newNetworks[index].icon = value
                        updateField('social.networks', newNetworks)
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={network.color}
                      onValueChange={(value) => {
                        const newNetworks = [...footerData.social.networks]
                        newNetworks[index].color = value
                        updateField('social.networks', newNetworks)
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {socialColorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Input
                    value={network.url}
                    onChange={(e) => {
                      const newNetworks = [...footerData.social.networks]
                      newNetworks[index].url = e.target.value
                      updateField('social.networks', newNetworks)
                    }}
                    placeholder="URL du réseau social"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={footerData.certifications.title}
                onChange={(e) => updateField('certifications.title', e.target.value)}
                placeholder="Titre de la section"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Certifications</Label>
                <Button onClick={addCertification} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {footerData.certifications.badges.map((badge, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={badge}
                    onChange={(e) => {
                      const newBadges = [...footerData.certifications.badges]
                      newBadges[index] = e.target.value
                      updateField('certifications.badges', newBadges)
                    }}
                    placeholder="Nom de la certification"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeCertification(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legal Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Mentions Légales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Copyright</Label>
              <Input
                value={footerData.legal.copyright}
                onChange={(e) => updateField('legal.copyright', e.target.value)}
                placeholder="© 2025 Blackswantechnology. Tous droits réservés."
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Liens légaux</Label>
                <Button onClick={() => addLink('legal')} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {footerData.legal.links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...footerData.legal.links]
                      newLinks[index].text = e.target.value
                      updateField('legal.links', newLinks)
                    }}
                    placeholder="Texte du lien"
                    className="flex-1"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...footerData.legal.links]
                      newLinks[index].url = e.target.value
                      updateField('legal.links', newLinks)
                    }}
                    placeholder="URL"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeLink('legal', index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 