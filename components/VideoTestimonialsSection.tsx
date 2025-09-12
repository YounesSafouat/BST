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
import { Play, Volume2, Pause, VolumeX, X, Maximize2 } from 'lucide-react';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
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
     targetRegions?: string[]; // Add region targeting
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
     const [progress, setProgress] = useState<{ [key: string]: number }>({});
     const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
     const [duration, setDuration] = useState<{ [key: string]: number }>({});
     const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);
     const [fullscreenState, setFullscreenState] = useState<{
          wasPlaying: boolean;
          currentTime: number;
          wasMuted: boolean;
     } | null>(null);
     const [forceUpdate, setForceUpdate] = useState(0);
     const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
     const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
     const sectionRef = useRef<HTMLElement>(null);
     const eventHandlersRef = useRef<Map<string, { play: () => void; pause: () => void }>>(new Map());

     // Use the new geolocation singleton service
     const { data: locationData, loading: locationLoading, region: userRegion } = useGeolocationSingleton();

     const fallbackTestimonials: VideoTestimonial[] = [
          {
               id: '1',
               company: 'ESSEM Business School',
               companyLogo: 'ESSEM',
               duration: '02:00',
               backgroundColor: 'bg-gray-800',
               textColor: 'text-white',
               videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
               thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
               targetRegions: ['all'] // Default to all regions
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
               targetRegions: ['all'] // Default to all regions
          }
     ];

     // Filter testimonials based on user region
     const filterTestimonialsByRegion = (testimonials: VideoTestimonial[], region: string): VideoTestimonial[] => {
          return testimonials.filter(testimonial => {
               // If no targetRegions specified, show to all
               if (!testimonial.targetRegions || testimonial.targetRegions.length === 0) {
                    return true;
               }
               // Show if targeting all regions or specifically targeting user's region
               return testimonial.targetRegions.includes('all') || testimonial.targetRegions.includes(region);
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

     const handleTimeUpdate = (videoId: string) => {
          const video = videoRefs.current[videoId];
          if (video) {
               const current = video.currentTime;
               const total = video.duration;
               setCurrentTime(prev => ({ ...prev, [videoId]: current }));
               setProgress(prev => ({ ...prev, [videoId]: total > 0 ? (current / total) * 100 : 0 }));
          }
     };

     const handleLoadedMetadata = (videoId: string) => {
          const video = videoRefs.current[videoId];
          if (video) {
               setDuration(prev => ({ ...prev, [videoId]: video.duration }));
          }
     };

     const handleProgressClick = (videoId: string, e: React.MouseEvent<HTMLDivElement>) => {
          const video = videoRefs.current[videoId];
          if (video) {
               const rect = e.currentTarget.getBoundingClientRect();
               const clickX = e.clientX - rect.left;
               const width = rect.width;
               const clickTime = (clickX / width) * video.duration;
               video.currentTime = clickTime;
          }
     };

     const handleFullscreenLoadedMetadata = () => {
          if (fullscreenVideoRef.current) {
               const video = fullscreenVideoRef.current;
               if (fullscreenState) {
                    // Restore the state
                    video.currentTime = fullscreenState.currentTime;
                    video.muted = fullscreenState.wasMuted;
                    if (fullscreenState.wasPlaying) {
                         video.play().catch((error) => {
                              console.error('Error playing fullscreen video:', error);
                         });
                    }
               }
          }
     };

     const openFullscreen = (videoId: string) => {
          const video = videoRefs.current[videoId];
          if (video) {
               // Store current state
               const wasPlaying = playingVideos[videoId];
               const currentTime = video.currentTime;
               const wasMuted = video.muted;

               // Store state for when fullscreen video loads
               setFullscreenState({
                    wasPlaying,
                    currentTime,
                    wasMuted
               });

               // First, completely stop the original video
               video.pause();
               video.src = ''; // Clear the source to stop any background audio
               setPlayingVideos(prev => ({
                    ...prev,
                    [videoId]: false
               }));

               // Set fullscreen video
               setFullscreenVideo(videoId);
          }
     };

     const closeFullscreen = () => {
          // Save current state back to original video
          if (fullscreenVideo && fullscreenVideoRef.current) {
               const video = videoRefs.current[fullscreenVideo];
               if (video) {
                    const fullscreenCurrentTime = fullscreenVideoRef.current.currentTime;
                    const fullscreenMuted = fullscreenVideoRef.current.muted;
                    const wasPlaying = !fullscreenVideoRef.current.paused;

                    // Pause fullscreen video
                    fullscreenVideoRef.current.pause();

                    // Restore original video source and state
                    const testimonial = testimonials.find(t => t.id === fullscreenVideo);
                    if (testimonial?.videoUrl) {
                         video.src = testimonial.videoUrl;
                         video.currentTime = fullscreenCurrentTime;
                         video.muted = fullscreenMuted;

                         // If fullscreen was playing, continue playing in original
                         if (wasPlaying) {
                              video.play();
                              setPlayingVideos(prev => ({
                                   ...prev,
                                   [fullscreenVideo]: true
                              }));
                         }
                    }
               }
          }
          setFullscreenVideo(null);
     };

     const handleOverlayClick = (e: React.MouseEvent) => {
          // Only close if clicking on the overlay itself, not the video container
          if (e.target === e.currentTarget) {
               closeFullscreen();
          }
     };

     const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
     };

     return (
          <section className="min-h-screen bg-white flex items-center" ref={sectionRef}>
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="text-center mb-8 sm:mb-12">
                         <div className="uppercase tracking-widest text-xs sm:text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              {headline}
                         </div>
                         <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
                              {description}
                         </h2>
                         <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                              {subdescription}
                         </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
                         {testimonials.map((testimonial) => (
                              <div
                                   key={testimonial.id}
                                   className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer ${testimonial.backgroundColor}`}
                              >
                                   {/* Video Content - Made bigger */}
                                   <div className="aspect-[16/10] relative">
                                        {/* Always show video for testing - use fallback URL if no videoUrl */}
                                        {true ? (
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
                                                       onTimeUpdate={() => handleTimeUpdate(testimonial.id)}
                                                       onLoadedMetadata={() => handleLoadedMetadata(testimonial.id)}
                                                       onEnded={() => handleVideoEnded(testimonial.id)}
                                                       onPlay={() => setPlayingVideos(prev => ({ ...prev, [testimonial.id]: true }))}
                                                       onPause={() => setPlayingVideos(prev => ({ ...prev, [testimonial.id]: false }))}
                                                       muted={mutedVideos[testimonial.id]}
                                                  />

                                                  {/* Video Controls Overlay */}
                                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                                       {/* Play/Pause Button */}
                                                       <button
                                                            onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 togglePlay(testimonial.id);
                                                            }}
                                                            className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
                                                       >
                                                            {playingVideos[testimonial.id] ? (
                                                                 <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" />
                                                            ) : (
                                                                 <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 ml-0.5 sm:ml-1" />
                                                            )}
                                                       </button>

                                                       {/* Fullscreen Button */}
                                                       <button
                                                            onClick={() => openFullscreen(testimonial.id)}
                                                            className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                            title="Plein écran"
                                                            aria-label="Ouvrir la vidéo en plein écran"
                                                       >
                                                            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                       </button>
                                                  </div>

                                                  {/* Bottom Controls */}
                                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                       {/* Progress Bar */}
                                                       <div
                                                            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-2"
                                                            onClick={(e) => handleProgressClick(testimonial.id, e)}
                                                       >
                                                            <div
                                                                 className="h-full bg-white rounded-full transition-all duration-100"
                                                                 style={{ width: `${progress[testimonial.id] || 0}%` }}
                                                            />
                                                       </div>

                                                       <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                                                            <span>{formatTime(currentTime[testimonial.id] || 0)}</span>
                                                            <div className="flex items-center gap-2">
                                                                 <button
                                                                      onClick={() => toggleMute(testimonial.id)}
                                                                      className="hover:bg-white hover:bg-opacity-20 p-1 rounded"
                                                                 >
                                                                      {mutedVideos[testimonial.id] ? (
                                                                           <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                      ) : (
                                                                           <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                      )}
                                                                 </button>
                                                                 <span>{formatTime(duration[testimonial.id] || 0)}</span>
                                                            </div>
                                                       </div>
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
                                                                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                                           <Play className="w-6 h-6 sm:w-8 sm:w-8 text-gray-800 ml-0.5 sm:ml-1" />
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
                                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                                 <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                         ))}
                    </div>

                    {/* Fullscreen Modal */}
                    {fullscreenVideo && (
                         <div
                              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                              onClick={handleOverlayClick}
                         >
                              <div className="relative w-full max-w-6xl">
                                   {/* Close Button */}
                                   <button
                                        onClick={closeFullscreen}
                                        className="absolute top-4 right-4 z-10 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-300"
                                        title="Fermer"
                                        aria-label="Fermer la vidéo plein écran"
                                   >
                                        <X className="w-6 h-6 text-white" />
                                   </button>

                                   {/* Video */}
                                   <video
                                        ref={fullscreenVideoRef}
                                        src={testimonials.find(t => t.id === fullscreenVideo)?.videoUrl}
                                        poster={testimonials.find(t => t.id === fullscreenVideo)?.thumbnailUrl}
                                        className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                        controls
                                        onLoadedMetadata={handleFullscreenLoadedMetadata}
                                   />
                              </div>
                         </div>
                    )}
               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 