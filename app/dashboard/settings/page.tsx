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

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

const emptySettings: SiteSettings = {
  general: {
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    language: "fr",
    timezone: "Africa/Casablanca",
    maintenanceMode: false,
  },
  business: {
    companyName: "",
    siret: "",
    tva: "",
    workingHours: "",
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

const emptyContactInfo: ContactInfo = {
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  social: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(emptyContactInfo);
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

      // Load main settings
      const response = await fetch('/api/content?type=settings');
      let mergedSettings = { ...emptySettings };

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          const dbSettings = data[0].content;
          mergedSettings = {
            general: { ...emptySettings.general, ...dbSettings.general },
            business: { ...emptySettings.business, ...dbSettings.business },
            notifications: { ...emptySettings.notifications, ...dbSettings.notifications },
            security: { ...emptySettings.security, ...dbSettings.security },
          };
        }
      }

      // Load contact info separately
      try {
        const contactResponse = await fetch('/api/content?type=contact-info');
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          if (contactData.length > 0 && contactData[0].content) {
            const contactInfo = contactData[0].content;
            setContactInfo({
              phone: contactInfo.phone || "",
              email: contactInfo.email || "",
              address: contactInfo.address || "",
              city: contactInfo.city || "",
              country: contactInfo.country || "",
              postalCode: contactInfo.postalCode || "",
              social: {
                facebook: contactInfo.social?.facebook || "",
                twitter: contactInfo.social?.twitter || "",
                linkedin: contactInfo.social?.linkedin || "",
                instagram: contactInfo.social?.instagram || "",
                youtube: contactInfo.social?.youtube || "",
              },
            });
          }
        }
      } catch (contactError) {
        console.error('Error loading contact info:', contactError);
      }

      setSettings(mergedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
      setSettings(emptySettings);
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

      // First, try to get existing settings
      const getResponse = await fetch('/api/content?type=settings');
      let settingsId = null;

      if (getResponse.ok) {
        const settingsData = await getResponse.json();
        if (settingsData.length > 0) {
          settingsId = settingsData[0]._id;
        }
      }

      // Save main settings
      let response;
      if (settingsId) {
        // Update existing settings
        response = await fetch(`/api/content/${settingsId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'settings',
            title: 'Paramètres du site',
            description: 'Configuration générale du site',
            content: settings
          }),
        });
      } else {
        // Create new settings
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
        // Save contact information to dedicated contact-info object
        try {
          await updateContactInfo();
        } catch (error) {
          console.error('Contact info update failed:', error);
        }

        // Update structured data
        try {
          await updateStructuredData();
        } catch (error) {
          console.error('Structured data update failed:', error);
        }

        toast({
          title: "Succès",
          description: "Paramètres sauvegardés avec succès",
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

  const updateContactInfo = async () => {
    try {
      // Get existing contact-info content
      const contactInfoResponse = await fetch('/api/content?type=contact-info');
      let contactInfoId = null;

      if (contactInfoResponse.ok) {
        const contactInfoData = await contactInfoResponse.json();
        if (contactInfoData.length > 0) {
          contactInfoId = contactInfoData[0]._id;
        }
      }

      let response;
      if (contactInfoId) {
        // Update existing contact info
        response = await fetch(`/api/content/${contactInfoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact-info',
            title: 'Informations de contact',
            description: 'Informations de contact centralisées du site',
            content: contactInfo
          })
        });
      } else {
        // Create new contact info
        response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact-info',
            title: 'Informations de contact',
            description: 'Informations de contact centralisées du site',
            content: contactInfo
          })
        });
      }

      if (!response.ok) {
        console.error('Failed to save contact info:', await response.text());
        throw new Error('Contact info save failed');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  };

  const updateStructuredData = async () => {
    try {
      // Fetch contact info from centralized object
      const contactInfoResponse = await fetch('/api/content?type=contact-info');
      let contactInfo: any = null;

      if (contactInfoResponse.ok) {
        const contactInfoData = await contactInfoResponse.json();
        if (contactInfoData.length > 0) {
          contactInfo = contactInfoData[0].content;
        }
      }

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
          "addressLocality": contactInfo?.city || "Casablanca",
          "addressCountry": "MA",
          "addressRegion": contactInfo?.country || "Maroc"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": contactInfo?.phone || "+212 693 99 34 19",
          "contactType": "customer service",
          "email": contactInfo?.email || "contact@blackswantechnology.ma"
        },
        "sameAs": [
          contactInfo?.social?.linkedin,
          contactInfo?.social?.facebook,
          contactInfo?.social?.twitter
        ].filter(Boolean)
      };

      // Get existing structured data
      const structuredResponse = await fetch('/api/content?type=structured-data');
      if (structuredResponse.ok) {
        const structuredDataResponse = await structuredResponse.json();
        if (structuredDataResponse.length > 0) {
          const existingStructured = structuredDataResponse[0];
          const updatedStructured = {
            ...existingStructured,
            content: structuredData
          };

          const updateResponse = await fetch(`/api/content/${existingStructured._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStructured)
          });

          if (!updateResponse.ok) {
            console.error('Failed to update structured data:', await updateResponse.text());
            throw new Error('Structured data update failed');
          }
        } else {
          // Create new structured data
          const createResponse = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'structured-data',
              title: 'Structured Data',
              description: 'SEO structured data for the website',
              content: structuredData
            })
          });

          if (!createResponse.ok) {
            console.error('Failed to create structured data:', await createResponse.text());
            throw new Error('Structured data creation failed');
          }
        }
      }
    } catch (error) {
      console.error('Error updating structured data:', error);
      throw error;
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

  const updateContactInfoField = (field: keyof ContactInfo | 'social.facebook' | 'social.twitter' | 'social.linkedin' | 'social.instagram' | 'social.youtube', value: string) => {
    if (field.startsWith('social.')) {
      const socialField = field.split('.')[1] as keyof ContactInfo['social'];
      setContactInfo(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setContactInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
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

    // TVA validation removed - TVA is not an email format

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
              setSettings(emptySettings);
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
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
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
              <div>
                <Label>Téléphone</Label>
                <Input
                  value={contactInfo.phone}
                  onChange={(e) => updateContactInfoField('phone', e.target.value)}
                  placeholder="+212 693 99 34 19"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={contactInfo.email}
                  onChange={(e) => updateContactInfoField('email', e.target.value)}
                  placeholder="contact@blackswantechnology.ma"
                />
              </div>
              <div>
                <Label>Adresse</Label>
                <Textarea
                  value={contactInfo.address}
                  onChange={(e) => updateContactInfoField('address', e.target.value)}
                  placeholder="Twin Center"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ville</Label>
                  <Input
                    value={contactInfo.city}
                    onChange={(e) => updateContactInfoField('city', e.target.value)}
                    placeholder="Casablanca"
                  />
                </div>
                <div>
                  <Label>Pays</Label>
                  <Input
                    value={contactInfo.country}
                    onChange={(e) => updateContactInfoField('country', e.target.value)}
                    placeholder="Maroc"
                  />
                </div>
              </div>
              <div>
                <Label>Code postal</Label>
                <Input
                  value={contactInfo.postalCode}
                  onChange={(e) => updateContactInfoField('postalCode', e.target.value)}
                  placeholder="20000"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Settings */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Informations Sociales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Facebook</Label>
                <Input
                  value={contactInfo.social.facebook}
                  onChange={(e) => updateContactInfoField('social.facebook', e.target.value)}
                  placeholder="https://facebook.com/blackswantechnology"
                />
              </div>
              <div>
                <Label>Twitter</Label>
                <Input
                  value={contactInfo.social.twitter}
                  onChange={(e) => updateContactInfoField('social.twitter', e.target.value)}
                  placeholder="https://twitter.com/blackswantech"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={contactInfo.social.linkedin}
                  onChange={(e) => updateContactInfoField('social.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/blackswantechnology"
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={contactInfo.social.instagram}
                  onChange={(e) => updateContactInfoField('social.instagram', e.target.value)}
                  placeholder="https://instagram.com/blackswantechnology"
                />
              </div>
              <div>
                <Label>YouTube</Label>
                <Input
                  value={contactInfo.social.youtube}
                  onChange={(e) => updateContactInfoField('social.youtube', e.target.value)}
                  placeholder="https://youtube.com/@blackswantechnology"
                />
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