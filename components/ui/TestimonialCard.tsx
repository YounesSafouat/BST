import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TestimonialCardProps {
     title: string;
     description: string;
     videoThumbnail: string;
     logo?: string;
     solution?: string;
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
               className={`relative w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${className}`}
               onClick={handleCardClick}
          >
               {/* Image Section - Takes half the card */}
               <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
                    {videoThumbnail && (
                         <div 
                              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                              style={{
                                   backgroundImage: `url("${videoThumbnail}")`
                              }}
                         />
                    )}
                    
                    {/* Simple hover overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Clean play button - only for videos */}
                    {hasVideo && (
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                                   <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 ml-0.5 sm:ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                   </svg>
                              </div>
                         </div>
                    )}
               </div>

               {/* Text Section - Takes remaining space */}
               <div className="p-4 bg-[var(--color-main)] text-white">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 leading-tight line-clamp-2">
                         {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 mb-3 line-clamp-2 leading-relaxed">
                         {description}
                    </p>
                    {solution && (
                         <div className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {solution}
                         </div>
                    )}
               </div>
          </div>
     );
};

export default TestimonialCard;