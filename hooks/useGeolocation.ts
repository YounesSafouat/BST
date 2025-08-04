import { useState, useEffect } from 'react';

export type Region = 'FR' | 'MA' | 'OTHER';

interface GeolocationData {
  region: Region;
  country: string;
  city?: string;
  loading: boolean;
  error?: string;
}

export function useGeolocation(): GeolocationData {
  const [geolocationData, setGeolocationData] = useState<GeolocationData>({
    region: 'OTHER',
    country: '',
    loading: true,
  });

  useEffect(() => {
    const detectRegion = async () => {
      try {
        console.log('Detecting region...');
        // Try to get IP-based geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        console.log('Geolocation API response:', data);
        
        let region: Region = 'OTHER';
        
        // Determine region based on country code
        if (data.country_code === 'FR') {
          region = 'FR';
        } else if (data.country_code === 'MA') {
          region = 'MA';
        }
        
        console.log('Detected region:', region, 'from country code:', data.country_code);
        
        setGeolocationData({
          region,
          country: data.country_name || '',
          city: data.city,
          loading: false,
        });
      } catch (error) {
        console.warn('Geolocation failed, using default region:', error);
        setGeolocationData({
          region: 'OTHER',
          country: '',
          loading: false,
          error: 'Geolocation failed',
        });
      }
    };

    detectRegion();
  }, []);

  return geolocationData;
} 