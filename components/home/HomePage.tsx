/**
 * HomePage.tsx
 * 
 * Main homepage component that renders all sections of the website's landing page.
 * This component orchestrates the entire homepage experience including hero section,
 * services, testimonials, pricing, and contact forms with performance optimization.
 * 
 * WHERE IT'S USED:
 * - Main homepage (/app/page.tsx) - Renders the complete homepage
 * - Entry point for all homepage content and sections
 * 
 * KEY FEATURES:
 * - Hero section with main value proposition and CTAs
 * - Services overview with interactive elements
 * - Customer testimonials and case studies
 * - Pricing section with regional adaptation
 * - Contact form for lead generation
 * - Company statistics and achievements
 * - Video testimonials and company carousel
 * - FAQ section and Odoo certification display
 * - Performance monitoring and optimization
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements lazy loading for non-critical components
 * - Preloads critical resources (images, fonts) for performance
 * - Integrates with geolocation API for regional content
 * - Uses framer-motion for animations and transitions
 * - Implements performance monitoring and analytics
 * - Responsive design with Tailwind CSS
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import $ from 'jquery';



import React, { useState, useEffect, useRef } from 'react';

import HomeHeroSplit from '@/components/home/hero/HeroSection';
import HeroSectionMobile from '@/components/home/hero/HeroSectionMobile';
import Image from 'next/image';
import Loader from '@/components/home/Loader';
import Link from 'next/link';
import PricingSection from '../PricingSection';
import ContactSection from '../ContactSection';
import StatsSection from '../StatsSection';
import CompaniesCarousel from '../CompaniesCarousel';
import CompaniesCarouselV2 from '../CompaniesCarouselV2';
import CompaniesCarouselV3 from '../CompaniesCarouselV3';
import VideoTestimonialsSection from '../VideoTestimonialsSection';
import TestimonialsSection from './TestimonialsSection';
import ServicesSection from '../ServicesSection';
import FAQSection from '../FAQSection';
import OdooCertificationSection from '../OdooCertificationSection';
import OurAgencySection from './OurAgencySection';
import PlatformModulesSection from './PlatformModulesSection';
import VideoBackgroundSection from './VideoBackgroundSection';
import { Button } from '@/components/ui/button';
import CurvedLinesBackground from '@/components/ui/CurvedLinesBackground';
import PerformanceMonitor from '../PerformanceMonitor';
import { useVisualEffects } from '@/hooks/use-visual-effects';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';


interface HomePageData {
     type: string;
     title: string;
     hero: {
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
     };
     trustMetrics: Array<{
          number: number;
          suffix: string;
          label: string;
     }>;
     platformSection: {
          headline: string;
          subheadline: string;
          description?: string;
          apps: Array<{
               icon: string;
               title: string;
               description: string;
               features: string[];
               showProminently?: boolean;
          }>;
     };
     videoBackgroundSection?: {
          headline?: string;
          description?: string;
          ctaText?: string;
          ctaUrl?: string;
     };
     services: {
          headline: string;
          subheadline: string;
          services: Array<{
               icon: string;
               title: string;
               description: string;
               image: string;
               buttonText?: string;
          }>;
          defaultButtonText?: string;
     };
     certification: {
          headline: string;
          subheadline: string;
          description: string;
          partnerTitle: string;
          partnerDescription: string;
          features: Array<{
               title: string;
               description: string;
               icon: string;
          }>;
     };
     pricing: {
          headline: string;
          subheadline: string;
          description?: string;
          plans: Array<{
               name: string;
               description: string;
               price: string;
               estimation: string;
               features: string[];
               cta: string;
          }>;
     };
     partnership: {
          headline: string;
          description?: string;
          subdescription?: string;
          modules?: string[];
          expertiseText?: string;
          image?: string;
          imageOtherCountries?: string;
          features?: Array<{
               title: string;
               description: string;
               icon: string;
          }>;
     };
     testimonials: string[];
     testimonialsSection: {
          headline: string;
          description: string;
          subdescription?: string;
     };
     selectedClients?: Array<{
          id: string;
          order: number;
     }>; // Array of client IDs with ordering for video testimonials
     videoTestimonials?: {
          headline: string;
          subtitle: string;
          showStars: boolean;
          starCount: number;
          ctaButton: {
               text: string;
               url: string;
          };
     };
     faq?: {
          headline: string;
          description: string;
          subdescription?: string;
          items: Array<{
               question: string;
               answer: string;
          }>;
     };
     contact?: {
          headline: string;
          description: string;
          subdescription?: string;
          formTitle: string;
          formDescription: string;
          benefits: Array<{
               title: string;
               description: string;
               icon: string;
          }>;
          consultation: {
               title: string;
               description: string;
          };
          contactInfo: {
               phone: string;
               email: string;
          };
          guarantee: string;
     };
     finalCta: {
          headline: string;
          description: string;
          ctaPrimary: {
               text: string;
               icon: string;
          };
          ctaSecondary: {
               text: string;
               icon: string;
          };
     };
}

export default function HomePage() {
     const [activeTab, setActiveTab] = useState(0);
     const [statsVisible, setStatsVisible] = useState(false);
     const [isLoaded, setIsLoaded] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [loadingType, setLoadingType] = useState<string>('');
     const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
     const [isDataLoading, setIsDataLoading] = useState(true);
     const [clientCases, setClientCases] = useState<any[]>([]);
     const [clientCarouselPage, setClientCarouselPage] = useState(0);
     const clientsPerPage = 3;


     const { settings: visualEffectsSettings } = useVisualEffects();

     // Use singleton geolocation service
     const { region: userRegion, loading: locationLoading, isFromCache } = useGeolocationSingleton();




     useEffect(() => {
          setStatsVisible(true);
          setIsLoaded(true);

          const cachedData = sessionStorage.getItem('homePageData');
          if (cachedData) {
               try {
                    const parsed = JSON.parse(cachedData);
                    const hasRegions = parsed.data?.hero?.carousel?.companies?.some((company: any) => company.regions);
                    if (parsed.timestamp && (Date.now() - parsed.timestamp) < 5 * 60 * 1000 && hasRegions) {
                         setHomePageData(parsed.data);
                         setIsDataLoading(false);
                    }
               } catch (e) {
                    // Continue to fetch
               }
          }

          fetchHomePageData();
          fetchClientCases();
     }, []);


     const fetchHomePageData = async () => {
          if (homePageData) return;

          try {
               const url = `/api/content?type=home-page`;
               const response = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                         'Accept': 'application/json'
                    }
               });

               if (response.ok) {
                    const data = await response.json();

                    if (data && Array.isArray(data) && data.length > 0) {
                         const homePageContent = data.find(item => item.type === 'home-page');

                         if (homePageContent && homePageContent.content) {
                              setHomePageData(homePageContent.content);
                              setIsDataLoading(false);

                              sessionStorage.setItem('homePageData', JSON.stringify({
                                   data: homePageContent.content,
                                   timestamp: Date.now()
                              }));
                         }
                    }
               }
          } catch (error) {
               console.error('Error fetching home page data:', error);
               setIsDataLoading(false);
          }
     };


     const fetchClientCases = async () => {
          try {
               const cachedData = sessionStorage.getItem('clientCases');
               if (cachedData) {
                    try {
                         const parsed = JSON.parse(cachedData);
                         if (parsed.timestamp && (Date.now() - parsed.timestamp) < 15 * 60 * 1000) {
                              setClientCases(parsed.data);
                              return;
                         }
                    } catch (e) {
                         // Cache parse error, fetch fresh data
                    }
               }

               const response = await fetch(`/api/content?type=clients-page`, {
                    cache: 'force-cache'
               });
               if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                         const clientsContent = data.find(item => item.type === 'clients-page');
                         if (clientsContent && clientsContent.content && clientsContent.content.clientCases) {
                              setClientCases(clientsContent.content.clientCases);

                              sessionStorage.setItem('clientCases', JSON.stringify({
                                   data: clientsContent.content.clientCases,
                                   timestamp: Date.now()
                              }));
                         }
                    }
               }
          } catch (error) {
               console.error('Error fetching client cases:', error);
          }
     };

     const AnimatedCounter = ({ target, suffix, duration = 2500 }: { target: number, suffix: string, duration?: number }) => {
          const [count, setCount] = useState(0);

          useEffect(() => {
               if (!statsVisible) return;

               let startTime: number | undefined;
               const animate = (currentTime: number) => {
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);

                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    setCount(Math.floor(easeOutQuart * target));

                    if (progress < 1) {
                         requestAnimationFrame(animate);
                    }
               };

               requestAnimationFrame(animate);
          }, [target, duration, statsVisible]);

          return <span>{count}{suffix}</span>;
     };


     const existingApps = homePageData?.platformSection?.apps || [];
     const appsWithIcons = existingApps.filter(app =>
          app.icon &&
          app.icon.trim() !== '' &&
          app.icon !== 'undefined' &&
          app.icon !== 'null' &&
          !app.icon.includes('placeholder')
     );

     const prominentApps = appsWithIcons.filter(app => app.showProminently);

     const createTimelineWithProminent = (apps: any[], offset: number) => {
          const timeline = [...apps];

          const rotatedTimeline: any[] = [];
          for (let i = 0; i < timeline.length; i++) {
               const index = (i + offset) % timeline.length;
               rotatedTimeline.push(timeline[index]);
          }

          return rotatedTimeline;
     };

     const timeline1 = createTimelineWithProminent(appsWithIcons, 0);
     const timeline2 = createTimelineWithProminent(appsWithIcons, 2);
     const timeline3 = createTimelineWithProminent(appsWithIcons, 4);

     const scrollToSection = (sectionId: string) => {
          const element = document.getElementById(sectionId);
          if (element) {
               element.scrollIntoView({ behavior: 'smooth' });
          }
     };

     useEffect(() => {
          const handleHashChange = () => {
               const hash = window.location.hash.substring(1);
               if (hash) {
                    requestAnimationFrame(() => {
                         scrollToSection(hash);
                    });
               }
          };

          handleHashChange();
          window.addEventListener('hashchange', handleHashChange);

          return () => {
               window.removeEventListener('hashchange', handleHashChange);
          };
     }, [homePageData]);


     if (!homePageData && isDataLoading) {
          return <Loader />;
     }

     if (!homePageData) {
          return <Loader />;
     }


     // Render the main content
     const renderMainContent = () => (
          <div className="min-h-screen overflow-hidden relative">

               {/* SECTION 1: Hero Section - mobile only*/}
               {homePageData?.hero && (
                    <HeroSectionMobile heroData={homePageData.hero} userRegion={userRegion} isPreview={false} />
               )}

               {/* SECTION 1: Hero Section - Desktop only */}
               {homePageData?.hero && (
                    <HomeHeroSplit heroData={homePageData.hero} userRegion={userRegion} isPreview={false} />
               )}


               {/* SECTION 2: Video Testimonials - HomePage */}
               <div id="video-testimonials" className="relative z-10">
                    <VideoTestimonialsSection
                         selectedClients={homePageData?.selectedClients}
                         sectionData={homePageData?.videoTestimonials}
                    />
               </div>
               {/* SECTION 3: Odoo Certification - HomePage */}
               <div id="certification" className="relative z-10">
                    <OdooCertificationSection certificationData={homePageData?.certification} />
               </div>
               {/* SECTION 4: Video Background Section */}
               <VideoBackgroundSection
                    headline={homePageData?.videoBackgroundSection?.headline}
                    description={homePageData?.videoBackgroundSection?.description}
                    ctaText={homePageData?.videoBackgroundSection?.ctaText}
                    ctaUrl={homePageData?.videoBackgroundSection?.ctaUrl}
               />

               {/* SECTION 5: Platform Modules Timeline */}
               {homePageData && (
                    <PlatformModulesSection
                         homePageData={homePageData}
                         timeline1={timeline1}
                         timeline2={timeline2}
                         timeline3={timeline3}
                    />
               )}
               {/* SECTION 5: Services Section - HomePage */}
               <div className="relative z-10" id="services">
                    <ServicesSection servicesData={homePageData?.services} />
               </div>
               {/* SECTION 6: Testimonials - HomePage */}
               <div id="testimonials">
                    {homePageData?.testimonialsSection && (
                         <TestimonialsSection
                              testimonialsSectionData={homePageData.testimonialsSection}
                              testimonials={homePageData?.testimonials}
                         />
                    )}
               </div>
               {/* SECTION 7: Our Agency - HomePage */}
               <div id="about">
                    <OurAgencySection
                         key={userRegion} // Force re-render when region changes
                         partnershipData={homePageData?.partnership}
                         userRegion={userRegion}
                    />
               </div>
               {/*
                SECTION 8: Pricing Section - HomePage 
               <section id="pricing" className="relative z-10">
                    <PricingSection pricingData={homePageData?.pricing} />
               </section>
              */}
               {/* SECTION 9: Contact Section - HomePage */}
               <div id="contact">
                    <ContactSection contactData={homePageData?.contact} />
               </div>
               {/* SECTION 10: FAQ Section - HomePage */}
               <div id="faq">
                    <FAQSection faqData={homePageData?.faq} />
               </div>


               <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes scroll-up-slow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-scroll-up {
          animation: scroll-up 60s linear infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 60s linear infinite;
        }

        .animate-scroll-up-slow {
          animation: scroll-up-slow 80s linear infinite;
        }

        .timeline-container:hover .animate-scroll-up,
        .timeline-container:hover .animate-scroll-down,
        .timeline-container:hover .animate-scroll-up-slow {
          animation-play-state: paused;
        }
               `}</style>
          </div>
     );

     return (
          <div>
               <PerformanceMonitor />
               <CurvedLinesBackground>
                    {renderMainContent()}
               </CurvedLinesBackground>
          </div>
     );
}