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
}

export default function CompaniesCarousel({ companies = defaultCompanies, speed = 20 }: CompaniesCarouselProps) {
     return (
          <div className="relative overflow-hidden">
               <div className="absolute left-0 top-0 w-20 h-full z-10 bg-gradient-to-r from-white to-transparent"></div>
               <div className="absolute right-0 top-0 w-20 h-full z-10 bg-gradient-to-l from-white to-transparent"></div>

               <div className="flex animate-scroll">
                    <div className="flex space-x-16 whitespace-nowrap">
                         {/* First set */}
                         {companies.map((company, index) => (
                              <div key={`first-${index}`} className="flex items-center justify-center min-w-[120px] h-12">
                                   {company.logo ? (
                                        <Image
                                             src={company.logo}
                                             alt={company.name}
                                             width={120}
                                             height={40}
                                             className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                                        />
                                   ) : (
                                        <span className="text-gray-400 font-semibold text-sm">{company.name}</span>
                                   )}
                              </div>
                         ))}

                         {/* Duplicate for seamless loop */}
                         {companies.map((company, index) => (
                              <div key={`second-${index}`} className="flex items-center justify-center min-w-[120px] h-12">
                                   {company.logo ? (
                                        <Image
                                             src={company.logo}
                                             alt={company.name}
                                             width={120}
                                             height={40}
                                             className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                                        />
                                   ) : (
                                        <span className="text-gray-400 font-semibold text-sm">{company.name}</span>
                                   )}
                              </div>
                         ))}

                         {/* Third set for extra seamless loop */}
                         {companies.map((company, index) => (
                              <div key={`third-${index}`} className="flex items-center justify-center min-w-[120px] h-12">
                                   {company.logo ? (
                                        <Image
                                             src={company.logo}
                                             alt={company.name}
                                             width={120}
                                             height={40}
                                             className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                                        />
                                   ) : (
                                        <span className="text-gray-400 font-semibold text-sm">{company.name}</span>
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
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll ${speed}s linear infinite;
        }

        /* Removed the hover pause - now it keeps running on hover */
      `}</style>
          </div>
     );
} 