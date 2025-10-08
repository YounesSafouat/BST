/**
 * Hero Banner Background Component
 * Uses the custom Baniere BST.svg for hero section only
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
      {/* Hero Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
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
