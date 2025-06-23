"use client"

import Script from 'next/script'
import { useEffect, useRef } from 'react'

export default function SplineScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create and append the spline-viewer element
    if (containerRef.current) {
      const viewer = document.createElement('spline-viewer')
      viewer.setAttribute('url', 'https://prod.spline.design/9Fe0RhX8y74DbfZg/scene.splinecode')
      viewer.style.width = '100%'
      viewer.style.height = '100%'
      containerRef.current.appendChild(viewer)

      // Cleanup
      return () => {
        if (containerRef.current?.contains(viewer)) {
          containerRef.current.removeChild(viewer)
        }
      }
    }
  }, [])

  return (
    <>
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.10.9/build/spline-viewer.js" 
        strategy="beforeInteractive"
      />
      <div ref={containerRef} className="spline-wrapper">
        <style jsx>{`
          .spline-wrapper {
            position: relative;
            width: 100%;
            height: 100vh;
            background: transparent;
          }

          @media (max-width: 768px) {
            .spline-wrapper {
              height: 50vh;
            }
          }
        `}</style>
      </div>
    </>
  )
} 