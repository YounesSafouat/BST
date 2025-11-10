'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import { ExternalLink } from 'lucide-react';


interface Testimonial {
    _id: string;
    author: string;
    role: string;
    text: string;
    photo: string;
    targetRegions: string[];
    clientCasePath?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TestimonialsSectionProps {
     testimonialsSectionData: {
          headline: string;
          description: string;
          subdescription?: string;
     };
     testimonials?: string[] | Testimonial[];
}

export default function TestimonialsSection({ testimonialsSectionData, testimonials }: TestimonialsSectionProps) {
     const [mounted, setMounted] = useState(false);
     const [displayTestimonials, setDisplayTestimonials] = useState<Testimonial[]>([]);
     const lastFetchedRegion = useRef<string | null>(null);
     const scrollRef = useRef<HTMLDivElement>(null);
     
     // Use the new geolocation singleton service
     const { data: locationData, loading: geolocationLoading, region: userRegion } = useGeolocationSingleton();

     useEffect(() => {
          setMounted(true);
     }, []);

     // Mobile detection
     const [isMobile, setIsMobile] = useState(false);
     
     useEffect(() => {
          const checkMobile = () => {
               setIsMobile(window.innerWidth < 768);
          };
          checkMobile();
          window.addEventListener('resize', checkMobile);
          return () => window.removeEventListener('resize', checkMobile);
     }, []);

     // Get first 4 testimonials for mobile display (controlled via CMS)
     const mobileTestimonials = displayTestimonials.slice(0, 4);

     // Handle dynamic animation based on number of testimonials and size changes (desktop only)
     useEffect(() => {
          if (mounted && displayTestimonials.length > 0 && scrollRef.current && !isMobile) {
               const updateAnimation = () => {
                    const container = scrollRef.current;
                    if (container) {
                         const totalWidth = container.scrollWidth;
                         const oneSetWidth = totalWidth / 3; // We have 3 sets
                         
                         // Remove existing style if it exists
                         const existingStyle = document.getElementById('testimonials-scroll-animation');
                         if (existingStyle) {
                              document.head.removeChild(existingStyle);
                         }
                         
                         // Create new dynamic CSS animation
                         const style = document.createElement('style');
                         style.id = 'testimonials-scroll-animation';
                         style.textContent = `
                              @keyframes testimonials-scroll {
                                   0% { transform: translateX(0); }
                                   100% { transform: translateX(-${oneSetWidth}px); }
                              }
                              .testimonials-scroll {
                                   animation: testimonials-scroll 20s linear infinite;
                              }
                              .testimonials-scroll:hover {
                                   animation-play-state: paused;
                              }
                         `;
                         document.head.appendChild(style);
                         
                         // Add the class to the container
                         container.classList.add('testimonials-scroll');
                    }
               };

               // Initial setup with timeout
               const timer = setTimeout(updateAnimation, 100);
               
               // Set up ResizeObserver to detect significant size changes only
               let lastWidth = 0;
               const resizeObserver = new ResizeObserver((entries) => {
                    for (let entry of entries) {
                         const newWidth = entry.contentRect.width;
                         // Only update if width changed significantly (more than 10px difference)
                         if (Math.abs(newWidth - lastWidth) > 10) {
                              lastWidth = newWidth;
                              updateAnimation();
                         }
                    }
               });
               
               resizeObserver.observe(scrollRef.current);
               
               return () => {
                    clearTimeout(timer);
                    resizeObserver.disconnect();
                    const style = document.getElementById('testimonials-scroll-animation');
                    if (style) {
                         document.head.removeChild(style);
                    }
                    if (scrollRef.current) {
                         scrollRef.current.classList.remove('testimonials-scroll');
                    }
               };
          }
     }, [mounted, displayTestimonials, isMobile]);

     // Use passed testimonials or fetch from API
     useEffect(() => {
          if (mounted && !geolocationLoading && userRegion) {
               // If testimonials are passed as props, use them directly
               if (testimonials && Array.isArray(testimonials) && testimonials.length > 0) {
                    // Check if testimonials are already objects or IDs
                    if (typeof testimonials[0] === 'object' && testimonials[0] !== null && '_id' in testimonials[0]) {
                         // Already testimonial objects
                         console.log('📝 TestimonialsSection - Using testimonial objects from props:', testimonials.length);
                         const validTestimonials = testimonials
                              .filter((t): t is Testimonial => {
                                   if (!t || typeof t !== 'object') return false;
                                   const testimonial = t as Testimonial;
                                   return typeof testimonial._id === 'string' && testimonial._id.length > 0;
                              })
                              .map(t => ({
                                   _id: t._id,
                                   author: t.author || '',
                                   role: t.role || '',
                                   text: t.text || '',
                                   photo: t.photo || '',
                                   clientCasePath: t.clientCasePath || '',
                                   targetRegions: t.targetRegions || ['all']
                              }));
                         setDisplayTestimonials(validTestimonials);
                    } else {
                         // Testimonial IDs - fetch from API
                         console.log('📝 TestimonialsSection - Fetching testimonials by IDs:', testimonials);
                         lastFetchedRegion.current = userRegion;
                         fetchTestimonials(userRegion);
                    }
               } else {
                    // No testimonials passed, fetch from API
                    console.log('📝 TestimonialsSection - No testimonials prop, fetching all');
                    lastFetchedRegion.current = userRegion;
                    fetchTestimonials(userRegion);
               }
          }
     }, [mounted, geolocationLoading, userRegion, testimonials]);

     const fetchTestimonials = async (region?: string) => {
          try {
               const targetRegion = region || userRegion || 'international';
             
               
               const response = await fetch(`/api/testimonials?region=${targetRegion}`);
               if (response.ok) {
                    const data = await response.json();
                    
                    // Ensure data is an array
                    let rawData = Array.isArray(data) ? data : [];
                    
                    // Client-side filtering as backup
                    let filteredData = rawData;
                    if (targetRegion && targetRegion !== 'all') {
                         filteredData = rawData.filter(t => 
                              t && t.targetRegions && (
                                   t.targetRegions.includes(targetRegion) || t.targetRegions.includes('all')
                              )
                         );
                    }
                    
                    // Ensure we have the correct data structure and filter out invalid items
                    const validTestimonials = filteredData
                         .filter(t => {
                              // Must be an object with required fields
                              return t && 
                                     typeof t === 'object' && 
                                     (t._id || t.id) && 
                                     (t.author || t.name) && 
                                     (t.text || t.quote);
                         })
                         .map(t => ({
                              _id: t._id || t.id,
                              author: t.author || t.name || '',
                              role: t.role || '',
                              text: t.text || t.quote || '',
                              photo: t.photo || t.avatar || '',
                              company: t.company || '',
                              result: t.result || '',
                              clientCasePath: t.clientCasePath || '',
                              targetRegions: t.targetRegions || ['all']
                         }));
                    
                    console.log('📝 TestimonialsSection - Raw API data:', data);
                    console.log('📝 TestimonialsSection - Processed testimonials:', validTestimonials);
                    setDisplayTestimonials(validTestimonials);
               } else {
                    console.error('💬 TestimonialsSection - API response not ok:', response.status);
               }
          } catch (error) {
               console.error('Error fetching testimonials:', error);
          }
     };

     if (!mounted || geolocationLoading) {
          return (
               <div className="py-20 bg-[#f9fafb]">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                         <div className="animate-pulse h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                    </div>
               </div>
          );
     }

     return (
          <main id="testimonials" className="min-h-screen bg-[var(--color-main)] flex items-center justify-center flex-col gap-15 py-8 px-8 relative">
               

               <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
               >
                    <h2 
                         className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                         dangerouslySetInnerHTML={{ __html: testimonialsSectionData.description }}
                    />
                    <div 
                         className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2"
                         dangerouslySetInnerHTML={{ __html: testimonialsSectionData.headline }}
                    />
                   
               </motion.div>

               <div className={`relative w-full ${isMobile ? 'overflow-visible' : 'overflow-hidden'}`}>
                    {/* Desktop: Infinite scroll */}
                    <div ref={scrollRef} className={`flex gap-6 ${!isMobile ? 'testimonials-scroll' : ''}`}>
                         {/* Create 3 sets for seamless infinite scroll (desktop only) */}
                         {!isMobile ? [...Array(3)].map((_, setIndex) => 
                              displayTestimonials.map((testimonial) => {
                                   const clientCaseUrl = testimonial.clientCasePath 
                                        ? `/cas-client${testimonial.clientCasePath.startsWith('/') ? '' : '/'}${testimonial.clientCasePath}`
                                        : `/cas-client`;

                                   return (
                                        <div key={`${setIndex}-${testimonial._id}`} className="flex-shrink-0 w-[520px]">
                                             <Link href={clientCaseUrl} className="block h-full">
                                                  <div className="bg-white flex flex-col gap-4 justify-between border border-gray-200 hover:border-[var(--color-secondary)] p-8 rounded-2xl h-[400px] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                                       <div className="testimonial-rate flex gap-0.5">
                                                            <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                            <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                            <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                            <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                            <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                       </div>

                                                       <blockquote className="testimonial-quote text-[#637381] text-base flex-1 overflow-y-auto">
                                                            "{String(testimonial.text || 'No testimonial text available.')}"
                                                       </blockquote>

                                                       <div className="space-y-3 mt-auto">
                                                            <div className="testimonial-author flex items-center gap-4">
                                                                 <div className="author-avatar w-12 h-12 rounded-full overflow-hidden">
                                                                      {testimonial.photo && (testimonial.photo.startsWith('http') || testimonial.photo.startsWith('/')) ? (
                                                                           <Image
                                                                                src={testimonial.photo}
                                                                                alt={testimonial.author || 'Author'}
                                                                                width={50}
                                                                                height={50}
                                                                                className="w-full h-full object-cover"
                                                                           />
                                                                      ) : (
                                                                           <div className="w-full h-full bg-gradient-to-br from-[#3758f9] to-[#3758f9]/80 rounded-full flex items-center justify-center">
                                                                                <span className="text-white font-bold text-sm">
                                                                                     {(testimonial.author || 'Anonymous').split(' ').map(n => n[0]).join('')}
                                                                                </span>
                                                                           </div>
                                                                      )}
                                                                 </div>

                                                                 <div className="author-info flex-1">
                                                                      <h3 className="font-semibold text-sm text-[#111928]">
                                                                           {testimonial.author || 'Anonymous'}
                                                                      </h3>
                                                                      <p className="text-xs text-[#8899a8]">
                                                                           {testimonial.role || 'Client'}
                                                                      </p>
                                                                 </div>
                                                            </div>

                                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-main)] text-white text-xs font-semibold rounded-full group-hover:shadow-lg transition-all duration-300">
                                                                 <span>Lire le cas client</span>
                                                                 <ExternalLink className="w-3 h-3" />
                                                            </div>
                                                       </div>
                                                  </div>
                                             </Link>
                                        </div>
                                   );
                              })
                         ) : null}

                         {/* Mobile: Display 4 testimonials in grid (controlled via CMS) */}
                         {isMobile && mobileTestimonials.length > 0 && (
                              <div className="grid grid-cols-1 gap-6 w-full px-4">
                                   {mobileTestimonials.map((testimonial) => {
                                        const clientCaseUrl = testimonial.clientCasePath 
                                             ? `/cas-client${testimonial.clientCasePath.startsWith('/') ? '' : '/'}${testimonial.clientCasePath}`
                                             : `/cas-client`;

                                        return (
                                             <div key={testimonial._id} className="w-full">
                                                  <Link href={clientCaseUrl} className="block h-full">
                                                       <div className="bg-white flex flex-col gap-4 justify-between border border-gray-200 hover:border-[var(--color-secondary)] p-6 rounded-2xl min-h-[350px] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                                            <div className="testimonial-rate flex gap-0.5">
                                                                 <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                                 <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                                 <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                                 <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                                 <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                            </div>

                                                            <blockquote className="testimonial-quote text-[#637381] text-base flex-1 overflow-y-auto">
                                                                 "{String(testimonial.text || 'No testimonial text available.')}"
                                                            </blockquote>

                                                            <div className="space-y-3 mt-auto">
                                                                 <div className="testimonial-author flex items-center gap-4">
                                                                      <div className="author-avatar w-12 h-12 rounded-full overflow-hidden">
                                                                           {testimonial.photo && (testimonial.photo.startsWith('http') || testimonial.photo.startsWith('/')) ? (
                                                                                <Image
                                                                                     src={testimonial.photo}
                                                                                     alt={testimonial.author || 'Author'}
                                                                                     width={50}
                                                                                     height={50}
                                                                                     className="w-full h-full object-cover"
                                                                                />
                                                                           ) : (
                                                                                <div className="w-full h-full bg-gradient-to-br from-[#3758f9] to-[#3758f9]/80 rounded-full flex items-center justify-center">
                                                                                     <span className="text-white font-bold text-sm">
                                                                                          {(testimonial.author || 'Anonymous').split(' ').map(n => n[0]).join('')}
                                                                                     </span>
                                                                                </div>
                                                                           )}
                                                                      </div>

                                                                      <div className="author-info flex-1">
                                                                           <h3 className="font-semibold text-sm text-[#111928]">
                                                                                {testimonial.author || 'Anonymous'}
                                                                           </h3>
                                                                           <p className="text-xs text-[#8899a8]">
                                                                                {testimonial.role || 'Client'}
                                                                           </p>
                                                                      </div>
                                                                 </div>

                                                                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-main)] text-white text-xs font-semibold rounded-full group-hover:shadow-lg transition-all duration-300">
                                                                      <span>Lire le cas client</span>
                                                                      <ExternalLink className="w-3 h-3" />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </Link>
                                             </div>
                                        );
                                   })}
                              </div>
                         )}
                    </div>
               </div>

               {/* Font Awesome Icons */}
               <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
          </main>
     );
}