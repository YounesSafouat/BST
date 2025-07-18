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
     FileText
} from 'lucide-react';
import OdooHeroSplit from './OdooHeroSplit';
import Image from 'next/image';
import Loader from '@/components/home/Loader';
import Link from 'next/link';
import PricingSection from '../PricingSection';
import ContactSection from '../ContactSection';
import StatsSection from '../StatsSection';
import CompaniesCarousel from '../CompaniesCarousel';
import VideoTestimonialsSection from '../VideoTestimonialsSection';
import FAQSection from '../FAQSection';

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
     // Add GMAO module to the apps list
     const gmaoModule = {
          icon: "/icons/gmao-icon.png", // You'll need to add this icon
          title: "GMAO",
          description: "Gestion de Maintenance Assistée par Ordinateur",
          features: ["Planification préventive", "Gestion des interventions", "Suivi des équipements", "Rapports de maintenance"]
     };

     const allApps = [...(odooData?.platformSection?.apps || []), gmaoModule];
     const timeline1 = allApps.slice(0, 6) || [];
     const timeline2 = allApps.slice(6, 12) || [];
     const timeline3 = allApps.slice(12, 18) || [];

     return (
          <div className="min-h-screen bg-white overflow-hidden">
               {/* Hero Section - Proper flex layout */}
               <div className="h-[95vh] flex flex-col justify-center pt-20">
                    <OdooHeroSplit heroData={odooData.hero} isPreview={isPreview} />
               </div>

               {/* Vertical Timeline Carousels */}
               <section className="py-12 bg-white overflow-hidden" id="modules">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">PLATEFORME TOUT-EN-UN</div>
                              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                   {odooData.platformSection.headline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{odooData.platformSection.headline.split(' ').slice(1).join(' ')}</span>
                              </h2>
                              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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

               {/* Video Testimonials Section */}
               <VideoTestimonialsSection />

               {/* Tarifs & Accompagnement Section */}
               <PricingSection />
               {/* Notre Agence Section */}
               <section className="py-20 bg-white" id="team">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">NOTRE AGENCE</div>
                              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Plus qu'un intégrateur, un partenaire de confiance.</h2>
                              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Une équipe de consultants certifiés, passionnés par l'accompagnement de nos clients dans leur transformation digitale.</p>
                         </div>
                         <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                              {/* Left: Image with badge */}
                              <div className="relative w-full md:w-1/2 flex justify-center">
                                   <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-lg">
                                        <Image src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg" alt="Notre équipe" width={600} height={350} className="object-cover w-full h-72 md:h-80" />

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
                    <section className="py-20 bg-white" id="testimonials">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TÉMOIGNAGES</div>
                                   <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Nos clients témoignent</h2>
                                   <p className="text-lg text-gray-600">Découvrez pourquoi nos clients nous recommandent</p>
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
                         </div>
                    </section>
               )}
               {/* Contact card */}
               <ContactSection />

               {/* FAQ Section */}
               <FAQSection />

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