export interface GeolocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export type Region = 'france' | 'morocco' | 'international';

export async function getUserLocation(): Promise<GeolocationData | null> {
  try {
    // Detect if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('Device detection - Mobile:', isMobile, 'User Agent:', navigator.userAgent);

    // For mobile devices, try simpler services first
    const mobileServices = [
      'https://ipinfo.io/json',
      'https://ipapi.co/json/',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free'
    ];

    // For desktop, use the full service list
    const desktopServices = [
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free',
      'https://ipapi.com/ip_api.php?ip='
    ];

    const services = isMobile ? mobileServices : desktopServices;

    for (const serviceUrl of services) {
      try {
        console.log('Trying geolocation service:', serviceUrl, 'on mobile:', isMobile);
        
        // Add timeout to prevent hanging requests (shorter timeout for mobile)
        const controller = new AbortController();
        const timeout = isMobile ? 3000 : 5000; // 3 seconds for mobile, 5 for desktop
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(serviceUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': isMobile ? 'Mobile-Browser/1.0' : 'Desktop-Browser/1.0',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          console.log('Geolocation data received from', serviceUrl, ':', data);
          
          // Handle different response formats
          let countryName, countryCode, region, city, timezone;
          
          if (serviceUrl.includes('ipapi.co')) {
            countryName = data.country_name;
            countryCode = data.country_code;
            region = data.region;
            city = data.city;
            timezone = data.timezone;
          } else if (serviceUrl.includes('ipinfo.io')) {
            countryName = data.country;
            countryCode = data.country;
            region = data.region;
            city = data.city;
            timezone = data.timezone;
          } else if (serviceUrl.includes('ipgeolocation.io')) {
            countryName = data.country_name;
            countryCode = data.country_code2;
            region = data.state_prov;
            city = data.city;
            timezone = data.timezone?.name;
          } else if (serviceUrl.includes('ipapi.com')) {
            countryName = data.country_name;
            countryCode = data.country_code;
            region = data.region;
            city = data.city;
            timezone = data.timezone;
          }
          
          if (countryName && countryCode) {
            return {
              country: countryName,
              countryCode: countryCode,
              region: region,
              city: city,
              timezone: timezone,
            };
          }
        }
      } catch (serviceError) {
        console.error('Error with service', serviceUrl, ':', serviceError);
        continue; // Try next service
      }
    }
    
    // If all services fail, try a simple fallback
    try {
      console.log('Trying fallback geolocation service');
      const fallbackResponse = await fetch('https://httpbin.org/ip', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback IP data:', fallbackData);
        // Return a default international response
        return {
          country: 'Unknown',
          countryCode: 'XX',
          region: 'Unknown',
          city: 'Unknown',
          timezone: 'UTC',
        };
      }
    } catch (fallbackError) {
      console.error('Fallback geolocation also failed:', fallbackError);
    }
    
    throw new Error('All geolocation services failed');
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}

export function getRegionFromCountry(countryCode: string): Region {
  const countryCodeUpper = countryCode.toUpperCase();
  
  console.log('Detecting region for country code:', countryCodeUpper); // Debug log
  
  // Morocco detection - handle various possible codes
  if (countryCodeUpper === 'MA' || countryCodeUpper === 'MAR' || countryCodeUpper === 'MOROCCO') {
    console.log('Region detected: Morocco');
    return 'morocco';
  }
  
  // France detection
  if (countryCodeUpper === 'FR' || countryCodeUpper === 'FRA' || countryCodeUpper === 'FRANCE') {
    console.log('Region detected: France');
    return 'france';
  }
  
  // If we get a valid country code but not France or Morocco, it's international
  if (countryCodeUpper && countryCodeUpper.length >= 2 && countryCodeUpper !== 'XX') {
    console.log('Region detected: International (country code:', countryCodeUpper, ')');
    return 'international';
  }
  
  // Fallback to international if no valid country code
  console.log('No valid country code, defaulting to International');
  return 'international';
}

export function getLocalizedPricing(region: Region, basePrice: string): string {
  switch (region) {
    case 'france':
      // Convert to EUR if needed
      return basePrice.replace(/€/g, '€').replace(/EUR/g, '€');
    case 'morocco':
      // Convert to MAD (Moroccan Dirham) - approximate conversion
      const numericPrice = parseFloat(basePrice.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(numericPrice)) {
        const madPrice = Math.round(numericPrice * 11); // Approximate EUR to MAD conversion
        return `${madPrice.toLocaleString()} MAD`;
      }
      return basePrice;
    case 'international':
      // Keep original price or convert to USD
      return basePrice;
    default:
      return basePrice;
  }
}

export function getLocalizedCurrency(region: Region): string {
  switch (region) {
    case 'france':
      return '€';
    case 'morocco':
      return 'MAD';
    case 'international':
      return '€';
    default:
      return '€';
  }
}

export function shouldShowContent(content: any, region: Region): boolean {
  if (!content.targetRegions || content.targetRegions.length === 0) {
    return true; // Show to all if no specific regions defined
  }
  
  return content.targetRegions.includes(region) || content.targetRegions.includes('all');
} 