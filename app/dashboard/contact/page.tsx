"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Save } from 'lucide-react';
import { availableIcons } from '@/lib/iconList';
import Loader from '@/components/home/Loader';
import { ContactContent, ContactHero, ContactStep, ContactField, ContactCard } from '@/app/types/content';

export default function ContactDashboard() {
  const [contactData, setContactData] = useState<ContactContent>({
    hero: {
      headline: "Parlons de Votre Projet",
      highlight: "Projet",
      description: "Chaque transformation commence par une conversation. Partagez-nous vos défis et objectifs pour que nous puissions vous proposer la solution parfaite."
    },
    steps: [
      {
        label: "Informations de Contact",
        description: "Commençons par faire connaissance. Veuillez renseigner vos informations de base pour que nous puissions vous contacter.",
        fields: [
          { type: "text", name: "firstName", label: "Prénom", required: true },
          { type: "text", name: "lastName", label: "Nom", required: true },
          { type: "email", name: "email", label: "Email professionnel", required: true },
          { type: "tel", name: "phone", label: "Téléphone", required: true },
          { type: "text", name: "company", label: "Entreprise", required: true },
          { type: "text", name: "position", label: "Poste", required: true },
          { type: "url", name: "website", label: "Site web de l'entreprise", required: false }
        ]
      }
    ],
    cards: [
      {
        icon: "Phone",
        title: "Appelez-nous",
        description: "Parlons directement de votre projet",
        contact: "+212 6 00 00 00 00",
        subDescription: "Lun-Ven: 9h-18h"
      },
      {
        icon: "Mail",
        title: "Écrivez-nous",
        description: "Réponse sous 2h en moyenne",
        contact: "contact@blackswantechnology.ma",
        subDescription: "Support 24/7"
      },
      {
        icon: "MapPin",
        title: "Visitez-nous",
        description: "Rencontrons-nous en personne",
        contact: "Casablanca, Maroc",
        subDescription: "Twin Center"
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/content?type=contact-page');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          // The API returns the data with a content field, extract it
          const contactPageData = data[0];
          if (contactPageData.content) {
            setContactData(contactPageData.content);
          } else {
            // Fallback: if content field doesn't exist, use the data directly
            setContactData(contactPageData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContactData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/686e898f66bab2d583e8d937', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Contact',
          description: 'Page de contact dynamique avec étapes et cartes de contact',
          content: contactData,
          isActive: true
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Données sauvegardées avec succès",
        });
        // Refresh the data after saving
        await fetchContactData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateHeroField = (field: keyof ContactHero, value: string) => {
    setContactData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const addStep = () => {
    setContactData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        label: '',
        description: '',
        fields: []
      }]
    }));
  };

  const removeStep = (index: number) => {
    setContactData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, field: keyof ContactStep, value: any) => {
    setContactData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const addField = (stepIndex: number) => {
    setContactData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          fields: [...step.fields, {
            type: 'text',
            name: '',
            label: '',
            required: false
          }]
        } : step
      )
    }));
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    setContactData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          fields: step.fields.filter((_, j) => j !== fieldIndex)
        } : step
      )
    }));
  };

  const updateField = (stepIndex: number, fieldIndex: number, field: keyof ContactField, value: any) => {
    setContactData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          fields: step.fields.map((f, j) => 
            j === fieldIndex ? { ...f, [field]: value } : f
          )
        } : step
      )
    }));
  };

  const addCard = () => {
    setContactData(prev => ({
      ...prev,
      cards: [...prev.cards, {
        icon: 'Phone',
        title: '',
        description: '',
        contact: '',
        subDescription: ''
      }]
    }));
  };

  const removeCard = (index: number) => {
    setContactData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const updateCard = (index: number, field: keyof ContactCard, value: string) => {
    setContactData(prev => ({
      ...prev,
      cards: prev.cards.map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page Contact</h1>
          <p className="text-gray-600 mt-2">Gérez le contenu de votre page Contact</p>
        </div>
        <Button onClick={saveContactData} disabled={saving} className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="steps">Étapes</TabsTrigger>
          <TabsTrigger value="cards">Cartes</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-headline">Titre principal</Label>
                <Input
                  id="hero-headline"
                  value={contactData.hero.headline}
                  onChange={(e) => updateHeroField('headline', e.target.value)}
                  placeholder="Parlons de Votre Projet"
                />
              </div>
              <div>
                <Label htmlFor="hero-highlight">Mise en évidence</Label>
                <Input
                  id="hero-highlight"
                  value={contactData.hero.highlight}
                  onChange={(e) => updateHeroField('highlight', e.target.value)}
                  placeholder="Projet"
                />
              </div>
              <div>
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={contactData.hero.description}
                  onChange={(e) => updateHeroField('description', e.target.value)}
                  placeholder="Chaque transformation commence par une conversation..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Steps Section */}
        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Étapes du formulaire
                <Button onClick={addStep} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une étape
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactData.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Étape {stepIndex + 1}</h4>
                    <Button
                      onClick={() => removeStep(stepIndex)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`step-label-${stepIndex}`}>Label</Label>
                      <Input
                        id={`step-label-${stepIndex}`}
                        value={step.label}
                        onChange={(e) => updateStep(stepIndex, 'label', e.target.value)}
                        placeholder="Informations de Contact"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`step-description-${stepIndex}`}>Description</Label>
                      <Textarea
                        id={`step-description-${stepIndex}`}
                        value={step.description}
                        onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                        placeholder="Description de l'étape..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Champs</h5>
                      <Button onClick={() => addField(stepIndex)} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un champ
                      </Button>
                    </div>
                    
                    {step.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="p-3 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h6 className="font-medium">Champ {fieldIndex + 1}</h6>
                          <Button
                            onClick={() => removeField(stepIndex, fieldIndex)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`field-type-${stepIndex}-${fieldIndex}`}>Type</Label>
                            <Select 
                              value={field.type} 
                              onValueChange={(value) => updateField(stepIndex, fieldIndex, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Texte</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="tel">Téléphone</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="textarea">Zone de texte</SelectItem>
                                <SelectItem value="select">Sélection</SelectItem>
                                <SelectItem value="radio">Boutons radio</SelectItem>
                                <SelectItem value="checkbox-group">Cases à cocher</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`field-name-${stepIndex}-${fieldIndex}`}>Nom du champ</Label>
                            <Input
                              id={`field-name-${stepIndex}-${fieldIndex}`}
                              value={field.name}
                              onChange={(e) => updateField(stepIndex, fieldIndex, 'name', e.target.value)}
                              placeholder="firstName"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`field-label-${stepIndex}-${fieldIndex}`}>Label</Label>
                            <Input
                              id={`field-label-${stepIndex}-${fieldIndex}`}
                              value={field.label}
                              onChange={(e) => updateField(stepIndex, fieldIndex, 'label', e.target.value)}
                              placeholder="Prénom"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`field-required-${stepIndex}-${fieldIndex}`}
                              checked={field.required}
                              onChange={(e) => updateField(stepIndex, fieldIndex, 'required', e.target.checked)}
                              className="rounded"
                              aria-label="Champ requis"
                            />
                            <Label htmlFor={`field-required-${stepIndex}-${fieldIndex}`}>Requis</Label>
                          </div>
                        </div>

                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox-group') && (
                          <div>
                            <Label htmlFor={`field-options-${stepIndex}-${fieldIndex}`}>Options (une par ligne)</Label>
                            <Textarea
                              id={`field-options-${stepIndex}-${fieldIndex}`}
                              value={field.options?.join('\n') || ''}
                              onChange={(e) => updateField(stepIndex, fieldIndex, 'options', e.target.value.split('\n').filter(opt => opt.trim()))}
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              rows={3}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Section */}
        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cartes de contact
                <Button onClick={addCard} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une carte
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactData.cards.map((card, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Carte {index + 1}</h4>
                    <Button
                      onClick={() => removeCard(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`card-icon-${index}`}>Icône</Label>
                      <Select value={card.icon} onValueChange={(value) => updateCard(index, 'icon', value)}>
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
                      <Label htmlFor={`card-title-${index}`}>Titre</Label>
                      <Input
                        id={`card-title-${index}`}
                        value={card.title}
                        onChange={(e) => updateCard(index, 'title', e.target.value)}
                        placeholder="Appelez-nous"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`card-description-${index}`}>Description</Label>
                      <Input
                        id={`card-description-${index}`}
                        value={card.description}
                        onChange={(e) => updateCard(index, 'description', e.target.value)}
                        placeholder="Parlons directement de votre projet"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`card-contact-${index}`}>Contact</Label>
                      <Input
                        id={`card-contact-${index}`}
                        value={card.contact}
                        onChange={(e) => updateCard(index, 'contact', e.target.value)}
                        placeholder="+212 6 00 00 00 00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`card-subdescription-${index}`}>Sous-description</Label>
                    <Input
                      id={`card-subdescription-${index}`}
                      value={card.subDescription}
                      onChange={(e) => updateCard(index, 'subDescription', e.target.value)}
                      placeholder="Lun-Ven: 9h-18h"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 