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
     hidePlayIcon = false
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
               className={`relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${className}`}
               onClick={handleCardClick}
          >
               {/* Background Image */}
               {videoThumbnail && (
                    <div 
                         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                         style={{
                              backgroundImage: `url("${videoThumbnail}")`
                         }}
                    />
               )}
               
               
               {/* Expanding circle bubble effect */}
               <div className="absolute inset-0 overflow-hidden">
                    {/* Expanding circle that becomes background shadow */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white/10 rounded-full group-hover:w-[200%] group-hover:h-[200%] transition-all duration-700 ease-out"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-3 sm:p-4 md:p-6">
                         {/* Content */}
                         <div className="flex-1 flex flex-col justify-center text-center text-white">
                              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 text-shadow-lg leading-tight">
                                   {title}
                              </h3>
                              <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed opacity-90 text-shadow line-clamp-2 sm:line-clamp-3">
                                   {description}
                              </p>
                         </div>
                         
                         {/* Bottom Section */}
                         <div className="flex justify-end items-center">
                              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-white/30 transition-all duration-300">
                                   <span className="text-white text-sm sm:text-base">→</span>
                                   <span className="text-white text-xs sm:text-sm font-medium">Voir la vidéo</span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default TestimonialCard;