"use client"

import { useEffect } from 'react'

export default function PerformanceMonitor() {
     useEffect(() => {
          let lcpObserver: PerformanceObserver | null = null;
          let fidObserver: PerformanceObserver | null = null;
          let clsObserver: PerformanceObserver | null = null;
          let resourceObserver: PerformanceObserver | null = null;

          // Monitor Core Web Vitals
          if ('PerformanceObserver' in window) {
               try {
                    // Largest Contentful Paint (LCP)
                    lcpObserver = new PerformanceObserver((list) => {
                         const entries = list.getEntries()
                         const lastEntry = entries[entries.length - 1]
                         console.log('🚀 LCP:', lastEntry.startTime.toFixed(2) + 'ms')

                         // Send to analytics if needed
                         if (lastEntry.startTime < 2500) {
                              console.log('✅ LCP is excellent (< 2.5s)')
                         } else if (lastEntry.startTime < 4000) {
                              console.log('⚠️ LCP needs improvement (< 4s)')
                         } else {
                              console.log('❌ LCP is poor (> 4s)')
                         }
                    })
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

                    // First Input Delay (FID)
                    fidObserver = new PerformanceObserver((list) => {
                         const entries = list.getEntries()
                         entries.forEach((entry: any) => {
                              // Use proper typing for first-input entries
                              const fidEntry = entry as PerformanceEntry & { processingStart?: number }
                              if (fidEntry.processingStart !== undefined) {
                                   console.log('⚡ FID:', fidEntry.processingStart - fidEntry.startTime + 'ms')

                                   if (fidEntry.processingStart - fidEntry.startTime < 100) {
                                        console.log('✅ FID is excellent (< 100ms)')
                                   } else if (fidEntry.processingStart - fidEntry.startTime < 300) {
                                        console.log('⚠️ FID needs improvement (< 300ms)')
                                   } else {
                                        console.log('❌ FID is poor (> 300ms)')
                                   }
                              }
                         })
                    })
                    fidObserver.observe({ entryTypes: ['first-input'] })

                    // Cumulative Layout Shift (CLS)
                    clsObserver = new PerformanceObserver((list) => {
                         let clsValue = 0
                         const entries = list.getEntries()
                         entries.forEach((entry: any) => {
                              if (!entry.hadRecentInput) {
                                   clsValue += entry.value
                              }
                         })
                         console.log('📐 CLS:', clsValue.toFixed(3))

                         if (clsValue < 0.1) {
                              console.log('✅ CLS is excellent (< 0.1)')
                         } else if (clsValue < 0.25) {
                              console.log('⚠️ CLS needs improvement (< 0.25)')
                         } else {
                              console.log('❌ CLS is poor (> 0.25)')
                         }
                    })
                    clsObserver.observe({ entryTypes: ['layout-shift'] })
               } catch (error) {
                    console.log('Performance monitoring not supported:', error)
               }
          }

          // Monitor page load time
          window.addEventListener('load', () => {
               const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
               if (navigation) {
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart
                    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
                    const firstPaint = performance.getEntriesByName('first-paint')[0] as PerformanceEntry
                    const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry

                    console.log('📊 Performance Metrics:')
                    console.log(`   Page Load: ${loadTime.toFixed(2)}ms`)
                    console.log(`   DOM Ready: ${domContentLoaded.toFixed(2)}ms`)
                    if (firstPaint) console.log(`   First Paint: ${firstPaint.startTime.toFixed(2)}ms`)
                    if (firstContentfulPaint) console.log(`   First Contentful Paint: ${firstContentfulPaint.startTime.toFixed(2)}ms`)
               }
          })

          // Monitor resource loading
          if ('PerformanceObserver' in window) {
               resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                         if (entry.entryType === 'resource') {
                              const resourceEntry = entry as PerformanceResourceTiming
                              if (resourceEntry.duration > 1000) {
                                   console.log(`🐌 Slow resource: ${resourceEntry.name} (${resourceEntry.duration.toFixed(2)}ms)`)
                              }
                         }
                    })
               })
               resourceObserver.observe({ entryTypes: ['resource'] })
          }

          return () => {
               lcpObserver?.disconnect()
               fidObserver?.disconnect()
               clsObserver?.disconnect()
               resourceObserver?.disconnect()
          }
     }, [])

     return null // This component doesn't render anything
}
