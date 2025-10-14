/**
 * VideoTestimonialsSection.tsx
 * 
 * Main video testimonials section using cas-client data and card design.
 * Features:
 * - Fetches from /api/cas-client?published=true endpoint (same as cas-client page)
 * - Uses TestimonialCard component for consistent design
 * - Mobile: Cards stacked vertically
 * - Desktop: Carousel with navigation arrows
 * - IP-based region filtering
 * 
 * @author younes safouat
 * @version 2.0.0 - Cas Client Integration
 * @since 2025
 */

"use client"

import React, { useState, useEffect } from 'react';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Loader from './home/Loader';
import TestimonialCard from './ui/TestimonialCard';

interface CasClientData {
     _id: string;
     slug: string;
     name: string;
     summary: string;
     company: {
          name: string;
          logo?: string;
          sector?: string;
          customSector?: string;
     };
     media: {
          cardBackgroundImage?: string;
          coverImage?: string;
     };
     targetRegions?: string[];
     published?: boolean;
}

interface VideoTestimonialsSectionProps {
     selectedClients?: string[]; // Array of client IDs to display
}

const VideoTestimonialsSection = ({ selectedClients }: VideoTestimonialsSectionProps) => {
     const [clientsData, setClientsData] = useState<CasClientData[]>([]);
     const [loading, setLoading] = useState(true);
     const { data: locationData, loading: locationLoading, region: userRegion } = useGeolocationSingleton();

     // Fetch client cases from API (same endpoint as cas-client page)
     useEffect(() => {
          const fetchClients = async () => {
               setLoading(true);
               try {
                    const res = await fetch("/api/cas-client?published=true");
                    const data = await res.json();
                    const cases = data.cases || [];
                    setClientsData(cases);
               } catch (err) {
                    console.error('Error fetching clients:', err);
                    setClientsData([]);
               } finally {
                    setLoading(false);
               }
          };
          fetchClients();
     }, []);

     // Filter clients by selected IDs (from CMS)
     const filterClientsBySelection = (clients: CasClientData[]): CasClientData[] => {
          console.log('🎯 VideoTestimonials - selectedClients prop:', selectedClients);
          console.log('🎯 VideoTestimonials - available clients:', clients.length);
          
          if (!selectedClients || selectedClients.length === 0) {
               console.log('⚠️ VideoTestimonials - No selectedClients, showing all clients');
               return clients; // Show all if none selected
          }
          
          const filtered = clients.filter(client => selectedClients.includes(client._id));
          console.log('✅ VideoTestimonials - Filtered to', filtered.length, 'clients');
          return filtered;
     };

     // Filter clients by region (IP-based filtering)
     const filterClientsByRegion = (clients: CasClientData[], region: string): CasClientData[] => {
          return clients.filter(client => {
               if (!client.targetRegions || client.targetRegions.length === 0) {
                    return true; // Show if no region specified
               }
               const normalizedRegion = region?.toLowerCase() || '';
               const normalizedTargetRegions = client.targetRegions.map(r => r.toLowerCase());
               return normalizedTargetRegions.includes('all') || normalizedTargetRegions.includes(normalizedRegion);
          });
     };

     // Apply both filters
     const selectedClientsData = filterClientsBySelection(clientsData);
     const filteredClients = filterClientsByRegion(selectedClientsData, userRegion);

     if (loading || locationLoading) {
          return (
               <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                    <Loader />
               </section>
          );
     }

     if (filteredClients.length === 0) {
          return null; // Don't show section if no clients to display
     }

     return (
          <section className="py-20 bg-gradient-to-b from-white to-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-4">
                              NOS DERNIERS PROJETS
                         </div>
                         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                              Témoignages clients
                         </h2>
                         <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                              Découvrez comment nos clients ont transformé leur entreprise avec Odoo
                         </p>
                    </div>

                    {/* Mobile: Stacked Cards */}
                    <div className="md:hidden space-y-6">
                         {filteredClients.map((client) => (
                              <TestimonialCard
                                   key={client._id}
                                   title={client.name}
                                   description={client.summary}
                                   videoThumbnail={client.media?.cardBackgroundImage || client.media?.coverImage || ''}
                                   logo={client.company?.logo}
                                   sector={client.company?.sector === 'Autre' ? client.company?.customSector : client.company?.sector}
                                   variant="primary"
                                   slug={client.slug}
                                   hasVideo={false}
                              />
                         ))}
                    </div>

                    {/* Desktop: Carousel with Navigation Arrows */}
                    <div className="hidden md:block relative w-full px-8 sm:px-12">
                         <Swiper
                              modules={[Pagination]}
                              spaceBetween={24}
                              slidesPerView={1}
                              breakpoints={{
                                   768: {
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                   },
                                   1024: {
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                   },
                                   1280: {
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                   },
                              }}
                              className="!pb-12"
                         >
                              {filteredClients.map((client) => (
                                   <SwiperSlide key={client._id}>
                                        <TestimonialCard
                                             title={client.name}
                                             description={client.summary}
                                             videoThumbnail={client.media?.cardBackgroundImage || client.media?.coverImage || ''}
                                             logo={client.company?.logo}
                                             sector={client.company?.sector === 'Autre' ? client.company?.customSector : client.company?.sector}
                                             variant="primary"
                                             slug={client.slug}
                                             hasVideo={false}
                                        />
                                   </SwiperSlide>
                         ))}
                         </Swiper>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-12">
                         <a 
                              href="/cas-client"
                              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[var(--color-main)] hover:bg-[var(--color-secondary)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                         >
                              Voir tous nos projets
                              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                         </a>
                    </div>
               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 
