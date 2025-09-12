import { useState, useEffect } from 'react';
import { geolocationService, GeolocationState } from '@/lib/geolocation-singleton';

export function useGeolocationSingleton(): GeolocationState {
  const [state, setState] = useState<GeolocationState>(geolocationService.getState());

  useEffect(() => {
    // Subscribe to geolocation service updates
    const unsubscribe = geolocationService.subscribe((newState) => {
      setState(newState);
    });

    // If we don't have data yet, trigger detection
    if (!state.data && !state.loading) {
      geolocationService.detectLocation();
    }

    return unsubscribe;
  }, []); // Empty dependency array - only run once

  return state;
}
