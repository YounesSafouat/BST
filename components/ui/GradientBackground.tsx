"use client"

import { useEffect, useRef } from 'react'

interface GradientBackgroundProps {
     className?: string
     children?: React.ReactNode
}

export default function GradientBackground({ className = "", children }: GradientBackgroundProps) {
     const interactiveRef = useRef<HTMLDivElement>(null)

     useEffect(() => {
          const interactive = interactiveRef.current
          if (!interactive) return

          let curX = 0
          let curY = 0
          let tgX = 0
          let tgY = 0

          function move() {
               curX += (tgX - curX) / 20
               curY += (tgY - curY) / 20
               if (interactive) {
                    interactive.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
               }
               requestAnimationFrame(move)
          }

          const handleMouseMove = (event: MouseEvent) => {
               tgX = event.clientX
               tgY = event.clientY
          }

          window.addEventListener('mousemove', handleMouseMove)
          move()

          return () => {
               window.removeEventListener('mousemove', handleMouseMove)
          }
     }, [])

     return (
          <div className={`relative overflow-hidden ${className}`}>
               {/* SVG filter for gooey effect */}
               <svg className="absolute top-0 left-0 w-0 h-0">
                    <defs>
                         <filter id="goo">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                              <feBlend in="SourceGraphic" in2="goo" />
                         </filter>
                    </defs>
               </svg>

               {/* Gradients container with gooey filter - Light theme */}
               <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                         filter: 'url(#goo) blur(80px)',
                         mixBlendMode: 'multiply'
                    }}
               >
                    {/* Gradient 1 - Light Blue - more visible bubble effect */}
                    <div
                         className="absolute w-[80%] h-[80%] top-[10%] left-[10%] opacity-100"
                         style={{
                              background: 'radial-gradient(circle at center, rgba(135, 206, 250, 0.5) 0, rgba(135, 206, 250, 0) 50%)',
                              animation: 'moveVertical 30s ease infinite'
                         }}
                    />

                    {/* Gradient 2 - Light Purple - more visible bubble effect */}
                    <div
                         className="absolute w-[80%] h-[80%] top-[10%] left-[10%] opacity-100"
                         style={{
                              background: 'radial-gradient(circle at center, rgba(221, 160, 221, 0.4) 0, rgba(221, 160, 221, 0) 50%)',
                              transformOrigin: 'calc(50% - 400px)',
                              animation: 'moveInCircle 20s reverse infinite'
                         }}
                    />

                    {/* Gradient 3 - Light Blue variant - more visible bubble effect */}
                    <div
                         className="absolute w-[80%] h-[80%] top-[30%] left-[-40%] opacity-100"
                         style={{
                              background: 'radial-gradient(circle at center, rgba(100, 220, 255, 0.4) 0, rgba(100, 220, 255, 0) 50%)',
                              transformOrigin: 'calc(50% + 400px)',
                              animation: 'moveInCircle 40s linear infinite'
                         }}
                    />

                    {/* Interactive bubble that follows cursor - more visible */}
                    <div
                         ref={interactiveRef}
                         className="absolute w-full h-full top-[-50%] left-[-50%] opacity-60"
                         style={{
                              background: 'radial-gradient(circle at center, rgba(135, 206, 250, 0.4) 0, rgba(135, 206, 250, 0) 50%)',
                              mixBlendMode: 'multiply'
                         }}
                    />
               </div>

               {/* Content goes here */}
               <div className="relative z-10">
                    {children}
               </div>
          </div>
     )
}
