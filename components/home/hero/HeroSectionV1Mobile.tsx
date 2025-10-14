"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';

interface HeroData {
  headline: string;
  subheadline: string;
  description: string;
  logo: string;
  videoUrl: string;
  ctaPrimary: {
    text: string;
    icon: string;
  };
  ctaSecondary: {
    text: string;
    icon: string;
  };
  stats: Array<{
    number: number;
    suffix: string;
    label: string;
  }>;
  companyName?: string;
  badge?: string;
  emphasis?: string;
  expertiseBadgeUrl?: string;
  carousel?: {
    companies: Array<{
      name: string;
      logo: string;
      url?: string;
      regions?: string[];
    }>;
    speed?: number;
    text?: string;
  };
}

interface HeroSectionV1MobileProps {
  heroData: HeroData;
  userRegion?: string;
  isPreview?: boolean;
}

function HeroSectionV1Mobile({ heroData, userRegion, isPreview = false }: HeroSectionV1MobileProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Add API call to submit form
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: ''
      });
      
      // Show success message or redirect
      alert('Merci ! Nous vous contacterons bientôt.');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--color-main)] min-h-screen">
      <div className="relative w-full py-0 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Single Column */}
          <div className="space-y-6 pt-4 pb-8 min-h-screen flex flex-col justify-center px-2">

            {/* Badge Image - First on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="p-2 flex items-center justify-center">
                <img 
                  src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png" 
                  alt="Odoo Silver Partner Badge" 
                  className='w-[240px] h-[240px]' 
                />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-3xl font-bold text-white leading-tight text-center"
              style={{ lineHeight: '1.2' }}
            >
              Intégrez <span className="text-[var(--color-secondary)]">Odoo</span> avec un partenaire Silver de <span className="text-[var(--color-secondary)]">confiance</span>
            </motion.h1>

            {/* Image below title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex justify-center"
            >
              <img
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/couvertureV1SiteWeb.png"
                alt="Odoo Integration"
                className="w-full max-w-md rounded-2xl shadow-lg"
              />
            </motion.div>

            {/* Form instead of Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full"
            >
              <div className="relative">
                <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-white/30">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
                    Obtenez votre plan <br /><span className="text-[var(--color-secondary)]">d'intégration</span>  gratuitement
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Nous aidons les entreprises à centraliser l'ensemble de leur activité sur une seule plateforme grâce à <span className="font-bold"> Odoo </span>. <br />  <span className="text-[var(--color-secondary)] font-bold">Simple, efficace, et abordable.</span>
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Votre nom complet"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Téléphone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="company"
                        placeholder="Entreprise"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[var(--color-secondary)] hover:bg-[var(--color-main)] text-white py-3 text-sm rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionV1Mobile;
