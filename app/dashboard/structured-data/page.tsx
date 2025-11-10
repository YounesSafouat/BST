"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
     Save,
     RefreshCw,
     Building,
     MapPin,
     Phone,
     Globe,
     Settings,
     Eye
} from 'lucide-react';
import Loader from '@/components/home/Loader';
import ImageUpload from '@/components/dashboard/ImageUpload';

interface StructuredDataForm {
     businessName: string;
     alternateNames: string[];
     description: string;
     foundingDate: string;
     websiteUrl: string;
     logo: string;
     businessImage: string;
     address: {
          streetAddress: string;
          addressLocality: string;
          addressRegion: string;
          postalCode: string;
          addressCountry: string;
     };
     geo: {
          latitude: number;
          longitude: number;
     };
     telephone: string;
     email: string;
     businessHours: {
          [key: string]: {
               isOpen: boolean;
               opens: string;
               closes: string;
          };
     };
     contactPoints: Array<{
          telephone: string;
          contactType: string;
          areaServed: string;
          availableLanguage: string[];
          hoursAvailable: {
               dayOfWeek: string[];
               opens: string;
               closes: string;
          };
     }>;
     socialMedia: {
          linkedin: string;
          facebook: string;
          twitter: string;
          instagram: string;
     };
     serviceAreas: Array<{
          type: string;
          name: string;
     }>;
     services: Array<{
          name: string;
          description: string;
          category: string;
     }>;
     priceRange: string;
     paymentAccepted: string[];
     currenciesAccepted: string[];
     knowsAbout: string[];
     schemaType: string;
     pageConfigurations: {
          [key: string]: {
               enabled: boolean;
               schemaType: string;
          };
     };
     googleBusinessProfile: {
          verificationCode: string;
          isVerified: boolean;
          businessCategory: string;
          attributes: string[];
     };
}

const daysOfWeek = [
     { key: 'monday', label: 'Lundi' },
     { key: 'tuesday', label: 'Mardi' },
     { key: 'wednesday', label: 'Mercredi' },
     { key: 'thursday', label: 'Jeudi' },
     { key: 'friday', label: 'Vendredi' },
     { key: 'saturday', label: 'Samedi' },
     { key: 'sunday', label: 'Dimanche' }
];

const contactTypes = [
     'customer service',
     'sales',
     'technical support',
     'billing support'
];

const schemaTypes = ['LocalBusiness', 'Organization', 'Service'];
const priceRanges = ['€', '€€', '€€€', '€€€€'];

export default function StructuredDataDashboard() {
     const { data: session, status } = useSession();
     const router = useRouter();
     const { toast } = useToast();

     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [formData, setFormData] = useState<StructuredDataForm>({
          businessName: 'BlackSwan Technology',
          alternateNames: ['BlackSwan Tech', 'Agence BlackSwan'],
          description: '',
          foundingDate: '2022',
          websiteUrl: 'https://agence-blackswan.com',
          logo: 'https://agence-blackswan.com/BSTLogo.svg',
          businessImage: '',
          address: {
               streetAddress: '',
               addressLocality: 'Casablanca',
               addressRegion: 'Casablanca-Settat',
               postalCode: '',
               addressCountry: 'MA'
          },
          geo: {
               latitude: 33.5731,
               longitude: -7.5898
          },
          telephone: '',
          email: '',
          businessHours: {
               monday: { isOpen: true, opens: '09:00', closes: '18:00' },
               tuesday: { isOpen: true, opens: '09:00', closes: '18:00' },
               wednesday: { isOpen: true, opens: '09:00', closes: '18:00' },
               thursday: { isOpen: true, opens: '09:00', closes: '18:00' },
               friday: { isOpen: true, opens: '09:00', closes: '18:00' },
               saturday: { isOpen: false, opens: '09:00', closes: '18:00' },
               sunday: { isOpen: false, opens: '09:00', closes: '18:00' }
          },
          contactPoints: [
               {
                    telephone: '',
                    contactType: 'customer service',
                    areaServed: 'MA',
                    availableLanguage: ['French', 'Arabic', 'English'],
                    hoursAvailable: {
                         dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                         opens: '09:00',
                         closes: '18:00'
                    }
               }
          ],
          socialMedia: {
               linkedin: '',
               facebook: '',
               twitter: '',
               instagram: ''
          },
          serviceAreas: [
               { type: 'Country', name: 'Morocco' },
               { type: 'City', name: 'Casablanca' }
          ],
          services: [
               {
                    name: 'Implémentation Odoo ERP',
                    description: 'Implémentation complète de solutions Odoo ERP pour entreprises marocaines',
                    category: 'ERP'
               },
               {
                    name: 'Intégration HubSpot CRM',
                    description: 'Intégration et optimisation HubSpot CRM pour maximiser vos ventes',
                    category: 'CRM'
               }
          ],
          priceRange: '€€',
          paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
          currenciesAccepted: ['EUR', 'MAD'],
          knowsAbout: [
               'Odoo ERP',
               'HubSpot CRM',
               'Transformation digitale',
               'Automatisation des processus',
               'Intégration de systèmes',
               'Formation utilisateurs'
          ],
          schemaType: 'LocalBusiness',
          pageConfigurations: {
               home: { enabled: true, schemaType: 'LocalBusiness' },
               about: { enabled: true, schemaType: 'Organization' },
               contact: { enabled: true, schemaType: 'LocalBusiness' },
               hubspot: { enabled: true, schemaType: 'Service' },
               odoo: { enabled: true, schemaType: 'Service' }
          },
          googleBusinessProfile: {
               verificationCode: '',
               isVerified: false,
               businessCategory: 'Digital Agency',
               attributes: []
          }
     });

     useEffect(() => {
          if (status === 'loading') return;
          if (!session) {
               router.push('/auth/signin');
               return;
          }
          fetchStructuredData();
     }, [session, status]);

     const fetchStructuredData = async () => {
          try {
               setLoading(true);
               const response = await fetch('/api/structured-data');
               if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
               } else {
                    console.error('Failed to fetch data:', response.status);
               }
          } catch (error) {
               console.error('Error fetching structured data:', error);
               toast({
                    title: "Erreur",
                    description: "Impossible de charger les données structurées",
                    variant: "destructive"
               });
          } finally {
               setLoading(false);
          }
     };

     const handleInputChange = (field: string, value: any) => {
          setFormData(prev => ({
               ...prev,
               [field]: value
          }));
     };

     const handleAddressChange = (field: string, value: string) => {
          setFormData(prev => ({
               ...prev,
               address: {
                    ...prev.address,
                    [field]: value
               }
          }));
     };

     const handleGeoChange = (field: string, value: number) => {
          setFormData(prev => ({
               ...prev,
               geo: {
                    ...prev.geo,
                    [field]: value
               }
          }));
     };

     const handleBusinessHoursChange = (day: string, field: string, value: any) => {
          setFormData(prev => ({
               ...prev,
               businessHours: {
                    ...prev.businessHours,
                    [day]: {
                         ...prev.businessHours[day],
                         [field]: value
                    }
               }
          }));
     };

     const handleContactPointChange = (index: number, field: string, value: any) => {
          setFormData(prev => ({
               ...prev,
               contactPoints: prev.contactPoints.map((cp, i) =>
                    i === index ? { ...cp, [field]: value } : cp
               )
          }));
     };

     const addContactPoint = () => {
          setFormData(prev => ({
               ...prev,
               contactPoints: [
                    ...prev.contactPoints,
                    {
                         telephone: '',
                         contactType: 'customer service',
                         areaServed: 'MA',
                         availableLanguage: ['French'],
                         hoursAvailable: {
                              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                              opens: '09:00',
                              closes: '18:00'
                         }
                    }
               ]
          }));
     };

     const removeContactPoint = (index: number) => {
          setFormData(prev => ({
               ...prev,
               contactPoints: prev.contactPoints.filter((_, i) => i !== index)
          }));
     };

     const addServiceArea = () => {
          setFormData(prev => ({
               ...prev,
               serviceAreas: [
                    ...prev.serviceAreas,
                    { type: 'City', name: '' }
               ]
          }));
     };

     const removeServiceArea = (index: number) => {
          setFormData(prev => ({
               ...prev,
               serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
          }));
     };

     const handleServiceAreaChange = (index: number, field: string, value: string) => {
          setFormData(prev => ({
               ...prev,
               serviceAreas: prev.serviceAreas.map((sa, i) =>
                    i === index ? { ...sa, [field]: value } : sa
               )
          }));
     };

     const addService = () => {
          setFormData(prev => ({
               ...prev,
               services: [
                    ...prev.services,
                    { name: '', description: '', category: '' }
               ]
          }));
     };

     const removeService = (index: number) => {
          setFormData(prev => ({
               ...prev,
               services: prev.services.filter((_, i) => i !== index)
          }));
     };

     const handleServiceChange = (index: number, field: string, value: string) => {
          setFormData(prev => ({
               ...prev,
               services: prev.services.map((service, i) =>
                    i === index ? { ...service, [field]: value } : service
               )
          }));
     };

     const addKnowsAbout = () => {
          setFormData(prev => ({
               ...prev,
               knowsAbout: [...prev.knowsAbout, '']
          }));
     };

     const removeKnowsAbout = (index: number) => {
          setFormData(prev => ({
               ...prev,
               knowsAbout: prev.knowsAbout.filter((_, i) => i !== index)
          }));
     };

     const handleKnowsAboutChange = (index: number, value: string) => {
          setFormData(prev => ({
               ...prev,
               knowsAbout: prev.knowsAbout.map((item, i) =>
                    i === index ? value : item
               )
          }));
     };

     const handleSave = async () => {
          try {
               setSaving(true);

               // Validate required fields
               const requiredFields = ['businessName', 'description', 'websiteUrl', 'logo', 'telephone', 'email'];
               const missingFields = requiredFields.filter(field => !formData[field as keyof StructuredDataForm] ||
                    (typeof formData[field as keyof StructuredDataForm] === 'string' &&
                         (formData[field as keyof StructuredDataForm] as string).trim() === ''));

               if (missingFields.length > 0) {
                    toast({
                         title: "Champs requis manquants",
                         description: `Veuillez remplir: ${missingFields.join(', ')}`,
                         variant: "destructive"
                    });
                    return;
               }

               // Validate address fields
               const requiredAddressFields = ['streetAddress', 'postalCode'];
               const missingAddressFields = requiredAddressFields.filter(field =>
                    !formData.address[field as keyof typeof formData.address] ||
                    formData.address[field as keyof typeof formData.address].trim() === '');

               if (missingAddressFields.length > 0) {
                    toast({
                         title: "Adresse incomplète",
                         description: `Veuillez remplir: ${missingAddressFields.join(', ')}`,
                         variant: "destructive"
                    });
                    return;
               }

               console.log('Submitting data:', formData);

               const response = await fetch('/api/structured-data', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
               });

               if (response.ok) {
                    const result = await response.json();
                    console.log('Save successful:', result);
                    toast({
                         title: "Succès",
                         description: "Données structurées sauvegardées avec succès"
                    });
               } else {
                    const errorData = await response.json();
                    console.error('Save failed:', errorData);
                    throw new Error(errorData.error || 'Failed to save');
               }
          } catch (error) {
               console.error('Save error:', error);
               toast({
                    title: "Erreur",
                    description: error instanceof Error ? error.message : "Impossible de sauvegarder les données",
                    variant: "destructive"
               });
          } finally {
               setSaving(false);
          }
     };

     if (loading) return <Loader />;

     return (
          <div className="container mx-auto p-6 space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">Données Structurées & SEO</h1>
                         <p className="text-muted-foreground">
                              Gérez vos données structurées pour améliorer votre visibilité Google et obtenir le Knowledge Panel
                         </p>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={fetchStructuredData}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Actualiser
                         </Button>
                         <Button onClick={handleSave} disabled={saving}>
                              <Save className="w-4 h-4 mr-2" />
                              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                         </Button>
                    </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations de base */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Building className="w-5 h-5" />
                                   Informations de base
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div>
                                   <Label htmlFor="businessName">Nom de l'entreprise *</Label>
                                   <Input
                                        id="businessName"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        placeholder="BlackSwan Technology"
                                   />
                              </div>

                              <div>
                                   <Label>Noms alternatifs</Label>
                                   {formData.alternateNames.map((name, index) => (
                                        <div key={index} className="flex gap-2 mt-2">
                                             <Input
                                                  value={name}
                                                  onChange={(e) => {
                                                       const newNames = [...formData.alternateNames];
                                                       newNames[index] = e.target.value;
                                                       handleInputChange('alternateNames', newNames);
                                                  }}
                                                  placeholder="Nom alternatif"
                                             />
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => {
                                                       const newNames = formData.alternateNames.filter((_, i) => i !== index);
                                                       handleInputChange('alternateNames', newNames);
                                                  }}
                                             >
                                                  Supprimer
                                             </Button>
                                        </div>
                                   ))}
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleInputChange('alternateNames', [...formData.alternateNames, ''])}
                                        className="mt-2"
                                   >
                                        Ajouter un nom
                                   </Button>
                              </div>

                              <div>
                                   <Label htmlFor="description">Description *</Label>
                                   <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Description de votre entreprise..."
                                        rows={3}
                                   />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <Label htmlFor="foundingDate">Date de création</Label>
                                        <Input
                                             id="foundingDate"
                                             value={formData.foundingDate}
                                             onChange={(e) => handleInputChange('foundingDate', e.target.value)}
                                             placeholder="2022"
                                        />
                                   </div>
                                   <div>
                                        <Label htmlFor="websiteUrl">URL du site *</Label>
                                        <Input
                                             id="websiteUrl"
                                             value={formData.websiteUrl}
                                             onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                                             placeholder="https://agence-blackswan.com"
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <ImageUpload
                                             value={formData.logo}
                                             onChange={(url) => handleInputChange('logo', url)}
                                             label="Logo *"
                                             placeholder="URL du logo ou télécharger"
                                        />
                                   </div>
                                   <div>
                                        <ImageUpload
                                             value={formData.businessImage || ''}
                                             onChange={(url) => handleInputChange('businessImage', url)}
                                             label="Image de l'entreprise"
                                             placeholder="URL de l'image ou télécharger"
                                        />
                                   </div>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Adresse et coordonnées */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <MapPin className="w-5 h-5" />
                                   Adresse et localisation
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div>
                                   <Label htmlFor="streetAddress">Adresse *</Label>
                                   <Input
                                        id="streetAddress"
                                        value={formData.address.streetAddress}
                                        onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                                        placeholder="123 Boulevard Mohammed V"
                                   />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <Label htmlFor="addressLocality">Ville *</Label>
                                        <Input
                                             id="addressLocality"
                                             value={formData.address.addressLocality}
                                             onChange={(e) => handleAddressChange('addressLocality', e.target.value)}
                                             placeholder="Casablanca"
                                        />
                                   </div>
                                   <div>
                                        <Label htmlFor="addressRegion">Région *</Label>
                                        <Input
                                             id="addressRegion"
                                             value={formData.address.addressRegion}
                                             onChange={(e) => handleAddressChange('addressRegion', e.target.value)}
                                             placeholder="Casablanca-Settat"
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <Label htmlFor="postalCode">Code postal *</Label>
                                        <Input
                                             id="postalCode"
                                             value={formData.address.postalCode}
                                             onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                                             placeholder="20000"
                                        />
                                   </div>
                                   <div>
                                        <Label htmlFor="addressCountry">Pays *</Label>
                                        <Input
                                             id="addressCountry"
                                             value={formData.address.addressCountry}
                                             onChange={(e) => handleAddressChange('addressCountry', e.target.value)}
                                             placeholder="MA"
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <Label htmlFor="latitude">Latitude *</Label>
                                        <Input
                                             id="latitude"
                                             type="number"
                                             step="0.0001"
                                             value={formData.geo.latitude}
                                             onChange={(e) => handleGeoChange('latitude', parseFloat(e.target.value))}
                                             placeholder="33.5731"
                                        />
                                   </div>
                                   <div>
                                        <Label htmlFor="longitude">Longitude *</Label>
                                        <Input
                                             id="longitude"
                                             type="number"
                                             step="0.0001"
                                             value={formData.geo.longitude}
                                             onChange={(e) => handleGeoChange('longitude', parseFloat(e.target.value))}
                                             placeholder="-7.5898"
                                        />
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact et horaires */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Phone className="w-5 h-5" />
                                   Contact et horaires
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <Label htmlFor="telephone">Téléphone *</Label>
                                        <Input
                                             id="telephone"
                                             value={formData.telephone}
                                             onChange={(e) => handleInputChange('telephone', e.target.value)}
                                             placeholder="+212-522-XXX-XXX"
                                        />
                                   </div>
                                   <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                             id="email"
                                             value={formData.email}
                                             onChange={(e) => handleInputChange('email', e.target.value)}
                                             placeholder="contact@blackswantechnology.fr"
                                        />
                                   </div>
                              </div>

                              <div>
                                   <Label>Horaires d'ouverture</Label>
                                   <div className="space-y-2 mt-2">
                                        {daysOfWeek.map((day) => (
                                             <div key={day.key} className="flex items-center gap-4">
                                                  <div className="flex items-center gap-2">
                                                       <Switch
                                                            checked={formData.businessHours[day.key].isOpen}
                                                            onCheckedChange={(checked) =>
                                                                 handleBusinessHoursChange(day.key, 'isOpen', checked)
                                                            }
                                                       />
                                                       <span className="w-16 text-sm">{day.label}</span>
                                                  </div>
                                                  {formData.businessHours[day.key].isOpen && (
                                                       <>
                                                            <Input
                                                                 type="time"
                                                                 value={formData.businessHours[day.key].opens}
                                                                 onChange={(e) =>
                                                                      handleBusinessHoursChange(day.key, 'opens', e.target.value)
                                                                 }
                                                                 className="w-24"
                                                            />
                                                            <span className="text-sm">à</span>
                                                            <Input
                                                                 type="time"
                                                                 value={formData.businessHours[day.key].closes}
                                                                 onChange={(e) =>
                                                                      handleBusinessHoursChange(day.key, 'closes', e.target.value)
                                                                 }
                                                                 className="w-24"
                                                            />
                                                       </>
                                                  )}
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <Label>Points de contact</Label>
                                   <div className="space-y-4 mt-2">
                                        {formData.contactPoints.map((contactPoint, index) => (
                                             <div key={index} className="border p-4 rounded-lg">
                                                  <div className="flex justify-between items-center mb-2">
                                                       <span className="font-medium">Point de contact {index + 1}</span>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeContactPoint(index)}
                                                       >
                                                            Supprimer
                                                       </Button>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-4">
                                                       <div>
                                                            <Label>Téléphone</Label>
                                                            <Input
                                                                 value={contactPoint.telephone}
                                                                 onChange={(e) => handleContactPointChange(index, 'telephone', e.target.value)}
                                                                 placeholder="+212-522-XXX-XXX"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Type de contact</Label>
                                                            <Select
                                                                 value={contactPoint.contactType}
                                                                 onValueChange={(value) => handleContactPointChange(index, 'contactType', value)}
                                                            >
                                                                 <SelectTrigger>
                                                                      <SelectValue />
                                                                 </SelectTrigger>
                                                                 <SelectContent>
                                                                      {contactTypes.map((type) => (
                                                                           <SelectItem key={type} value={type}>
                                                                                {type}
                                                                           </SelectItem>
                                                                      ))}
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                                        <Button variant="outline" onClick={addContactPoint}>
                                             Ajouter un point de contact
                                        </Button>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Réseaux sociaux et services */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Globe className="w-5 h-5" />
                                   Réseaux sociaux et services
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div>
                                   <Label>Réseaux sociaux</Label>
                                   <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                             <Label htmlFor="linkedin">LinkedIn</Label>
                                             <Input
                                                  id="linkedin"
                                                  value={formData.socialMedia.linkedin}
                                                  onChange={(e) => handleInputChange('socialMedia', {
                                                       ...formData.socialMedia,
                                                       linkedin: e.target.value
                                                  })}
                                                  placeholder="https://linkedin.com/company/..."
                                             />
                                        </div>
                                        <div>
                                             <Label htmlFor="facebook">Facebook</Label>
                                             <Input
                                                  id="facebook"
                                                  value={formData.socialMedia.facebook}
                                                  onChange={(e) => handleInputChange('socialMedia', {
                                                       ...formData.socialMedia,
                                                       facebook: e.target.value
                                                  })}
                                                  placeholder="https://facebook.com/..."
                                             />
                                        </div>
                                        <div>
                                             <Label htmlFor="twitter">Twitter</Label>
                                             <Input
                                                  id="twitter"
                                                  value={formData.socialMedia.twitter}
                                                  onChange={(e) => handleInputChange('socialMedia', {
                                                       ...formData.socialMedia,
                                                       twitter: e.target.value
                                                  })}
                                                  placeholder="https://twitter.com/..."
                                             />
                                        </div>
                                        <div>
                                             <Label htmlFor="instagram">Instagram</Label>
                                             <Input
                                                  id="instagram"
                                                  value={formData.socialMedia.instagram}
                                                  onChange={(e) => handleInputChange('socialMedia', {
                                                       ...formData.socialMedia,
                                                       instagram: e.target.value
                                                  })}
                                                  placeholder="https://instagram.com/..."
                                             />
                                        </div>
                                   </div>
                              </div>

                              <div>
                                   <Label>Zones de service</Label>
                                   <div className="space-y-2 mt-2">
                                        {formData.serviceAreas.map((area, index) => (
                                             <div key={index} className="flex gap-2">
                                                  <Select
                                                       value={area.type}
                                                       onValueChange={(value) => handleServiceAreaChange(index, 'type', value)}
                                                  >
                                                       <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            <SelectItem value="Country">Pays</SelectItem>
                                                            <SelectItem value="City">Ville</SelectItem>
                                                            <SelectItem value="Region">Région</SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                                  <Input
                                                       value={area.name}
                                                       onChange={(e) => handleServiceAreaChange(index, 'name', e.target.value)}
                                                       placeholder="Nom de la zone"
                                                       className="flex-1"
                                                  />
                                                  <Button
                                                       variant="outline"
                                                       size="sm"
                                                       onClick={() => removeServiceArea(index)}
                                                  >
                                                       Supprimer
                                                  </Button>
                                             </div>
                                        ))}
                                        <Button variant="outline" onClick={addServiceArea}>
                                             Ajouter une zone
                                        </Button>
                                   </div>
                              </div>

                              <div>
                                   <Label>Services offerts</Label>
                                   <div className="space-y-2 mt-2">
                                        {formData.services.map((service, index) => (
                                             <div key={index} className="border p-3 rounded-lg">
                                                  <div className="flex justify-between items-center mb-2">
                                                       <span className="font-medium">Service {index + 1}</span>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeService(index)}
                                                       >
                                                            Supprimer
                                                       </Button>
                                                  </div>
                                                  <div className="space-y-2">
                                                       <Input
                                                            value={service.name}
                                                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                                            placeholder="Nom du service"
                                                       />
                                                       <Textarea
                                                            value={service.description}
                                                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                                            placeholder="Description du service"
                                                            rows={2}
                                                       />
                                                       <Input
                                                            value={service.category}
                                                            onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                                                            placeholder="Catégorie (ex: ERP, CRM)"
                                                       />
                                                  </div>
                                             </div>
                                        ))}
                                        <Button variant="outline" onClick={addService}>
                                             Ajouter un service
                                        </Button>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
               </div>

               {/* Configuration des pages et Google Business Profile */}
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <Settings className="w-5 h-5" />
                              Configuration des pages et Google Business Profile
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div>
                              <Label>Configuration des pages</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                   {Object.entries(formData.pageConfigurations).map(([page, config]) => (
                                        <div key={page} className="border p-4 rounded-lg">
                                             <div className="flex items-center gap-2 mb-2">
                                                  <Switch
                                                       checked={config.enabled}
                                                       onCheckedChange={(checked) =>
                                                            handleInputChange('pageConfigurations', {
                                                                 ...formData.pageConfigurations,
                                                                 [page]: { ...config, enabled: checked }
                                                            })
                                                       }
                                                  />
                                                  <span className="font-medium capitalize">{page}</span>
                                             </div>
                                             {config.enabled && (
                                                  <Select
                                                       value={config.schemaType}
                                                       onValueChange={(value) =>
                                                            handleInputChange('pageConfigurations', {
                                                                 ...formData.pageConfigurations,
                                                                 [page]: { ...config, schemaType: value }
                                                            })
                                                       }
                                                  >
                                                       <SelectTrigger>
                                                            <SelectValue />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            {schemaTypes.map((type) => (
                                                                 <SelectItem key={type} value={type}>
                                                                      {type}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div>
                              <Label>Google Business Profile</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                   <div>
                                        <Label htmlFor="verificationCode">Code de vérification</Label>
                                        <Input
                                             id="verificationCode"
                                             value={formData.googleBusinessProfile.verificationCode}
                                             onChange={(e) => handleInputChange('googleBusinessProfile', {
                                                  ...formData.googleBusinessProfile,
                                                  verificationCode: e.target.value
                                             })}
                                             placeholder="Code de vérification Google"
                                        />
                                   </div>
                                   <div>
                                        <Label htmlFor="businessCategory">Catégorie d'entreprise</Label>
                                        <Input
                                             id="businessCategory"
                                             value={formData.googleBusinessProfile.businessCategory}
                                             onChange={(e) => handleInputChange('googleBusinessProfile', {
                                                  ...formData.googleBusinessProfile,
                                                  businessCategory: e.target.value
                                             })}
                                             placeholder="Digital Agency"
                                        />
                                   </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                   <Switch
                                        checked={formData.googleBusinessProfile.isVerified}
                                        onCheckedChange={(checked) =>
                                             handleInputChange('googleBusinessProfile', {
                                                  ...formData.googleBusinessProfile,
                                                  isVerified: checked
                                             })
                                        }
                                   />
                                   <Label>Profil Google Business vérifié</Label>
                              </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                   <Label htmlFor="priceRange">Fourchette de prix</Label>
                                   <Select
                                        value={formData.priceRange}
                                        onValueChange={(value) => handleInputChange('priceRange', value)}
                                   >
                                        <SelectTrigger>
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {priceRanges.map((range) => (
                                                  <SelectItem key={range} value={range}>
                                                       {range}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div>
                                   <Label htmlFor="schemaType">Type de schéma principal</Label>
                                   <Select
                                        value={formData.schemaType}
                                        onValueChange={(value) => handleInputChange('schemaType', value)}
                                   >
                                        <SelectTrigger>
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {schemaTypes.map((type) => (
                                                  <SelectItem key={type} value={type}>
                                                       {type}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div>
                                   <Label>Expertise</Label>
                                   <div className="space-y-2 mt-2">
                                        {formData.knowsAbout.map((item, index) => (
                                             <div key={index} className="flex gap-2">
                                                  <Input
                                                       value={item}
                                                       onChange={(e) => handleKnowsAboutChange(index, e.target.value)}
                                                       placeholder="Domaine d'expertise"
                                                  />
                                                  <Button
                                                       variant="outline"
                                                       size="sm"
                                                       onClick={() => removeKnowsAbout(index)}
                                                  >
                                                       Supprimer
                                                  </Button>
                                             </div>
                                        ))}
                                        <Button variant="outline" onClick={addKnowsAbout}>
                                             Ajouter une expertise
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </CardContent>
               </Card>

               {/* Aperçu des données structurées */}
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <Eye className="w-5 h-5" />
                              Aperçu des données structurées
                         </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="bg-gray-100 p-4 rounded-lg">
                              <pre className="text-xs overflow-x-auto">
                                   {JSON.stringify(formData, null, 2)}
                              </pre>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
