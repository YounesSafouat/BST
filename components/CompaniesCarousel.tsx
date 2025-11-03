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
     regions?: string[]; // Array of regions: ['france', 'morocco', 'international']
}

interface CompaniesCarouselProps {
     companies?: Company[];
     userRegion?: string;
     speed?: number; // pixels per second
     text?: string;
}

const defaultCompanies: Company[] = [];

export default function CompaniesCarousel({ companies = defaultCompanies, userRegion, speed = 1000, text }: CompaniesCarouselProps) {
     const [isHovered, setIsHovered] = useState(false);
     const scrollRef = useRef<HTMLDivElement>(null);

     // Filter companies based on user region
     const getFilteredCompanies = () => {
          if (!companies || companies.length === 0) {
               return [
                    { name: "Company 1", logo: "" },
                    { name: "Company 2", logo: "" },
                    { name: "Company 3", logo: "" }
               ];
          }

          if (!userRegion) {
               // If no region detected, show all companies
               return companies;
          }

          // Filter companies that include the user's region
          const filteredCompanies = companies.filter(company => {
               // If no regions specified, show the company (fallback)
               if (!company.regions || company.regions.length === 0) {
                    return true;
               }
               return company.regions.includes(userRegion);
          });

          // If no companies match the region, fall back to all companies
          return filteredCompanies.length > 0 ? filteredCompanies : companies;
     };

     const displayCompanies = getFilteredCompanies();

     // Debug logging
     console.log('🔍 CompaniesCarousel Debug:');
     console.log('  - userRegion:', userRegion);
     console.log('  - companies count:', companies.length);
     console.log('  - companies with regions:', companies.filter(c => c.regions && c.regions.length > 0).length);
     console.log('  - companies without regions:', companies.filter(c => !c.regions || c.regions.length === 0).length);
     console.log('  - display companies count:', displayCompanies.length);
     console.log('  - companies by region:', {
          france: companies.filter(c => c.regions?.includes('france')).map(c => c.name),
          morocco: companies.filter(c => c.regions?.includes('morocco')).map(c => c.name),
          international: companies.filter(c => c.regions?.includes('international')).map(c => c.name),
          noRegions: companies.filter(c => !c.regions || c.regions.length === 0).map(c => c.name)
     });

     // Calculate animation duration based on content width and speed
     const itemWidth = 120; // max width on desktop
     const gapWidth = 64; // max gap on desktop (4rem)
     const singleSetWidth = displayCompanies.length * (itemWidth + gapWidth);
     const animationDuration = singleSetWidth / speed;

     return (
          <div className="relative w-full bg-white border-2 border-gray-200 rounded-lg">
               {/* Transparent Background Container */}
               <div className="relative bg-transparent p-2 sm:p-6 lg:p-8 mx-auto max-w-6xl">
                    {/* Text above carousel */}
                    <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                         {(text && text.trim() !== '') ? (
                              <h3
                                   className="text-gray-600 text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-4"
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
                                   className="text-gray-600 text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-4"
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
                         {/* Gradient overlays match section background (#F5FAFF) */}
                         <div className="absolute left-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-r from-[#F5FAFF] to-transparent pointer-events-none"></div>
                         <div className="absolute right-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-l from-[#F5FAFF] to-transparent pointer-events-none"></div>

                         <div className="flex">
                              <div
                                   ref={scrollRef}
                                   className="flex gap-4 sm:gap-6 md:gap-10 lg:gap-16 whitespace-nowrap animate-scroll"
                                   style={{
                                        animationPlayState: isHovered ? 'paused' : 'running',
                                        animationDuration: `${animationDuration}s`,
                                   }}
                                   onMouseEnter={() => setIsHovered(true)}
                                   onMouseLeave={() => setIsHovered(false)}
                              >
                                   {/* Triple the companies for completely seamless scrolling */}
                                   {[...displayCompanies, ...displayCompanies, ...displayCompanies].map((company, index) => (
                                        <div
                                             key={`company-${index}`}
                                             className="flex items-center justify-center min-w-[70px] sm:min-w-[90px] md:min-w-[110px] lg:min-w-[140px] h-10 sm:h-12 md:h-14 lg:h-16 w-[70px] sm:w-[90px] md:w-[110px] lg:w-[140px] flex-shrink-0"
                                        >
                                             {company.logo ? (
                                                  <div className="w-full h-full flex items-center justify-center">
                                                       <Image
                                                            src={company.logo}
                                                            alt={company.name}
                                                            width={140}
                                                            height={60}
                                                            className="max-w-full max-h-full w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                                                       />
                                                  </div>
                                             ) : (
                                                  <div className="w-full h-full flex items-center justify-center">
                                                       <span className="text-gray-400 font-semibold text-sm sm:text-base text-center px-2">{company.name}</span>
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