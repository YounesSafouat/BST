"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { toast } from "@/components/ui/use-toast";
import { TrendingUp, Save, Settings } from "lucide-react";

interface BlogSettings {
     popularArticles: string[];
     categories: Array<{
          name: string;
          color: string;
     }>;
     settings: {
          postsPerPage: number;
          enableComments: boolean;
          enableSocialSharing: boolean;
     };
}

export default function BlogSettingsPage() {
     const [settings, setSettings] = useState<BlogSettings>({
          popularArticles: [],
          categories: [],
          settings: {
               postsPerPage: 6,
               enableComments: false,
               enableSocialSharing: true,
          }
     });
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [blogOptions, setBlogOptions] = useState<Array<{ value: string; label: string; description: string }>>([]);

     // Fetch blog settings and available blog posts
     useEffect(() => {
          const fetchData = async () => {
               try {
                    // Fetch blog settings
                    const settingsRes = await fetch('/api/blog?settings=true');
                    const settingsData = await settingsRes.json();
                    setSettings(settingsData);

                    // Fetch available blog posts for popular articles selection
                    const postsRes = await fetch('/api/blog');
                    const postsData = await postsRes.json();

                    const options = postsData.map((post: any) => ({
                         value: post.slug,
                         label: post.title,
                         description: post.excerpt
                    }));
                    setBlogOptions(options);
               } catch (error) {
                    console.error('Error fetching blog settings:', error);
                    toast({ title: "Erreur", description: "Impossible de charger les paramètres du blog." });
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     const saveSettings = async () => {
          setSaving(true);
          try {
               const response = await fetch('/api/blog-settings', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(settings),
               });

               if (response.ok) {
                    toast({ title: "Succès", description: "Paramètres du blog sauvegardés." });
               } else {
                    throw new Error('Failed to save settings');
               }
          } catch (error) {
               console.error('Error saving blog settings:', error);
               toast({ title: "Erreur", description: "Impossible de sauvegarder les paramètres." });
          } finally {
               setSaving(false);
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                         <p className="text-gray-600">Chargement des paramètres...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-50 p-6">
               <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                         <div className="flex items-center gap-3 mb-4">
                              <Settings className="w-8 h-8 text-blue-600" />
                              <h1 className="text-3xl font-bold text-gray-900">Paramètres du Blog</h1>
                         </div>
                         <p className="text-gray-600">Configurez les paramètres globaux de votre blog</p>
                    </div>

                    <div className="space-y-6">
                         {/* Popular Articles */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Articles Populaires
                                   </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div>
                                        <Label>Articles à afficher dans la sidebar</Label>
                                        <p className="text-sm text-gray-500 mb-3">
                                             Sélectionnez les articles qui apparaîtront dans la section "Articles Populaires" du blog.
                                        </p>
                                        <MultiSelectDropdown
                                             options={blogOptions}
                                             selectedValues={settings.popularArticles}
                                             onSelectionChange={(values) => setSettings(s => ({ ...s, popularArticles: values }))}
                                             placeholder="Aucun article disponible"
                                             addButtonText="Ajouter un article populaire"
                                             emptyMessage="Aucun article populaire sélectionné"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                             Maximum 3 articles. Les articles non sélectionnés seront automatiquement choisis parmi les plus récents.
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Blog Settings */}
                         <Card>
                              <CardHeader>
                                   <CardTitle>Paramètres Généraux</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div>
                                        <Label>Articles par page</Label>
                                        <Input
                                             type="number"
                                             min="1"
                                             max="20"
                                             value={settings.settings.postsPerPage}
                                             onChange={(e) => setSettings(s => ({
                                                  ...s,
                                                  settings: { ...s.settings, postsPerPage: parseInt(e.target.value) }
                                             }))}
                                             className="mt-1"
                                        />
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Save Button */}
                         <div className="flex justify-end">
                              <Button
                                   onClick={saveSettings}
                                   disabled={saving}
                                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                              >
                                   <Save className="w-4 h-4 mr-2" />
                                   {saving ? "Sauvegarde..." : "Sauvegarder"}
                              </Button>
                         </div>
                    </div>
               </div>
          </div>
     );
} 