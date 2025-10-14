"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import CompaniesCarouselV3 from '../../CompaniesCarouselV3V1';

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

interface HeroSectionProps {
  heroData: HeroData;
  userRegion?: string;
  isPreview?: boolean;
}

function HeroSectionV1({ heroData, userRegion, isPreview = false }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(loadTimer);
  }, []);

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

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      ArrowRight: <ArrowRight className="w-5 h-5" />,
      Users: <Users className="w-5 h-5" />,
      Play: <Play className="w-5 h-5" />
    };
    return iconMap[iconName] || <ArrowRight className="w-5 h-5" />;
  };

  const formatTextWithOdoo = (text: string) => {
    if (!text) return text;
    const odooRegex = /(\b)(odoo)(\b)/gi;
    return text.replace(odooRegex, (match, before, odoo, after) => {
      return `${before}<span style=" font-weight: italic; display: inline-block;"><span style="color: #714B67">O</span><span style="color: #8F8F8F">doo</span></span>${after}`;
    });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--color-main)] lg:min-h-screen min-h-[400vh] pt-[5rem]">
      <div className="relative w-full py-0 pt-0 lg:py-4 lg:pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Single Column */}
          <div className="lg:hidden space-y-6  pb-8 min-h-screen flex flex-col justify-start px-2">

            {/* Badge Image - First on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="p-2 w-[200px] h-[150px] flex items-center justify-center">
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
              className="text-2xl sm:text-3xl font-bold text-white leading-tight text-center"
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
                      Obtenez votre plan d'intégration <span className="text-[var(--color-secondary)]"> gratuitement</span> 
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                    Nous aidons les entreprises à centraliser l'ensemble de leur activité sur une seule plateforme grâce à Odoo. Simple, efficace, et abordable.
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

          {/* Desktop Layout - Two Columns */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-[250px] h-[100px] flex items-center justify-center" >
                 <img src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png" alt="Odoo Silver Partner Badge" />

                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white leading-tight tracking-tight"
                  style={{ lineHeight: '1.1' }}
                >
                  Intégrez <span className="text-[var(--color-secondary)]">Odoo</span> avec un partenaire Silver de <span className="text-[var(--color-secondary)]">confiance</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white leading-relaxed max-w-3xl"
                >
                  Passez à un ERP performant, paramétré par un partenaire Silver expert. Centralisez vos ventes, stocks, projets et finances — sans complexité inutile.
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-row gap-4 justify-start max-w-lg mx-auto"
              >
                <Link href="/cas-client">
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-8 py-4 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base sm:text-base lg:text-lg font-semibold text-[var(--color-main)] bg-white hover:bg-[var(--color-secondary)] hover:text-[var(--color-white)] rounded-full h-16 sm:h-12 lg:h-14 bg-white"
                  >
                    Voir nos cas clients
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Form instead of Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2"
            >
              <div className="relative mx-4 sm:mx-6 lg:mx-0">
                <div className="bg-white p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-[var(--color-main)]">
                  <h3 className="text-2xl font-bold text-[var(--color-main)] mb-6 text-center">
                  Obtenez votre plan d’intégration <span className="text-[var(--color-secondary)]">gratuitement</span>
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Votre nom complet"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
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
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
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
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
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
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[var(--color-secondary)]  text-white py-3 rounded-lg font-semibold transition-all text-lg border-2 border-transparent hover:border-white"
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

      {/* Companies Carousel - Reduced text size */}
      <div className="hidden lg:block bg-[var(--color-main)] pt-1 sm:pt-2 md:pt-4 lg:pt-4 xl:pt-12 2xl:pt-16 pb-8">
        <CompaniesCarouselV3
          companies={heroData?.carousel?.companies}
          userRegion={userRegion}
          speed={heroData?.carousel?.speed ? Math.min(heroData.carousel.speed, 100) : 75}
          text={heroData?.carousel?.text}
          layout="carousel"
          theme="modern"
          showCount={true}
        />
      </div>
    </section>
  );
}

export default HeroSectionV1;

