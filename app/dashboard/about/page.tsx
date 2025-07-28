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

interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    stats: Array<{
      title: string;
      icon: string;
    }>;
  };
  team: {
    title: string;
    description: string;
    members: Array<{
      name: string;
      role: string;
      description: string;
      icon: string;
    }>;
  };
  values: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  mission: {
    title: string;
    description: string;
    cta: {
      text: string;
      url: string;
    };
  };
}

export default function AboutDashboard() {
  const [aboutData, setAboutData] = useState<AboutContent>({
    hero: {
      title: "Nous Sommes",
      subtitle: "Les Visionnaires",
      description: "qui transforment le Maroc digital",
      stats: [
        { title: "5 années d'excellence", icon: "Star" },
        { title: "100% passion marocaine", icon: "Heart" },
        { title: "Innovation continue", icon: "Rocket" }
      ]
    },
    team: {
      title: "L'Humain au Cœur",
      description: "Derrière chaque ligne de code, chaque intégration réussie, il y a des passionnés qui croient en la puissance transformatrice de la technologie.",
      members: [
        {
          name: "Ahmed Mansouri",
          role: "CEO & Fondateur",
          description: "Visionnaire de la transformation digitale au Maroc",
          icon: "Crown"
        },
        {
          name: "Salma Benali",
          role: "CTO",
          description: "Experte en architecture technique et innovation",
          icon: "Code"
        },
        {
          name: "Youssef Kadiri",
          role: "Directeur Commercial",
          description: "Spécialiste en solutions CRM et ERP",
          icon: "Target"
        },
        {
          name: "Fatima Zahra",
          role: "Lead Developer",
          description: "Passionnée de développement et d'intégration",
          icon: "Zap"
        }
      ]
    },
    values: {
      title: "Nos Valeurs Fondamentales",
      description: "Des principes qui guident chacune de nos actions et décisions.",
      items: [
        {
          title: "Excellence",
          description: "Nous visons l'excellence dans chaque projet, chaque ligne de code, chaque interaction client.",
          icon: "Star"
        },
        {
          title: "Innovation",
          description: "Nous repoussons constamment les limites de la technologie pour créer des solutions innovantes.",
          icon: "Lightbulb"
        },
        {
          title: "Collaboration",
          description: "Nous croyons en la puissance du travail d'équipe et de la collaboration avec nos clients.",
          icon: "Users"
        },
        {
          title: "Intégrité",
          description: "Nous agissons avec honnêteté, transparence et éthique dans toutes nos relations.",
          icon: "Shield"
        },
        {
          title: "Passion",
          description: "Notre passion pour la technologie et l'innovation nous pousse à toujours faire mieux.",
          icon: "Heart"
        },
        {
          title: "Impact",
          description: "Nous créons un impact positif sur les entreprises et la société marocaine.",
          icon: "Globe"
        }
      ]
    },
    mission: {
      title: "Transformer le Maroc Digital",
      description: "Notre mission est d'accompagner les entreprises marocaines dans leur transformation digitale en leur offrant des solutions innovantes, sur mesure et performantes.",
      cta: {
        text: "Découvrir Notre Mission",
        url: "/#contact"
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/content?type=about');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          setAboutData(data[0].content);
        }
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAboutData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content?type=about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'about',
          title: 'À Propos',
          description: 'Page À Propos - Notre histoire, équipe et valeurs',
          content: aboutData,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Données sauvegardées avec succès",
        });
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateHeroField = (field: keyof AboutContent['hero'], value: any) => {
    setAboutData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateTeamField = (field: keyof AboutContent['team'], value: any) => {
    setAboutData(prev => ({
      ...prev,
      team: { ...prev.team, [field]: value }
    }));
  };

  const updateValuesField = (field: keyof AboutContent['values'], value: any) => {
    setAboutData(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value }
    }));
  };

  const updateMissionField = (field: keyof AboutContent['mission'], value: any) => {
    setAboutData(prev => ({
      ...prev,
      mission: { ...prev.mission, [field]: value }
    }));
  };

  const addStat = () => {
    updateHeroField('stats', [...aboutData.hero.stats, { title: '', icon: 'Star' }]);
  };

  const removeStat = (index: number) => {
    updateHeroField('stats', aboutData.hero.stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: 'title' | 'icon', value: string) => {
    const newStats = [...aboutData.hero.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateHeroField('stats', newStats);
  };

  const addTeamMember = () => {
    updateTeamField('members', [...aboutData.team.members, {
      name: '',
      role: '',
      description: '',
      icon: 'Users'
    }]);
  };

  const removeTeamMember = (index: number) => {
    updateTeamField('members', aboutData.team.members.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: 'name' | 'role' | 'description' | 'icon', value: string) => {
    const newMembers = [...aboutData.team.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateTeamField('members', newMembers);
  };

  const addValue = () => {
    updateValuesField('items', [...aboutData.values.items, {
      title: '',
      description: '',
      icon: 'Star'
    }]);
  };

  const removeValue = (index: number) => {
    updateValuesField('items', aboutData.values.items.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
    const newItems = [...aboutData.values.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateValuesField('items', newItems);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page À Propos</h1>
          <p className="text-gray-600 mt-2">Gérez le contenu de votre page À Propos</p>
        </div>
        <Button onClick={saveAboutData} disabled={saving} className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="values">Valeurs</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Titre principal</Label>
                <Input
                  id="hero-title"
                  value={aboutData.hero.title}
                  onChange={(e) => updateHeroField('title', e.target.value)}
                  placeholder="Nous Sommes"
                />
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Sous-titre</Label>
                <Input
                  id="hero-subtitle"
                  value={aboutData.hero.subtitle}
                  onChange={(e) => updateHeroField('subtitle', e.target.value)}
                  placeholder="Les Visionnaires"
                />
              </div>
              <div>
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={aboutData.hero.description}
                  onChange={(e) => updateHeroField('description', e.target.value)}
                  placeholder="qui transforment le Maroc digital"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Statistiques
                <Button onClick={addStat} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutData.hero.stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor={`stat-title-${index}`}>Titre</Label>
                    <Input
                      id={`stat-title-${index}`}
                      value={stat.title}
                      onChange={(e) => updateStat(index, 'title', e.target.value)}
                      placeholder="5 années d'excellence"
                    />
                  </div>
                  <div className="w-48">
                    <Label htmlFor={`stat-icon-${index}`}>Icône</Label>
                    <Select value={stat.icon} onValueChange={(value) => updateStat(index, 'icon', value)}>
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
                  <Button
                    onClick={() => removeStat(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Section */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Équipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="team-title">Titre</Label>
                <Input
                  id="team-title"
                  value={aboutData.team.title}
                  onChange={(e) => updateTeamField('title', e.target.value)}
                  placeholder="L'Humain au Cœur"
                />
              </div>
              <div>
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={aboutData.team.description}
                  onChange={(e) => updateTeamField('description', e.target.value)}
                  placeholder="Description de l'équipe..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Membres de l'équipe
                <Button onClick={addTeamMember} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutData.team.members.map((member, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`member-name-${index}`}>Nom</Label>
                      <Input
                        id={`member-name-${index}`}
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        placeholder="Ahmed Mansouri"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`member-role-${index}`}>Rôle</Label>
                      <Input
                        id={`member-role-${index}`}
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        placeholder="CEO & Fondateur"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`member-description-${index}`}>Description</Label>
                    <Textarea
                      id={`member-description-${index}`}
                      value={member.description}
                      onChange={(e) => updateTeamMember(index, 'description', e.target.value)}
                      placeholder="Description du membre..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-48">
                      <Label htmlFor={`member-icon-${index}`}>Icône</Label>
                      <Select value={member.icon} onValueChange={(value) => updateTeamMember(index, 'icon', value)}>
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
                    <Button
                      onClick={() => removeTeamMember(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Section */}
        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Valeurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="values-title">Titre</Label>
                <Input
                  id="values-title"
                  value={aboutData.values.title}
                  onChange={(e) => updateValuesField('title', e.target.value)}
                  placeholder="Nos Valeurs Fondamentales"
                />
              </div>
              <div>
                <Label htmlFor="values-description">Description</Label>
                <Textarea
                  id="values-description"
                  value={aboutData.values.description}
                  onChange={(e) => updateValuesField('description', e.target.value)}
                  placeholder="Des principes qui guident chacune de nos actions..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Valeurs
                <Button onClick={addValue} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutData.values.items.map((value, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`value-title-${index}`}>Titre</Label>
                      <Input
                        id={`value-title-${index}`}
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        placeholder="Excellence"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`value-icon-${index}`}>Icône</Label>
                      <Select value={value.icon} onValueChange={(value) => updateValue(index, 'icon', value)}>
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
                  <div>
                    <Label htmlFor={`value-description-${index}`}>Description</Label>
                    <Textarea
                      id={`value-description-${index}`}
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      placeholder="Description de la valeur..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => removeValue(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Section */}
        <TabsContent value="mission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mission-title">Titre</Label>
                <Input
                  id="mission-title"
                  value={aboutData.mission.title}
                  onChange={(e) => updateMissionField('title', e.target.value)}
                  placeholder="Transformer le Maroc Digital"
                />
              </div>
              <div>
                <Label htmlFor="mission-description">Description</Label>
                <Textarea
                  id="mission-description"
                  value={aboutData.mission.description}
                  onChange={(e) => updateMissionField('description', e.target.value)}
                  placeholder="Notre mission est d'accompagner..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mission-cta-text">Texte du bouton</Label>
                  <Input
                    id="mission-cta-text"
                    value={aboutData.mission.cta.text}
                    onChange={(e) => updateMissionField('cta', { ...aboutData.mission.cta, text: e.target.value })}
                    placeholder="Découvrir Notre Mission"
                  />
                </div>
                <div>
                  <Label htmlFor="mission-cta-url">URL du bouton</Label>
                  <Input
                    id="mission-cta-url"
                    value={aboutData.mission.cta.url}
                    onChange={(e) => updateMissionField('cta', { ...aboutData.mission.cta, url: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}