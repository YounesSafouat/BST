/**
 * Simple SVG Background Test - Debug version
 */

"use client"

import React from 'react';

interface SimpleSVGBackgroundProps {
     children: React.ReactNode;
     className?: string;
     opacity?: number;
}

const SimpleSVGBackground: React.FC<SimpleSVGBackgroundProps> = ({ 
     children, 
     className = "",
     opacity = 0.3
}) => {
     return (
          <div className={`relative ${className}`}>
               {/* Simple SVG Background - Debug Version */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -10,
                         backgroundImage: 'url("/Baniere BST.svg")',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                         opacity: opacity,
                         backgroundColor: 'rgba(255, 0, 0, 0.3)' // More visible red tint
                    }}
               />
               
               {/* Debug Info */}
               <div 
                    className="fixed top-4 left-4 pointer-events-none"
                    style={{ 
                         zIndex: 1000,
                         backgroundColor: 'rgba(0, 0, 0, 0.8)',
                         color: 'white',
                         padding: '8px',
                         borderRadius: '4px',
                         fontSize: '12px'
                    }}
               >
                    SVG Background Test<br/>
                    Opacity: {opacity}<br/>
                    File: /Baniere BST.svg
               </div>
               
               {/* Content Layer */}
               <div className="relative" style={{ zIndex: 1 }}>
                    {children}
               </div>
          </div>
     );
};

export default SimpleSVGBackground;
