import React from 'react';
import CurvedLinesBackground from '@/components/ui/CurvedLinesBackground';

export default function TestBackgroundPage() {
     return (
          <CurvedLinesBackground>
               <div style={{ 
                    minHeight: '100vh', 
                    padding: '20px',
                    backgroundColor: 'transparent'
               }}>
                    <h1 style={{ 
                         color: 'black', 
                         fontSize: '32px', 
                         textAlign: 'center',
                         marginTop: '50px'
                    }}>
                         Background Test Page
                    </h1>
                    
               </div>
          </CurvedLinesBackground>
     );
}
