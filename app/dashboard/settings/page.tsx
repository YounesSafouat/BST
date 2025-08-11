"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
  // Regional contact information
  regionalContact?: {
    france: {
      phone: string;
      email: string;
      address: string;
      whatsapp?: string;
    };
    morocco: {
      phone: string;
      email: string;
      address: string;
      whatsapp?: string;
    };
    other: {
      phone: string;
      email: string;
      address: string;
      whatsapp?: string;
    };
  };
  // Page visibility settings
  pageVisibility?: {
    home: boolean;
    blog: boolean;
    hubspot: boolean;
    about: boolean;
    casClient: boolean;
    contact: boolean;
  };
  // Snippets for tracking and analytics
  snippets?: {
    headSnippets?: string;
    bodyStartSnippets?: string;
    bodyEndSnippets?: string;
  };
  // Legacy fields for backward compatibility
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
    address: "",
    regionalContact: {
      france: { phone: "", email: "", address: "", whatsapp: "" },
      morocco: { phone: "", email: "", address: "", whatsapp: "" },
      other: { phone: "", email: "", address: "", whatsapp: "" }
    },
    pageVisibility: {
      home: true,
      blog: true,
      hubspot: true,
      about: true,
      casClient: true,
      contact: true
    },
    snippets: {
      headSnippets: "",
      bodyStartSnippets: "",
      bodyEndSnippets: ""
    }
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
            address: data.content.address || "",
            regionalContact: data.content.regionalContact || {
              france: { phone: "", email: "", address: "", whatsapp: "" },
              morocco: { phone: "", email: "", address: "", whatsapp: "" },
              other: { phone: "", email: "", address: "", whatsapp: "" }
            },
            pageVisibility: data.content.pageVisibility || {
              home: true,
              blog: true,
              hubspot: true,
              about: true,
              casClient: true,
              contact: true
            },
            snippets: data.content.snippets || {
              headSnippets: "",
              bodyStartSnippets: "",
              bodyEndSnippets: ""
            }
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

        // Try to refresh snippets immediately after saving
        if (typeof window !== 'undefined' && (window as any).refreshSnippets) {
          setTimeout(() => {
            (window as any).refreshSnippets()
            console.log("Snippets refreshed after save")
          }, 1000) // Wait 1 second for the save to propagate
        }

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
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
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

          {/* Regional Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact Régionales</CardTitle>
              <p className="text-sm text-gray-600">
                Configurez les informations de contact selon la région de vos visiteurs
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* France */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🇫🇷 France</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="france-phone">Téléphone</Label>
                    <Input
                      id="france-phone"
                      type="tel"
                      placeholder="+33 1 23 45 67 89"
                      value={settings.regionalContact?.france?.phone || ""}
                      onChange={(e) => updateField('regionalContact.france.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="france-email">Email</Label>
                    <Input
                      id="france-email"
                      type="email"
                      placeholder="contact@blackswantechnology.fr"
                      value={settings.regionalContact?.france?.email || ""}
                      onChange={(e) => updateField('regionalContact.france.email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="france-whatsapp">WhatsApp</Label>
                    <Input
                      id="france-whatsapp"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      value={settings.regionalContact?.france?.whatsapp || ""}
                      onChange={(e) => updateField('regionalContact.france.whatsapp', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="france-address">Adresse</Label>
                    <Input
                      id="france-address"
                      type="text"
                      placeholder="123 Rue de la Paix, 75001 Paris, France"
                      value={settings.regionalContact?.france?.address || ""}
                      onChange={(e) => updateField('regionalContact.france.address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Morocco */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🇲🇦 Maroc</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="morocco-phone">Téléphone</Label>
                    <Input
                      id="morocco-phone"
                      type="tel"
                      placeholder="+212 7 83 69 96 03"
                      value={settings.regionalContact?.morocco?.phone || ""}
                      onChange={(e) => updateField('regionalContact.morocco.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="morocco-email">Email</Label>
                    <Input
                      id="morocco-email"
                      type="email"
                      placeholder="contact@blackswantechnology.ma"
                      value={settings.regionalContact?.morocco?.email || ""}
                      onChange={(e) => updateField('regionalContact.morocco.email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="morocco-whatsapp">WhatsApp</Label>
                    <Input
                      id="morocco-whatsapp"
                      type="tel"
                      placeholder="+212 7 83 69 96 03"
                      value={settings.regionalContact?.morocco?.whatsapp || ""}
                      onChange={(e) => updateField('regionalContact.morocco.whatsapp', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="morocco-address">Adresse</Label>
                    <Input
                      id="morocco-address"
                      type="text"
                      placeholder="123 Boulevard Mohammed V, Casablanca, Maroc"
                      value={settings.regionalContact?.morocco?.address || ""}
                      onChange={(e) => updateField('regionalContact.morocco.address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Other Countries */}
              <div className="border-l-4 border-gray-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Autres Pays</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="other-phone">Téléphone</Label>
                    <Input
                      id="other-phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={settings.regionalContact?.other?.phone || ""}
                      onChange={(e) => updateField('regionalContact.other.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="other-email">Email</Label>
                    <Input
                      id="other-email"
                      type="email"
                      placeholder="contact@blackswantechnology.com"
                      value={settings.regionalContact?.other?.email || ""}
                      onChange={(e) => updateField('regionalContact.other.email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="other-whatsapp">WhatsApp</Label>
                    <Input
                      id="other-whatsapp"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={settings.regionalContact?.other?.whatsapp || ""}
                      onChange={(e) => updateField('regionalContact.other.whatsapp', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="other-address">Adresse</Label>
                    <Input
                      id="other-address"
                      type="text"
                      placeholder="123 Business Street, City, Country"
                      value={settings.regionalContact?.other?.address || ""}
                      onChange={(e) => updateField('regionalContact.other.address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Page Visibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Visibilité des Pages</CardTitle>
              <p className="text-sm text-gray-600">
                Activez ou désactivez l'accès aux différentes pages du site
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Home Page */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">🏠 Page d'accueil</h4>
                    <p className="text-sm text-gray-500">Page principale du site</p>
                  </div>
                  <Switch
                    checked={settings.pageVisibility?.home ?? true}
                    onCheckedChange={(checked) => updateField('pageVisibility.home', checked)}
                  />
                </div>

                {/* Blog Page */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">📝 Blog</h4>
                    <p className="text-sm text-gray-500">Articles et actualités</p>
                  </div>
                  <Switch
                    checked={settings.pageVisibility?.blog ?? true}
                    onCheckedChange={(checked) => updateField('pageVisibility.blog', checked)}
                  />
                </div>

                {/* HubSpot Page */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">🚀 HubSpot</h4>
                    <p className="text-sm text-gray-500">Page dédiée HubSpot</p>
                  </div>
                  <Switch
                    checked={settings.pageVisibility?.hubspot ?? true}
                    onCheckedChange={(checked) => updateField('pageVisibility.hubspot', checked)}
                  />
                </div>

                {/* About Page */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">ℹ️ À propos</h4>
                    <p className="text-sm text-gray-500">Informations sur l'entreprise</p>
                  </div>
                  <Switch
                    checked={settings.pageVisibility?.about ?? true}
                    onCheckedChange={(checked) => updateField('pageVisibility.about', checked)}
                  />
                </div>

                {/* Cas Client Page */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">💼 Cas clients</h4>
                    <p className="text-sm text-gray-500">Études de cas et témoignages</p>
                  </div>
                  <Switch
                    checked={settings.pageVisibility?.casClient ?? true}
                    onCheckedChange={(checked) => updateField('pageVisibility.casClient', checked)}
                  />
                </div>

                {/* Contact Page */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">📞 Contact</h4>
                    <p className="text-sm text-gray-500">Formulaire de contact</p>
                  </div>
                  <Switch
                    checked={settings.pageVisibility?.contact ?? true}
                    onCheckedChange={(checked) => updateField('pageVisibility.contact', checked)}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Les pages désactivées ne seront pas accessibles aux visiteurs.
                  La page d'accueil ne peut pas être désactivée car elle est essentielle au fonctionnement du site.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Snippets Settings */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Snippets de Suivi et Analytics</CardTitle>
              <p className="text-sm text-gray-600">
                Ajoutez des scripts de suivi comme Google Analytics, Facebook Pixel, etc.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Head Snippets */}
              <div className="space-y-2">
                <Label htmlFor="head-snippets">
                  <div className="flex items-center gap-2">
                    <span>📄 Scripts dans le &lt;head&gt;</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recommandé pour Google Analytics</span>
                  </div>
                </Label>
                <Textarea
                  id="head-snippets"
                  placeholder={`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}
                  value={settings.snippets?.headSnippets || ""}
                  onChange={(e) => updateField('snippets.headSnippets', e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Ces scripts seront injectés dans la balise &lt;head&gt; de toutes les pages
                </p>
              </div>

              {/* Body Start Snippets */}
              <div className="space-y-2">
                <Label htmlFor="body-start-snippets">
                  <div className="flex items-center gap-2">
                    <span>🚀 Scripts au début du &lt;body&gt;</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Pour les scripts prioritaires</span>
                  </div>
                </Label>
                <Textarea
                  id="body-start-snippets"
                  placeholder={`<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>`}
                  value={settings.snippets?.bodyStartSnippets || ""}
                  onChange={(e) => updateField('snippets.bodyStartSnippets', e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Ces scripts seront injectés au début de la balise &lt;body&gt;
                </p>
              </div>

              {/* Body End Snippets */}
              <div className="space-y-2">
                <Label htmlFor="body-end-snippets">
                  <div className="flex items-center gap-2">
                    <span>📈 Scripts à la fin du &lt;body&gt;</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Pour les scripts non-critiques</span>
                  </div>
                </Label>
                <Textarea
                  id="body-end-snippets"
                  placeholder={`<!-- Hotjar Tracking Code -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`}
                  value={settings.snippets?.bodyEndSnippets || ""}
                  onChange={(e) => updateField('snippets.bodyEndSnippets', e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Ces scripts seront injectés à la fin de la balise &lt;body&gt;
                </p>
              </div>

              {/* Snippet Preview Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">👁️ Aperçu des snippets actifs</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">📄 Head Snippets:</span>
                    <div className="mt-1 p-2 bg-white border rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {settings.snippets?.headSnippets ? (
                        <pre className="whitespace-pre-wrap">{settings.snippets.headSnippets}</pre>
                      ) : (
                        <span className="text-gray-400">Aucun snippet configuré</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">🚀 Body Start Snippets:</span>
                    <div className="mt-1 p-2 bg-white border rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {settings.snippets?.bodyStartSnippets ? (
                        <pre className="whitespace-pre-wrap">{settings.snippets.bodyStartSnippets}</pre>
                      ) : (
                        <span className="text-gray-400">Aucun snippet configuré</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">📈 Body End Snippets:</span>
                    <div className="mt-1 p-2 bg-white border rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {settings.snippets?.bodyEndSnippets ? (
                        <pre className="whitespace-pre-wrap">{settings.snippets.bodyEndSnippets}</pre>
                      ) : (
                        <span className="text-gray-400">Aucun snippet configuré</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).refreshSnippets) {
                  (window as any).refreshSnippets()
                  toast({
                    title: "Actualisation",
                    description: "Snippets actualisés sur la page",
                  })
                }
              }}
              variant="outline"
              className="border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white"
            >
              🔄 Actualiser les snippets
            </Button>
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