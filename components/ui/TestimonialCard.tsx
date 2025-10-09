import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TestimonialCardProps {
     title: string;
     description: string;
     videoThumbnail: string;
     logo?: string;
     solution?: string;
     sector?: string;
     interviewee?: string;
     variant: 'primary' | 'secondary';
     className?: string;
     size?: 'small' | 'medium' | 'large';
     slug?: string;
     onClick?: () => void;
     hidePlayIcon?: boolean;
     hasVideo?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
     title,
     description,
     videoThumbnail,
     logo,
     solution,
     sector,
     interviewee,
     variant,
     className = "",
     size = 'medium',
     slug,
     onClick,
     hidePlayIcon = false,
     hasVideo = false
}) => {
     const router = useRouter();

     const handleCardClick = () => {
          if (onClick) {
               onClick();
          } else if (slug) {
               router.push(`/cas-client/${slug}`);
          }
     };

     return (
          <div 
               className={`relative w-full h-[300px] sm:h-[350px] md:h-[400px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${className}`}
               onClick={handleCardClick}
          >
               {/* Background Image - Full card */}
               <div className="absolute inset-0 overflow-hidden">
                    {videoThumbnail && (
                         <div 
                              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                              style={{
                                   backgroundImage: `url("${videoThumbnail}")`
                              }}
                         />
                    )}
                    
                    {/* Simple gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Simple hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Simple play button - only for videos */}
                    {hasVideo && (
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                                   <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 ml-0.5 sm:ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                   </svg>
                              </div>
                         </div>
                    )}
               </div>

               {/* Text Section - Expands to 80% on hover */}
               <div className="absolute bottom-0 left-0 right-0 h-[35%] group-hover:h-[80%] bg-[var(--color-main)] text-white transition-all duration-500 ease-in-out p-4 sm:p-5 md:p-6 flex flex-col overflow-hidden">
                    <div className="flex flex-col h-full">
                         <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight line-clamp-2 group-hover:line-clamp-3 mb-2">
                              {title}
                         </h3>
                         {/* Description fills all available space */}
                         <div className="flex-1 overflow-hidden mb-3">
                              <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2 group-hover:line-clamp-none opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                                   {description}
                              </p>
                         </div>
                         {/* Bottom section with sector and arrow */}
                         <div className="flex items-center justify-between pt-2">
                              {sector && (
                                   <div className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        {sector}
                                   </div>
                              )}
                              {/* Arrow indicator on hover - at the bottom right */}
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                   <div className="flex items-center gap-2 text-xs font-medium">
                                        <span className="hidden sm:inline">Voir le cas</span>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default TestimonialCard;