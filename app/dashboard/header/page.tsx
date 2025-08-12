"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Save, Loader2 } from "lucide-react";
import Loader from '@/components/home/Loader';

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
                    { name: 'Solutions', href: '#modules' },
                    { name: 'Tarifs', href: '#pricing' },
                    { name: 'Notre Agence', href: '#team' },
                    { name: 'Témoignages', href: '#testimonials' },
                    { name: 'Contact', href: '#contact' }
               ]
          }
     });
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);

     useEffect(() => {
          fetchHeaderData();
     }, []);

     const fetchHeaderData = async () => {
          try {
               const response = await fetch('/api/content?type=header');
               if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0 && data[0].content) {
                         setHeaderData(data[0].content);
                    }
               }
          } catch (error) {
               console.error('Error fetching header data:', error);
          } finally {
               setLoading(false);
          }
     };

     const saveHeader = async () => {
          setSaving(true);
          try {
               const response = await fetch('/api/content?type=header', {
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

               if (response.ok) {
                    toast({
                         title: "Succès",
                         description: "Header sauvegardé avec succès",
                    });
               } else {
                    throw new Error('Failed to save');
               }
          } catch (error) {
               console.error('Error saving header:', error);
               toast({
                    title: "Erreur",
                    description: "Impossible de sauvegarder le header",
                    variant: "destructive"
               });
          } finally {
               setSaving(false);
          }
     };

     const updateNavigationItem = (index: number, field: 'name' | 'href', value: string) => {
          const newNavigation = [...headerData.navigation.main];
          newNavigation[index] = { ...newNavigation[index], [field]: value };
          setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
     };

     const addNavigationItem = () => {
          const newNavigation = [...headerData.navigation.main, { name: '', href: '' }];
          setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
     };

     const removeNavigationItem = (index: number) => {
          const newNavigation = headerData.navigation.main.filter((_, i) => i !== index);
          setHeaderData({ ...headerData, navigation: { ...headerData.navigation, main: newNavigation } });
     };

     if (loading) return <Loader />;

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configuration du Header</h1>
                    <p className="text-gray-600 mt-2">
                         Gérez le logo et la navigation du header
                    </p>
               </div>

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
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {headerData.navigation.main.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                   <Input
                                        value={item.name}
                                        onChange={(e) => updateNavigationItem(index, 'name', e.target.value)}
                                        placeholder="Nom du menu"
                                        className="flex-1"
                                   />
                                   <Input
                                        value={item.href}
                                        onChange={(e) => updateNavigationItem(index, 'href', e.target.value)}
                                        placeholder="#section"
                                        className="flex-1"
                                   />
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeNavigationItem(index)}
                                        className="text-red-600 hover:text-red-700"
                                   >
                                        Supprimer
                                   </Button>
                              </div>
                         ))}
                         <Button
                              variant="outline"
                              onClick={addNavigationItem}
                              className="w-full"
                         >
                              Ajouter un élément de navigation
                         </Button>
                    </CardContent>
               </Card>

               {/* Save Button */}
               <div className="flex justify-end">
                    <Button
                         onClick={saveHeader}
                         disabled={saving}
                         className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white"
                    >
                         <Save className="w-4 h-4 mr-2" />
                         {saving ? "Sauvegarde..." : "Sauvegarder le Header"}
                    </Button>
               </div>
          </div>
     );
}
