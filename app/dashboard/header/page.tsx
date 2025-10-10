"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Save, Loader2, ChevronUp, ChevronDown, Plus, Trash2, Settings, Eye } from "lucide-react";

interface HeaderData {
     logo: {
          image: string;
          alt: string;
          size: string;
     };
     navigation: {
          main: Array<{
               name: string;
               href: string;
               type: 'page' | 'section';
               order: number;
               hasSubmenu?: boolean;
               submenu?: Array<{
                    name: string;
                    href: string;
                    type: 'page' | 'section';
                    order: number;
                    description?: string;
               }>;
               megaMenu?: {
                    type: 'client-cases';
                    title: string;
                    description: string;
                    featuredCases: Array<{
                         id: string;
                         name: string;
                         slug: string;
                         image: string;
                         excerpt: string;
                    }>;
                    ctaButton: {
                         text: string;
                         href: string;
                    };
               };
          }>;
     };
}

export default function HeaderDashboard() {
     const [headerData, setHeaderData] = useState<HeaderData>({
          logo: {
               image: "",
               alt: "",
               size: "10"
          },
          navigation: {
               main: [
                    { name: 'Solutions', href: '#services', type: 'section', order: 1 },
                    { name: 'Tarifs', href: '#pricing', type: 'section', order: 2 },
                    { name: 'Blog', href: '/blog', type: 'page', order: 3 },
                    { 
                         name: 'Nos clients', 
                         href: '/cas-client', 
                         type: 'page', 
                         order: 4,
                         hasSubmenu: true,
                         megaMenu: {
                              type: 'client-cases',
                              title: 'Découvrez tous nos cas d\'usage',
                              description: 'Nous aidons nos clients dans différents secteurs et sur différentes problématiques',
                              featuredCases: [
                                   {
                                        id: "case-1759942156218",
                                        name: "Fitness park",
                                        slug: "fitness-park",
                                        image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/cas-client/fitness%20park/main.webp",
                                        excerpt: "Fitness Park, acteur majeur du secteur du fitness, souhaitait mieux piloter ses performances marketing et améliorer le traitement de ses leads."
                                   },
                                   {
                                        id: "case-1759944672139",
                                        name: "Essem",
                                        slug: "essem",
                                        image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/cas-client/essem/main.webp",
                                        excerpt: "ESSEM, école supérieure reconnue, cherchait à optimiser sa prospection et le suivi de ses inscriptions. Sous l'impulsion de Salim Gueddari, l'objectif était de centraliser les échanges commerciaux, notamment via WhatsApp, tout en disposant de statistiques précises et de KPI en temps réel pour piloter les performances."
                                   }
                              ],
                              ctaButton: {
                                   text: 'Tous nos cas clients',
                                   href: '/cas-client'
                              }
                         }
                    },
                    { name: 'Notre Agence', href: '#about', type: 'section', order: 5 },
                    { name: 'Témoignages', href: '#testimonials', type: 'section', order: 6 },
                    { name: 'Contact', href: '#contact', type: 'section', order: 7 }
               ]
          }
     });
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          fetchHeaderData();
     }, []);

     // Check if we need to create initial header content
     useEffect(() => {
          if (!loading && !error) {
               // If no header content exists, create it automatically
               const createInitialHeader = async () => {
                    try {
                         const response = await fetch('/api/content/header');
                         if (response.status === 404) {
                              console.log('🚀 Creating initial header content...');
                              await saveHeader();
                         }
                    } catch (error) {
                         console.log('Could not check for initial header content:', error);
                    }
               };

               createInitialHeader();
          }
     }, [loading, error]);

     const fetchHeaderData = async () => {
          try {
               setError(null);
               console.log('🔍 Fetching header data...');
               const response = await fetch('/api/content/header');
               console.log('📡 Header API response status:', response.status);

               if (response.ok) {
                    const data = await response.json();
                    console.log('📊 Header API response data:', data);

                    if (data && data.content) {
                         console.log('✅ Found existing header content:', data.content);
                         setHeaderData(data.content);
                    } else {
                         console.log('⚠️ Header content found but no content field');
                    }
               } else if (response.status === 404) {
                    console.log('ℹ️ No header data found, using defaults');
               } else {
                    console.warn('Header data fetch failed:', response.status);
               }
          } catch (error) {
               console.error('Error fetching header data:', error);
               setError('Failed to load header data. Using default values.');
          } finally {
               setLoading(false);
          }
     };

     const saveHeader = async () => {
          setSaving(true);
          setError(null);
          try {
               console.log('💾 Saving header data...');
               const response = await fetch('/api/content/header', {
                    method: 'PUT',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         content: headerData,
                         title: 'Header Configuration',
                         description: 'Website header with logo and navigation',
                         isActive: true
                    }),
               });

               console.log('📡 Save response status:', response.status);

               if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Header saved successfully:', result);
                    toast({
                         title: "Succès",
                         description: "Header sauvegardé avec succès",
                    });
               } else {
                    const errorData = await response.json();
                    console.error('❌ Save failed:', errorData);
                    throw new Error(errorData.error || 'Failed to save');
               }
          } catch (error) {
               console.error('Error saving header:', error);
               setError('Failed to save header configuration.');
               toast({
                    title: "Erreur",
                    description: "Impossible de sauvegarder le header",
                    variant: "destructive"
               });
          } finally {
               setSaving(false);
          }
     };

     const updateNavigationItem = (index: number, field: 'name' | 'href' | 'type', value: string) => {
          try {
               const newNavigation = [...headerData.navigation.main];
               newNavigation[index] = { ...newNavigation[index], [field]: value };
               setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
          } catch (error) {
               console.error('Error updating navigation item:', error);
               setError('Failed to update navigation item.');
          }
     };

     const addNavigationItem = () => {
          try {
               const maxOrder = Math.max(...headerData.navigation.main.map(item => item.order), 0);
               const newNavigation = [...headerData.navigation.main, { 
                    name: '', 
                    href: '', 
                    type: 'section' as const,
                    order: maxOrder + 1 
               }];
               setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
          } catch (error) {
               console.error('Error adding navigation item:', error);
               setError('Failed to add navigation item.');
          }
     };

     const removeNavigationItem = (index: number) => {
          try {
               const newNavigation = headerData.navigation.main.filter((_, i) => i !== index);
               // Reorder remaining items
               const reorderedNavigation = newNavigation.map((item, idx) => ({
                    ...item,
                    order: idx + 1
               }));
               setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: reorderedNavigation } });
          } catch (error) {
               console.error('Error removing navigation item:', error);
               setError('Failed to remove navigation item.');
          }
     };

     const moveNavigationItem = (index: number, direction: 'up' | 'down') => {
          try {
               const newNavigation = [...headerData.navigation.main];
               const targetIndex = direction === 'up' ? index - 1 : index + 1;
               
               if (targetIndex < 0 || targetIndex >= newNavigation.length) return;
               
               // Swap items
               [newNavigation[index], newNavigation[targetIndex]] = [newNavigation[targetIndex], newNavigation[index]];
               
               // Update order values
               newNavigation.forEach((item, idx) => {
                    item.order = idx + 1;
               });
               
               setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
          } catch (error) {
               console.error('Error moving navigation item:', error);
               setError('Failed to move navigation item.');
          }
     };

     const toggleMegaMenu = (index: number) => {
          try {
               const newNavigation = [...headerData.navigation.main];
               const item = newNavigation[index];
               
               if (item.megaMenu) {
                    // Remove mega menu
                    delete item.megaMenu;
                    item.hasSubmenu = false;
               } else {
                    // Add mega menu
                    item.hasSubmenu = true;
                    item.megaMenu = {
                         type: 'client-cases',
                         title: 'Découvrez tous nos cas d\'usage',
                         description: 'Nous aidons nos clients dans différents secteurs et sur différentes problématiques',
                         featuredCases: [],
                         ctaButton: {
                              text: 'Tous nos cas clients',
                              href: '/cas-client'
                         }
                    };
               }
               
               setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
          } catch (error) {
               console.error('Error toggling mega menu:', error);
               setError('Failed to toggle mega menu.');
          }
     };

     const updateMegaMenuField = (index: number, field: string, value: string) => {
          try {
               const newNavigation = [...headerData.navigation.main];
               const item = newNavigation[index];
               
               if (item.megaMenu) {
                    if (field.includes('.')) {
                         const [parent, child] = field.split('.');
                         (item.megaMenu as any)[parent][child] = value;
                    } else {
                         (item.megaMenu as any)[field] = value;
                    }
                    
                    setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
               }
          } catch (error) {
               console.error('Error updating mega menu field:', error);
               setError('Failed to update mega menu field.');
          }
     };

     const addFeaturedCase = (index: number) => {
          try {
               const newNavigation = [...headerData.navigation.main];
               const item = newNavigation[index];
               
               if (item.megaMenu) {
                    const newCase = {
                         id: `case-${Date.now()}`,
                         name: 'Nouveau cas client',
                         slug: 'nouveau-cas-client',
                         image: '/placeholder.jpg',
                         excerpt: 'Description du cas client'
                    };
                    
                    item.megaMenu.featuredCases.push(newCase);
                    setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
               }
          } catch (error) {
               console.error('Error adding featured case:', error);
               setError('Failed to add featured case.');
          }
     };

     const updateFeaturedCase = (index: number, caseIndex: number, field: string, value: string) => {
          try {
               const newNavigation = [...headerData.navigation.main];
               const item = newNavigation[index];
               
               if (item.megaMenu && item.megaMenu.featuredCases[caseIndex]) {
                    (item.megaMenu.featuredCases[caseIndex] as any)[field] = value;
                    setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
               }
          } catch (error) {
               console.error('Error updating featured case:', error);
               setError('Failed to update featured case.');
          }
     };

     const removeFeaturedCase = (index: number, caseIndex: number) => {
          try {
               const newNavigation = [...headerData.navigation.main];
               const item = newNavigation[index];
               
               if (item.megaMenu) {
                    item.megaMenu.featuredCases.splice(caseIndex, 1);
                    setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
               }
          } catch (error) {
               console.error('Error removing featured case:', error);
               setError('Failed to remove featured case.');
          }
     };

     if (loading) {
          return (
               <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center space-x-2">
                         <Loader2 className="h-6 w-6 animate-spin" />
                         <span>Chargement...</span>
                    </div>
               </div>
          );
     }

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configuration du Header</h1>
                    <p className="text-gray-600 mt-2">
                         Gérez le logo et la navigation du header
                    </p>
               </div>

               {/* Error Display */}
               {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                         <p className="text-red-800 text-sm">{error}</p>
                    </div>
               )}

               {/* Logo Configuration */}
               <Card>
                    <CardHeader>
                         <CardTitle>Logo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                              <Label htmlFor="logoImage">URL de l'image du logo</Label>
                              <Input
                                   id="logoImage"
                                   value={headerData.logo.image}
                                   onChange={(e) => setHeaderData({
                                        ...headerData,
                                        logo: { ...headerData.logo, image: e.target.value }
                                   })}
                                   placeholder="https://example.com/logo.svg"
                              />
                         </div>
                         <div>
                              <Label htmlFor="logoAlt">Texte alternatif du logo</Label>
                              <Input
                                   id="logoAlt"
                                   value={headerData.logo.alt}
                                   onChange={(e) => setHeaderData({
                                        ...headerData,
                                        logo: { ...headerData.logo, alt: e.target.value }
                                   })}
                                   placeholder="Nom de l'entreprise"
                              />
                         </div>
                         <div>
                              <Label htmlFor="logoSize">Taille du logo</Label>
                              <select
                                   id="logoSize"
                                   value={headerData.logo.size}
                                   onChange={(e) => setHeaderData({
                                        ...headerData,
                                        logo: { ...headerData.logo, size: e.target.value }
                                   })}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   aria-label="Sélectionner la taille du logo"
                              >
                                   <option value="8">Petit (h-8)</option>
                                   <option value="10">Moyen (h-10)</option>
                                   <option value="12">Grand (h-12)</option>
                                   <option value="14">Très grand (h-14)</option>
                                   <option value="16">Extra large (h-16)</option>
                                   <option value="20">XXL (h-20)</option>
                                   <option value="24">XXXL (h-24)</option>
                                   <option value="32">Géant (h-32)</option>
                              </select>
                              <p className="text-sm text-gray-500 mt-1">
                                   Sélectionnez la taille du logo. h-10 est la taille par défaut.
                              </p>
                         </div>
                    </CardContent>
               </Card>

               {/* Navigation Configuration */}
               <Card>
                    <CardHeader>
                         <CardTitle>Navigation</CardTitle>
                         <p className="text-sm text-gray-600">
                              Configurez les éléments de navigation. Utilisez les flèches pour réorganiser l'ordre.
                         </p>
                         <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-800">
                                   ✨ <strong>Fonctionnalité disponible:</strong> Menu méga avec cas clients mis en avant. Activez le menu méga pour l'élément "Nos clients".
                              </p>
                         </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {headerData.navigation.main
                              .sort((a, b) => a.order - b.order)
                              .map((item, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                             <span className="text-sm font-medium text-gray-500">#{item.order}</span>
                                             <div className="flex flex-col gap-1">
                                                  <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       onClick={() => moveNavigationItem(index, 'up')}
                                                       disabled={index === 0}
                                                       className="h-6 w-6 p-0"
                                                  >
                                                       <ChevronUp className="h-4 w-4" />
                                                  </Button>
                                                  <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       onClick={() => moveNavigationItem(index, 'down')}
                                                       disabled={index === headerData.navigation.main.length - 1}
                                                       className="h-6 w-6 p-0"
                                                  >
                                                       <ChevronDown className="h-4 w-4" />
                                                  </Button>
                                             </div>
                                        </div>
                                        <div className="flex gap-2">
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => toggleMegaMenu(index)}
                                                  className={item.megaMenu ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"}
                                             >
                                                  <Settings className="h-4 w-4 mr-1" />
                                                  {item.megaMenu ? "Menu Méga Actif" : "Activer Menu Méga"}
                                             </Button>
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => removeNavigationItem(index)}
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                             >
                                                  <Trash2 className="h-4 w-4 mr-1" />
                                                  Supprimer
                                             </Button>
                                        </div>
                                   </div>
                                   
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                             <Label htmlFor={`name-${index}`}>Nom du menu</Label>
                                             <Input
                                                  id={`name-${index}`}
                                                  value={item.name}
                                                  onChange={(e) => updateNavigationItem(index, 'name', e.target.value)}
                                                  placeholder="Ex: Solutions, Blog, Contact"
                                             />
                                        </div>
                                        
                                        <div>
                                             <Label htmlFor={`type-${index}`}>Type</Label>
                                             <select
                                                  id={`type-${index}`}
                                                  value={item.type}
                                                  onChange={(e) => updateNavigationItem(index, 'type', e.target.value)}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                             >
                                                  <option value="section">Section (page actuelle)</option>
                                                  <option value="page">Page (nouvelle page)</option>
                                             </select>
                                        </div>
                                        
                                        <div>
                                             <Label htmlFor={`href-${index}`}>
                                                  {item.type === 'page' ? 'URL de la page' : 'Ancre de section'}
                                             </Label>
                                             <Input
                                                  id={`href-${index}`}
                                                  value={item.href}
                                                  onChange={(e) => updateNavigationItem(index, 'href', e.target.value)}
                                                  placeholder={item.type === 'page' ? '/blog, /about' : '#modules, #pricing'}
                                             />
                                        </div>
                                   </div>
                                   
                                   {item.type === 'page' && item.href && !item.href.startsWith('/') && (
                                        <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                             ⚠️ Les liens de pages doivent commencer par "/" (ex: /blog, /about)
                                        </div>
                                   )}
                                   
                                   {item.type === 'section' && item.href && !item.href.startsWith('#') && (
                                        <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                             ⚠️ Les liens de sections doivent commencer par "#" (ex: #modules, #pricing)
                                        </div>
                                   )}

                                   {/* Mega Menu Configuration */}
                                   {item.megaMenu && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                             <div className="flex items-center gap-2 mb-4">
                                                  <Eye className="h-5 w-5 text-green-600" />
                                                  <h4 className="font-semibold text-gray-900">Configuration du Menu Méga</h4>
                                             </div>
                                             
                                             <div className="space-y-4">
                                                  {/* Mega Menu Title & Description */}
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label htmlFor={`mega-title-${index}`}>Titre du Menu Méga</Label>
                                                            <Input
                                                                 id={`mega-title-${index}`}
                                                                 value={item.megaMenu.title}
                                                                 onChange={(e) => updateMegaMenuField(index, 'title', e.target.value)}
                                                                 placeholder="Découvrez tous nos cas d'usage"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label htmlFor={`mega-desc-${index}`}>Description</Label>
                                                            <Input
                                                                 id={`mega-desc-${index}`}
                                                                 value={item.megaMenu.description}
                                                                 onChange={(e) => updateMegaMenuField(index, 'description', e.target.value)}
                                                                 placeholder="Description du menu méga"
                                                            />
                                                       </div>
                                                  </div>

                                                  {/* CTA Button Configuration */}
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label htmlFor={`mega-cta-text-${index}`}>Texte du bouton CTA</Label>
                                                            <Input
                                                                 id={`mega-cta-text-${index}`}
                                                                 value={item.megaMenu.ctaButton.text}
                                                                 onChange={(e) => updateMegaMenuField(index, 'ctaButton.text', e.target.value)}
                                                                 placeholder="Tous nos cas clients"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label htmlFor={`mega-cta-href-${index}`}>URL du bouton CTA</Label>
                                                            <Input
                                                                 id={`mega-cta-href-${index}`}
                                                                 value={item.megaMenu.ctaButton.href}
                                                                 onChange={(e) => updateMegaMenuField(index, 'ctaButton.href', e.target.value)}
                                                                 placeholder="/cas-client"
                                                            />
                                                       </div>
                                                  </div>

                                                  {/* Featured Cases */}
                                                  <div>
                                                       <div className="flex items-center justify-between mb-3">
                                                            <Label className="text-base font-medium">Cas Clients Mis en Avant</Label>
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() => addFeaturedCase(index)}
                                                                 className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                 <Plus className="h-4 w-4 mr-1" />
                                                                 Ajouter un cas
                                                            </Button>
                                                       </div>
                                                       
                                                       {item.megaMenu.featuredCases.length > 0 ? (
                                                            <div className="space-y-3">
                                                                 {item.megaMenu.featuredCases.map((clientCase, caseIndex) => (
                                                                      <div key={caseIndex} className="p-3 bg-white rounded-lg border border-gray-200">
                                                                           <div className="flex items-center justify-between mb-3">
                                                                                <span className="text-sm font-medium text-gray-600">Cas #{caseIndex + 1}</span>
                                                                                <Button
                                                                                     variant="ghost"
                                                                                     size="sm"
                                                                                     onClick={() => removeFeaturedCase(index, caseIndex)}
                                                                                     className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                                                >
                                                                                     <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                           </div>
                                                                           
                                                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                <div>
                                                                                     <Label htmlFor={`case-name-${index}-${caseIndex}`}>Nom du cas</Label>
                                                                                     <Input
                                                                                          id={`case-name-${index}-${caseIndex}`}
                                                                                          value={clientCase.name}
                                                                                          onChange={(e) => updateFeaturedCase(index, caseIndex, 'name', e.target.value)}
                                                                                          placeholder="Nom du cas client"
                                                                                     />
                                                                                </div>
                                                                                <div>
                                                                                     <Label htmlFor={`case-slug-${index}-${caseIndex}`}>Slug (URL)</Label>
                                                                                     <Input
                                                                                          id={`case-slug-${index}-${caseIndex}`}
                                                                                          value={clientCase.slug}
                                                                                          onChange={(e) => updateFeaturedCase(index, caseIndex, 'slug', e.target.value)}
                                                                                          placeholder="slug-du-cas"
                                                                                     />
                                                                                </div>
                                                                                <div>
                                                                                     <Label htmlFor={`case-image-${index}-${caseIndex}`}>Image</Label>
                                                                                     <Input
                                                                                          id={`case-image-${index}-${caseIndex}`}
                                                                                          value={clientCase.image}
                                                                                          onChange={(e) => updateFeaturedCase(index, caseIndex, 'image', e.target.value)}
                                                                                          placeholder="/path/to/image.jpg"
                                                                                     />
                                                                                </div>
                                                                                <div>
                                                                                     <Label htmlFor={`case-excerpt-${index}-${caseIndex}`}>Description</Label>
                                                                                     <Input
                                                                                          id={`case-excerpt-${index}-${caseIndex}`}
                                                                                          value={clientCase.excerpt}
                                                                                          onChange={(e) => updateFeaturedCase(index, caseIndex, 'excerpt', e.target.value)}
                                                                                          placeholder="Description du cas client"
                                                                                     />
                                                                                </div>
                                                                           </div>
                                                                      </div>
                                                                 ))}
                                                            </div>
                                                       ) : (
                                                            <div className="text-center py-6 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                                                                 <p>Aucun cas client mis en avant</p>
                                                                 <p className="text-sm">Cliquez sur "Ajouter un cas" pour commencer</p>
                                                            </div>
                                                       )}
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         ))}
                         
                         <Button
                              variant="outline"
                              onClick={addNavigationItem}
                              className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
                         >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter un élément de navigation
                         </Button>
                    </CardContent>
               </Card>

               {/* Save Button */}
               <div className="flex justify-end">
                    <Button
                         onClick={saveHeader}
                         disabled={saving}
                         className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                         <Save className="w-4 h-4 mr-2" />
                         {saving ? "Sauvegarde..." : "Sauvegarder le Header"}
                    </Button>
               </div>
          </div>
     );
}
