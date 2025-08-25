"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Plus, Trash2, Code, Globe, Tag, Settings } from "lucide-react";
import Loader from '@/components/home/Loader';

interface Snippet {
     _id?: string;
     title: string;
     description: string;
     type: 'meta' | 'script' | 'analytics' | 'tracking' | 'custom';
     location: 'head' | 'body-top' | 'body-bottom';
     content: string;
     isActive: boolean;
     pages?: string[]; // Specific pages to apply to (empty = all pages)
     priority?: number; // Execution order
     createdAt?: Date;
     updatedAt?: Date;
}

export default function SnippetsDashboard() {
     const [snippets, setSnippets] = useState<Snippet[]>([]);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
     const [showForm, setShowForm] = useState(false);

     useEffect(() => {
          fetchSnippets();
     }, []);

     const fetchSnippets = async () => {
          console.log('fetchSnippets called'); // Debug log
          try {
               console.log('Fetching from /api/content/snippets...'); // Debug log
               const response = await fetch("/api/content/snippets");
               console.log('Response status:', response.status); // Debug log
               console.log('Response ok:', response.ok); // Debug log

               if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data); // Debug log

                    if (data.length > 0) {
                         const snippetsContent = data.find(item => item.type === 'snippets');
                         if (snippetsContent && snippetsContent.content) {
                              console.log('Content from data:', snippetsContent.content); // Debug log
                              console.log('Snippets from content:', snippetsContent.content?.snippets); // Debug log
                              setSnippets(snippetsContent.content?.snippets || []);
                         }
                    } else {
                         console.log('No data returned from API'); // Debug log
                    }
               } else {
                    console.log('Response not ok, status:', response.status); // Debug log
                    const errorText = await response.text();
                    console.log('Error response text:', errorText); // Debug log
               }
          } catch (error) {
               console.error("Error fetching snippets:", error);
               toast({
                    title: "Erreur",
                    description: "Impossible de charger les snippets",
                    variant: "destructive"
               });
          } finally {
               setLoading(false);
          }
     };

     const saveSnippets = async () => {
          console.log('saveSnippets called'); // Debug log
          console.log('Current snippets state:', snippets); // Debug log
          setSaving(true);
          try {
               const requestBody = {
                    content: { snippets },
                    title: "Snippets Configuration",
                    description: "Meta tags, tracking codes, and custom scripts",
                    isActive: true
               };

               console.log('Sending request body:', requestBody); // Debug log
               
               // Try POST first, then fall back to PUT
               let response;
               try {
                    console.log('Trying POST request to /api/content/snippets...'); // Debug log
                    response = await fetch("/api/content/snippets", {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify(requestBody),
                    });
               } catch (postError) {
                    console.log('POST failed, trying PUT...', postError); // Debug log
                    response = await fetch("/api/content/snippets", {
                         method: "PUT",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify(requestBody),
                    });
               }

               console.log('Response received, status:', response.status); // Debug log
               console.log('Response ok:', response.ok); // Debug log

               if (response.ok) {
                    const responseData = await response.json();
                    console.log('Success response data:', responseData); // Debug log
                    toast({
                         title: "Succès",
                         description: "Snippets sauvegardés avec succès",
                    });
               } else {
                    const errorData = await response.json();
                    console.log('Error response data:', errorData); // Debug log
                    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
               }
          } catch (error) {
               console.error("Error saving snippets:", error);
               toast({
                    title: "Erreur",
                    description: `Impossible de sauvegarder les snippets: ${error.message}`,
                    variant: "destructive"
               });
          } finally {
               setSaving(false);
          }
     };

     const addSnippet = () => {
          const newSnippet: Snippet = {
               title: "",
               description: "",
               type: 'meta',
               location: 'head',
               content: `<!-- Enhanced Button Click Tracking for GA4 -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Track external link clicks (WhatsApp, phone, etc.)
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button');
    if (!target) return;

    // WhatsApp tracking - updated for api.whatsapp.com
    if (target.href && target.href.includes('api.whatsapp.com')) {
      gtag('event', 'button_click', {
        'event_category': 'engagement',
        'event_label': 'whatsapp_external',
        'button_id': 'whatsapp_external',
        'button_text': target.textContent?.trim() || 'WhatsApp',
        'page_path': window.location.pathname
      });
    }

    // Phone tracking
    if (target.href && target.href.includes('tel:')) {
      gtag('event', 'button_click', {
        'event_category': 'engagement',
        'event_label': 'phone_external',
        'button_id': 'phone_external',
        'button_text': target.textContent?.trim() || 'Phone',
        'page_path': window.location.pathname
      });
    }

    // Meeting/Contact tracking
    if (target.href && (target.href.includes('meetings.hubspot') || target.href.includes('contact'))) {
      gtag('event', 'button_click', {
        'event_category': 'engagement',
        'event_label': 'contact_external',
        'button_id': 'contact_external',
        'button_text': target.textContent?.trim() || 'Contact',
        'page_path': window.location.pathname
      });
    }
  });
});
</script>`,
               isActive: true,
               pages: [],
               priority: snippets.length + 1
          };
          setEditingSnippet(newSnippet);
          setShowForm(true);
     };

     const editSnippet = (snippet: Snippet) => {
          setEditingSnippet({ ...snippet });
          setShowForm(true);
     };

     const deleteSnippet = (index: number) => {
          const newSnippets = snippets.filter((_, i) => i !== index);
          setSnippets(newSnippets);
     };

     const saveSnippet = () => {
          console.log('saveSnippet called with:', editingSnippet); // Debug log
          
          if (!editingSnippet || !editingSnippet.title || !editingSnippet.content) {
               console.log('Validation failed - missing title or content'); // Debug log
               toast({
                    title: "Erreur",
                    description: "Le titre et le contenu sont requis",
                    variant: "destructive"
               });
               return;
          }

          if (editingSnippet._id) {
               // Update existing
               console.log('Updating existing snippet:', editingSnippet._id); // Debug log
               const newSnippets = snippets.map(s => s._id === editingSnippet._id ? editingSnippet : s);
               setSnippets(newSnippets);
          } else {
               // Add new
               console.log('Adding new snippet'); // Debug log
               const newSnippet = { ...editingSnippet, _id: Date.now().toString() };
               console.log('New snippet created:', newSnippet); // Debug log
               setSnippets([...snippets, newSnippet]);
          }

          console.log('Snippets state after save:', snippets); // Debug log
          setShowForm(false);
          setEditingSnippet(null);
     };

     const cancelEdit = () => {
          setShowForm(false);
          setEditingSnippet(null);
     };

     const getTypeIcon = (type: string) => {
          switch (type) {
               case 'meta': return <Tag className="w-4 h-4" />;
               case 'script': return <Code className="w-4 h-4" />;
               case 'analytics': return <Globe className="w-4 h-4" />;
               case 'tracking': return <Settings className="w-4 h-4" />;
               default: return <Code className="w-4 h-4" />;
          }
     };

     const getLocationBadge = (location: string) => {
          const colors = {
               'head': 'bg-blue-100 text-blue-800',
               'body-top': 'bg-green-100 text-green-800',
               'body-bottom': 'bg-purple-100 text-purple-800'
          };
          return <Badge className={colors[location as keyof typeof colors]}>{location}</Badge>;
     };

     if (loading) return <Loader />;

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold text-gray-900">Gestion des Snippets</h1>
                         <p className="text-gray-600 mt-2">
                              Gérez vos meta tags, Google Analytics, tracking codes et scripts personnalisés
                         </p>
                    </div>
                    <div className="flex items-center gap-3">
                         <Button 
                              onClick={() => {
                                   console.log('Testing API...');
                                   fetch('/api/content/snippets')
                                        .then(res => res.json())
                                        .then(data => {
                                             console.log('API Test Result:', data);
                                             alert('Check console for API result');
                                        })
                                        .catch(err => {
                                             console.error('API Test Error:', err);
                                             alert('API Error: ' + err.message);
                                        });
                              }}
                              variant="outline"
                              className="text-sm"
                         >
                              Test API
                         </Button>
                         <Button 
                              onClick={() => {
                                   console.log('Testing health...');
                                   fetch('/api/health')
                                        .then(res => res.json())
                                        .then(data => {
                                             console.log('Health Check Result:', data);
                                             alert(`Health: ${data.status}\nDatabase: ${data.database}\nContent Count: ${data.contentCount}`);
                                        })
                                        .catch(err => {
                                             console.error('Health Check Error:', err);
                                             alert('Health Check Error: ' + err.message);
                                        });
                              }}
                              variant="outline"
                              className="text-sm"
                         >
                              Health Check
                         </Button>
                         <Button onClick={addSnippet} className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)]">
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter un Snippet
                         </Button>
                    </div>
               </div>

               {/* Snippets List */}
               <div className="grid gap-4">
                    {snippets.map((snippet, index) => (
                         <Card key={snippet._id || index} className="hover:shadow-md transition-shadow">
                              <CardHeader>
                                   <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                             {getTypeIcon(snippet.type)}
                                             <div>
                                                  <CardTitle className="text-lg">{snippet.title}</CardTitle>
                                                  <p className="text-sm text-gray-600">{snippet.description}</p>
                                             </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                             {getLocationBadge(snippet.location)}
                                             <Switch
                                                  checked={snippet.isActive}
                                                  onCheckedChange={(checked) => {
                                                       const newSnippets = [...snippets];
                                                       newSnippets[index].isActive = checked;
                                                       setSnippets(newSnippets);
                                                  }}
                                             />
                                        </div>
                                   </div>
                              </CardHeader>
                              <CardContent>
                                   <div className="space-y-3">
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                             <span><strong>Type:</strong> {snippet.type}</span>
                                             <span><strong>Priorité:</strong> {snippet.priority}</span>
                                             <span><strong>Pages:</strong> {snippet.pages?.length ? snippet.pages.join(', ') : 'Toutes'}</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                             <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">{snippet.content}</pre>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => editSnippet(snippet)}
                                             >
                                                  Modifier
                                             </Button>
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => deleteSnippet(index)}
                                                  className="text-red-600 hover:text-red-700"
                                             >
                                                  <Trash2 className="w-4 h-4" />
                                             </Button>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {snippets.length === 0 && (
                    <Card>
                         <CardContent className="text-center py-12">
                              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun snippet configuré</h3>
                              <p className="text-gray-600 mb-4">
                                   Commencez par ajouter votre premier snippet pour les meta tags, Google Analytics, etc.
                              </p>
                              <Button onClick={addSnippet} className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)]">
                                   <Plus className="w-4 h-4 mr-2" />
                                   Ajouter un Snippet
                              </Button>
                         </CardContent>
                    </Card>
               )}

               {/* Snippet Form Modal */}
               {showForm && editingSnippet && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                         <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                              <h2 className="text-xl font-bold mb-4">
                                   {editingSnippet._id ? 'Modifier le Snippet' : 'Nouveau Snippet'}
                              </h2>

                              <div className="space-y-4">
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <Label htmlFor="title">Titre *</Label>
                                             <Input
                                                  id="title"
                                                  value={editingSnippet.title}
                                                  onChange={(e) => setEditingSnippet({ ...editingSnippet, title: e.target.value })}
                                                  placeholder="Ex: Google Analytics"
                                             />
                                        </div>
                                        <div>
                                             <Label htmlFor="type">Type</Label>
                                             <Select
                                                  value={editingSnippet.type}
                                                  onValueChange={(value: any) => setEditingSnippet({ ...editingSnippet, type: value })}
                                             >
                                                  <SelectTrigger>
                                                       <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="meta">Meta Tags</SelectItem>
                                                       <SelectItem value="script">Script</SelectItem>
                                                       <SelectItem value="analytics">Analytics</SelectItem>
                                                       <SelectItem value="tracking">Tracking</SelectItem>
                                                       <SelectItem value="custom">Personnalisé</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   </div>

                                   <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                             id="description"
                                             value={editingSnippet.description}
                                             onChange={(e) => setEditingSnippet({ ...editingSnippet, description: e.target.value })}
                                             placeholder="Description du snippet"
                                        />
                                   </div>

                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <Label htmlFor="location">Emplacement d'injection</Label>
                                             <Select
                                                  value={editingSnippet.location}
                                                  onValueChange={(value: any) => setEditingSnippet({ ...editingSnippet, location: value })}
                                             >
                                                  <SelectTrigger>
                                                       <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="head">Head (Meta tags, CSS)</SelectItem>
                                                       <SelectItem value="body-top">Début du Body (Scripts)</SelectItem>
                                                       <SelectItem value="body-bottom">Fin du Body (Analytics)</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                        <div>
                                             <Label htmlFor="priority">Priorité</Label>
                                             <Input
                                                  id="priority"
                                                  type="number"
                                                  value={editingSnippet.priority}
                                                  onChange={(e) => setEditingSnippet({ ...editingSnippet, priority: parseInt(e.target.value) })}
                                                  placeholder="1"
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <Label htmlFor="content">Contenu du Snippet *</Label>
                                        <Textarea
                                             id="content"
                                             value={editingSnippet.content}
                                             onChange={(e) => setEditingSnippet({ ...editingSnippet, content: e.target.value })}
                                             placeholder="Ex: <script>gtag('config', 'GA_MEASUREMENT_ID');</script>"
                                             rows={8}
                                             className="font-mono text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Entrez le code HTML, JavaScript ou meta tags à injecter
                                        </p>
                                   </div>

                                   <div className="flex items-center gap-2">
                                        <Switch
                                             id="isActive"
                                             checked={editingSnippet.isActive}
                                             onCheckedChange={(checked) => setEditingSnippet({ ...editingSnippet, isActive: checked })}
                                        />
                                        <Label htmlFor="isActive">Actif</Label>
                                   </div>
                              </div>

                              <div className="flex justify-end gap-3 mt-6">
                                   <Button variant="outline" onClick={cancelEdit}>
                                        Annuler
                                   </Button>
                                   <Button onClick={saveSnippet} className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)]">
                                        Sauvegarder
                                   </Button>
                              </div>
                         </div>
                    </div>
               )}

               {/* Save All Button */}
               {snippets.length > 0 && (
                    <div className="flex justify-end">
                         <Button
                              onClick={saveSnippets}
                              disabled={saving}
                              className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white"
                         >
                              <Save className="w-4 h-4 mr-2" />
                              {saving ? "Sauvegarde..." : "Sauvegarder tous les Snippets"}
                         </Button>
                    </div>
               )}
          </div>
     );
}
