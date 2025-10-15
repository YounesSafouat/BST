/**
 * ClientCard.tsx
 * 
 * Beautiful client card component with hover effects and gradient backgrounds.
 * Same design as used in VideoTestimonialsSection.
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ClientCardProps {
  client: {
    _id: string;
    slug: string;
    name: string;
    summary: string;
    company: {
      name: string;
      logo?: string;
      sector?: string;
      customSector?: string;
    };
    media: {
      cardBackgroundImage?: string;
      coverImage?: string;
      hoverImage?: string; // Second image for hover effect
    };
    metrics?: Array<{
      icon: string;
      text: string;
    }>;
    targetRegions?: string[];
    published?: boolean;
  };
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getSectorColor = (sector: string) => {
    return 'bg-gray-600'; // All badges use the same gray color
  };

  const sector = client.company?.sector === 'Autre' ? client.company?.customSector : client.company?.sector;
  
  return (
    <Link 
      href={`/cas-client/${client.slug}`} 
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-80">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={isHovered && client.media?.hoverImage ? client.media.hoverImage : (client.media?.cardBackgroundImage || client.media?.coverImage || '')}
            alt={client.name}
            fill
            className="object-cover transition-all duration-500"
          />
        </div>
        
        {/* Dark Section - Fixed at bottom, expands upward on hover */}
        <div className={`absolute bottom-0 left-0 right-0 bg-[var(--color-main)] transition-all duration-700 ease-in-out ${
          isHovered ? 'h-5/6 p-6' : 'h-20 p-4'
        } overflow-hidden`}>
          <div className="flex flex-col justify-between h-full">
            {/* Company Logo - Always visible with smooth transition */}
            <div className={`text-center transition-all duration-700 ease-in-out ${
              isHovered ? 'mb-3' : 'mb-0'
            }`}>
              {client.company?.logo ? (
                <div className="flex justify-center items-center h-16">
                  <Image
                    src={client.company.logo}
                    alt={client.company.name}
                    width={160}
                    height={64}
                    className="object-contain filter brightness-0 invert transition-all duration-700 ease-in-out max-h-16"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-16">
                  <h3 className="text-white text-xl font-bold mb-1">{client.name}</h3>
                </div>
              )}
            </div>
            
            {/* Description - Only visible on hover with smooth animation */}
            <div className={`transition-all duration-700 ease-in-out ${
              isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
            } overflow-hidden`}>
              <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-3">
                {client.summary}
              </p>
            </div>
            
            {/* Bottom Row - Only visible on hover with smooth animation */}
            <div className={`transition-all duration-700 ease-in-out ${
              isHovered ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0'
            } overflow-hidden`}>
              <div className="flex items-center justify-between">
                {/* Sector Tag */}
                <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getSectorColor(sector || 'default')}`}>
                  {sector || 'Client'}
                </span>
                
                {/* CTA */}
                <div className="flex items-center gap-1 text-white group-hover:text-[var(--color-secondary)] transition-colors">
                  <span className="text-sm font-medium">Voir le cas</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClientCard;
