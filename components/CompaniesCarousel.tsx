/**
 * CompaniesCarousel.tsx
 * 
 * Companies carousel component that displays client logos in a continuous
 * scrolling animation. This component showcases company partnerships and
 * client relationships with smooth scrolling effects.
 * 
 * WHERE IT'S USED:
 * - Homepage (/components/home/HomePage.tsx) - Client showcase section
 * - About page and other pages that need client display
 * - Company credibility through client partnerships
 * 
 * KEY FEATURES:
 * - Continuous scrolling animation for company logos
 * - Hover pause functionality for better user interaction
 * - Responsive design with adaptive sizing
 * - Gradient overlays for smooth edge transitions
 * - Configurable scroll speed and company data
 * - Fallback content when no companies provided
 * - Seamless infinite scrolling effect
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements CSS animations for smooth scrolling
 * - Uses Next.js Image component for optimization
 * - Hover state management for animation control
 * - Responsive design with Tailwind CSS
 * - Dynamic width calculations for smooth animation
 * - Triple company list for seamless looping
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

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
               {(text && text.trim() !== '') ? (
                    <div className="text-center mb-8">
                         <p
                              className="text-gray-400 text-lg md:text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm"
                              style={{
                                   textRendering: 'optimizeLegibility',
                                   WebkitFontSmoothing: 'antialiased',
                                   MozOsxFontSmoothing: 'grayscale',
                                   filter: 'none'
                              }}
                         >
                              {text}
                         </p>
                    </div>
               ) : (
                    <div className="text-center mb-8">
                         <p
                              className="text-gray-400 text-lg md:text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm"
                              style={{
                                   textRendering: 'optimizeLegibility',
                                   WebkitFontSmoothing: 'antialiased',
                                   MozOsxFontSmoothing: 'grayscale',
                                   filter: 'none'
                              }}
                         >
                              Ils ont choisi l'excellence Blackswan Technology. Plus de 100 fois.
                         </p>
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