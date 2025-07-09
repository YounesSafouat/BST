"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Phone,
  MapPin,
  Zap,
  TrendingUp,
  Database,
  CheckCircle,
  ArrowRight,
  Clock,
  Globe,
  Award,
  Shield,
} from "lucide-react"
import { useState, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { ContactContent } from "@/app/types/content"
import Loader from "@/components/home/Loader"

function getIconComponent(name: string) {
  return (LucideIcons[name as keyof typeof LucideIcons] as any) || LucideIcons.Phone;
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const response = await fetch(`${baseUrl}/api/content?type=contact-page`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const contactPageData = data[0];
          setContactData(contactPageData);
          // Initialize form data based on the dynamic fields
          const initialFormData: any = {};
          contactPageData.steps.forEach((step: any) => {
            step.fields.forEach((field: any) => {
              if (field.type === 'checkbox-group') {
                initialFormData[field.name] = [];
              } else {
                initialFormData[field.name] = '';
              }
            });
          });
          setFormData(initialFormData);
        }
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item: string) => item !== value),
    }))
  }

  const nextStep = () => {
    if (contactData && currentStep < contactData.steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  const renderField = (field: any, stepIndex: number, fieldIndex: number) => {
    const fieldId = `${field.name}-${stepIndex}-${fieldIndex}`;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            id={fieldId}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="h-12 border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
            required={field.required}
            placeholder={field.label}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="min-h-[100px] border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
            required={field.required}
            placeholder={field.label}
          />
        );
      
      case 'select':
        return (
          <Select value={formData[field.name] || ''} onValueChange={(value) => handleInputChange(field.name, value)}>
            <SelectTrigger className="h-12 border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]">
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup value={formData[field.name] || ''} onValueChange={(value) => handleInputChange(field.name, value)}>
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${fieldId}-${option}`} />
                <Label htmlFor={`${fieldId}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox-group':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldId}-${option}`}
                  checked={(formData[field.name] || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange(field.name, option, checked as boolean)}
                />
                <Label htmlFor={`${fieldId}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!contactData) {
    return (
      <div className="min-h-screen bg-white mt-10 md:mt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h1>
          <p className="text-gray-600">Impossible de charger les données de la page contact</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-10 md:mt-20">
        {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            {contactData.hero.headline.split(contactData.hero.highlight).map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)]">
                    {contactData.hero.highlight}
                  </span>
                )}
              </React.Fragment>
            ))}
            </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {contactData.hero.description}
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Étape {currentStep} sur {contactData.steps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / contactData.steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / contactData.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
                </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {contactData.steps.map((step, stepIndex) => (
              currentStep === stepIndex + 1 && (
                <Card key={stepIndex} className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <h2 className="text-2xl font-bold text-black mb-2">{step.label}</h2>
                    <p className="text-gray-600">{step.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {step.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className={field.type === 'textarea' || field.type === 'checkbox-group' ? 'md:col-span-2' : ''}>
                          <Label htmlFor={`${field.name}-${stepIndex}-${fieldIndex}`} className="text-sm font-medium text-gray-700 mb-2 block">
                            {field.label} {field.required && '*'}
                          </Label>
                          {renderField(field, stepIndex, fieldIndex)}
                </div>
                      ))}
              </div>
                  </CardContent>
                </Card>
              )
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8 py-3"
              >
                Précédent
              </Button>
              
              {currentStep < contactData.steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="px-8 py-3 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90"
                >
                  Envoyer
                </Button>
              )}
            </div>
            </form>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Autres façons de nous contacter</h2>
            <p className="text-gray-600">Choisissez le moyen qui vous convient le mieux</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactData.cards.map((card, index) => {
              const IconComponent = getIconComponent(card.icon);
              return (
                <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-[var(--color-main)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
      </div>
                  <h3 className="text-xl font-bold text-black mb-4">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <div className="text-lg font-semibold text-[var(--color-main)] mb-2">{card.contact}</div>
                  <p className="text-sm text-gray-500">{card.subDescription}</p>
                </Card>
              );
            })}
            </div>
        </div>
      </section>
    </div>
  );
}
