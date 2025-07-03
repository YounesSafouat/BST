"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import Loader from '@/components/home/Loader';
import { availableIcons } from '@/lib/iconList';

interface HeaderData {
  logo: {
    image: string;
    alt: string;
    size: string;
  };
  navigation: {
    main: Array<{
  label: string;
  url: string;
  icon: string;
  isActive: boolean;
    }>;
    hubspot: {
  title: string;
  subtitle: string;
  badge: string;
  isActive: boolean;
      sections: {
        crm: {
          title: string;
          icon: string;
          items: Array<{
            icon: string;
            title: string;
            description: string;
            url: string;
          }>;
        };
        services: {
          title: string;
          icon: string;
          items: Array<{
            icon: string;
            title: string;
            description: string;
            url: string;
          }>;
        };
      };
    };
    odoo: {
  title: string;
  subtitle: string;
  badge: string;
  isActive: boolean;
      sections: {
        modules: {
          title: string;
          icon: string;
          items: Array<{
  icon: string;
  title: string;
  description: string;
            url: string;
          }>;
        };
        services: {
          title: string;
          icon: string;
          items: Array<{
            icon: string;
            title: string;
            description: string;
            url: string;
          }>;
        };
      };
    };
    about: {
      title: string;
      subtitle: string;
      isActive: boolean;
      stats: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
    };
    casClient: {
      title: string;
      subtitle: string;
      isActive: boolean;
      buttonText: string;
      selectedClients: Array<{
        clientId: string;
        name: string;
        logo: string;
        headline: string;
        summary: string;
        projectStats: Array<{
          value: string;
        }>;
      }>;
    };
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

export default function HeaderDashboard() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetchHeaderData();
    fetchClients();
  }, []);

  const fetchHeaderData = async () => {
    try {
      const response = await fetch("/api/content?type=header");
      const data = await response.json();
        if (data.length > 0) {
        setHeaderData(data[0].content);
      }
    } catch (error) {
      console.error("Error fetching header data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du header",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/content?type=clients-page");
      const data = await response.json();
      const page = Array.isArray(data) ? data[0] : data;
      const clientCases = page?.content?.clientCases || [];
      setClients(clientCases);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const saveHeaderData = async () => {
    if (!headerData) return;
    
    setSaving(true);
    try {
      const response = await fetch("/api/content?type=header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: headerData,
          title: "Header Navigation",
          description: "Header navigation and dropdown menus",
          isActive: true
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Header mis à jour avec succès",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving header data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    if (!headerData) return;
    
    const keys = path.split(".");
    const newData = { ...headerData };
    let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setHeaderData(newData);
  };

  

    const addDropdownItem = (dropdown: string, section: string) => {
    if (!headerData) return;
    
    const newItem = {
            icon: "Home",
      title: "Nouveau service",
      description: "Description du service",
      url: "/"
    };
    
    const newData = { ...headerData };
    if (dropdown === 'hubspot' && section === 'crm') {
      newData.navigation.hubspot.sections.crm.items.push(newItem);
    } else if (dropdown === 'hubspot' && section === 'services') {
      newData.navigation.hubspot.sections.services.items.push(newItem);
    } else if (dropdown === 'odoo' && section === 'modules') {
      newData.navigation.odoo.sections.modules.items.push(newItem);
    } else if (dropdown === 'odoo' && section === 'services') {
      newData.navigation.odoo.sections.services.items.push(newItem);
    }
    setHeaderData(newData);
  };

  const removeDropdownItem = (dropdown: string, section: string, index: number) => {
    if (!headerData) return;
    
    const newData = { ...headerData };
    if (dropdown === 'hubspot' && section === 'crm') {
      newData.navigation.hubspot.sections.crm.items.splice(index, 1);
    } else if (dropdown === 'hubspot' && section === 'services') {
      newData.navigation.hubspot.sections.services.items.splice(index, 1);
    } else if (dropdown === 'odoo' && section === 'modules') {
      newData.navigation.odoo.sections.modules.items.splice(index, 1);
    } else if (dropdown === 'odoo' && section === 'services') {
      newData.navigation.odoo.sections.services.items.splice(index, 1);
    }
    setHeaderData(newData);
  };

  const addStat = () => {
    if (!headerData) return;
    
    const newStat = {
      icon: "Star",
      title: "Nouvelle statistique",
            description: "Description"
    };
    
    const newData = { ...headerData };
    newData.navigation.about.stats.push(newStat);
    setHeaderData(newData);
  };

  const removeStat = (index: number) => {
    if (!headerData) return;
    
    const newData = { ...headerData };
    newData.navigation.about.stats.splice(index, 1);
    setHeaderData(newData);
  };

  const addSelectedClient = () => {
    if (!headerData) return;
    
    const newClient = {
      clientId: "",
      name: "Nouveau client",
      logo: "",
      headline: "Titre du projet",
      summary: "Résumé du projet",
      projectStats: [{ value: "100% ROI" }]
    };
    
    const newData = { ...headerData };
    newData.navigation.casClient.selectedClients.push(newClient);
    setHeaderData(newData);
  };

  const removeSelectedClient = (index: number) => {
    if (!headerData) return;
    
    const newData = { ...headerData };
    newData.navigation.casClient.selectedClients.splice(index, 1);
    setHeaderData(newData);
  };

  if (loading) {
    return <Loader />;
  }

  if (!headerData) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Header Dashboard</CardTitle>
            <CardDescription>Gérer le contenu du header</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Aucune donnée de header trouvée.</p>
          </CardContent>
        </Card>
        </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Header Dashboard</h1>
          <p className="text-gray-600">Gérer le contenu du header et des menus déroulants</p>
        </div>
        <Button onClick={saveHeaderData} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
          <TabsTrigger value="odoo">Odoo</TabsTrigger>
          <TabsTrigger value="about">À Propos</TabsTrigger>
          <TabsTrigger value="cas-client">Cas Client</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Logo Tab */}
        <TabsContent value="logo">
      <Card>
        <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Configuration du logo, image, texte alternatif et taille</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Image du logo</Label>
              <Input
                  value={headerData.logo.image}
                  onChange={(e) => updateField("logo.image", e.target.value)}
                placeholder="/bst.png"
              />
            </div>
              <div className="space-y-2">
              <Label>Texte alternatif</Label>
              <Input
                  value={headerData.logo.alt}
                  onChange={(e) => updateField("logo.alt", e.target.value)}
                placeholder="Black Swan Technology"
              />
            </div>
              <div className="space-y-2">
                <Label>Taille du logo</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentSize = headerData.logo.size || "10em";
                      const numericValue = parseFloat(currentSize);
                      const unit = currentSize.replace(/[\d.]/g, '');
                      const newValue = Math.max(1, numericValue - 1);
                      updateField("logo.size", `${newValue}${unit}`);
                    }}
                  >
                    -
                  </Button>
                  <Input
                    value={headerData.logo.size}
                    onChange={(e) => updateField("logo.size", e.target.value)}
                    placeholder="10em"
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentSize = headerData.logo.size || "10em";
                      const numericValue = parseFloat(currentSize);
                      const unit = currentSize.replace(/[\d.]/g, '');
                      const newValue = Math.min(50, numericValue + 1);
                      updateField("logo.size", `${newValue}${unit}`);
                    }}
                  >
                    +
                  </Button>
          </div>
                <p className="text-xs text-gray-500">
                  Utilisez les boutons +/- ou tapez directement (ex: 10em, 150px, 2rem, 50%)
                </p>
              </div>
        </CardContent>
      </Card>
        </TabsContent>



        {/* HubSpot Tab */}
        <TabsContent value="hubspot">
      <Card>
        <CardHeader>
              <CardTitle>Menu HubSpot</CardTitle>
              <CardDescription>Configuration du menu déroulant HubSpot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
              {/* HubSpot Header */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={headerData.navigation.hubspot.title}
                    onChange={(e) => updateField("navigation.hubspot.title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sous-titre</Label>
                  <Input
                    value={headerData.navigation.hubspot.subtitle}
                    onChange={(e) => updateField("navigation.hubspot.subtitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Badge</Label>
                  <Input
                    value={headerData.navigation.hubspot.badge}
                    onChange={(e) => updateField("navigation.hubspot.badge", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
            <Switch
                    checked={headerData.navigation.hubspot.isActive}
                    onCheckedChange={(checked) => updateField("navigation.hubspot.isActive", checked)}
            />
                  <Label>Actif</Label>
                </div>
          </div>
          
              <Separator />

              {/* CRM Section */}
          <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Section CRM</h3>
                  <Button onClick={() => addDropdownItem("hubspot", "crm")} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un service
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Titre de la section</Label>
                    <Input
                      value={headerData.navigation.hubspot.sections.crm.title}
                      onChange={(e) => updateField("navigation.hubspot.sections.crm.title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Icône de la section</Label>
                    <Select
                      value={headerData.navigation.hubspot.sections.crm.icon}
                      onValueChange={(value) => updateField("navigation.hubspot.sections.crm.icon", value)}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>
                {headerData.navigation.hubspot.sections.crm.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                        <Label>Icône</Label>
                        <Select
                          value={item.icon}
                          onValueChange={(value) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.crm.items[index].icon = value;
                            setHeaderData(newData);
                          }}
                        >
                          <SelectTrigger>
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
                      </div>
            <div>
              <Label>Titre</Label>
                    <Input
                          value={item.title}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.crm.items[index].title = e.target.value;
                            setHeaderData(newData);
                          }}
              />
            </div>
            <div>
                        <Label>Description</Label>
              <Input
                          value={item.description}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.crm.items[index].description = e.target.value;
                            setHeaderData(newData);
                      }}
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={item.url}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.crm.items[index].url = e.target.value;
                            setHeaderData(newData);
                      }}
                    />
                  </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDropdownItem("hubspot", "crm", index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
          </div>

              <Separator />

              {/* Services Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Section Services</h3>
                  <Button onClick={() => addDropdownItem("hubspot", "services")} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un service
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
          <div>
                    <Label>Titre de la section</Label>
                    <Input
                      value={headerData.navigation.hubspot.sections.services.title}
                      onChange={(e) => updateField("navigation.hubspot.sections.services.title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Icône de la section</Label>
                    <Select
                      value={headerData.navigation.hubspot.sections.services.icon}
                      onValueChange={(value) => updateField("navigation.hubspot.sections.services.icon", value)}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>
                {headerData.navigation.hubspot.sections.services.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <Label>Icône</Label>
                        <Select
                          value={item.icon}
                          onValueChange={(value) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.services.items[index].icon = value;
                            setHeaderData(newData);
                          }}
                        >
                          <SelectTrigger>
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
                      </div>
                      <div>
                        <Label>Titre</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.services.items[index].title = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.services.items[index].description = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.hubspot.sections.services.items[index].url = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                  </div>
                </div>
                <Button
                  variant="destructive"
                      size="sm"
                      onClick={() => removeDropdownItem("hubspot", "services", index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Odoo Tab */}
        <TabsContent value="odoo">
      <Card>
        <CardHeader>
              <CardTitle>Menu Odoo</CardTitle>
              <CardDescription>Configuration du menu déroulant Odoo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
              {/* Odoo Header */}
              <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Titre</Label>
              <Input
                    value={headerData.navigation.odoo.title}
                    onChange={(e) => updateField("navigation.odoo.title", e.target.value)}
              />
            </div>
            <div>
              <Label>Sous-titre</Label>
              <Input
                    value={headerData.navigation.odoo.subtitle}
                    onChange={(e) => updateField("navigation.odoo.subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label>Badge</Label>
              <Input
                    value={headerData.navigation.odoo.badge}
                    onChange={(e) => updateField("navigation.odoo.badge", e.target.value)}
              />
            </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={headerData.navigation.odoo.isActive}
                    onCheckedChange={(checked) => updateField("navigation.odoo.isActive", checked)}
                  />
                  <Label>Actif</Label>
            </div>
          </div>

              <Separator />

              {/* Modules Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Section Modules</h3>
                  <Button onClick={() => addDropdownItem("odoo", "modules")} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
          <div>
                    <Label>Titre de la section</Label>
                    <Input
                      value={headerData.navigation.odoo.sections.modules.title}
                      onChange={(e) => updateField("navigation.odoo.sections.modules.title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Icône de la section</Label>
                    <Select
                      value={headerData.navigation.odoo.sections.modules.icon}
                      onValueChange={(value) => updateField("navigation.odoo.sections.modules.icon", value)}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>
                {headerData.navigation.odoo.sections.modules.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <Label>Icône</Label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.modules.items[index].icon = value;
                            setHeaderData(newData);
                      }}
                    >
                      <SelectTrigger>
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
                      </div>
                      <div>
                        <Label>Titre</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.modules.items[index].title = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.modules.items[index].description = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.modules.items[index].url = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                  </div>
                  <Button
                    variant="destructive"
                size="sm"
                      onClick={() => removeDropdownItem("odoo", "modules", index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </div>

              <Separator />

              {/* Services Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Section Services</h3>
                  <Button onClick={() => addDropdownItem("odoo", "services")} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                    Ajouter un service
              </Button>
            </div>
                <div className="grid grid-cols-2 gap-4">
          <div>
                    <Label>Titre de la section</Label>
                    <Input
                      value={headerData.navigation.odoo.sections.services.title}
                      onChange={(e) => updateField("navigation.odoo.sections.services.title", e.target.value)}
                    />
          </div>
          <div>
                    <Label>Icône de la section</Label>
                    <Select
                      value={headerData.navigation.odoo.sections.services.icon}
                      onValueChange={(value) => updateField("navigation.odoo.sections.services.icon", value)}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>
                {headerData.navigation.odoo.sections.services.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <Label>Icône</Label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.services.items[index].icon = value;
                            setHeaderData(newData);
                      }}
                    >
                      <SelectTrigger>
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
                      </div>
                      <div>
                        <Label>Titre</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.services.items[index].title = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.services.items[index].description = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.odoo.sections.services.items[index].url = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                  </div>
                  <Button
                    variant="destructive"
                      size="sm"
                      onClick={() => removeDropdownItem("odoo", "services", index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Menu À Propos</CardTitle>
              <CardDescription>Configuration du menu déroulant À Propos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={headerData.navigation.about.title}
                    onChange={(e) => updateField("navigation.about.title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sous-titre</Label>
                  <Input
                    value={headerData.navigation.about.subtitle}
                    onChange={(e) => updateField("navigation.about.subtitle", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={headerData.navigation.about.isActive}
                    onCheckedChange={(checked) => updateField("navigation.about.isActive", checked)}
                  />
                  <Label>Actif</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Statistiques</h3>
                  <Button onClick={addStat} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une statistique
                  </Button>
                </div>
                {headerData.navigation.about.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <Label>Icône</Label>
                        <Select
                          value={stat.icon}
                          onValueChange={(value) => {
                            const newData = { ...headerData };
                            newData.navigation.about.stats[index].icon = value;
                            setHeaderData(newData);
                          }}
                        >
                          <SelectTrigger>
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
                      </div>
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={stat.title}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.about.stats[index].title = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={stat.description}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.about.stats[index].description = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                    </div>
              <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cas Client Tab */}
        <TabsContent value="cas-client">
          <Card>
            <CardHeader>
              <CardTitle>Menu Cas Client</CardTitle>
              <CardDescription>Configuration du menu déroulant Cas Client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={headerData.navigation.casClient.title}
                    onChange={(e) => updateField("navigation.casClient.title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sous-titre</Label>
                  <Input
                    value={headerData.navigation.casClient.subtitle}
                    onChange={(e) => updateField("navigation.casClient.subtitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Texte du bouton</Label>
                  <Input
                    value={headerData.navigation.casClient.buttonText}
                    onChange={(e) => updateField("navigation.casClient.buttonText", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={headerData.navigation.casClient.isActive}
                    onCheckedChange={(checked) => updateField("navigation.casClient.isActive", checked)}
                  />
                  <Label>Actif</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Clients Sélectionnés (Max 2)</h3>
                  <Button 
                    onClick={addSelectedClient} 
                variant="outline" 
                size="sm"
                    disabled={headerData.navigation.casClient.selectedClients.length >= 2}
              >
                <Plus className="w-4 h-4 mr-2" />
                    Ajouter un client
              </Button>
            </div>
                {headerData.navigation.casClient.selectedClients.map((client, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Client {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSelectedClient(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Client</Label>
                        <Select
                          value={client.clientId}
                          onValueChange={(value) => {
                            const newData = { ...headerData };
                            const selectedClient = clients.find(c => c.slug === value);
                            if (selectedClient) {
                              newData.navigation.casClient.selectedClients[index] = {
                                clientId: value,
                                name: selectedClient.name,
                                logo: selectedClient.logo || "",
                                headline: selectedClient.headline || "",
                                summary: selectedClient.summary || "",
                                projectStats: selectedClient.projectStats || [{ value: "100% ROI" }]
                              };
                              setHeaderData(newData);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.slug} value={client.slug}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={client.name}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.casClient.selectedClients[index].name = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Logo</Label>
                        <Input
                          value={client.logo}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.casClient.selectedClients[index].logo = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Titre du projet</Label>
                        <Input
                          value={client.headline}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.casClient.selectedClients[index].headline = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Résumé</Label>
                        <Textarea
                          value={client.summary}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.casClient.selectedClients[index].summary = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Statistique du projet</Label>
                        <Input
                          value={client.projectStats[0]?.value || ""}
                          onChange={(e) => {
                            const newData = { ...headerData };
                            newData.navigation.casClient.selectedClients[index].projectStats[0].value = e.target.value;
                            setHeaderData(newData);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
      <Card>
        <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
              <CardDescription>Configuration des informations de contact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Téléphone</Label>
              <Input
                    value={headerData.contact.phone}
                    onChange={(e) => updateField("contact.phone", e.target.value)}
                    placeholder="+212 6 12 34 56 78"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                    value={headerData.contact.email}
                    onChange={(e) => updateField("contact.email", e.target.value)}
                    placeholder="contact@blackswantechnology.com"
              />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input
                    value={headerData.contact.address}
                    onChange={(e) => updateField("contact.address", e.target.value)}
                    placeholder="Casablanca, Maroc"
              />
            </div>
          </div>
        </CardContent>
      </Card>

          <Card className="mt-6">
        <CardHeader>
              <CardTitle>Bouton CTA</CardTitle>
              <CardDescription>Configuration du bouton d'appel à l'action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Texte du bouton</Label>
              <Input
                    value={headerData.cta.text}
                    onChange={(e) => updateField("cta.text", e.target.value)}
                    placeholder="Prendre Rendez-vous"
              />
            </div>
            <div>
                  <Label>URL du bouton</Label>
              <Input
                    value={headerData.cta.url}
                    onChange={(e) => updateField("cta.url", e.target.value)}
                    placeholder="/rendez-vous"
              />
            </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={headerData.cta.isActive}
                    onCheckedChange={(checked) => updateField("cta.isActive", checked)}
                  />
                  <Label>Actif</Label>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 