"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Play } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';
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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!videoContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldLoadVideo) {
          setShouldLoadVideo(true);
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, [shouldLoadVideo]);

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
    <div id="hero-mobile" className="lg:hidden relative bg-[var(--color-main)]">
      <div className="flex flex-col justify-start pt-8 pb-8 relative z-10 bg-transparent">
        <div className="lg:hidden px-4">
          {/* 1. Badge Image - First on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <div className="flex items-center justify-center">
              <img
                src="/images/odooSilverBadge-2.png"
                alt="Odoo Silver Partner Badge"
                className='w-[180px] h-[180px]'
              />
            </div>
          </motion.div>

          {/* 2. Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white leading-tight tracking-tight text-center mb-6"
            style={{ lineHeight: '1.2',fontSize: '2rem' }}
            dangerouslySetInnerHTML={{
              __html: formatTextWithOdoo(heroData?.headline || 'Chargement...')
            }}
          />

          {/* 3. Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-white/90 leading-relaxed text-center px-2 mb-8"
            style={{ fontSize: '1rem' }}
            dangerouslySetInnerHTML={{
              __html: formatSubheadline((heroData?.subheadline || 'Chargement...')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&'))
            }}
          />

          {/* 4. CTA Buttons - Matching Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4 justify-center px-2 max-w-md mx-auto w-full pb-4"
          >
            <Button
              size="lg"
              className="bg-[var(--color-secondary)] hover:bg-white text-white hover:text-[var(--color-main)] px-20 py-4 text-base font-semibold rounded-full h-14 shadow-sm hover:shadow-md transition-all duration-200 max-w-xs mx-auto"
              onClick={() => scrollToSection('#contact')}
            >
              {heroData?.ctaPrimary?.text || 'Chargement...'}
              {getIconComponent(heroData?.ctaPrimary?.icon || 'ArrowRight')}
            </Button>

            {/*  
            <Link href="/cas-client" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-base font-semibold bg-white hover:bg-[var(--color-secondary)] text-[var(--color-main)] hover:text-white rounded-full h-14 shadow-sm hover:shadow-md transition-all duration-200 w-full"
              >
                {heroData?.ctaSecondary?.text || 'Chargement...'}
              </Button>
            </Link>
            */}
          </motion.div>
        </div>
        
      </div>

      {/* 5. Mobile Companies Carousel - Overlapping with fade - OUTSIDE gradient */}
      <div className="lg:hidden bg-[var(--color-main)] py-6 -mt-5 relative z-10 companies-carousel-transparent">
        <CompaniesCarouselV3
          companies={heroData?.carousel?.companies}
          userRegion={userRegion}
          speed={heroData?.carousel?.speed ? Math.min(heroData.carousel.speed, 50) : 25}
          text={heroData?.carousel?.text}
          layout="carousel"
          theme="light"
          showCount={false}
        />
      </div>

      {/* 6. Video */}
      <div className="lg:hidden px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full px-2 mb-8"
        >
          <div className="relative">
            <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-white/30">
              <div 
                ref={videoContainerRef}
                className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-white rounded-xl overflow-hidden"
              >
                {/* Loading placeholder */}
                {!shouldLoadVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                    <div className="text-center">
                      <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                      <p className="text-gray-500 text-sm">Chargement de la vidéo...</p>
                    </div>
                  </div>
                )}
                {/* Video element */}
                {shouldLoadVideo && (
                  <video
                    ref={videoRef}
                    src={heroData?.videoUrl || '/videos/presentation_odoo.mp4'}
                    muted
                    autoPlay
                    loop
                    preload="metadata"
                    className="w-full h-full object-cover"
                    playsInline
                  onError={(e) => {
                    // Use setTimeout to ensure video element is ready
                    setTimeout(() => {
                      const target = videoRef.current || (e.target as HTMLVideoElement);
                      if (!target) {
                        console.error('Video loading error: Video element not found');
                        return;
                      }
                      
                      const error = target.error;
                      const errorInfo: any = {
                        src: heroData?.videoUrl || '/videos/presentation_odoo.mp4',
                        currentSrc: target.currentSrc || target.src,
                        networkState: target.networkState,
                        readyState: target.readyState,
                        videoWidth: target.videoWidth,
                        videoHeight: target.videoHeight,
                      };

                      if (error) {
                        errorInfo.errorCode = error.code;
                        errorInfo.errorMessage = error.message;
                        errorInfo.errorDetails = {
                          code: error.code,
                          message: error.message,
                          MEDIA_ERR_ABORTED: error.code === MediaError.MEDIA_ERR_ABORTED,
                          MEDIA_ERR_NETWORK: error.code === MediaError.MEDIA_ERR_NETWORK,
                          MEDIA_ERR_DECODE: error.code === MediaError.MEDIA_ERR_DECODE,
                          MEDIA_ERR_SRC_NOT_SUPPORTED: error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                        };
                      } else {
                        errorInfo.error = 'No error object available';
                      }

                      console.error('Video loading error:', errorInfo);
                    }, 100);
                  }}
                  onLoadStart={() => {
                    console.log('Video loading started:', heroData?.videoUrl || '/videos/presentation_odoo.mp4');
                  }}
                  onCanPlay={() => {
                    console.log('Video can play');
                  }}
                />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSectionMobile;

