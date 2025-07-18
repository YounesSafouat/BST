"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Eye, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    badge: string;
    emphasis: string;
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
    description: string;
    plans: Array<{
      name: string;
      description: string;
      price: string;
      estimation: string;
      features: string[];
      cta: string;
    }>;
  };
  partnership: {
    headline: string;
    description: string;
    subdescription: string;
    modules: string[];
    expertiseText: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  testimonials: string[];
  testimonialsSection: {
    headline: string;
    description: string;
    subdescription: string;
  };
  videoTestimonials: {
    headline: string;
    description: string;
    subdescription: string;
    videos: Array<{
      id: string;
      company: string;
      companyLogo: string;
      tagline: string;
      duration: string;
      backgroundColor: string;
      textColor: string;
    }>;
  };
  faq: {
    headline: string;
    description: string;
    subdescription: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  contact: {
    headline: string;
    description: string;
    subdescription: string;
    formTitle: string;
    formDescription: string;
    benefits: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    consultation: {
      title: string;
      description: string;
    };
    contactInfo: {
      phone: string;
      email: string;
    };
    guarantee: string;
  };
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
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    canonical: string;
  };
}

export default function OdooPageEditor() {
  const [odooData, setOdooData] = useState<OdooData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOdooData();
  }, []);

  const fetchOdooData = async () => {
    try {
      const response = await fetch('/api/content/odoo');
      if (response.ok) {
        const data = await response.json();
        setOdooData(data);
      }
    } catch (error) {
      console.error('Error fetching Odoo data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données Odoo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveOdooData = async () => {
    if (!odooData) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/content/odoo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(odooData),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Données Odoo sauvegardées avec succès",
        });
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving Odoo data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    if (!odooData) return;

    const keys = path.split('.');
    const newData = { ...odooData };
    let current: any = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setOdooData(newData);
  };

  const addArrayItem = (path: string, item: any) => {
    if (!odooData) return;

    const keys = path.split('.');
    const newData = { ...odooData };
    let current: any = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current.push(item);
    setOdooData(newData);
  };

  const removeArrayItem = (path: string, index: number) => {
    if (!odooData) return;

    const keys = path.split('.');
    const newData = { ...odooData };
    let current: any = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current.splice(index, 1);
    setOdooData(newData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!odooData) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Impossible de charger les données Odoo</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Éditeur Page Odoo</h1>
          <p className="text-gray-600">Modifiez le contenu de votre page Odoo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/odoo', '_blank')}>
            <Eye className="w-4 h-4 mr-2" />
            Voir la page
          </Button>
          <Button onClick={saveOdooData} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="platform">Plateforme</TabsTrigger>
          <TabsTrigger value="pricing">Tarifs</TabsTrigger>
          <TabsTrigger value="partnership">Agence</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div>
                <Label>Description</Label>
                <Textarea
                  value={odooData.hero.description}
                  onChange={(e) => updateField('hero.description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Badge</Label>
                <Input
                  value={odooData.hero.badge}
                  onChange={(e) => updateField('hero.badge', e.target.value)}
                />
              </div>
              <div>
                <Label>URL de la vidéo</Label>
                <Input
                  value={odooData.hero.videoUrl}
                  onChange={(e) => updateField('hero.videoUrl', e.target.value)}
                />
              </div>

              <Separator />

              <div>
                <Label>Bouton principal - Texte</Label>
                <Input
                  value={odooData.hero.ctaPrimary.text}
                  onChange={(e) => updateField('hero.ctaPrimary.text', e.target.value)}
                />
              </div>
              <div>
                <Label>Bouton secondaire - Texte</Label>
                <Input
                  value={odooData.hero.ctaSecondary.text}
                  onChange={(e) => updateField('hero.ctaSecondary.text', e.target.value)}
                />
              </div>
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
                <Label>Titre de la section</Label>
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
                  rows={2}
                />
              </div>

              <Separator />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Applications/Modules</Label>
                  <Button
                    size="sm"
                    onClick={() => addArrayItem('platformSection.apps', {
                      icon: '/icones/odoo/placeholder.svg',
                      title: 'Nouveau module',
                      description: 'Description du nouveau module',
                      features: ['Fonctionnalité 1', 'Fonctionnalité 2']
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>

                <div className="space-y-4">
                  {odooData.platformSection.apps.map((app, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Icône</Label>
                            <Input
                              value={app.icon}
                              onChange={(e) => {
                                const newApps = [...odooData.platformSection.apps];
                                newApps[index].icon = e.target.value;
                                updateField('platformSection.apps', newApps);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Titre</Label>
                            <Input
                              value={app.title}
                              onChange={(e) => {
                                const newApps = [...odooData.platformSection.apps];
                                newApps[index].title = e.target.value;
                                updateField('platformSection.apps', newApps);
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Description</Label>
                          <Textarea
                            value={app.description}
                            onChange={(e) => {
                              const newApps = [...odooData.platformSection.apps];
                              newApps[index].description = e.target.value;
                              updateField('platformSection.apps', newApps);
                            }}
                            rows={2}
                          />
                        </div>
                        <div className="mt-4">
                          <Label>Fonctionnalités (une par ligne)</Label>
                          <Textarea
                            value={app.features.join('\n')}
                            onChange={(e) => {
                              const newApps = [...odooData.platformSection.apps];
                              newApps[index].features = e.target.value.split('\n').filter(f => f.trim());
                              updateField('platformSection.apps', newApps);
                            }}
                            rows={3}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => removeArrayItem('platformSection.apps', index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Section */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Tarifs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la section</Label>
                <Input
                  value={odooData.pricing.headline}
                  onChange={(e) => updateField('pricing.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={odooData.pricing.subheadline}
                  onChange={(e) => updateField('pricing.subheadline', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={odooData.pricing.description}
                  onChange={(e) => updateField('pricing.description', e.target.value)}
                  rows={2}
                />
              </div>

              <Separator />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Plans tarifaires</Label>
                  <Button
                    size="sm"
                    onClick={() => addArrayItem('pricing.plans', {
                      name: 'Nouveau plan',
                      description: 'Description du plan',
                      price: 'Prix',
                      estimation: 'Estimation',
                      features: ['Fonctionnalité 1', 'Fonctionnalité 2'],
                      cta: 'Bouton'
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un plan
                  </Button>
                </div>

                <div className="space-y-4">
                  {odooData.pricing.plans.map((plan, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nom du plan</Label>
                            <Input
                              value={plan.name}
                              onChange={(e) => {
                                const newPlans = [...odooData.pricing.plans];
                                newPlans[index].name = e.target.value;
                                updateField('pricing.plans', newPlans);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Prix</Label>
                            <Input
                              value={plan.price}
                              onChange={(e) => {
                                const newPlans = [...odooData.pricing.plans];
                                newPlans[index].price = e.target.value;
                                updateField('pricing.plans', newPlans);
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Description</Label>
                          <Textarea
                            value={plan.description}
                            onChange={(e) => {
                              const newPlans = [...odooData.pricing.plans];
                              newPlans[index].description = e.target.value;
                              updateField('pricing.plans', newPlans);
                            }}
                            rows={2}
                          />
                        </div>
                        <div className="mt-4">
                          <Label>Estimation</Label>
                          <Input
                            value={plan.estimation}
                            onChange={(e) => {
                              const newPlans = [...odooData.pricing.plans];
                              newPlans[index].estimation = e.target.value;
                              updateField('pricing.plans', newPlans);
                            }}
                          />
                        </div>
                        <div className="mt-4">
                          <Label>Fonctionnalités (une par ligne)</Label>
                          <Textarea
                            value={plan.features.join('\n')}
                            onChange={(e) => {
                              const newPlans = [...odooData.pricing.plans];
                              newPlans[index].features = e.target.value.split('\n').filter(f => f.trim());
                              updateField('pricing.plans', newPlans);
                            }}
                            rows={3}
                          />
                        </div>
                        <div className="mt-4">
                          <Label>Texte du bouton</Label>
                          <Input
                            value={plan.cta}
                            onChange={(e) => {
                              const newPlans = [...odooData.pricing.plans];
                              newPlans[index].cta = e.target.value;
                              updateField('pricing.plans', newPlans);
                            }}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => removeArrayItem('pricing.plans', index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partnership Section */}
        <TabsContent value="partnership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Notre Agence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la section</Label>
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
                  rows={2}
                />
              </div>
              <div>
                <Label>Sous-description</Label>
                <Textarea
                  value={odooData.partnership.subdescription}
                  onChange={(e) => updateField('partnership.subdescription', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Section */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la section</Label>
                <Input
                  value={odooData.faq.headline}
                  onChange={(e) => updateField('faq.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={odooData.faq.description}
                  onChange={(e) => updateField('faq.description', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-description</Label>
                <Textarea
                  value={odooData.faq.subdescription}
                  onChange={(e) => updateField('faq.subdescription', e.target.value)}
                  rows={2}
                />
              </div>

              <Separator />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Questions fréquentes</Label>
                  <Button
                    size="sm"
                    onClick={() => addArrayItem('faq.items', {
                      question: 'Nouvelle question',
                      answer: 'Nouvelle réponse'
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une question
                  </Button>
                </div>

                <div className="space-y-4">
                  {odooData.faq.items.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="mb-4">
                          <Label>Question</Label>
                          <Input
                            value={item.question}
                            onChange={(e) => {
                              const newItems = [...odooData.faq.items];
                              newItems[index].question = e.target.value;
                              updateField('faq.items', newItems);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Réponse</Label>
                          <Textarea
                            value={item.answer}
                            onChange={(e) => {
                              const newItems = [...odooData.faq.items];
                              newItems[index].answer = e.target.value;
                              updateField('faq.items', newItems);
                            }}
                            rows={3}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => removeArrayItem('faq.items', index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la section</Label>
                <Input
                  value={odooData.contact.headline}
                  onChange={(e) => updateField('contact.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={odooData.contact.description}
                  onChange={(e) => updateField('contact.description', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-description</Label>
                <Textarea
                  value={odooData.contact.subdescription}
                  onChange={(e) => updateField('contact.subdescription', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label>Titre du formulaire</Label>
                <Input
                  value={odooData.contact.formTitle}
                  onChange={(e) => updateField('contact.formTitle', e.target.value)}
                />
              </div>
              <div>
                <Label>Description du formulaire</Label>
                <Textarea
                  value={odooData.contact.formDescription}
                  onChange={(e) => updateField('contact.formDescription', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label>Garantie</Label>
                <Input
                  value={odooData.contact.guarantee}
                  onChange={(e) => updateField('contact.guarantee', e.target.value)}
                />
              </div>

              <Separator />

              <div>
                <Label>Téléphone</Label>
                <Input
                  value={odooData.contact.contactInfo.phone}
                  onChange={(e) => updateField('contact.contactInfo.phone', e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={odooData.contact.contactInfo.email}
                  onChange={(e) => updateField('contact.contactInfo.email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Témoignages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la section</Label>
                <Input
                  value={odooData.testimonialsSection.headline}
                  onChange={(e) => updateField('testimonialsSection.headline', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={odooData.testimonialsSection.description}
                  onChange={(e) => updateField('testimonialsSection.description', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-description</Label>
                <Textarea
                  value={odooData.testimonialsSection.subdescription}
                  onChange={(e) => updateField('testimonialsSection.subdescription', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Section */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la page</Label>
                <Input
                  value={odooData.metadata.title}
                  onChange={(e) => updateField('metadata.title', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={odooData.metadata.description}
                  onChange={(e) => updateField('metadata.description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Mots-clés (séparés par des virgules)</Label>
                <Textarea
                  value={odooData.metadata.keywords.join(', ')}
                  onChange={(e) => updateField('metadata.keywords', e.target.value.split(',').map(k => k.trim()))}
                  rows={3}
                />
              </div>
              <div>
                <Label>Titre Open Graph</Label>
                <Input
                  value={odooData.metadata.ogTitle}
                  onChange={(e) => updateField('metadata.ogTitle', e.target.value)}
                />
              </div>
              <div>
                <Label>Description Open Graph</Label>
                <Textarea
                  value={odooData.metadata.ogDescription}
                  onChange={(e) => updateField('metadata.ogDescription', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label>URL canonique</Label>
                <Input
                  value={odooData.metadata.canonical}
                  onChange={(e) => updateField('metadata.canonical', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 