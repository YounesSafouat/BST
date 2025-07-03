"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Eye, Edit, X } from 'lucide-react';
import Loader from '@/components/home/Loader';

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  result: string;
  avatar: string;
}

export default function TestimonialsDashboard() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [previewing, setPreviewing] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetchTestimonialsData();
  }, []);

  const fetchTestimonialsData = async () => {
    try {
      const response = await fetch('/api/content?type=testimonial');
      if (response.ok) {
        const data = await response.json();
        // Each testimonial is in data[i].content
        setTestimonials(data.map((doc: any) => ({ _id: doc._id, ...doc.content })));
      }
    } catch (error) {
      console.error('Error fetching testimonials data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des témoignages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTestimonial = async () => {
    if (!editingTestimonial) return;
    if (!editingTestimonial.name || !editingTestimonial.role || !editingTestimonial.quote) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs obligatoires', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      let method = editingTestimonial._id ? 'PUT' : 'POST';
      let url = '/api/content?type=testimonial';
      if (editingTestimonial._id) url += `&_id=${editingTestimonial._id}`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'testimonial',
          title: editingTestimonial.name,
          description: editingTestimonial.role + (editingTestimonial.company ? ' - ' + editingTestimonial.company : ''),
          content: editingTestimonial,
        }),
      });
      if (response.ok) {
        toast({ title: 'Succès', description: 'Témoignage sauvegardé' });
        fetchTestimonialsData();
        setIsModalOpen(false);
        setEditingTestimonial(null);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({ title: 'Erreur', description: 'Erreur lors de la sauvegarde', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (testimonial: Testimonial) => {
    if (!testimonial._id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/content?type=testimonial&_id=${testimonial._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({ title: 'Supprimé', description: 'Témoignage supprimé' });
        fetchTestimonialsData();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () => {
    setEditingTestimonial({ name: '', role: '', company: '', quote: '', result: '', avatar: '' });
    setIsModalOpen(true);
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial({ ...testimonial });
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Témoignages</h1>
        <Button onClick={addTestimonial}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un témoignage
        </Button>
      </div>

      {/* Testimonials List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Témoignages ({testimonials.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial._id || index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.avatar || testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewing(testimonial)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editTestimonial(testimonial)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTestimonial(testimonial)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                "{testimonial.quote}"
              </p>
              {testimonial.result && (
                <Badge variant="secondary" className="text-xs">
                  {testimonial.result}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingTestimonial._id ? 'Modifier le témoignage' : 'Nouveau témoignage'}
              </h2>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nom *</Label>
                  <Input
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <Label>Poste *</Label>
                  <Input
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial(prev => prev ? { ...prev, role: e.target.value } : null)}
                    placeholder="Directeur, CEO, etc."
                  />
                </div>
              </div>

              <div>
                <Label>Entreprise</Label>
                <Input
                  value={editingTestimonial.company || ''}
                  onChange={(e) => setEditingTestimonial(prev => prev ? { ...prev, company: e.target.value } : null)}
                  placeholder="Nom de l'entreprise"
                />
              </div>

              <div>
                <Label>Témoignage *</Label>
                <Textarea
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial(prev => prev ? { ...prev, quote: e.target.value } : null)}
                  placeholder="Le témoignage du client..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Résultat</Label>
                <Input
                  value={editingTestimonial.result}
                  onChange={(e) => setEditingTestimonial(prev => prev ? { ...prev, result: e.target.value } : null)}
                  placeholder="+150% de croissance, etc."
                />
              </div>

              <div>
                <Label>Avatar (URL ou initiales)</Label>
                <Input
                  value={editingTestimonial.avatar}
                  onChange={(e) => setEditingTestimonial(prev => prev ? { ...prev, avatar: e.target.value } : null)}
                  placeholder="URL de l'image ou initiales (ex: JD)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={cancelEdit}>
                Annuler
              </Button>
              <Button onClick={saveTestimonial} disabled={saving}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Aperçu du témoignage</h2>
              <Button variant="ghost" size="sm" onClick={() => setPreviewing(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">
                  {previewing.avatar || previewing.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{previewing.name}</h3>
              <p className="text-gray-600 mb-1">{previewing.role}</p>
              {previewing.company && (
                <p className="text-sm text-gray-500 mb-4">{previewing.company}</p>
              )}
              <blockquote className="text-gray-700 italic mb-4">
                "{previewing.quote}"
              </blockquote>
              {previewing.result && (
                <Badge variant="secondary">
                  {previewing.result}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 