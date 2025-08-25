import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Hook for page view tracking (use only in layout)
export function usePageAnalytics() {
  const pathname = usePathname();
  const hasTrackedThisPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) return;
    
    // Prevent multiple API calls for the same path in this component lifecycle
    if (hasTrackedThisPath.current === pathname) return;
    hasTrackedThisPath.current = pathname;
    
    // Track in database (for dashboard analytics) - only once per path
    fetch('/api/track-page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    });
    
    // Track in session storage (for client-side analytics) - always increment
    const sessionData = JSON.parse(sessionStorage.getItem('pageVisits') || '{}');
    sessionData[pathname] = (sessionData[pathname] || 0) + 1;
    sessionStorage.setItem('pageVisits', JSON.stringify(sessionData));
    
    console.log(`Page visit tracked: ${pathname} (Session: ${sessionData[pathname]}, Total in DB: +1)`);
  }, [pathname]);
}

// Hook for button click tracking (use in components)
export function useButtonAnalytics() {
  const pathname = usePathname();

  const trackButtonClick = (buttonId: string) => {
    if (!pathname || pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) return;
    
    // Track in database (for dashboard analytics)
    fetch('/api/track-button-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buttonId, path: pathname }),
    });
    
    // Track in session storage (for client-side analytics)
    const sessionData = JSON.parse(sessionStorage.getItem('buttonClicks') || '{}');
    const key = `${buttonId}-${pathname}`;
    sessionData[key] = (sessionData[key] || 0) + 1;
    sessionStorage.setItem('buttonClicks', JSON.stringify(sessionData));
    
    // Track in Google Analytics 4 (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'button_click', {
        'event_category': 'engagement',
        'event_label': buttonId,
        'button_id': buttonId,
        'page_path': pathname,
        'button_text': getButtonText(buttonId)
      });
    }
    
    console.log(`Button click tracked: ${buttonId} on ${pathname} (Session: ${sessionData[key]}, Total in DB: +1, GA: +1)`);
  };

  // Helper function to get button text for better GA reporting
  const getButtonText = (buttonId: string): string => {
    const buttonTextMap: { [key: string]: string } = {
      'bottom-nav-phone': 'Phone Call',
      'bottom-nav-whatsapp': 'WhatsApp',
      'bottom-nav-blog': 'Blog',
      'bottom-nav-cas-client': 'CAS Client',
      'mobile_header_rdv_button': 'Prendre RDV',
      'header_phone_button': 'Phone Call',
      'header_whatsapp_button': 'WhatsApp',
      'header_rdv_button': 'Prendre RDV',
      'footer_contact_button': 'Contact',
      'hero_cta_button': 'Hero CTA',
      'pricing_cta_button': 'Pricing CTA',
      'contact_form_submit': 'Contact Form Submit'
    };
    
    return buttonTextMap[buttonId] || buttonId;
  };

  return { trackButtonClick };
}

// Legacy hook for backward compatibility
export function useAnalytics() {
  usePageAnalytics();
  return useButtonAnalytics();
}

// Helper function to get session analytics
export function getSessionAnalytics() {
  const pageVisits = JSON.parse(sessionStorage.getItem('pageVisits') || '{}');
  const buttonClicks = JSON.parse(sessionStorage.getItem('buttonClicks') || '{}');
  
  return {
    pageVisits,
    buttonClicks,
    totalPageVisits: Object.values(pageVisits).reduce((sum: number, count: any) => sum + count, 0),
    totalButtonClicks: Object.values(buttonClicks).reduce((sum: number, count: any) => sum + count, 0)
  };
} 