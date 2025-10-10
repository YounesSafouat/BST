/**
 * Hero Banner Background Component
 * Uses responsive background images: Baniere-BST-mobile.svg for mobile and Baniere-BST.svg for desktop
 */

"use client"

import React from 'react';

interface HeroBannerBackgroundProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
}

const HeroBannerBackground: React.FC<HeroBannerBackgroundProps> = ({ 
  children, 
  className = "",
  opacity = 0.15
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Mobile Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{ 
          zIndex: -1,
          backgroundImage: 'url("/Baniere-BST-mobile.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: opacity,
        }}
      />
      
      {/* Desktop Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{ 
          zIndex: -1,
          backgroundImage: 'url("/Baniere-BST.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: opacity,
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HeroBannerBackground;
