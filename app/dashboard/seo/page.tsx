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
import { X, Plus, Search, Edit, Trash2, Eye, EyeOff, FileText, TrendingUp, XCircle, AlertCircle, Upload, ExternalLink, Settings } from 'lucide-react';
import Loader from '@/components/home/Loader';
import YoastSEO from '@/components/YoastSEO';
import GlobalSEOAnalyzer from '@/components/GlobalSEOAnalyzer';
import Image from 'next/image';

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
  { value: 'home', label: 'Accueil (/)' },
  { value: 'about', label: 'À propos (/about)' },
  { value: 'blog', label: 'Blog (/blog)' },
  { value: 'blog-post', label: 'Articles de Blog (/blog/[slug])' },
  { value: 'cas-client', label: 'Cas Clients (/cas-client)' },
  { value: 'cas-client-detail', label: 'Détails Cas Client (/cas-client/[slug])' },
  { value: 'hubspot', label: 'HubSpot (/hubspot)' },
  { value: 'votre-integrateur-odoo', label: 'Votre Intégrateur Odoo (/votre-integrateur-odoo)' },
  { value: 'politique-confidentialite', label: 'Politique de Confidentialité (/politique-confidentialite)' },
  { value: 'v2', label: 'Version 2 (/v2)' },
  { value: 'v3', label: 'Version 3 (/v3)' },
  { value: 'maintenance', label: 'Maintenance (/maintenance)' }
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
        console.error('API Error:', error);
        let errorMessage = error.error || "Erreur lors de la sauvegarde";
        if (error.details) {
          errorMessage += `: ${error.details}`;
        }
        if (error.validationErrors) {
          errorMessage += '\n' + error.validationErrors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({ 
        title: "Erreur", 
        description: error instanceof Error ? error.message : "Erreur lors de la sauvegarde", 
        variant: "destructive" 
      });
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
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion SEO</h1>

        </div>
        <Button onClick={() => { setEditingId('new'); setFormData({ page: '', language: 'fr', title: '', description: '', keywords: '', ogTitle: '', ogDescription: '', ogImage: '', canonical: '', isActive: true }); }} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 w-4 mr-2" />
          Nouveau SEO
        </Button>
      </div>

      {/* Global SEO Analysis */}
      <div className="mb-6">
        <GlobalSEOAnalyzer seoData={seoData} />
      </div>

      {/* Quick SEO Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-white border border-gray-200 hover:border-[--color-black] transition-all duration-300 shadow-sm hover:shadow-md">
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-[--color-black] rounded-lg flex items-center justify-center mx-auto mb-2">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-[--color-black] mb-1">
              {seoData.filter(seo => seo.title && seo.title.length >= 30 && seo.title.length <= 60).length}
            </div>
            <div className="text-xs text-gray-700 font-medium">Titres optimisés</div>
            <div className="text-xs text-gray-500">
              {seoData.length > 0 ? Math.round((seoData.filter(seo => seo.title && seo.title.length >= 30 && seo.title.length <= 60).length / seoData.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:border-[--color-black] transition-all duration-300 shadow-sm hover:shadow-md">
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-[--color-black] rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-[--color-black] mb-1">
              {seoData.filter(seo => seo.description && seo.description.length >= 120 && seo.description.length <= 160).length}
            </div>
            <div className="text-xs text-gray-700 font-medium">Descriptions optimisées</div>
            <div className="text-xs text-gray-500">
              {seoData.length > 0 ? Math.round((seoData.filter(seo => seo.description && seo.description.length >= 120 && seo.description.length <= 160).length / seoData.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:border-[--color-black] transition-all duration-300 shadow-sm hover:shadow-md">
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-[--color-black] rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-[--color-black] mb-1">
              {seoData.filter(seo => seo.keywords && seo.keywords.trim() !== '').length}
            </div>
            <div className="text-xs text-gray-700 font-medium">Pages avec mots-clés</div>
            <div className="text-xs text-gray-500">
              {seoData.length > 0 ? Math.round((seoData.filter(seo => seo.keywords && seo.keywords.trim() !== '').length / seoData.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:border-[--color-black] transition-all duration-300 shadow-sm hover:shadow-md">
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-[--color-black] rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-[--color-black] mb-1">
              {seoData.filter(seo => seo.isActive).length}
            </div>
            <div className="text-xs text-gray-700 font-medium">Pages actives</div>
            <div className="text-xs text-gray-500">
              {seoData.length > 0 ? Math.round((seoData.filter(seo => seo.isActive).length / seoData.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Improvement Actions */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50 py-4">
          <CardTitle className="flex items-center gap-3 text-[--color-black] text-base">
            <div className="w-7 h-7 bg-[--color-black] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Actions d'amélioration SEO prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critical Issues */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 text-lg">Problèmes critiques</h4>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {(() => {
                    let count = 0;
                    if (seoData.filter(seo => !seo.title || seo.title.trim() === '').length > 0) count++;
                    if (seoData.filter(seo => !seo.description || seo.description.trim() === '').length > 0) count++;
                    if (seoData.filter(seo => !seo.keywords || seo.keywords.trim() === '').length > 0) count++;
                    return count;
                  })()} problème(s)
                </Badge>
              </div>

              <div className="space-y-3">
                {seoData.filter(seo => !seo.title || seo.title.trim() === '').length > 0 && (
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-red-900 mb-1 text-sm">Titres manquants</div>
                        <div className="text-xs text-red-700 mb-2">
                          {seoData.filter(seo => !seo.title || seo.title.trim() === '').length} page(s) sans titre SEO
                        </div>
                        <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          ⚠️ Impact: Réduction significative du référencement
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 text-xs h-8"
                        onClick={() => {
                          const pagesWithoutTitles = seoData.filter(seo => !seo.title || seo.title.trim() === '');
                          if (pagesWithoutTitles.length > 0) {
                            setEditingId(pagesWithoutTitles[0]._id);
                            setFormData({
                              page: pagesWithoutTitles[0].page,
                              language: pagesWithoutTitles[0].language,
                              title: '',
                              description: pagesWithoutTitles[0].description || '',
                              keywords: pagesWithoutTitles[0].keywords || '',
                              ogTitle: pagesWithoutTitles[0].ogTitle || '',
                              ogDescription: pagesWithoutTitles[0].ogDescription || '',
                              ogImage: pagesWithoutTitles[0].ogImage || '',
                              canonical: pagesWithoutTitles[0].canonical || '',
                              isActive: pagesWithoutTitles[0].isActive
                            });
                          }
                        }}
                      >
                        Corriger
                      </Button>
                    </div>
                  </div>
                )}

                {seoData.filter(seo => !seo.description || seo.description.trim() === '').length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-red-900 mb-1">Descriptions manquantes</div>
                        <div className="text-sm text-red-700 mb-3">
                          {seoData.filter(seo => !seo.description || seo.description.trim() === '').length} page(s) sans description SEO
                        </div>
                        <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          ⚠️ Impact: Pas de snippet dans les résultats de recherche
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white px-4"
                        onClick={() => {
                          const pagesWithoutDescriptions = seoData.filter(seo => !seo.description || seo.description.trim() === '');
                          if (pagesWithoutDescriptions.length > 0) {
                            setEditingId(pagesWithoutDescriptions[0]._id);
                            setFormData({
                              page: pagesWithoutDescriptions[0].page,
                              language: pagesWithoutDescriptions[0].language,
                              title: pagesWithoutDescriptions[0].title || '',
                              description: '',
                              keywords: pagesWithoutDescriptions[0].keywords || '',
                              ogTitle: pagesWithoutDescriptions[0].ogTitle || '',
                              ogDescription: pagesWithoutDescriptions[0].ogDescription || '',
                              ogImage: pagesWithoutDescriptions[0].ogImage || '',
                              canonical: pagesWithoutDescriptions[0].canonical || '',
                              isActive: pagesWithoutDescriptions[0].isActive
                            });
                          }
                        }}
                      >
                        Corriger maintenant
                      </Button>
                    </div>
                  </div>
                )}

                {seoData.filter(seo => !seo.keywords || seo.keywords.trim() === '').length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-red-900 mb-1">Mots-clés manquants</div>
                        <div className="text-sm text-red-700 mb-3">
                          {seoData.filter(seo => !seo.keywords || seo.keywords.trim() === '').length} page(s) sans mots-clés
                        </div>
                        <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          ⚠️ Impact: Difficulté à cibler les bonnes requêtes
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white px-4"
                        onClick={() => {
                          const pagesWithoutKeywords = seoData.filter(seo => !seo.keywords || seo.keywords.trim() === '');
                          if (pagesWithoutKeywords.length > 0) {
                            setEditingId(pagesWithoutKeywords[0]._id);
                            setFormData({
                              page: pagesWithoutKeywords[0].page,
                              language: pagesWithoutKeywords[0].language,
                              title: pagesWithoutKeywords[0].title || '',
                              description: pagesWithoutKeywords[0].description || '',
                              keywords: '',
                              ogTitle: pagesWithoutKeywords[0].ogTitle || '',
                              ogDescription: pagesWithoutKeywords[0].ogDescription || '',
                              ogImage: pagesWithoutKeywords[0].ogImage || '',
                              canonical: pagesWithoutKeywords[0].canonical || '',
                              isActive: pagesWithoutKeywords[0].isActive
                            });
                          }
                        }}
                      >
                        Corriger maintenant
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Warnings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 text-lg">Avertissements</h4>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {(() => {
                    let count = 0;
                    if (seoData.filter(seo => seo.title && (seo.title.length < 30 || seo.title.length > 60)).length > 0) count++;
                    if (seoData.filter(seo => seo.description && (seo.description.length < 120 || seo.description.length > 160)).length > 0) count++;
                    if (seoData.filter(seo => !seo.ogTitle || !seo.ogDescription || !seo.ogImage).length > 0) count++;
                    return count;
                  })()} avertissement(s)
                </Badge>
              </div>

              <div className="space-y-3">
                {seoData.filter(seo => seo.title && (seo.title.length < 30 || seo.title.length > 60)).length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-yellow-900 mb-1">Titres non optimisés</div>
                        <div className="text-sm text-yellow-700 mb-3">
                          {seoData.filter(seo => seo.title && (seo.title.length < 30 || seo.title.length > 60)).length} page(s) avec titre trop court/long
                        </div>
                        <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          💡 Conseil: 30-60 caractères pour un titre optimal
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                )}

                {seoData.filter(seo => seo.description && (seo.description.length < 120 || seo.description.length > 160)).length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-yellow-900 mb-1">Descriptions non optimisées</div>
                        <div className="text-sm text-yellow-700 mb-3">
                          {seoData.filter(seo => seo.description && (seo.description.length < 120 || seo.description.length > 160)).length} page(s) avec description trop courte/longue
                        </div>
                        <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          💡 Conseil: 120-160 caractères pour une description optimale
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                )}

                {seoData.filter(seo => !seo.ogTitle || !seo.ogDescription || !seo.ogImage).length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-yellow-900 mb-1">Open Graph incomplet</div>
                        <div className="text-sm text-yellow-700 mb-3">
                          {seoData.filter(seo => !seo.ogTitle || !seo.ogDescription || !seo.ogImage).length} page(s) avec Open Graph manquant
                        </div>
                        <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          💡 Conseil: Améliore l'apparence sur les réseaux sociaux
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <Card className="border-2 border-orange-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl">{editingId === 'new' ? 'Nouveau SEO' : 'Modifier SEO'}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="hover:bg-orange-200">
                <X className="w-5 h-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {/* Section 1: Configuration de Base */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration de Base</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Page</label>
                  <Select value={formData.page} onValueChange={(value) => setFormData({ ...formData, page: value })}>
                    <SelectTrigger className="border-2 hover:border-gray-400">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Langue</label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                    <SelectTrigger className="border-2 hover:border-gray-400">
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
            </div>

            {/* Section 2: Optimisation SEO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Optimisation pour les Moteurs de Recherche</h3>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de la Page (Meta Title)
                  <span className={`ml-2 font-bold ${getCharacterCount(formData.title) >= 30 && getCharacterCount(formData.title) <= 60 ? 'text-green-600' : 'text-red-600'}`}>
                    ({getCharacterCount(formData.title)}/60)
                  </span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre optimisé pour le SEO (30-60 caractères)"
                  maxLength={60}
                  className={`border-2 ${getCharacterCount(formData.title) >= 30 && getCharacterCount(formData.title) <= 60
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-red-300 focus:border-red-500'
                    }`}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={getTitleStatus(formData.title).status === 'success' ? 'default' : 'destructive'}>
                    {getTitleStatus(formData.title).message}
                  </Badge>
                  {getCharacterCount(formData.title) < 30 && (
                    <span className="text-xs text-red-600 font-medium">Ajoutez {30 - getCharacterCount(formData.title)} caractères minimum</span>
                  )}
                  {getCharacterCount(formData.title) > 60 && (
                    <span className="text-xs text-red-600 font-medium">Supprimez {getCharacterCount(formData.title) - 60} caractères</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description Meta
                  <span className={`ml-2 font-bold ${getCharacterCount(formData.description) >= 120 && getCharacterCount(formData.description) <= 160 ? 'text-green-600' : 'text-red-600'}`}>
                    ({getCharacterCount(formData.description)}/160)
                  </span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description optimisée pour le SEO (120-160 caractères)"
                  maxLength={160}
                  rows={3}
                  className={`border-2 ${getCharacterCount(formData.description) >= 120 && getCharacterCount(formData.description) <= 160
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-red-300 focus:border-red-500'
                    }`}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={getDescriptionStatus(formData.description).status === 'success' ? 'default' : 'destructive'}>
                    {getDescriptionStatus(formData.description).message}
                  </Badge>
                  {getCharacterCount(formData.description) < 120 && (
                    <span className="text-xs text-red-600 font-medium">Ajoutez {120 - getCharacterCount(formData.description)} caractères minimum</span>
                  )}
                  {getCharacterCount(formData.description) > 160 && (
                    <span className="text-xs text-red-600 font-medium">Supprimez {getCharacterCount(formData.description) - 160} caractères</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mots-clés (séparés par des virgules)
                  <span className="text-gray-500 text-xs ml-2 font-normal">Recommandé: 3-5 mots-clés</span>
                </label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="mot-clé1, mot-clé2, mot-clé3"
                  className="border-2"
                />
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  💡 <strong>Conseil:</strong> Utilisez des mots-clés spécifiques et pertinents pour votre page
                </div>
              </div>
            </div>

            {/* Section 3: Open Graph / Social Media */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-300">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Partage sur les Réseaux Sociaux</h3>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-4">
                  📱 Ces informations s'affichent quand vous partagez la page sur WhatsApp, Facebook, LinkedIn, etc.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre pour le Partage
                  <span className="text-gray-500 text-xs ml-2 font-normal">(affiché sur WhatsApp, Facebook, etc.)</span>
                </label>
                <Input 
                  value={formData.ogTitle} 
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })} 
                  placeholder="Titre accrocheur pour les réseaux sociaux" 
                  className="border-2"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description pour le Partage
                  <span className="text-gray-500 text-xs ml-2 font-normal">(affichée sous le titre lors du partage)</span>
                </label>
                <Textarea 
                  value={formData.ogDescription} 
                  onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })} 
                  placeholder="Description courte et attrayante pour les réseaux sociaux" 
                  rows={2}
                  className="border-2"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image de Partage
                  <span className="text-gray-500 text-xs ml-2 font-normal">(image affichée lors du partage sur WhatsApp, etc.)</span>
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input 
                      value={formData.ogImage} 
                      onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })} 
                      placeholder="URL de l'image (ex: https://votre-site.com/image.jpg)" 
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            toast({ 
                              title: "Info", 
                              description: "Veuillez héberger l'image sur votre serveur et coller l'URL ici" 
                            });
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Parcourir
                    </Button>
                  </div>
                  
                  {formData.ogImage && (
                    <div className="border border-gray-300 rounded-lg p-3 bg-white">
                      <p className="text-xs font-medium text-gray-700 mb-2">Aperçu de l'image :</p>
                      <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={formData.ogImage}
                          alt="Open Graph Preview"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="flex items-center justify-center h-full text-red-500 text-sm">Image non valide ou inaccessible</div>';
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Dimension recommandée : 1200x630 pixels
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                    <p className="text-xs text-blue-800 font-medium">
                      <strong>📱 Conseil :</strong> Cette image apparaîtra quand quelqu'un partagera votre page sur WhatsApp, Facebook, LinkedIn, Twitter, etc. 
                      Utilisez une image haute qualité de 1200x630 pixels pour un meilleur rendu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Paramètres Avancés */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Paramètres Avancés</h3>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Canonique
                  <span className="text-gray-500 text-xs ml-2 font-normal">(optionnel)</span>
                </label>
                <Input 
                  value={formData.canonical} 
                  onChange={(e) => setFormData({ ...formData, canonical: e.target.value })} 
                  placeholder="/page" 
                  className="border-2"
                />
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  💡 <strong>Info:</strong> L'URL canonique aide à éviter le contenu dupliqué
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status de la Page</label>
                    <p className="text-xs text-gray-500 mt-1">Activer ou désactiver le SEO pour cette page</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Analyse et Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Analyse SEO</h3>
              </div>

            {/* SEO Completion Progress */}
            <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[--color-black] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Complétude SEO</h3>
                  <p className="text-xs text-gray-600">Progression de l'optimisation</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Score global</span>
                  <span className="text-base font-bold text-[--color-black]">
                    {(() => {
                      let completed = 0;
                      if (formData.title && formData.title.trim() !== '') completed++;
                      if (formData.description && formData.description.trim() !== '') completed++;
                      if (formData.keywords && formData.keywords.trim() !== '') completed++;
                      if (formData.ogTitle && formData.ogTitle.trim() !== '') completed++;
                      if (formData.ogDescription && formData.ogDescription.trim() !== '') completed++;
                      if (formData.ogImage && formData.ogImage.trim() !== '') completed++;
                      if (formData.canonical && formData.canonical.trim() !== '') completed++;
                      return `${Math.round((completed / 7) * 100)}%`;
                    })()}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[--color-black] h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(() => {
                        let completed = 0;
                        if (formData.title && formData.title.trim() !== '') completed++;
                        if (formData.description && formData.description.trim() !== '') completed++;
                        if (formData.keywords && formData.keywords.trim() !== '') completed++;
                        if (formData.ogTitle && formData.ogTitle.trim() !== '') completed++;
                        if (formData.ogDescription && formData.ogDescription.trim() !== '') completed++;
                        if (formData.ogImage && formData.ogImage.trim() !== '') completed++;
                        if (formData.canonical && formData.canonical.trim() !== '') completed++;
                        return (completed / 7) * 100;
                      })()}%`
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm font-bold text-[--color-black]">
                      {(() => {
                        let completed = 0;
                        if (formData.title && formData.title.trim() !== '') completed++;
                        if (formData.description && formData.description.trim() !== '') completed++;
                        if (formData.keywords && formData.keywords.trim() !== '') completed++;
                        if (formData.ogTitle && formData.ogTitle.trim() !== '') completed++;
                        if (formData.ogDescription && formData.ogDescription.trim() !== '') completed++;
                        if (formData.ogImage && formData.ogImage.trim() !== '') completed++;
                        if (formData.canonical && formData.canonical.trim() !== '') completed++;
                        return completed;
                      })()}
                    </div>
                    <div className="text-gray-600">Complétés</div>
                  </div>

                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm font-bold text-gray-400">
                      {(() => {
                        let completed = 0;
                        if (formData.title && formData.title.trim() !== '') completed++;
                        if (formData.description && formData.description.trim() !== '') completed++;
                        if (formData.keywords && formData.keywords.trim() !== '') completed++;
                        if (formData.ogTitle && formData.ogTitle.trim() !== '') completed++;
                        if (formData.ogDescription && formData.ogDescription.trim() !== '') completed++;
                        if (formData.ogImage && formData.ogImage.trim() !== '') completed++;
                        if (formData.canonical && formData.canonical.trim() !== '') completed++;
                        return 7 - completed;
                      })()}
                    </div>
                    <div className="text-gray-600">Restants</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Yoast SEO Analysis */}
            <div className="bg-white p-5 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-gray-900">Analyse SEO Yoast</h4>
              </div>
              <YoastSEO
                title={formData.title}
                content={formData.description}
                focusKeyword={formData.keywords.split(',')[0]?.trim() || ''}
                metaDescription={formData.description}
                slug={formData.page}
              />
            </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-300">
              <Button 
                onClick={handleSave} 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                💾 Enregistrer les Modifications
              </Button>
              {editingId !== 'new' && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(editingId!)}
                  className="px-6 py-3 text-base font-semibold"
                >
                  🗑️ Supprimer
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => setEditingId(null)}
                className="px-6 py-3 text-base"
              >
                Annuler
              </Button>
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
                      <Badge variant="outline" className="text-xs">{seo.language}</Badge>
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