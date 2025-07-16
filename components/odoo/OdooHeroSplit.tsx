"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import StatsSection from '../StatsSection';

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
    <section id="hero" className="relative h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute 3 -left-20 w-96 h-96 bg-white/50 rounded-full filter blur-3xl" />
      <div className="absolute -top-1/4 -right-20 w-96 h-96 bg-white/50 rounded-full filter blur-3xl" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16 max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >

                <Badge variant="outline" className="border-gray-300 text-gray-600 px-3 py-1">Partenaire Silver Odoo</Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-none tracking-tighter"
                style={{ lineHeight: '1.1' }}
              >
                Toute votre entreprise sur une plateforme.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base text-gray-600 leading-relaxed max-w-lg"
              >
                En tant que Partenaire Officiel Odoo, notre agence conçoit des implémentations sur mesure qui unifient vos processus métier.
                <span className="font-semibold text-[var(--odoo-purple)]"> Simple, efficace, et abordable.</span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-[var(--odoo-purple)] hover:bg-[var(--odoo-purple-dark)] text-white px-6 py-3 text-base font-semibold group rounded-full"
                onClick={() => scrollToSection('#contact')}
              >
                Parlons de votre projet
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 py-3 text-base font-semibold border-2 border-[var(--odoo-purple)] text-[var(--odoo-purple)] hover:bg-[var(--odoo-purple)] hover:text-white rounded-full"
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
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl">
                <div className="relative aspect-video bg-gradient-to-br from-[var(--odoo-purple-light)] to-white rounded-2xl overflow-hidden">

                  {/* Future video element will go here */}
                  <video src={heroData.videoUrl} muted autoPlay loop className="w-full h-full object-cover" />
                </div>

                {/* Small stats overlay */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--odoo-purple)]">5 ans</div>
                    <div className="text-xs text-gray-600">d'expertise</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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