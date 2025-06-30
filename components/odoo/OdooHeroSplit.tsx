"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play, Volume2, VolumeX } from 'lucide-react';

function OdooHeroSplit() {
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

  return (
    <section
      className="relative bg-white pt-20 pb-16 overflow-hidden min-h-screen flex items-center"
      style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#ff5c35]/10 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#ff5c35]/10 rounded-full opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Odoo Logo */}
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <Image
                  src="/Odoo.svg"
                  alt="Odoo"
                  width={120}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-5xl md:text-7xl font-bold text-gray-900 leading-tight transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
            >
              <span className="font-bold text-gray-900">Toute votre entreprise sur</span>
              <br />
              <span className="relative inline-block">
                <span className="font-bold text-gray-900">une plateforme</span>
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#ff5c35]/20 -z-10 transform -rotate-1"></div>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xl md:text-2xl text-gray-700 leading-relaxed font-normal transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
            >
              Simple, efficace, et abordable!
            </p>

            {/* Description */}
            <p
              className={`text-lg text-gray-600 leading-relaxed transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
            >
              En tant que <strong className="text-[#714b67] font-bold">Partenaire Officiel Odoo</strong>, nous concevons des implémentations
              sur mesure qui unifient tous vos processus métier.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button
                className="group bg-[#714b67] text-white px-8 py-4 rounded-lg hover:bg-[#8b5a7d]/90 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                onClick={handleConsultationClick}
                disabled={isLoading}
              >
                <span>{loadingType === 'appointment' ? 'CHARGEMENT...' : 'Démarrer - C\'est gratuit'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-[#8b5a7d] hover:text-[#8b5a7d] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                onClick={handleCaseStudyClick}
                disabled={isLoading}
              >
                <Users className="w-5 h-5" />
                <span>{loadingType === 'projects' ? 'CHARGEMENT...' : 'Rencontrer un Conseiller'}</span>
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
                    <source src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/video_homepage.webm" type="video/webm" />
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
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff5c35]">100+</div>
                <div className="text-sm text-gray-600">Implémentations</div>
              </div>
            </div>
            
            <div className="absolute -top-20 -right-20 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#714b67]">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OdooHeroSplit; 