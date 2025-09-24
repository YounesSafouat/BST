"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Analytics() {
     const pathname = usePathname();

     useEffect(() => {
          // Track page view with traffic source data
          trackPageView();
          
          // Google Analytics 4
          if (typeof window !== 'undefined' && window.gtag) {
               window.gtag('config', 'GA_MEASUREMENT_ID', {
                    page_path: pathname,
                    custom_map: {
                         'custom_parameter_1': 'page_type',
                         'custom_parameter_2': 'user_region'
                    }
               });
          }

          // Google Tag Manager
          if (typeof window !== 'undefined' && window.dataLayer) {
               window.dataLayer.push({
                    event: 'page_view',
                    page_path: pathname,
                    page_title: document.title,
                    page_location: window.location.href
               });
          }

          // Facebook Pixel
          if (typeof window !== 'undefined' && window.fbq) {
               window.fbq('track', 'PageView');
          }

          // LinkedIn Insight Tag
          if (typeof window !== 'undefined' && window.lintrk) {
               window.lintrk('track', { conversion_id: 'YOUR_LINKEDIN_ID' });
          }
     }, [pathname]);

     const trackPageView = async () => {
          if (typeof window === 'undefined') return;
          
          try {
               // Get device and browser information
               const userAgent = navigator.userAgent;
               const device = getDeviceType();
               const browser = getBrowserName();
               const os = getOperatingSystem();
               
               // Get referrer
               const referrer = document.referrer || undefined;
               
               // Get current URL with UTM parameters
               const currentUrl = window.location.href;
               
               // Prepare tracking data
               const trackingData = {
                    path: pathname,
                    page: document.title,
                    userAgent,
                    referrer,
                    device,
                    browser,
                    os,
                    // Additional data will be captured by the API
                    url: currentUrl
               };
               
               // Send to our tracking API
               const response = await fetch('/api/track-page-view', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trackingData)
               });
               
               if (response.ok) {
                    const result = await response.json();
                    console.log('Page view tracked:', result);
               }
          } catch (error) {
               console.error('Error tracking page view:', error);
          }
     };

     const getDeviceType = (): string => {
          const userAgent = navigator.userAgent;
          if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
               return 'tablet';
          }
          if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
               return 'mobile';
          }
          return 'desktop';
     };

     const getBrowserName = (): string => {
          const userAgent = navigator.userAgent;
          if (userAgent.includes('Chrome')) return 'Chrome';
          if (userAgent.includes('Firefox')) return 'Firefox';
          if (userAgent.includes('Safari')) return 'Safari';
          if (userAgent.includes('Edge')) return 'Edge';
          if (userAgent.includes('Opera')) return 'Opera';
          return 'Unknown';
     };

     const getOperatingSystem = (): string => {
          const userAgent = navigator.userAgent;
          if (userAgent.includes('Windows')) return 'Windows';
          if (userAgent.includes('Mac')) return 'macOS';
          if (userAgent.includes('Linux')) return 'Linux';
          if (userAgent.includes('Android')) return 'Android';
          if (userAgent.includes('iOS')) return 'iOS';
          return 'Unknown';
     };

     return null;
}

// Déclaration des types pour TypeScript
declare global {
     interface Window {
          gtag: (...args: any[]) => void;
          dataLayer: any[];
          fbq: (...args: any[]) => void;
          lintrk: (...args: any[]) => void;
     }
} 