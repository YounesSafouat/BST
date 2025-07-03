"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Copy, 
  Settings,
  Target,
  Users,
  BarChart3,
  Zap,
  Calendar,
  Play,
  Check,
  Quote,
  Award,
  TrendingUp,
  Building2,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Loader from '@/components/home/Loader';
import { availableIcons } from '@/lib/iconList';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  result: string;
  avatar: string;
}

interface HubSpotData {
  type: string;
  title: string;
  hero: {
    headline: string;
    logo: string;
    subheadline: string;
    ctaPrimary: {
      text: string;
      icon: string;
    };
    ctaSecondary: {
      text: string;
      icon: string;
    };
  };
  trustMetrics: Array<{
    number: number;
    suffix: string;
    label: string;
  }>;
  hubspotCapabilities: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  hubCards: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
  }>;
  partnership: {
    headline: string;
    description: string;
    hubs: string[];
  };
  testimonials: string[];
  finalCta: {
    headline: string;
    description: string;
  };
}

export default function HubSpotDashboard() {
  const [hubspotData, setHubspotData] = useState<HubSpotData>({
    type: "hubspot-page",
    title: "HubSpot",
    hero: {
      headline: "Intégration HubSpot Pour Votre Entreprise",
      logo: "/hubspot.svg",
      subheadline: "En tant que Partenaire platinum HubSpot, nous concevons des implémentations sur mesure qui transforment vos opérations et accélèrent votre croissance.",
      ctaPrimary: {
        text: "Planifier une Consultation",
        icon: "Calendar"
      },
      ctaSecondary: {
        text: "Voir Nos Cas d'Étude",
        icon: "Play"
      }
    },
    trustMetrics: [
      { number: 500, suffix: "+", label: "Intégrations HubSpot" },
      { number: 98, suffix: "%", label: "Taux de Réussite" },
      { number: 5, suffix: " Ans", label: "Partenariat HubSpot" },
      { number: 24, suffix: "/7", label: "Support Expert" }
    ],
    hubspotCapabilities: [
      {
        icon: "Target",
        title: "Marketing Hub - Implémentation",
        description: "Configuration complète de l'automatisation marketing avec scoring de leads avancé, campagnes email et optimisation des conversions."
      },
      {
        icon: "Users",
        title: "Sales Hub - Configuration",
        description: "Gestion de pipeline, suivi des opportunités et automatisation des ventes pour accélérer votre croissance commerciale."
      },
      {
        icon: "BarChart3",
        title: "Service Hub - Intégration",
        description: "Flux de travail service client, système de ticketing et base de connaissances pour un support exceptionnel."
      },
      {
        icon: "Zap",
        title: "Operations Hub - Configuration",
        description: "Synchronisation des données, automatisation des workflows et intégrations personnalisées dans votre écosystème tech."
      }
    ],
    hubCards: [
      {
        icon: "/icones/MarketingHub_Icon_2023_Gradient_RGB_24px (1).svg",
        title: "Marketing Hub®",
        description: "AI-powered marketing software that helps you generate leads and automate marketing.",
        features: [
          "Breeze social media agent",
          "Marketing automation",
          "Analytics"
        ]
      },
      {
        icon: "/icones/SalesHub_Icon_Gradient_RGB_24px.svg",
        title: "Sales Hub®",
        description: "Easy-to-adopt sales software that leverages AI to build pipelines and close deals.",
        features: [
          "Sales workspace",
          "Deal management",
          "Breeze prospecting agent"
        ]
      },
      {
        icon: "/icones/ServiceHub_Icon_Gradient_RGB_24px.svg",
        title: "Service Hub®",
        description: "Customer service software powered by AI to scale support and drive retention.",
        features: [
          "Omni-channel help desk",
          "Breeze customer agent",
          "Customer success workspace"
        ]
      },
      {
        icon: "/icones/OperationsHub_Icon_Gradient_RGB_24px.svg",
        title: "Operations Hub®",
        description: "Operations software that connects your people, processes, and systems.",
        features: [
          "Data sync",
          "Workflow automation",
          "Custom integrations"
        ]
      },
      {
        icon: "/icones/Product Icon one-1.svg",
        title: "Commerce Hub®",
        description: "E-commerce software that helps you sell more and scale faster.",
        features: [
          "Online store",
          "Payment processing",
          "Inventory management"
        ]
      },
      {
        icon: "/icones/Product_Icon_Only_CommerceHub.svg",
        title: "CMS Hub®",
        description: "Content management software that helps you build a powerful website.",
        features: [
          "Drag-and-drop editor",
          "SEO optimization",
          "Multi-language support"
        ]
      }
    ],
    partnership: {
      headline: "Partenaire HubSpot platinum",
      description: "Notre certification platinum représente le plus haut niveau d'expertise HubSpot, avec un succès prouvé dans les implémentations d'entreprise.",
      hubs: ["Marketing Hub", "Sales Hub", "Service Hub", "Operations Hub"]
    },
    testimonials: [],
    finalCta: {
      headline: "Prêt à Transformer Votre Business ?",
      description: "Laissez nos experts HubSpot concevoir et implémenter une solution qui génère de vrais résultats pour votre entreprise."
    }
  });

  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHubSpotData();
    fetchAvailableTestimonials();
  }, []);

  const fetchHubSpotData = async () => {
    try {
      const response = await fetch('/api/content?type=hubspot-page');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          setHubspotData(data[0].content as HubSpotData);
        }
      }
    } catch (error) {
      console.error('Error fetching HubSpot data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchAvailableTestimonials = async () => {
    try {
      const response = await fetch('/api/content?type=testimonial');
      if (response.ok) {
        const data = await response.json();
        setAvailableTestimonials(data.map((item: any) => ({ ...item.content, _id: item._id })));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const saveHubSpotData = async () => {
    setIsLoading(true);
    try {
      // Check if HubSpot page already exists
      const getResponse = await fetch('/api/content?type=hubspot-page');
      if (!getResponse.ok) {
        throw new Error('Failed to fetch existing data');
      }
      
      const existingData = await getResponse.json();
      const hasExisting = existingData.length > 0;
      
      // Use PUT to update existing record, or POST to create new one
      const method = hasExisting ? 'PUT' : 'POST';
      const url = hasExisting ? '/api/content?type=hubspot-page' : '/api/content';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'hubspot-page',
          title: hubspotData.title,
          description: 'Page HubSpot - Configuration complète',
          content: hubspotData,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: hasExisting ? "Page HubSpot mise à jour avec succès" : "Page HubSpot créée avec succès",
        });
        // Refresh the data after save
        fetchHubSpotData();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving HubSpot data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (path: string, value: any) => {
    setHubspotData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateArrayField = (path: string, index: number, field: string, value: any) => {
    setHubspotData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      
      if (current[index]) {
        current[index] = { ...current[index], [field]: value };
      }
      
      return newData;
    });
  };

  const addTrustMetric = () => {
    setHubspotData(prev => ({
      ...prev,
      trustMetrics: [...prev.trustMetrics, { number: 0, suffix: "", label: "" }]
    }));
  };

  const removeTrustMetric = (index: number) => {
    setHubspotData(prev => ({
      ...prev,
      trustMetrics: prev.trustMetrics.filter((_, i) => i !== index)
    }));
  };

  const addCapability = () => {
    setHubspotData(prev => ({
      ...prev,
      hubspotCapabilities: [...prev.hubspotCapabilities, { icon: "Target", title: "", description: "" }]
    }));
  };

  const removeCapability = (index: number) => {
    setHubspotData(prev => ({
      ...prev,
      hubspotCapabilities: prev.hubspotCapabilities.filter((_, i) => i !== index)
    }));
  };

  const addHubCard = () => {
    setHubspotData(prev => ({
      ...prev,
      hubCards: [...prev.hubCards, { icon: "", title: "", description: "", features: [""] }]
    }));
  };

  const removeHubCard = (index: number) => {
    setHubspotData(prev => ({
      ...prev,
      hubCards: prev.hubCards.filter((_, i) => i !== index)
    }));
  };

  const addFeature = (cardIndex: number) => {
    setHubspotData(prev => ({
      ...prev,
      hubCards: prev.hubCards.map((card, i) => 
        i === cardIndex 
          ? { ...card, features: [...card.features, ""] }
          : card
      )
    }));
  };

  const removeFeature = (cardIndex: number, featureIndex: number) => {
    setHubspotData(prev => ({
      ...prev,
      hubCards: prev.hubCards.map((card, i) => 
        i === cardIndex 
          ? { ...card, features: card.features.filter((_, fi) => fi !== featureIndex) }
          : card
      )
    }));
  };

  const addTestimonial = (testimonialId: string) => {
    setHubspotData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, testimonialId]
    }));
  };

  const removeTestimonial = (index: number) => {
    setHubspotData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  if (isInitialLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Page HubSpot</h1>
            <p className="text-gray-600">Gérez le contenu de votre page HubSpot</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowWebsitePreview(true)}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Aperçu</span>
          </Button>
          <Button
            onClick={saveHubSpotData}
            disabled={isLoading}
            className="flex items-center space-x-2 "
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? "Sauvegarde..." : "Sauvegarder"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
              <TabsTrigger value="capabilities">Services</TabsTrigger>
              <TabsTrigger value="hubs">Hubs</TabsTrigger>
              <TabsTrigger value="partnership">Partenariat</TabsTrigger>
            </TabsList>

            {/* Hero Section */}
            <TabsContent value="hero" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Section Hero</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez la section principale de votre page HubSpot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Titre principal</Label>
                    <Input
                      value={hubspotData.hero.headline}
                      onChange={(e) => updateField('hero.headline', e.target.value)}
                      placeholder="Intégration HubSpot Pour Votre Entreprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo (URL)</Label>
                    <Input
                      value={hubspotData.hero.logo}
                      onChange={(e) => updateField('hero.logo', e.target.value)}
                      placeholder="/hubspot.svg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sous-titre</Label>
                    <Textarea
                      value={hubspotData.hero.subheadline}
                      onChange={(e) => updateField('hero.subheadline', e.target.value)}
                      placeholder="Description de votre service HubSpot"
                      rows={3}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CTA Principal - Texte</Label>
                      <Input
                        value={hubspotData.hero.ctaPrimary.text}
                        onChange={(e) => updateField('hero.ctaPrimary.text', e.target.value)}
                        placeholder="Planifier une Consultation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA Principal - Icône</Label>
                      <Select
                        value={hubspotData.hero.ctaPrimary.icon}
                        onValueChange={(value) => updateField('hero.ctaPrimary.icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une icône" />
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
                    <div className="space-y-2">
                      <Label>CTA Secondaire - Texte</Label>
                      <Input
                        value={hubspotData.hero.ctaSecondary.text}
                        onChange={(e) => updateField('hero.ctaSecondary.text', e.target.value)}
                        placeholder="Voir Nos Cas d'Étude"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA Secondaire - Icône</Label>
                      <Select
                        value={hubspotData.hero.ctaSecondary.icon}
                        onValueChange={(value) => updateField('hero.ctaSecondary.icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une icône" />
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trust Metrics */}
            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Métriques de Confiance</span>
                  </CardTitle>
                  <CardDescription>
                    Ajoutez des statistiques pour renforcer la confiance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hubspotData.trustMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Métrique {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTrustMetric(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label>Nombre</Label>
                          <Input
                            type="number"
                            value={metric.number}
                            onChange={(e) => {
                              const newMetrics = [...hubspotData.trustMetrics];
                              newMetrics[index].number = parseInt(e.target.value) || 0;
                              setHubspotData(prev => ({ ...prev, trustMetrics: newMetrics }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Suffixe</Label>
                          <Input
                            value={metric.suffix}
                            onChange={(e) => {
                              const newMetrics = [...hubspotData.trustMetrics];
                              newMetrics[index].suffix = e.target.value;
                              setHubspotData(prev => ({ ...prev, trustMetrics: newMetrics }));
                            }}
                            placeholder="+"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Label</Label>
                          <Input
                            value={metric.label}
                            onChange={(e) => {
                              const newMetrics = [...hubspotData.trustMetrics];
                              newMetrics[index].label = e.target.value;
                              setHubspotData(prev => ({ ...prev, trustMetrics: newMetrics }));
                            }}
                            placeholder="Intégrations HubSpot"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addTrustMetric} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une métrique
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Capabilities */}
            <TabsContent value="capabilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Services HubSpot</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez vos services et capacités HubSpot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hubspotData.hubspotCapabilities.map((capability, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCapability(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label>Icône</Label>
                          <Select
                            value={capability.icon}
                            onValueChange={(value) => {
                              const newCapabilities = [...hubspotData.hubspotCapabilities];
                              newCapabilities[index].icon = value;
                              setHubspotData(prev => ({ ...prev, hubspotCapabilities: newCapabilities }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une icône" />
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
                        <div className="space-y-1">
                          <Label>Titre</Label>
                          <Input
                            value={capability.title}
                            onChange={(e) => {
                              const newCapabilities = [...hubspotData.hubspotCapabilities];
                              newCapabilities[index].title = e.target.value;
                              setHubspotData(prev => ({ ...prev, hubspotCapabilities: newCapabilities }));
                            }}
                            placeholder="Marketing Hub - Implémentation"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Description</Label>
                          <Textarea
                            value={capability.description}
                            onChange={(e) => {
                              const newCapabilities = [...hubspotData.hubspotCapabilities];
                              newCapabilities[index].description = e.target.value;
                              setHubspotData(prev => ({ ...prev, hubspotCapabilities: newCapabilities }));
                            }}
                            placeholder="Description du service"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addCapability} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un service
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hub Cards */}
            <TabsContent value="hubs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Cartes des Hubs</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez les cartes présentant les différents hubs HubSpot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hubspotData.hubCards.map((card, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Hub {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeHubCard(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Icône (URL)</Label>
                          <Input
                            value={card.icon}
                            onChange={(e) => {
                              const newCards = [...hubspotData.hubCards];
                              newCards[index].icon = e.target.value;
                              setHubspotData(prev => ({ ...prev, hubCards: newCards }));
                            }}
                            placeholder="/icones/hub-icon.svg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Titre</Label>
                          <Input
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...hubspotData.hubCards];
                              newCards[index].title = e.target.value;
                              setHubspotData(prev => ({ ...prev, hubCards: newCards }));
                            }}
                            placeholder="Marketing Hub®"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Description</Label>
                        <Textarea
                          value={card.description}
                          onChange={(e) => {
                            const newCards = [...hubspotData.hubCards];
                            newCards[index].description = e.target.value;
                            setHubspotData(prev => ({ ...prev, hubCards: newCards }));
                          }}
                          placeholder="Description du hub"
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Fonctionnalités</Label>
                        {card.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newCards = [...hubspotData.hubCards];
                                newCards[index].features[featureIndex] = e.target.value;
                                setHubspotData(prev => ({ ...prev, hubCards: newCards }));
                              }}
                              placeholder="Fonctionnalité"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFeature(index, featureIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => addFeature(index)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter une fonctionnalité
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addHubCard} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un hub
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Partnership */}
            <TabsContent value="partnership" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Section Partenariat</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez la section de partenariat HubSpot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={hubspotData.partnership.headline}
                      onChange={(e) => updateField('partnership.headline', e.target.value)}
                      placeholder="Partenaire HubSpot platinum"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={hubspotData.partnership.description}
                      onChange={(e) => updateField('partnership.description', e.target.value)}
                      placeholder="Description du partenariat"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Hubs Certifiés</Label>
                    <div className="space-y-2">
                      {hubspotData.partnership.hubs.map((hub, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={hub}
                            onChange={(e) => {
                              const newHubs = [...hubspotData.partnership.hubs];
                              newHubs[index] = e.target.value;
                              setHubspotData(prev => ({ 
                                ...prev, 
                                partnership: { ...prev.partnership, hubs: newHubs }
                              }));
                            }}
                            placeholder="Marketing Hub"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newHubs = hubspotData.partnership.hubs.filter((_, i) => i !== index);
                              setHubspotData(prev => ({ 
                                ...prev, 
                                partnership: { ...prev.partnership, hubs: newHubs }
                              }));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => {
                          const newHubs = [...hubspotData.partnership.hubs, ""];
                          setHubspotData(prev => ({ 
                            ...prev, 
                            partnership: { ...prev.partnership, hubs: newHubs }
                          }));
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un hub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Quote className="w-5 h-5" />
                <span>Témoignages</span>
              </CardTitle>
              <CardDescription>
                Sélectionnez les témoignages à afficher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hubspotData.testimonials.map((testimonialId, index) => {
                const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{testimonial?.name || testimonialId}</div>
                      <div className="text-xs text-gray-600">{testimonial?.role || 'Rôle non trouvé'}</div>
                      <div className="text-xs text-gray-500">
                        Avatar: {testimonial?.avatar ? (testimonial.avatar.startsWith('http') || testimonial.avatar.startsWith('/') ? 'URL' : 'Initiales') : 'Non défini'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestimonial(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un témoignage
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-60 overflow-y-auto">
                  {availableTestimonials.map((testimonial) => (
                    <DropdownMenuItem
                      key={testimonial._id}
                      onClick={() => addTestimonial(testimonial._id)}
                      className="flex flex-col items-start p-3 space-y-1"
                    >
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{testimonial.quote}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>CTA Final</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={hubspotData.finalCta.headline}
                  onChange={(e) => updateField('finalCta.headline', e.target.value)}
                  placeholder="Prêt à Transformer Votre Business ?"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={hubspotData.finalCta.description}
                  onChange={(e) => updateField('finalCta.description', e.target.value)}
                  placeholder="Description du CTA final"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Website Preview Modal */}
      {showWebsitePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Aperçu du Site HubSpot</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/hubspot', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir dans un nouvel onglet</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWebsitePreview(false)}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Fermer</span>
                </Button>
              </div>
            </div>
            
            {/* Modal Content - Website Preview */}
            <div className="flex-1 relative">
              <iframe
                src="/hubspot?preview=true"
                className="w-full h-full border-0"
                title="HubSpot Page Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 