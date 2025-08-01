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
  Shield,
  Youtube
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Loader from '@/components/home/Loader';
import { availableIcons } from '@/lib/iconList';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

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
  social: Record<string, { icon: string; color: string; url: string } | undefined>;
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
  _newSocialIcon?: string;
  _newSocialColor?: string;
  _newSocialUrl?: string;
  socialTitle?: string;
}

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

const IconMap = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  WhatsApp: WhatsAppIcon
};
const colorMap: any = {
  facebook: '#1877f2',
  twitter: '#1da1f2',
  linkedin: '#0077b5',
  instagram: '#e1306c',
  youtube: '#ff0000',
  whatsapp: '#25d366'
};

export default function FooterDashboard() {
  const [footerData, setFooterData] = useState<FooterContent>({
    newsletter: {
      title: "",
      description: "",
      placeholder: "",
      buttonText: ""
    },
    companyInfo: {
      logo: {
        image: "",
        alt: ""
      },
      description: "",
      contact: {
        address: {
          icon: "MapPin",
          text: ""
        },
        phone: {
          icon: "Phone",
          text: ""
        },
        email: {
          icon: "Mail",
          text: ""
        }
      }
    },
    quickLinks: {
      title: "",
      links: []
    },
    services: {
      title: "",
      links: []
    },
    social: {},
    certifications: {
      title: "",
      badges: []
    },
    legal: {
      copyright: "",
      links: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFooterData()
  }, [])

  // Debug: Log footerData changes
  useEffect(() => {
    console.log("Footer data updated:", footerData)
  }, [footerData])

  const fetchFooterData = async () => {
    try {
      const response = await fetch("/api/content/footer")
      if (response.ok) {
        const data = await response.json()
        console.log("Footer API response:", data)

        if (data && data.content) {
          // Directly set the footer data from API response
          const apiData = data.content
          console.log("Setting footer data:", apiData)
          console.log("API data keys:", Object.keys(apiData))
          console.log("API newsletter:", apiData.newsletter)
          console.log("API companyInfo:", apiData.companyInfo)

          setFooterData(prev => {
            const newData = {
              ...prev,
              ...apiData
            }
            console.log("New footer data after merge:", newData)
            return newData
          })
        } else {
          console.log("No footer document found or no content")
        }
      } else {
        console.error("Footer API response not ok:", response.status)
      }

      // Fetch contact info from centralized object
      const contactResponse = await fetch("/api/content?type=contact-info")
      if (contactResponse.ok) {
        const contactData = await contactResponse.json()
        console.log("Contact API response:", contactData)
        console.log("Contact API response length:", contactData.length)

        if (contactData && contactData.length > 0) {
          // Find the actual contact-info document
          const contactDocument = contactData.find(item => item.type === 'contact-info')
          console.log("Contact document found:", contactDocument)

          if (contactDocument && contactDocument.content) {
            const contactInfo = contactDocument.content
            const socialInfo = contactInfo.social || {}
            console.log("Contact info:", contactInfo)
            console.log("Social info:", socialInfo)

            setFooterData(prev => {
              const newData = {
                ...prev,
                companyInfo: {
                  ...prev.companyInfo,
                  contact: {
                    address: {
                      icon: "MapPin",
                      text: contactInfo.address || ""
                    },
                    phone: {
                      icon: "Phone",
                      text: contactInfo.phone || ""
                    },
                    email: {
                      icon: "Mail",
                      text: contactInfo.email || ""
                    }
                  }
                },
                social: {
                  ...prev.social,
                  facebook: { icon: "Facebook", color: "#1877f2", url: socialInfo.facebook || "" },
                  twitter: { icon: "Twitter", color: "#1da1f2", url: socialInfo.twitter || "" },
                  linkedin: { icon: "Linkedin", color: "#0077b5", url: socialInfo.linkedin || "" },
                  instagram: { icon: "Instagram", color: "#e1306c", url: socialInfo.instagram || "" },
                  youtube: { icon: "Youtube", color: "#ff0000", url: socialInfo.youtube || "" },
                  whatsapp: { icon: "WhatsApp", color: "#25d366", url: socialInfo.whatsapp || "" }
                }
              }
              console.log("New footer data after contact merge:", newData)
              return newData
            })
          } else {
            console.log("No contact document found or no content")
          }
        }
      } else {
        console.error("Contact API response not ok:", contactResponse.status)
      }
    } catch (error) {
      console.error("Error fetching footer data:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du footer",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveFooterData = async () => {
    setSaving(true)
    try {
      // Clean the data before sending (remove temporary fields)
      const cleanFooterData = {
        newsletter: footerData.newsletter,
        companyInfo: footerData.companyInfo,
        quickLinks: footerData.quickLinks,
        services: footerData.services,
        social: footerData.social,
        certifications: footerData.certifications,
        legal: footerData.legal
      }

      console.log("Saving footer data:", cleanFooterData)

      const response = await fetch("/api/content/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: cleanFooterData,
          title: "Footer",
          description: "Pied de page du site",
          isActive: true,
          metadata: { order: 99 }
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Save response:", result)
        toast({
          title: "Succès",
          description: "Contenu du footer mis à jour avec succès",
        })
      } else {
        const errorText = await response.text()
        console.error("Save failed:", response.status, errorText)
        throw new Error(`Failed to save footer data: ${response.status} ${errorText}`)
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
      newData[section].links = [...(newData[section]?.links || []), { text: "", url: "" }]
      return newData as FooterContent
    })
  }

  const removeLink = (section: 'quickLinks' | 'services' | 'legal', index: number) => {
    setFooterData(prev => {
      const newData = { ...prev } as any
      newData[section].links = (newData[section]?.links || []).filter((_: any, i: number) => i !== index)
      return newData as FooterContent
    })
  }

  const addCertification = () => {
    setFooterData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        badges: [...(prev.certifications?.badges || []), ""]
      }
    }))
  }

  const removeCertification = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        badges: (prev.certifications?.badges || []).filter((_, i) => i !== index)
      }
    }))
  }

  if (loading) {
    return <Loader />;
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
                value={footerData.newsletter?.title || ''}
                onChange={(e) => updateField('newsletter.title', e.target.value)}
                placeholder="Titre de la newsletter"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={footerData.newsletter?.description || ''}
                onChange={(e) => updateField('newsletter.description', e.target.value)}
                placeholder="Description de la newsletter"
              />
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                value={footerData.newsletter?.placeholder || ''}
                onChange={(e) => updateField('newsletter.placeholder', e.target.value)}
                placeholder="Placeholder du champ email"
              />
            </div>
            <div>
              <Label>Texte du bouton</Label>
              <Input
                value={footerData.newsletter?.buttonText || ''}
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
                value={footerData.companyInfo?.logo?.image || ''}
                onChange={(e) => updateField('companyInfo.logo.image', e.target.value)}
                placeholder="/bst.png"
              />
            </div>
            <div>
              <Label>Alt du logo</Label>
              <Input
                value={footerData.companyInfo?.logo?.alt || ''}
                onChange={(e) => updateField('companyInfo.logo.alt', e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={footerData.companyInfo?.description || ''}
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
                    value={footerData.companyInfo?.contact?.address?.icon || ''}
                    onValueChange={(value) => updateField('companyInfo.contact.address.icon', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon: any) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center space-x-2">
                            <icon.icon className="w-4 h-4" />
                            <span>{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={footerData.companyInfo?.contact?.address?.text || ''}
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
                    value={footerData.companyInfo?.contact?.phone?.icon || ''}
                    onValueChange={(value) => updateField('companyInfo.contact.phone.icon', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon: any) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center space-x-2">
                            <icon.icon className="w-4 h-4" />
                            <span>{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={footerData.companyInfo?.contact?.phone?.text || ''}
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
                    value={footerData.companyInfo?.contact?.email?.icon || ''}
                    onValueChange={(value) => updateField('companyInfo.contact.email.icon', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon: any) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center space-x-2">
                            <icon.icon className="w-4 h-4" />
                            <span>{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={footerData.companyInfo?.contact?.email?.text || ''}
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
                value={footerData.quickLinks?.title || ''}
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

              {footerData.quickLinks?.links?.map((link, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...(footerData.quickLinks?.links || [])]
                      newLinks[index].text = e.target.value
                      updateField('quickLinks.links', newLinks)
                    }}
                    placeholder="Texte du lien"
                    className="flex-1"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...(footerData.quickLinks?.links || [])]
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
                value={footerData.services?.title || ''}
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

              {footerData.services?.links?.map((service, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={service.text}
                    onChange={(e) => {
                      const newServices = [...(footerData.services?.links || [])]
                      newServices[index].text = e.target.value
                      updateField('services.links', newServices)
                    }}
                    placeholder="Nom du service"
                    className="flex-1"
                  />
                  <Input
                    value={service.url}
                    onChange={(e) => {
                      const newServices = [...(footerData.services?.links || [])]
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
                value={footerData.socialTitle || ''}
                placeholder="Titre de la section"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Réseaux</Label>
                <Button
                  onClick={() => {
                    const newSocial = { ...footerData.social };
                    newSocial.whatsapp = {
                      icon: "WhatsApp",
                      color: "#25d366",
                      url: ""
                    };
                    updateField('social', newSocial);
                  }}
                  size="sm"
                  variant="outline"
                  disabled={!!footerData.social?.whatsapp}
                >
                  <WhatsAppIcon className="h-4 w-4 mr-1" />
                  Ajouter WhatsApp
                </Button>
              </div>
              {/* Display each social network as a row with icon, color, name, and URL */}
              {Object.entries(footerData.social || {})
                .filter(([key, value]) => key !== 'title' && value && typeof value === 'object' && 'icon' in value && 'color' in value && 'url' in value)
                .map(([key, value], index) => {
                  const network = value as { icon: string; color: string; url: string };
                  const Icon = IconMap[network.icon as keyof typeof IconMap];
                  return (
                    <div key={key} className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: network.color || '#333' }}>
                        {Icon && <Icon className="w-4 h-4 text-white" />}
                      </div>
                      <Input
                        value={network.icon}
                        disabled
                        className="w-32 bg-gray-100 text-gray-500"
                      />
                      <Input
                        value={network.url}
                        onChange={e => {
                          const newSocial = { ...footerData.social };
                          newSocial[key] = { ...network, url: e.target.value };
                          updateField('social', newSocial);
                        }}
                        placeholder={`URL de ${key}`}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const newSocial = { ...footerData.social };
                          delete newSocial[key];
                          updateField('social', newSocial);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              {/* Add new social network */}
              <div className="flex gap-2 items-center mt-2">
                <Select
                  value={footerData._newSocialIcon || ''}
                  onValueChange={value => updateField('_newSocialIcon', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Icone" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(IconMap).map(([key, Icon]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Couleur (#hex)"
                  value={footerData._newSocialColor || ''}
                  onChange={e => updateField('_newSocialColor', e.target.value)}
                  className="w-32"
                />
                <Input
                  placeholder="URL du réseau"
                  value={footerData._newSocialUrl || ''}
                  onChange={e => updateField('_newSocialUrl', e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    if (footerData._newSocialIcon && footerData._newSocialColor && footerData._newSocialUrl) {
                      const newSocial = { ...footerData.social };
                      newSocial[footerData._newSocialIcon.toLowerCase()] = {
                        icon: footerData._newSocialIcon,
                        color: footerData._newSocialColor,
                        url: footerData._newSocialUrl
                      };
                      updateField('social', newSocial);
                      updateField('_newSocialIcon', '');
                      updateField('_newSocialColor', '');
                      updateField('_newSocialUrl', '');
                    }
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
                value={footerData.certifications?.title || ''}
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

              {footerData.certifications?.badges?.map((badge, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={badge}
                    onChange={(e) => {
                      const newBadges = [...(footerData.certifications?.badges || [])]
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

              {footerData.legal?.links?.map((link, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...(footerData.legal?.links || [])]
                      newLinks[index].text = e.target.value
                      updateField('legal.links', newLinks)
                    }}
                    placeholder="Texte du lien"
                    className="flex-1"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...(footerData.legal?.links || [])]
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