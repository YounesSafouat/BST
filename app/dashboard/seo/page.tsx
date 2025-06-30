"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface SEOData {
  _id: string;
  page: string;
  language: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

const pages = [
  { value: 'home', label: 'Accueil' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'odoo', label: 'Odoo' },
  { value: 'clients', label: 'Cas Clients' },
  { value: 'blog', label: 'Blog' },
  { value: 'about', label: 'À propos' },
  { value: 'contact', label: 'Contact' }
];

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' }
];

export default function SEODashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [seoData, setSeoData] = useState<SEOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    page: '',
    language: 'fr',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonical: '',
    isActive: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchSEOData();
  }, [session, status, selectedPage, selectedLanguage]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      let url = '/api/seo?';
      if (selectedPage !== 'all') url += `page=${selectedPage}&`;
      if (selectedLanguage) url += `language=${selectedLanguage}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les données SEO", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seo: SEOData) => {
    setEditingId(seo._id);
    setFormData({
      page: seo.page,
      language: seo.language,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      ogTitle: seo.ogTitle || '',
      ogDescription: seo.ogDescription || '',
      ogImage: seo.ogImage || '',
      canonical: seo.canonical || '',
      isActive: seo.isActive
    });
  };

  const handleSave = async () => {
    try {
      const url = editingId && editingId !== 'new' ? `/api/seo/${editingId}` : '/api/seo';
      const method = editingId && editingId !== 'new' ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          updatedBy: session?.user?.email || 'admin'
        })
      });
      if (response.ok) {
        toast({ title: "Succès", description: editingId !== 'new' ? "SEO mis à jour avec succès" : "SEO créé avec succès" });
        setEditingId(null);
        fetchSEOData();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      toast({ title: "Erreur", description: error instanceof Error ? error.message : "Erreur lors de la sauvegarde", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée SEO ?')) return;
    try {
      const response = await fetch(`/api/seo/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Succès", description: "SEO supprimé avec succès" });
        fetchSEOData();
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/seo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (response.ok) {
        toast({ title: "Succès", description: `SEO ${!currentStatus ? 'activé' : 'désactivé'} avec succès` });
        fetchSEOData();
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la modification", variant: "destructive" });
    }
  };

  const filteredData = seoData.filter(seo =>
    seo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCharacterCount = (text: string) => text.length;
  const getTitleStatus = (title: string) => {
    const length = title.length;
    if (length < 30) return { status: 'warning', message: 'Trop court' };
    if (length > 60) return { status: 'error', message: 'Trop long' };
    return { status: 'success', message: 'Optimal' };
  };
  const getDescriptionStatus = (description: string) => {
    const length = description.length;
    if (length < 120) return { status: 'warning', message: 'Trop court' };
    if (length > 160) return { status: 'error', message: 'Trop long' };
    return { status: 'success', message: 'Optimal' };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion SEO</h1>
         
        </div>
        <Button onClick={() => { setEditingId('new'); setFormData({ page: '', language: 'fr', title: '', description: '', keywords: '', ogTitle: '', ogDescription: '', ogImage: '', canonical: '', isActive: true }); }} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau SEO
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page</label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les pages</SelectItem>
                  {pages.map(page => (
                    <SelectItem key={page.value} value={page.value}>{page.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Langue</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Rechercher dans les titres, descriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Form Modal */}
      {editingId && (
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId === 'new' ? 'Nouveau SEO' : 'Modifier SEO'}
              <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Page</label>
                <Select value={formData.page} onValueChange={(value) => setFormData({...formData, page: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map(page => (
                      <SelectItem key={page.value} value={page.value}>{page.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Langue</label>
                <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Titre Meta <span className="text-gray-500 ml-2">({getCharacterCount(formData.title)}/60)</span></label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Titre optimisé pour le SEO" maxLength={60} />
              <div className="mt-1">
                <Badge variant={getTitleStatus(formData.title).status === 'success' ? 'default' : 'destructive'}>{getTitleStatus(formData.title).message}</Badge>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description Meta <span className="text-gray-500 ml-2">({getCharacterCount(formData.description)}/160)</span></label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description optimisée pour le SEO" maxLength={160} rows={3} />
              <div className="mt-1">
                <Badge variant={getDescriptionStatus(formData.description).status === 'success' ? 'default' : 'destructive'}>{getDescriptionStatus(formData.description).message}</Badge>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mots-clés (séparés par des virgules)</label>
              <Input value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} placeholder="mot-clé1, mot-clé2, mot-clé3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre Open Graph</label>
                <Input value={formData.ogTitle} onChange={(e) => setFormData({...formData, ogTitle: e.target.value})} placeholder="Titre pour les réseaux sociaux" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image Open Graph</label>
                <Input value={formData.ogImage} onChange={(e) => setFormData({...formData, ogImage: e.target.value})} placeholder="URL de l'image" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description Open Graph</label>
              <Textarea value={formData.ogDescription} onChange={(e) => setFormData({...formData, ogDescription: e.target.value})} placeholder="Description pour les réseaux sociaux" rows={2} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">URL Canonique</label>
              <Input value={formData.canonical} onChange={(e) => setFormData({...formData, canonical: e.target.value})} placeholder="/page" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <label className="text-sm font-medium">Actif</label>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">Enregistrer</Button>
              {editingId !== 'new' && (
                <Button variant="destructive" onClick={() => handleDelete(editingId!)}>Supprimer</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des SEO ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Langue</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map(seo => (
                  <tr key={seo._id} className="hover:bg-orange-50">
                    <td className="px-4 py-2 font-semibold">{seo.page}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{seo.language}</Badge>
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">{seo.title}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{seo.description}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={seo.isActive}
                          onCheckedChange={() => toggleActive(seo._id, seo.isActive)}
                        />
                        {seo.isActive ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(seo)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(seo._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="text-center text-gray-500 py-8">Aucune donnée SEO trouvée.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 