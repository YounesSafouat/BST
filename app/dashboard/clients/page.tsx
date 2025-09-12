"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Quote, Briefcase, Pencil, Trash2, Eye, X, Save, Plus, Users } from "lucide-react";
import Loader from "@/components/home/Loader"
import dynamic from "next/dynamic";
import Image from "next/image";

// Rich Text Editor Component
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

// Client case structure based on seedClientsPage.js
interface ProjectStat {
  label: string;
  value: string;
}
interface Challenge {
  title: string;
  description: string;
  impact: string;
}
interface Solution {
  module: string;
  description: string;
  benefit: string;
}
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  initials: string;
}
export interface ClientCase {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  sector: string;
  size: string;
  solution: string;
  migration: string;
  logo: string;
  videoUrl?: string;
  videoTitle?: string;
  heroImage?: string;
  contentSections: {
    title: string;
    content: string; // HTML content like blog
    image?: string;
    imageAlt?: string;
  }[];
  featured: boolean;
  featuredInHeader?: boolean;
  projectStats: ProjectStat[];
  challenges: Challenge[];
  solutions: Solution[];
  testimonial: Testimonial | null;
}

function emptyClient(): ClientCase {
  return {
    slug: "",
    name: "",
    headline: "",
    summary: "",
    sector: "",
    size: "",
    solution: "",
    migration: "",
    logo: "",
    videoUrl: "",
    videoTitle: "",
    heroImage: "",
    contentSections: [],
    featured: false,
    featuredInHeader: false,
    projectStats: [],
    challenges: [],
    solutions: [],
    testimonial: null,
  };
}

// A wrapper component for the client page preview to handle dynamic import and props
const ClientPagePreview = ({ client }: { client: ClientCase }) => {
  const ClientPageComponent = dynamic(() => import("@/app/cas-client/[slug]/page"), {
    loading: () => <div className="p-8 text-center">Chargement de l'aperçu...</div>,
    ssr: false,
  });
  return <div className="transform scale-[0.9] origin-top"><ClientPageComponent params={{ slug: client.slug }} /></div>;
};

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<ClientCase[]>([]);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [previewing, setPreviewing] = useState<ClientCase | null>(null);
  const [form, setForm] = useState<ClientCase>(emptyClient());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch client cases from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/content?type=clients-page")
      .then((res) => res.json())
      .then((data) => {
        const page = Array.isArray(data) ? data.find(item => item.type === 'clients-page') : data;
        setClients(page?.content?.clientCases || []);
        setLoading(false);
      })
      .catch(() => {
        toast({ title: "Erreur", description: "Impossible de charger les cas clients." });
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value } as ClientCase));
  }

  function editClient(idx: number) {
    setEditing(idx);
    setForm(clients[idx]);
    setIsModalOpen(true);
  }

  function newClient() {
    setEditing("new");
    setForm(emptyClient());
    setIsModalOpen(true);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyClient());
    setIsModalOpen(false);
  }

  async function saveClient() {
    // Validation for testimonial
    if (form.testimonial) {
      if (!form.testimonial.quote.trim() || !form.testimonial.author.trim()) {
        toast({ title: "Erreur", description: "Le témoignage doit avoir une citation et un auteur." });
        return;
      }
    }
    setSaving(true);
    let updatedClients: ClientCase[];
    if (editing === "new") {
      updatedClients = [...clients, form];
    } else {
      updatedClients = clients.map((c, i) => (i === editing ? form : c));
    }
    // Save to API (update the clients-page document)
    const res = await fetch("/api/content?type=clients-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { clientCases: updatedClients } }),
    });
    if (res.ok) {
      setClients(updatedClients);
      toast({ title: "Succès", description: "Cas client enregistré." });
      cancelEdit();
    } else {
      toast({ title: "Erreur", description: "Échec de l'enregistrement." });
    }
    setSaving(false);
  }

  async function deleteClient(idx: number) {
    if (!window.confirm("Supprimer ce cas client ?")) return;
    const updatedClients = clients.filter((_, i) => i !== idx);
    setSaving(true);
    const res = await fetch("/api/content?type=clients-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { clientCases: updatedClients } }),
    });
    if (res.ok) {
      setClients(updatedClients);
      toast({ title: "Supprimé", description: "Cas client supprimé." });
      cancelEdit();
    } else {
      toast({ title: "Erreur", description: "Échec de la suppression." });
    }
    setSaving(false);
  }

  // Repeatable fields helpers (for projectStats, challenges, solutions)
  function handleArrayChange<T extends keyof ClientCase, K extends keyof (ClientCase[T] extends (infer U)[] ? U : never)>(
    field: T,
    idx: number,
    subfield: K,
    value: string
  ) {
    setForm((f) => {
      const arr = Array.isArray(f[field]) ? ([...(f[field] as any[])] as any[]) : [];
      arr[idx][subfield] = value;
      return { ...f, [field]: arr };
    });
  }
  function addArrayItem<T extends keyof ClientCase>(field: T, emptyObj: any) {
    setForm((f) => ({ ...f, [field]: [...((f[field] as any[]) || []), emptyObj] }));
  }
  function removeArrayItem<T extends keyof ClientCase>(field: T, idx: number) {
    setForm((f) => {
      const arr = Array.isArray(f[field]) ? ([...(f[field] as any[])] as any[]) : [];
      arr.splice(idx, 1);
      return { ...f, [field]: arr };
    });
  }

  // UI
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Cas Clients</h1>
        <Button onClick={newClient} className="bg-[--color-black] hover:bg-primary-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm sm:text-lg text-gray-600">Chargement des cas clients...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Modal for editing */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl lg:max-w-7xl h-[90vh] sm:h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-3 sm:p-4 border-b">
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {editing === "new" ? "Nouveau Cas Client" : `Modifier: ${form.name}`}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 sm:h-10 sm:w-10">
                    <X className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                      <CardHeader><CardTitle>Informations de Base</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nom du client</Label>
                            <Input name="name" value={form.name} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Slug</Label>
                            <Input name="slug" value={form.slug} onChange={handleChange} placeholder="nom-client" />
                          </div>
                          <div>
                            <Label>Titre principal</Label>
                            <Input name="headline" value={form.headline} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Secteur</Label>
                            <Input name="sector" value={form.sector} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Taille</Label>
                            <Input name="size" value={form.size} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Solution</Label>
                            <Input name="solution" value={form.solution} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Migration</Label>
                            <Input name="migration" value={form.migration} onChange={handleChange} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Logo URL</Label>
                            <Input name="logo" value={form.logo} onChange={handleChange} placeholder="https://..." />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Résumé</Label>
                            <Input name="summary" value={form.summary} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="featured"
                              checked={form.featured}
                              onCheckedChange={(checked) => setForm(f => ({ ...f, featured: checked }))}
                            />
                            <Label htmlFor="featured">Mis en avant</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="featuredInHeader"
                              checked={form.featuredInHeader}
                              onCheckedChange={(checked) => setForm(f => ({ ...f, featuredInHeader: checked }))}
                            />
                            <Label htmlFor="featuredInHeader">Mis en avant dans l'en-tête</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Media & Content */}
                    <Card>
                      <CardHeader><CardTitle>Médias et Contenu</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label>URL de la vidéo (YouTube embed)</Label>
                            <Input
                              name="videoUrl"
                              value={form.videoUrl || ""}
                              onChange={handleChange}
                              placeholder="https://www.youtube.com/embed/..."
                            />
                          </div>
                          <div>
                            <Label>Titre de la vidéo</Label>
                            <Input
                              name="videoTitle"
                              value={form.videoTitle || ""}
                              onChange={handleChange}
                              placeholder="Titre affiché sur la vidéo"
                            />
                          </div>
                          <div>
                            <Label>Image hero (fallback si pas de vidéo)</Label>
                            <Input
                              name="heroImage"
                              value={form.heroImage || ""}
                              onChange={handleChange}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Content Sections */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sections de Contenu</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {form.contentSections?.map((section, idx) => (
                          <div key={idx} className="space-y-4 p-4 border rounded-lg">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Titre de la section"
                                value={section.title}
                                onChange={(e) => handleArrayChange("contentSections", idx, "title", e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeArrayItem("contentSections", idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div>
                              <Label>Contenu HTML</Label>
                              <RichTextEditor
                                value={section.content}
                                onChange={(value: string) => handleArrayChange("contentSections", idx, "content", value || "")}
                                height={300}
                                placeholder="Commencez à écrire le contenu de cette section..."
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Utilisez l'éditeur riche pour formater votre contenu avec du HTML automatique.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Image de la section (optionnel)</Label>
                                <Input
                                  placeholder="https://..."
                                  value={section.image || ""}
                                  onChange={(e) => handleArrayChange("contentSections", idx, "image", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Texte alternatif de l'image</Label>
                                <Input
                                  placeholder="Description de l'image"
                                  value={section.imageAlt || ""}
                                  onChange={(e) => handleArrayChange("contentSections", idx, "imageAlt", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addArrayItem("contentSections", {
                            title: "",
                            content: "",
                            image: "",
                            imageAlt: ""
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une section
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Project Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Statistiques du projet</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {form.projectStats.map((stat, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              placeholder="Label"
                              value={stat.label}
                              onChange={(e) => handleArrayChange("projectStats", idx, "label", e.target.value)}
                            />
                            <Input
                              placeholder="Valeur"
                              value={stat.value}
                              onChange={(e) => handleArrayChange("projectStats", idx, "value", e.target.value)}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeArrayItem("projectStats", idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addArrayItem("projectStats", { label: "", value: "" })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une statistique
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Challenges */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Défis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {form.challenges.map((challenge, idx) => (
                          <div key={idx} className="space-y-2 p-4 border rounded-lg">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Titre du défi"
                                value={challenge.title}
                                onChange={(e) => handleArrayChange("challenges", idx, "title", e.target.value)}
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeArrayItem("challenges", idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              placeholder="Description"
                              value={challenge.description}
                              onChange={(e) => handleArrayChange("challenges", idx, "description", e.target.value)}
                            />
                            <Input
                              placeholder="Impact"
                              value={challenge.impact}
                              onChange={(e) => handleArrayChange("challenges", idx, "impact", e.target.value)}
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addArrayItem("challenges", { title: "", description: "", impact: "" })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un défi
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Solutions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Solutions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {form.solutions.map((solution, idx) => (
                          <div key={idx} className="space-y-2 p-4 border rounded-lg">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Module"
                                value={solution.module}
                                onChange={(e) => handleArrayChange("solutions", idx, "module", e.target.value)}
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeArrayItem("solutions", idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              placeholder="Description"
                              value={solution.description}
                              onChange={(e) => handleArrayChange("solutions", idx, "description", e.target.value)}
                            />
                            <Input
                              placeholder="Bénéfice"
                              value={solution.benefit}
                              onChange={(e) => handleArrayChange("solutions", idx, "benefit", e.target.value)}
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addArrayItem("solutions", { module: "", description: "", benefit: "" })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une solution
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Testimonial */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Témoignage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasTestimonial"
                            checked={form.testimonial !== null}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setForm(f => ({ ...f, testimonial: { quote: "", author: "", role: "", initials: "" } }));
                              } else {
                                setForm(f => ({ ...f, testimonial: null }));
                              }
                            }}
                          />
                          <Label htmlFor="hasTestimonial">Inclure un témoignage</Label>
                        </div>
                        {form.testimonial && (
                          <div className="space-y-4">
                            <Input
                              placeholder="Citation"
                              value={form.testimonial.quote}
                              onChange={(e) => setForm(f => ({ ...f, testimonial: { ...f.testimonial!, quote: e.target.value } }))}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                placeholder="Auteur"
                                value={form.testimonial.author}
                                onChange={(e) => setForm(f => ({ ...f, testimonial: { ...f.testimonial!, author: e.target.value } }))}
                              />
                              <Input
                                placeholder="Rôle"
                                value={form.testimonial.role}
                                onChange={(e) => setForm(f => ({ ...f, testimonial: { ...f.testimonial!, role: e.target.value } }))}
                              />
                              <Input
                                placeholder="Initiales"
                                value={form.testimonial.initials}
                                onChange={(e) => setForm(f => ({ ...f, testimonial: { ...f.testimonial!, initials: e.target.value } }))}
                              />
                            </div>
                          </div>
                        )}
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
                  {editing !== "new" && editing !== null && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      className="min-w-[120px] text-base font-semibold"
                      onClick={() => typeof editing === 'number' && deleteClient(editing)}
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Supprimer
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="lg"
                    className="min-w-[160px] text-base font-bold bg-[--color-black] hover:bg-primary-dark text-white shadow-lg"
                    onClick={saveClient}
                    disabled={saving}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Clients Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {clients.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cas client</h3>
                <p className="text-gray-500">Commencez par créer votre premier cas client.</p>
              </div>
            ) : (
              clients.map((client, idx) => (
                <Card key={idx} className="p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[200px] sm:min-h-[230px]">
                  {/* Top Section: Icon, Title, Description */}
                  <div>
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-green-100">
                        {client.logo ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
                            <Image
                              src={client.logo}
                              alt={client.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wider truncate">
                          {client.name || "Sans nom"}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 capitalize">{client.sector || "Secteur non défini"}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-lg text-gray-600 truncate">
                      {client.headline || "Aucun titre"}
                    </p>
                  </div>

                  {/* Bottom Section: Status & Actions */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-4 sm:mt-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${client.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {client.featured ? 'Mis en avant' : 'Standard'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editClient(idx)}
                        className="border-gray-300 hover:bg-gray-100 text-xs sm:text-sm"
                      >
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
} 