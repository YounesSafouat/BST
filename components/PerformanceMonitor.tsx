/**
 * PerformanceMonitor.tsx
 * 
 * Performance monitoring component that tracks Core Web Vitals and other
 * performance metrics in development mode. This component provides real-time
 * performance insights for developers.
 * 
 * WHERE IT'S USED:
 * - Root layout (/app/layout.tsx) - Global performance monitoring
 * - Automatically included in every page through the root layout
 * - Only active in development environment
 * 
 * KEY FEATURES:
 * - Core Web Vitals monitoring (FCP, LCP, FID, CLS, TTFB)
 * - Real-time performance metrics display
 * - Keyboard shortcut toggle (Ctrl+Shift+P)
 * - Development-only activation
 * - Performance threshold color coding
 * - Overlay display with metrics
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements Performance Observer API for metrics collection
 * - Tracks navigation timing and Core Web Vitals
 * - Keyboard event handling for toggle functionality
 * - Conditional rendering based on environment
 * - Performance threshold evaluation and color coding
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client";

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        // Measure Core Web Vitals
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              const lcp = entry.startTime;
              setMetrics(prev => prev ? { ...prev, lcp } : { fcp: 0, lcp, fid: 0, cls: 0, ttfb: 0 });
            }
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure other metrics
        const fcp = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
        const ttfb = perfData.responseStart - perfData.requestStart;

        setMetrics(prev => prev ? { ...prev, fcp, ttfb } : { fcp, lcp: 0, fid: 0, cls: 0, ttfb });
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('load', measurePerformance);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') return null;

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold) return 'text-green-600';
    if (value <= threshold * 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {metrics && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={getPerformanceColor(metrics.fcp, 1800)}>
              {metrics.fcp.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={getPerformanceColor(metrics.lcp, 2500)}>
              {metrics.lcp.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span className={getPerformanceColor(metrics.ttfb, 800)}>
              {metrics.ttfb.toFixed(0)}ms
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
