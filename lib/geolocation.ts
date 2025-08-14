export interface GeolocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export type Region = 'france' | 'morocco' | 'international';

// Cache for geolocation data to avoid repeated API calls
let geolocationCache: { data: GeolocationData; timestamp: number } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getUserLocation(): Promise<GeolocationData | null> {
  try {
    // Check cache first
    if (geolocationCache && (Date.now() - geolocationCache.timestamp) < CACHE_DURATION) {
      console.log('📍 Using cached geolocation data');
      return geolocationCache.data;
    }

    // Try the fastest service first (ipinfo.io is usually fastest)
    const fastService = 'https://ipinfo.io/json';
    
    try {
      console.log('📍 Trying fast geolocation service:', fastService);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      
      const response = await fetch(fastService, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('📍 Geolocation data received from fast service:', data);
        
        const result = {
          country: data.country || 'Unknown',
          countryCode: data.country || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
        };

        // Cache the result
        geolocationCache = { data: result, timestamp: Date.now() };
        return result;
      }
    } catch (fastServiceError) {
      console.log('📍 Fast service failed, trying fallback');
    }

    // Fallback to a single reliable service with short timeout
    try {
      const fallbackService = 'https://ipapi.co/json/';
      console.log('📍 Trying fallback service:', fallbackService);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(fallbackService, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('📍 Geolocation data received from fallback service:', data);
        
        const result = {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
        };

        // Cache the result
        geolocationCache = { data: result, timestamp: Date.now() };
        return result;
      }
    } catch (fallbackError) {
      console.log('📍 Fallback service also failed');
    }

    // Return cached data even if expired, or default to international
    if (geolocationCache) {
      console.log('📍 Using expired cache as fallback');
      return geolocationCache.data;
    }

    // Final fallback
    console.log('📍 Using default international region');
    return {
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC',
    };
  } catch (error) {
    console.error('📍 Error in geolocation:', error);
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