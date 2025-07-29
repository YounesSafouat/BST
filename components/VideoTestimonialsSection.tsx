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
     videoUrl?: string;
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
                                        {testimonial.videoUrl ? (
                                             // Actual video with controls
                                             <div className="w-full h-full relative group">
                                                  <video
                                                       ref={(el) => { videoRefs.current[testimonial.id] = el; }}
                                                       src={testimonial.videoUrl}
                                                       className="w-full h-full object-cover"
                                                       onTimeUpdate={() => handleTimeUpdate(testimonial.id)}
                                                       onLoadedMetadata={() => handleLoadedMetadata(testimonial.id)}
                                                       onEnded={() => handleVideoEnded(testimonial.id)}
                                                       muted={mutedVideos[testimonial.id]}
                                                  />

                                                  {/* Video Controls Overlay */}
                                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                                       {/* Play/Pause Button */}
                                                       <button
                                                            onClick={() => togglePlay(testimonial.id)}
                                                            className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
                                                       >
                                                            {playingVideos[testimonial.id] ? (
                                                                 <Pause className="w-8 h-8 text-gray-800" />
                                                            ) : (
                                                                 <Play className="w-8 h-8 text-gray-800 ml-1" />
                                                            )}
                                                       </button>
                                                  </div>

                                                  {/* Bottom Controls */}
                                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

                                                       <div className="flex items-center justify-between text-white text-sm">
                                                            <span>{formatTime(currentTime[testimonial.id] || 0)}</span>
                                                            <div className="flex items-center gap-2">
                                                                 <button
                                                                      onClick={() => toggleMute(testimonial.id)}
                                                                      className="hover:bg-white hover:bg-opacity-20 p-1 rounded"
                                                                 >
                                                                      {mutedVideos[testimonial.id] ? (
                                                                           <VolumeX className="w-4 h-4" />
                                                                      ) : (
                                                                           <Volume2 className="w-4 h-4" />
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
                                                  <div className="text-center">
                                                       <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Play className="w-8 h-8 text-white" />
                                                       </div>
                                                       <p className="text-white text-lg font-medium">
                                                            {testimonial.tagline || `Découvrez notre client ${testimonial.company}`}
                                                       </p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>

                                   {/* No white card - just the placeholder design */}
                              </div>
                         ))}
                    </div>


               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 