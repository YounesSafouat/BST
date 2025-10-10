/**
 * HomePageV3.tsx
 * 
 * Version 3 of the homepage - Premium enterprise design
 * Features luxury aesthetics and sophisticated interactions
 * 
 * @author younes safouat
 * @version 3.0.0
 * @since 2025
 */

"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGeolocation } from '../../hooks/useGeolocation';
import HeroSection from './hero/HeroSection';
import CompaniesCarouselV3 from '../CompaniesCarouselV3';
import ContactSection from '../ContactSection';
import ServicesSection from '../ServicesSection';
import PricingSection from '../PricingSection';
import VideoTestimonialsSection from '../VideoTestimonialsSection';
import OdooCertificationSection from '../OdooCertificationSection';
import FAQSection from '../FAQSection';

interface HomePageData {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    videoUrl: string;
    ctaPrimary: {
      text: string;
      link: string;
      icon: string;
    };
    ctaSecondary: {
      text: string;
      link: string;
      icon: string;
    };
    stats: {
      visible: boolean;
      years: string;
      label: string;
    };
    certificationBadge: {
      image: string;
      alt: string;
    };
  };
  companies: {
    headline: string;
    companies: Array<{
      name: string;
      logo: string;
      url?: string;
      regions?: string[];
    }>;
  };
  services: Array<{
    title: string;
    description: string;
    icon: string;
    image: string;
    features: string[];
  }>;
  pricing: {
    headline: string;
    subheadline: string;
    plans: Array<{
      name: string;
      description: string;
      price: string;
      estimation: string;
      features: string[];
      cta: string;
      targetRegions?: string[];
    }>;
  };
  videoTestimonials: {
    headline: string;
    subheadline: string;
    videos: Array<{
      id: string;
      companyName: string;
      companyLogo: string;
      testimonial: string;
      authorName: string;
      authorTitle: string;
      authorImage: string;
      videoUrl?: string;
      thumbnailUrl?: string;
      targetRegions?: string[];
    }>;
  };
  certification: {
    headline: string;
    subheadline: string;
    badges: Array<{
      image: string;
      alt: string;
      title: string;
      description: string;
    }>;
  };
  faq: {
    headline: string;
    subheadline: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  contact: {
    headline: string;
    subheadline: string;
    benefits: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    form: {
      headline: string;
      description: string;
    };
  };
}

export default function HomePageV3() {
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRegion } = useGeolocation();

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const response = await fetch('/api/content?type=home-page');
        if (!response.ok) {
          throw new Error('Failed to fetch homepage data');
        }
        const data = await response.json();
        
        if (data && data.content) {
          setHomePageData(data.content);
        } else {
          throw new Error('No homepage data found');
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white text-lg font-light"
          >
            Chargement de l'expérience premium...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl font-light mb-4">Erreur de Chargement</h1>
          <p className="text-red-200">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!homePageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl font-light mb-4">Aucune Donnée Disponible</h1>
          <p className="text-blue-200">Veuillez vérifier votre configuration.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Premium Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          {/* Premium Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          </div>
          {/* Floating Luxury Elements */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [360, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center text-white"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl px-8 py-4 text-sm font-light text-blue-200 mb-12 border border-blue-400/30 shadow-2xl"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
              {homePageData.hero.badge}
            </motion.div>

            {/* Premium Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-extralight mb-8 leading-[0.9] tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                {homePageData.hero.headline}
              </span>
            </motion.h1>

            {/* Premium Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="text-xl md:text-2xl text-blue-200/80 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
            >
              {homePageData.hero.subheadline}
            </motion.p>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-8 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-light py-5 px-12 rounded-full text-lg transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 border border-blue-400/30"
              >
                {homePageData.hero.ctaPrimary.text}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white hover:bg-white/10 font-light py-5 px-12 rounded-full text-lg transition-all duration-500 backdrop-blur-xl"
              >
                {homePageData.hero.ctaSecondary.text}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section id="services" className="py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-extralight text-white mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Solutions d'Excellence
              </span>
            </h2>
            <p className="text-xl text-blue-200/70 max-w-3xl mx-auto font-light">
              Des solutions sur mesure pour transformer votre vision en réalité
            </p>
          </motion.div>
          
          {homePageData.services && (
            <ServicesSection services={homePageData.services} />
          )}
        </div>
      </section>

      {/* Premium Companies Section */}
      <section className="py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-extralight text-white mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {homePageData.companies.headline}
              </span>
            </h2>
          </motion.div>
          
          <CompaniesCarouselV3
            companies={homePageData.companies.companies}
            userRegion={userRegion}
            text={homePageData.companies.headline}
            layout="carousel"
            theme="modern"
            showCount={true}
          />
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {homePageData.pricing && (
            <PricingSection
              pricingData={homePageData.pricing}
              userRegion={userRegion}
            />
          )}
        </div>
      </section>

      {/* Premium Video Testimonials */}
      <section className="py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {homePageData.videoTestimonials && (
            <VideoTestimonialsSection
              testimonialsData={homePageData.videoTestimonials}
              userRegion={userRegion}
            />
          )}
        </div>
      </section>

      {/* Premium Certification */}
      <section className="py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {homePageData.certification && (
            <OdooCertificationSection
              certificationData={homePageData.certification}
            />
          )}
        </div>
      </section>

      {/* Premium FAQ */}
      <section className="py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {homePageData.faq && (
            <FAQSection faqData={homePageData.faq} />
          )}
        </div>
      </section>

      {/* Premium Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20 text-white"
          >
            <h2 className="text-5xl font-extralight mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {homePageData.contact.headline}
              </span>
            </h2>
            <p className="text-xl text-blue-200/70 max-w-3xl mx-auto font-light">
              {homePageData.contact.subheadline}
            </p>
          </motion.div>
          
          <ContactSection data={homePageData.contact} />
        </div>
      </section>
    </div>
  );
}
