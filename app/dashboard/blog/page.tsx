"use client";
import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { toast } from "@/components/ui/use-toast";
import './mdeditor-black-text.css';
import { FileText, Pencil, Trash2, Eye, Plus, X, Save, Calendar, Clock, User, Star, MapPin, Filter, Search, TrendingUp } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Loader from '@/components/home/Loader';
import { BlogPost } from "@/components/BlogPost";

// @ts-ignore-next-line: no types for @uiw/react-md-editor
const MDEditor: any = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
// @ts-ignore-next-line: no types for @uiw/react-markdown-preview
const MarkdownPreview: any = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

// Updated BlogPost interface with all new fields
interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  cover: string;
  author: string;
  authorRole: string;
  date: string;
  scheduledDate?: string; // New field for scheduled publishing
  readTime: string;
  featured: boolean;
  published: boolean;
  body: string;

  similarPosts?: string[];
  targetRegions?: string[];
}

function emptyPost() {
  return {
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    image: "",
    cover: "",
    author: "",
    authorRole: "",
    date: new Date().toISOString().split('T')[0],
    scheduledDate: new Date().toISOString().slice(0, 16), // Default to current date and time
    readTime: "",
    featured: false,
    published: false,
    body: "",

    similarPosts: [],
    targetRegions: ['france', 'morocco', 'international'],
  };
}

// Helper function to check if a blog is released
function isBlogReleased(post: BlogPost): boolean {
  if (!post.scheduledDate) return post.published;

  const scheduledDate = new Date(post.scheduledDate);
  const now = new Date();

  return scheduledDate <= now && post.published;
}

// Helper function to format scheduled date
function formatScheduledDate(dateString: string): string {
  if (!dateString) return "Non programmé";

  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<BlogPost>(emptyPost());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewing, setPreviewing] = useState<BlogPost | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // all, published, draft, scheduled
  const [dateFilter, setDateFilter] = useState<string>("all"); // all, today, week, month, custom
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null); // null = all, true = featured, false = not featured
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date"); // date, title, author, scheduledDate
  const [sortOrder, setSortOrder] = useState<string>("desc"); // asc, desc

  // Helper function to get filtered and sorted posts
  const getFilteredPosts = () => {
    console.log("getFilteredPosts called with posts:", posts.length);
    console.log("Filter values:", { searchTerm, statusFilter, dateFilter, categoryFilter, featuredFilter, regionFilter });
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "published":
          filtered = filtered.filter(post => isBlogReleased(post));
          break;
        case "draft":
          filtered = filtered.filter(post => !post.published);
          break;
        case "scheduled":
          filtered = filtered.filter(post => post.published && post.scheduledDate && !isBlogReleased(post));
          break;
      }
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(post => {
        const postDate = new Date(post.date);
        switch (dateFilter) {
          case "today":
            return postDate >= today;
          case "week":
            return postDate >= weekAgo;
          case "month":
            return postDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Featured filter
    if (featuredFilter !== null) {
      filtered = filtered.filter(post => post.featured === featuredFilter);
    }

    // Region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter(post =>
        post.targetRegions && post.targetRegions.includes(regionFilter)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "author":
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case "scheduledDate":
          aValue = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
          bValue = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
          break;
        case "date":
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log("Filtered posts result:", filtered.length);
    return filtered;
  };

  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    const categories = posts.map(post => post.category).filter(Boolean);
    return [...new Set(categories)];
  };

  // Get unique regions for filter dropdown
  const getUniqueRegions = () => {
    const regions = posts.flatMap(post => post.targetRegions || []).filter(Boolean);
    return [...new Set(regions)];
  };

  // Fetch blog posts and testimonials for dropdowns
  useEffect(() => {
    setLoading(true);
    fetch("/api/blog")
      .then((res) => res.json())
      .then((blogPosts) => {
        console.log("Blog posts received:", blogPosts);
        console.log("Blog posts count:", blogPosts?.length || 0);
        console.log("First blog post:", blogPosts?.[0]);
        setPosts(blogPosts || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
        toast({ title: "Erreur", description: "Impossible de charger les articles." });
        setLoading(false);
      });
  }, []);

  // Force textarea color to black after render (before paint)
  useLayoutEffect(() => {
    const setColors = () => {
      document.querySelectorAll('.w-md-editor-text-input').forEach((el) => {
        (el as HTMLTextAreaElement).style.color = '#000';
        (el as HTMLTextAreaElement).style.background = '#fff';
        (el as HTMLTextAreaElement).style.caretColor = '#000';
      });
    };
    setColors();
    const observer = new MutationObserver(setColors);
    document.querySelectorAll('.w-md-editor-text-input').forEach((el) => {
      observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
    });
    return () => observer.disconnect();
  });

  // Handle form field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    console.log("Form field change:", { name, value, type, checked });
    setForm((f) => {
      const newForm = { ...f, [name]: type === "checkbox" ? checked : value };
      console.log("Updated form:", newForm);
      return newForm;
    });
  }



  // Start editing a post
  function editPost(idx: number) {
    console.log("Editing post at index:", idx);
    const filteredPosts = getFilteredPosts();
    const postToEdit = filteredPosts[idx];
    console.log("Post data:", postToEdit);
    setEditing(idx);
    setForm(postToEdit);
    setIsModalOpen(true);
  }

  // Start new post
  function newPost() {
    setEditing("new");
    setForm(emptyPost());
    setIsModalOpen(true);
  }

  // Cancel editing
  function cancelEdit() {
    setEditing(null);
    setForm(emptyPost());
    setIsModalOpen(false);
  }

  // Save (create or update) post
  async function savePost() {
    setSaving(true);
    try {
      // Ensure all required fields are present and properly formatted
      const formData = {
        ...form,
        date: form.date || new Date().toISOString().split('T')[0], // Ensure date is set
        published: form.published !== undefined ? form.published : true,
        featured: form.featured !== undefined ? form.featured : false,

        similarPosts: form.similarPosts || [],
        targetRegions: form.targetRegions || ['france', 'morocco', 'international'],
      };

      console.log("Form data to save:", formData);

      if (editing === "new") {
        // Create new blog post
        console.log("Creating new blog post:", formData);
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        console.log("Create response status:", res.status);

        if (res.ok) {
          const newPost = await res.json();
          console.log("New blog post created:", newPost);
          setPosts([...posts, newPost.content]);
          toast({ title: "Succès", description: "Article créé." });
          cancelEdit();
        } else {
          const errorData = await res.text();
          console.error("Failed to create blog post:", errorData);
          toast({ title: "Erreur", description: "Échec de la création." });
        }
      } else {
        // Update existing blog post
        const filteredPosts = getFilteredPosts();
        const postToUpdate = filteredPosts[editing as number];
        console.log("Updating blog post:", { postToUpdate, formData });
        console.log("Update URL:", `/api/blog?id=${postToUpdate._id}`);
        console.log("Full ID being sent:", postToUpdate._id);
        console.log("ID length:", postToUpdate._id?.length);

        try {
          const res = await fetch(`/api/blog?id=${encodeURIComponent(postToUpdate._id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          console.log("Update response status:", res.status);
          console.log("Update response headers:", res.headers);

          if (res.ok) {
            const updatedPost = await res.json();
            console.log("Blog post updated:", updatedPost);

            // Update the posts array with the new data by finding the post by ID
            const updatedPosts = posts.map((p) =>
              p._id === postToUpdate._id ? { ...formData, _id: postToUpdate._id } : p
            );
            setPosts(updatedPosts);

            toast({ title: "Succès", description: "Article mis à jour." });
            cancelEdit();
          } else {
            const errorData = await res.text();
            console.error("Failed to update blog post:", errorData);
            toast({ title: "Erreur", description: "Échec de la mise à jour." });
          }
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          toast({ title: "Erreur", description: "Erreur de connexion." });
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast({ title: "Erreur", description: "Échec de l'enregistrement." });
    }
    setSaving(false);
  }

  // Delete post
  async function deletePost(idx: number) {
    if (!window.confirm("Supprimer cet article ?")) return;
    const postToDelete = posts[idx];
    console.log("Deleting blog post:", postToDelete);
    setSaving(true);
          try {
        const res = await fetch(`/api/blog?id=${encodeURIComponent(postToDelete._id)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const result = await res.json();
        console.log("Blog post deleted:", result);
        const updatedPosts = posts.filter((_, i) => i !== idx);
        setPosts(updatedPosts);
        toast({ title: "Supprimé", description: "Article supprimé." });
      } else {
        const errorData = await res.text();
        console.error("Failed to delete blog post:", errorData);
        toast({ title: "Erreur", description: "Échec de la suppression." });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Erreur", description: "Échec de la suppression." });
    }
    setSaving(false);
  }

  // Helper for dropdown options
  const blogOptions = useMemo(() => posts.map(p => ({
    value: p.slug,
    label: p.title,
    description: p.excerpt
  })), [posts]);


  // UI
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion du Blog</h1>
        <Button onClick={newPost} className="bg-[--color-black] hover:bg-primary-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Article
        </Button>
      </div>

      {/* Preview Modal */}
      {previewing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Aperçu: {previewing.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setPreviewing(null)} className="h-8 w-8 sm:h-10 sm:w-10">
                <X className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <BlogPost post={previewing} />
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl lg:max-w-7xl h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
                {editing === "new" ? "Nouvel Article" : `Modifier: ${form.title}`}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewing(form)}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Prévisualiser
                </Button>
                <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 sm:h-10 sm:w-10">
                  <X className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader><CardTitle>Informations de Base</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Titre</Label>
                        <Input name="title" value={form.title} onChange={handleChange} />
                      </div>
                      <div>
                        <Label>Slug</Label>
                        <Input name="slug" value={form.slug} onChange={handleChange} placeholder="mon-article" />
                      </div>
                      <div>
                        <Label>Extrait</Label>
                        <Input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Description courte..." />
                      </div>
                      <div>
                        <Label>Catégorie</Label>
                        <Input name="category" value={form.category} onChange={handleChange} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Author Information */}
                <Card>
                  <CardHeader><CardTitle>Informations Auteur</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Auteur</Label>
                        <Input name="author" value={form.author} onChange={handleChange} />
                      </div>
                      <div>
                        <Label>Rôle Auteur</Label>
                        <Input name="authorRole" value={form.authorRole} onChange={handleChange} placeholder="Expert, Consultant..." />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input name="date" value={form.date} onChange={handleChange} placeholder="12 juin 2025" />
                      </div>
                      <div>
                        <Label>Temps de Lecture</Label>
                        <Input name="readTime" value={form.readTime} onChange={handleChange} placeholder="8 min" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Images */}
                <Card>
                  <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Image Principale</Label>
                        <Input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                      </div>
                      <div>
                        <Label>Image de Couverture</Label>
                        <Input name="cover" value={form.cover} onChange={handleChange} placeholder="https://..." />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                  <CardHeader><CardTitle>Paramètres</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={form.published}
                        onCheckedChange={(checked) => setForm(f => ({ ...f, published: checked }))}
                      />
                      <Label htmlFor="published">Publié</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={form.featured}
                        onCheckedChange={(checked) => setForm(f => ({ ...f, featured: checked }))}
                      />
                      <Label htmlFor="featured">Article en Vedette</Label>
                    </div>
                    <div>
                      <Label htmlFor="scheduledDate">Date de Publication Programmé</Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        name="scheduledDate"
                        value={form.scheduledDate || ''}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Laissez vide pour publier immédiatement. Si une date est définie, l'article ne sera visible qu'à partir de cette date.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Region Targeting */}
                <Card>
                  <CardHeader><CardTitle>Régions cibles</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.targetRegions?.includes('france') || false}
                          onChange={(e) => {
                            const currentRegions = form.targetRegions || [];
                            const newRegions = e.target.checked
                              ? [...currentRegions, 'france']
                              : currentRegions.filter(r => r !== 'france');
                            setForm(f => ({ ...f, targetRegions: newRegions }));
                          }}
                        />
                        <span className="text-sm">France</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.targetRegions?.includes('morocco') || false}
                          onChange={(e) => {
                            const currentRegions = form.targetRegions || [];
                            const newRegions = e.target.checked
                              ? [...currentRegions, 'morocco']
                              : currentRegions.filter(r => r !== 'morocco');
                            setForm(f => ({ ...f, targetRegions: newRegions }));
                          }}
                        />
                        <span className="text-sm">Maroc</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.targetRegions?.includes('international') || false}
                          onChange={(e) => {
                            const currentRegions = form.targetRegions || [];
                            const newRegions = e.target.checked
                              ? [...currentRegions, 'international']
                              : currentRegions.filter(r => r !== 'international');
                            setForm(f => ({ ...f, targetRegions: newRegions }));
                          }}
                        />
                        <span className="text-sm">International</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Laissez vide pour afficher dans toutes les régions
                    </p>
                  </CardContent>
                </Card>

                {/* Related Content */}
                <Card>
                  <CardHeader><CardTitle>Contenu Associé</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Articles Similaires</Label>
                      <MultiSelectDropdown
                        options={blogOptions}
                        selectedValues={form.similarPosts || []}
                        onSelectionChange={(values) => setForm(f => ({ ...f, similarPosts: values }))}
                        placeholder="Aucun article disponible"
                        addButtonText="Ajouter un article similaire"
                        emptyMessage="Aucun article similaire sélectionné"
                      />
                    </div>

                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card>
                  <CardHeader><CardTitle>Contenu</CardTitle></CardHeader>
                  <CardContent>
                    <MDEditor
                      value={form.body}
                      onChange={(value: string) => setForm(f => ({ ...f, body: value || "" }))}
                      height={400}
                      textareaProps={{ style: { color: '#000', background: '#fff', caretColor: '#000' } }}
                      preview="edit"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t mt-0 bg-white sticky bottom-0 z-20 px-4 pb-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-w-[120px] text-base font-semibold"
                onClick={cancelEdit}
              >
                Annuler
              </Button>

              <Button
                type="button"
                size="lg"
                className="min-w-[160px] text-base font-bold bg-[--color-black] hover:bg-primary-dark text-white shadow-lg"
                onClick={savePost}
                disabled={saving}
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par titre, extrait, auteur ou catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                  setCategoryFilter("all");
                  setFeaturedFilter(null);
                  setRegionFilter("all");
                  setSortBy("date");
                  setSortOrder("desc");
                }}
                className="whitespace-nowrap"
              >
                <X className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium">Statut</Label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filtrer par statut"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiés</option>
                  <option value="draft">Brouillons</option>
                  <option value="scheduled">Programmés</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <Label className="text-sm font-medium">Période</Label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filtrer par période"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <Label className="text-sm font-medium">Catégorie</Label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filtrer par catégorie"
                >
                  <option value="all">Toutes les catégories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <Label className="text-sm font-medium">Vedette</Label>
                <select
                  value={featuredFilter === null ? "all" : featuredFilter.toString()}
                  onChange={(e) => setFeaturedFilter(e.target.value === "all" ? null : e.target.value === "true")}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filtrer par statut vedette"
                >
                  <option value="all">Tous les articles</option>
                  <option value="true">Articles en vedette</option>
                  <option value="false">Articles normaux</option>
                </select>
              </div>

              {/* Region Filter */}
              <div>
                <Label className="text-sm font-medium">Région</Label>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filtrer par région"
                >
                  <option value="all">Toutes les régions</option>
                  {getUniqueRegions().map(region => (
                    <option key={region} value={region}>
                      {region === 'france' ? 'France' :
                        region === 'morocco' ? 'Maroc' :
                          region === 'international' ? 'International' : region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <Label className="text-sm font-medium">Trier par</Label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Trier par critère"
                  >
                    <option value="date">Date</option>
                    <option value="title">Titre</option>
                    <option value="author">Auteur</option>
                    <option value="scheduledDate">Date programmée</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3"
                    aria-label={`Trier en ordre ${sortOrder === "asc" ? "décroissant" : "croissant"}`}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {getFilteredPosts().length} article{getFilteredPosts().length !== 1 ? 's' : ''} trouvé{getFilteredPosts().length !== 1 ? 's' : ''}
                {searchTerm && ` pour "${searchTerm}"`}
              </div>
              <div className="text-sm text-gray-500">
                Trié par {sortBy === 'date' ? 'date' :
                  sortBy === 'title' ? 'titre' :
                    sortBy === 'author' ? 'auteur' :
                      'date programmée'} ({sortOrder === 'asc' ? 'croissant' : 'décroissant'})
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredPosts().length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {posts.length === 0 ? "Aucun article" : "Aucun article trouvé"}
            </h3>
            <p className="text-gray-500">
              {posts.length === 0
                ? "Commencez par créer votre premier article de blog."
                : "Essayez de modifier vos critères de recherche."
              }
            </p>
          </div>
        ) : (
          getFilteredPosts().map((post, idx) => (
            <Card key={idx} className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-xl h-full flex flex-col">
              {/* Card Header with Icon */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {post.title || "Sans titre"}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize truncate">{post.category || "Non catégorisé"}</p>
                    </div>
                  </div>
                </div>

                {/* Slug and Excerpt */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-mono text-gray-400 truncate">
                    /{post.slug || "slug-manquant"}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {post.excerpt || "Aucun extrait"}
                  </p>
                </div>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{post.author || "Auteur inconnu"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{post.date || "Date inconnue"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{post.readTime || "Temps inconnu"}</span>
                  </div>
                  {post.scheduledDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-600 font-medium">
                        Programmé: {formatScheduledDate(post.scheduledDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Release Status Badge */}
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${isBlogReleased(post)
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : post.published && post.scheduledDate
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                    {isBlogReleased(post)
                      ? 'Publié'
                      : post.published && post.scheduledDate
                        ? 'Programmé'
                        : 'Brouillon'
                    }
                  </span>

                  {/* Published Status Badge */}
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${post.published
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                    {post.published ? 'Activé' : 'Désactivé'}
                  </span>

                  {post.featured && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                      <Star className="w-3 h-3 mr-1" />
                      Vedette
                    </span>
                  )}
                  {post.targetRegions && post.targetRegions.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.targetRegions.length === 3 ? 'Toutes' : post.targetRegions.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons - Icon Only */}
              <div className="px-6 pb-6 mt-auto">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewing(post)}
                    className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 transition-all duration-200 group/btn"
                    title="Prévisualiser"
                  >
                    <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editPost(idx)}
                    className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 transition-all duration-200 group/btn"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePost(idx)}
                    className="h-10 w-10 p-0 rounded-lg hover:bg-red-50 transition-all duration-200 group/btn"
                    disabled={saving}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 group-hover/btn:text-red-600 transition-colors duration-200" />
                  </Button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none rounded-xl" />
            </Card>
          ))
        )}
      </div>
      {/* Force markdown editor textarea color */}
      <style jsx global>{`
        .w-md-editor-text-input {
          color: #000 !important;
          background: #fff !important;
          caret-color: #000 !important;
        }
      `}</style>
    </div>
  );
} 