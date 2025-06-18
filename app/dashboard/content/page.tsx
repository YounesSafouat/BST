"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Eye } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import AcceuilPage from "@/pages/acceuil-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroSection from "@/components/home/hero/HeroSection";
import ChallengeSection from "@/components/home/challenge/ChallengeSection";
import SolutionSection from "@/components/home/solution/SolutionSection";
import TransformationSection from "@/components/home/transformation/TransformationSection";
import SuccessSection from "@/components/home/success/SuccessSection";
import CTASection from "@/components/home/cta/CTASection";

// Proper TypeScript interfaces
interface Benefit {
  icon: string;
  title: string;
  subtitle: string;
}

interface Challenge {
  icon: string;
  title: string;
  description: string;
  impact?: string;
}

interface Solution {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  features: string[];
}

interface HeroContent {
  subtitle?: string;
  benefits?: Benefit[];
}

interface ChallengeContent {
  intro?: string;
  challenges?: Challenge[];
}

interface SolutionContent {
  intro?: string;
  solutions?: Solution[];
}

type ContentData = HeroContent | ChallengeContent | SolutionContent | Record<string, unknown>;

interface Step {
  icon: string;
  title: string;
  description: string;
  step: number;
  side: "left" | "right";
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  result: string;
  avatar: string;
}

interface Action {
  text: string;
  icon: string;
  link: string;
}

interface Location {
  icon: string;
  title: string;
  subtitle: string;
}

interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: {
    intro?: string;
    subtitle?: string;
    challenges?: Challenge[];
    solutions?: Solution[];
    steps?: Step[];
    testimonials?: Testimonial[];
    actions?: Action[];
    locations?: Location[];
    imageUrl?: string;
  };
  metadata?: {
    color?: string;
    image?: string;
    order?: number;
  };
  isActive: boolean;
}

type ContentItem = ContentSection;

interface FormData {
  type: string;
  title: string;
  description: string;
  content: ContentData;
  metadata: {
    color: string;
    image: string;
    order: number;
  };
  isActive: boolean;
}

const CONTENT_TYPES = [
  "hero",
  "about",
  "services",
  "contact",
  "blog",
  "client",
  "challenge",
  "solution",
  "transformation",
  "success",
  "cta"
];

export default function ContentDashboard() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: ContentSection) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
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

  // Form Components
  function HeroForm({ data, onSave, onCancel }: { data: ContentSection; onSave: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState(data);

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        <div>
          <Label>Titre Principal</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: PARTENAIRES OFFICIELS ODOO & HUBSPOT"
          />
        </div>
        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Solutions Digitales Sur Mesure"
          />
        </div>
        <div>
          <Label>Sous-titre</Label>
          <Textarea
            value={formData.content.subtitle || ""}
            onChange={(e) => setFormData({
              ...formData,
              content: { ...formData.content, subtitle: e.target.value }
            })}
            placeholder="Ex: Nous implémentons Odoo ERP ou HubSpot CRM selon vos besoins spécifiques."
            className="h-24"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Sauvegarder
          </Button>
        </div>
      </form>
    );
  }

  function ChallengeForm({ data, onSave, onCancel }: { data: ContentSection; onSave: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState(data);

    const handleAddChallenge = () => {
      const newChallenge: Challenge = {
        icon: 'Star',
        title: 'New Challenge',
        description: 'Challenge description',
        impact: 'Impact description'
      };
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          challenges: [...(formData.content.challenges || []), newChallenge]
        }
      });
    };

    const handleUpdateChallenge = (index: number, field: keyof Challenge, value: string) => {
      const updatedChallenges = [...(formData.content.challenges || [])];
      updatedChallenges[index] = {
        ...updatedChallenges[index],
        [field]: value
      };
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          challenges: updatedChallenges
        }
      });
    };

    const handleRemoveChallenge = (index: number) => {
      const updatedChallenges = [...(formData.content.challenges || [])];
      updatedChallenges.splice(index, 1);
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          challenges: updatedChallenges
        }
      });
    };

  return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        <div>
          <Label>Titre Principal</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
      </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-24"
          />
        </div>
        <div>
          <Label>Intro</Label>
          <Textarea
            value={formData.content.intro || ''}
            onChange={(e) => setFormData({
              ...formData,
              content: { ...formData.content, intro: e.target.value }
            })}
            className="h-24"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Challenges</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddChallenge}>
              <Plus className="w-4 h-4 mr-2" />
              Add Challenge
            </Button>
          </div>
          <div className="space-y-4">
            {formData.content.challenges?.map((challenge, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Challenge {index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveChallenge(index)}
                  >
                        <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={challenge.icon}
                      onChange={(e) => handleUpdateChallenge(index, 'icon', e.target.value)}
                    />
                    </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={challenge.title}
                      onChange={(e) => handleUpdateChallenge(index, 'title', e.target.value)}
                    />
      </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={challenge.description}
                      onChange={(e) => handleUpdateChallenge(index, 'description', e.target.value)}
                    />
            </div>
                  <div>
                    <Label>Impact</Label>
                    <Input
                      value={challenge.impact || ''}
                      onChange={(e) => handleUpdateChallenge(index, 'impact', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
                  </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Sauvegarder
          </Button>
        </div>
      </form>
    );
  }

  function SolutionForm({ data, onSave, onCancel }: { data: ContentSection; onSave: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState(data);

    const handleAddSolution = () => {
      const newSolution: Solution = {
        icon: 'Star',
        title: 'New Solution',
        subtitle: 'Solution subtitle',
        description: 'Solution description',
        color: '#ff5c35',
        features: ['Feature 1', 'Feature 2']
      };
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          solutions: [...(formData.content.solutions || []), newSolution]
        }
      });
    };

    const handleUpdateSolution = (index: number, field: keyof Solution, value: string | string[]) => {
      const updatedSolutions = [...(formData.content.solutions || [])];
      updatedSolutions[index] = {
        ...updatedSolutions[index],
        [field]: value
      };
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          solutions: updatedSolutions
        }
      });
    };

    const handleRemoveSolution = (index: number) => {
      const updatedSolutions = [...(formData.content.solutions || [])];
      updatedSolutions.splice(index, 1);
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          solutions: updatedSolutions
        }
      });
    };

    const handleUpdateFeature = (solutionIndex: number, featureIndex: number, value: string) => {
      const updatedSolutions = [...(formData.content.solutions || [])];
      updatedSolutions[solutionIndex].features[featureIndex] = value;
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          solutions: updatedSolutions
        }
      });
    };

    const handleAddFeature = (solutionIndex: number) => {
      const updatedSolutions = [...(formData.content.solutions || [])];
      updatedSolutions[solutionIndex].features.push('New Feature');
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          solutions: updatedSolutions
        }
      });
    };

    const handleRemoveFeature = (solutionIndex: number, featureIndex: number) => {
      const updatedSolutions = [...(formData.content.solutions || [])];
      updatedSolutions[solutionIndex].features.splice(featureIndex, 1);
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          solutions: updatedSolutions
        }
      });
    };

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
                  <div>
          <Label>Titre Principal</Label>
          <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
          <Label>Description</Label>
          <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-24"
                    />
                  </div>
                      <div>
          <Label>Intro</Label>
          <Textarea
            value={formData.content.intro || ''}
            onChange={(e) => setFormData({
                              ...formData,
              content: { ...formData.content, intro: e.target.value }
            })}
            className="h-24"
                        />
                      </div>
                      <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Solutions</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSolution}>
              <Plus className="w-4 h-4 mr-2" />
              Add Solution
            </Button>
          </div>
                        <div className="space-y-4">
            {formData.content.solutions?.map((solution, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Solution {index + 1}
                  </CardTitle>
                  <Button
                                  type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSolution(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={solution.icon}
                      onChange={(e) => handleUpdateSolution(index, 'icon', e.target.value)}
                    />
                              </div>
                              <div>
                    <Label>Title</Label>
                    <Input
                      value={solution.title}
                      onChange={(e) => handleUpdateSolution(index, 'title', e.target.value)}
                                />
                              </div>
                              <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={solution.subtitle}
                      onChange={(e) => handleUpdateSolution(index, 'subtitle', e.target.value)}
                                />
                              </div>
                              <div>
                    <Label>Description</Label>
                    <Textarea
                      value={solution.description}
                      onChange={(e) => handleUpdateSolution(index, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={solution.color}
                      onChange={(e) => handleUpdateSolution(index, 'color', e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <button
                        onClick={() => handleAddFeature(index)}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                            value={feature}
                            onChange={(e) => handleUpdateFeature(index, featureIndex, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                          <button
                            onClick={() => handleRemoveFeature(index, featureIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                              </div>
                      ))}
                            </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Sauvegarder
          </Button>
        </div>
      </form>
    );
  }

  function TransformationForm({ data, onSave, onCancel }: { data: ContentSection; onSave: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState(data);

    const handleAddStep = () => {
      const newStep: Step = {
        icon: 'Star',
        title: 'New Step',
        description: 'Step description',
        step: (formData.content.steps?.length || 0) + 1,
        side: (formData.content.steps?.length || 0) % 2 === 0 ? 'left' : 'right'
      };
                              setFormData({
                                ...formData,
        content: {
          ...formData.content,
          steps: [...(formData.content.steps || []), newStep]
        }
      });
    };

    const handleUpdateStep = (index: number, field: keyof Step, value: string | number) => {
      const updatedSteps = [...(formData.content.steps || [])];
      updatedSteps[index] = {
        ...updatedSteps[index],
        [field]: value
      };
                            setFormData({
                              ...formData,
        content: {
          ...formData.content,
          steps: updatedSteps
        }
      });
    };

    const handleRemoveStep = (index: number) => {
      const updatedSteps = [...(formData.content.steps || [])];
      updatedSteps.splice(index, 1);
      // Update step numbers
      updatedSteps.forEach((step, idx) => {
        step.step = idx + 1;
        step.side = idx % 2 === 0 ? 'left' : 'right';
      });
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          steps: updatedSteps
        }
      });
    };

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        <div>
          <Label>Titre Principal</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-24"
          />
        </div>
        <div>
          <Label>Intro</Label>
          <Textarea
            value={formData.content.intro || ''}
            onChange={(e) => setFormData({
              ...formData,
              content: { ...formData.content, intro: e.target.value }
            })}
            className="h-24"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Steps</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddStep}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
                        <div className="space-y-4">
            {formData.content.steps?.map((step, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Step {step.step}
                  </CardTitle>
                  <Button
                                  type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStep(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={step.icon}
                      onChange={(e) => handleUpdateStep(index, 'icon', e.target.value)}
                    />
                              </div>
                              <div>
                    <Label>Title</Label>
                    <Input
                      value={step.title}
                      onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Sauvegarder
          </Button>
        </div>
      </form>
    );
  }

  function SuccessForm({ data, onSave, onCancel }: { data: ContentSection; onSave: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState(data);

    const handleAddTestimonial = () => {
      const newTestimonial: Testimonial = {
        name: 'New Name',
        role: 'New Role',
        quote: 'New Quote',
        result: 'New Result',
        avatar: 'NN'
      };
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          testimonials: [...(formData.content.testimonials || []), newTestimonial]
        }
      });
    };

    const handleUpdateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
      const updatedTestimonials = [...(formData.content.testimonials || [])];
      updatedTestimonials[index] = {
        ...updatedTestimonials[index],
        [field]: value
      };
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          testimonials: updatedTestimonials
        }
      });
    };

    const handleRemoveTestimonial = (index: number) => {
      const updatedTestimonials = [...(formData.content.testimonials || [])];
      updatedTestimonials.splice(index, 1);
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          testimonials: updatedTestimonials
        }
      });
    };

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        <div>
          <Label>Titre Principal</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                              </div>
                              <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-24"
          />
        </div>
        <div>
          <Label>Intro</Label>
          <Textarea
            value={formData.content.intro || ''}
            onChange={(e) => setFormData({
                                      ...formData,
              content: { ...formData.content, intro: e.target.value }
            })}
            className="h-24"
                                />
                              </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Testimonials</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddTestimonial}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
                            </div>
          <div className="space-y-4">
            {formData.content.testimonials?.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Testimonial {index + 1}
                  </CardTitle>
                  <Button
                            type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTestimonial(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => handleUpdateTestimonial(index, 'name', e.target.value)}
                    />
                        </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) => handleUpdateTestimonial(index, 'role', e.target.value)}
                    />
                      </div>
                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => handleUpdateTestimonial(index, 'quote', e.target.value)}
                    />
                    </div>
                      <div>
                    <Label>Result</Label>
                    <Input
                      value={testimonial.result}
                      onChange={(e) => handleUpdateTestimonial(index, 'result', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Avatar</Label>
                    <Input
                      value={testimonial.avatar}
                      onChange={(e) => handleUpdateTestimonial(index, 'avatar', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Sauvegarder
          </Button>
        </div>
      </form>
    );
  }

  function CTAForm({ data, onSave, onCancel }: { data: ContentSection; onSave: (data: any) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState(data);

    const handleAddAction = () => {
      const newAction: Action = {
        text: 'New Action',
        icon: 'ArrowRight',
        link: '#'
      };
                            setFormData({
                              ...formData,
        content: {
          ...formData.content,
          actions: [...(formData.content.actions || []), newAction]
        }
      });
    };

    const handleUpdateAction = (index: number, field: keyof Action, value: string) => {
      const updatedActions = [...(formData.content.actions || [])];
      updatedActions[index] = {
        ...updatedActions[index],
        [field]: value
      };
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          actions: updatedActions
        }
      });
    };

    const handleRemoveAction = (index: number) => {
      const updatedActions = [...(formData.content.actions || [])];
      updatedActions.splice(index, 1);
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          actions: updatedActions
        }
      });
    };

    const handleAddLocation = () => {
      const newLocation: Location = {
        icon: 'Globe',
        title: 'New Location',
        subtitle: 'New Subtitle'
      };
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          locations: [...(formData.content.locations || []), newLocation]
        }
      });
    };

    const handleUpdateLocation = (index: number, field: keyof Location, value: string) => {
      const updatedLocations = [...(formData.content.locations || [])];
      updatedLocations[index] = {
        ...updatedLocations[index],
        [field]: value
      };
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          locations: updatedLocations
        }
      });
    };

    const handleRemoveLocation = (index: number) => {
      const updatedLocations = [...(formData.content.locations || [])];
      updatedLocations.splice(index, 1);
                                    setFormData({
                                      ...formData,
        content: {
          ...formData.content,
          locations: updatedLocations
        }
      });
    };

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        <div>
          <Label>Titre Principal</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                              </div>
                              <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-24"
          />
        </div>
        <div>
          <Label>Intro</Label>
          <Textarea
            value={formData.content.intro || ''}
            onChange={(e) => setFormData({
                                      ...formData,
              content: { ...formData.content, intro: e.target.value }
            })}
            className="h-24"
                                />
                              </div>
                              <div>
          <Label>Image URL (optionnel)</Label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.content.imageUrl || ''}
            onChange={(e) => setFormData({
                                      ...formData,
              content: { ...formData.content, imageUrl: e.target.value }
            })}
          />
          <p className="text-sm text-gray-500 mt-1">
            Si une URL d'image est fournie, elle remplacera l'icône par défaut
          </p>
                              </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Actions</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddAction}>
              <Plus className="w-4 h-4 mr-2" />
              Add Action
            </Button>
                            </div>
          <div className="space-y-4">
            {formData.content.actions?.map((action, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Action {index + 1}
                  </CardTitle>
                  <Button
                            type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAction(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Text</Label>
                    <Input
                      value={action.text}
                      onChange={(e) => handleUpdateAction(index, 'text', e.target.value)}
                    />
                        </div>
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={action.icon}
                      onChange={(e) => handleUpdateAction(index, 'icon', e.target.value)}
                    />
                      </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      value={action.link}
                      onChange={(e) => handleUpdateAction(index, 'link', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
                  </div>
              </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Locations</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddLocation}>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
                          </div>
          <div className="space-y-4">
            {formData.content.locations?.map((location, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Location {index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLocation(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={location.icon}
                      onChange={(e) => handleUpdateLocation(index, 'icon', e.target.value)}
                    />
                                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={location.title}
                      onChange={(e) => handleUpdateLocation(index, 'title', e.target.value)}
                    />
                                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={location.subtitle}
                      onChange={(e) => handleUpdateLocation(index, 'subtitle', e.target.value)}
                    />
                                </div>
                </CardContent>
              </Card>
            ))}
                          </div>
                        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Sauvegarder
          </Button>
        </div>
      </form>
    );
  }

  function ContentForm({ data, onChange }: { data: ContentSection; onChange: (data: ContentSection) => void }) {
    switch (data.type) {
      case 'hero':
        return <HeroForm data={data} onSave={onChange} onCancel={closeModal} />;
      case 'challenge':
        return <ChallengeForm data={data} onSave={onChange} onCancel={closeModal} />;
      case 'solution':
        return <SolutionForm data={data} onSave={onChange} onCancel={closeModal} />;
      case 'transformation':
        return <TransformationForm data={data} onSave={onChange} onCancel={closeModal} />;
      case 'success':
        return <SuccessForm data={data} onSave={onChange} onCancel={closeModal} />;
      case 'cta':
        return <CTAForm data={data} onSave={onChange} onCancel={closeModal} />;
      default:
        return null;
    }
  }

  const renderEditForm = () => {
    if (!selectedItem) return null;

                      return (
      <ContentForm data={selectedItem} onChange={handleSave} />
    );
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

                      return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion du Contenu</h1>
                              </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section._id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {section.type.toUpperCase()}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal(section)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{section.title}</p>
            </CardContent>
          </Card>
                                      ))}
                                    </div>

      {/* Edit Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90vw] h-[90vh] flex">
            {/* Form Panel */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Modifier {selectedItem.type}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
                                  </div>
              {renderEditForm()}
                            </div>

            {/* Preview Panel */}
            <div className="w-1/2 border-l overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
                <div className="border rounded-lg overflow-hidden">
                  {selectedItem.type === "hero" && <HeroSection hero={selectedItem} />}
                  {selectedItem.type === "challenge" && <ChallengeSection challenge={selectedItem} />}
                  {selectedItem.type === "solution" && <SolutionSection solution={selectedItem} />}
                  {selectedItem.type === "transformation" && <TransformationSection transformation={selectedItem} />}
                  {selectedItem.type === "success" && <SuccessSection success={selectedItem} />}
                  {selectedItem.type === "cta" && <CTASection cta={selectedItem} />}
                  {!["hero", "challenge", "solution", "transformation", "success", "cta"].includes(selectedItem.type) && (
                    <div className="text-center py-8 text-gray-500">
                      Aperçu non disponible pour ce type de section
                          </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}