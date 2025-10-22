"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Play } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';

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

interface HeroSectionMobileProps {
  heroData: HeroData;
  userRegion?: string;
  isPreview?: boolean;
}

function HeroSectionMobile({ heroData, userRegion, isPreview = false }: HeroSectionMobileProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    // Replace "odoo" (case insensitive) with custom styled version
    const odooRegex = /(\b)(odoo)(\b)/gi;
    return text.replace(odooRegex, (match, before, odoo, after) => {
      return `${before}<span style="font-weight: italic; display: inline-block; color: var(--color-secondary);">Odoo</span>${after}`;
    });
  };

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
    <div className="lg:hidden px-4">
      {/* Badge Image - First on Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center"
      >
        <div className="flex items-center justify-center">
          <img 
            src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png" 
            alt="Odoo Silver Partner Badge" 
            className='w-[180px] h-[180px]' 
          />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-white leading-tight tracking-tight text-center mb-6"
        style={{ lineHeight: '1.2' }}
        dangerouslySetInnerHTML={{
          __html: formatTextWithOdoo(heroData?.headline || 'Chargement...')
        }}
      />

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-base text-white/90 leading-relaxed text-center px-2 mb-8"
        dangerouslySetInnerHTML={{
          __html: formatSubheadline((heroData?.subheadline || 'Chargement...')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&'))
        }}
      />

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full px-2 mb-8"
      >
        <div className="relative">
          <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-white/30">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-white rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                src={heroData?.videoUrl || ''}
                muted
                autoPlay
                loop
                className="w-full h-full object-cover"
                playsInline
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons - Matching Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-4 justify-center px-2 max-w-md mx-auto w-full pb-4"
      >
        <Button
          size="lg"
          className="bg-[var(--color-secondary)] hover:bg-white text-white hover:text-[var(--color-main)] px-8 py-4 text-base font-semibold rounded-full h-14 shadow-sm hover:shadow-md transition-all duration-200 w-full"
          onClick={() => scrollToSection('#contact')}
        >
          {heroData?.ctaPrimary?.text || 'Chargement...'}
          {getIconComponent(heroData?.ctaPrimary?.icon || 'ArrowRight')}
        </Button>
        <Link href="/cas-client" className="w-full">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-base font-semibold bg-white hover:bg-[var(--color-secondary)] text-[var(--color-main)] hover:text-white rounded-full h-14 shadow-sm hover:shadow-md transition-all duration-200 w-full"
          >
            {heroData?.ctaSecondary?.text || 'Chargement...'}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default HeroSectionMobile;

