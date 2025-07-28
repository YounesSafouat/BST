"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, Pause, VolumeX } from 'lucide-react';

interface VideoTestimonial {
     id: string;
     company: string;
     companyLogo: string;
     tagline?: string;
     duration: string;
     backgroundColor: string;
     textColor: string;
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

const VideoTestimonialsSection = ({ videoTestimonialsData }: VideoTestimonialsSectionProps) => {
     const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({});
     const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
     const [progress, setProgress] = useState<{ [key: string]: number }>({});
     const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
     const [duration, setDuration] = useState<{ [key: string]: number }>({});
     const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

     // Fallback data if no data is provided
     const fallbackTestimonials: VideoTestimonial[] = [
          {
               id: '1',
               company: 'ESSEM Business School',
               companyLogo: 'ESSEM',
               duration: '02:00',
               backgroundColor: 'bg-gray-800',
               textColor: 'text-white'
          },
          {
               id: '2',
               company: 'AI Crafters',
               companyLogo: 'AI Crafters',
               tagline: 'Découvrez notre client AI Crafters',
               duration: '02:00',
               backgroundColor: 'bg-gray-800',
               textColor: 'text-white'
          }
     ];

     const testimonials = videoTestimonialsData?.videos || fallbackTestimonials;
     const headline = videoTestimonialsData?.headline || 'NOS DERNIERS PROJETS';
     const description = videoTestimonialsData?.description || 'Témoignages clients';
     const subdescription = videoTestimonialsData?.subdescription || 'Découvrez comment nos clients ont transformé leur entreprise avec Odoo';

     const togglePlay = (videoId: string) => {
          const video = videoRefs.current[videoId];
          if (video) {
               if (playingVideos[videoId]) {
                    video.pause();
               } else {
                    video.play();
               }
               setPlayingVideos(prev => ({
                    ...prev,
                    [videoId]: !prev[videoId]
               }));
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

     const handleProgressClick = (videoId: string, event: React.MouseEvent<HTMLDivElement>) => {
          const video = videoRefs.current[videoId];
          if (video) {
               const rect = event.currentTarget.getBoundingClientRect();
               const clickX = event.clientX - rect.left;
               const width = rect.width;
               const percentage = clickX / width;
               video.currentTime = percentage * video.duration;
          }
     };

     const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
     };

     return (
          <section className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              {headline}
                         </div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              {description}
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              {subdescription}
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                         {testimonials.map((testimonial) => (
                              <div
                                   key={testimonial.id}
                                   className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer ${testimonial.backgroundColor}`}
                              >
                                   {/* Video Content */}
                                   <div className="aspect-video relative">
                                        {/* Placeholder design for both videos */}
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                             <div className="text-center">
                                                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                       <Play className="w-8 h-8 text-white" />
                                                  </div>
                                                  <p className="text-white text-lg font-medium">
                                                       {testimonial.id === '1' ? 'Découvrez notre client ESSEM' : 'Découvrez notre client AI Crafters'}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* No white card - just the placeholder design */}
                              </div>
                         ))}
                    </div>

                    {/* Call to Action */}
                    <div className="text-center mt-12">
                         <button className="inline-flex items-center px-6 py-3 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:bg-[var(--color-secondary)]/90 transition-colors duration-300">
                              Voir tous nos témoignages
                              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                         </button>
                    </div>
               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 