"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import StatsSection from '../../StatsSection';
import CompaniesCarousel from '../../CompaniesCarousel';

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
    }>;
    speed?: number;
    text?: string; // Text to display above the carousel
  };
}

interface HeroSectionProps {
  heroData: HeroData;
  isPreview?: boolean;
}

function HeroSection({ heroData, isPreview = false }: HeroSectionProps) {
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

  return (
    <section id="hero" className="relative overflow-hidden" style={{ marginTop: '-2rem', paddingTop: '0' }}>
      {/* Background blur elements - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block absolute -left-10 sm:-left-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/50 rounded-full filter blur-3xl" />
      <div className="hidden lg:block absolute -top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/50 rounded-full filter blur-3xl" />

      <div className="relative w-full py-0 pt-0 lg:py-4 lg:pt-2" style={{ marginTop: '0', paddingTop: '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Single Column */}
          <div className="lg:hidden space-y-6 pt-0 mt-0 -mt-4" style={{ marginTop: '0', paddingTop: '0' }}>
            {/* 1. Header First */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight tracking-tight text-left mt-0 pt-0"
              style={{ lineHeight: '1.1', marginTop: '0', paddingTop: '0' }}
            >
              {heroData.headline}
            </motion.h1>

            {/* 2. Video Second */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full"
            >
              <div className="relative mx-2 sm:mx-4">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--odoo-purple-light)] to-white rounded-lg overflow-hidden">
                    {/* Video element */}
                    <video
                      ref={videoRef}
                      src={heroData.videoUrl}
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                      playsInline
                    />

                    {/* Expertise Badge - completely hidden on mobile */}
                    <div className="absolute -bottom-4 -right-4 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/40 p-2" style={{ display: 'none' }}>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[var(--color-main)]">3 ans</div>
                        <div className="text-xs text-gray-600">d'expertise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description - Now displayed under the video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: heroData.description
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&amp;/g, '&')
              }}
            />

            {/* 3. CTA Buttons - Side by Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 justify-center px-2"
            >
              <Button
                size="sm"
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-3 py-2 text-sm font-semibold rounded-full flex-1 h-9"
                onClick={() => scrollToSection('#contact')}
              >
                {heroData.ctaPrimary.text}
                {getIconComponent(heroData.ctaPrimary.icon)}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-3 py-2 text-sm font-semibold border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white rounded-full flex-1 h-9"
                onClick={() => scrollToSection('#modules')}
              >
                {heroData.ctaSecondary.text}
              </Button>
            </motion.div>
          </div>

          {/* Desktop Layout - Two Columns (unchanged) */}
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
                    {heroData.badge || 'Partenaire Silver Odoo'}
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 leading-tight tracking-tight"
                  style={{ lineHeight: '1.1' }}
                >
                  {heroData.headline}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 leading-relaxed max-w-3xl"
                  dangerouslySetInnerHTML={{
                    __html: heroData.description
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&amp;/g, '&')
                  }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="sm"
                  className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-4 py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold group rounded-full w-full sm:w-auto h-12 sm:h-12 lg:h-14"
                  onClick={() => scrollToSection('#contact')}
                >
                  {heroData.ctaPrimary.text}
                  {getIconComponent(heroData.ctaPrimary.icon)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-4 py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white rounded-full w-full sm:w-auto h-12 sm:h-12 lg:h-14"
                  onClick={() => scrollToSection('#modules')}
                >
                  {heroData.ctaSecondary.text}
                </Button>
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
                <div className="bg-white/90 backdrop-blur-sm p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--odoo-purple-light)] to-white rounded-lg lg:rounded-xl overflow-hidden">
                    {/* Video element */}
                    <video
                      ref={videoRef}
                      src={heroData.videoUrl}
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
                  <div className="hidden lg:block absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/40 p-2 sm:p-3 lg:p-3 hover:bg-white/95 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                    {heroData.expertiseBadgeUrl ? (
                      <img
                        src={heroData.expertiseBadgeUrl}
                        alt="Expertise badge"
                        className="w-50 h-20 lg:w-50 lg:h-30 object-contain"
                        onError={(e) => {
                          console.error('Badge image failed to load:', heroData.expertiseBadgeUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-sm sm:text-base lg:text-lg font-bold text-[var(--color-main)]">3 ans</div>
                        <div className="text-xs sm:text-sm text-gray-600">d'expertise</div>
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
      <div className="hidden lg:block bg-white pt-12 sm:pt-16 md:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CompaniesCarousel
            companies={heroData.carousel?.companies}
            speed={heroData.carousel?.speed}
            text={heroData.carousel?.text}
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection; 