"use client"
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building2, User, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import Loader from '@/components/home/Loader';

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    projectType: 'integration'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactContent, setContactContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const response = await fetch("/api/content?type=contact");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setContactContent(data[0].content);
          }
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message envoyé ! Nous vous recontacterons dans les plus brefs délais.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        projectType: 'integration'
      });
    }, 2000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Use dynamic content if available, otherwise fall back to static content
  const projectTypeContent = contactContent?.projectTypes || {
    integration: {
      header: 'Intégration Odoo-HubSpot',
      text: "Optimisez vos processus métier grâce à une intégration complète entre Odoo et HubSpot. Nos experts vous accompagnent pour connecter vos outils et automatiser vos flux de travail."
    },
    migration: {
      header: 'Migration ERP',
      text: "Migrez vos données et processus vers un nouvel ERP en toute sécurité. Nous assurons une transition fluide et sans perte d'information."
    },
    consulting: {
      header: 'Conseil Digital',
      text: "Bénéficiez de notre expertise pour accélérer votre transformation digitale et améliorer vos performances."
    },
    formation: {
      header: 'Formation',
      text: "Formez vos équipes aux outils digitaux pour garantir l'adoption et la réussite de vos projets."
    },
    autre: {
      header: 'Autre projet',
      text: "Décrivez-nous votre projet, nous vous proposerons une solution sur-mesure adaptée à vos besoins."
    }
  };

  const content = projectTypeContent[formData.projectType as keyof typeof projectTypeContent];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-[var(--color-white)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Dynamic header/text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[var(--color-main)]" />
              {content.header}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {content.text}
            </p>
            <div className="flex flex-wrap gap-4">
              {Object.keys(projectTypeContent).map((type) => (
              <button
                  key={type}
                  className={`font-semibold px-8 py-3 rounded-xl shadow transition-colors ${
                    formData.projectType === type
                      ? 'bg-[var(--color-main)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => updateFormData('projectType', type)}
              >
                  {projectTypeContent[type].header}
              </button>
              ))}
            </div>
          </div>
          {/* Right: Form in a Card */}
          <Card className="p-8 rounded-2xl shadow-xl border border-gray-100 bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400"
                    type="text"
                    placeholder={contactContent?.form?.fields?.firstName?.placeholder || "Prénom*"}
                    value={formData.firstName}
                    onChange={e => updateFormData('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400"
                    type="text"
                    placeholder={contactContent?.form?.fields?.lastName?.placeholder || "Nom*"}
                    value={formData.lastName}
                    onChange={e => updateFormData('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400"
                  type="text"
                  placeholder={contactContent?.form?.fields?.company?.placeholder || "Nom de l'entreprise*"}
                  value={formData.company}
                  onChange={e => updateFormData('company', e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400"
                  type="tel"
                  placeholder={contactContent?.form?.fields?.phone?.placeholder || "Numéro de téléphone*"}
                  value={formData.phone}
                  onChange={e => updateFormData('phone', e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400"
                  type="email"
                  placeholder={contactContent?.form?.fields?.email?.placeholder || "E-mail*"}
                  value={formData.email}
                  onChange={e => updateFormData('email', e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400 min-h-[120px]"
                  placeholder={contactContent?.form?.fields?.message?.placeholder || "Message*"}
                  value={formData.message}
                  onChange={e => updateFormData('message', e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (contactContent?.form?.submitButton?.loadingText || 'Envoi en cours...') 
                  : (contactContent?.form?.submitButton?.text || 'Envoyer le message')
                }
              </button>
            </form>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            {contactContent?.trust?.title || 'Ils nous font confiance'}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Companies will be dynamically populated here */}
          </div>
        </div>
      </div>
    </div>
  );
}
