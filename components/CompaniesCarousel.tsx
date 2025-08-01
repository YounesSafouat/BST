"use client";

import React from 'react';
import Image from 'next/image';

// Default companies data (fallback)
const defaultCompanies = [
     { name: "FitnessPark", logo: "/ref/fitnespark-vectorized-white-3.svg" },
     { name: "IDC Pharma", logo: "/ref/idc_pharma-horizontal-white-vector.svg" },
     { name: "Yamaha Motors", logo: "/ref/yamaha_motors-horizontal-white-vector.svg" },
     { name: "Malt", logo: "/ref/malt-horizontal-white-vector.svg" },
     { name: "Optisam", logo: "/ref/optisam-horizontal-white-vector.svg" },
     { name: "Essem", logo: "/ref/essem-1-2.svg" },
     { name: "Jeanne d'Arc", logo: "/ref/jeannedarc-vectorized.svg" },
     { name: "Allisone", logo: "/ref/allisone-vectorized-white.svg" },
     { name: "Aicrafters", logo: "/ref/aicrafters-vectorized-white.svg" },
     { name: "Barthener", logo: "/ref/barthener-vectorized-white.svg" },
     { name: "Beks", logo: "/ref/beks-vectorized-white.svg" },
     { name: "Call Center Group", logo: "/ref/callcenter_group-vectorized-white.svg" },
     { name: "Chabi Chic", logo: "/ref/chabi-chic-vectorized-white.svg" },
     { name: "ICAT", logo: "/ref/icat-vectorized-white.svg" },
     { name: "Titre Français", logo: "/ref/titre-francais-vectorized-white.svg" },
];

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

export default function CompaniesCarousel({ companies = defaultCompanies, speed = 1, text }: CompaniesCarouselProps) {
     console.log("CompaniesCarousel text prop:", text); // Debug log
     
     // Default text if none provided
     const displayText = text || "+112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne.";
     
     return (
          <div className="relative overflow-hidden py-4 w-full">
               {/* Text above carousel */}
               {displayText && displayText.trim() !== '' && (
                    <div className="text-center mb-6">
                         <p className="text-gray-600 text-lg font-medium">{displayText}</p>
                    </div>
               )}
               <div className="absolute left-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-r from-white to-transparent"></div>
               <div className="absolute right-0 top-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full z-10 bg-gradient-to-l from-white to-transparent"></div>

               <div className="flex animate-scroll" style={{ animation: `scroll ${speed}s linear infinite`, width: `${companies.length * 374}px` }}>
                    {/* First set */}
                    <div className="flex space-x-8 sm:space-x-12 md:space-x-16 whitespace-nowrap flex-shrink-0" style={{ width: `${companies.length * 187}px` }}>
                         {companies.map((company, index) => (
                              <div key={`first-${index}`} className="flex items-center justify-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] h-10 sm:h-12 w-[80px] sm:w-[100px] md:w-[120px] flex-shrink-0">
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
                              <div key={`second-${index}`} className="flex items-center justify-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] h-10 sm:h-12 w-[80px] sm:w-[100px] md:w-[120px] flex-shrink-0">
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