import { useState, useEffect } from 'react';

export type Region = 'FR' | 'MA' | 'OTHER';

interface GeolocationData {
  region: Region;
  country: string;
  countryCode: string; // Add actual country code
  city?: string;
  loading: boolean;
  error?: string;
}

export function useGeolocation(): GeolocationData {
  const [geolocationData, setGeolocationData] = useState<GeolocationData>({
    region: 'OTHER',
    country: '',
    countryCode: '',
    loading: true,
  });

  useEffect(() => {
    const detectRegion = async () => {
      try {
        console.log('Detecting region...');
        
        // Try multiple geolocation services with retry logic
        let data: any = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts && !data) {
          attempts++;
          try {
            // Try ipinfo.io first (usually more reliable)
            const response = await fetch('https://ipinfo.io/json');
            if (response.ok) {
              data = await response.json();
              console.log('Successfully got data from ipinfo.io:', data);
              break;
            }
          } catch (error) {
            console.log(`Attempt ${attempts}: ipinfo.io failed, trying ipapi.co...`);
          }
          
          if (!data) {
            try {
              // Try ipapi.co as fallback
              const response = await fetch('https://ipapi.co/json/');
              if (response.ok) {
                data = await response.json();
                console.log('Successfully got data from ipapi.co:', data);
                break;
              }
            } catch (error) {
              console.log(`Attempt ${attempts}: ipapi.co failed`);
            }
          }
          
          // Wait before retry (exponential backoff)
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          }
        }
        
        if (!data) {
          throw new Error('All geolocation services failed');
        }
        
        let region: Region = 'OTHER';
        
        // Determine region based on country code
        // ipinfo.io uses 'country', ipapi.co uses 'country_code'
        const countryCode = data.country_code || data.country;
        
        if (countryCode === 'FR') {
          region = 'FR';
        } else if (countryCode === 'MA') {
          region = 'MA';
        }
        
        console.log('Detected region:', region, 'from country code:', countryCode);
        
        setGeolocationData({
          region,
          country: data.country_name || data.country || '',
          countryCode: countryCode || '',
          city: data.city,
          loading: false,
        });
        
        console.log('useGeolocation hook returning:', {
          region,
          country: data.country_name || data.country || '',
          countryCode: countryCode || '',
          city: data.city,
          loading: false,
        });
      } catch (error) {
        console.warn('Geolocation failed, using default region:', error);
        setGeolocationData({
          region: 'OTHER',
          country: '',
          countryCode: '',
          loading: false,
          error: 'Geolocation failed',
        });
      }
    };

    detectRegion();
  }, []);

  return geolocationData;
} 