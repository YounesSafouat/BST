"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Quote, Briefcase, Pencil, Trash2, Eye, X } from "lucide-react";
import Loader from "@/components/home/Loader"
import dynamic from "next/dynamic";

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
  migration: string;
  logo: string;
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
    migration: "",
    logo: "",
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

  // Fetch client cases from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/content?type=clients-page")
      .then((res) => res.json())
      .then((data) => {
        const page = Array.isArray(data) ? data[0] : data;
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
  }

  function newClient() {
    setEditing("new");
    setForm(emptyClient());
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyClient());
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
  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Cas Clients</h1>
      {editing === null ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cas Clients</h2>
            <Button onClick={newClient}>Nouveau cas client</Button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.length === 0 && <div className="col-span-full">Aucun cas client.</div>}
              {clients.map((client, idx) => (
                <Card key={idx} className="p-4 flex flex-col hover:shadow-lg transition-shadow duration-300">
                  {/* Top Section */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-md bg-purple-100 flex-shrink-0 mt-1">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-gray-900 uppercase truncate" title={client.name}>
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{client.sector}</p>
                    </div>
                  </div>

                  {/* Middle Section (Headline) */}
                  <div className="flex-grow py-4">
                    <p className="text-gray-700" title={client.headline}>
                      {client.headline}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      client.featured ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-transparent'
                    }`}>
                      {client.featured ? 'En vedette' : ''}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm" className="border-gray-300" onClick={() => setPreviewing(client)}>
                        <Eye className="w-4 h-4 mr-1" /> Aperçu
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300" onClick={() => editClient(idx)}>
                        <Pencil className="w-4 h-4 mr-1" /> Éditer
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteClient(idx)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={e => { e.preventDefault(); saveClient(); }}
          >
            <h2 className="text-xl font-semibold mb-2">{editing === "new" ? "Nouveau cas client" : "Éditer le cas client"}</h2>
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="headline">Titre principal</Label>
              <Input id="headline" name="headline" value={form.headline} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="summary">Résumé</Label>
              <Input id="summary" name="summary" value={form.summary} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="sector">Secteur</Label>
              <Input id="sector" name="sector" value={form.sector} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="size">Taille</Label>
              <Input id="size" name="size" value={form.size} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="migration">Migration</Label>
              <Input id="migration" name="migration" value={form.migration} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="logo">Logo (texte ou URL)</Label>
              <Input id="logo" name="logo" value={form.logo} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="featured">À la une</Label>
              <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="featuredInHeader">Afficher dans l'en-tête (header)</Label>
              <input type="checkbox" id="featuredInHeader" name="featuredInHeader" checked={form.featuredInHeader || false} onChange={handleChange} />
            </div>
            {/* Project Stats */}
            <div>
              <Label>Statistiques du projet</Label>
              {(form.projectStats || []).map((stat, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={e => handleArrayChange("projectStats", idx, "label", e.target.value)}
                    className="w-1/2"
                  />
                  <Input
                    placeholder="Valeur"
                    value={stat.value}
                    onChange={e => handleArrayChange("projectStats", idx, "value", e.target.value)}
                    className="w-1/2"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeArrayItem("projectStats", idx)}>Suppr</Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => addArrayItem("projectStats", { label: "", value: "" })}>Ajouter</Button>
            </div>
            {/* Challenges */}
            <div>
              <Label>Défis</Label>
              {(form.challenges || []).map((ch, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Titre"
                    value={ch.title}
                    onChange={e => handleArrayChange("challenges", idx, "title", e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Description"
                    value={ch.description}
                    onChange={e => handleArrayChange("challenges", idx, "description", e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Impact"
                    value={ch.impact}
                    onChange={e => handleArrayChange("challenges", idx, "impact", e.target.value)}
                    className="w-1/3"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeArrayItem("challenges", idx)}>Suppr</Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => addArrayItem("challenges", { title: "", description: "", impact: "" })}>Ajouter</Button>
            </div>
            {/* Solutions */}
            <div>
              <Label>Solutions</Label>
              {(form.solutions || []).map((sol, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Module"
                    value={sol.module}
                    onChange={e => handleArrayChange("solutions", idx, "module", e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Description"
                    value={sol.description}
                    onChange={e => handleArrayChange("solutions", idx, "description", e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Bénéfice"
                    value={sol.benefit}
                    onChange={e => handleArrayChange("solutions", idx, "benefit", e.target.value)}
                    className="w-1/3"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeArrayItem("solutions", idx)}>Suppr</Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => addArrayItem("solutions", { module: "", description: "", benefit: "" })}>Ajouter</Button>
            </div>
            {/* Testimonial */}
            <div>
              <Label>Témoignage</Label>
              {form.testimonial ? (
                <>
                  <Input
                    placeholder="Citation"
                    name="quote"
                    value={form.testimonial?.quote || ""}
                    onChange={e => setForm(f => ({
                      ...f,
                      testimonial: {
                        quote: e.target.value,
                        author: f.testimonial?.author || '',
                        role: f.testimonial?.role || '',
                        initials: f.testimonial?.initials || ''
                      }
                    }))}
                  />
                  <Input
                    placeholder="Auteur"
                    name="author"
                    value={form.testimonial?.author || ""}
                    onChange={e => setForm(f => ({
                      ...f,
                      testimonial: {
                        quote: f.testimonial?.quote || '',
                        author: e.target.value,
                        role: f.testimonial?.role || '',
                        initials: f.testimonial?.initials || ''
                      }
                    }))}
                  />
                  <Input
                    placeholder="Rôle"
                    name="role"
                    value={form.testimonial?.role || ""}
                    onChange={e => setForm(f => ({
                      ...f,
                      testimonial: {
                        quote: f.testimonial?.quote || '',
                        author: f.testimonial?.author || '',
                        role: e.target.value,
                        initials: f.testimonial?.initials || ''
                      }
                    }))}
                  />
                  <Input
                    placeholder="Initiales"
                    name="initials"
                    value={form.testimonial?.initials || ""}
                    onChange={e => setForm(f => ({
                      ...f,
                      testimonial: {
                        quote: f.testimonial?.quote || '',
                        author: f.testimonial?.author || '',
                        role: f.testimonial?.role || '',
                        initials: e.target.value
                      }
                    }))}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => setForm(f => ({ ...f, testimonial: null }))}>Supprimer</Button>
                </>
              ) : (
                <Button type="button" size="sm" onClick={() => setForm(f => ({ ...f, testimonial: { quote: '', author: '', role: '', initials: '' } }))}>Ajouter Témoignage</Button>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {previewing && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewing(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-700">Aperçu du Cas Client: {previewing.name}</h3>
              <Button variant="ghost" size="icon" onClick={() => setPreviewing(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <ClientPagePreview client={previewing} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 