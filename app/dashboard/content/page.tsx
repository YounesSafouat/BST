"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Eye, Save } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

// Lazy load components for preview to prevent performance issues
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import("@/components/home/hero/HeroSection"), { ssr: false });
const ChallengeSection = dynamic(() => import("@/components/home/challenge/ChallengeSection"), { ssr: false });
const SolutionSection = dynamic(() => import("@/components/home/solution/SolutionSection"), { ssr: false });
const TransformationSection = dynamic(() => import("@/components/home/transformation/TransformationSection"), { ssr: false });
const SuccessSection = dynamic(() => import("@/components/home/success/SuccessSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/home/cta/CTASection"), { ssr: false });

// --- INTERFACES (TOP-LEVEL) ---
interface Challenge { icon: string; title: string; description: string; impact?: string; }
interface Solution { icon: string; title: string; subtitle: string; description: string; color: string; features: string[]; }
interface HeroStatus { text: string; icon: string; }
interface HeroStat { value: string; label: string; }
interface HeroContent { statuses?: HeroStatus[]; stats?: HeroStat[]; mainTitle?: string; subtitle?: string; }
interface ChallengeContent { intro?: string; challenges?: Challenge[]; }
interface SolutionContent { intro?: string; solutions?: Solution[]; }

// New interfaces for missing sections
interface Step { step: string; title: string; description: string; icon: string; side: 'left' | 'right'; }
interface TransformationContent { intro?: string; steps?: Step[]; }

interface Testimonial { name: string; role: string; quote: string; result: string; avatar: string; }
interface SuccessContent { intro?: string; testimonials?: Testimonial[]; }

interface Action { label: string; icon: string; }
interface Location { icon: string; title: string; subtitle: string; }
interface CTAContent { intro?: string; actions?: Action[]; locations?: Location[]; }

type ContentData = HeroContent | ChallengeContent | SolutionContent | TransformationContent | SuccessContent | CTAContent | Record<string, unknown>;
interface ContentSection {
  _id: string; type: string; title: string; description: string; content: ContentData;
  metadata?: { color?: string; image?: string; order?: number; };
  isActive: boolean;
}

// --- MAIN DASHBOARD COMPONENT ---
export default function ContentDashboard() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
      const response = await fetch(`/api/content/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Failed to update");
      await fetchSections();
      closeModal();
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const allowedSections = ['hero', 'challenge', 'solution', 'transformation', 'success', 'cta'];
  const sortedContent = sections
    .filter(item => allowedSections.includes(item.type))
    .sort((a, b) => (a.metadata?.order || 999) - (b.metadata?.order || 999));

    return (
    <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">Gestion du Contenu</h1></div>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Chargement du contenu...</p>
        </div>
        </div>
        ) : (
          <>
            {isModalOpen && selectedItem && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-semibold">{editMode ? `Modifier: ${selectedItem.type}` : `Aperçu: ${selectedItem.type}`}</h2>
                    <Button variant="ghost" size="icon" onClick={closeModal}><X className="h-6 w-6" /></Button>
        </div>
                  <div className="flex-grow overflow-y-auto p-1">
                    {previewMode ? <div className="p-6">{renderSectionPreview(selectedItem)}</div> : <EditView item={selectedItem} onSave={handleSave} onCancel={closeModal} />}
        </div>
      </div>
        </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContent.map((item) => (
                <Card key={item._id} className="p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 min-h-[230px]">
                  {/* Top Section: Icon, Title, Description */}
        <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg ${getSectionColor(item.type).replace('bg-', 'bg-').replace('-500', '-100')}`}>
                        <span className="text-2xl">{getSectionIcon(item.type)}</span>
        </div>
        <div>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">{item.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
          </div>
                    </div>
                    <p className="text-lg text-gray-600">{item.description}</p>
                  </div>

                  {/* Bottom Section: Status & Actions */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      {item.metadata?.order && (
                        <span className="text-sm font-semibold text-gray-400">#{item.metadata.order}</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                  <Button
                        variant="outline" 
                    size="sm"
                        onClick={(e) => { e.stopPropagation(); openModal(item, 'preview');}}
                        className="border-gray-300 hover:bg-gray-100"
                  >
                        <Eye className="w-4 h-4 mr-2" />
                        Aperçu
                  </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); openModal(item, 'edit');}}
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
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

// Common icons list to prevent performance issues
const commonIcons = [
  'Home', 'AlertTriangle', 'Lightbulb', 'Rocket', 'Award', 'Phone', 'Mail', 'ArrowUp', 'ArrowDown',
  'Activity', 'Zap', 'Star', 'Heart', 'Check', 'X', 'Plus', 'Minus', 'Settings', 'User', 'Users',
  'Calendar', 'Clock', 'MapPin', 'Globe', 'Shield', 'Lock', 'Unlock', 'Eye', 'EyeOff', 'Search',
  'Filter', 'Download', 'Upload', 'Share', 'Link', 'ExternalLink', 'Copy', 'Edit', 'Trash2', 'Save'
];

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
        switch (section.type) {
            case 'hero': 
    return (
                    <div className="preview-container scale-75 origin-top transform">
                        <HeroSection hero={section} />
                  </div>
                );
            case 'challenge': 
                return (
                    <div className="preview-container scale-75 origin-top transform">
                        <ChallengeSection challenge={section} />
                  </div>
                );
            case 'solution': 
                return (
                    <div className="preview-container scale-75 origin-top transform">
                        <SolutionSection solution={section} />
                      </div>
                );
            case 'transformation': 
                return (
                    <div className="preview-container scale-75 origin-top transform">
                        <TransformationSection transformation={section} />
          </div>
                );
            case 'success': 
                return (
                    <div className="preview-container scale-75 origin-top transform">
                        <SuccessSection />
                              </div>
                );
            case 'cta': 
                return (
                    <div className="preview-container scale-75 origin-top transform">
                        <CTASection />
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
    } catch (err) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">Erreur de rendu: {err instanceof Error ? err.message : 'Erreur inconnue'}</p>
                <div className="mt-2 p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-2">Aperçu JSON:</div>
                    <pre className="text-xs overflow-auto max-h-40">
                        {JSON.stringify(section.content, null, 2)}
                    </pre>
        </div>
        </div>
        );
    }
};

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
    return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Chargement de l'aperçu...</p>
                      </div>
        </div>
        );
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

function EditView({ item, onSave, onCancel }: { item: ContentSection; onSave: (data: ContentSection) => void; onCancel: () => void; }) {
    const [formData, setFormData] = useState<ContentSection>(item);
    return (
      <div className="flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
          <ResizablePanel defaultSize={50} minSize={30}><div className="h-full overflow-y-auto p-1"><DynamicForm item={formData} onChange={setFormData} /></div></ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}><div className="h-full overflow-y-auto bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-center mb-4 p-2 bg-gray-200 rounded-md">Aperçu</h3>
              <PreviewComponent section={formData} />
          </div></ResizablePanel>
        </ResizablePanelGroup>
        <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
            <Button type="button" onClick={() => onSave(formData)}><Save className="h-4 w-4 mr-2" />Enregistrer</Button>
                              </div>
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
    const content = data.content as HeroContent;
    const handleContentChange = (field: keyof HeroContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    const handleStatChange = (index: number, field: keyof HeroStat, value: string) => {
        const newStats = [...(content.stats || [])];
        newStats[index] = { ...newStats[index], [field]: value };
        handleContentChange("stats", newStats);
    };
    const addStat = () => handleContentChange("stats", [...(content.stats || []), { value: "", label: "" }]);
    const removeStat = (index: number) => handleContentChange("stats", (content.stats || []).filter((_, i) => i !== index));
    const handleStatusChange = (index: number, field: keyof HeroStatus, value: string) => {
        const newStatuses = [...(content.statuses || [])];
        newStatuses[index] = { ...newStatuses[index], [field]: value };
        handleContentChange("statuses", newStatuses);
    };
    const addStatus = () => handleContentChange("statuses", [...(content.statuses || []), { text: "", icon: "Activity" }]);
    const removeStatus = (index: number) => handleContentChange("statuses", (content.statuses || []).filter((_, i) => i !== index));

    return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre Principal</Label><Input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={data.description || ""} onChange={(e) => onChange({ ...data, description: e.target.value })}/></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Statuts animés</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.statuses || []).map((status, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                <Input value={status.text} onChange={(e) => handleStatusChange(index, "text", e.target.value)} placeholder="Texte du statut" />
                <Select value={status.icon} onValueChange={(value) => handleStatusChange(index, 'icon', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{commonIcons.map(iconName => <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>)}</SelectContent></Select>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeStatus(index)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
            ))}<Button type="button" variant="outline" onClick={addStatus}><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Statistiques</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.stats || []).map((stat, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                <Input value={stat.value} onChange={(e) => handleStatChange(index, "value", e.target.value)} placeholder="Valeur"/>
                <Input value={stat.label} onChange={(e) => handleStatChange(index, "label", e.target.value)} placeholder="Label"/>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeStat(index)}><Trash2 className="h-4 w-4" /></Button>
        </div>
            ))}<Button type="button" variant="outline" onClick={addStat}><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
        </CardContent></Card>
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
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Cartes de défis</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.challenges || []).map((challenge, index) => (
              <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center"><h4 className="font-semibold">Défi #{index + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeChallenge(index)}><Trash2 className="h-4 w-4" /></Button></div>
                <Label>Titre du défi</Label><Input value={challenge.title} onChange={(e) => handleChallengeChange(index, "title", e.target.value)} />
                <Label>Description</Label><Textarea value={challenge.description} onChange={(e) => handleChallengeChange(index, "description", e.target.value)} />
                <Label>Impact</Label><Input value={challenge.impact || ''} onChange={(e) => handleChallengeChange(index, "impact", e.target.value)} />
                <Label>Icône</Label><Select value={challenge.icon} onValueChange={(value) => handleChallengeChange(index, 'icon', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{commonIcons.map(iconName => <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>)}</SelectContent></Select>
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
    const addSolution = () => handleContentChange("solutions", [...(content.solutions || []), { icon: 'Lightbulb', title: '', subtitle: '', description: '', color: '#000000', features: [] }]);
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
            <div><Label>Intro</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Cartes de Solutions</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.solutions || []).map((solution, solIndex) => (
                <div key={solIndex} className="flex flex-col gap-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Solution #{solIndex + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeSolution(solIndex)}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Titre</Label><Input value={solution.title} onChange={e => handleSolutionChange(solIndex, "title", e.target.value)} /></div>
                        <div><Label>Sous-titre</Label><Input value={solution.subtitle} onChange={e => handleSolutionChange(solIndex, "subtitle", e.target.value)} /></div>
                        <div><Label>Icône</Label><Select value={solution.icon} onValueChange={v => handleSolutionChange(solIndex, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{commonIcons.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
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
    const addStep = () => handleContentChange("steps", [...(content.steps || []), { step: '01', title: '', description: '', icon: 'Target', side: 'left' }]);
    const removeStep = (index: number) => handleContentChange("steps", (content.steps || []).filter((_, i) => i !== index));

                      return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title} onChange={e => onChange({...data, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={e => handleContentChange("intro", e.target.value)} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Étapes de Transformation</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.steps || []).map((step, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Étape #{index + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeStep(index)}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Numéro d'étape</Label><Input value={step.step} onChange={e => handleStepChange(index, "step", e.target.value)} /></div>
                        <div><Label>Côté</Label><Select value={step.side} onValueChange={v => handleStepChange(index, 'side', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="left">Gauche</SelectItem><SelectItem value="right">Droite</SelectItem></SelectContent></Select></div>
                        <div><Label>Icône</Label><Select value={step.icon} onValueChange={v => handleStepChange(index, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{commonIcons.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
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
    const handleContentChange = (field: keyof SuccessContent, value: any) => onChange({ ...data, content: { ...content, [field]: value } });
    const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
        const newTestimonials = [...(content.testimonials || [])];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        handleContentChange("testimonials", newTestimonials);
    };
    const addTestimonial = () => handleContentChange("testimonials", [...(content.testimonials || []), { name: '', role: '', quote: '', result: '', avatar: '' }]);
    const removeTestimonial = (index: number) => handleContentChange("testimonials", (content.testimonials || []).filter((_, i) => i !== index));

        return (
      <div className="space-y-8 p-2">
        <Card><CardHeader><CardTitle>Titres</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Titre</Label><Input value={data.title} onChange={e => onChange({...data, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={data.description} onChange={e => onChange({...data, description: e.target.value})} /></div>
            <div><Label>Intro</Label><Textarea value={content.intro || ""} onChange={e => handleContentChange("intro", e.target.value)} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Témoignages</CardTitle></CardHeader><CardContent className="space-y-4">
            {(content.testimonials || []).map((testimonial, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Témoignage #{index + 1}</h4><Button type="button" variant="destructive" size="icon" onClick={() => removeTestimonial(index)}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Nom</Label><Input value={testimonial.name} onChange={e => handleTestimonialChange(index, "name", e.target.value)} /></div>
                        <div><Label>Rôle</Label><Input value={testimonial.role} onChange={e => handleTestimonialChange(index, "role", e.target.value)} /></div>
                        <div><Label>Avatar (Initiales)</Label><Input value={testimonial.avatar} onChange={e => handleTestimonialChange(index, "avatar", e.target.value)} /></div>
                        <div><Label>Résultat</Label><Input value={testimonial.result} onChange={e => handleTestimonialChange(index, "result", e.target.value)} /></div>
                  </div>
                    <div><Label>Témoignage</Label><Textarea value={testimonial.quote} onChange={e => handleTestimonialChange(index, "quote", e.target.value)} /></div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addTestimonial}><Plus className="h-4 w-4 mr-2" />Ajouter un témoignage</Button>
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
                    <Select value={action.icon} onValueChange={v => handleActionChange(index, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{commonIcons.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select>
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
                    <div><Label>Icône</Label><Select value={location.icon} onValueChange={v => handleLocationChange(index, 'icon', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{commonIcons.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
            </div>
            ))}
            <Button type="button" variant="outline" onClick={addLocation}><Plus className="h-4 w-4 mr-2" />Ajouter une localisation</Button>
        </CardContent></Card>
    </div>
  );
}