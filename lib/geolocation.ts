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
    // Use a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    
    console.log('Geolocation data received:', data); // Debug log
    
    return {
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
    };
  } catch (error) {
    console.error('Error fetching user location:', error);
    
    // Fallback: Try alternative geolocation service
    try {
      const fallbackResponse = await fetch('https://ipapi.com/ip_api.php?ip=');
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback geolocation data:', fallbackData);
        
        return {
          country: fallbackData.country_name,
          countryCode: fallbackData.country_code,
          region: fallbackData.region,
          city: fallbackData.city,
          timezone: fallbackData.timezone,
        };
      }
    } catch (fallbackError) {
      console.error('Fallback geolocation also failed:', fallbackError);
    }
    
    return null;
  }
}

export function getRegionFromCountry(countryCode: string): Region {
  const countryCodeUpper = countryCode.toUpperCase();
  
  console.log('Detecting region for country code:', countryCodeUpper); // Debug log
  
  // Manual override for testing - you can temporarily set this to 'MA' to test Morocco
  const manualOverride = 'MA'; // Uncomment this line and set to 'MA' to test Morocco
  if (manualOverride) {
    console.log('Manual override detected, using Morocco');
    return 'morocco';
  }
  
  if (countryCodeUpper === 'FR') {
    console.log('Region detected: France');
    return 'france';
  } else if (countryCodeUpper === 'MA') {
    console.log('Region detected: Morocco');
    return 'morocco';
  } else {
    console.log('Region detected: International (country code:', countryCodeUpper, ')');
    return 'international';
  }
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