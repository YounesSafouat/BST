"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import StatsSection from '../../StatsSection';
import CompaniesCarousel from '../../CompaniesCarousel';
import CompaniesCarouselV2 from '../../CompaniesCarouselV2';
import CompaniesCarouselV3 from '../../CompaniesCarouselV3';

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
  expertiseBadgeUrl?: string; // URL of the expertise badge image
  carousel?: {
    companies: Array<{
      name: string;
      logo: string;
      url?: string;
      regions?: string[]; // Array of regions: ['france', 'morocco', 'international']
    }>;
    speed?: number;
    text?: string; // Text to display above the carousel
  };
}

interface HeroSectionProps {
  heroData: HeroData;
  userRegion?: string;
  isPreview?: boolean;
}

function HeroSection({ heroData, userRegion, isPreview = false }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const handleAsyncAction = async (action: () => Promise<void>, type: string) => {
    setIsLoading(true);
    setLoadingType(type);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleConsultationClick = async () => {
    await handleAsyncAction(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/#contact');
    }, 'appointment');
  };

  const handleCaseStudyClick = async () => {
    await handleAsyncAction(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/#contact');
    }, 'projects');
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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

  // Function to format text with custom Odoo styling for headline
  const formatTextWithOdoo = (text: string) => {
    if (!text) return text;

    // Replace "odoo" (case insensitive) with custom styled version
    const odooRegex = /(\b)(odoo)(\b)/gi;
    return text.replace(odooRegex, (match, before, odoo, after) => {
      return `${before}<span style="font-weight: italic; display: inline-block; color: var(--color-secondary);">Odoo</span>${after}`;
    });
  };

  // Function to format subheadline with bold Odoo and line breaks
  const formatSubheadline = (text: string) => {
    if (!text) return text;

    const odooRegex = /(\b)(odoo)(\b)/gi;
    let formattedText = text.replace(odooRegex, (match, before, odoo, after) => {
      return `${before}<span style="font-weight: bold;">Odoo</span>${after}`;
    });
    // Add line break after periods
    formattedText = formattedText.replace(/\.\s/g, '.<br>');
    return formattedText;
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--color-main)]">
      <div className="relative w-full py-4 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout - Two Columns */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
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
                  <div className="w-[250px] h-[100px] flex items-center justify-center">
                    <img 
                      src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png" 
                      alt="Odoo Silver Partner Badge" 
                    />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white leading-tight tracking-tight"
                  style={{ lineHeight: '1.1' }}
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithOdoo(heroData?.headline || 'Chargement...')
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white leading-relaxed max-w-3xl"
                  dangerouslySetInnerHTML={{
                    __html: formatSubheadline((heroData?.subheadline || 'Chargement...')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&amp;/g, '&'))
                  }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-row gap-4 justify-start max-w-lg mx-auto"
              >
                <Button
                  size="sm"
                  className="bg-[var(--color-secondary)] hover:bg-white text-white hover:text-[var(--color-main)] px-8 py-4 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base sm:text-base lg:text-lg font-semibold group rounded-full h-16 sm:h-12 lg:h-14"
                  onClick={() => scrollToSection('#contact')}
                >
                  {heroData?.ctaPrimary?.text || 'Chargement...'}
                  {getIconComponent(heroData?.ctaPrimary?.icon || 'ArrowRight')}
                </Button>
                {/* Second CTA Button - Redirects to Cas Client */}
                <Link href="/cas-client">
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-8 py-4 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base sm:text-base lg:text-lg font-semibold border-2  text-[var(--color-main)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-main)] rounded-full h-16 sm:h-12 lg:h-14"
                  >
                    {heroData?.ctaSecondary?.text || 'Chargement...'}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2"
            >
              <div className="relative mx-4 sm:mx-6 lg:mx-0">
                <div className="bg-white p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border-4 border-[var(--color-secondary)]">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-white rounded-lg lg:rounded-xl overflow-hidden">
                    {/* Video element */}
                    <video
                      ref={videoRef}
                      src={heroData?.videoUrl || ''}
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                      playsInline
                    />

                    {/* Sound toggle button - only on larger screens */}
                    <button
                      onClick={toggleSound}
                      className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 lg:p-3 rounded-full transition-all duration-200 hidden sm:flex items-center justify-center"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" />
                      ) : (
                        <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" />
                      )}
                    </button>
                  </div>

                  {/* Expertise Badge overlay - hidden on mobile, visible on desktop */}
                  <div className="hidden lg:block absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 bg-white rounded-xl shadow-lg border border-gray-200 p-2 sm:p-3 lg:p-3 hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    {heroData?.expertiseBadgeUrl ? (
                      <img
                        src={heroData.expertiseBadgeUrl}
                        alt="Expertise badge"
                        className="object-contain"
                        style={{ width: '6.8125rem', height: '3.625rem' }}
                        onError={(e) => {
                          console.error('Badge image failed to load:', heroData?.expertiseBadgeUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-sm sm:text-base lg:text-lg font-bold text-[var(--color-main)]">3 ans</div>
                        <div className="text-xs sm:text-sm text-gray-700">d'expertise</div>
                      </div>
                    )}
                  </div>
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

export default HeroSection; 