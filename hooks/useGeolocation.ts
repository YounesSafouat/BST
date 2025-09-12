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
    // Check if we already have data to prevent infinite loops
    if (geolocationData.loading === false) {
      return;
    }

    const detectRegion = async () => {
      try {
        console.log('Detecting region...');
        
        // Try ipapi.co first (better CORS support)
        let data: any = null;
        
        try {
          const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            data = await response.json();
            console.log('Successfully got data from ipapi.co:', data);
          }
        } catch (error) {
          console.log('ipapi.co failed, trying ipinfo.io...');
        }
        
        // Fallback to ipinfo.io if ipapi.co fails
        if (!data) {
          try {
            const response = await fetch('https://ipinfo.io/json', {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (response.ok) {
              data = await response.json();
              console.log('Successfully got data from ipinfo.io:', data);
            }
          } catch (error) {
            console.log('ipinfo.io also failed');
          }
        }
        
        if (!data) {
          // Use a simple fallback - try to detect from timezone
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          console.log('Using timezone fallback:', timezone);
          
          let region: Region = 'OTHER';
          if (timezone.includes('Paris') || timezone.includes('Europe/Paris')) {
            region = 'FR';
          } else if (timezone.includes('Casablanca') || timezone.includes('Africa/Casablanca')) {
            region = 'MA';
          }
          
          setGeolocationData({
            region,
            country: 'Unknown',
            countryCode: 'XX',
            city: 'Unknown',
            loading: false,
            error: 'Using timezone fallback',
          });
          return;
        }
        
        let region: Region = 'OTHER';
        
        // Determine region based on country code
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
  }, []); // Empty dependency array to run only once

  return geolocationData;
} 