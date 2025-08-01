"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, Pause, VolumeX, X, Maximize2 } from 'lucide-react';

interface VideoTestimonial {
     id: string;
     company: string;
     companyLogo: string;
     tagline?: string;
     duration: string;
     backgroundColor: string;
     textColor: string;
     videoUrl?: string;
     thumbnailUrl?: string; // New field for thumbnail
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
     const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);
     const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
     const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);

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

     const openFullscreen = (videoId: string) => {
          setFullscreenVideo(videoId);
          // Copy current video state to fullscreen
          const video = videoRefs.current[videoId];
          if (video && fullscreenVideoRef.current) {
               fullscreenVideoRef.current.currentTime = video.currentTime;
               fullscreenVideoRef.current.muted = video.muted;
               if (playingVideos[videoId]) {
                    fullscreenVideoRef.current.play();
               }
          }
     };

     const closeFullscreen = () => {
          // Save current state back to original video
          if (fullscreenVideo && fullscreenVideoRef.current) {
               const video = videoRefs.current[fullscreenVideo];
               if (video) {
                    video.currentTime = fullscreenVideoRef.current.currentTime;
                    video.muted = fullscreenVideoRef.current.muted;
               }
          }
          setFullscreenVideo(null);
     };

     const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
     };

     return (
          <section className="min-h-screen bg-white flex items-center">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                         {testimonials.map((testimonial) => (
                              <div
                                   key={testimonial.id}
                                   className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer ${testimonial.backgroundColor}`}
                              >
                                   {/* Video Content - Made bigger */}
                                   <div className="aspect-[16/10] relative">
                                        {testimonial.videoUrl ? (
                                             // Actual video with controls
                                             <div className="w-full h-full relative group">
                                                  <video
                                                       ref={(el) => { videoRefs.current[testimonial.id] = el; }}
                                                       src={testimonial.videoUrl}
                                                       poster={testimonial.thumbnailUrl} // Use thumbnail as poster
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

                                                       {/* Fullscreen Button */}
                                                       <button
                                                            onClick={() => openFullscreen(testimonial.id)}
                                                            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                            title="Plein écran"
                                                            aria-label="Ouvrir la vidéo en plein écran"
                                                       >
                                                            <Maximize2 className="w-5 h-5 text-white" />
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
                                                                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                           <Play className="w-8 h-8 text-gray-800 ml-1" />
                                                                      </div>
                                                                      <p className="text-white text-lg font-medium">
                                                                           {testimonial.tagline || `Découvrez notre client ${testimonial.company}`}
                                                                      </p>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ) : (
                                                       // Default placeholder
                                                       <div className="text-center">
                                                            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                 <Play className="w-8 h-8 text-white" />
                                                            </div>
                                                            <p className="text-white text-lg font-medium">
                                                                 {testimonial.tagline || `Découvrez notre client ${testimonial.company}`}
                                                            </p>
                                                       </div>
                                                  )}
                                             </div>
                                        )}
                                   </div>

                                   {/* Company Info */}
                                   <div className="p-4 bg-white">
                                        <h3 className="text-lg font-semibold text-gray-900">{testimonial.company}</h3>
                                        {testimonial.tagline && (
                                             <p className="text-sm text-gray-600 mt-1">{testimonial.tagline}</p>
                                        )}
                                   </div>
                              </div>
                         ))}
                    </div>

                    {/* Fullscreen Modal */}
                    {fullscreenVideo && (
                         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
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
                                        autoPlay
                                   />
                              </div>
                         </div>
                    )}
               </div>
          </section>
     );
};

export default VideoTestimonialsSection; 