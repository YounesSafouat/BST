/**
 * HomePageV1.tsx
 * 
 * Version 1 of the homepage - Clean and minimal design
 * Focuses on simplicity and clear messaging
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import HeroSection from './hero/HeroSection';
import CompaniesCarouselV3 from '../CompaniesCarouselV3';
import ContactSection from '../ContactSection';
import Loader from './Loader';

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

export default function HomePageV1() {
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { region } = useGeolocation();

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
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!homePageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h1>
          <p className="text-gray-600">Please check your data configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 mb-8">
              {homePageData.hero.badge}
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {homePageData.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {homePageData.hero.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {homePageData.hero.ctaPrimary.text}
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {homePageData.hero.ctaSecondary.text}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {homePageData.companies.headline}
            </h2>
          </div>
          
          <CompaniesCarouselV3
            companies={homePageData.companies.companies}
            userRegion={region}
            text={homePageData.companies.headline}
            layout="grid"
            theme="light"
            showCount={true}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {homePageData.contact.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {homePageData.contact.subheadline}
            </p>
          </div>
          
          {/* Contact Section - Simplified for V1 */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contactez-nous</h3>
              <p className="text-gray-600 mb-6">
                Prêt à transformer votre entreprise ? Contactez-nous pour une consultation gratuite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Demander un devis
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
