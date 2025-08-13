"use client"

import React, { useState, useEffect, useRef } from 'react';
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

interface Testimonial {
     _id: string;
     name: string;
     role: string;
     quote: string;
     result: string;
     avatar: string;
     company?: string;
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

     useEffect(() => {
          setMounted(true);
     }, []);

     useEffect(() => {
          if (!mounted) return;

          const timer = setTimeout(() => setStatsVisible(true), 800);
          const loadTimer = setTimeout(() => setIsLoaded(true), 100);

          // Fetch home page data with a small delay to ensure proper initialization
          setTimeout(() => {
               fetchHomePageData();
               fetchTestimonials();
               fetchClientCases();
          }, 100);

          return () => {
               clearTimeout(timer);
               clearTimeout(loadTimer);
          };
     }, [mounted]);

     const fetchHomePageData = async () => {
          try {
               const timestamp = Date.now();
               const random = Math.random();
               const response = await fetch(`/api/content?type=home-page&t=${timestamp}&r=${random}`, {
                    cache: 'no-store',
                    headers: {
                         'Cache-Control': 'no-cache, no-store, must-revalidate',
                         'Pragma': 'no-cache',
                         'Expires': '0'
                    }
               });
               if (response.ok) {
                    const data = await response.json();
                    if (data && Array.isArray(data) && data.length > 0) {
                         // Get the first (and should be only) home-page document
                         const homePageContent = data[0];
                         
                         // Check if the content field exists
                         if (homePageContent.content) {
                              setHomePageData(homePageContent.content);
                         } else {
                              console.error('Home page content structure is invalid');
                         }
                    } else {
                         console.error('Invalid data format or no home-page content found:', data);
                    }
               } else {
                    console.error('Failed to fetch home page data:', response.status);
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
               }
          } catch (error) {
               console.error('Error fetching home page data:', error);
          }
     };

     const fetchTestimonials = async () => {
          try {
               const timestamp = Date.now();
               const response = await fetch(`/api/testimonials?t=${timestamp}`, {
                    cache: 'no-store'
               });
               if (response.ok) {
                    const data = await response.json();
                    // Map the testimonials data to match the expected format
                    const mappedTestimonials = data.map((item: any) => ({
                         _id: item._id,
                         name: item.author || '',
                         role: item.role || '',
                         quote: item.text || '',
                         result: '',
                         avatar: item.photo || '',
                         company: ''
                    }));
                    setAvailableTestimonials(mappedTestimonials);
               } else {
                    console.error('Failed to fetch testimonials, status:', response.status);
               }
          } catch (error) {
               console.error('Error fetching testimonials:', error);
          }
     };

     const fetchClientCases = async () => {
          try {
               const timestamp = Date.now();
               const response = await fetch(`/api/content?type=clients-page&t=${timestamp}`, {
                    cache: 'no-store'
               });
               if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0 && data[0].content && data[0].content.clientCases) {
                         setClientCases(data[0].content.clientCases);
                    }
               }
          } catch (error) {
               console.error('Error fetching client cases:', error);
          }
     };

     if (!homePageData) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                         <Loader />

                    </div>
               </div>
          );
     }



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
          if (homePageData && homePageData.testimonials) {
               setCurrentTestimonialIndex((prev) => {
                    const nextIndex = prev + 1;
                    // If we reach the end, loop back to the beginning
                    return nextIndex >= homePageData.testimonials.length ? 0 : nextIndex;
               });
          }
     };

     const prevTestimonial = () => {
          if (homePageData && homePageData.testimonials) {
               setCurrentTestimonialIndex((prev) => {
                    const prevIndex = prev - 1;
                    // If we go below 0, loop to the end
                    return prevIndex < 0 ? homePageData.testimonials.length - 1 : prevIndex;
               });
          }
     };

     // Add safety check for homePageData
     if (!homePageData) {
          return (
               <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-secondary)] mx-auto mb-4"></div>
                         <p className="text-gray-600">Chargement des données...</p>
                    </div>
               </div>
          );
     }

     return (
          <>
               <div className="min-h-screen bg-white overflow-hidden">
                    {/* SECTION 1: Hero Section - HomePage */}
                    <div className="h-[95vh] flex flex-col justify-center pt-20">
                         <HomeHeroSplit heroData={homePageData?.hero} isPreview={false} />

                    </div>

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
                                             {[...timeline1, ...timeline1].map((app, index) => (
                                                  <div
                                                       key={`timeline1-${index}`}
                                                       className="timeline-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                                  >
                                                       <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                            <img
                                                                 src={app.icon}
                                                                 alt={app.title}
                                                                 className="w-12 h-12 object-contain"
                                                                 onError={(e) => {
                                                                      e.currentTarget.closest('.timeline-card')?.remove();
                                                                 }}
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
                                             ))}
                                        </div>
                                   </div>


                                   <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
                                        <div className="flex flex-col space-y-6 animate-scroll-down">
                                             {[...timeline2, ...timeline2].map((app, index) => (
                                                  <div
                                                       key={`timeline2-${index}`}
                                                       className="timeline-card bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                                  >
                                                       <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                            <img
                                                                 src={app.icon}
                                                                 alt={app.title}
                                                                 className="w-12 h-12 object-contain"
                                                                 onError={(e) => {
                                                                      e.currentTarget.closest('.timeline-card')?.remove();
                                                                 }}
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
                                             ))}
                                        </div>
                                   </div>


                                   <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
                                        <div className="flex flex-col space-y-6 animate-scroll-up-slow">
                                             {[...timeline3, ...timeline3].map((app, index) => (
                                                  <div
                                                       key={`timeline3-${index}`}
                                                       className="timeline-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                                  >
                                                       <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                            <img
                                                                 src={app.icon}
                                                                 alt={app.title}
                                                                 className="w-12 h-12 object-contain"
                                                                 onError={(e) => {
                                                                      e.currentTarget.closest('.timeline-card')?.remove();
                                                                 }}
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
                                             ))}
                                        </div>
                                   </div>


                                   <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                                   <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                              </div>
                         </div>
                    </section>

                    {/* SECTION 3: Video Testimonials - HomePage */}

                    <VideoTestimonialsSection videoTestimonialsData={homePageData?.videoTestimonials} />

                    {/* SECTION 4: Services Section - HomePage */}
                    <ServicesSection servicesData={homePageData?.services} />

                    {/* SECTION 5: Odoo Certification - HomePage */}
                    <OdooCertificationSection certificationData={homePageData?.certification} />

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
                    {homePageData && homePageData.testimonials && homePageData.testimonials.length > 0 && (
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
                                        {/* Navigation Buttons */}
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

                                        {/* Content Area with Proper Padding for Buttons */}
                                        <div className="px-16 md:px-20">
                                             {/* Desktop: Show 3 testimonials */}
                                             <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
                                                  {[0, 1, 2].map((offset) => {
                                                       const testimonialIndex = (currentTestimonialIndex + offset) % homePageData.testimonials.length;
                                                       const testimonialId = homePageData.testimonials[testimonialIndex];
                                                       const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                                                       if (!testimonial) return null;

                                                       return (
                                                            <div
                                                                 key={`desktop-${testimonialId}-${currentTestimonialIndex}-${offset}`}
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
                                                                      {renderAvatar(testimonialId)}
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
                                                  })}
                                             </div>

                                             {/* Mobile: Show 1 testimonial */}
                                             <div className="md:hidden">
                                                  {(() => {
                                                       const testimonialId = homePageData.testimonials[currentTestimonialIndex];
                                                       const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                                                       if (!testimonial) return null;

                                                       return (
                                                            <div
                                                                 key={`mobile-${testimonialId}-${currentTestimonialIndex}`}
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
                                                                      {renderAvatar(testimonialId)}
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
                                                  })()}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </section>
                    )}

                    {/* SECTION 9: Contact Section - HomePage */}
                    <ContactSection contactData={homePageData?.contact} />

                    {/* SECTION 10: FAQ Section - HomePage */}
                    <FAQSection faqData={homePageData?.faq} />

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