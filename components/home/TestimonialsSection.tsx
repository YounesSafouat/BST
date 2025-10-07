'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
     
     // Use the new geolocation singleton service
     const { data: locationData, loading: geolocationLoading, region: userRegion } = useGeolocationSingleton();

     useEffect(() => {
          setMounted(true);
     }, []);

     // Fetch testimonials when geolocation is ready or when region changes
     useEffect(() => {
          if (mounted && !geolocationLoading && userRegion && lastFetchedRegion.current !== userRegion) {
              
               lastFetchedRegion.current = userRegion;
               fetchTestimonials(userRegion);
          }
     }, [mounted, geolocationLoading, userRegion]);

     const fetchTestimonials = async (region?: string) => {
          try {
               const targetRegion = region || userRegion || 'international';
             
               
               const response = await fetch(`/api/testimonials?region=${targetRegion}`);
               if (response.ok) {
                    const data = await response.json();
                    
                    
                    // Client-side filtering as backup
                    let filteredData = data || [];
                    if (targetRegion && targetRegion !== 'all') {
                         filteredData = data.filter(t => 
                              t.targetRegions?.includes(targetRegion) || t.targetRegions?.includes('all')
                         );
                        
                    }
                    
                    setDisplayTestimonials(filteredData);
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
          <main id="testimonials" className="min-h-screen bg-[#f9fafb] flex items-center justify-center flex-col gap-15 py-8 px-8">
               <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
               >
                    <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">{testimonialsSectionData.headline}</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">{testimonialsSectionData.description}</h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{testimonialsSectionData.subdescription}</p>
               </motion.div>

               <div className="relative w-full px-12">
                    <Swiper
                         modules={[Navigation, Pagination]}
                         spaceBetween={24}
                         slidesPerView={1}
                         navigation={{
                              nextEl: '.swiper-button-next',
                              prevEl: '.swiper-button-prev',
                         }}
                         breakpoints={{
                              640: {
                                   slidesPerView: 1,
                                   spaceBetween: 18
                              },
                              768: {
                                   slidesPerView: 2,
                                   spaceBetween: 18
                              },
                              1188: {
                                   slidesPerView: 3,
                                   spaceBetween: 24
                              }
                         }}
                         loop={true}
                         grabCursor={true}
                         className="w-full min-h-[450px] sm:min-h-[500px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px] pb-15"
                    >
                         {displayTestimonials.map((testimonial) => {
                              const clientCaseUrl = testimonial.clientCasePath 
                                   ? `/cas-client${testimonial.clientCasePath.startsWith('/') ? '' : '/'}${testimonial.clientCasePath}`
                                   : `/cas-client`;

                              return (
                                   <SwiperSlide key={testimonial._id}>
                                        <Link href={clientCaseUrl} className="block h-full">
                                             <div className="bg-white flex flex-col gap-4 justify-between shadow-[0px_0px_20px_0px_rgba(92,115,160,0.07)] p-8 rounded-xl min-h-[400px] sm:min-h-[450px] md:min-h-[300px] lg:min-h-[350px] xl:min-h-[400px] hover:shadow-[0px_0px_30px_0px_rgba(92,115,160,0.15)] transition-all duration-300 cursor-pointer group">
                                                  <div className="testimonial-rate flex gap-0.5">
                                                       <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                       <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                       <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                       <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                       <i className="fa-solid fa-star text-[#f9b707]"></i>
                                                  </div>

                                                  <blockquote className="testimonial-quote text-[#637381] text-base">
                                                       "{testimonial.text || 'No testimonial text available.'}"
                                                  </blockquote>

                                                  <div className="space-y-3">
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
                                   </SwiperSlide>
                              );
                         })}
                    </Swiper>

                    {/* Navigation Buttons - Positioned with proper spacing */}
                    <div className="swiper-button-prev !absolute !left-0 !top-1/2 !-translate-y-1/2 !w-10 !h-10 !text-[#3758f9] !after:content-['\f053'] !after:font-['Font_Awesome_5_free'] !after:font-black !after:text-lg !z-10"></div>
                    <div className="swiper-button-next !absolute !right-0 !top-1/2 !-translate-y-1/2 !w-10 !h-10 !text-[#3758f9] !after:content-['\f054'] !after:font-['Font_Awesome_5_free'] !after:font-black !after:text-lg !z-10"></div>

               </div>

               {/* Font Awesome Icons */}
               <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
          </main>
     );
}