"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Save, Eye, X } from "lucide-react";
import { toast } from "sonner";
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

interface OdooData {
  type: string;
  title: string;
  hero: {
    headline: string;
    subheadline: string;
    description: string;
    logo: string;
    videoUrl: string;
    ctaPrimary: {
      text: string;
      icon: string;
    };
    ctaSecondary: {
      text: string;
      icon: string;
    };
    stats: Array<{
      number: number;
      suffix: string;
      label: string;
    }>;
  };
  trustMetrics: Array<{
    number: number;
    suffix: string;
    label: string;
  }>;
  platformSection: {
    headline: string;
    subheadline: string;
    apps: Array<{
      icon: string;
      title: string;
      description: string;
      features: string[];
    }>;
  };
  services: {
    headline: string;
    subheadline: string;
    capabilities: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  pricing: {
    headline: string;
    subheadline: string;
    plans: Array<{
      name: string;
      description: string;
      monthlyPrice: number;
      yearlyPrice: number;
      popular: boolean;
      consultantHours: string;
      features: string[];
      cta: string;
    }>;
  };
  partnership: {
    headline: string;
    description: string;
    modules: string[];
  };
  testimonials: string[];
  finalCta: {
    headline: string;
    description: string;
    ctaPrimary: {
      text: string;
      icon: string;
    };
    ctaSecondary: {
      text: string;
      icon: string;
    };
  };
}

export default function OdooDashboard() {
  const [odooData, setOdooData] = useState<OdooData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchOdooData();
    fetchTestimonials();
  }, []);

  const fetchOdooData = async () => {
    try {
      const response = await fetch('/api/content?type=odoo-page');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          setOdooData(data[0].content);
        } else {
          // Initialize with default structure if no data exists
          setOdooData({
            type: 'odoo-page',
            title: 'Odoo',
            hero: {
              headline: 'Toute votre entreprise sur une plateforme',
              subheadline: 'Simple, efficace, et abordable!',
              description: 'En tant que Partenaire Officiel Odoo, nous concevons des implémentations sur mesure qui unifient tous vos processus métier.',
              logo: '/Odoo.svg',
              videoUrl: 'https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/video_homepage.webm',
              ctaPrimary: { text: "Démarrer - C'est gratuit", icon: "ArrowRight" },
              ctaSecondary: { text: "Rencontrer un Conseiller", icon: "Users" },
              stats: [
                { number: 100, suffix: "+", label: "Implémentations" },
                { number: 99, suffix: "%", label: "Satisfaction" }
              ]
            },
            trustMetrics: [
              { number: 1000, suffix: "+", label: "Implémentations Odoo" },
              { number: 99, suffix: "%", label: "Satisfaction Client" },
              { number: 7, suffix: " Ans", label: "Partenaire Officiel" },
              { number: 24, suffix: "/7", label: "Support Technique" }
            ],
            platformSection: {
              headline: "Plateforme Tout-en-Un",
              subheadline: "Plus de 30 applications intégrées pour couvrir tous vos besoins métier, de la comptabilité au marketing en passant par la production.",
              apps: []
            },
            services: {
              headline: "Implémentation Odoo Experte",
              subheadline: "Notre statut de partenaire officiel garantit une expertise approfondie dans tous les modules Odoo et les meilleures pratiques d'implémentation.",
              capabilities: []
            },
            pricing: {
              headline: "Tarification Odoo",
              subheadline: "Choisissez le plan adapté à vos besoins. Solutions professionnelles avec consultant dédié et support complet.",
              plans: []
            },
            partnership: {
              headline: "Partenaire Officiel Odoo",
              description: "Notre certification officielle représente le plus haut niveau d'expertise Odoo, avec un succès prouvé dans les implémentations d'entreprise.",
              modules: []
            },
            testimonials: [],
            finalCta: {
              headline: "Prêt à Unifier Votre Entreprise ?",
              description: "Laissez nos experts Odoo concevoir et implémenter une solution qui simplifie et optimise tous vos processus métier sur une seule plateforme.",
              ctaPrimary: { text: "Commencer Gratuitement", icon: "Rocket" },
              ctaSecondary: { text: "Rencontrer un Expert", icon: "Users" }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching Odoo data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonials = async () => {
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

  const updateField = (path: string, value: any) => {
    if (!odooData) return;
    
    const keys = path.split('.');
    setOdooData(prevData => {
      if (!prevData) return prevData;
      
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone
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

  const updateArrayField = (path: string, index: number, value: any) => {
    if (!odooData) return;
    
    const keys = path.split('.');
    setOdooData(prevData => {
      if (!prevData) return prevData;
      
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone
      let current: any = newData;
      
      // Navigate to the parent of the array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Ensure the array exists
      const arrayKey = keys[keys.length - 1];
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
      }
      
      // Update the specific index
      current[arrayKey][index] = value;
      return newData;
    });
  };

  const addArrayItem = (path: string, newItem: any) => {
    if (!odooData) return;
    
    const keys = path.split('.');
    setOdooData(prevData => {
      if (!prevData) return prevData;
      
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone
      let current: any = newData;
      
      // Navigate to the parent of the array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Ensure the array exists
      const arrayKey = keys[keys.length - 1];
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
      }
      
      // Add the new item
      current[arrayKey].push(newItem);
      return newData;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    if (!odooData) return;
    
    const keys = path.split('.');
    setOdooData(prevData => {
      if (!prevData) return prevData;
      
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone
      let current: any = newData;
      
      // Navigate to the parent of the array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Ensure the array exists
      const arrayKey = keys[keys.length - 1];
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
      }
      
      // Remove the item
      current[arrayKey].splice(index, 1);
      return newData;
    });
  };

  const saveData = async () => {
    if (!odooData) return;
    
    setIsSaving(true);
    try {
      // Check if record exists
      const checkResponse = await fetch('/api/content?type=odoo-page');
      const existingData = await checkResponse.json();
      
      const method = existingData.length > 0 ? 'PUT' : 'POST';
      const url = existingData.length > 0 
        ? `/api/content?type=odoo-page` 
        : '/api/content';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'odoo-page',
          title: 'Odoo',
          description: 'Page Odoo - Configuration complète',
          content: odooData
        }),
      });

      if (response.ok) {
        toast.success('Données sauvegardées avec succès');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!odooData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Erreur: Impossible de charger les données Odoo</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Odoo</h1>
        <div className="flex gap-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Voir le Site
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Aperçu de la page Odoo</DialogTitle>
              </DialogHeader>
              <iframe 
                src="/odoo?preview=true" 
                className="w-full h-full border-0"
                title="Aperçu Odoo"
              />
            </DialogContent>
          </Dialog>
          <Button onClick={saveData} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="platform">Plateforme</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="partnership">Partenariat</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="finalCta">CTA Final</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre principal</Label>
                  <Input
                    value={odooData.hero.headline}
                    onChange={(e) => updateField('hero.headline', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sous-titre</Label>
                  <Input
                    value={odooData.hero.subheadline}
                    onChange={(e) => updateField('hero.subheadline', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={odooData.hero.description}
                  onChange={(e) => updateField('hero.description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    value={odooData.hero.logo}
                    onChange={(e) => updateField('hero.logo', e.target.value)}
                  />
                </div>
                <div>
                  <Label>URL Vidéo</Label>
                  <Input
                    value={odooData.hero.videoUrl}
                    onChange={(e) => updateField('hero.videoUrl', e.target.value)}
                  />
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Principal - Texte</Label>
                  <Input
                    value={odooData.hero.ctaPrimary.text}
                    onChange={(e) => updateField('hero.ctaPrimary.text', e.target.value)}
                  />
                </div>
                <div>
                  <Label>CTA Principal - Icône</Label>
                  <Select
                    value={odooData.hero.ctaPrimary.icon}
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Secondaire - Texte</Label>
                  <Input
                    value={odooData.hero.ctaSecondary.text}
                    onChange={(e) => updateField('hero.ctaSecondary.text', e.target.value)}
                  />
                </div>
                <div>
                  <Label>CTA Secondaire - Icône</Label>
                  <Select
                    value={odooData.hero.ctaSecondary.icon}
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

              {/* Hero Stats */}
              <div>
                <Label>Statistiques Hero</Label>
                {odooData.hero.stats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mt-2">
                    <Input
                      type="number"
                      value={stat.number}
                      onChange={(e) => updateArrayField('hero.stats', index, { ...stat, number: parseInt(e.target.value) })}
                      placeholder="Nombre"
                    />
                    <Input
                      value={stat.suffix}
                      onChange={(e) => updateArrayField('hero.stats', index, { ...stat, suffix: e.target.value })}
                      placeholder="Suffixe"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => updateArrayField('hero.stats', index, { ...stat, label: e.target.value })}
                      placeholder="Label"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('hero.stats', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('hero.stats', { number: 0, suffix: '', label: '' })}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une statistique
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Confiance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {odooData.trustMetrics.map((metric, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    value={metric.number}
                    onChange={(e) => updateArrayField('trustMetrics', index, { ...metric, number: parseInt(e.target.value) })}
                    placeholder="Nombre"
                  />
                  <Input
                    value={metric.suffix}
                    onChange={(e) => updateArrayField('trustMetrics', index, { ...metric, suffix: e.target.value })}
                    placeholder="Suffixe"
                  />
                  <Input
                    value={metric.label}
                    onChange={(e) => updateArrayField('trustMetrics', index, { ...metric, label: e.target.value })}
                    placeholder="Label"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('trustMetrics', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('trustMetrics', { number: 0, suffix: '', label: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une métrique
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Section */}
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Plateforme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={odooData.platformSection.headline}
                  onChange={(e) => updateField('platformSection.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Textarea
                  value={odooData.platformSection.subheadline}
                  onChange={(e) => updateField('platformSection.subheadline', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Applications</Label>
                {odooData.platformSection.apps.map((app, index) => (
                  <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Icône</Label>
                        <Select
                          value={app.icon}
                          onValueChange={(value) => updateArrayField('platformSection.apps', index, { ...app, icon: value })}
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
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={app.title}
                          onChange={(e) => updateArrayField('platformSection.apps', index, { ...app, title: e.target.value })}
                          placeholder="Titre"
                        />
                      </div>
                    </div>
                    <Textarea
                      value={app.description}
                      onChange={(e) => updateArrayField('platformSection.apps', index, { ...app, description: e.target.value })}
                      placeholder="Description"
                      rows={2}
                    />
                    <div>
                      <Label>Fonctionnalités</Label>
                      {app.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex gap-2 mt-1">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...app.features];
                              newFeatures[fIndex] = e.target.value;
                              updateArrayField('platformSection.apps', index, { ...app, features: newFeatures });
                            }}
                            placeholder="Fonctionnalité"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = app.features.filter((_, i) => i !== fIndex);
                              updateArrayField('platformSection.apps', index, { ...app, features: newFeatures });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFeatures = [...app.features, ''];
                          updateArrayField('platformSection.apps', index, { ...app, features: newFeatures });
                        }}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une fonctionnalité
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('platformSection.apps', index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer l'application
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('platformSection.apps', { icon: '', title: '', description: '', features: [] })}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={odooData.services.headline}
                  onChange={(e) => updateField('services.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Textarea
                  value={odooData.services.subheadline}
                  onChange={(e) => updateField('services.subheadline', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Capacités</Label>
                {odooData.services.capabilities.map((capability, index) => (
                  <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Icône</Label>
                        <Select
                          value={capability.icon}
                          onValueChange={(value) => updateArrayField('services.capabilities', index, { ...capability, icon: value })}
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
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={capability.title}
                          onChange={(e) => updateArrayField('services.capabilities', index, { ...capability, title: e.target.value })}
                          placeholder="Titre"
                        />
                      </div>
                    </div>
                    <Textarea
                      value={capability.description}
                      onChange={(e) => updateArrayField('services.capabilities', index, { ...capability, description: e.target.value })}
                      placeholder="Description"
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('services.capabilities', index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer la capacité
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('services.capabilities', { icon: '', title: '', description: '' })}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une capacité
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={odooData.pricing.headline}
                  onChange={(e) => updateField('pricing.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Textarea
                  value={odooData.pricing.subheadline}
                  onChange={(e) => updateField('pricing.subheadline', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Plans</Label>
                {odooData.pricing.plans.map((plan, index) => (
                  <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={plan.name}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, name: e.target.value })}
                        placeholder="Nom du plan"
                      />
                      <Input
                        value={plan.description}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, description: e.target.value })}
                        placeholder="Description"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={plan.monthlyPrice}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, monthlyPrice: parseInt(e.target.value) })}
                        placeholder="Prix mensuel"
                      />
                      <Input
                        type="number"
                        value={plan.yearlyPrice}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, yearlyPrice: parseInt(e.target.value) })}
                        placeholder="Prix annuel"
                      />
                      <Input
                        value={plan.consultantHours}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, consultantHours: e.target.value })}
                        placeholder="Heures consultant"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`popular-${index}`}
                        checked={plan.popular}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, popular: e.target.checked })}
                      />
                      <Label htmlFor={`popular-${index}`}>Plan populaire</Label>
                    </div>
                    <div>
                      <Label>Fonctionnalités</Label>
                      {plan.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex gap-2 mt-1">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...plan.features];
                              newFeatures[fIndex] = e.target.value;
                              updateArrayField('pricing.plans', index, { ...plan, features: newFeatures });
                            }}
                            placeholder="Fonctionnalité"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = plan.features.filter((_, i) => i !== fIndex);
                              updateArrayField('pricing.plans', index, { ...plan, features: newFeatures });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFeatures = [...plan.features, ''];
                          updateArrayField('pricing.plans', index, { ...plan, features: newFeatures });
                        }}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une fonctionnalité
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`plan-cta-${index}`}>Texte du bouton</Label>
                      <Input
                        id={`plan-cta-${index}`}
                        value={plan.cta}
                        onChange={(e) => updateArrayField('pricing.plans', index, { ...plan, cta: e.target.value })}
                        placeholder="Texte du bouton"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('pricing.plans', index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer le plan
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('pricing.plans', { 
                    name: '', 
                    description: '', 
                    monthlyPrice: 0, 
                    yearlyPrice: 0, 
                    popular: false, 
                    consultantHours: '', 
                    features: [], 
                    cta: '' 
                  })}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partnership */}
        <TabsContent value="partnership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partenariat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={odooData.partnership.headline}
                  onChange={(e) => updateField('partnership.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={odooData.partnership.description}
                  onChange={(e) => updateField('partnership.description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Modules</Label>
                {odooData.partnership.modules.map((module, index) => (
                  <div key={index} className="flex gap-2 mt-1">
                    <Input
                      value={module}
                      onChange={(e) => updateArrayField('partnership.modules', index, e.target.value)}
                      placeholder="Nom du module"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('partnership.modules', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('partnership.modules', '')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un module
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Témoignages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testimonial-select">Sélectionner des témoignages</Label>
                <Select
                  onValueChange={(value) => {
                    if (!odooData.testimonials.includes(value)) {
                      addArrayItem('testimonials', value);
                    }
                  }}
                >
                  <SelectTrigger id="testimonial-select">
                    <SelectValue placeholder="Choisir un témoignage" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTestimonials.map((testimonial) => (
                      <SelectItem key={testimonial._id} value={testimonial._id}>
                        {testimonial.name} - {testimonial.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Témoignages sélectionnés</Label>
                {odooData.testimonials.map((testimonialId, index) => {
                  const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                  return (
                    <div key={index} className="flex items-center justify-between p-2 border rounded mt-1">
                      <div>
                        <div className="font-medium">{testimonial?.name || testimonialId}</div>
                        {testimonial && (
                          <div className="text-sm text-gray-600">
                            {testimonial.role}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('testimonials', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final CTA */}
        <TabsContent value="finalCta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CTA Final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={odooData.finalCta.headline}
                  onChange={(e) => updateField('finalCta.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={odooData.finalCta.description}
                  onChange={(e) => updateField('finalCta.description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Principal - Texte</Label>
                  <Input
                    value={odooData.finalCta.ctaPrimary.text}
                    onChange={(e) => updateField('finalCta.ctaPrimary.text', e.target.value)}
                  />
                </div>
                <div>
                  <Label>CTA Principal - Icône</Label>
                  <Select
                    value={odooData.finalCta.ctaPrimary.icon}
                    onValueChange={(value) => updateField('finalCta.ctaPrimary.icon', value)}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Secondaire - Texte</Label>
                  <Input
                    value={odooData.finalCta.ctaSecondary.text}
                    onChange={(e) => updateField('finalCta.ctaSecondary.text', e.target.value)}
                  />
                </div>
                <div>
                  <Label>CTA Secondaire - Icône</Label>
                  <Select
                    value={odooData.finalCta.ctaSecondary.icon}
                    onValueChange={(value) => updateField('finalCta.ctaSecondary.icon', value)}
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
      </Tabs>
    </div>
  );
} 