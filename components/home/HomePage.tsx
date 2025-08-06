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

interface OdooData {
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
          expertiseBadgeUrl?: string; // URL of the expertise badge image
          carousel?: {
               companies: Array<{
                    name: string;
                    logo: string;
                    url?: string;
               }>;
               speed?: number;
               text?: string; // Text to display above the carousel
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
          capabilities: Array<{
               icon: string;
               title: string;
               description: string;
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
     const [odooData, setOdooData] = useState<OdooData | null>(null);
     const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
     const [clientCases, setClientCases] = useState<any[]>([]);
     const [clientCarouselPage, setClientCarouselPage] = useState(0);
     const clientsPerPage = 3;
     const [mounted, setMounted] = useState(false);
     const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

     useEffect(() => {
          setMounted(true);
     }, []);

     useEffect(() => {
          if (!mounted) return;

          const timer = setTimeout(() => setStatsVisible(true), 800);
          const loadTimer = setTimeout(() => setIsLoaded(true), 100);

          // Fetch Odoo data with a small delay to ensure proper initialization
          setTimeout(() => {
               fetchOdooData();
               fetchTestimonials();
               fetchClientCases();
          }, 100);

          return () => {
               clearTimeout(timer);
               clearTimeout(loadTimer);
          };
     }, [mounted]);

     const fetchOdooData = async () => {
          try {
               const timestamp = Date.now();
               const random = Math.random();
               const response = await fetch(`/api/content/odoo?t=${timestamp}&r=${random}`, {
                    cache: 'no-store',
                    headers: {
                         'Cache-Control': 'no-cache, no-store, must-revalidate',
                         'Pragma': 'no-cache',
                         'Expires': '0'
                    }
               });
               if (response.ok) {
                    const data = await response.json();
                    if (data && typeof data === 'object') {
                         setOdooData(data);
                    } else {
                         console.error('Invalid data format:', data);
                    }
               } else {
                    console.error('Failed to fetch Odoo data:', response.status);
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
               }
          } catch (error) {
               console.error('Error fetching Odoo data:', error);
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

     if (!odooData) {
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
     const existingApps = odooData?.platformSection?.apps || [];
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
          if (odooData && odooData.testimonials) {
               setCurrentTestimonialIndex((prev) =>
                    (prev + 3) >= odooData.testimonials.length ? 0 : prev + 3
               );
          }
     };

     const prevTestimonial = () => {
          if (odooData && odooData.testimonials) {
               setCurrentTestimonialIndex((prev) =>
                    prev === 0 ? Math.max(0, odooData.testimonials.length - 3) : prev - 3
               );
          }
     };

     // Add safety check for odooData
     if (!odooData) {
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
                    {/* Hero Section - Proper flex layout */}
                    <div className="h-[95vh] flex flex-col justify-center pt-20">
                         <HomeHeroSplit heroData={odooData?.hero} isPreview={false} />

                    </div>

                    {/* Vertical Timeline Carousels */}
                    <section className="py-12 bg-white overflow-hidden" id="modules">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">PLATEFORME TOUT-EN-UN</div>
                                   <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                        {odooData?.platformSection?.headline ? (
                                             <>
                                                  {odooData.platformSection.headline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{odooData.platformSection.headline.split(' ').slice(1).join(' ')}</span>
                                             </>
                                        ) : (
                                             'PLATEFORME TOUT-EN-UN'
                                        )}
                                   </h2>
                                   <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                        {odooData?.platformSection?.subheadline || 'Une plateforme complète pour tous vos besoins'}
                                   </p>
                              </div>

                              {/* Three Vertical Timelines */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px] relative">
                                   {/* Timeline 1 - Scrolling Up */}
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
                                                                      // Hide the entire card if icon fails to load
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

                                   {/* Timeline 2 - Scrolling Down */}
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
                                                                      // Hide the entire card if icon fails to load
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

                                   {/* Timeline 3 - Scrolling Up (Slower) */}
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
                                                                      // Hide the entire card if icon fails to load
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

                                   {/* Gradient Overlays for smooth infinite effect */}
                                   <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                                   <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                              </div>
                         </div>
                    </section>

                    {/* Video Testimonials Section */}

                    <VideoTestimonialsSection videoTestimonialsData={odooData?.videoTestimonials} />

                    {/* Odoo Certification Section */}
                    <OdooCertificationSection />

                    {/* Tarifs & Accompagnement Section */}
                    <section id="pricing">
                         <PricingSection pricingData={odooData?.pricing} />
                    </section>
                    {/* Notre Agence Section */}
                    <section className="py-20 bg-white" id="team">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">NOTRE AGENCE</div>
                                   <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                        {odooData?.partnership?.headline || 'Plus qu\'un intégrateur, un partenaire de confiance.'}
                                   </h2>
                                   <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                        {odooData?.partnership?.subdescription || 'Une équipe de consultants certifiés, passionnés par l\'accompagnement de nos clients dans leur transformation digitale.'}
                                   </p>
                              </div>
                              <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                                   {/* Left: Image with badge */}
                                   <div className="relative w-full md:w-1/2 flex justify-center">
                                        <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-lg">
                                             <Image
                                                  src={odooData?.partnership?.image || "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"}
                                                  alt="Notre équipe"
                                                  width={600}
                                                  height={350}
                                                  className="object-cover w-full h-72 md:h-80"
                                                  onError={(e) => {
                                                       e.currentTarget.src = "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg";
                                                  }}
                                             />
                                        </div>
                                   </div>
                                   {/* Right: Features */}
                                   <div className="w-full md:w-1/2 flex flex-col gap-6">
                                        {odooData?.partnership?.features ? (
                                             odooData.partnership.features.map((feature: any, index: number) => (
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

                    {/* Testimonials */}
                    {odooData && odooData.testimonials && odooData.testimonials.length > 0 && (
                         <section className="py-20 bg-white" id="testimonials">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                   <div className="text-center mb-12">
                                        <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TÉMOIGNAGES</div>
                                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                             {odooData?.testimonialsSection?.description || 'Nos clients témoignent'}
                                        </h2>
                                        <p className="text-lg text-gray-600">
                                             {odooData?.testimonialsSection?.subdescription || 'Découvrez pourquoi nos clients nous recommandent'}
                                        </p>
                                   </div>
                                   <div className="flex items-center gap-4">
                                        {/* Navigation Arrows - Only show if more than 3 testimonials */}
                                        {odooData.testimonials.length > 3 && (
                                             <button
                                                  onClick={prevTestimonial}
                                                  className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                                                  aria-label="Témoignages précédents"
                                             >
                                                  <ChevronLeft className="w-6 h-6 text-gray-600 transition-transform duration-300 group-hover:-translate-x-1" />
                                             </button>
                                        )}

                                                                                      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 flex-1">
                                             {odooData.testimonials
                                                  .slice(currentTestimonialIndex, currentTestimonialIndex + 3)
                                                  .map((testimonialId: string, index: number) => {
                                                       const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                                                       if (!testimonial) return null;
                                                       return (
                                                            <div
                                                                 key={`${testimonialId}-${currentTestimonialIndex}`}
                                                                 className="bg-white rounded-xl px-8 py-8 flex flex-col shadow-lg border border-gray-200 w-full max-w-md mx-auto transform transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2"
                                                                 style={{
                                                                      animationDelay: `${index * 100}ms`,
                                                                      animation: 'slideInUp 0.6s ease-out forwards'
                                                                 }}
                                                            >
                                                                 {/* Stars */}
                                                                 <div className="flex items-center mb-4">
                                                                      {[...Array(5)].map((_, i) => (
                                                                           <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                                                      ))}
                                                                 </div>
                                                                 {/* Quote */}
                                                                 <blockquote className="italic text-gray-900 mb-6">"{testimonial.quote}"</blockquote>
                                                                 <div className="border-t border-gray-100 my-4"></div>
                                                                 {/* Author */}
                                                                 <div className="flex items-center gap-4 mt-2">
                                                                      {renderAvatar(testimonialId)}
                                                                      <div className="flex-1">
                                                                           <div className="flex items-center gap-2">
                                                                                <div className="font-bold text-gray-900">{testimonial.name}</div>
                                                                                <div className="text-sm text-gray-500">•</div>
                                                                                <div className="text-sm text-gray-500">{testimonial.role}</div>
                                                                           </div>
                                                                           {testimonial.company && (
                                                                                <div className="text-sm text-[var(--color-secondary)] font-semibold mt-1">{testimonial.company}</div>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       );
                                                  })}
                                        </div>

                                        {/* Right Navigation Arrow - Only show if more than 3 testimonials */}
                                        {odooData.testimonials.length > 3 && (
                                             <button
                                                  onClick={nextTestimonial}
                                                  className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                                                  aria-label="Témoignages suivants"
                                             >
                                                  <ChevronRight className="w-6 h-6 text-gray-600 transition-transform duration-300 group-hover:translate-x-1" />
                                             </button>
                                        )}
                                   </div>

                                   {/* Dots indicator - Only show if more than 3 testimonials */}
                                   {odooData.testimonials.length > 3 && (
                                        <div className="flex justify-center mt-8 space-x-3">
                                             {Array.from({ length: Math.ceil(odooData.testimonials.length / 3) }).map((_, index) => (
                                                  <button
                                                       key={index}
                                                       onClick={() => setCurrentTestimonialIndex(index * 3)}
                                                       className={`w-4 h-4 rounded-full transition-all duration-500 ease-in-out transform hover:scale-125 ${Math.floor(currentTestimonialIndex / 3) === index
                                                            ? 'bg-[var(--color-secondary)] scale-125 shadow-lg'
                                                            : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                                                            }`}
                                                       aria-label={`Aller à la page ${index + 1}`}
                                                  />
                                             ))}
                                        </div>
                                   )}
                              </div>
                         </section>
                    )}

                    {/* Contact card */}
                    <ContactSection contactData={odooData?.contact} />

                    {/* FAQ Section */}
                    <FAQSection faqData={odooData?.faq} />

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