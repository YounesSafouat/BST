"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX } from 'lucide-react';

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
    <section
      className={`relative ${isPreview ? 'pt-4' : 'pt-24'} pb-16 overflow-hidden min-h-[600px] flex items-center`}
      style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center h-full">
            {/* Avatar + Badge */}
            <div className="flex items-center mb-4">

              {/* Dynamic Badge */}
              <span className="inline-flex items-center bg-white text-[var(--color-secondary)] border border-[var(--color-secondary)] rounded-full px-3 py-1 text-xs font-semibold ml-1">
                {heroData?.badge || 'Partenaire Silver Odoo'}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.05] mb-4"
              style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: heroData.headline }}
            />

            {/* Static Description under headline */}
            <div className="text-sm md:text-base text-gray-500 mb-2">
              En tant que Partenaire Officiel Odoo, notre agence conçoit des implémentations sur mesure qui unifient vos processus métier.
            </div>

            {/* Subtitle */}
            <p
              className="text-base md:text-lg text-gray-700 font-normal mb-8"
              style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
            >
              {heroData.subheadline}
            </p>

            {/* Emphasis Line (bold/colored) */}
            {heroData.emphasis && (
              <div className="text-base md:text-lg font-bold text-[var(--color-secondary)] mb-8">{heroData.emphasis}</div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-0">
              <button
                className="group bg-[var(--color-secondary)] text-white px-6 py-2 rounded-full font-bold text-base hover:bg-[var(--color-secondary)]/90 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                onClick={handleConsultationClick}
                disabled={isLoading}
              >
                <span>{loadingType === 'appointment' ? 'CHARGEMENT...' : heroData.ctaPrimary.text}</span>
                {getIconComponent(heroData.ctaPrimary.icon)}
              </button>
              <button
                className="group border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] px-6 py-2 rounded-full font-bold text-base hover:bg-[var(--color-secondary)] hover:text-white transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                onClick={handleCaseStudyClick}
                disabled={isLoading}
              >
                <span>{loadingType === 'projects' ? 'CHARGEMENT...' : heroData.ctaSecondary.text}</span>
                {getIconComponent(heroData.ctaSecondary.icon)}
              </button>
            </div>
          </div>

          {/* Right Side - Video */}
          <div className="relative w-full flex justify-center items-center">
            <div className="relative video-hover-group">
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-1000 delay-800 w-full ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Video Container - Largest possible */}
                <div className="aspect-video w-full max-w-none">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={heroData.videoUrl} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Sound Toggle Button */}
                  <button
                    onClick={toggleSound}
                    className="sound-toggle absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                    aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                </div>

                {/* Video Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Floating Stats */}
            {heroData.stats && heroData.stats.length > 0 && (
              <>
                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--color-main)]">{heroData.stats[0]?.number}{heroData.stats[0]?.suffix}</div>
                    <div className="text-sm text-gray-600">{heroData.stats[0]?.label}</div>
                  </div>
                </div>

                {heroData.stats.length > 1 && (
                  <div className="absolute -top-20 -right-20 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--color-secondary)]">{heroData.stats[1]?.number}{heroData.stats[1]?.suffix}</div>
                      <div className="text-sm text-gray-600">{heroData.stats[1]?.label}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OdooHeroSplit; 