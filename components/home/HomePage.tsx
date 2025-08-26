"use client"

// Preload critical resources
const preloadCriticalResources = () => {
     // Preload hero image
     const heroImg = new window.Image();
     heroImg.src = "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/hero-digital-transformation.png";

     // Preload critical fonts/icons
     const link = document.createElement('link');
     link.rel = 'preload';
     link.href = '/fonts/inter-var.woff2';
     link.as = 'font';
     link.type = 'font/woff2';
     link.crossOrigin = 'anonymous';
     document.head.appendChild(link);
};

// Execute preloading
if (typeof window !== 'undefined') {
     preloadCriticalResources();
}

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
     Calculator,
     ShoppingCart,
     Package,
     Users,
     CheckCircle,
     ArrowRight,
     Quote,
     Rocket,
     Check,
     X,
     BadgeCheck,
     Clock,
     Star,
     MessageCircle,
     Settings,
     CircleCheckBig,
     Calendar,
     Shield,
     Phone,
     Mail,
     BarChart3,
     FileText,
     ChevronLeft,
     ChevronRight
} from 'lucide-react';
import HomeHeroSplit from '@/components/home/hero/HeroSection';
import Image from 'next/image';
import Loader from '@/components/home/Loader';
import Link from 'next/link';
import PricingSection from '../PricingSection';
import ContactSection from '../ContactSection';
import StatsSection from '../StatsSection';
import CompaniesCarousel from '../CompaniesCarousel';
import VideoTestimonialsSection from '../VideoTestimonialsSection';
import ServicesSection from '../ServicesSection';
import FAQSection from '../FAQSection';
import OdooCertificationSection from '../OdooCertificationSection';
import { Button } from '@/components/ui/button';
import { getUserLocation, getRegionFromCountry } from '@/lib/geolocation';
import PerformanceMonitor from '../PerformanceMonitor';

// Lazy load non-critical components
const LazyFAQSection = lazy(() => import('../FAQSection'));
const LazyOdooCertificationSection = lazy(() => import('../OdooCertificationSection'));

interface Testimonial {
     _id: string;
     name: string;
     role: string;
     quote: string;
     result: string;
     avatar: string;
     company?: string;
     targetRegions?: string[]; // Add region targeting
}

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
          }>;
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
               targetRegions?: string[]; // Add region targeting
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

export default function HomePage() {
     const [activeTab, setActiveTab] = useState(0);
     const [statsVisible, setStatsVisible] = useState(false);
     const [isLoaded, setIsLoaded] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [loadingType, setLoadingType] = useState<string>('');
     const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
     const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
     const [clientCases, setClientCases] = useState<any[]>([]);
     const [clientCarouselPage, setClientCarouselPage] = useState(0);
     const clientsPerPage = 3;
     const [mounted, setMounted] = useState(false);
     const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
     const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
     const [userRegion, setUserRegion] = useState<string>('international');
     const [locationLoading, setLocationLoading] = useState(true);
     const [hiddenTimelineCards, setHiddenTimelineCards] = useState<Set<string>>(new Set());
     const [renderPhase, setRenderPhase] = useState<'critical' | 'above-fold' | 'below-fold'>('critical');

     useEffect(() => {
          setMounted(true);
     }, []);

     // Progressive rendering: Phase 1 - Critical content (header + hero)
     useEffect(() => {
          if (mounted) {
               setRenderPhase('above-fold');
          }
     }, [mounted]);

     // Progressive rendering: Phase 2 - Above-fold content after hero
     useEffect(() => {
          if (renderPhase === 'above-fold') {
               const timer = setTimeout(() => setRenderPhase('below-fold'), 200);
               return () => clearTimeout(timer);
          }
     }, [renderPhase]);

     // Detect user location for region-based filtering
     useEffect(() => {
          if (!mounted) return;

          const detectUserLocation = async () => {
               const startTime = performance.now();
               try {
                    const location = await getUserLocation();
                    if (location) {
                         const region = getRegionFromCountry(location.countryCode);
                         setUserRegion(region);

                         // Performance monitoring
                         const endTime = performance.now();
                         console.log(`🚀 Geolocation detected in ${(endTime - startTime).toFixed(2)}ms`);
                    }
               } catch (error) {
                    console.error('HomePage - Error detecting user location:', error);
               } finally {
                    setLocationLoading(false);
               }
          };

          detectUserLocation();
     }, [mounted]);

     // Filter testimonials based on user region
     const shouldShowTestimonial = (testimonial: Testimonial): boolean => {
          if (!testimonial.targetRegions || testimonial.targetRegions.length === 0) {
               return true; // Show to all if no specific regions defined
          }

          return testimonial.targetRegions.includes('all') || testimonial.targetRegions.includes(userRegion);
     };

     const filteredTestimonials = availableTestimonials.filter(shouldShowTestimonial);

     // Reset testimonial index when filtered testimonials change
     useEffect(() => {
          if (filteredTestimonials.length > 0 && currentTestimonialIndex >= filteredTestimonials.length) {
               setCurrentTestimonialIndex(0);
          } else if (filteredTestimonials.length === 0) {
               setCurrentTestimonialIndex(0);
          }
     }, [filteredTestimonials, currentTestimonialIndex]);

     // Function to handle hiding timeline cards
     const handleTimelineCardError = (cardKey: string) => {
          setHiddenTimelineCards(prev => new Set([...prev, cardKey]));
     };

     useEffect(() => {
          if (!mounted) return;

          const timer = setTimeout(() => setStatsVisible(true), 800);
          const loadTimer = setTimeout(() => setIsLoaded(true), 100);

          // Fetch home page data with a small delay to ensure proper initialization
          setTimeout(() => {
               fetchHomePageData();
               fetchClientCases();
          }, 100);

          return () => {
               clearTimeout(timer);
               clearTimeout(loadTimer);
          };
     }, [mounted]);

     // Fetch testimonials only after geolocation is detected
     useEffect(() => {
          if (!mounted || locationLoading) return;

          fetchTestimonials();
     }, [mounted, locationLoading]);

     const fetchHomePageData = async () => {
          try {
               console.log('🔄 Starting to fetch home page data...');

               // Use cached data if available and fresh
               const cachedData = sessionStorage.getItem('homePageData');
               if (cachedData) {
                    try {
                         const parsed = JSON.parse(cachedData);
                         if (parsed.timestamp && (Date.now() - parsed.timestamp) < 5 * 60 * 1000) { // 5 minutes cache
                              console.log('📋 Using cached home page data');
                              setHomePageData(parsed.data);
                              return;
                         }
                    } catch (e) {
                         console.log('📋 Cache parse error, fetching fresh data');
                    }
               }

               const url = `/api/content?type=home-page`;
               console.log('📡 Fetching from URL:', url);

               const response = await fetch(url, {
                    cache: 'force-cache', // Use Next.js caching
                    headers: {
                         'Accept': 'application/json'
                    }
               });

               console.log('📥 Response status:', response.status);
               console.log('📥 Response ok:', response.ok);

               if (response.ok) {
                    const data = await response.json();
                    console.log('📊 Raw API response data:', data);
                    console.log('📊 Data type:', typeof data);
                    console.log('📊 Is array:', Array.isArray(data) ? data.length : 'N/A');

                    if (data && Array.isArray(data) && data.length > 0) {
                         // Find the home-page content specifically
                         const homePageContent = data.find(item => item.type === 'home-page');

                         if (homePageContent) {
                              console.log('📄 Found home-page content:', homePageContent);
                              console.log('📄 Content type:', homePageContent.type);
                              console.log('📄 Has content field:', !!homePageContent.content);

                              // Check if the content field exists
                              if (homePageContent.content) {
                                   console.log('✅ Setting home page data:', homePageContent.content);
                                   setHomePageData(homePageContent.content);

                                   // Cache the data for 5 minutes
                                   sessionStorage.setItem('homePageData', JSON.stringify({
                                        data: homePageContent.content,
                                        timestamp: Date.now()
                                   }));
                              } else {
                                   console.error('❌ Home page content structure is invalid');
                              }
                         } else {
                              console.error('❌ No home-page content found in the data array');
                              console.log('📊 Available content types:', data.map(item => item.type));
                         }
                    } else {
                         console.error('❌ Invalid data format or no content found:', data);
                    }
               } else {
                    console.error('❌ Failed to fetch home page data:', response.status);
                    const errorText = await response.text();
                    console.error('❌ Error response:', errorText);
               }
          } catch (error) {
               console.error('💥 Error fetching home page data:', error);
          }
     };

     const fetchTestimonials = async () => {
          try {
               // Use cached testimonials if available and fresh
               const region = userRegion || 'international';
               if (!region) {
                    console.log('⏳ Waiting for geolocation detection...');
                    return;
               }

               const cacheKey = `testimonials_${region}`;
               const cachedData = sessionStorage.getItem(cacheKey);
               if (cachedData) {
                    try {
                         const parsed = JSON.parse(cachedData);
                         if (parsed.timestamp && (Date.now() - parsed.timestamp) < 10 * 60 * 1000) { // 10 minutes cache
                              console.log('📋 Using cached testimonials for region:', region);
                              setAvailableTestimonials(parsed.data);
                              return;
                         }
                    } catch (e) {
                         console.log('📋 Cache parse error, fetching fresh testimonials');
                    }
               }

               const response = await fetch(`/api/testimonials?region=${region}`, {
                    cache: 'force-cache' // Use Next.js caching
               });
               if (response.ok) {
                    const data = await response.json();
                    console.log('📊 Raw testimonials API response data:', data);
                    console.log('📊 Testimonials data type:', typeof data);
                    console.log('📊 Is array:', Array.isArray(data) ? data.length : 'N/A');

                    // Map the testimonials data to match the expected format
                    const mappedTestimonials = data.map((item: any) => ({
                         _id: item._id,
                         name: item.author || '',
                         role: item.role || '',
                         company: item.company || '',
                         quote: item.text || '',
                         avatar: item.photo || '',
                         targetRegions: item.targetRegions || ['all'], // Include region targeting
                    }));

                    console.log('✅ Mapped testimonials:', mappedTestimonials);
                    setAvailableTestimonials(mappedTestimonials);

                    // Cache the testimonials for 10 minutes
                    sessionStorage.setItem(cacheKey, JSON.stringify({
                         data: mappedTestimonials,
                         timestamp: Date.now()
                    }));
               } else {
                    console.error('Failed to fetch testimonials, status:', response.status);
               }
          } catch (error) {
               console.error('Error fetching testimonials:', error);
          }
     };

     const fetchClientCases = async () => {
          try {
               // Use cached client cases if available and fresh
               const cachedData = sessionStorage.getItem('clientCases');
               if (cachedData) {
                    try {
                         const parsed = JSON.parse(cachedData);
                         if (parsed.timestamp && (Date.now() - parsed.timestamp) < 15 * 60 * 1000) { // 15 minutes cache
                              console.log('📋 Using cached client cases');
                              setClientCases(parsed.data);
                              return;
                         }
                    } catch (e) {
                         console.log('📋 Cache parse error, fetching fresh client cases');
                    }
               }

               const response = await fetch(`/api/content?type=clients-page`, {
                    cache: 'force-cache' // Use Next.js caching
               });
               if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                         const clientsContent = data.find(item => item.type === 'clients-page');
                         if (clientsContent && clientsContent.content && clientsContent.content.clientCases) {
                              setClientCases(clientsContent.content.clientCases);

                              // Cache the client cases for 15 minutes
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

     const renderAvatar = (testimonialId: string) => {
          if (!testimonialId) return null;

          const testimonial = availableTestimonials.find(t => t._id === testimonialId);
          if (!testimonial) return null;

          // Add safety check for testimonial properties
          const avatar = testimonial?.avatar || '';
          const name = testimonial?.name || '';

          // Check if avatar is a URL (starts with http or /)
          if (avatar && (avatar.startsWith('http') || avatar.startsWith('/'))) {
               return (
                    <Image
                         src={avatar}
                         alt={name}
                         width={40}
                         height={40}
                         className="w-10 h-10 rounded-full object-cover"
                    />
               );
          } else {
               // Use initials
               const initials = name.split(' ').map(n => n[0]).join('');
               return (
                    <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                         <span className="text-white font-bold text-sm">{avatar || initials}</span>
                    </div>
               );
          }
     };

     // Split apps into 3 columns for timelines with priority for most demanded modules
     // Get existing apps from data and filter out modules without icons
     const existingApps = homePageData?.platformSection?.apps || [];
     const appsWithIcons = existingApps.filter(app =>
          app.icon &&
          app.icon.trim() !== '' &&
          app.icon !== 'undefined' &&
          app.icon !== 'null' &&
          !app.icon.includes('placeholder')
     );

     // Create timelines with prominently marked apps appearing more frequently
     // Add prominent apps at different positions to distribute them evenly
     const prominentApps = appsWithIcons.filter(app => app.showProminently);

     // Create base timeline and insert prominent apps at different positions
     const createTimelineWithProminent = (apps: any[], offset: number) => {
          // Create a base timeline with all apps
          const timeline = [...apps];

          // Create different arrangements by rotating the array based on offset
          // This ensures no duplicates while creating variety
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

     const nextTestimonial = () => {
          if (filteredTestimonials.length > 1) {
               setCurrentTestimonialIndex((prev) => {
                    const nextIndex = prev + 1;
                    // If we reach the end, loop back to the beginning
                    return nextIndex >= filteredTestimonials.length ? 0 : nextIndex;
               });
          }
     };

     const prevTestimonial = () => {
          if (filteredTestimonials.length > 1) {
               setCurrentTestimonialIndex((prev) => {
                    const prevIndex = prev - 1;
                    // If we go below 0, loop to the end
                    return prevIndex < 0 ? filteredTestimonials.length - 1 : prevIndex;
               });
          }
     };

     // Add safety check for homePageData and location loading
     if (!homePageData || locationLoading) {
          return <Loader />;
     }

     // Progressive rendering loading indicator
     if (renderPhase === 'critical') {
          return (
               <div className="min-h-screen bg-white overflow-hidden">
                    <div className="h-[95vh] flex flex-col justify-center pt-20">
                         <HomeHeroSplit heroData={homePageData?.hero} isPreview={false} />
                    </div>
                    <div className="flex justify-center items-center py-20">
                         <div className="animate-pulse text-[var(--color-secondary)] text-lg">Chargement en cours...</div>
                    </div>
               </div>
          );
     }

     return (
          <>
               <PerformanceMonitor />
               <div className="min-h-screen bg-white overflow-hidden">
                    {/* SECTION 1: Hero Section - HomePage */}
                    <div className="h-[95vh] flex flex-col justify-center pt-20">
                         <HomeHeroSplit heroData={homePageData?.hero} isPreview={false} />

                    </div>

                    {/* Phase 2: Above-fold content - Mobile Companies Carousel & Platform Modules */}
                    {renderPhase === 'above-fold' && (
                         <>
                              {/* Mobile Companies Carousel - Separate Section */}
                              <div className="lg:hidden bg-white py-8">
                                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <CompaniesCarousel
                                             companies={homePageData?.hero?.carousel?.companies}
                                             speed={40}
                                             text={homePageData?.hero?.carousel?.text}
                                        />
                                   </div>
                              </div>

                              {/* SECTION 2: Platform Modules Timeline - HomePage */}
                              <section className="py-12 bg-white overflow-hidden" id="modules">
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
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px] relative">

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


                                   <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                                   <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                              </div>
                         </div>
                    </section>
                         </>
                    )}

                    {/* Phase 3: Below-fold content - All other sections */}
                    {renderPhase === 'below-fold' && (
                         <>

                    {/* SECTION 3: Video Testimonials - HomePage */}

                    <VideoTestimonialsSection videoTestimonialsData={homePageData?.videoTestimonials} />

                    {/* SECTION 4: Services Section - HomePage */}
                    <ServicesSection servicesData={homePageData?.services} />

                    {/* SECTION 5: Odoo Certification - HomePage */}
                    <Suspense fallback={<div className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div></div></div>}>
                         <LazyOdooCertificationSection certificationData={homePageData?.certification} />
                    </Suspense>

                    {/* SECTION 6: Pricing Section - HomePage */}
                    <section id="pricing">
                         <PricingSection pricingData={homePageData?.pricing} />
                    </section>
                    {/* SECTION 7: Our Agency - HomePage */}
                    <section className="py-20 bg-white" id="team">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">Blackswan technology </div>
                                   <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                        {homePageData?.partnership?.headline || 'Plus qu\'un intégrateur, un partenaire de confiance.'}
                                   </h2>
                                   <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                        {homePageData?.partnership?.subdescription || 'Une équipe de consultants certifiés, passionnés par l\'accompagnement de nos clients dans leur transformation digitale.'}
                                   </p>
                              </div>
                              <div className="flex flex-col md:flex-row gap-10 items-center justify-center">

                                   <div className="relative w-full md:w-1/2 flex justify-center group">
                                        <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-rotate-1">
                                             <div className="relative overflow-hidden">
                                                  <Image
                                                       src={homePageData?.partnership?.image || "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"}
                                                       alt="Notre équipe"
                                                       width={600}
                                                       height={350}
                                                       className="object-cover w-full h-72 md:h-80 transition-transform duration-700 group-hover:scale-110"
                                                       onError={(e) => {
                                                            e.currentTarget.src = "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg";
                                                       }}
                                                  />
                                                  {/* Gradient overlay on hover */}
                                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                  {/* Subtle border glow */}
                                                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-secondary)]/30 transition-all duration-500"></div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="w-full md:w-1/2 flex flex-col gap-6">
                                        {homePageData?.partnership?.features ? (
                                             homePageData.partnership.features.map((feature: any, index: number) => (
                                                  <div key={index} className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
                                                       {feature.icon === 'BadgeCheck' && <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />}
                                                       {feature.icon === 'Users' && <Users className="w-8 h-8 text-[var(--color-secondary)]" />}
                                                       {feature.icon === 'Clock' && <Clock className="w-8 h-8 text-[var(--color-secondary)]" />}
                                                       {feature.icon === 'Star' && <Star className="w-8 h-8 text-[var(--color-secondary)]" />}
                                                       <div>
                                                            <div className="font-bold text-lg text-gray-900">{feature.title}</div>
                                                            <div className="text-gray-500 text-sm">{feature.description}</div>
                                                       </div>
                                                  </div>
                                             ))
                                        ) : (
                                             <>
                                                  <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
                                                       <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />
                                                       <div>
                                                            <div className="font-bold text-lg text-gray-900">Partenaire Silver Odoo</div>
                                                       </div>
                                                  </div>
                                                  <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
                                                       <Users className="w-8 h-8 text-[var(--color-secondary)]" />
                                                       <div>
                                                            <div className="font-bold text-lg text-gray-900">Équipe certifiée</div>
                                                            <div className="text-gray-500 text-sm">100% de nos consultants sont certifiés Odoo</div>
                                                       </div>
                                                  </div>
                                                  <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
                                                       <Clock className="w-8 h-8 text-[var(--color-secondary)]" />
                                                       <div>
                                                            <div className="font-bold text-lg text-gray-900">Support réactif</div>
                                                            <div className="text-gray-500 text-sm">Réponse garantie sous 4h en journée</div>
                                                       </div>
                                                  </div>
                                                  <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
                                                       <Star className="w-8 h-8 text-[var(--color-secondary)]" />
                                                       <div>
                                                            <div className="font-bold text-lg text-gray-900">Excellence reconnue</div>
                                                            <div className="text-gray-500 text-sm">99% de satisfaction client sur tous nos projets</div>
                                                       </div>
                                                  </div>
                                             </>
                                        )}
                                   </div>
                              </div>

                         </div>
                    </section>

                    {/* SECTION 8: Testimonials - HomePage */}
                    {homePageData &&
                         homePageData.testimonials &&
                         Array.isArray(homePageData.testimonials) &&
                         homePageData.testimonials.length > 0 &&
                         filteredTestimonials.length > 0 &&
                         availableTestimonials.length > 0 && (
                              <section className="py-20 bg-white" id="testimonials">
                                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="text-center mb-12">
                                             <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TÉMOIGNAGES</div>
                                             <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                                  {homePageData?.testimonialsSection?.description || 'Nos clients témoignent'}
                                             </h2>
                                             <p className="text-lg text-gray-600">
                                                  {homePageData?.testimonialsSection?.subdescription || 'Découvrez pourquoi nos clients nous recommandent'}
                                             </p>
                                        </div>

                                        {/* Navigation and Content Container */}
                                        <div className="relative">
                                             {/* Navigation Buttons - Only show when there are multiple testimonials */}
                                             {filteredTestimonials.length > 1 && (
                                                  <>
                                                       <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
                                                            <button
                                                                 onClick={prevTestimonial}
                                                                 className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                                                                 aria-label="Témoignages précédents"
                                                            >
                                                                 <ChevronLeft className="w-6 h-6 text-gray-600" />
                                                            </button>
                                                       </div>

                                                       <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
                                                            <button
                                                                 onClick={nextTestimonial}
                                                                 className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                                                                 aria-label="Témoignages suivants"
                                                            >
                                                                 <ChevronRight className="w-6 h-6 text-gray-600" />
                                                            </button>
                                                       </div>
                                                  </>
                                             )}

                                             {/* Content Area with Proper Padding for Buttons */}
                                             <div className={filteredTestimonials.length > 1 ? "px-16 md:px-20" : "px-4"}>
                                                  {/* Desktop: Show 3 testimonials */}
                                                  <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
                                                       {filteredTestimonials.length > 0 ? [0, 1, 2].map((offset) => {
                                                            if (filteredTestimonials.length === 0) return null;
                                                            const testimonialIndex = (currentTestimonialIndex + offset) % filteredTestimonials.length;
                                                            const testimonial = filteredTestimonials[testimonialIndex];
                                                            if (!testimonial) return null;

                                                            return (
                                                                 <div
                                                                      key={`desktop-${testimonial._id}-${currentTestimonialIndex}-${offset}`}
                                                                      className="bg-white rounded-xl p-6 lg:p-8 flex flex-col shadow-lg border border-gray-200 h-full transform transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-2"
                                                                 >
                                                                      {/* Stars */}
                                                                      <div className="flex items-center mb-4">
                                                                           {[...Array(5)].map((_, i) => (
                                                                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                                                           ))}
                                                                      </div>

                                                                      {/* Quote */}
                                                                      <blockquote className="italic text-gray-900 mb-6 flex-1 leading-relaxed">"{testimonial.quote}"</blockquote>

                                                                      <div className="border-t border-gray-100 my-4"></div>

                                                                      {/* Author */}
                                                                      <div className="flex items-center gap-4 mt-auto">
                                                                           {testimonial._id && renderAvatar(testimonial._id)}
                                                                           <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                                     <div className="font-bold text-gray-900 truncate">{testimonial.name}</div>
                                                                                     <div className="text-sm text-gray-500">•</div>
                                                                                     <div className="text-sm text-gray-500 truncate">{testimonial.role}</div>
                                                                                </div>
                                                                                {testimonial.company && (
                                                                                     <div className="text-sm text-[var(--color-secondary)] font-semibold mt-1 truncate">{testimonial.company}</div>
                                                                                )}
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            );
                                                       }) : (
                                                            <div className="col-span-3 text-center py-12">
                                                                 <p className="text-gray-500">Aucun témoignage disponible pour votre région.</p>
                                                            </div>
                                                       )}
                                                  </div>

                                                  {/* Mobile: Show 1 testimonial */}
                                                  <div className="md:hidden">
                                                       {filteredTestimonials.length > 0 ? (() => {
                                                            if (filteredTestimonials.length === 0 || currentTestimonialIndex >= filteredTestimonials.length) return null;
                                                            const testimonial = filteredTestimonials[currentTestimonialIndex];
                                                            if (!testimonial) return null;

                                                            return (
                                                                 <div
                                                                      key={`mobile-${testimonial._id}-${currentTestimonialIndex}`}
                                                                      className="bg-white rounded-xl p-6 flex flex-col shadow-lg border border-gray-200 w-full max-w-lg mx-auto"
                                                                 >
                                                                      {/* Stars */}
                                                                      <div className="flex items-center mb-4">
                                                                           {[...Array(5)].map((_, i) => (
                                                                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                                                           ))}
                                                                      </div>

                                                                      {/* Quote */}
                                                                      <blockquote className="italic text-gray-900 mb-6 leading-relaxed">"{testimonial.quote}"</blockquote>

                                                                      <div className="border-t border-gray-100 my-4"></div>

                                                                      {/* Author */}
                                                                      <div className="flex items-center gap-4 mt-auto">
                                                                           {testimonial._id && renderAvatar(testimonial._id)}
                                                                           <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                                     <div className="font-bold text-gray-900 truncate">{testimonial.name}</div>
                                                                                     <div className="text-sm text-gray-500">•</div>
                                                                                     <div className="text-sm text-gray-500 truncate">{testimonial.role}</div>
                                                                                </div>
                                                                                {testimonial.company && (
                                                                                     <div className="text-sm text-[var(--color-secondary)] font-semibold mt-1 truncate">{testimonial.company}</div>
                                                                                )}
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            );
                                                       })() : (
                                                            <div className="text-center py-12">
                                                                 <p className="text-gray-500">Aucun témoignage disponible pour votre région.</p>
                                                            </div>
                                                       )}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </section>
                         )}

                    {/* SECTION 9: Contact Section - HomePage */}
                    <ContactSection contactData={homePageData?.contact} />

                    {/* SECTION 10: FAQ Section - HomePage */}
                    <Suspense fallback={<div className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div></div></div>}>
                         <LazyFAQSection faqData={homePageData?.faq} />
                    </Suspense>
                         </>
                    )}

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
          </>
     );
}