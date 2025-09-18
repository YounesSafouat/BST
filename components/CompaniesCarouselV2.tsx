/**
 * CompaniesCarouselV2.tsx
 * 
 * Enhanced companies carousel component inspired by modern design patterns.
 * Features a contained section design with professional company logo presentation
 * and smooth scrolling animations. Maintains regional filtering and responsive design.
 * 
 * WHERE IT'S USED:
 * - Homepage (/components/home/HomePage.tsx) - Client showcase section
 * - About page and other pages that need client display
 * - Company credibility through client partnerships
 * 
 * KEY FEATURES:
 * - Contained section with subtle border and background
 * - Professional company logo grid layout
 * - Smooth continuous scrolling animation
 * - Hover pause functionality for better user interaction
 * - Responsive design with adaptive sizing
 * - Regional filtering support (france, morocco, international)
 * - Configurable scroll speed and company data
 * - Fallback content when no companies provided
 * - Clean typography and spacing following design system
 * 
 * DESIGN IMPROVEMENTS V2:
 * - More structured container design
 * - Better visual hierarchy with contained section
 * - Improved logo presentation and spacing
 * - Enhanced responsive behavior
 * - Cleaner animation implementation
 * - Better integration with project design system
 * 
 * @author younes safouat
 * @version 2.0.0
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

interface CompaniesCarouselV2Props {
    companies?: Company[];
    userRegion?: string;
    speed?: number; // pixels per second
    text?: string;
    showContainer?: boolean; // Whether to show the contained design
    variant?: 'default' | 'contained' | 'minimal';
}

const defaultCompanies: Company[] = [
    { name: "Client 1", logo: "" },
    { name: "Client 2", logo: "" },
    { name: "Client 3", logo: "" },
    { name: "Client 4", logo: "" },
    { name: "Client 5", logo: "" },
    { name: "Client 6", logo: "" }
];

export default function CompaniesCarouselV2({ 
    companies = defaultCompanies, 
    userRegion, 
    speed = 50, 
    text,
    showContainer = true,
    variant = 'contained'
}: CompaniesCarouselV2Props) {
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter companies based on user region
    const getFilteredCompanies = () => {
        if (!companies || companies.length === 0) {
            return defaultCompanies;
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
    console.log('🔍 CompaniesCarouselV2 Debug:');
    console.log('  - userRegion:', userRegion);
    console.log('  - companies count:', companies.length);
    console.log('  - display companies count:', displayCompanies.length);
    console.log('  - variant:', variant);

    // Calculate animation duration based on content and speed
    const animationDuration = Math.max(20, 60 - speed);

    const renderCarouselContent = () => (
        <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-12 sm:w-16 md:w-20 lg:w-24 h-full z-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-12 sm:w-16 md:w-20 lg:w-24 h-full z-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>

            <div className="flex">
                <div
                    ref={scrollRef}
                    className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 whitespace-nowrap animate-scroll-v2"
                    style={{
                        animationPlayState: isHovered ? 'paused' : 'running',
                        animationDuration: `${animationDuration}s`
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Triple the companies for completely seamless scrolling */}
                    {[...displayCompanies, ...displayCompanies, ...displayCompanies].map((company, index) => (
                        <div
                            key={`company-v2-${index}`}
                            className="flex items-center justify-center flex-shrink-0 group"
                            style={{ 
                                minWidth: '120px',
                                width: '120px',
                                height: '60px'
                            }}
                        >
                            {company.logo ? (
                                <div className="w-full h-full flex items-center justify-center p-2">
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        width={120}
                                        height={60}
                                        className="max-w-full max-h-full w-auto h-auto object-contain opacity-50 hover:opacity-80 transition-opacity duration-300 group-hover:scale-105 transform transition-transform"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400 font-medium text-sm text-center px-2 opacity-60">
                                        {company.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Contained variant (inspired by Scalizer)
    if (variant === 'contained' && showContainer) {
        return (
            <div className="relative w-full py-8 sm:py-12 lg:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Text */}
                    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                        <h3 
                            className="text-gray-600 text-base sm:text-lg lg:text-xl font-semibold mb-6 sm:mb-8"
                            style={{
                                textRendering: 'optimizeLegibility',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale'
                            }}
                        >
                            {(text && text.trim() !== '') ? text : 'Ils nous ont accordé leur confiance :'}
                        </h3>
                    </div>

                    {/* Contained Carousel Section */}
                    <div className="relative">
                        <div 
                            className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow duration-300"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)'
                            }}
                        >
                            {renderCarouselContent()}
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scroll-v2 {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(calc(-100% / 3));
                      }
                    }
                    
                    .animate-scroll-v2 {
                      animation: scroll-v2 ${animationDuration}s linear infinite;
                    }
                  `
                }} />
            </div>
        );
    }

    // Minimal variant
    if (variant === 'minimal') {
        return (
            <div className="relative w-full py-6 sm:py-8 lg:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Simple text header */}
                    {(text && text.trim() !== '') && (
                        <div className="text-center mb-6 sm:mb-8">
                            <p className="text-gray-500 text-sm sm:text-base font-medium">
                                {text}
                            </p>
                        </div>
                    )}

                    {renderCarouselContent()}
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scroll-v2 {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(calc(-100% / 3));
                      }
                    }
                    
                    .animate-scroll-v2 {
                      animation: scroll-v2 ${animationDuration}s linear infinite;
                    }
                  `
                }} />
            </div>
        );
    }

    // Default variant (similar to original but enhanced)
    return (
        <div className="relative w-full">
            <div className="relative bg-transparent p-4 sm:p-6 lg:p-8 mx-auto max-w-6xl">
                {/* Text above carousel */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <h3
                        className="text-gray-600 text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-4"
                        style={{
                            textRendering: 'optimizeLegibility',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            filter: 'none'
                        }}
                    >
                        {(text && text.trim() !== '') ? text : 'Ils nous ont accordé leur confiance :'}
                    </h3>
                </div>

                {renderCarouselContent()}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-v2 {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(calc(-100% / 3));
                  }
                }
                
                .animate-scroll-v2 {
                  animation: scroll-v2 ${animationDuration}s linear infinite;
                }
              `
            }} />
        </div>
    );
}
