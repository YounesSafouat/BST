"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import './mdeditor-black-text.css';

// @ts-ignore-next-line: no types for @uiw/react-md-editor
const MDEditor: any = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
// @ts-ignore-next-line: no types for @uiw/react-markdown-preview
const MarkdownPreview: any = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

// Add type for a blog post
interface BlogPost {
  title: string;
  slug: string;
  category: string;
  cover: string;
  body: string;
  published: boolean;
}

function emptyPost() {
  return {
    title: "",
    slug: "",
    category: "",
    cover: "",
    body: "",
    published: true,
  };
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<number | "new" | null>(null); // index in posts or null for new
  const [form, setForm] = useState<BlogPost>(emptyPost());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch blog posts from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/content?type=blog-page")
      .then((res) => res.json())
      .then((data) => {
        const blogPage = Array.isArray(data) ? data[0] : data;
        setPosts(blogPage?.content?.blogPosts || []);
        setLoading(false);
      })
      .catch(() => {
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
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  // Start editing a post
  function editPost(idx: number) {
    setEditing(idx);
    setForm(posts[idx]);
  }

  // Start new post
  function newPost() {
    setEditing("new");
    setForm(emptyPost());
  }

  // Cancel editing
  function cancelEdit() {
    setEditing(null);
    setForm(emptyPost());
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

  // UI
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion du Blog</h1>
      {editing === null ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Articles</h2>
            <Button onClick={newPost}>Nouvel article</Button>
          </div>
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="space-y-2">
              {posts.length === 0 && <div>Aucun article.</div>}
              {posts.map((post, idx) => (
                <Card key={idx} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold">{post.title}</div>
                    <div className="text-sm text-gray-500">/{post.slug}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => editPost(idx)} size="sm">Éditer</Button>
                    <Button variant="destructive" onClick={() => deletePost(idx)} size="sm">Supprimer</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <form
            className="space-y-4"
            onSubmit={e => { e.preventDefault(); savePost(); }}
          >
            <h2 className="text-xl font-semibold mb-2">{editing === "new" ? "Nouvel article" : "Éditer l'article"}</h2>
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input id="category" name="category" value={form.category} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="cover">Image de couverture (URL)</Label>
              <Input id="cover" name="cover" value={form.cover} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="published">Publié</Label>
              <Switch id="published" name="published" checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} />
            </div>
            <div>
              <Label htmlFor="body">Contenu</Label>
              <div className="border rounded">
                <MDEditor
                  value={form.body}
                  onChange={(v: string | undefined) => setForm(f => ({ ...f, body: v || "" }))}
                  height={200}
                  data-color-mode="light"
                  style={{ color: "#000", background: "#fff" }}
                  textareaProps={{ id: "body", name: "body" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
              <Button type="button" variant="outline" onClick={cancelEdit} disabled={saving}>Annuler</Button>
            </div>
          </form>
          <div>
            <h2 className="text-xl font-semibold mb-2">Aperçu en direct</h2>
            <Card className="p-4 min-h-[400px]">
              <div className="mb-2">
                {form.cover && <img src={form.cover} alt="cover" className="w-full h-40 object-cover rounded mb-2" />}
                <div className="text-2xl font-bold">{form.title || <span className="text-gray-400">Titre...</span>}</div>
                <div className="text-sm text-gray-500 mb-2">/{form.slug || "slug"}</div>
                <div className="text-xs text-gray-400 mb-2">Catégorie: {form.category || <span className="text-gray-300">(aucune)</span>}</div>
              </div>
              <MarkdownPreview
                source={form.body || "Contenu..."}
                style={{ color: "#000", background: "#fff" }}
                className="text-black"
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 