"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  Search, 
  Filter,
  Grid3X3,
  List,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Calendar,
  Users,
  Building,
  Target,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  Video,
  Quote,
  Text,
  Layers
} from "lucide-react";
import Loader from "@/components/home/Loader";
import Image from "next/image";
import Link from "next/link";
import { DynamicClientCase, ClientCaseFormData, ContentBlockType, AVAILABLE_SECTORS } from "@/lib/types/cas-client";
import CasClientEditor from "@/components/cms/CasClientEditor";

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<DynamicClientCase[]>([]);
  const [filteredClients, setFilteredClients] = useState<DynamicClientCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSolution, setSelectedSolution] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditor, setShowEditor] = useState(false);
  const [editingClient, setEditingClient] = useState<DynamicClientCase | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  // Fetch clients from the new API
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cas-client");
      const data = await response.json();
      setClients(data.cases || []);
      setFilteredClients(data.cases || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({ title: "Erreur", description: "Impossible de charger les cas clients." });
    } finally {
      setLoading(false);
    }
  };

  // Filter clients
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSolution !== "all") {
      filtered = filtered.filter(client => client.project.solution === selectedSolution);
    }

    if (selectedSector !== "all") {
      filtered = filtered.filter(client => client.company.sector === selectedSector);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, selectedSolution, selectedSector]);

  const handleCreateClient = () => {
    setEditingClient(null);
    setEditorMode('create');
    setShowEditor(true);
  };

  const handleEditClient = (client: DynamicClientCase) => {
    setEditingClient(client);
    setEditorMode('edit');
    setShowEditor(true);
  };

  const handleDeleteClient = async (slug: string) => {
    if (!window.confirm("Supprimer ce cas client ?")) return;
    
    try {
      const response = await fetch(`/api/cas-client/${slug}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({ title: "Succès", description: "Cas client supprimé." });
        fetchClients();
      } else {
        toast({ title: "Erreur", description: "Échec de la suppression." });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression." });
    }
  };

  const handleSaveClient = async (formData: ClientCaseFormData) => {
    try {
      const isEditing = editingClient && editingClient.slug;
      const url = isEditing ? `/api/cas-client/${editingClient.slug}` : "/api/cas-client";
      const method = isEditing ? 'PUT' : 'POST';
      
      // Debug: Log what we're sending
      console.log('Sending data to API:', {
        isEditing,
        url,
        method,
        formData: JSON.stringify(formData, null, 2)
      });
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedClient = await response.json();
        console.log('API Response:', updatedClient);
        
        toast({ 
          title: "Succès", 
          description: isEditing ? "Cas client mis à jour." : "Cas client créé." 
        });
        
        if (isEditing) {
          // Update the editingClient with fresh data
          console.log('Updating editingClient with:', updatedClient);
          setEditingClient(updatedClient);
        } else {
          // For new clients, close editor and refresh list
          setShowEditor(false);
          setEditingClient(null);
        }
        
        fetchClients();
      } else {
        const error = await response.json();
        toast({ title: "Erreur", description: error.error || "Échec de l'enregistrement." });
      }
    } catch (error) {
      console.error("Error saving client:", error);
      toast({ title: "Erreur", description: "Erreur lors de l'enregistrement." });
    }
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingClient(null);
  };

  const getSolutionLabel = (solution: string) => {
    const labels = {
      'hubspot': 'HubSpot',
      'odoo': 'Odoo',
      'both': 'HubSpot + Odoo',
      'custom': 'Personnalisé'
    };
    return labels[solution as keyof typeof labels] || solution;
  };

  const getSolutionColor = (solution: string) => {
    const colors = {
      'hubspot': 'bg-blue-100 text-blue-800',
      'odoo': 'bg-green-100 text-green-800',
      'both': 'bg-purple-100 text-purple-800',
      'custom': 'bg-gray-100 text-gray-800'
    };
    return colors[solution as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loader />;
  }

  if (showEditor) {
    return (
      <CasClientEditor
        key={`${editingClient?.slug || 'new'}-${editingClient?.updatedAt || Date.now()}`}
        initialData={editingClient || undefined}
        onSave={handleSaveClient}
        onCancel={handleCancelEditor}
        mode={editorMode}
      />
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cas Clients</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos études de cas clients avec le nouveau système dynamique
          </p>
        </div>
        <Button onClick={handleCreateClient} className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Cas Client
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un cas client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Solution Filter */}
            <Select value={selectedSolution} onValueChange={setSelectedSolution}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Solution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les solutions</SelectItem>
                <SelectItem value="hubspot">HubSpot</SelectItem>
                <SelectItem value="odoo">Odoo</SelectItem>
                <SelectItem value="both">HubSpot + Odoo</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>

            {/* Sector Filter */}
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Secteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les secteurs</SelectItem>
                {AVAILABLE_SECTORS.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Mis en avant</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Secteurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(clients.map(c => c.company.sector)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedSolution !== "all" || selectedSector !== "all" 
                ? "Aucun cas client trouvé" 
                : "Aucun cas client"
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedSolution !== "all" || selectedSector !== "all"
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par créer votre premier cas client."
              }
            </p>
            {(!searchTerm && selectedSolution === "all" && selectedSector === "all") && (
              <Button onClick={handleCreateClient} className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier cas client
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredClients.map((client) => (
            <Card key={client.slug} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          {client.company.logo ? (
                            <Image
                              src={client.company.logo}
                              alt={client.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <Building className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.company.sector}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {client.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Target className="w-3 h-3 mr-1" />
                            Mis en avant
                          </Badge>
                        )}
                        {!client.published && (
                          <Badge variant="outline" className="text-gray-500">
                            Brouillon
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {client.headline}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getSolutionColor(client.project.solution)}>
                        {getSolutionLabel(client.project.solution)}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {client.contentBlocks?.length || 0} sections
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Créé le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/cas-client/${client.slug}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.slug)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {client.company.logo ? (
                          <Image
                            src={client.company.logo}
                            alt={client.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                          {client.featured && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Target className="w-3 h-3 mr-1" />
                              Mis en avant
                            </Badge>
                          )}
                          {!client.published && (
                            <Badge variant="outline" className="text-gray-500">
                              Brouillon
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{client.headline}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">{client.company.sector}</span>
                          <Badge className={getSolutionColor(client.project.solution)}>
                            {getSolutionLabel(client.project.solution)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {client.contentBlocks?.length || 0} sections
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/cas-client/${client.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClient(client.slug)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}