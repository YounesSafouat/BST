"use client"

import React from 'react';

interface CurvedLinesBackgroundProps {
     children: React.ReactNode;
     className?: string;
}

const CurvedLinesBackground: React.FC<CurvedLinesBackgroundProps> = ({ children, className = "" }) => {
     return (
          <div className={`relative ${className}`}>
               <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                    <style jsx>{`
                         .section-bg {
                              position: relative;
                              background: transparent;
                         }
                         .section-bg__ui {
                              position: absolute;
                              top: 0;
                              left: 0;
                              right: 0;
                              bottom: 0;
                              background: linear-gradient(135deg, 
                                   rgba(14, 165, 233, 0.08) 0%, 
                                   rgba(30, 41, 59, 0.05) 25%, 
                                   rgba(14, 165, 233, 0.06) 50%, 
                                   rgba(30, 41, 59, 0.04) 75%, 
                                   rgba(14, 165, 233, 0.05) 100%);
                              z-index: 1;
                         }
                         .section-bg__media {
                              position: absolute;
                              top: 0;
                              left: 0;
                              right: 0;
                              bottom: 0;
                              z-index: 0;
                         }
                         .section-bg__img {
                              background-size: cover;
                              background-position: center;
                              background-repeat: no-repeat;
                         }
                    `}</style>
                    
                    <div className="section-bg section-bg--light">
                         <div className="section-bg__ui"></div>
                         <div className="section-bg__media section-bg__media--lg section-bg__img" 
                              style={{
                                   backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJzb2Z0Qmx1ZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRjBGOUZGO3N0b3Atb3BhY2l0eTowIiAvPgo8c3RvcCBvZmZzZXQ9IjMwJSIgc3R5bGU9InN0b3AtY29sb3I6I0JBRTZGRjtzdG9wLW9wYWNpdHk6MC42IiAvPgo8c3RvcCBvZmZzZXQ9IjcwJSIgc3R5bGU9InN0b3AtY29sb3I6IzdERDNGQztzdG9wLW9wYWNpdHk6MC41IiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGMEY5RkY7c3RvcC1vcGFjaXR5OjAiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0ibGlnaHRQdXJwbGUiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0YzRThGRjtzdG9wLW9wYWNpdHk6MCIgLz4KPHN0b3Agb2Zmc2V0PSIzMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNFOUQ1RkY7c3RvcC1vcGFjaXR5OjAuNSIgLz4KPHN0b3Agb2Zmc2V0PSI3MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNERERGRkU7c3RvcC1vcGFjaXR5OjAuNCIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRjNFOEZGO3N0b3Atb3BhY2l0eTowIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjwhLS0gVG9wIHJpZ2h0IGZsb3dpbmcgbGluZXMgLSBMaWdodCBibHVlIC0tPgo8cGF0aCBkPSJNMTIwMCw1MCBRMTQwMCwxNTAgMTYwMCwxMDAgUTE4MDAsNTAgMjAwMCwxMjAiIHN0cm9rZT0idXJsKCNzb2Z0Qmx1ZSkiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMTAwLDgwIFEzMDAsMTgwIDE1MDAsMTMwIDE3MDAsODAgMTkwMCwxNTAiIHN0cm9rZT0idXJsKCNzb2Z0Qmx1ZSkiIHN0cm9rZS13aWR0aD0iMS44IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTEwMDAsMTEwIDEyMDAsMjEwIDE0MDAsMTYwIDE2MDAsMTEwIDE4MDAsMTgwIiBzdHJva2U9InVybCgjc29mdEJsdWUpIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjwhLS0gUmlnaHQgc2lkZSBmbG93aW5nIGxpbmVzIC0gTGlnaHQgcHVycGxlIC0tPgo8cGF0aCBkPSJNMTQwMCwyMDAgMTYwMCwzMDAgMTgwMCwyNTAgMjAwMCwyMDAgMjIwMCwyNzAiIHN0cm9rZT0idXJsKCNsaWdodFB1cnBsZSkiIHN0cm9rZS13aWR0aD0iMi4yIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTEzMDAsMjUwIDE1MDAsMzUwIDE3MDAsMzAwIDE5MDAsMjUwIDIxMDAsMzIwIiBzdHJva2U9InVybCgjbGlnaHRQdXJwbGUpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTIwMCwzMDAgMTQwMCw0MDAgMTYwMCwzNTAgMTgwMCwzMDAgMjAwMCwzNzAiIHN0cm9rZT0idXJsKCNsaWdodFB1cnBsZSkiIHN0cm9rZS13aWR0aD0iMS44IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+)',
                                   opacity: '0.8'
                              }}>
                         </div>
                    </div>
               </div>
               
               {/* Content Layer */}
               <div className="relative" style={{ zIndex: 2 }}>
                    {children}
               </div>
          </div>
     );
};

export default CurvedLinesBackground;