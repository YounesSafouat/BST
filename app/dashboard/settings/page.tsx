"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Save, Globe, Mail, Phone, MapPin, Share2, Shield, Palette, Database, Bell, Users, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import Loader from '@/components/home/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    language: string;
    timezone: string;
    maintenanceMode: boolean;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  business: {
    companyName: string;
    siret: string;
    tva: string;
    workingHours: string;
    timezone: string;
  };
  notifications: {
    emailNotifications: boolean;
    adminNotifications: boolean;
    contactFormNotifications: boolean;
    newsletterNotifications: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: string;
  };
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: "BST - Business Solutions & Technology",
    siteDescription: "Solutions d'entreprise innovantes avec Odoo et HubSpot",
    siteUrl: "https://bst.ma",
    language: "fr",
    timezone: "Africa/Casablanca",
    maintenanceMode: false,
  },
  contact: {
    email: "contact@bst.ma",
    phone: "+212 5 22 22 22 22",
    address: "123 Avenue Mohammed V",
    city: "Casablanca",
    country: "Maroc",
    postalCode: "20000",
  },
  social: {
    facebook: "https://facebook.com/bst.ma",
    twitter: "https://twitter.com/bst_ma",
    linkedin: "https://linkedin.com/company/bst-ma",
    instagram: "https://instagram.com/bst.ma",
    youtube: "https://youtube.com/@bst.ma",
  },
  business: {
    companyName: "BST - Business Solutions & Technology",
    siret: "12345678901234",
    tva: "MA123456789",
    workingHours: "Lun-Ven: 9h-18h",
    timezone: "Africa/Casablanca",
  },
  notifications: {
    emailNotifications: true,
    adminNotifications: true,
    contactFormNotifications: true,
    newsletterNotifications: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: "strong",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [pendingMaintenanceMode, setPendingMaintenanceMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=settings');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          // Merge with default settings to ensure all fields are present
          const mergedSettings = {
            general: { ...defaultSettings.general, ...data[0].content.general },
            contact: { ...defaultSettings.contact, ...data[0].content.contact },
            social: { ...defaultSettings.social, ...data[0].content.social },
            business: { ...defaultSettings.business, ...data[0].content.business },
            notifications: { ...defaultSettings.notifications, ...data[0].content.notifications },
            security: { ...defaultSettings.security, ...data[0].content.security },
          };
          setSettings(mergedSettings);
        } else {
          // No settings found, use defaults
          setSettings(defaultSettings);
        }
      } else {
        // If API fails, use default settings
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
      // Use default settings on error
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    // Validate settings before saving
    if (!validateSettings(settings)) {
      return;
    }

    try {
      setSaving(true);
      
      // Save main settings
      let response = await fetch('/api/content?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'settings',
          title: 'Paramètres du site',
          description: 'Configuration générale du site',
          content: settings
        }),
      });

      // If no existing settings found, create new ones
      if (response.status === 404) {
        response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'settings',
            title: 'Paramètres du site',
            description: 'Configuration générale du site',
            content: settings
          }),
        });
      }

      if (response.ok) {
        // Update header content with contact information
        await updateHeaderContent();
        
        // Update contact page content
        await updateContactPageContent();
        
        // Update structured data
        await updateStructuredData();
        
        // Update social media links
        await updateSocialMediaLinks();
        
        toast({
          title: "Succès",
          description: "Paramètres sauvegardés et site mis à jour",
        });
        setHasChanges(false);
        
        // If maintenance mode was toggled, show additional info
        if (settings.general.maintenanceMode) {
          toast({
            title: "Mode maintenance activé",
            description: "Le site est maintenant en maintenance. Tous les visiteurs seront redirigés.",
            variant: "destructive",
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateHeaderContent = async () => {
    try {
      // Get existing header content
      const headerResponse = await fetch('/api/content?type=header');
      if (headerResponse.ok) {
        const headerData = await headerResponse.json();
        if (headerData.length > 0) {
          const existingHeader = headerData[0];
          const updatedHeader = {
            ...existingHeader,
            content: {
              ...existingHeader.content,
              contact: {
                phone: settings.contact.phone,
                email: settings.contact.email,
                address: settings.contact.address
              }
            }
          };
          
          await fetch(`/api/content/${existingHeader._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedHeader)
          });
        }
      }
    } catch (error) {
      console.error('Error updating header content:', error);
    }
  };

  const updateContactPageContent = async () => {
    try {
      // Get existing contact page content
      const contactResponse = await fetch('/api/content?type=contact');
      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        if (contactData.length > 0) {
          const existingContact = contactData[0];
          const updatedContact = {
            ...existingContact,
            content: {
              ...existingContact.content,
              contactForm: {
                ...existingContact.content.contactForm,
                fields: {
                  ...existingContact.content.contactForm.fields,
                  phone: {
                    ...existingContact.content.contactForm.fields.phone,
                    placeholder: settings.contact.phone
                  },
                  email: {
                    ...existingContact.content.contactForm.fields.email,
                    placeholder: settings.contact.email
                  }
                }
              }
            }
          };
          
          await fetch(`/api/content/${existingContact._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact)
          });
        }
      }
    } catch (error) {
      console.error('Error updating contact page content:', error);
    }
  };

  const updateStructuredData = async () => {
    try {
      // Update structured data with new contact information
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": settings.general.siteName,
        "url": settings.general.siteUrl,
        "logo": `${settings.general.siteUrl}/bst.png`,
        "description": settings.general.siteDescription,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": settings.contact.city,
          "addressCountry": "MA",
          "addressRegion": settings.contact.country
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": settings.contact.phone,
          "contactType": "customer service",
          "email": settings.contact.email
        },
        "sameAs": [
          settings.social.linkedin,
          settings.social.facebook,
          settings.social.twitter
        ].filter(Boolean)
      };
      
      // Save structured data to a content entry
      await fetch('/api/content?type=structured-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'structured-data',
          title: 'Structured Data',
          description: 'SEO structured data for the website',
          content: structuredData
        }),
      });
    } catch (error) {
      console.error('Error updating structured data:', error);
    }
  };

  const updateSocialMediaLinks = async () => {
    try {
      // Update footer or any other content that contains social media links
      const footerResponse = await fetch('/api/content?type=footer');
      if (footerResponse.ok) {
        const footerData = await footerResponse.json();
        if (footerData.length > 0) {
          const existingFooter = footerData[0];
          const updatedFooter = {
            ...existingFooter,
            content: {
              ...existingFooter.content,
              social: {
                facebook: settings.social.facebook,
                twitter: settings.social.twitter,
                linkedin: settings.social.linkedin,
                instagram: settings.social.instagram,
                youtube: settings.social.youtube
              }
            }
          };
          
          await fetch(`/api/content/${existingFooter._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFooter)
          });
        }
      }
    } catch (error) {
      console.error('Error updating social media links:', error);
    }
  };

  const updateSetting = (section: keyof SiteSettings, field: string, value: any) => {
    // Special handling for maintenance mode
    if (section === 'general' && field === 'maintenanceMode' && value === true) {
      setPendingMaintenanceMode(true);
      setShowMaintenanceDialog(true);
      return;
    }

    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const confirmMaintenanceMode = () => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        maintenanceMode: true
      }
    }));
    setHasChanges(true);
    setShowMaintenanceDialog(false);
    setPendingMaintenanceMode(false);
    
    toast({
      title: "Mode maintenance activé",
      description: "Tous les visiteurs seront redirigés vers la page de maintenance",
      variant: "destructive",
    });
  };

  const cancelMaintenanceMode = () => {
    setShowMaintenanceDialog(false);
    setPendingMaintenanceMode(false);
  };

  const validateSettings = (settings: SiteSettings): boolean => {
    // Basic validation
    if (!settings.general.siteName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du site est requis",
        variant: "destructive",
      });
      return false;
    }

    if (!settings.general.siteUrl.trim()) {
      toast({
        title: "Erreur de validation",
        description: "L'URL du site est requise",
        variant: "destructive",
      });
      return false;
    }

    if (settings.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contact.email)) {
      toast({
        title: "Erreur de validation",
        description: "L'adresse email n'est pas valide",
        variant: "destructive",
      });
      return false;
    }

    if (settings.security.sessionTimeout < 5 || settings.security.sessionTimeout > 480) {
      toast({
        title: "Erreur de validation",
        description: "Le timeout de session doit être entre 5 et 480 minutes",
        variant: "destructive",
      });
      return false;
    }

    if (settings.security.maxLoginAttempts < 3 || settings.security.maxLoginAttempts > 10) {
      toast({
        title: "Erreur de validation",
        description: "Le nombre max de tentatives doit être entre 3 et 10",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configurez les paramètres généraux de votre site</p>
          {settings.general.maintenanceMode && (
            <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600 font-medium">
                Mode maintenance actif - Le site est actuellement en maintenance
              </span>
              <Badge variant="destructive" className="ml-auto">
                ACTIF
              </Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Modifications non sauvegardées
            </Badge>
          )}
          <Button 
            variant="outline"
            onClick={() => {
              setSettings(defaultSettings);
              setHasChanges(true);
            }}
            disabled={saving}
            className="border-gray-300 hover:bg-gray-50"
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={saving || !hasChanges}
            className="bg-[--color-black] hover:bg-primary-dark text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Réseaux</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Entreprise</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres Généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nom du site</Label>
                  <Input
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    placeholder="Nom de votre site"
                  />
                </div>
                <div>
                  <Label>URL du site</Label>
                  <Input
                    value={settings.general.siteUrl}
                    onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                    placeholder="https://votre-site.com"
                  />
                </div>
              </div>
              <div>
                <Label>Description du site</Label>
                <Textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  placeholder="Description de votre site"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Langue</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSetting('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuseau horaire</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">Casablanca (UTC+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (UTC+1/+2)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="maintenance-mode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                  <div>
                    <Label htmlFor="maintenance-mode" className="text-base font-medium">Mode maintenance</Label>
                    <p className="text-sm text-gray-600">
                      Activez cette option pour rediriger tous les visiteurs vers une page de maintenance
                    </p>
                  </div>
                </div>
                {settings.general.maintenanceMode && (
                  <div className="flex flex-col gap-2">
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Site en maintenance
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/maintenance', '_blank')}
                      className="text-xs"
                    >
                      Voir la page de maintenance
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informations de Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.contact.email}
                    onChange={(e) => updateSetting('contact', 'email', e.target.value)}
                    placeholder="contact@votre-site.com"
                    type="email"
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={settings.contact.phone}
                    onChange={(e) => updateSetting('contact', 'phone', e.target.value)}
                    placeholder="+212 5 22 22 22 22"
                  />
                </div>
              </div>
              <div>
                <Label>Adresse</Label>
                <Input
                  value={settings.contact.address}
                  onChange={(e) => updateSetting('contact', 'address', e.target.value)}
                  placeholder="123 Avenue Mohammed V"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Ville</Label>
                  <Input
                    value={settings.contact.city}
                    onChange={(e) => updateSetting('contact', 'city', e.target.value)}
                    placeholder="Casablanca"
                  />
                </div>
                <div>
                  <Label>Pays</Label>
                  <Input
                    value={settings.contact.country}
                    onChange={(e) => updateSetting('contact', 'country', e.target.value)}
                    placeholder="Maroc"
                  />
                </div>
                <div>
                  <Label>Code postal</Label>
                  <Input
                    value={settings.contact.postalCode}
                    onChange={(e) => updateSetting('contact', 'postalCode', e.target.value)}
                    placeholder="20000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Réseaux Sociaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={settings.social.facebook}
                    onChange={(e) => updateSetting('social', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/votre-page"
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={settings.social.twitter}
                    onChange={(e) => updateSetting('social', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/votre-compte"
                  />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={settings.social.linkedin}
                    onChange={(e) => updateSetting('social', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/votre-entreprise"
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={settings.social.instagram}
                    onChange={(e) => updateSetting('social', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/votre-compte"
                  />
                </div>
                <div>
                  <Label>YouTube</Label>
                  <Input
                    value={settings.social.youtube}
                    onChange={(e) => updateSetting('social', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/@votre-chaine"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Informations Entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nom de l'entreprise</Label>
                <Input
                  value={settings.business.companyName}
                  onChange={(e) => updateSetting('business', 'companyName', e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Numéro SIRET</Label>
                  <Input
                    value={settings.business.siret}
                    onChange={(e) => updateSetting('business', 'siret', e.target.value)}
                    placeholder="12345678901234"
                  />
                </div>
                <div>
                  <Label>Numéro TVA</Label>
                  <Input
                    value={settings.business.tva}
                    onChange={(e) => updateSetting('business', 'tva', e.target.value)}
                    placeholder="MA123456789"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Heures d'ouverture</Label>
                  <Input
                    value={settings.business.workingHours}
                    onChange={(e) => updateSetting('business', 'workingHours', e.target.value)}
                    placeholder="Lun-Ven: 9h-18h"
                  />
                </div>
                <div>
                  <Label>Fuseau horaire</Label>
                  <Select
                    value={settings.business.timezone}
                    onValueChange={(value) => updateSetting('business', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">Casablanca (UTC+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (UTC+1/+2)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notifications par email</Label>
                    <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notifications administrateur</Label>
                    <p className="text-sm text-gray-500">Notifications pour les administrateurs</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'adminNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notifications formulaire de contact</Label>
                    <p className="text-sm text-gray-500">Notifications pour les nouveaux messages</p>
                  </div>
                  <Switch
                    checked={settings.notifications.contactFormNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'contactFormNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notifications newsletter</Label>
                    <p className="text-sm text-gray-500">Notifications pour les inscriptions newsletter</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newsletterNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'newsletterNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Authentification à deux facteurs</Label>
                  <p className="text-sm text-gray-500">Sécuriser les connexions avec 2FA</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Timeout de session (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
                <div>
                  <Label>Nombre max de tentatives de connexion</Label>
                  <Input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
              <div>
                <Label>Politique de mot de passe</Label>
                <Select
                  value={settings.security.passwordPolicy}
                  onValueChange={(value) => updateSetting('security', 'passwordPolicy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Faible (6 caractères)</SelectItem>
                    <SelectItem value="medium">Moyen (8 caractères, lettres + chiffres)</SelectItem>
                    <SelectItem value="strong">Fort (10 caractères, lettres + chiffres + symboles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Maintenance Mode Confirmation Dialog */}
      <AlertDialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Activer le mode maintenance ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va rediriger tous les visiteurs vers une page de maintenance. 
              Seuls les administrateurs pourront accéder au site normalement.
              <br /><br />
              Êtes-vous sûr de vouloir activer le mode maintenance ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMaintenanceMode}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmMaintenanceMode}
              className="bg-red-600 hover:bg-red-700"
            >
              Activer le mode maintenance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 