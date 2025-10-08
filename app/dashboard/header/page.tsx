"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Save, Loader2, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";

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
                    { name: 'Solutions', href: '#modules', type: 'section', order: 1 },
                    { name: 'Tarifs', href: '#pricing', type: 'section', order: 2 },
                    { name: 'Blog', href: '/blog', type: 'page', order: 3 },
                    { name: 'Notre Agence', href: '#team', type: 'section', order: 4 },
                    { name: 'Témoignages', href: '#testimonials', type: 'section', order: 5 },
                    { name: 'Contact', href: '#contact', type: 'section', order: 6 }
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
                         <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">
                                   💡 <strong>Prochaine fonctionnalité:</strong> Menu méga avec sous-menus pour une navigation plus riche.
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
