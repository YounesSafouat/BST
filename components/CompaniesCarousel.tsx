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

export default function CompaniesCarousel({ companies = defaultCompanies, speed = 1000, text }: CompaniesCarouselProps) {
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
          <div className="relative w-full">
               {/* Solid Background Container - Like the reference image */}
               <div className="relative bg-[var(--color-main)] rounded-2xl lg:rounded-3xl p-6 lg:p-8 mx-auto max-w-6xl">
                    {/* Text above carousel */}
                    <div className="text-center mb-8">
                         {(text && text.trim() !== '') ? (
                              <h3
                                   className="text-white text-lg lg:text-xl font-semibold mb-4"
                                   style={{
                                        textRendering: 'optimizeLegibility',
                                        WebkitFontSmoothing: 'antialiased',
                                        MozOsxFontSmoothing: 'grayscale',
                                        filter: 'none'
                                   }}
                              >
                                   {text}
                              </h3>
                         ) : (
                              <h3
                                   className="text-white text-lg lg:text-xl font-semibold mb-4"
                                   style={{
                                        textRendering: 'optimizeLegibility',
                                        WebkitFontSmoothing: 'antialiased',
                                        MozOsxFontSmoothing: 'grayscale',
                                        filter: 'none'
                                   }}
                              >
                                   Ils nous ont accordé leur confiance :
                              </h3>
                         )}
                    </div>

                    {/* Carousel Container */}
                    <div className="relative overflow-hidden">
                         {/* Gradient overlays */}
                         <div className="absolute left-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-r from-[var(--color-main)] to-transparent pointer-events-none"></div>
                         <div className="absolute right-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-l from-[var(--color-main)] to-transparent pointer-events-none"></div>

                         <div className="flex">
                              <div
                                   ref={scrollRef}
                                   className="flex gap-6 sm:gap-8 md:gap-12 lg:gap-16 whitespace-nowrap animate-scroll"
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
                                             className="flex items-center justify-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px] h-12 sm:h-14 md:h-16 w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px] flex-shrink-0"
                                        >
                                             {company.logo ? (
                                                  <div className="w-full h-full flex items-center justify-center">
                                                       <Image
                                                            src={company.logo}
                                                            alt={company.name}
                                                            width={140}
                                                            height={60}
                                                            className="max-w-full max-h-full w-auto h-auto object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300"
                                                       />
                                                  </div>
                                             ) : (
                                                  <div className="w-full h-full flex items-center justify-center">
                                                       <span className="text-white/80 font-semibold text-sm sm:text-base text-center px-2">{company.name}</span>
                                                  </div>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         </div>
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
                      animation: scroll 20s linear infinite;
                    }
                  `
               }} />
          </div>
     );
}