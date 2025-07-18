"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import StatsSection from '../StatsSection';
import CompaniesCarousel from '../CompaniesCarousel';

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
}

interface OdooHeroSplitProps {
  heroData: HeroData;
  isPreview?: boolean;
}

function OdooHeroSplit({ heroData, isPreview = false }: OdooHeroSplitProps) {
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
      router.push('/contact');
    }, 'appointment');
  };

  const handleCaseStudyClick = async () => {
    await handleAsyncAction(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/contact');
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
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background blur elements - responsive positioning */}
      <div className="absolute -left-10 sm:-left-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/50 rounded-full filter blur-3xl" />
      <div className="absolute -top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 bg-white/50 rounded-full filter blur-3xl" />

      <div className="relative w-full flex-1 flex flex-col justify-center py-8 sm:py-12 pt-16 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-8 order-2 lg:order-1"
            >
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4 sm:mb-0"
                >
                  <Badge variant="outline" className="border-gray-300 text-gray-600 px-3 py-1.5 text-xs sm:text-sm bg-white/80 backdrop-blur-sm">
                    Partenaire Silver Odoo
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-none tracking-tighter"
                  style={{ lineHeight: '1.1' }}
                >
                  Toute votre entreprise sur une plateforme.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg"
                >
                  En tant que Partenaire Officiel Odoo, notre agence conçoit des implémentations sur mesure qui unifient vos processus métier.
                  <span className="font-semibold text-[var(--color-main)]"> Simple, efficace, et abordable.</span>
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button
                  size="lg"
                  className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold group rounded-full w-full sm:w-auto"
                  onClick={() => scrollToSection('#contact')}
                >
                  Parlons de votre projet
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white rounded-full w-full sm:w-auto"
                  onClick={() => scrollToSection('#modules')}
                >
                  Découvrir nos solutions
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
                <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl shadow-xl lg:shadow-2xl">
                  <div className="relative aspect-video bg-gradient-to-br from-[var(--odoo-purple-light)] to-white rounded-xl sm:rounded-2xl overflow-hidden">
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
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all duration-200 hidden sm:flex items-center justify-center"
                    >
                      {isMuted ? (
                        <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>

                  {/* Small stats overlay - responsive positioning */}
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 lg:-bottom-4 lg:-right-4 bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 lg:p-4 border">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-main)]">3 ans</div>
                      <div className="text-xs sm:text-sm text-gray-600">d'expertise</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Companies Carousel */}
      <div className="pb-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CompaniesCarousel />
        </div>
      </div>

      {/* Trust Metrics - Full width outside hero container */}
      <div className="w-full">
        <StatsSection />
      </div>
    </section>
  );
}

export default OdooHeroSplit; 