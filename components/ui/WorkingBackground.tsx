/**
 * Working Background Effect - CSS Only, Guaranteed to Work
 */

"use client"

import React from 'react';

interface WorkingBackgroundProps {
     children: React.ReactNode;
     className?: string;
}

const WorkingBackground: React.FC<WorkingBackgroundProps> = ({ 
     children, 
     className = ""
}) => {
     return (
          <div className={`relative ${className}`}>
               {/* Working Background - Pure CSS */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -1,
                         background: `
                              linear-gradient(135deg, 
                                   rgba(14, 165, 233, 0.4) 0%, 
                                   rgba(30, 41, 59, 0.3) 25%, 
                                   rgba(14, 165, 233, 0.5) 50%, 
                                   rgba(30, 41, 59, 0.4) 75%, 
                                   rgba(14, 165, 233, 0.3) 100%
                              )
                         `,
                         backgroundImage: `
                              radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(30, 41, 59, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)
                         `
                    }}
               />
               
               {/* Additional Pattern Overlay */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -1,
                         backgroundImage: `
                              linear-gradient(45deg, rgba(14, 165, 233, 0.1) 25%, transparent 25%),
                              linear-gradient(-45deg, rgba(30, 41, 59, 0.1) 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, rgba(14, 165, 233, 0.1) 75%),
                              linear-gradient(-45deg, transparent 75%, rgba(30, 41, 59, 0.1) 75%)
                         `,
                         backgroundSize: '60px 60px',
                         backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
                    }}
               />
               
               {/* Content Layer */}
               <div className="relative" style={{ zIndex: 1 }}>
                    {children}
               </div>
          </div>
     );
};

export default WorkingBackground;
