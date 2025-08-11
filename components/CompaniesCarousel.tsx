"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Company {
     name: string;
     logo: string;
     url?: string;
}

interface CompaniesCarouselProps {
     companies?: Company[];
     speed?: number; // pixels per second
     text?: string;
}

const defaultCompanies: Company[] = [];

export default function CompaniesCarousel({ companies = defaultCompanies, speed = 2000, text }: CompaniesCarouselProps) {
     const [isHovered, setIsHovered] = useState(false);
     const scrollRef = useRef<HTMLDivElement>(null);

     // If no companies, use default values for calculation
     const displayCompanies = companies.length > 0 ? companies : [
          { name: "Company 1", logo: "" },
          { name: "Company 2", logo: "" },
          { name: "Company 3", logo: "" }
     ];

     // Calculate animation duration based on content width and speed
     const itemWidth = 120; // max width on desktop
     const gapWidth = 64; // max gap on desktop (4rem)
     const singleSetWidth = displayCompanies.length * (itemWidth + gapWidth);
     const animationDuration = singleSetWidth / speed;

     return (
          <div className="relative overflow-hidden py-4 w-full">
               {/* Text above carousel */}
               {text && text.trim() !== '' && (
                    <div className="text-center mb-8">
                         <p className="text-gray-400 text-sm font-normal">{text}</p>
                    </div>
               )}

               {/* Gradient overlays */}
               <div className="absolute left-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
               <div className="absolute right-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

               <div className="flex">
                    <div
                         ref={scrollRef}
                         className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-16 whitespace-nowrap animate-scroll"
                         style={{
                              animationPlayState: isHovered ? 'paused' : 'running',
                         }}
                         onMouseEnter={() => setIsHovered(true)}
                         onMouseLeave={() => setIsHovered(false)}
                    >
                         {/* Triple the companies for completely seamless scrolling */}
                         {[...displayCompanies, ...displayCompanies, ...displayCompanies].map((company, index) => (
                              <div
                                   key={`company-${index}`}
                                   className="flex items-center justify-center min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px] h-8 sm:h-10 md:h-12 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] flex-shrink-0"
                              >
                                   {company.logo ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                             <Image
                                                  src={company.logo}
                                                  alt={company.name}
                                                  width={120}
                                                  height={40}
                                                  className="max-w-full max-h-full w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                                             />
                                        </div>
                                   ) : (
                                        <span className="text-gray-400 font-semibold text-xs sm:text-sm text-center px-2">{company.name}</span>
                                   )}
                              </div>
                         ))}
                    </div>
               </div>

               <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scroll {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(calc(-100% / 3));
                      }
                    }
                    
                    .animate-scroll {
                      animation: scroll 12s linear infinite;
                    }
                  `
               }} />
          </div>
     );
}