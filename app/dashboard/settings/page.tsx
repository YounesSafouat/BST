"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Loader from '@/components/home/Loader';

interface SiteSettings {
  favicon?: {
    image: string;
    alt: string;
  };
  siteTitle?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export default function SettingsDashboard() {
  const [settings, setSettings] = useState<SiteSettings>({
    favicon: {
      image: "",
      alt: "Site Favicon"
    },
    siteTitle: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/content/settings")
      if (response.ok) {
        const data = await response.json()
        console.log("Settings API response:", data)

        if (data && data.content) {
          // Merge with default values to ensure all fields exist
          setSettings({
            favicon: {
              image: data.content.favicon?.image || "",
              alt: data.content.favicon?.alt || "Site Favicon"
            },
            siteTitle: data.content.siteTitle || "",
            siteDescription: data.content.siteDescription || "",
            contactEmail: data.content.contactEmail || "",
            contactPhone: data.content.contactPhone || "",
            address: data.content.address || ""
          })
        }
      } else {
        console.error("Settings API response not ok:", response.status)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/content/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: settings,
          title: "Site Settings",
          description: "Paramètres globaux du site",
          isActive: true,
          metadata: { order: 1 }
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Save response:", result)
        toast({
          title: "Succès",
          description: "Paramètres mis à jour avec succès",
        })
      } else {
        const errorText = await response.text()
        console.error("Save failed:", response.status, errorText)
        throw new Error(`Failed to save settings: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des paramètres",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev } as any
      const keys = path.split('.')
      let current = newSettings

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newSettings as SiteSettings
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres du Site</h1>
          <p className="text-gray-600">Gérez les paramètres globaux de votre site web</p>
        </div>

        <div className="space-y-6">
          {/* Favicon Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Favicon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="favicon-image">URL de l'image du favicon</Label>
                  <Input
                    id="favicon-image"
                    type="text"
                    placeholder="/favicon.ico"
                    value={settings.favicon?.image || ""}
                    onChange={(e) => updateField('favicon.image', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ex: /favicon.ico, /favicon.png, ou URL complète
                  </p>
                </div>
                <div>
                  <Label htmlFor="favicon-alt">Texte alternatif</Label>
                  <Input
                    id="favicon-alt"
                    type="text"
                    placeholder="Site Favicon"
                    value={settings.favicon?.alt || ""}
                    onChange={(e) => updateField('favicon.alt', e.target.value)}
                  />
                </div>
              </div>
              {settings.favicon?.image && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={settings.favicon.image} 
                    alt={settings.favicon.alt || "Favicon preview"} 
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <span className="text-sm text-gray-600">Aperçu du favicon</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-title">Titre du site</Label>
                <Input
                  id="site-title"
                  type="text"
                  placeholder="Black Swan Technology"
                  value={settings.siteTitle || ""}
                  onChange={(e) => updateField('siteTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="site-description">Description du site</Label>
                <Input
                  id="site-description"
                  type="text"
                  placeholder="Partenaire Officiel Odoo au Maroc"
                  value={settings.siteDescription || ""}
                  onChange={(e) => updateField('siteDescription', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Email de contact</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@blackswantechnology.fr"
                    value={settings.contactEmail || ""}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+212 7 83 69 96 03"
                    value={settings.contactPhone || ""}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="202 Boulevard Brahim Roudani, Casablanca, Maroc 20000"
                  value={settings.address || ""}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 