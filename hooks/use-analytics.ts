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
    
            // Page visit tracked silently
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
    
    // Track in Google Analytics 4 with readable events
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const buttonInfo = getButtonInfo(buttonId);
      
      (window as any).gtag('event', buttonInfo.eventName, {
        'event_category': buttonInfo.category,
        'event_label': buttonInfo.label,
        'button_name': buttonInfo.displayName,
        'button_type': buttonInfo.type,
        'button_text': buttonInfo.displayName,
        'page_path': pathname,
        'page_title': document.title,
        'user_action': buttonInfo.userAction
      });
    }
    
            // Button click tracked silently
  };

  // Helper function to get button info for better GA reporting
  const getButtonInfo = (buttonId: string) => {
    const buttonInfoMap: { [key: string]: any } = {
      // Bottom navigation
      'bottom-nav-phone': {
        eventName: 'phone_button_click',
        category: 'Contact Actions',
        label: 'Phone Button',
        displayName: 'Phone Call',
        type: 'phone',
        userAction: 'clicked_phone'
      },
      'bottom-nav-whatsapp': {
        eventName: 'whatsapp_button_click',
        category: 'Contact Actions',
        label: 'WhatsApp Button',
        displayName: 'WhatsApp',
        type: 'whatsapp',
        userAction: 'clicked_whatsapp'
      },
      'bottom-nav-blog': {
        eventName: 'blog_button_click',
        category: 'Navigation Actions',
        label: 'Blog Button',
        displayName: 'Blog',
        type: 'navigation',
        userAction: 'clicked_blog'
      },
      'bottom-nav-cas-client': {
        eventName: 'cas_client_button_click',
        category: 'Navigation Actions',
        label: 'CAS Client Button',
        displayName: 'CAS Client',
        type: 'navigation',
        userAction: 'clicked_cas_client'
      },
      // Mobile header
      'mobile_header_rdv_button': {
        eventName: 'meeting_button_click',
        category: 'Contact Actions',
        label: 'Meeting Button',
        displayName: 'Prendre RDV',
        type: 'meeting',
        userAction: 'clicked_meeting'
      },
      // Header
      'header_phone_button': {
        eventName: 'phone_button_click',
        category: 'Contact Actions',
        label: 'Phone Button',
        displayName: 'Phone Call',
        type: 'phone',
        userAction: 'clicked_phone'
      },
      'header_whatsapp_button': {
        eventName: 'whatsapp_button_click',
        category: 'Contact Actions',
        label: 'WhatsApp Button',
        displayName: 'WhatsApp',
        type: 'whatsapp',
        userAction: 'clicked_whatsapp'
      },
      'header_rdv_button': {
        eventName: 'meeting_button_click',
        category: 'Contact Actions',
        label: 'Meeting Button',
        displayName: 'Prendre RDV',
        type: 'meeting',
        userAction: 'clicked_meeting'
      },
      // Footer
      'footer_contact_button': {
        eventName: 'contact_button_click',
        category: 'Contact Actions',
        label: 'Contact Button',
        displayName: 'Contact',
        type: 'contact',
        userAction: 'clicked_contact'
      },
      // Other buttons
      'hero_cta_button': {
        eventName: 'hero_cta_button_click',
        category: 'Conversion Actions',
        label: 'Hero CTA Button',
        displayName: 'Hero CTA',
        type: 'cta',
        userAction: 'clicked_hero_cta'
      },
      'pricing_cta_button': {
        eventName: 'pricing_cta_button_click',
        category: 'Conversion Actions',
        label: 'Pricing CTA Button',
        displayName: 'Pricing CTA',
        type: 'cta',
        userAction: 'clicked_pricing_cta'
      },
      'contact_form_submit': {
        eventName: 'contact_form_submit',
        category: 'Form Actions',
        label: 'Contact Form Submit',
        displayName: 'Contact Form',
        type: 'form',
        userAction: 'submitted_contact_form'
      }
    };
    
    return buttonInfoMap[buttonId] || {
      eventName: 'button_click',
      category: 'Other Actions',
      label: buttonId,
      displayName: buttonId,
      type: 'other',
      userAction: 'clicked_button'
    };
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