/**
 * Ultra Aggressive Background - Impossible to Miss
 */

"use client"

import React from 'react';

interface AggressiveBackgroundProps {
     children: React.ReactNode;
     className?: string;
}

const AggressiveBackground: React.FC<AggressiveBackgroundProps> = ({ 
     children, 
     className = ""
}) => {
     return (
          <div className={`relative ${className}`}>
               {/* Ultra Aggressive Background - Multiple Layers */}
               
               {/* Layer 1 - Base Gradient */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -10,
                         background: 'linear-gradient(45deg, #0ea5e9, #1e293b, #0ea5e9, #1e293b)',
                         opacity: 0.8
                    }}
               />
               
               {/* Layer 2 - Overlay Pattern */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -9,
                         background: `
                              repeating-linear-gradient(
                                   45deg,
                                   transparent,
                                   transparent 10px,
                                   rgba(14, 165, 233, 0.3) 10px,
                                   rgba(14, 165, 233, 0.3) 20px
                              )
                         `
                    }}
               />
               
               {/* Layer 3 - Radial Gradients */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -8,
                         background: `
                              radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.4) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 70%)
                         `
                    }}
               />
               
               {/* Layer 4 - Diagonal Stripes */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -7,
                         background: `
                              repeating-linear-gradient(
                                   -45deg,
                                   rgba(14, 165, 233, 0.2),
                                   rgba(14, 165, 233, 0.2) 30px,
                                   rgba(30, 41, 59, 0.2) 30px,
                                   rgba(30, 41, 59, 0.2) 60px
                              )
                         `
                    }}
               />
               
               {/* Content Layer */}
               <div className="relative" style={{ zIndex: 10 }}>
                    {children}
               </div>
          </div>
     );
};

export default AggressiveBackground;
