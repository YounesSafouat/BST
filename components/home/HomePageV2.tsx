/**
 * HomePageV2.tsx
 * 
 * Version 2 of the homepage - Modern and dynamic design
 * Features advanced animations and interactive elements
 * 
 * @author younes safouat
 * @version 2.0.0
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

export default function HomePageV2() {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!homePageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Data Available</h1>
          <p className="text-gray-600">Please check your data configuration.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Advanced Animation */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
          <div className="absolute inset-0 bg-black/20" />
          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white mb-8 border border-white/30"
            >
              {homePageData.hero.badge}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {homePageData.hero.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              {homePageData.hero.subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {homePageData.hero.ctaPrimary.text}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 backdrop-blur-sm"
              >
                {homePageData.hero.ctaSecondary.text}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Nos Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos services personnalisés pour transformer votre entreprise
            </p>
          </motion.div>
          
          {homePageData.services && (
            <ServicesSection services={homePageData.services} />
          )}
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {homePageData.companies.headline}
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {homePageData.pricing && (
            <PricingSection
              pricingData={homePageData.pricing}
              userRegion={userRegion}
            />
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              {homePageData.contact.headline}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {homePageData.contact.subheadline}
            </p>
          </motion.div>
          
          <ContactSection data={homePageData.contact} />
        </div>
      </section>
    </div>
  );
}
