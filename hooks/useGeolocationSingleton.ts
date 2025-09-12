import { useState, useEffect } from 'react';
import { geolocationService, GeolocationState } from '@/lib/geolocation-singleton';

export function useGeolocationSingleton(): GeolocationState {
  const [state, setState] = useState<GeolocationState>(geolocationService.getState());

  useEffect(() => {
    // Subscribe to geolocation service updates
    const unsubscribe = geolocationService.subscribe((newState) => {
      setState(newState);
    });

    // Only trigger detection if we don't have any data (not even cached)
    // The geolocation service will handle checking localStorage internally
    if (!state.data && !state.loading && !state.isFromCache) {
      geolocationService.detectLocation();
    }

    return unsubscribe;
  }, []); // Empty dependency array - only run once

  return state;
}
