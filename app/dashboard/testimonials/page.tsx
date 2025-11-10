"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { FileText, Pencil, Trash2, Plus, X, Save, User, Quote, Globe } from "lucide-react";
import Loader from '@/components/home/Loader';
import ImageUpload from '@/components/dashboard/ImageUpload';

interface Testimonial {
  _id?: string;
  author: string;
  role: string;
  text: string;
  photo?: string;
  targetRegions?: string[];
  clientCasePath?: string;
  createdAt?: string;
  updatedAt?: string;
}

function emptyTestimonial(): Testimonial {
  return {
    author: "",
    role: "",
    text: "",
    photo: "",
    targetRegions: ['all'],
    clientCasePath: "",
  };
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Testimonial>(emptyTestimonial());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch testimonials from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        // Map the testimonials data correctly
        const mapped = (data || []).map((t: any) => ({
          _id: t._id,
          author: t.author || '',
          role: t.role || '',
          text: t.text || '',
          photo: t.photo || '',
          targetRegions: t.targetRegions || ['all'],
          clientCasePath: t.clientCasePath || '',
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
        setTestimonials(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error);
        toast({ title: "Erreur", description: "Impossible de charger les témoignages." });
        setLoading(false);
      });
  }, []);

  // Handle form field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handle region targeting changes
  function handleRegionChange(region: string, checked: boolean) {
    setForm((f) => {
      if (checked) {
        // If "all" is selected, remove other regions
        if (region === 'all') {
          return { ...f, targetRegions: ['all'] };
        }
        // Remove "all" if selecting specific regions
        const newRegions = f.targetRegions?.filter(r => r !== 'all') || [];
        return { ...f, targetRegions: [...newRegions, region] };
      } else {
        // Remove the region
        const newRegions = f.targetRegions?.filter(r => r !== region) || [];
        // If no regions selected, default to "all"
        return { ...f, targetRegions: newRegions.length > 0 ? newRegions : ['all'] };
      }
    });
  }

  // Start editing a testimonial
  function editTestimonial(idx: number) {
    setEditing(idx);
    setForm(testimonials[idx]);
    setIsModalOpen(true);
  }

  // Start new testimonial
  function newTestimonial() {
    setEditing("new");
    setForm(emptyTestimonial());
    setIsModalOpen(true);
  }

  // Cancel editing
  function cancelEdit() {
    setEditing(null);
    setForm(emptyTestimonial());
    setIsModalOpen(false);
  }

  // Save (create or update) testimonial
  async function saveTestimonial() {
    setSaving(true);

    try {
      if (editing === "new") {
        // Create new testimonial
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            author: form.author,
            role: form.role,
            text: form.text,
            photo: form.photo,
            targetRegions: form.targetRegions || ['all'],
            clientCasePath: form.clientCasePath
          }),
        });

        if (res.ok) {
          const result = await res.json();
          setTestimonials([...testimonials, result.testimonial]);
          toast({ title: "Succès", description: "Témoignage créé." });
          cancelEdit();
        } else {
          toast({ title: "Erreur", description: "Échec de la création." });
        }
      } else {
        // Update existing testimonial
        if (typeof editing === "number") {
          const res = await fetch(`/api/testimonials/${testimonials[editing]._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              author: form.author,
              role: form.role,
              text: form.text,
              photo: form.photo,
              targetRegions: form.targetRegions || ['all'],
              clientCasePath: form.clientCasePath
            }),
          });
          if (res.ok) {
            const updatedTestimonials = testimonials.map((t, i) =>
              i === editing ? { ...form, _id: testimonials[editing]._id } : t
            );
            setTestimonials(updatedTestimonials);
            toast({ title: "Succès", description: "Témoignage mis à jour." });
            cancelEdit();
          } else {
            toast({ title: "Erreur", description: "Échec de la mise à jour." });
          }
        }
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue." });
    }

    setSaving(false);
  }

  // Delete testimonial
  async function deleteTestimonial(idx: number) {
    if (!window.confirm("Supprimer ce témoignage ?")) return;
    setSaving(true);
    try {
      if (typeof idx === "number") {
        const res = await fetch(`/api/testimonials/${testimonials[idx]._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          const updatedTestimonials = testimonials.filter((_, i) => i !== idx);
          setTestimonials(updatedTestimonials);
          toast({ title: "Supprimé", description: "Témoignage supprimé." });
          cancelEdit();
        } else {
          toast({ title: "Erreur", description: "Échec de la suppression." });
        }
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue." });
    }
    setSaving(false);
  }

  // Helper function to get region display names
  const getRegionDisplayName = (region: string) => {
    switch (region) {
      case 'all': return 'Toutes les régions';
      case 'france': return '🇫🇷 France';
      case 'morocco': return '🇲🇦 Maroc';
      case 'international': return '🌍 International';
      default: return region;
    }
  };

  // UI
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <div className="flex justify-between items-center mb-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Témoignages</h1>
        <Button onClick={newTestimonial} className="bg-[--color-black] hover:bg-primary-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Témoignage
        </Button>
      </div>

      {/* Modal for editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
                {editing === "new" ? "Nouveau Témoignage" : `Modifier: ${form.author}`}
              </h2>
              <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 sm:h-10 sm:w-10">
                <X className="h-4 h-4 sm:h-6 sm:w-6" />
              </Button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom de l'auteur</Label>
                        <Input name="author" value={form.author} onChange={handleChange} />
                      </div>
                      <div>
                        <Label>Rôle/Fonction</Label>
                        <Input name="role" value={form.role} onChange={handleChange} placeholder="CEO, Consultant..." />
                      </div>
                    </div>
                    <div>
                      <ImageUpload
                        value={form.photo || ''}
                        onChange={(url) => handleChange({ target: { name: 'photo', value: url } } as any)}
                        label="Photo"
                        placeholder="https://... ou télécharger"
                      />
                    </div>
                    <div>
                      <Label>Témoignage</Label>
                      <Textarea
                        name="text"
                        value={form.text}
                        onChange={handleChange}
                        placeholder="Le témoignage..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Chemin du cas client (optionnel)</Label>
                      <Input 
                        name="clientCasePath" 
                        value={form.clientCasePath || ''} 
                        onChange={handleChange} 
                        placeholder="/allisone"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Exemple: /allisone (redirigera vers {process.env.NEXT_PUBLIC_BASE_URL}/cas-client/allisone)
                      </p>
                    </div>

                    {/* Region Targeting */}
                    <div>
                      <Label className="block mb-2">Régions cibles</Label>
                      <div className="space-y-2">
                        {[
                          { value: 'france', label: '🇫🇷 France' },
                          { value: 'morocco', label: '🇲🇦 Maroc' },
                          { value: 'international', label: '🌍 International' },
                          { value: 'all', label: '🌐 Toutes les régions' }
                        ].map((region) => (
                          <label key={region.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={form.targetRegions?.includes(region.value)}
                              onChange={(e) => handleRegionChange(region.value, e.target.checked)}
                              className="rounded border-gray-300 text-[var(--color-main)] focus:ring-[var(--color-main)]"
                            />
                            <span className="text-sm text-gray-700">{region.label}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Sélectionnez les régions où ce témoignage doit être visible. Laissez vide pour afficher partout.
                      </p>
                    </div>
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
                onClick={saveTestimonial}
                disabled={saving}
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun témoignage</h3>
            <p className="text-gray-500">Commencez par créer votre premier témoignage.</p>
          </div>
        ) : (
          testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[200px] max-w-full">
              {/* Top Section: Icon, Author, Role */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Quote className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-bold text-gray-800 truncate max-w-[220px]">
                      {testimonial.author || "Auteur inconnu"}
                    </h3>
                    <p className="text-xs text-gray-500 truncate max-w-[220px]">{testimonial.role || "Rôle inconnu"}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 max-w-[220px]">
                  "{testimonial.text || "Aucun témoignage"}"
                </p>

                {/* Region targeting display */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {testimonial.targetRegions?.map((region) => (
                    <span
                      key={region}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {region === 'france' && '🇫🇷'}
                      {region === 'morocco' && '🇲🇦'}
                      {region === 'international' && '🌍'}
                      {region === 'all' && '🌐'}
                      {region}
                    </span>
                  ))}
                </div>

                {/* Client case path display */}
                {testimonial.clientCasePath && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                      📁 {testimonial.clientCasePath}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Section: Actions */}
              <div className="flex flex-row justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editTestimonial(idx)}
                  className="border-gray-300 hover:bg-gray-100 text-xs"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTestimonial(idx)}
                  className="border-red-300 hover:bg-red-100 text-red-600 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 