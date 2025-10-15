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



import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';

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
import { Button } from '@/components/ui/button';
import CurvedLinesBackground from '@/components/ui/CurvedLinesBackground';
import PerformanceMonitor from '../PerformanceMonitor';
import { useVisualEffects } from '@/hooks/use-visual-effects';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';

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


     const [mounted, setMounted] = useState(false);
     const { settings: visualEffectsSettings } = useVisualEffects();

     // Use singleton geolocation service
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

               // Use cached data if available and fresh
               const cachedData = sessionStorage.getItem('homePageData');
               if (cachedData) {
                    try {
                         const parsed = JSON.parse(cachedData);
                         // Check if cached data has regions field (for backward compatibility)
                         const hasRegions = parsed.data?.hero?.carousel?.companies?.some((company: any) => company.regions);
                         
                         if (parsed.timestamp && (Date.now() - parsed.timestamp) < 5 * 60 * 1000 && hasRegions) { // 5 minutes cache + regions check
                             
                              setHomePageData(parsed.data);
                              return;
                         } else if (!hasRegions) {
                              console.log('🏠 HomePage - Cached data missing regions field, fetching fresh data');
                              // Clear the cache to force fresh fetch
                              sessionStorage.removeItem('homePageData');
                         }
                    } catch (e) {
                         // Cache parse error, fetch fresh data
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

     // Handle URL hash navigation for smooth scrolling
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


     // Render the main content
     const renderMainContent = () => (
          <div className="min-h-screen overflow-hidden relative">

               {/* SECTION 1: Hero Section - Responsive height for different screen sizes */}
               <div id="hero" className="h-screen lg:min-h-[55vh] xl:min-h-[85vh] 2xl:min-h-[90vh] relative bg-[var(--color-main)]">
                    <div className="h-[95vh] lg:min-h-[55vh] xl:min-h-[85vh] 2xl:min-h-[90vh] flex flex-col justify-center pt-20 lg:pt-10 xl:pt-20 2xl:pt-20 relative z-10 bg-transparent">
                         {/* Mobile Hero */}
                         <div className="lg:hidden">
                              <HeroSectionMobile heroData={homePageData?.hero} userRegion={userRegion} isPreview={false} />
                         </div>
                         {/* Desktop Hero */}
                         <div className="hidden lg:block">
                              <HomeHeroSplit heroData={homePageData?.hero} userRegion={userRegion} isPreview={false} />
                         </div>
                    </div>
               </div>
               {/* Mobile Companies Carousel - Overlapping with fade - OUTSIDE gradient */}
               <div className="lg:hidden bg-[var(--color-main)] py-6 -mt-5 relative z-10 companies-carousel-transparent">
                    <CompaniesCarouselV3
                         companies={homePageData?.hero?.carousel?.companies}
                         userRegion={userRegion}
                         speed={homePageData?.hero?.carousel?.speed ? Math.min(homePageData.hero.carousel.speed, 50) : 25}
                         text={homePageData?.hero?.carousel?.text}
                         layout="carousel"
                         theme="light"
                         showCount={false}
                    />
               </div>
               {/* SECTION 2: Video Testimonials - HomePage */}
                <div id="video-testimonials" className="relative z-10">
                    <VideoTestimonialsSection 
                         selectedClients={homePageData?.selectedClients} 
                         sectionData={homePageData?.videoTestimonials}
                    />
               </div>
               {/* SECTION 3: Odoo Certification - HomePage */}
               <div id="certification" className="relative z-10">
                    <Suspense fallback={<div className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div></div></div>}>
                         <LazyOdooCertificationSection certificationData={homePageData?.certification} />
                    </Suspense>
               </div>
               {/* SECTION 4: Platform Modules Timeline - Overlapping with fade */}
               <section className="py-12 lg:py-6 xl:py-16 2xl:py-20 bg-white overflow-hidden pt-20 lg:pt-8 xl:pt-20 2xl:pt-24 relative z-30" id="modules">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">{homePageData?.platformSection?.headline}</div>
                              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                   {homePageData?.platformSection?.subheadline && (
                                        <>
                                             {homePageData.platformSection.subheadline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{homePageData.platformSection.subheadline.split(' ').slice(1).join(' ')}</span>
                                        </>
                                   )}
                              </h2>
                              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                   {homePageData?.platformSection?.description}
                              </p>
                         </div>

                         {/* Timeline 1 - Scrolling Up */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[500px] lg:h-[450px] xl:h-[600px] relative">

                              <div className="relative overflow-hidden rounded-2xl timeline-container">
                                   <div className="flex flex-col space-y-6 animate-scroll-up">
                                        {[...timeline1, ...timeline1].map((app, index) => {
                                             const cardKey = `timeline1-${index}`;
                                             if (hiddenTimelineCards.has(cardKey)) return null;

                                             return (
                                                  <div
                                                       key={cardKey}
                                                       className="timeline-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                                  >
                                                       <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                            <img
                                                                 src={app.icon}
                                                                 alt={app.title}
                                                                 className="w-12 h-12 object-contain"
                                                                 onError={() => handleTimelineCardError(cardKey)}
                                                            />
                                                       </div>
                                                       <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                                                       <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                                            {app.description}
                                                       </p>
                                                       <div className="space-y-2">
                                                            {app.features.slice(0, 2).map((feature, i) => (
                                                                 <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                                                                      <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                                                                      {feature}
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             );
                                        })}
                                   </div>
                              </div>


                              <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
                                   <div className="flex flex-col space-y-6 animate-scroll-down">
                                        {[...timeline2, ...timeline2].map((app, index) => {
                                             const cardKey = `timeline2-${index}`;
                                             if (hiddenTimelineCards.has(cardKey)) return null;

                                             return (
                                                  <div
                                                       key={cardKey}
                                                       className="timeline-card bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                                  >
                                                       <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                            <img
                                                                 src={app.icon}
                                                                 alt={app.title}
                                                                 className="w-12 h-12 object-contain"
                                                                 onError={() => handleTimelineCardError(cardKey)}
                                                            />
                                                       </div>
                                                       <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                                                       <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                                            {app.description}
                                                       </p>
                                                       <div className="space-y-2">
                                                            {app.features.slice(0, 2).map((feature, i) => (
                                                                 <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                                                                      <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                                                                      {feature}
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             );
                                        })}
                                   </div>
                              </div>


                              <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
                                   <div className="flex flex-col space-y-6 animate-scroll-up-slow">
                                        {[...timeline3, ...timeline3].map((app, index) => {
                                             const cardKey = `timeline3-${index}`;
                                             if (hiddenTimelineCards.has(cardKey)) return null;

                                             return (
                                                  <div
                                                       key={cardKey}
                                                       className="timeline-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                                  >
                                                       <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                            <img
                                                                 src={app.icon}
                                                                 alt={app.title}
                                                                 className="w-12 h-12 object-contain"
                                                                 onError={() => handleTimelineCardError(cardKey)}
                                                            />
                                                       </div>
                                                       <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                                                       <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                                            {app.description}
                                                       </p>
                                                       <div className="space-y-2">
                                                            {app.features.slice(0, 2).map((feature, i) => (
                                                                 <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                                                                      <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                                                                      {feature}
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             );
                                        })}
                                   </div>
                              </div>


                         </div>
                    </div>
               </section>
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
               {/* SECTION 8: Pricing Section - HomePage */}
               <section id="pricing" className="relative z-10">
                    <PricingSection pricingData={homePageData?.pricing} />
               </section>
              
               {/* SECTION 9: Contact Section - HomePage */}
               <div id="contact">
                    <ContactSection contactData={homePageData?.contact} />
               </div>
               {/* SECTION 10: FAQ Section - HomePage */}
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