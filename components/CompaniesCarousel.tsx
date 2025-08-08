"use client";

import React, { useState } from 'react';
import Image from 'next/image';


interface Company {
     name: string;
     logo: string;
     url?: string;
}

interface CompaniesCarouselProps {
     companies?: Company[];
     speed?: number; // Animation duration in seconds
     text?: string; // Text to display above the carousel
}

const defaultCompanies: Company[] = [];

export default function CompaniesCarousel({ companies = defaultCompanies, speed = 1, text }: CompaniesCarouselProps) {
     const [isHovered, setIsHovered] = useState(false);

     return (
          <div className="relative overflow-hidden py-4 w-full">
               {/* Text above carousel - only show if text is provided from CMS */}
               {text && text.trim() !== '' && (
                    <div className="text-center mb-8">
                         <p className="text-gray-400 text-sm font-normal">{text}</p>
                    </div>
               )}
               <div className="absolute left-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-r from-white to-transparent"></div>
               <div className="absolute right-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-l from-white to-transparent"></div>

               <div
                    className="flex animate-scroll"
                    style={{
                         animation: `scroll ${speed}s linear infinite`,
                         animationPlayState: isHovered ? 'paused' : 'running',
                         width: `${companies.length * 374}px`
                    }}
               >
                    {/* First set */}
                    <div className="flex space-x-8 sm:space-x-12 md:space-x-16 whitespace-nowrap flex-shrink-0" style={{ width: `${companies.length * 187}px` }}>
                         {companies.map((company, index) => (
                              <div
                                   key={`first-${index}`}
                                   className="flex items-center justify-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] h-10 sm:h-12 w-[80px] sm:w-[100px] md:w-[120px] flex-shrink-0"
                                   onMouseEnter={() => setIsHovered(true)}
                                   onMouseLeave={() => setIsHovered(false)}
                              >
                                   {company.logo ? (
                                        <div className="w-[80px] sm:w-[100px] md:w-[120px] h-[30px] sm:h-[35px] md:h-[40px] flex items-center justify-center">
                                             <Image
                                                  src={company.logo}
                                                  alt={company.name}
                                                  width={120}
                                                  height={40}
                                                  className="max-w-[80px] sm:max-w-[100px] md:max-w-[120px] max-h-[30px] sm:max-h-[35px] md:max-h-[40px] w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                                             />
                                        </div>
                                   ) : (
                                        <span className="text-gray-400 font-semibold text-xs sm:text-sm text-center">{company.name}</span>
                                   )}
                              </div>
                         ))}
                    </div>

                    {/* Second set - exact duplicate */}
                    <div className="flex space-x-8 sm:space-x-12 md:space-x-16 whitespace-nowrap flex-shrink-0" style={{ width: `${companies.length * 187}px` }}>
                         {companies.map((company, index) => (
                              <div
                                   key={`second-${index}`}
                                   className="flex items-center justify-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] h-10 sm:h-12 w-[80px] sm:w-[100px] md:w-[120px] flex-shrink-0"
                                   onMouseEnter={() => setIsHovered(true)}
                                   onMouseLeave={() => setIsHovered(false)}
                              >
                                   {company.logo ? (
                                        <div className="w-[80px] sm:w-[100px] md:w-[120px] h-[30px] sm:h-[35px] md:h-[40px] flex items-center justify-center">
                                             <Image
                                                  src={company.logo}
                                                  alt={company.name}
                                                  width={120}
                                                  height={40}
                                                  className="max-w-[80px] sm:max-w-[100px] md:max-w-[120px] max-h-[30px] sm:max-h-[35px] md:max-h-[40px] w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                                             />
                                        </div>
                                   ) : (
                                        <span className="text-gray-400 font-semibold text-xs sm:text-sm text-center">{company.name}</span>
                                   )}
                              </div>
                         ))}
                    </div>
               </div>

               <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll ${speed}s linear infinite;
        }
      `}</style>
          </div>
     );
} 