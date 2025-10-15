/**
 * HomePageV1.tsx
 * 
 * Version 1 of the homepage - Full clone of the main homepage
 * Independent version that can be modified separately
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import $ from 'jquery';



import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';

import HomeHeroSplit from '@/components/home/hero/HeroSectionV1';
import HeroSectionV1Mobile from '@/components/home/hero/HeroSectionV1Mobile';
import HeroBannerBackground from '@/components/ui/HeroBannerBackground';
import Image from 'next/image';
import Loader from '@/components/home/Loader';
import Link from 'next/link';
import PricingSection from '../PricingSection';
import ContactSection from '../ContactSection';
import StatsSection from '../StatsSection';
import CompaniesCarousel from '../CompaniesCarousel';
import CompaniesCarouselV2 from '../CompaniesCarouselV2';
import CompaniesCarouselV3 from '../CompaniesCarouselV3';
import CompaniesCarouselV3V1 from '../CompaniesCarouselV3V1';
import VideoTestimonialsSection from '../VideoTestimonialsSection';
import TestimonialsSection from './TestimonialsSection';
import ServicesSection from '../ServicesSection';
import FAQSection from '../FAQSection';
import OdooCertificationSection from '../OdooCertificationSection';
import OurAgencySection from './OurAgencySection';
import { Button } from '@/components/ui/button';
import CurvedLinesBackground from '@/components/ui/CurvedLinesBackground';
import PerformanceMonitor from '../PerformanceMonitor';
import { useVisualEffects } from '@/hooks/use-visual-effects';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import PlatformModulesSection from './PlatformModulesSection';

const LazyFAQSection = lazy(() => import('../FAQSection'));
const LazyOdooCertificationSection = lazy(() => import('../OdooCertificationSection'));


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
     services: {
          headline: string;
          subheadline: string;
          description: string;
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
     selectedClients?: string[]; // Array of client IDs to display in video testimonials
     videoTestimonials?: {
          headline: string;
          description: string;
          subdescription?: string;
          videos: Array<{
               id: string;
               company: string;
               companyLogo: string;
               tagline?: string;
               duration: string;
               backgroundColor: string;
               textColor: string;
               videoUrl?: string;
               thumbnailUrl?: string;
               targetRegions?: string[];
          }>;
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

export default function HomePageV1() {
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


     const [mounted, setMounted] = useState(false);
     const { settings: visualEffectsSettings } = useVisualEffects();

     const { region: userRegion, loading: locationLoading, isFromCache } = useGeolocationSingleton();
     
    


     const [hiddenTimelineCards, setHiddenTimelineCards] = useState<Set<string>>(new Set());

     useEffect(() => {
          setMounted(true);
     }, []);




     const handleTimelineCardError = (cardKey: string) => {
          setHiddenTimelineCards(prev => new Set([...prev, cardKey]));
     };

     useEffect(() => {
          if (!mounted) return;

          const timer = setTimeout(() => setStatsVisible(true), 800);
          const loadTimer = setTimeout(() => setIsLoaded(true), 100);

          setTimeout(() => {
               fetchHomePageData();
               fetchClientCases();
          }, 100);

          return () => {
               clearTimeout(timer);
               clearTimeout(loadTimer);
          };
     }, [mounted]);


     const fetchHomePageData = async () => {
          try {
               setIsDataLoading(true);

               const cachedData = sessionStorage.getItem('homePageData');
               if (cachedData) {
                    try {
                         const parsed = JSON.parse(cachedData);
                         const hasRegions = parsed.data?.hero?.carousel?.companies?.some((company: any) => company.regions);
                         
                         if (parsed.timestamp && (Date.now() - parsed.timestamp) < 5 * 60 * 1000 && hasRegions) {
                             
                              setHomePageData(parsed.data);
                              return;
                         } else if (!hasRegions) {
                              console.log('🏠 HomePage - Cached data missing regions field, fetching fresh data');
                              sessionStorage.removeItem('homePageData');
                         }
                    } catch (e) {
                    }
               }

               const url = `/api/content?type=home-page`;

               const response = await fetch(url, {
                    cache: 'force-cache',
                    headers: {
                         'Accept': 'application/json'
                    }
               });

               if (response.ok) {
                    const data = await response.json();

                    if (data && Array.isArray(data) && data.length > 0) {
                         const homePageContent = data.find(item => item.type === 'home-page');

                         if (homePageContent && homePageContent.content) {
                              console.log('🏠 HomePageV1 - Fetched home page data, selectedClients:', homePageContent.content.selectedClients);
                              
                              setHomePageData(homePageContent.content);

                              sessionStorage.setItem('homePageData', JSON.stringify({
                                   data: homePageContent.content,
                                   timestamp: Date.now()
                              }));
                         }
                    }
               }
          } catch (error) {
               console.error('Error fetching home page data:', error);
          } finally {
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
                    setTimeout(() => {
                         scrollToSection(hash);
                    }, 500);
               }
          };

          handleHashChange();
          window.addEventListener('hashchange', handleHashChange);

          return () => {
               window.removeEventListener('hashchange', handleHashChange);
          };
     }, [mounted, homePageData]);


     if (isDataLoading) {
          return <Loader />;
     }

     if (!homePageData) {
          return (
               <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-pulse text-[var(--color-secondary)] text-lg mb-4">Chargement des données...</div>
                         <div className="text-gray-600">Veuillez patienter pendant que nous chargeons le contenu.</div>
                    </div>
               </div>
          );
     }


     const renderMainContent = () => (
          <div className="min-h-screen overflow-hidden relative">

               {/* Mobile Hero */}
               <div className="lg:hidden">
                    <HeroSectionV1Mobile heroData={homePageData?.hero} userRegion={userRegion} isPreview={false} />
               </div>
               
               {/* Desktop Hero */}
               <div className="hidden lg:block">
                    <HeroBannerBackground opacity={0.8}>
                         <div id="hero" className="h-screen lg:min-h-[55vh] xl:min-h-[85vh] 2xl:min-h-[90vh] relative bg-[var(--color-main)]">
                              <div className="h-[95vh] lg:min-h-[55vh] xl:min-h-[85vh] 2xl:min-h-[90vh] flex flex-col justify-center pt-10 lg:pt-10 xl:pt-20 2xl:pt-20 relative z-10 bg-transparent">
                                   <div>
                                        <HomeHeroSplit heroData={homePageData?.hero} userRegion={userRegion} isPreview={false} />
                                   </div>
                              </div>
                         </div>
                    </HeroBannerBackground>
               </div>
               <div className="lg:hidden bg-[var(--color-main)] py-6 -mt-5 relative z-10 companies-carousel-transparent pb-8">
                    <CompaniesCarouselV3V1
                         companies={homePageData?.hero?.carousel?.companies}
                         userRegion={userRegion}
                         speed={homePageData?.hero?.carousel?.speed ? Math.min(homePageData.hero.carousel.speed, 50) : 25}
                         text={homePageData?.hero?.carousel?.text}
                         layout="carousel"
                         theme="modern"
                         showCount={false}
                    />
               </div>
                <div id="video-testimonials" className="relative z-10">
                    <VideoTestimonialsSection selectedClients={homePageData?.selectedClients} />
               </div>
               <div id="certification" className="relative z-10">
                    <Suspense fallback={<div className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div></div></div>}>
                         <LazyOdooCertificationSection certificationData={homePageData?.certification} />
                    </Suspense>
               </div>
               <PlatformModulesSection 
                    homePageData={homePageData}
                    timeline1={timeline1}
                    timeline2={timeline2}
                    timeline3={timeline3}
               />
               <div className="relative z-10" id="services">
                    <ServicesSection servicesData={homePageData?.services} />
               </div>
               <div id="testimonials">
                    {homePageData?.testimonialsSection && (
                    <TestimonialsSection
                              testimonialsSectionData={homePageData.testimonialsSection}
                         testimonials={Array.isArray(homePageData?.testimonials) ? homePageData.testimonials : []}
                    />
                    )}
               </div>
               
               <div id="about">
                    <OurAgencySection
                         key={userRegion}
                         partnershipData={homePageData?.partnership}
                         userRegion={userRegion}
                    />
               </div>
               <div id="contact">
                    <ContactSection contactData={homePageData?.contact} />
               </div>
               <div id="faq">
                    <Suspense fallback={<div className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div></div></div>}>
                         <LazyFAQSection faqData={homePageData?.faq} />
                    </Suspense>
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
