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

function HeroSectionV2({ heroData, userRegion, isPreview = false }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
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
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      console.log('Form submitted:', formData);
      
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: ''
      });
      
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
    <section id="hero" className="relative overflow-hidden bg-transparent">
      <div className="relative w-full py-0 pt-0 lg:py-4 lg:pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4 sm:space-y-6 pt-0 mt-0 -mt-4 min-h-[80vh] flex flex-col justify-center" style={{ marginTop: '0', paddingTop: '0' }}>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight text-center"
              style={{ lineHeight: '1.1', marginTop: '0', paddingTop: '0' }}
            >
              Intégrez <span className="text-[var(--color-secondary)]">Odoo</span> avec un partenaire Silver de confiance
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base text-gray-600 leading-relaxed text-center px-2"
            >
              De l'audit à la formation, nous vous accompagnons à chaque étape pour faire d'Odoo le cœur de votre entreprise.
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full"
            >
              <div className="relative mx-2 sm:mx-4">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Obtenez votre plan d'intégration gratuit
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder="Message (optionnel)"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[var(--color-secondary)] hover:bg-[var(--color-main)] text-white py-3 rounded-lg font-semibold transition-all"
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Obtenir mon plan gratuit'}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-sm sm:max-w-lg mx-auto"
            >
              <Link href="/cas-client">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-medium border border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white rounded-full h-10 sm:h-12 shadow-sm hover:shadow-md transition-all duration-200 bg-white w-full sm:w-auto"
                >
                  Voir nos cas clients
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Layout */}
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
                  <Badge
                    variant="outline"
                    className="border-gray-300 text-gray-600 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-[var(--color-secondary)] hover:text-white hover:border-[var(--color-secondary)] transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => window.open('https://www.odoo.com/partners/blackswan-technology-18572551?country_id=132', '_blank')}
                  >
                    Partenaire Silver Odoo
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 leading-tight tracking-tight"
                  style={{ lineHeight: '1.1' }}
                >
                  Intégrez <span className="text-[var(--color-secondary)]">Odoo</span> avec un partenaire Silver de confiance
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 leading-relaxed max-w-3xl"
                >
                  De l'audit à la formation, nous vous accompagnons à chaque étape pour faire d'Odoo le cœur de votre entreprise.
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
                    className="px-8 py-4 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base sm:text-base lg:text-lg font-semibold border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white rounded-full h-16 sm:h-12 lg:h-14"
                  >
                    Voir nos cas clients
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2"
            >
              <div className="relative mx-4 sm:mx-6 lg:mx-0">
                <div className="bg-white p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Obtenez votre plan d'intégration gratuit
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder="Message (optionnel)"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[var(--color-secondary)] hover:bg-[var(--color-main)] text-white py-3 rounded-lg font-semibold transition-all text-lg"
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Obtenir mon plan gratuit'}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Companies Carousel */}
      <div className="hidden lg:block bg-transparent pt-1 sm:pt-2 md:pt-4 lg:pt-4 xl:pt-12 2xl:pt-16">
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

export default HeroSectionV2;

