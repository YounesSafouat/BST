/**
 * Button Click Tracking Utility
 * Automatically tracks button clicks with UTM parameters
 */

export interface ButtonClickData {
  buttonId: string;
  buttonText: string;
  buttonType: string;
  path: string;
  userAgent: string;
  referrer?: string;
  device: string;
  browser: string;
  os: string;
  url?: string;
}

export async function trackButtonClick(
  buttonId: string,
  buttonText: string,
  buttonType: string = 'button'
): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Get device and browser information
    const userAgent = navigator.userAgent;
    const device = getDeviceType();
    const browser = getBrowserName();
    const os = getOperatingSystem();
    
    // Get referrer
    const referrer = document.referrer || undefined;
    
    // Get current path
    const path = window.location.pathname;
    
    // Prepare tracking data
    const trackingData: ButtonClickData = {
      buttonId,
      buttonText,
      buttonType,
      path,
      userAgent,
      referrer,
      device,
      browser,
      os,
      url: window.location.href // Add current URL with UTM parameters
    };
    
    // Send to our tracking API
    const response = await fetch('/api/track-button-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Button click tracked:', result);
    }
  } catch (error) {
    console.error('Error tracking button click:', error);
  }
}

export function getDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

export function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

export function getOperatingSystem(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

// Auto-track all buttons with data-track attributes
export function initializeButtonTracking(): void {
  if (typeof window === 'undefined') return;
  
  // Track clicks on all buttons with data-track attribute
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Check if it's a button or has data-track attribute
    if (target.tagName === 'BUTTON' || target.hasAttribute('data-track')) {
      const buttonId = target.id || target.getAttribute('data-track') || 'unknown';
      const buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown';
      const buttonType = target.tagName.toLowerCase();
      
      trackButtonClick(buttonId, buttonText, buttonType);
    }
    
    // Check for links with data-track attribute
    if (target.tagName === 'A' && target.hasAttribute('data-track')) {
      const buttonId = target.getAttribute('data-track') || 'unknown';
      const buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown';
      
      trackButtonClick(buttonId, buttonText, 'link');
    }
  });
}
