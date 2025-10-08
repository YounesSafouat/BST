/**
 * Ultra Simple Background Effect - Guaranteed to be visible
 */

"use client"

import React from 'react';

interface SimpleBackgroundProps {
     children: React.ReactNode;
     className?: string;
}

const SimpleBackground: React.FC<SimpleBackgroundProps> = ({ 
     children, 
     className = ""
}) => {
     return (
          <div className={`relative ${className}`}>
               {/* Ultra Simple Background - Direct CSS */}
               <div 
                    className="fixed inset-0 pointer-events-none"
                    style={{ 
                         zIndex: -1,
                         background: `
                              linear-gradient(135deg, 
                                   rgba(14, 165, 233, 0.3) 0%, 
                                   rgba(30, 41, 59, 0.2) 25%, 
                                   rgba(14, 165, 233, 0.4) 50%, 
                                   rgba(30, 41, 59, 0.3) 75%, 
                                   rgba(14, 165, 233, 0.2) 100%
                              ),
                              url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%230ea5e9' stroke-width='1' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")
                         `
                    }}
               />
               
               {/* Content Layer */}
               <div className="relative" style={{ zIndex: 1 }}>
                    {children}
               </div>
          </div>
     );
};

export default SimpleBackground;
