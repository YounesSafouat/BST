"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX } from 'lucide-react';
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
    <section id="hero" className="relative overflow-hidden">
      {/* Background blur elements - responsive positioning */}
      <div className="absolute -left-10 sm:-left-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/50 rounded-full filter blur-3xl" />
      <div className="absolute -top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/50 rounded-full filter blur-3xl" />

      <div className="relative w-full py-4 pt-6 lg:py-8 lg:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Badge
                    variant="outline"
                    className="border-gray-300 text-gray-600 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-gray-50 transition-colors"
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

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 leading-relaxed max-w-3xl"
                >
                  {heroData.description}
                </motion.p>
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
              <div className="relative">
                <div className="bg-white/90 backdrop-blur-sm p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl">
                  <div className="relative aspect-[2/1] bg-gradient-to-br from-[var(--odoo-purple-light)] to-white rounded-lg lg:rounded-xl overflow-hidden">
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

                  {/* Small stats overlay - responsive positioning */}
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-lg shadow-md p-2 lg:p-3 border">
                    <div className="text-center">
                      <div className="text-sm lg:text-base font-bold text-[var(--color-main)]">3 ans</div>
                      <div className="text-xs lg:text-sm text-gray-600">d'expertise</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Companies Carousel */}
      <div className="bg-white pt-12 sm:pt-16 md:pt-20 lg:pt-24">
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