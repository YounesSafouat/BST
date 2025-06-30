"use client"
import React, { useState } from 'react';
import { Mail, Phone, Building2, User, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

// Example companies data (replace with your real data)
const companies = [
  { name: 'Microsoft', logo: '/public/logos/Hubspot-fav.svg' },
  { name: 'Google', logo: '/public/logos/WQ.svg' },
  { name: 'Odoo', logo: '/public/odoo.png' },
  { name: 'Meta', logo: '/public/placeholder-logo.png' },
  { name: 'Netflix', logo: '/public/placeholder-logo.svg' },
];

const projectTypeContent = {
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

  const content = projectTypeContent[formData.projectType as keyof typeof projectTypeContent];

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
              <button
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold px-8 py-3 rounded-xl shadow transition-colors"
                onClick={() => updateFormData('projectType', 'integration')}
              >
                Intégration Odoo-HubSpot
              </button>
              <button
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold px-8 py-3 rounded-xl shadow transition-colors"
                onClick={() => updateFormData('projectType', 'migration')}
              >
                Migration ERP
              </button>
              <button
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold px-8 py-3 rounded-xl shadow transition-colors"
                onClick={() => updateFormData('projectType', 'consulting')}
              >
                Conseil Digital
              </button>
              <button
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold px-8 py-3 rounded-xl shadow transition-colors"
                onClick={() => updateFormData('projectType', 'formation')}
              >
                Formation
              </button>
              <button
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold px-8 py-3 rounded-xl shadow transition-colors"
                onClick={() => updateFormData('projectType', 'autre')}
              >
                Autre projet
              </button>
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
                    placeholder="Prénom*"
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
                    placeholder="Nom*"
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
                  placeholder="Nom de l'entreprise*"
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
                  placeholder="Numéro de téléphone*"
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
                  placeholder="E-mail*"
                  value={formData.email}
                  onChange={e => updateFormData('email', e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-gray-900 bg-white placeholder-gray-400 min-h-[120px]"
                  placeholder="Message*"
                  value={formData.message}
                  onChange={e => updateFormData('message', e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-bold rounded-lg shadow transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
              </button>
            </form>
          </Card>
        </div>
      </div>
      {/* Companies Carousel */}
      <div className="companies-scroll bg-white py-8">
        <div className="companies-track">
          {[...companies, ...companies].map((company, idx) => (
            <div key={idx} className="company-item flex items-center justify-center">
              <Image src={company.logo} alt={company.name} width={120} height={40} className="object-contain" />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .companies-scroll {
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
        }
        .companies-track {
          display: flex;
          animation: scroll-left 25s linear infinite;
          width: calc(200% + 40px);
        }
        .company-item {
          flex: 0 0 auto;
          margin: 0 40px;
          color: #9ca3af;
          font-weight: 500;
          font-size: var(--heading-font-size);
          white-space: nowrap;
          transition: color 0.3s ease;
        }
        .company-item:hover {
          color: #6b7280;
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .companies-scroll:hover .companies-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
