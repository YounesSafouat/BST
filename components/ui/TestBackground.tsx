import React from 'react';

interface TestBackgroundProps {
     children: React.ReactNode;
     className?: string;
}

const TestBackground: React.FC<TestBackgroundProps> = ({ children, className = "" }) => {
     return (
          <div className={`relative ${className}`} style={{ backgroundColor: 'red !important', minHeight: '100vh' }}>
               <div className="fixed inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(0, 255, 0, 0.8)', zIndex: 9999 }}>
                    <div style={{ 
                         position: 'absolute', 
                         top: '50%', 
                         left: '50%', 
                         transform: 'translate(-50%, -50%)',
                         color: 'white',
                         fontSize: '24px',
                         fontWeight: 'bold',
                         zIndex: 10000
                    }}>
                         TEST BACKGROUND IS WORKING
                    </div>
               </div>
               <div className="relative" style={{ zIndex: 1 }}>
                    {children}
               </div>
          </div>
     );
};

export default TestBackground;
