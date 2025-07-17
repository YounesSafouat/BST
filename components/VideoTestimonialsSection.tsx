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

const VideoTestimonialsSection = () => {
     const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({});
     const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
     const [progress, setProgress] = useState<{ [key: string]: number }>({});
     const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
     const [duration, setDuration] = useState<{ [key: string]: number }>({});
     const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

     const testimonials: VideoTestimonial[] = [
          {
               id: '1',
               company: 'taap.it',
               companyLogo: '→',
               duration: '00:54',
               backgroundColor: 'bg-green-500',
               textColor: 'text-white'
          },
          {
               id: '5',
               company: 'slack',
               companyLogo: '💬',
               tagline: 'Where the future works',
               duration: '01:01',
               backgroundColor: 'bg-[var(--color-secondary)]',
               textColor: 'text-white'
          },
          {
               id: '3',
               company: 'zapier',
               companyLogo: '_',
               duration: '00:57',
               backgroundColor: 'bg-amber-100',
               textColor: 'text-gray-800'
          },
          {
               id: '4',
               company: 'submagic',
               companyLogo: '✨',
               duration: '01:13',
               backgroundColor: 'bg-white',
               textColor: 'text-gray-800'
          }
     ];

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
                              NOS DERNIERS PROJETS
                         </div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              Témoignages clients
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              Découvrez comment nos clients ont transformé leur entreprise avec Odoo
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
                                        {testimonial.id === '2' ? (
                                             // Placeholder for second video
                                             <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                  <div className="text-center text-gray-500">
                                                       <div className="text-4xl mb-2">📹</div>
                                                       <div className="text-sm">Video en cours de préparation</div>
                                                  </div>
                                             </div>
                                        ) : (
                                             <video
                                                  ref={(el) => {
                                                       videoRefs.current[testimonial.id] = el;
                                                  }}
                                                  className="w-full h-full object-cover"
                                                  onEnded={() => handleVideoEnded(testimonial.id)}
                                                  onTimeUpdate={() => handleTimeUpdate(testimonial.id)}
                                                  onLoadedMetadata={() => handleLoadedMetadata(testimonial.id)}
                                                  muted={mutedVideos[testimonial.id] || false}
                                                  loop
                                             >
                                                  <source
                                                       src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/14048946_1920_1080_24fps.mp4"
                                                       type="video/mp4"
                                                  />
                                                  Your browser does not support the video tag.
                                             </video>
                                        )}


                                   </div>

                                   {/* Video Controls Bar - Only for real videos */}
                                   {testimonial.id !== '2' && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3">
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <button
                                                            onClick={() => togglePlay(testimonial.id)}
                                                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                                       >
                                                            {playingVideos[testimonial.id] ? (
                                                                 <Pause className="w-4 h-4 text-white" />
                                                            ) : (
                                                                 <Play className="w-4 h-4 text-white ml-0.5" />
                                                            )}
                                                       </button>
                                                       <span className="text-white text-sm font-medium">
                                                            {formatTime(currentTime[testimonial.id] || 0)} / {formatTime(duration[testimonial.id] || 0)}
                                                       </span>
                                                  </div>

                                                  {/* Progress Bar */}
                                                  <div className="flex-1 mx-4">
                                                       <div
                                                            className="w-full bg-white/20 rounded-full h-1 cursor-pointer"
                                                            onClick={(e) => handleProgressClick(testimonial.id, e)}
                                                       >
                                                            <div
                                                                 className="bg-white h-1 rounded-full transition-all duration-100"
                                                                 style={{ width: `${progress[testimonial.id] || 0}%` }}
                                                            ></div>
                                                       </div>
                                                  </div>

                                                  <div className="flex items-center gap-2">
                                                       <button
                                                            onClick={() => toggleMute(testimonial.id)}
                                                            className="w-6 h-6 text-white/70 hover:text-white transition-colors"
                                                            title="Volume"
                                                       >
                                                            {mutedVideos[testimonial.id] ? (
                                                                 <VolumeX className="w-4 h-4" />
                                                            ) : (
                                                                 <Volume2 className="w-4 h-4" />
                                                            )}
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
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