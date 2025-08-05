"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Analytics() {
     const pathname = usePathname();

     useEffect(() => {
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