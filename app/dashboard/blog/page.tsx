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
import { FileText, Pencil, Trash2, Eye, Plus, X, Save, Calendar, Clock, User, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Loader from '@/components/home/Loader';
import { BlogPost } from "@/components/BlogPost";

// @ts-ignore-next-line: no types for @uiw/react-md-editor
const MDEditor: any = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
// @ts-ignore-next-line: no types for @uiw/react-markdown-preview
const MarkdownPreview: any = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

// Updated BlogPost interface with all new fields
interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  cover: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  body: string;
  testimonials?: string[];
  similarPosts?: string[];
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
    date: "",
    readTime: "",
    featured: false,
    published: true,
    body: "",
    testimonials: [],
    similarPosts: [],
  };
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<BlogPost>(emptyPost());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewing, setPreviewing] = useState<BlogPost | null>(null);

  // Fetch blog posts and testimonials for dropdowns
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/content?type=blog-page").then((res) => res.json()),
      fetch("/api/content?type=testimonial").then((res) => res.json()),
    ])
      .then(([blogData, testimonials]) => {
        const blogPage = Array.isArray(blogData) ? blogData[0] : blogData;
        setPosts(blogPage?.content?.blogPosts || []);
        setAllTestimonials(testimonials || []);
        setLoading(false);
      })
      .catch(() => {
        toast({ title: "Erreur", description: "Impossible de charger les articles ou témoignages." });
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
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }



  // Start editing a post
  function editPost(idx: number) {
    setEditing(idx);
    setForm(posts[idx]);
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
    let updatedPosts: BlogPost[];
    if (editing === "new") {
      updatedPosts = [...posts, form];
    } else {
      updatedPosts = posts.map((p, i) => (i === editing ? form : p));
    }
    // Save to API (update the blog-page document)
    const res = await fetch("/api/content?type=blog-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { blogPosts: updatedPosts } }),
    });
    if (res.ok) {
      setPosts(updatedPosts);
      toast({ title: "Succès", description: "Article enregistré." });
      cancelEdit();
    } else {
      toast({ title: "Erreur", description: "Échec de l'enregistrement." });
    }
    setSaving(false);
  }

  // Delete post
  async function deletePost(idx: number) {
    if (!window.confirm("Supprimer cet article ?")) return;
    const updatedPosts = posts.filter((_, i) => i !== idx);
    setSaving(true);
    const res = await fetch("/api/content?type=blog-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { blogPosts: updatedPosts } }),
    });
    if (res.ok) {
      setPosts(updatedPosts);
      toast({ title: "Supprimé", description: "Article supprimé." });
      cancelEdit();
    } else {
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
  const testimonialOptions = useMemo(() => allTestimonials.map(t => ({
    value: typeof t._id === 'object' && t._id.$oid ? t._id.$oid : t._id.toString(),
    label: t.content?.name || t.title || (typeof t._id === 'object' && t._id.$oid ? t._id.$oid : t._id.toString()),
    description: t.content?.role || t.description || '',
  })), [allTestimonials]);

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
                    <div>
                      <Label>Témoignages</Label>
                      <MultiSelectDropdown
                        options={testimonialOptions}
                        selectedValues={form.testimonials || []}
                        onSelectionChange={(values) => setForm(f => ({ ...f, testimonials: values }))}
                        placeholder="Aucun témoignage disponible"
                        addButtonText="Ajouter un témoignage"
                        emptyMessage="Aucun témoignage sélectionné"
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

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article</h3>
            <p className="text-gray-500">Commencez par créer votre premier article de blog.</p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[280px] max-w-full">
              {/* Top Section: Icon, Title, Description */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider truncate max-w-[220px]">
                      {post.title || "Sans titre"}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize truncate max-w-[220px]">{post.category || "Non catégorisé"}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate max-w-[220px]">
                  /{post.slug || "slug-manquant"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                  {post.excerpt || "Aucun extrait"}
                </p>
              </div>

              {/* Middle Section: Author & Date */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{post.author || "Auteur inconnu"}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date || "Date inconnue"}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime || "Temps inconnu"}</span>
                </div>
              </div>

              {/* Bottom Section: Status & Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                  {post.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Vedette
                    </span>
                  )}
                </div>
                <div className="flex flex-row gap-2">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewing(post)}
                    className="border-gray-300 hover:bg-gray-100 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Prévisualiser
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => editPost(idx)}
                    className="border-gray-300 hover:bg-gray-100 text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
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