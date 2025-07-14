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
     Mail
} from 'lucide-react';
import OdooHeroSplit from './OdooHeroSplit';
import Image from 'next/image';
import Loader from '@/components/home/Loader';
import Link from 'next/link';

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
          plans: Array<{
               name: string;
               description: string;
               monthlyPrice: number;
               yearlyPrice: number;
               popular: boolean;
               consultantHours: string;
               features: string[];
               cta: string;
          }>;
     };
     partnership: {
          headline: string;
          description: string;
          modules: string[];
          expertiseText: string;
     };
     testimonials: string[];
     testimonialsSection: {
          headline: string;
          description: string;
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

interface OdooPageNewProps {
     isPreview?: boolean;
}

function OdooPageNew({ isPreview = false }: OdooPageNewProps) {
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

     useEffect(() => {
          const timer = setTimeout(() => setStatsVisible(true), 800);
          const loadTimer = setTimeout(() => setIsLoaded(true), 100);

          // Fetch Odoo data
          fetchOdooData();
          fetchTestimonials();
          fetchClientCases();

          return () => {
               clearTimeout(timer);
               clearTimeout(loadTimer);
          };
     }, []);

     const fetchOdooData = async () => {
          try {
               const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
               const response = await fetch(`${baseUrl}/api/content?type=odoo-page`);
               if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0 && data[0].content) {
                         setOdooData(data[0].content);
                    }
               }
          } catch (error) {
               console.error('Error fetching Odoo data:', error);
          }
     };

     const fetchTestimonials = async () => {
          try {
               const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
               const response = await fetch(`${baseUrl}/api/content?type=testimonial`);
               if (response.ok) {
                    const data = await response.json();
                    setAvailableTestimonials(data.map((item: any) => ({ ...item.content, _id: item._id })));
               }
          } catch (error) {
               console.error('Error fetching testimonials:', error);
          }
     };

     const fetchClientCases = async () => {
          try {
               const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
               const response = await fetch(`${baseUrl}/api/content?type=clients-page`);
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
          return <Loader />;
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

          // Check if avatar is a URL (starts with http or /)
          if (testimonial.avatar && (testimonial.avatar.startsWith('http') || testimonial.avatar.startsWith('/'))) {
               return (
                    <Image
                         src={testimonial.avatar}
                         alt={testimonial.name}
                         width={40}
                         height={40}
                         className="w-10 h-10 rounded-full object-cover"
                    />
               );
          } else {
               // Use initials
               return (
                    <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                         <span className="text-white font-bold text-sm">{testimonial.avatar || testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
               );
          }
     };

     // Split apps into 3 columns for timelines
     const timeline1 = odooData?.platformSection?.apps?.slice(0, 6) || [];
     const timeline2 = odooData?.platformSection?.apps?.slice(6, 12) || [];
     const timeline3 = odooData?.platformSection?.apps?.slice(12, 18) || [];

     return (
          <div className="min-h-screen bg-white overflow-hidden">
               {/* Hero Section */}
               <OdooHeroSplit heroData={odooData.hero} isPreview={isPreview} />

               {/* Trust Metrics */}
               <section className="py-20 bg-[#f7f2f6]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                              {odooData.trustMetrics.map((metric, index) => (
                                   <div key={index} className="bg-white rounded-xl px-12 py-8 text-center flex flex-col items-center min-w-[220px]">
                                        <div className="text-4xl font-black text-[var(--color-secondary)] mb-1">
                                             <AnimatedCounter target={metric.number} suffix={metric.suffix} />
                                        </div>
                                        <div className="text-base font-semibold text-gray-900 mb-1">{metric.label}</div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* Vertical Timeline Carousels */}
               <section className="py-20 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-16">
                              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                                   {odooData.platformSection.headline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{odooData.platformSection.headline.split(' ').slice(1).join(' ')}</span>
                              </h2>
                              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                                   {odooData.platformSection.subheadline}
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
                                                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                             >
                                                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                       <img
                                                            src={app.icon}
                                                            alt={app.title}
                                                            className="w-12 h-12 object-contain"
                                                            onError={(e) => {
                                                                 // Fallback to a default icon if image fails to load
                                                                 e.currentTarget.style.display = 'none';
                                                                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                       />
                                                       <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center hidden">
                                                            <span className="text-[var(--color-secondary)] font-bold text-lg">{app.title.charAt(0)}</span>
                                                       </div>
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
                                                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                             >
                                                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                       <img
                                                            src={app.icon}
                                                            alt={app.title}
                                                            className="w-12 h-12 object-contain"
                                                            onError={(e) => {
                                                                 // Fallback to a default icon if image fails to load
                                                                 e.currentTarget.style.display = 'none';
                                                                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                       />
                                                       <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center hidden">
                                                            <span className="text-[var(--color-secondary)] font-bold text-lg">{app.title.charAt(0)}</span>
                                                       </div>
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
                                                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                             >
                                                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                       <img
                                                            src={app.icon}
                                                            alt={app.title}
                                                            className="w-12 h-12 object-contain"
                                                            onError={(e) => {
                                                                 // Fallback to a default icon if image fails to load
                                                                 e.currentTarget.style.display = 'none';
                                                                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                       />
                                                       <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center hidden">
                                                            <span className="text-[var(--color-secondary)] font-bold text-lg">{app.title.charAt(0)}</span>
                                                       </div>
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
               {/* Cas Clients Carousel Section */}
               {clientCases.length > 0 && (
                    <section className="py-20 bg-white">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <div className="uppercase tracking-widest text-sm text-gray-500 font-semibold mb-2">CAS CLIENTS</div>
                                   <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                        Ils nous font confiance
                                   </h2>
                                   <p className="text-lg text-gray-600">
                                        Des entreprises de toutes tailles qui ont transformé leur activité avec Odoo
                                   </p>
                              </div>
                              {/* Carousel Cards */}
                              {clientCases.slice(clientCarouselPage * clientsPerPage, clientCarouselPage * clientsPerPage + clientsPerPage).length === 1 ? (
                                   <div className="flex justify-center mb-8">
                                        {clientCases.slice(clientCarouselPage * clientsPerPage, clientCarouselPage * clientsPerPage + clientsPerPage).map((client, idx) => (
                                             <Link key={client.slug} href={`/cas-client/${client.slug}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center hover:ring-2 hover:ring-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] cursor-pointer">
                                                  {/* Logo or Initial */}
                                                  {client.logo ? (
                                                       <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                                                            <Image src={client.logo} alt={client.name} width={60} height={60} className="object-contain w-12 h-12" />
                                                       </div>
                                                  ) : (
                                                       <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                                                            <span className="text-3xl font-bold text-gray-500">{client.name.charAt(0)}</span>
                                                       </div>
                                                  )}
                                                  <div className="mb-2 text-xl font-bold text-gray-900">{client.name}</div>
                                                  <div className="text-sm text-gray-500 mb-4">{client.sector}</div>
                                                  <div className="w-full border-t border-gray-200 my-4"></div>
                                                  <div className="text-xs font-semibold text-gray-500 mb-2">Modules déployés</div>
                                                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                                                       {client.solutions && client.solutions.slice(0, 3).map((sol: any, i: number) => (
                                                            <div key={i} className="inline-flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-[var(--color-secondary)] text-sm font-medium">
                                                                 {/* You can add an icon here if you have one per module */}
                                                                 {sol.module}
                                                            </div>
                                                       ))}
                                                  </div>
                                             </Link>
                                        ))}
                                   </div>
                              ) : (
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        {clientCases.slice(clientCarouselPage * clientsPerPage, clientCarouselPage * clientsPerPage + clientsPerPage).map((client, idx) => (
                                             <Link key={client.slug} href={`/cas-client/${client.slug}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center hover:ring-2 hover:ring-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] cursor-pointer">
                                                  {/* Logo or Initial */}
                                                  {client.logo ? (
                                                       <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                                                            <Image src={client.logo} alt={client.name} width={60} height={60} className="object-contain w-12 h-12" />
                                                       </div>
                                                  ) : (
                                                       <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                                                            <span className="text-3xl font-bold text-gray-500">{client.name.charAt(0)}</span>
                                                       </div>
                                                  )}
                                                  <div className="mb-2 text-xl font-bold text-gray-900">{client.name}</div>
                                                  <div className="text-sm text-gray-500 mb-4">{client.sector}</div>
                                                  <div className="w-full border-t border-gray-200 my-4"></div>
                                                  <div className="text-xs font-semibold text-gray-500 mb-2">Modules déployés</div>
                                                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                                                       {client.solutions && client.solutions.slice(0, 3).map((sol: any, i: number) => (
                                                            <div key={i} className="inline-flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-[var(--color-secondary)] text-sm font-medium">
                                                                 {/* You can add an icon here if you have one per module */}
                                                                 {sol.module}
                                                            </div>
                                                       ))}
                                                  </div>
                                             </Link>
                                        ))}
                                   </div>
                              )}
                              {/* Carousel Navigation */}
                              <div className="flex items-center justify-center gap-4 mb-4">
                                   <button
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[var(--color-secondary)] hover:bg-gray-100 transition"
                                        onClick={() => setClientCarouselPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={clientCarouselPage === 0}
                                        aria-label="Précédent"
                                   >
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                   </button>
                                   {/* Dots */}
                                   {Array.from({ length: Math.ceil(clientCases.length / clientsPerPage) }).map((_, i) => (
                                        <button
                                             key={i}
                                             className={`w-3 h-3 rounded-full mx-1 ${i === clientCarouselPage ? 'bg-[var(--color-secondary)]' : 'bg-gray-300'}`}
                                             onClick={() => setClientCarouselPage(i)}
                                             aria-label={`Aller à la page ${i + 1}`}
                                        />
                                   ))}
                                   <button
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[var(--color-secondary)] hover:bg-gray-100 transition"
                                        onClick={() => setClientCarouselPage((prev) => Math.min(prev + 1, Math.ceil(clientCases.length / clientsPerPage) - 1))}
                                        disabled={clientCarouselPage === Math.ceil(clientCases.length / clientsPerPage) - 1}
                                        aria-label="Suivant"
                                   >
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                   </button>
                              </div>
                              {/* Voir tous nos cas clients */}
                              <div className="flex justify-center mt-4">
                                   <a href="/cas-client" className="text-[var(--color-secondary)] font-semibold flex items-center gap-2 hover:underline">
                                        Voir tous nos cas clients <ArrowRight className="w-4 h-4" />
                                   </a>
                              </div>
                         </div>
                    </section>
               )}
               {/* Notre Méthodologie Section */}
               <section className="py-20 bg-[#fafbfc]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">NOTRE MÉTHODOLOGIE</div>
                              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                   Un processus éprouvé pour garantir votre succès
                              </h2>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                              {/* Step 1 */}
                              <div className="relative bg-white rounded-2xl shadow-md p-8 flex flex-col items-start min-h-[260px] transition-all hover:shadow-xl">
                                   <div className="w-14 h-14 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center mb-6">
                                        <MessageCircle className="w-8 h-8 text-white" />                                   </div>
                                   <div className="absolute top-6 right-8 text-5xl font-black text-gray-100 select-none pointer-events-none">01</div>
                                   <div className="text-xl font-bold text-gray-900 mb-2">Consultation</div>
                                   <div className="text-gray-600 text-sm">Analyse de vos besoins et définition d'une stratégie sur mesure.</div>
                              </div>
                              {/* Step 2 */}
                              <div className="relative bg-white rounded-2xl shadow-md p-8 flex flex-col items-start min-h-[260px] transition-all hover:shadow-xl">
                                   <div className="w-14 h-14 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center mb-6">
                                        <Settings className="w-8 h-8 text-white" />                                   </div>
                                   <div className="absolute top-6 right-8 text-5xl font-black text-gray-100 select-none pointer-events-none">02</div>
                                   <div className="text-xl font-bold text-gray-900 mb-2">Paramétrage</div>
                                   <div className="text-gray-600 text-sm">Configuration et personnalisation de votre plateforme Odoo.</div>
                              </div>
                              {/* Step 3 */}
                              <div className="relative bg-white rounded-2xl shadow-md p-8 flex flex-col items-start min-h-[260px] transition-all hover:shadow-xl">
                                   <div className="w-14 h-14 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center mb-6">
                                        <Rocket className="w-8 h-8 text-white" />                                   </div>
                                   <div className="absolute top-6 right-8 text-5xl font-black text-gray-100 select-none pointer-events-none">03</div>
                                   <div className="text-xl font-bold text-gray-900 mb-2">Déploiement</div>
                                   <div className="text-gray-600 text-sm">Formation de vos équipes et accompagnement au lancement.</div>
                              </div>
                              {/* Step 4 */}
                              <div className="relative bg-white rounded-2xl shadow-md p-8 flex flex-col items-start min-h-[260px] transition-all hover:shadow-xl">
                                   <div className="w-14 h-14 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center mb-6">
                                        <CircleCheckBig className="w-8 h-8 text-white" />                                   </div>
                                   <div className="absolute top-6 right-8 text-5xl font-black text-gray-100 select-none pointer-events-none">04</div>
                                   <div className="text-xl font-bold text-gray-900 mb-2">Support & Optimisation</div>
                                   <div className="text-gray-600 text-sm">Suivi continu et améliorations pour soutenir votre croissance.</div>
                              </div>
                         </div>
                    </div>
               </section>

               {/* Tarifs & Accompagnement Section */}
               <section className="py-20 bg-[#f7f5f7]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
                                   TARIFS & ACCOMPAGNEMENT
                              </div>
                              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                   Un partenariat, pas seulement une prestation
                              </h2>
                              <p className="text-lg text-gray-600">
                                   Nos packs d'accompagnement sont conçus pour s'adapter à votre taille et vos ambitions.
                              </p>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {/* Pack Démarrage */}
                              <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-start relative">
                                   <div className="text-xl font-bold text-[var(--color-secondary)] mb-2">Pack Démarrage</div>
                                   <div className="text-gray-600 mb-4">Idéal pour débuter avec Odoo rapidement et efficacement.</div>
                                   <div className="text-2xl font-black text-gray-900 mb-1">À partir de 1 500€</div>
                                   <div className="text-gray-500 text-sm mb-4">~25 heures d'accompagnement</div>
                                   <ul className="mb-8 space-y-2 text-gray-700">
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Audit détaillé de vos besoins</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Configuration de base Odoo</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Formation initiale équipe</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Support au démarrage (30j)</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Documentation personnalisée</li>
                                   </ul>
                                   <button className="w-full rounded-full bg-[var(--color-secondary)] text-white font-semibold py-3 mt-auto flex items-center justify-center gap-2 group">
                                        Obtenir un devis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                   </button>
                              </div>
                              {/* Pack Croissance */}
                              <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-start border-2 border-[var(--color-secondary)] relative">
                                   <div className="text-xl font-bold text-[var(--color-secondary)] mb-2">Pack Croissance</div>
                                   <div className="text-gray-600 mb-4">Solution complète pour les entreprises en développement.</div>
                                   <div className="text-2xl font-black text-gray-900 mb-1">À partir de 5 000€</div>
                                   <div className="text-gray-500 text-sm mb-4">~100 heures d'accompagnement</div>
                                   <ul className="mb-8 space-y-2 text-gray-700">
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Tous les avantages du pack Démarrage</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Développements spécifiques</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Intégration modules avancés</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Formation approfondie des équipes</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Accompagnement mensuel (6 mois)</li>
                                   </ul>
                                   <button className="w-full rounded-full bg-[var(--color-secondary)] text-white font-semibold py-3 mt-auto flex items-center justify-center gap-2 group">
                                        Planifier un échange <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                   </button>
                              </div>
                              {/* Pack Sur Mesure */}
                              <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-start relative">
                                   <div className="text-xl font-bold text-[var(--color-secondary)] mb-2">Pack Sur Mesure</div>
                                   <div className="text-gray-600 mb-4">Accompagnement personnalisé selon vos besoins spécifiques.</div>
                                   <div className="text-2xl font-black text-gray-900 mb-1">Devis personnalisé</div>
                                   <div className="text-gray-500 text-sm mb-4">Volume d'heures adapté</div>
                                   <ul className="mb-8 space-y-2 text-gray-700">
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Analyse approfondie de vos processus</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Solution 100% personnalisée</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Support prioritaire dédié</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Consultant attitré à votre projet</li>
                                        <li className="flex items-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-green-300 border-2 mr-2"><Check className="w-4 h-4 text-green-300" strokeWidth={3} /></span>Suivi stratégique long terme</li>
                                   </ul>
                                   <button className="w-full rounded-full bg-[var(--color-secondary)] text-white font-semibold py-3 mt-auto flex items-center justify-center gap-2 group">
                                        Discutons ensemble <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                   </button>
                              </div>
                         </div>
                    </div>
               </section>
               {/* Notre Agence Section */}
               <section className="py-20 bg-[#f7f5f7]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">NOTRE AGENCE</div>
                              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Plus qu'un intégrateur, un partenaire de confiance.</h2>
                              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Une équipe de consultants certifiés, passionnés par l'accompagnement de nos clients dans leur transformation digitale.</p>
                         </div>
                         <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                              {/* Left: Image with badge */}
                              <div className="relative w-full md:w-1/2 flex justify-center">
                                   <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-lg">
                                        <Image src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg" alt="Notre équipe" width={600} height={350} className="object-cover w-full h-72 md:h-80" />
                                        <div className="absolute bottom-4 left-4 bg-white rounded-full px-4 py-2 flex items-center shadow-md">
                                             <BadgeCheck className="w-5 h-5 text-[var(--color-secondary)] mr-2" />
                                             <span className="text-[var(--color-secondary)] font-semibold text-sm">Partenaire Silver Certifié</span>
                                        </div>
                                   </div>
                              </div>
                              {/* Right: Features */}
                              <div className="w-full md:w-1/2 flex flex-col gap-6">
                                   <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
                                        <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />
                                        <div>
                                             <div className="font-bold text-lg text-gray-900">Partenaire Silver Odoo</div>
                                             <div className="text-gray-500 text-sm">Certification officielle reconnaissant notre expertise</div>
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
                              </div>
                         </div>
                    </div>
               </section>

               {/* Testimonials */}
               {odooData && odooData.testimonials && odooData.testimonials.length > 0 && (
                    <section className="py-20 bg-[#f7f2f6]">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TÉMOIGNAGES</div>
                                   <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Nos clients témoignent</h2>
                                   <div className="text-lg text-gray-600">Découvrez pourquoi nos clients nous recommandent</div>
                              </div>
                              <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
                                   {odooData.testimonials.map((testimonialId: string, index: number) => {
                                        const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                                        if (!testimonial) return null;
                                        return (
                                             <div key={index} className="bg-white rounded-xl px-8 py-8 flex flex-col shadow-none w-full max-w-md mx-auto">
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
                                                       <div>
                                                            <div className="font-bold text-gray-900">{testimonial.name}</div>
                                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                                            {testimonial.company && (
                                                                 <div className="text-sm text-[var(--color-secondary)] font-semibold">{testimonial.company}</div>
                                                            )}
                                                       </div>
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    </section>
               )}
               {/* Parlons de votre projet Section */}
               <section className="py-16 bg-transparent">
                    <div className="max-w-4xl mx-auto">
                         {/* Section Title and Subtitle */}
                         <div className="text-center mb-10">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TRANSFORMONS ENSEMBLE</div>
                              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">Prêt à révolutionner votre entreprise ?</h2>
                              <div className="text-lg text-gray-700">
                                   <span className="text-[var(--color-secondary)] font-semibold">+112 entreprises nous font confiance.</span> Rejoignez-les et découvrez pourquoi Odoo<br className="hidden md:inline" /> change la donne.
                              </div>
                         </div>
                         <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                              {/* Left: Form */}
                              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                                   <h3 className="text-xl font-bold mb-2 text-gray-900">Parlons de votre projet</h3>
                                   <p className="text-gray-600 text-sm mb-6">Échangeons sur vos défis et explorons ensemble comment Odoo peut transformer votre entreprise.</p>
                                   <form className="space-y-4">
                                        <div className="flex gap-3">
                                             <div className="flex-1">
                                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prénom & Nom *</label>
                                                  <input type="text" placeholder="John Dupont" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none" />
                                             </div>
                                             <div className="flex-1">
                                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Entreprise *</label>
                                                  <input type="text" placeholder="Ma Super Entreprise" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none" />
                                             </div>
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                                             <input type="email" placeholder="john@monentreprise.com" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none" />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone</label>
                                             <input type="text" placeholder="01 23 45 67 89" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none" />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-700 mb-1">Votre vision</label>
                                             <textarea placeholder="Décrivez-nous vos ambitions : gains de temps, automatisation, croissance... Nous sommes là pour vous accompagner !" rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none resize-none" />
                                        </div>
                                        <button type="submit" className="w-full mt-2 rounded-full bg-[var(--color-secondary)] text-white font-semibold py-3 flex items-center justify-center gap-2 group">
                                             <Calendar className="w-5 h-5 mr-1" /> Lancer ma transformation
                                        </button>
                                   </form>
                                   <div className="text-xs text-gray-500 text-center mt-4">
                                        Réponse garantie sous 4h en journée • Échange sans engagement
                                   </div>
                              </div>
                              {/* Right: Value Props */}
                              <div className="w-full md:w-1/2 bg-[var(--color-secondary)] text-white p-8 md:p-10 flex flex-col justify-between">
                                   <div>
                                        <h4 className="text-lg font-bold mb-6 text-white">Ce qui vous attend :</h4>
                                        <ul className="space-y-4 mb-6">
                                             <li className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200 bg-transparent hover:bg-white/20 cursor-pointer">
                                                  <BadgeCheck className="w-7 h-7 text-green-300 mt-1" />
                                                  <div>
                                                       <span className="font-semibold text-white">Partenaire Silver Officiel</span><br />
                                                       <span className="text-sm text-white/90">Certification garantissant notre expertise technique reconnue par Odoo</span>
                                                  </div>
                                             </li>
                                             <li className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200 bg-transparent hover:bg-white/20 cursor-pointer">
                                                  <Rocket className="w-7 h-7 text-green-300 mt-1" />
                                                  <div>
                                                       <span className="font-semibold text-white">Transformation Express</span><br />
                                                       <span className="text-sm text-white/90">Digitalisez vos processus en quelques semaines, pas en mois</span>
                                                  </div>
                                             </li>
                                             <li className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200 bg-transparent hover:bg-white/20 cursor-pointer">
                                                  <Shield className="w-7 h-7 text-green-300 mt-1" />
                                                  <div>
                                                       <span className="font-semibold text-white">Accompagnement Sécurisé</span><br />
                                                       <span className="text-sm text-white/90">De l'audit stratégique à la mise en production, nous restons à vos côtés</span>
                                                  </div>
                                             </li>
                                             <li className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200 bg-transparent hover:bg-white/20 cursor-pointer">
                                                  <CircleCheckBig className="w-7 h-7 text-green-300 mt-1" />
                                                  <div>
                                                       <span className="font-semibold text-white">Consultation Stratégique Offerte</span><br />
                                                       <span className="text-sm text-white/90">Recevez une analyse de vos besoins et une feuille de route claire pour votre transformation digitale, sans aucun engagement.</span>
                                                  </div>
                                             </li>
                                        </ul>

                                   </div>
                                   <div className="border-t border-white/20 pt-4 mt-4">
                                        <div className="text-sm font-semibold mb-2 text-white">Contact direct</div>
                                        <div className="flex items-center gap-2 text-white/90 text-sm mb-1"><Phone className="w-4 h-4" /> 01 23 45 67 89</div>
                                        <div className="flex items-center gap-2 text-white/90 text-sm"><Mail className="w-4 h-4" /> contact@blackswan.fr</div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>

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
}

export default OdooPageNew;