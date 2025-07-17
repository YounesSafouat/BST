"use client";

import React from 'react';
import Image from 'next/image';

const companies = [
     { name: "Odoo", logo: "/Odoo.svg" },
     { name: "HubSpot", logo: "/hubspot.svg" },
     { name: "Microsoft", logo: "/logos/WQ.svg" },
     { name: "Salesforce", logo: "/logos/Hubspot-fav.svg" },
     { name: "Adobe", logo: "/logos/WQ.svg" },
     { name: "Oracle", logo: "/logos/Hubspot-fav.svg" },
     { name: "SAP", logo: "/logos/WQ.svg" },
     { name: "NetSuite", logo: "/logos/Hubspot-fav.svg" },
];

export default function CompaniesCarousel() {
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
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
          </div>
     );
} 