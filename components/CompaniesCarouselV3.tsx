/**
 * CompaniesCarouselV3.tsx
 * 
 * Modern companies carousel component with innovative design patterns.
 * Features a card-based layout with subtle animations, enhanced visual hierarchy,
 * and professional presentation of company partnerships.
 * 
 * WHERE IT'S USED:
 * - Homepage (/components/home/HomePage.tsx) - Client showcase section
 * - About page and other pages that need client display
 * - Company credibility through client partnerships
 * 
 * KEY FEATURES:
 * - Card-based design with subtle shadows and hover effects
 * - Staggered animation entrance for visual appeal
 * - Enhanced logo presentation with background circles
 * - Multiple layout options (grid, carousel, masonry)
 * - Improved typography and spacing hierarchy
 * - Regional filtering support maintained
 * - Configurable themes and color schemes
 * - Advanced responsive behavior
 * 
 * DESIGN CONCEPT V3:
 * - Modern card-based approach
 * - Subtle depth with shadows and layering
 * - Enhanced visual hierarchy
 * - Professional branding presentation
 * - Clean, contemporary aesthetic
 * - Better logo visibility and recognition
 * 
 * @author younes safouat
 * @version 3.0.0
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

interface CompaniesCarouselV3Props {
    companies?: Company[];
    userRegion?: string;
    speed?: number; // pixels per second
    text?: string;
    layout?: 'carousel' | 'grid' | 'masonry';
    theme?: 'light' | 'subtle' | 'modern';
    showCount?: boolean; // Show company count
}

const defaultCompanies: Company[] = [
    { name: "Client 1", logo: "" },
    { name: "Client 2", logo: "" },
    { name: "Client 3", logo: "" },
    { name: "Client 4", logo: "" },
    { name: "Client 5", logo: "" },
    { name: "Client 6", logo: "" },
    { name: "Client 7", logo: "" },
    { name: "Client 8", logo: "" }
];

export default function CompaniesCarouselV3({ 
    companies = defaultCompanies, 
    userRegion, 
    speed = 40, 
    text,
    layout = 'carousel',
    theme = 'modern',
    showCount = true
}: CompaniesCarouselV3Props) {
    const [isHovered, setIsHovered] = useState(false);
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter companies based on user region
    const getFilteredCompanies = () => {
        if (!companies || companies.length === 0) {
            return defaultCompanies;
        }

        if (!userRegion) {
            return companies;
        }

        const filteredCompanies = companies.filter(company => {
            if (!company.regions || company.regions.length === 0) {
                return true;
            }
            return company.regions.includes(userRegion);
        });

        const result = filteredCompanies.length > 0 ? filteredCompanies : companies;
        
        // Ensure we have enough companies for smooth infinite scroll (minimum 6)
        if (result.length < 6) {
            const repeated: Company[] = [];
            while (repeated.length < 6) {
                repeated.push(...result);
            }
            return repeated.slice(0, 8); // Take 8 for good measure
        }
        
        return result;
    };

    const displayCompanies = getFilteredCompanies();

    // Staggered animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            displayCompanies.forEach((_, index) => {
                setTimeout(() => {
                    setVisibleCards(prev => new Set([...prev, index]));
                }, index * 100);
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [displayCompanies]);

    // Theme configurations
    const themes = {
        light: {
            background: 'bg-white',
            cardBg: 'bg-white',
            border: 'border-gray-100',
            shadow: 'shadow-sm hover:shadow-md',
            text: 'text-gray-700'
        },
        subtle: {
            background: 'bg-gray-50/50',
            cardBg: 'bg-white/80',
            border: 'border-gray-200/50',
            shadow: 'shadow-sm hover:shadow-lg',
            text: 'text-gray-600'
        },
        modern: {
            background: 'bg-gradient-to-br from-blue-50/30 to-slate-50/30',
            cardBg: 'bg-white/90 backdrop-blur-sm',
            border: 'border-white/50',
            shadow: 'shadow-md hover:shadow-xl',
            text: 'text-gray-700'
        }
    };

    const currentTheme = themes[theme];
    // Calculate animation duration based on content width and speed (like original)
    const itemWidth = 140; // card width
    const gapWidth = 32; // gap between cards  
    const singleSetWidth = displayCompanies.length * (itemWidth + gapWidth);
    const animationDuration = singleSetWidth / (speed * 10); // Much faster calculation

    // Carousel Layout
    if (layout === 'carousel') {
        return (
            <div className="relative w-full">
                {/* Transparent Background Container - EXACT same as original */}
                <div className="relative bg-transparent p-2 sm:p-6 lg:p-8 mx-auto max-w-6xl">
                    {/* Text above carousel - EXACT same as original */}
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

                    {/* Carousel Container - EXACT same structure as working original */}
                    <div className="relative overflow-hidden h-[150px]">
                        {/* Gradient overlays - EXACT same as original */}
                        <div className="absolute left-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

                        <div className="flex">
                            <div
                                ref={scrollRef}
                                className="flex gap-8 whitespace-nowrap animate-scroll-v3"
                                style={{
                                    animationPlayState: isHovered ? 'paused' : 'running'
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {/* Triple the companies for completely seamless scrolling */}
                                {[...displayCompanies, ...displayCompanies, ...displayCompanies].map((company, index) => (
                                    <div
                                        key={`company-v3-${index}`}
                                        className="flex items-center justify-center w-[120px] h-[80px] flex-shrink-0"
                                    >
                                        {company.logo ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className={`w-full h-full ${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} border rounded-xl p-2 transition-all duration-300 hover:scale-105 hover:border-[var(--color-main)]/20 group flex items-center justify-center relative`}>
                                                    {/* Background circle for logo */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-main)]/5 to-[var(--color-secondary)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <Image
                                                        src={company.logo}
                                                        alt={company.name}
                                                        width={140}
                                                        height={60}
                                                        className="max-w-full max-h-full w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 relative z-10"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className={`w-full h-full ${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} border rounded-xl p-2 transition-all duration-300 hover:scale-105 hover:border-[var(--color-main)]/20 group flex items-center justify-center relative`}>
                                                    <span className="text-gray-400 font-semibold text-sm sm:text-base text-center px-2 relative z-10">{company.name}</span>
                                                </div>
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
                    @keyframes scroll-v3 {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(calc(-100% / 3));
                      }
                    }
                    
                    .animate-scroll-v3 {
                      animation: scroll-v3 20s linear infinite;
                    }
                  `
                }} />
            </div>
        );
    }

    // Grid Layout
    if (layout === 'grid') {
        return (
            <div className={`relative w-full py-8 sm:py-12 lg:py-16 ${currentTheme.background}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-main)] to-transparent flex-1 max-w-16"></div>
                            <div className="w-2 h-2 bg-[var(--color-main)] rounded-full"></div>
                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-main)] to-transparent flex-1 max-w-16"></div>
                        </div>
                        
                        <h3 className={`text-base sm:text-lg font-semibold mb-2 ${currentTheme.text}`}>
                            {(text && text.trim() !== '') ? text : 'Ils nous ont accordé leur confiance'}
                        </h3>
                        
                        {showCount && (
                            <p className="text-sm text-gray-500">
                                {displayCompanies.length} partenaires de confiance
                            </p>
                        )}
                    </div>

                    {/* Grid Container */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                        {displayCompanies.slice(0, 12).map((company, index) => (
                            <div
                                key={`grid-company-${index}`}
                                className={`group ${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} border rounded-xl p-4 transition-all duration-500 hover:scale-105 hover:border-[var(--color-main)]/20 ${
                                    visibleCards.has(index) 
                                        ? 'opacity-100 transform translate-y-0' 
                                        : 'opacity-0 transform translate-y-4'
                                }`}
                                style={{ 
                                    height: '80px',
                                    transitionDelay: `${index * 50}ms`
                                }}
                            >
                                <div className="w-full h-full flex items-center justify-center relative">
                                    {/* Background circle for logo */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-main)]/5 to-[var(--color-secondary)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {company.logo ? (
                                        <Image
                                            src={company.logo}
                                            alt={company.name}
                                            width={100}
                                            height={50}
                                            className="max-w-full max-h-full w-auto h-auto object-contain opacity-60 group-hover:opacity-90 transition-all duration-300 relative z-10"
                                        />
                                    ) : (
                                        <span className="text-gray-400 font-medium text-xs text-center px-2 relative z-10">
                                            {company.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Masonry Layout (default fallback)
    return (
        <div className={`relative w-full py-8 sm:py-12 lg:py-16 ${currentTheme.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-main)] to-transparent flex-1 max-w-16"></div>
                        <div className="w-2 h-2 bg-[var(--color-main)] rounded-full"></div>
                        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-main)] to-transparent flex-1 max-w-16"></div>
                    </div>
                    
                    <h3 className={`text-base sm:text-lg font-semibold mb-2 ${currentTheme.text}`}>
                        {(text && text.trim() !== '') ? text : 'Ils nous ont accordé leur confiance'}
                    </h3>
                    
                    {showCount && (
                        <p className="text-sm text-gray-500">
                            {displayCompanies.length} partenaires de confiance
                        </p>
                    )}
                </div>

                {/* Masonry Container */}
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-4 sm:gap-6">
                    {displayCompanies.slice(0, 12).map((company, index) => (
                        <div
                            key={`masonry-company-${index}`}
                            className={`group ${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.shadow} border rounded-xl p-4 mb-4 sm:mb-6 break-inside-avoid transition-all duration-500 hover:scale-105 hover:border-[var(--color-main)]/20 ${
                                visibleCards.has(index) 
                                    ? 'opacity-100 transform translate-y-0' 
                                    : 'opacity-0 transform translate-y-4'
                            }`}
                            style={{ 
                                height: `${80 + (index % 3) * 10}px`,
                                transitionDelay: `${index * 75}ms`
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center relative">
                                {/* Background circle for logo */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-main)]/5 to-[var(--color-secondary)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {company.logo ? (
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        width={100}
                                        height={50}
                                        className="max-w-full max-h-full w-auto h-auto object-contain opacity-60 group-hover:opacity-90 transition-all duration-300 relative z-10"
                                    />
                                ) : (
                                    <span className="text-gray-400 font-medium text-xs text-center px-2 relative z-10">
                                        {company.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
