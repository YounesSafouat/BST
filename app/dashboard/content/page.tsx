"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Plus, X, Eye, Save } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { 
    ContentSection, HeroContent, ChallengeContent, SolutionContent, TransformationContent, 
    SuccessContent, CTAContent, HeroStat, HeroStatus, Challenge, Solution, Step, Testimonial, Action, Location 
} from '@/app/types/content';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Loader from '@/components/home/Loader';
import { availableIcons } from '@/lib/iconList';

// Lazy load components for preview to prevent performance issues
import dynamic from 'next/dynamic';

const HeroSection2 = dynamic(() => import("@/components/home/hero/HeroSection"), { ssr: false });
const ChallengeSection = dynamic(() => import("@/components/home/challenge/ChallengeSection"), { ssr: false });
const SolutionSection = dynamic(() => import("@/components/home/solution/SolutionSection"), { ssr: false });
const TransformationSection = dynamic(() => import("@/components/home/transformation/TransformationSection"), { ssr: false });
const SuccessSection = dynamic(() => import("@/components/home/success/SuccessSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/home/cta/CTASection"), { ssr: false });

// --- INTERFACES (TOP-LEVEL) ---

// --- MAIN DASHBOARD COMPONENT ---
export default function ContentDashboard() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentSection | null>(null);
  const [currentFormData, setCurrentFormData] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const editViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch("/api/content", { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]); // Set empty array on error
    } 
    finally { 
      setLoading(false);
    }
  };

  const openModal = (item: ContentSection, mode: 'edit' | 'preview' = 'edit') => {
    setSelectedItem(item);
    setCurrentFormData(item);
    setIsModalOpen(true);
    setEditMode(mode === 'edit');
    setPreviewMode(mode === 'preview');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    setEditMode(false);
    setPreviewMode(false);
  };

  const handleSave = async (updatedData: ContentSection) => {
    try {
      console.log('Saving data:', updatedData);
      const response = await fetch(`/api/content/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        throw new Error(`Failed to update: ${errorData.error || response.statusText}`);
      }
      const savedData = await response.json();
      console.log('Save successful:', savedData);
      await fetchSections();
      closeModal();
    } catch (error) {
      console.error("Error updating section:", error);
      alert(`Erreur lors de la sauvegarde: ${error}`);
    }
  };

  const allowedSections = ['hero', 'challenge', 'solution', 'transformation', 'success', 'cta'];
  const sortedContent = sections
    .filter(item => allowedSections.includes(item.type))
    .sort((a, b) => (a.metadata?.order || 999) - (b.metadata?.order || 999));

    return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion du Contenu</h1>
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <>
            {isModalOpen && selectedItem && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl lg:max-w-7xl h-[90vh] sm:h-[95vh] flex flex-col">
                  <div className="flex justify-between items-center p-3 sm:p-4 border-b">
                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">{editMode ? `Modifier: ${selectedItem.type}` : `Aperçu: ${selectedItem.type}`}</h2>
                    <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8 sm:h-10 sm:w-10">
                      <X className="h-4 w-4 sm:h-6 sm:w-6" />
                    </Button>
                  </div>
                  <div className="flex-grow overflow-y-auto">
                    {previewMode ? (
                      <div className="p-3 sm:p-6 h-full">
                        <div className="max-w-4xl mx-auto">
                          {renderSectionPreview(selectedItem)}
                        </div>
                      </div>
                    ) : (
                      <EditView item={selectedItem} onSave={handleSave} onCancel={closeModal} onFormDataChange={setCurrentFormData} />
                    )}
                  </div>
                  {/* Sticky Action Bar */}
                  {!previewMode && (
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t mt-0 bg-white sticky bottom-0 z-20 px-4 pb-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        className="min-w-[120px] text-base font-semibold" 
                        onClick={closeModal}
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="button" 
                        size="lg" 
                        className="min-w-[160px] text-base font-bold bg-[--color-black] hover:bg-primary-dark text-white shadow-lg" 
                        onClick={() => currentFormData && handleSave(currentFormData)}
                      >
                        <Save className="h-5 w-5 mr-2" />Enregistrer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedContent.map((item) => (
                <Card key={item._id} className="p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[200px] sm:min-h-[230px]">
                  {/* Top Section: Icon, Title, Description */}
        <div>
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg bg-gray-100`}>
                        <span className="text-xl sm:text-2xl">{getSectionIcon(item.type)}</span>
        </div>
        <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wider">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 capitalize">{item.type}</p>
          </div>
                    </div>
                    <p className="text-sm sm:text-lg text-gray-600">{item.description}</p>
                  </div>

                  {/* Bottom Section: Status & Actions */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-4 sm:mt-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      {item.metadata?.order && (
                        <span className="text-xs sm:text-sm font-semibold text-gray-400">#{item.metadata.order}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                  <Button
                        variant="outline" 
                        size="sm" 
                        onClick={() => openModal(item, 'preview')}
                        className="text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Aperçu
                      </Button>
                      <Button
                        size="sm" 
                        onClick={() => openModal(item, 'edit')}
                        className="text-xs sm:text-sm bg-[--color-black] hover:bg-primary-dark text-white"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
    </div>
  );
}

// --- HELPER FUNCTIONS & COMPONENTS (DEFINED AT TOP-LEVEL) ---

const getSectionIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
        hero: <LucideIcons.Home />, challenge: <LucideIcons.AlertTriangle />, solution: <LucideIcons.Lightbulb />,
        transformation: <LucideIcons.Rocket />, success: <LucideIcons.Award />, cta: <LucideIcons.Phone />,
        header: <LucideIcons.ArrowUp />, footer: <LucideIcons.ArrowDown />, contact: <LucideIcons.Mail />, default: <LucideIcons.HelpCircle />
    };
    return icons[type] || icons.default;
};

const getSectionColor = (type: string) => {
    const colors: { [key: string]: string } = {
        hero: "bg-blue-500", challenge: "bg-yellow-500", solution: "bg-green-500",
        transformation: "bg-purple-500", success: "bg-teal-500", cta: "bg-orange-500",
    };
    return colors[type] || "bg-gray-500";
};

const renderSectionPreview = (section: ContentSection) => {
    if (!section) return null;
    
    try {
        console.log('Rendering preview for section:', section.type, section);
        
        switch (section.type) {
            case 'hero': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <HeroSection2 hero={section} />
                        </div>
                    </div>
                );
            case 'challenge': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <ChallengeSection challenge={section} />
                        </div>
                    </div>
                );
            case 'solution': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <SolutionSection solution={section} />
                        </div>
                    </div>
                );
            case 'transformation': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <TransformationSection transformation={section} />
                        </div>
                    </div>
                );
            case 'success': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <SuccessSection success={section} />
                        </div>
                    </div>
                );
            case 'cta': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <CTASection cta={section} />
                        </div>
                    </div>
                );
            default: 
                return (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Type: {section.type}</div>
                            <div className="text-xs text-gray-500">ID: {section._id}</div>
                            {section.metadata && (
                                <div className="text-xs text-gray-500">
                                    Order: {section.metadata.order || 'N/A'} | 
                                    Active: {section.isActive ? 'Yes' : 'No'}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 p-3 bg-white rounded border">
                            <div className="text-xs text-gray-500 mb-2">Content Preview:</div>
                            <pre className="text-xs overflow-auto max-h-40">
                                {JSON.stringify(section.content, null, 2)}
                            </pre>
                        </div>
                    </div>
                );
        }
    } catch (error) {
        console.error('Error rendering preview for section:', section.type, error);
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900">Erreur de prévisualisation</h3>
                <p className="text-sm text-red-700">Impossible de prévisualiser cette section: {section.type}</p>
                <p className="text-xs text-red-600 mt-2">Erreur: {error instanceof Error ? error.message : 'Erreur inconnue'}</p>
                <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">
                    {JSON.stringify(section.content, null, 2)}
                </pre>
            </div>
        );
    }
}

// Preview component with loading state
function PreviewComponent({ section }: { section: ContentSection }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // Simulate loading time for dynamic imports
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [section]);
    
    if (isLoading) {
        return <Loader />;
    }
    
    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">Erreur de chargement: {error}</p>
                <div className="mt-2 p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-2">Aperçu JSON:</div>
                    <pre className="text-xs overflow-auto max-h-40">
                        {JSON.stringify(section.content, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }
    
    return renderSectionPreview(section);
}

// Special preview renderer for edit mode with better responsive design
function renderEditPreview(section: ContentSection) {
    if (!section) return null;
    
    try {
        switch (section.type) {
            case 'hero': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <HeroSection2 hero={section} />
                        </div>
                    </div>
                );
            case 'challenge': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <ChallengeSection challenge={section} />
                        </div>
                    </div>
                );
            case 'solution': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <SolutionSection solution={section} />
                        </div>
                    </div>
                );
            case 'transformation': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <TransformationSection transformation={section} />
                        </div>
                    </div>
                );
            case 'success': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <SuccessSection success={section} />
                        </div>
                    </div>
                );
            case 'cta': 
                return (
                    <div className="preview-container w-full max-w-full overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="w-full">
                            <CTASection cta={section} />
                        </div>
                    </div>
                );
            default: 
                return (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Type: {section.type}</div>
                            <div className="text-xs text-gray-500">ID: {section._id}</div>
                            {section.metadata && (
                                <div className="text-xs text-gray-500">
                                    Order: {section.metadata.order || 'N/A'} | 
                                    Active: {section.isActive ? 'Yes' : 'No'}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 p-3 bg-white rounded border">
                            <div className="text-xs text-gray-500 mb-2">Content Preview:</div>
                            <pre className="text-xs overflow-auto max-h-40">
                                {JSON.stringify(section.content, null, 2)}
                            </pre>
                        </div>
                    </div>
                );
        }
    } catch (error) {
        console.error('Error rendering preview:', error);
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900">Erreur de prévisualisation</h3>
                <p className="text-sm text-red-700">Impossible de prévisualiser cette section.</p>
                <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">
                    {JSON.stringify(section.content, null, 2)}
                </pre>
            </div>
        );
    }
}

function EditView({ item, onSave, onCancel, onFormDataChange }: { 
  item: ContentSection; 
  onSave: (data: ContentSection) => void; 
  onCancel: () => void;
  onFormDataChange: (data: ContentSection) => void;
}) {
    const [formData, setFormData] = useState<ContentSection>(item);
    
    const handleFormDataChange = (newData: ContentSection) => {
        setFormData(newData);
        onFormDataChange(newData);
    };
    
    return (
      <div className="flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
          <ResizablePanel defaultSize={45} minSize={25}>
            <div className="h-full overflow-y-auto p-1">
              <DynamicForm item={formData} onChange={handleFormDataChange} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={35}>
            <div className="h-full overflow-y-auto bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-center mb-4 p-2 bg-gray-200 rounded-md">Aperçu en temps réel</h3>
              <div className="w-full h-full overflow-auto">
                <div className="min-w-full">
                  {renderEditPreview(formData)}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
}

function DynamicForm({ item, onChange }: { item: ContentSection; onChange: (data: ContentSection) => void; }) {
    const props = { data: item, onChange };
    switch (item.type) {
      case 'hero': return <HeroForm {...props} />;
      case 'challenge': return <ChallengeForm {...props} />;
      case 'solution': return <SolutionForm {...props} />;
      case 'transformation': return <TransformationForm {...props} />;
      case 'success': return <SuccessForm {...props} />;
      case 'cta': return <CTAForm {...props} />;
      default: return <GenericForm {...props} />;
    }
};

function HeroForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }) {
    const content = data.content as any;
    const handleContentChange = (field: string, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    
    // Handle nested object changes
    const handleNestedChange = (parentField: string, childField: string, value: any) => {
        const parent = content[parentField] || {};
        handleContentChange(parentField, { ...parent, [childField]: value });
    };

    // Handle array changes
    const handleArrayChange = (field: string, index: number, childField: string, value: any) => {
        const array = [...(content[field] || [])];
        array[index] = { ...array[index], [childField]: value };
        handleContentChange(field, array);
    };

    const addArrayItem = (field: string, defaultItem: any) => {
        const array = [...(content[field] || []), defaultItem];
        handleContentChange(field, array);
    };

    const removeArrayItem = (field: string, index: number) => {
        const array = (content[field] || []).filter((_: any, i: number) => i !== index);
        handleContentChange(field, array);
    };

    return (
        <div className="space-y-6 p-2">
            {/* Basic Information */}
            <Card>
                <CardHeader><CardTitle>Informations de Base</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Titre Principal</Label>
                        <Input 
                            value={data.title || ""} 
                            onChange={(e) => onChange({ ...data, title: e.target.value })}
                            className="w-full"
                        />
                              </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            value={data.description || ""} 
                            onChange={(e) => onChange({ ...data, description: e.target.value })}
                            className="w-full min-h-[80px]"
                        />
        </div>
                    <div className="space-y-2">
                        <Label>Sous-titre (HTML autorisé)</Label>
                        <Textarea 
                            value={content.subtitle || ""} 
                            onChange={(e) => handleContentChange("subtitle", e.target.value)} 
                            placeholder="Utilisez des balises HTML et des variables CSS comme var(--color-main)"
                            className="w-full min-h-[100px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Logos */}
            <Card>
                <CardHeader><CardTitle>Logos</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Logo Odoo URL</Label>
                            <Input 
                                value={content.logos?.odoo?.url || ""} 
                                onChange={(e) => handleNestedChange("logos", "odoo", { ...content.logos?.odoo, url: e.target.value })} 
                                placeholder="https://example.com/odoo-logo.svg"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo Odoo Alt Text</Label>
                            <Input 
                                value={content.logos?.odoo?.alt || ""} 
                                onChange={(e) => handleNestedChange("logos", "odoo", { ...content.logos?.odoo, alt: e.target.value })} 
                                placeholder="Odoo ERP"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo HubSpot URL</Label>
                            <Input 
                                value={content.logos?.hubspot?.url || ""} 
                                onChange={(e) => handleNestedChange("logos", "hubspot", { ...content.logos?.hubspot, url: e.target.value })} 
                                placeholder="https://example.com/hubspot-logo.svg"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo HubSpot Alt Text</Label>
                            <Input 
                                value={content.logos?.hubspot?.alt || ""} 
                                onChange={(e) => handleNestedChange("logos", "hubspot", { ...content.logos?.hubspot, alt: e.target.value })} 
                                placeholder="HubSpot CRM"
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Integrations */}
            <Card>
                <CardHeader><CardTitle>Intégrations (Rotation automatique)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {(content.integrations || []).map((integration: any, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 border rounded-lg bg-gray-50">
                            <div className="flex-1 space-y-2 w-full">
                                <Input 
                                    value={integration.text || ""} 
                                    onChange={(e) => handleArrayChange("integrations", index, "text", e.target.value)} 
                                    placeholder="Intégration Odoo"
                                    className="w-full"
                                />
                                <div className="flex gap-2 items-center">
                                <Input 
                                    value={integration.icon || ""} 
                                    onChange={(e) => handleArrayChange("integrations", index, "icon", e.target.value)} 
                                        placeholder="https://example.com/icon.svg or Lucide icon name"
                                    className="w-full"
                                />
                                    <Select
                                        value={integration.icon || ""}
                                        onValueChange={(value) => handleArrayChange("integrations", index, "icon", value)}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Lucide Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIcons.map((icon: any) => (
                                                <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Preview */}
                                    {integration.icon && (integration.icon.startsWith("/") || integration.icon.startsWith("http")) ? (
                                        <img src={integration.icon} alt="icon" className="w-6 h-6" />
                                    ) : integration.icon && (LucideIcons as any)[integration.icon] ? (
                                        React.createElement((LucideIcons as any)[integration.icon], { className: "w-6 h-6" })
                                    ) : null}
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeArrayItem("integrations", index)}
                                className="shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => addArrayItem("integrations", { text: "", icon: "" })}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />Ajouter une intégration
                    </Button>
                </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
                <CardHeader><CardTitle>Spécifications (Rotation automatique)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {(content.specifications || []).map((specification: any, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 border rounded-lg bg-gray-50">
                            <div className="flex-1 space-y-2 w-full">
                                <Input 
                                    value={specification.text || ""} 
                                    onChange={(e) => handleArrayChange("specifications", index, "text", e.target.value)} 
                                    placeholder="Livraison rapide"
                                    className="w-full"
                                />
                                <div className="flex gap-2 items-center">
                                <Input 
                                    value={specification.icon || ""} 
                                    onChange={(e) => handleArrayChange("specifications", index, "icon", e.target.value)} 
                                        placeholder="https://example.com/icon.svg or Lucide icon name"
                                    className="w-full"
                                />
                                    <Select
                                        value={specification.icon || ""}
                                        onValueChange={(value) => handleArrayChange("specifications", index, "icon", value)}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Lucide Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIcons.map((icon: any) => (
                                                <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Preview */}
                                    {specification.icon && (specification.icon.startsWith("/") || specification.icon.startsWith("http")) ? (
                                        <img src={specification.icon} alt="icon" className="w-6 h-6" />
                                    ) : specification.icon && (LucideIcons as any)[specification.icon] ? (
                                        React.createElement((LucideIcons as any)[specification.icon], { className: "w-6 h-6" })
                                    ) : null}
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeArrayItem("specifications", index)}
                                className="shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => addArrayItem("specifications", { text: "", icon: "" })}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />Ajouter une spécification
                    </Button>
                </CardContent>
            </Card>

            {/* Locations */}
            <Card>
                <CardHeader><CardTitle>Localisations (Rotation automatique)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {(content.locations || []).map((location: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">Texte</Label>
                                    <Input 
                                        value={location.text || ""} 
                                        onChange={(e) => handleArrayChange("locations", index, "text", e.target.value)} 
                                        placeholder="Depuis Casablanca"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Drapeau</Label>
                                    <Input 
                                        value={location.flag || ""} 
                                        onChange={(e) => handleArrayChange("locations", index, "flag", e.target.value)} 
                                        placeholder="🇲🇦"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Code</Label>
                                    <Input 
                                        value={location.code || ""} 
                                        onChange={(e) => handleArrayChange("locations", index, "code", e.target.value)} 
                                        placeholder="MA"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Icône</Label>
                                    <div className="flex gap-2 items-center">
                                    <Input 
                                        value={location.icon || ""} 
                                        onChange={(e) => handleArrayChange("locations", index, "icon", e.target.value)} 
                                            placeholder="https://example.com/icon.svg or Lucide icon name"
                                        className="w-full"
                                    />
                                        <Select
                                            value={location.icon || ""}
                                            onValueChange={(value) => handleArrayChange("locations", index, "icon", value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Lucide Icon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableIcons.map((icon: any) => (
                                                    <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/* Preview */}
                                        {location.icon && (location.icon.startsWith("/") || location.icon.startsWith("http")) ? (
                                            <img src={location.icon} alt="icon" className="w-6 h-6" />
                                        ) : location.icon && (LucideIcons as any)[location.icon] ? (
                                            React.createElement((LucideIcons as any)[location.icon], { className: "w-6 h-6" })
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeArrayItem("locations", index)}
                                className="w-full sm:w-auto"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />Supprimer
                            </Button>
                        </div>
                    ))}
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => addArrayItem("locations", { text: "", flag: "", code: "", icon: "" })}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />Ajouter une localisation
                    </Button>
                </CardContent>
            </Card>

            {/* CTA Buttons */}
            <Card>
                <CardHeader><CardTitle>Boutons d'Action</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    {/* Primary Button */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Bouton Principal</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Texte</Label>
                                <Input 
                                    value={content.ctaButtons?.primary?.text || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "primary", { ...content.ctaButtons?.primary, text: e.target.value })} 
                                    placeholder="PRENDRE UN RENDEZ-VOUS"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input 
                                    value={content.ctaButtons?.primary?.url || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "primary", { ...content.ctaButtons?.primary, url: e.target.value })} 
                                    placeholder="/contact"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Icône</Label>
                                <div className="flex gap-2 items-center">
                                <Input 
                                    value={content.ctaButtons?.primary?.icon || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "primary", { ...content.ctaButtons?.primary, icon: e.target.value })} 
                                        placeholder="https://example.com/calendar.svg or Lucide icon name"
                                    className="w-full"
                                />
                                    <Select
                                        value={content.ctaButtons?.primary?.icon || ""}
                                        onValueChange={(value) => handleNestedChange("ctaButtons", "primary", { ...content.ctaButtons?.primary, icon: value })}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Lucide Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIcons.map((icon: any) => (
                                                <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Preview */}
                                    {content.ctaButtons?.primary?.icon && (content.ctaButtons.primary.icon.startsWith("/") || content.ctaButtons.primary.icon.startsWith("http")) ? (
                                        <img src={content.ctaButtons.primary.icon} alt="icon" className="w-6 h-6" />
                                    ) : content.ctaButtons?.primary?.icon && (LucideIcons as any)[content.ctaButtons.primary.icon] ? (
                                        React.createElement((LucideIcons as any)[content.ctaButtons.primary.icon], { className: "w-6 h-6" })
                                    ) : null}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Couleur de fond</Label>
                                <Input 
                                    value={content.ctaButtons?.primary?.backgroundColor || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "primary", { ...content.ctaButtons?.primary, backgroundColor: e.target.value })} 
                                    placeholder="var(--color-main)"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Bouton Secondaire</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Texte</Label>
                                <Input 
                                    value={content.ctaButtons?.secondary?.text || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "secondary", { ...content.ctaButtons?.secondary, text: e.target.value })} 
                                    placeholder="TOUS NOS PROJETS"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input 
                                    value={content.ctaButtons?.secondary?.url || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "secondary", { ...content.ctaButtons?.secondary, url: e.target.value })} 
                                    placeholder="/cas-client"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Icône</Label>
                                <div className="flex gap-2 items-center">
                                <Input 
                                    value={content.ctaButtons?.secondary?.icon || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "secondary", { ...content.ctaButtons?.secondary, icon: e.target.value })} 
                                        placeholder="https://example.com/projects.svg or Lucide icon name"
                                    className="w-full"
                                />
                                    <Select
                                        value={content.ctaButtons?.secondary?.icon || ""}
                                        onValueChange={(value) => handleNestedChange("ctaButtons", "secondary", { ...content.ctaButtons?.secondary, icon: value })}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Lucide Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIcons.map((icon: any) => (
                                                <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Preview */}
                                    {content.ctaButtons?.secondary?.icon && (content.ctaButtons.secondary.icon.startsWith("/") || content.ctaButtons.secondary.icon.startsWith("http")) ? (
                                        <img src={content.ctaButtons.secondary.icon} alt="icon" className="w-6 h-6" />
                                    ) : content.ctaButtons?.secondary?.icon && (LucideIcons as any)[content.ctaButtons.secondary.icon] ? (
                                        React.createElement((LucideIcons as any)[content.ctaButtons.secondary.icon], { className: "w-6 h-6" })
                                    ) : null}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Couleur de bordure</Label>
                                <Input 
                                    value={content.ctaButtons?.secondary?.borderColor || ""} 
                                    onChange={(e) => handleNestedChange("ctaButtons", "secondary", { ...content.ctaButtons?.secondary, borderColor: e.target.value })} 
                                    placeholder="var(--color-main)"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Companies */}
            <Card>
                <CardHeader><CardTitle>Entreprises Partenaires (Carousel)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {(content.companies || []).map((company: any, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 border rounded-lg bg-gray-50">
                            <div className="flex-1 space-y-2 w-full">
                                <Input 
                                    value={company.name || ""} 
                                    onChange={(e) => handleArrayChange("companies", index, "name", e.target.value)} 
                                    placeholder="Odoo"
                                    className="w-full"
                                />
                                <Input 
                                    value={company.logo || ""} 
                                    onChange={(e) => handleArrayChange("companies", index, "logo", e.target.value)} 
                                    placeholder="https://example.com/logo.svg"
                                    className="w-full"
                                />
                            </div>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeArrayItem("companies", index)}
                                className="shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => addArrayItem("companies", { name: "", logo: "" })}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />Ajouter une entreprise
                    </Button>
                </CardContent>
            </Card>

            {/* Animations */}
            <Card>
                <CardHeader><CardTitle>Paramètres d'Animation</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vitesse de rotation des logos (ms)</Label>
                            <Input 
                                type="number" 
                                value={content.animations?.logoRotationSpeed || 3000} 
                                onChange={(e) => handleNestedChange("animations", "logoRotationSpeed", parseInt(e.target.value))} 
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vitesse de rotation des intégrations (ms)</Label>
                            <Input 
                                type="number" 
                                value={content.animations?.integrationRotationSpeed || 2000} 
                                onChange={(e) => handleNestedChange("animations", "integrationRotationSpeed", parseInt(e.target.value))} 
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vitesse de rotation des spécifications (ms)</Label>
                            <Input 
                                type="number" 
                                value={content.animations?.specificationRotationSpeed || 2500} 
                                onChange={(e) => handleNestedChange("animations", "specificationRotationSpeed", parseInt(e.target.value))} 
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vitesse de rotation des localisations (ms)</Label>
                            <Input 
                                type="number" 
                                value={content.animations?.locationRotationSpeed || 4000} 
                                onChange={(e) => handleNestedChange("animations", "locationRotationSpeed", parseInt(e.target.value))} 
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
                              </div>
    );
}

function ChallengeForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }) {
    const content = data.content as ChallengeContent;
    const handleContentChange = (field: keyof ChallengeContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    const handleChallengeChange = (index: number, field: keyof Challenge, value: string) => {
        const newChallenges = [...(content.challenges || [])];
        newChallenges[index] = { ...newChallenges[index], [field]: value };
        handleContentChange("challenges", newChallenges);
    };
    const addChallenge = () => handleContentChange("challenges", [...(content.challenges || []), { icon: 'AlertTriangle', title: '', description: '', impact: '' }]);
    const removeChallenge = (index: number) => handleContentChange("challenges", (content.challenges || []).filter((_, i) => i !== index));

    return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} /></div>
            <div><Label>Description (Intro)</Label><Textarea value={data.description || ""} onChange={(e) => onChange({ ...data, description: e.target.value })}/></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={(e) => handleContentChange("intro", e.target.value)} /></div>
            <div><Label>Badge</Label><Input value={content.badge || ""} onChange={(e) => handleContentChange("badge", e.target.value)} placeholder="LE DÉFI" /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Cartes de défis</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.challenges || []).map((challenge, index) => (
              <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center"><h4 className="font-semibold">Défi #{index + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeChallenge(index)}><Trash2 className="h-4 w-4" /></Button></div>
                <Label>Titre du défi</Label><Input value={challenge.title} onChange={(e) => handleChallengeChange(index, "title", e.target.value)} />
                <Label>Description</Label><Textarea value={challenge.description} onChange={(e) => handleChallengeChange(index, "description", e.target.value)} />
                <Label>Impact</Label><Input value={challenge.impact || ''} onChange={(e) => handleChallengeChange(index, "impact", e.target.value)} />
                <Label>Icône</Label><Select value={challenge.icon} onValueChange={(value) => handleChallengeChange(index, 'icon', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{availableIcons.map((icon: any) => <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>)}</SelectContent></Select>
        </div>
            ))}<Button type="button" variant="outline" onClick={addChallenge}><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
        </CardContent></Card>
        </div>
    );
}

function SolutionForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }) {
    const content = data.content as SolutionContent;
    const handleContentChange = (field: keyof SolutionContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    const handleSolutionChange = (index: number, field: keyof Solution, value: any) => {
        const newSolutions = [...(content.solutions || [])];
        newSolutions[index] = { ...newSolutions[index], [field]: value };
        handleContentChange("solutions", newSolutions);
    };
    const addSolution = () => handleContentChange("solutions", [...(content.solutions || []), { icon: 'Lightbulb', iconUrl: '', title: '', subtitle: '', description: '', color: '#000000', features: [] }]);
    const removeSolution = (index: number) => handleContentChange("solutions", (content.solutions || []).filter((_, i) => i !== index));
    const handleFeatureChange = (solIndex: number, featIndex: number, value: string) => {
        const newSolutions = [...(content.solutions || [])];
        const newFeatures = [...(newSolutions[solIndex].features || [])];
        newFeatures[featIndex] = value;
        newSolutions[solIndex].features = newFeatures;
        handleContentChange("solutions", newSolutions);
    };
    const addFeature = (solIndex: number) => handleFeatureChange(solIndex, (content.solutions?.[solIndex]?.features.length || 0), '');
    const removeFeature = (solIndex: number, featIndex: number) => {
        const newSolutions = [...(content.solutions || [])];
        newSolutions[solIndex].features = (newSolutions[solIndex].features || []).filter((_, i) => i !== featIndex);
        handleContentChange("solutions", newSolutions);
    };

      return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title} onChange={e => onChange({...data, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={e => handleContentChange("intro", e.target.value)} /></div>
            <div><Label>Badge</Label><Input value={content.badge || ""} onChange={e => handleContentChange("badge", e.target.value)} placeholder="NOS SOLUTIONS" /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Cartes de Solutions</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.solutions || []).map((solution, solIndex) => (
                <div key={solIndex} className="flex flex-col gap-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Solution #{solIndex + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeSolution(solIndex)}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Titre</Label><Input value={solution.title} onChange={e => handleSolutionChange(solIndex, "title", e.target.value)} /></div>
                        <div><Label>Sous-titre</Label><Input value={solution.subtitle} onChange={e => handleSolutionChange(solIndex, "subtitle", e.target.value)} /></div>
                        <div><Label>Icône</Label><Select value={solution.icon} onValueChange={v => handleSolutionChange(solIndex, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{availableIcons.map((icon: any) => <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>)}</SelectContent></Select></div>
                        <div><Label>URL Icône (optionnel)</Label><Input value={solution.iconUrl || ""} onChange={e => handleSolutionChange(solIndex, "iconUrl", e.target.value)} placeholder="https://example.com/icon.svg" /></div>
                        <div><Label>Couleur</Label><Input type="color" value={solution.color} onChange={e => handleSolutionChange(solIndex, "color", e.target.value)} /></div>
                        </div>
                    <div><Label>Description</Label><Textarea value={solution.description} onChange={e => handleSolutionChange(solIndex, "description", e.target.value)} /></div>
                    <div><Label>Fonctionnalités</Label>
                    <div className="space-y-2">
                        {(solution.features || []).map((feature, featIndex) => (
                            <div key={featIndex} className="flex items-center gap-2">
                                <Input value={feature} onChange={e => handleFeatureChange(solIndex, featIndex, e.target.value)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(solIndex, featIndex)}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => addFeature(solIndex)}><Plus className="h-4 w-4 mr-2" />Ajouter fonctionnalité</Button>
                    </div>
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addSolution}><Plus className="h-4 w-4 mr-2" />Ajouter une solution</Button>
        </CardContent></Card>
        </div>
      );
}

function GenericForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }){
    return (
        <div className="space-y-8 p-2">
            <Card><CardHeader><CardTitle>Contenu de la section</CardTitle></CardHeader><CardContent className="space-y-4">
                <div><Label>Titre</Label><Input value={data.title} onChange={(e) => onChange({...data, title: e.target.value})} /></div>
                <div><Label>Description</Label><Textarea value={data.description} onChange={(e) => onChange({...data, description: e.target.value})} /></div>
            </CardContent></Card>
      </div>
    );
  }

function TransformationForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }) {
    const content = data.content as TransformationContent;
    const handleContentChange = (field: keyof TransformationContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    const handleStepChange = (index: number, field: keyof Step, value: string) => {
        const newSteps = [...(content.steps || [])];
        newSteps[index] = { ...newSteps[index], [field]: value };
        handleContentChange("steps", newSteps);
    };
    const addStep = () => handleContentChange("steps", [...(content.steps || []), { step: '01', title: '', description: '', icon: 'Target', iconUrl: '', side: 'left' }]);
    const removeStep = (index: number) => handleContentChange("steps", (content.steps || []).filter((_, i) => i !== index));

                      return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title} onChange={e => onChange({...data, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={e => handleContentChange("intro", e.target.value)} /></div>
            <div><Label>Badge</Label><Input value={content.badge || ""} onChange={e => handleContentChange("badge", e.target.value)} placeholder="NOTRE MÉTHODOLOGIE" /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Étapes de Transformation</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.steps || []).map((step, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Étape #{index + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeStep(index)}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Numéro d'étape</Label><Input value={step.step} onChange={e => handleStepChange(index, "step", e.target.value)} /></div>
                        <div><Label>Côté</Label><Select value={step.side} onValueChange={v => handleStepChange(index, 'side', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="left">Gauche</SelectItem><SelectItem value="right">Droite</SelectItem></SelectContent></Select></div>
                        <div><Label>Icône</Label><Select value={step.icon} onValueChange={v => handleStepChange(index, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{availableIcons.map((icon: any) => <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>)}</SelectContent></Select></div>
                        <div><Label>URL Icône (optionnel)</Label><Input value={step.iconUrl || ""} onChange={e => handleStepChange(index, "iconUrl", e.target.value)} placeholder="https://example.com/icon.svg" /></div>
        </div>
                    <div><Label>Titre</Label><Input value={step.title} onChange={e => handleStepChange(index, "title", e.target.value)} /></div>
                    <div><Label>Description</Label><Textarea value={step.description} onChange={e => handleStepChange(index, "description", e.target.value)} /></div>
        </div>
            ))}
            <Button type="button" variant="outline" onClick={addStep}><Plus className="h-4 w-4 mr-2" />Ajouter une étape</Button>
        </CardContent></Card>
      </div>
    );
  }

function SuccessForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }) {
    const content = data.content as SuccessContent;
    const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const res = await fetch('/api/content?type=testimonial');
                const testimonialsData = await res.json();
                // Map the testimonials from the content structure
                const mapped = testimonialsData.map((item: any) => ({
                    _id: typeof item._id === 'object' && item._id.$oid ? item._id.$oid : item._id.toString(),
                    name: item.content?.name || item.title || '',
                    role: item.content?.role || item.description || '',
                    quote: item.content?.quote || item.content?.text || '',
                    avatar: item.content?.avatar || item.content?.photo || '',
                    result: item.content?.result || '',
                    company: item.content?.company || '',
                }));
                setAllTestimonials(mapped);
            } catch (e) {
                console.error('Error fetching testimonials:', e);
                setAllTestimonials([]);
            } finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, []);

    const handleContentChange = (field: keyof SuccessContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });

    if (loading) return <Loader />;

    return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title} onChange={e => onChange({...data, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={e => handleContentChange("intro", e.target.value)} /></div>
            <div><Label>Badge</Label><Input value={content.badge || ""} onChange={e => handleContentChange("badge", e.target.value)} placeholder="NOS RÉUSSITES" /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Témoignages</CardTitle></CardHeader><CardContent className="space-y-4">
            <Label>Sélectionner les témoignages à afficher</Label>
            <div className="space-y-2">
                <select
                    multiple
                    aria-label="Sélectionner les témoignages à afficher"
                    className="w-full border rounded p-2 min-h-[120px]"
                    value={content.testimonials || []}
                    onChange={e => {
                        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                        handleContentChange('testimonials', selected);
                    }}
                >
                    {allTestimonials.map((t, idx) => (
                        <option key={t._id + idx} value={t._id}>
                            {t.name} - {t.role} {t.company ? `(${t.company})` : ''}
                        </option>
                    ))}
                </select>
                <div className="text-xs text-gray-500">Astuce : Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs témoignages.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {(content.testimonials || []).map((testimonialId, idx) => {
                    const t = allTestimonials.find(t => t._id === testimonialId);
                    if (!t) return null;
                    return (
                        <Card key={t._id + idx} className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">{t.avatar || t.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <div className="font-semibold">{t.name}</div>
                                    <div className="text-xs text-gray-600">{t.role}</div>
                                    {t.company && <div className="text-xs text-gray-400">{t.company}</div>}
                                </div>
                            </div>
                            <blockquote className="italic text-gray-700 mb-2">"{t.quote}"</blockquote>
                            {t.result && <Badge variant="secondary">{t.result}</Badge>}
                        </Card>
                    );
                })}
            </div>
        </CardContent></Card>
      </div>
    );
}

function CTAForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void; }) {
    const content = data.content as CTAContent;
    const handleContentChange = (field: keyof CTAContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    const handleActionChange = (index: number, field: keyof Action, value: string) => {
        const newActions = [...(content.actions || [])];
        newActions[index] = { ...newActions[index], [field]: value };
        handleContentChange("actions", newActions);
    };
    const addAction = () => handleContentChange("actions", [...(content.actions || []), { label: '', icon: 'ArrowRight' }]);
    const removeAction = (index: number) => handleContentChange("actions", (content.actions || []).filter((_, i) => i !== index));
    const handleLocationChange = (index: number, field: keyof Location, value: string) => {
        const newLocations = [...(content.locations || [])];
        newLocations[index] = { ...newLocations[index], [field]: value };
        handleContentChange("locations", newLocations);
    };
    const addLocation = () => handleContentChange("locations", [...(content.locations || []), { icon: 'Globe', title: '', subtitle: '' }]);
    const removeLocation = (index: number) => handleContentChange("locations", (content.locations || []).filter((_, i) => i !== index));

                      return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title} onChange={e => onChange({...data, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={e => handleContentChange("intro", e.target.value)} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Actions</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.actions || []).map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                    <Input value={action.label} onChange={e => handleActionChange(index, "label", e.target.value)} placeholder="Texte du bouton" />
                    <Select value={action.icon} onValueChange={v => handleActionChange(index, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{availableIcons.map((icon: any) => <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>)}</SelectContent></Select>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeAction(index)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            ))}
            <Button type="button" variant="outline" onClick={addAction}><Plus className="h-4 w-4 mr-2" />Ajouter une action</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Localisations</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.locations || []).map((location, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Localisation #{index + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeLocation(index)}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Titre</Label><Input value={location.title} onChange={e => handleLocationChange(index, "title", e.target.value)} /></div>
                        <div><Label>Sous-titre</Label><Input value={location.subtitle} onChange={e => handleLocationChange(index, "subtitle", e.target.value)} /></div>
              </div>
                    <div><Label>Icône</Label><Select value={location.icon} onValueChange={v => handleLocationChange(index, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{availableIcons.map((icon: any) => <SelectItem key={icon.value} value={icon.value}><div className="flex items-center space-x-2"><icon.icon className="w-4 h-4" /><span>{icon.label}</span></div></SelectItem>)}</SelectContent></Select></div>
            </div>
            ))}
            <Button type="button" variant="outline" onClick={addLocation}><Plus className="h-4 w-4 mr-2" />Ajouter une localisation</Button>
        </CardContent></Card>
    </div>
  );
}