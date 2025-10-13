/**
 * VideoTestimonialsSection.tsx
 * 
 * Video testimonials section component that displays client video testimonials
 * with interactive video controls and regional content filtering. This component
 * showcases client success stories through video content.
 * 
 * WHERE IT'S USED:
 * - Homepage (/components/home/HomePage.tsx) - Video testimonials section
 * - About page and other pages that need client testimonials
 * - Client success stories and credibility building
 * 
 * KEY FEATURES:
 * - Interactive video player with custom controls
 * - Regional content filtering based on user location
 * - Fullscreen video support
 * - Video progress tracking and time display
 * - Mute/unmute functionality
 * - Responsive design with mobile optimization
 * - Fallback content when no testimonials available
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements custom video controls and state management
 * - Integrates with geolocation API for regional filtering
 * - Uses HTML5 video API for advanced functionality
 * - Implements fullscreen API for enhanced viewing
 * - Responsive design with Tailwind CSS
 * - Complex state management for multiple videos
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Loader from './home/Loader';


interface VideoTestimonial {
     id: string;
     company: string;
     companyLogo: string;
     tagline?: string;
     duration: string;
     backgroundColor: string;
     textColor: string;
     videoUrl?: string;
     thumbnailUrl?: string;
     targetRegions?: string[];
     clientCasePath?: string; // New field for cas-client link
}

interface VideoTestimonialsData {
     headline: string;
     description: string;
     subdescription?: string;
     videos: VideoTestimonial[];
}

interface VideoTestimonialsSectionProps {
     videoTestimonialsData?: VideoTestimonialsData;
}

/* SECTION: Video Testimonials - VideoTestimonialsSection */
const VideoTestimonialsSection = ({ videoTestimonialsData }: VideoTestimonialsSectionProps) => {
     const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({});
     const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
     const [forceUpdate, setForceUpdate] = useState(0);
     const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
     const sectionRef = useRef<HTMLElement>(null);
     const eventHandlersRef = useRef<Map<string, { play: () => void; pause: () => void }>>(new Map());

     // Use the new geolocation singleton service
     const { data: locationData, loading: locationLoading, region: userRegion } = useGeolocationSingleton();
     const router = useRouter();

     const fallbackTestimonials: VideoTestimonial[] = [
          {
               id: '1',
               company: 'ESSEM Business School',
               companyLogo: 'ESSEM',
               tagline: 'Découvrez notre client ESSEM Business School',
               duration: '02:30',
               backgroundColor: 'bg-gray-800',
               textColor: 'text-white',
               videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
               thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
               targetRegions: ['all'], // Default to all regions
               clientCasePath: 'essem' // Example cas-client path
          },
          {
               id: '2',
               company: 'AI Crafters',
               companyLogo: 'AI Crafters',
               tagline: 'Découvrez notre client AI Crafters',
               duration: '02:00',
               backgroundColor: 'bg-gray-800',
               textColor: 'text-white',
               videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
               thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
               targetRegions: ['all'], // Default to all regions
               clientCasePath: 'ai-crafters' // Example cas-client path
          }
     ];

     // Filter testimonials based on user region
     const filterTestimonialsByRegion = (testimonials: VideoTestimonial[], region: string): VideoTestimonial[] => {
          return testimonials.filter(testimonial => {
               // If no targetRegions specified, show to all
               if (!testimonial.targetRegions || testimonial.targetRegions.length === 0) {
                    return true;
               }
               // Case-insensitive comparison for regions
               const normalizedRegion = region?.toLowerCase() || '';
               const normalizedTargetRegions = testimonial.targetRegions.map(r => r.toLowerCase());
               // Show if targeting all regions or specifically targeting user's region
               return normalizedTargetRegions.includes('all') || normalizedTargetRegions.includes(normalizedRegion);
          });
     };

     const allTestimonials = videoTestimonialsData?.videos || fallbackTestimonials;
     const testimonials = filterTestimonialsByRegion(allTestimonials, userRegion);
     const headline = videoTestimonialsData?.headline || 'NOS DERNIERS PROJETS';
     const description = videoTestimonialsData?.description || 'Témoignages clients';
     const subdescription = videoTestimonialsData?.subdescription || 'Découvrez comment nos clients ont transformé leur entreprise avec Odoo';

     // Move useEffect hook before any conditional returns to follow Rules of Hooks
     useEffect(() => {
          // Only add event listeners if testimonials exist and location is not loading
          if (locationLoading || testimonials.length === 0) return;

          const handlePlay = (videoId: string) => {
               setPlayingVideos(prev => ({ ...prev, [videoId]: true }));
          };

          const handlePause = (videoId: string) => {
               setPlayingVideos(prev => ({ ...prev, [videoId]: false }));
          };

          // Add event listeners to all videos
          testimonials.forEach((testimonial) => {
               const video = videoRefs.current[testimonial.id];
               if (video) {
                    const playHandler = () => handlePlay(testimonial.id);
                    const pauseHandler = () => handlePause(testimonial.id);

                    const existingHandlers = eventHandlersRef.current.get(testimonial.id);
                    if (existingHandlers) {
                         video.removeEventListener('play', existingHandlers.play);
                         video.removeEventListener('pause', existingHandlers.pause);
                    }

                    video.addEventListener('play', playHandler);
                    video.addEventListener('pause', pauseHandler);

                    eventHandlersRef.current.set(testimonial.id, { play: playHandler, pause: pauseHandler });
               }
          });

          return () => {
               testimonials.forEach((testimonial) => {
                    const video = videoRefs.current[testimonial.id];
                    const handlers = eventHandlersRef.current.get(testimonial.id);
                    if (video && handlers) {
                         video.removeEventListener('play', handlers.play);
                         video.removeEventListener('pause', handlers.pause);
                         eventHandlersRef.current.delete(testimonial.id);
                    }
               });
          };
     }, [testimonials, forceUpdate, locationLoading]);

     // Hide section entirely if no videos available for user's region
     if (!locationLoading && testimonials.length === 0) {
          return null;
     }

     // Show loading while detecting location
     if (locationLoading) {
          return <Loader />;
     }


     const togglePlay = (videoId: string) => {
          const video = videoRefs.current[videoId];
          if (video) {
               if (video.paused) {
                    video.play().catch((error) => {
                         console.error('Error playing video:', error);
                    });
               } else {
                    video.pause();
               }
          }
     };

     const toggleMute = (videoId: string) => {
          const video = videoRefs.current[videoId];
          if (video) {
               video.muted = !video.muted;
               setMutedVideos(prev => ({
                    ...prev,
                    [videoId]: !prev[videoId]
               }));
          }
     };

     const handleVideoEnded = (videoId: string) => {
          setPlayingVideos(prev => ({
               ...prev,
               [videoId]: false
          }));
     };


     const handleLoadedMetadata = (videoId: string) => {
          // This function can be used for any metadata loading if needed
          // Currently no state to set since we removed duration tracking
     };


     // Function to redirect to case client
     const redirectToCaseClient = (testimonial: VideoTestimonial) => {
          const clientCaseUrl = testimonial.clientCasePath 
               ? `/cas-client${testimonial.clientCasePath.startsWith('/') ? '' : '/'}${testimonial.clientCasePath}`
               : `/cas-client`;
          router.push(clientCaseUrl);
     };

     return (
          <section className="h-screen bg-white" ref={sectionRef}>
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center">
                    <div className="text-center mb-8 sm:mb-12">
                         <div className="uppercase tracking-widest text-xs sm:text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              {headline}
                         </div>
                         <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
                              {description}
                         </h2>
                        
                    </div>

                    {/* Video container with Swiper - showing 2 at a time */}
                    <div className="relative w-full px-8 sm:px-12">
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
                                        slidesPerView: 2,
                                        spaceBetween: 24
                                   }
                              }}
                              loop={true}
                              grabCursor={true}
                              className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px] pb-8 sm:pb-15"
                         >
                         {testimonials.map((testimonial) => (
                                   <SwiperSlide key={testimonial.id}>
                              <div
                                   className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer ${testimonial.backgroundColor}`}
                                                  onClick={() => redirectToCaseClient(testimonial)}
                              >
                                  {/* Video Content - Made bigger */}
                                  <div className="aspect-[16/10] relative">
                                       {/* Show video if videoUrl exists */}
                                       {testimonial.videoUrl ? (
                                             // Actual video with controls
                                             <div
                                                  className="w-full h-full relative group"
                                                  onClick={(e) => {
                                                       // Only toggle if clicking on the container, not on buttons
                                                       if (e.target === e.currentTarget || e.target === videoRefs.current[testimonial.id]) {
                                                            togglePlay(testimonial.id);
                                                       }
                                                  }}
                                             >
                                                  <video
                                                       ref={(el) => {
                                                            videoRefs.current[testimonial.id] = el;
                                                       }}
                                                       src={testimonial.videoUrl}
                                                       poster={testimonial.thumbnailUrl} // Use thumbnail as poster
                                                       className="w-full h-full object-cover"
                                                       onLoadedMetadata={() => handleLoadedMetadata(testimonial.id)}
                                                       onEnded={() => handleVideoEnded(testimonial.id)}
                                                       onPlay={() => setPlayingVideos(prev => ({ ...prev, [testimonial.id]: true }))}
                                                       onPause={() => setPlayingVideos(prev => ({ ...prev, [testimonial.id]: false }))}
                                                       muted={mutedVideos[testimonial.id]}
                                                  />

                                                  {/* Video Controls Overlay */}
                                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                                                 {/* Redirect Button */}
                                                       <button
                                                            onClick={(e) => {
                                                                 e.stopPropagation();
                                                                           redirectToCaseClient(testimonial);
                                                                      }}
                                                                      className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--color-main)] hover:bg-[var(--color-secondary)] rounded-full flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100 hover:scale-110"
                                                                 >
                                                                      <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                                                 </button>
                                                            </div>

                                             </div>
                                        ) : (
                                             // Placeholder design when no video URL
                                             <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                  {testimonial.thumbnailUrl ? (
                                                       // Show thumbnail if available
                                                       <div className="w-full h-full relative">
                                                            <img
                                                                 src={testimonial.thumbnailUrl}
                                                                 alt={testimonial.company}
                                                                 className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                                 <div className="text-center">
                                                                                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-main)] hover:bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300">
                                                                                          <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                                                      </div>
                                                                      <p className="text-white text-sm sm:text-lg font-medium">
                                                                           {testimonial.tagline || `Découvrez notre client ${testimonial.company}`}
                                                                      </p>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ) : (
                                                       // Default placeholder
                                                       <div className="text-center">
                                                                           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-main)] hover:bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300">
                                                                                <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                                            </div>
                                                            <p className="text-white text-sm sm:text-lg font-medium">
                                                                 {testimonial.tagline || `Découvrez notre client ${testimonial.company}`}
                                                            </p>
                                                       </div>
                                                  )}
                                             </div>
                                        )}
                                   </div>
                              </div>
                                   </SwiperSlide>
                         ))}
                         </Swiper>

                         {/* Navigation Buttons - Perfectly centered on video cards */}
                         <div className="swiper-button-prev !absolute !-left-2 sm:!left-0 !top-[45%] !-translate-y-1/2 !w-10 !h-10 !text-[var(--color-main)] !after:content-['\f053'] !after:font-['Font_Awesome_5_free'] !after:font-black !after:text-lg !z-10"></div>
                         <div className="swiper-button-next !absolute !-right-2 sm:!right-0 !top-[45%] !-translate-y-1/2 !w-10 !h-10 !text-[var(--color-main)] !after:content-['\f054'] !after:font-['Font_Awesome_5_free'] !after:font-black !after:text-lg !z-10"></div>
                    </div>

                    {/* Font Awesome Icons */}
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 