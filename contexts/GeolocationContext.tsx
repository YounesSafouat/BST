"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GeolocationData {
     region: 'FR' | 'MA' | 'OTHER';
     country: string;
     countryCode: string;
     city?: string;
     loading: boolean;
     error?: string;
}

interface GeolocationContextType {
     geolocationData: GeolocationData;
     refetch: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
     const [geolocationData, setGeolocationData] = useState<GeolocationData>({
          region: 'OTHER',
          country: '',
          countryCode: '',
          loading: true,
     });

     const [hasAttempted, setHasAttempted] = useState(false);

     const detectRegion = async () => {
          if (hasAttempted) return; // Prevent multiple attempts

          setHasAttempted(true);
          setGeolocationData(prev => ({ ...prev, loading: true }));

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

                    let region: 'FR' | 'MA' | 'OTHER' = 'OTHER';
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

               let region: 'FR' | 'MA' | 'OTHER' = 'OTHER';

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

     const refetch = () => {
          setHasAttempted(false);
          detectRegion();
     };

     useEffect(() => {
          detectRegion();
     }, []);

     return (
          <GeolocationContext.Provider value={{ geolocationData, refetch }}>
               {children}
          </GeolocationContext.Provider>
     );
}

export function useGeolocation() {
     const context = useContext(GeolocationContext);
     if (context === undefined) {
          throw new Error('useGeolocation must be used within a GeolocationProvider');
     }
     return context;
}
