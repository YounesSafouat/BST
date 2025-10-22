/**
 * VideoTestimonialsSection.tsx
 * 
 * Main video testimonials section using cas-client data with new card design.
 * Features:
 * - Fetches from /api/cas-client?published=true endpoint (same as cas-client page)
 * - New card design with gradient backgrounds and metrics overlays
 * - Hover effects to switch between two images
 * - Mobile: Cards stacked vertically
 * - Desktop: Carousel with navigation arrows
 * - IP-based region filtering
 * 
 * @author younes safouat
 * @version 3.0.0 - New Card Design with Hover Effects
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
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';


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
          hoverImage?: string; // Second image for hover effect
     };
     metrics?: Array<{
          icon: string;
          text: string;
     }>;
     targetRegions?: string[];
     published?: boolean;
}

interface VideoTestimonialsSectionProps {
     selectedClients?: string[] | Array<{
          id: string;
          order: number;
     }>; // Array of client IDs (old format) or with ordering (new format) to display
     sectionData?: {
          headline?: string;
          subtitle?: string;
          showStars?: boolean;
          starCount?: number;
          ctaButton?: {
               text: string;
               url: string;
          };
     };
}

// New Project Card Component
const ProjectCard = ({ client }: { client: CasClientData }) => {
     const [isExpanded, setIsExpanded] = useState(false);
     
     const getSectorColor = (sector: string) => {
          return 'bg-gray-600'; // All badges use the same gray color
     };

     const sector = client.company?.sector === 'Autre' ? client.company?.customSector : client.company?.sector;
     
     return (
          <div 
               className="block group cursor-pointer"
               onClick={() => setIsExpanded(!isExpanded)}
          >
               <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-80">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                         <Image
                              src={isExpanded && client.media?.hoverImage ? client.media.hoverImage : (client.media?.cardBackgroundImage || client.media?.coverImage || '')}
                              alt={client.name}
                              fill
                              className="object-cover transition-all duration-500"
                         />
                    </div>
                    
                    {/* Dark Section - Fixed at bottom, expands upward on click */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-[var(--color-main)] transition-all duration-700 ease-in-out ${
                         isExpanded ? 'h-4/5 p-6' : 'h-16 p-4'
                    } overflow-hidden`}>
                         <div className="flex flex-col justify-between h-full">
                              {/* Company Logo - Always visible with smooth transition */}
                              <div className={`text-center transition-all duration-700 ease-in-out ${
                                   isExpanded ? 'mb-3' : 'mb-0'
                              }`}>
                                   {client.company?.logo ? (
                                        <div className="flex justify-center">
                                             <Image
                                                  src={client.company.logo}
                                                  alt={client.company.name}
                                                  width={120}
                                                  height={40}
                                                  className="object-contain filter brightness-0 invert transition-all duration-700 ease-in-out"
                                             />
                                        </div>
                                   ) : (
                                        <h3 className="text-white text-xl font-bold mb-1">{client.name}</h3>
                                   )}
                              </div>
                              
                              {/* Description - Only visible on click with smooth animation */}
                              <div className={`transition-all duration-700 ease-in-out ${
                                   isExpanded ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                              } overflow-hidden`}>
                                   <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {client.summary}
                                   </p>
                              </div>
                              
                              {/* Bottom Row - Only visible on click with smooth animation */}
                              <div className={`transition-all duration-700 ease-in-out ${
                                   isExpanded ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0'
                              } overflow-hidden`}>
                                   <div className="flex items-center justify-between">
                                        {/* Sector Tag */}
                                        <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getSectorColor(sector || 'default')}`}>
                                             {sector || 'Client'}
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

const VideoTestimonialsSection = ({ selectedClients, sectionData }: VideoTestimonialsSectionProps) => {
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

     // Filter clients by selected IDs (from CMS) and apply ordering
     const filterClientsBySelection = (clients: CasClientData[]): CasClientData[] => {
          console.log('🎯 VideoTestimonials - selectedClients prop:', selectedClients);
          console.log('🎯 VideoTestimonials - available clients:', clients.length);
          
          if (!selectedClients || selectedClients.length === 0) {
               console.log('⚠️ VideoTestimonials - No selectedClients, showing all clients');
               return clients; // Show all if none selected
          }
          
          // Handle both old format (string[]) and new format (Array<{id: string, order: number}>)
          let selectedClientIds: string[] = [];
          if (typeof selectedClients[0] === 'string') {
               // Old format
               selectedClientIds = selectedClients as string[];
               console.log('📝 Using old format (string[])');
          } else {
               // New format
               selectedClientIds = selectedClients.map(sc => sc.id);
               console.log('📝 Using new format (Array<{id, order}>)');
          }
          
          // Filter clients by selected IDs and sort by order
          const filtered = clients
               .filter(client => selectedClientIds.includes(client._id))
               .sort((a, b) => {
                    if (typeof selectedClients[0] === 'string') {
                         // Old format: maintain original order
                         return selectedClientIds.indexOf(a._id) - selectedClientIds.indexOf(b._id);
                    } else {
                         // New format: use order property
                         const newFormatClients = selectedClients as Array<{id: string; order: number}>;
                         const orderA = newFormatClients.find(sc => sc.id === a._id)?.order || 0;
                         const orderB = newFormatClients.find(sc => sc.id === b._id)?.order || 0;
                         return orderA - orderB;
                    }
               });
          
          console.log('✅ VideoTestimonials - Filtered and ordered to', filtered.length, 'clients');
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

     // Debug logging
     console.log('🎬 VideoTestimonialsSection Debug:');
     console.log('- selectedClients prop:', selectedClients);
     console.log('- clientsData loaded:', clientsData.length);
     console.log('- selectedClientsData after selection filter:', selectedClientsData.length);
     console.log('- filteredClients after region filter:', filteredClients.length);
     console.log('- userRegion:', userRegion);
     console.log('- loading:', loading, 'locationLoading:', locationLoading);

     if (loading || locationLoading) {
          return (
               <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                    <Loader />
               </section>
          );
     }

     if (filteredClients.length === 0) {
          console.log('⚠️ VideoTestimonialsSection: No clients to display, returning null');
          return null; // Don't show section if no clients to display
     }

     return (
          <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                         <h2 
                              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-main)] mb-4"
                              dangerouslySetInnerHTML={{ __html: sectionData?.headline || 'Nos derniers projets' }}
                         />
                         <div className="flex items-center justify-center gap-2 mb-4">
                              <span 
                                   className="text-[var(--color-secondary)] text-lg font-semibold"
                                   dangerouslySetInnerHTML={{ __html: sectionData?.subtitle || '+80 entreprises accompagnées' }}
                              />
                         </div>
                         {sectionData?.showStars !== false && (
                              <div className="flex items-center justify-center gap-1">
                                   {[...Array(sectionData?.starCount || 5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
                                   ))}
                              </div>
                         )}
                    </div>

                    {/* Mobile: Stacked Cards */}
                    <div className="md:hidden space-y-6">
                         {filteredClients.map((client) => (
                              <ProjectCard key={client._id} client={client} />
                         ))}
                    </div>

                    {/* Desktop: 2x2 Grid Layout */}
                    <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                         {filteredClients.slice(0, 4).map((client) => (
                              <ProjectCard key={client._id} client={client} />
                         ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-12">
                    <Button
                    asChild
                    className="bg-white text-[var(--color-main)] hover:bg-white hover:text-[var(--color-main)] font-semibold px-6 py-3 text-base rounded-full
                     shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Link href={sectionData?.ctaButton?.url || "/cas-client"} className="flex items-center gap-2">
                      <span dangerouslySetInnerHTML={{ __html: sectionData?.ctaButton?.text || "Tous nos projets" }} />
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                    </div>
               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 
