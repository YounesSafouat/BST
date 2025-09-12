import { GeolocationData, Region, getRegionFromCountry } from './geolocation';

interface GeolocationState {
  data: GeolocationData | null;
  region: Region;
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
}

class GeolocationService {
  private static instance: GeolocationService;
  private state: GeolocationState = {
    data: null,
    region: 'international',
    loading: false,
    error: null,
    isFromCache: false,
  };
  private subscribers: Set<(state: GeolocationState) => void> = new Set();
  private apiCallPromise: Promise<GeolocationData | null> | null = null;

  private constructor() {
    this.initializeFromCache();
  }

  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  private initializeFromCache() {
    if (typeof window === 'undefined') return;

    try {
      const cached = localStorage.getItem('bst_geolocation_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

        if (now - parsed.timestamp < CACHE_DURATION) {
          this.state = {
            data: parsed.data,
            region: getRegionFromCountry(parsed.data.countryCode),
            loading: false,
            error: null,
            isFromCache: true,
          };
          console.log('📍 Geolocation service initialized from cache');
          this.notifySubscribers();
        }
      }
    } catch (error) {
      console.warn('Failed to initialize from cache:', error);
    }
  }

  public subscribe(callback: (state: GeolocationState) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current state
    callback(this.state);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  public async detectLocation(): Promise<void> {
    // If already loading, wait for the existing call
    if (this.apiCallPromise) {
      await this.apiCallPromise;
      return;
    }

    // If we already have valid data, don't make another call
    if (this.state.data && this.state.isFromCache) {
      return;
    }

    this.state.loading = true;
    this.state.error = null;
    this.notifySubscribers();

    try {
      // Create a single API call promise
      this.apiCallPromise = this.makeGeolocationCall();
      const data = await this.apiCallPromise;

      if (data) {
        this.state = {
          data,
          region: getRegionFromCountry(data.countryCode),
          loading: false,
          error: null,
          isFromCache: false,
        };
        console.log('📍 Geolocation service: API call completed');
      } else {
        this.state.loading = false;
        this.state.error = 'Failed to detect location';
      }
    } catch (error) {
      this.state.loading = false;
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('📍 Geolocation service error:', error);
    } finally {
      this.apiCallPromise = null;
    }

    this.notifySubscribers();
  }

  private async makeGeolocationCall(): Promise<GeolocationData | null> {
    try {
      // Try the fastest service first (ipinfo.io is usually fastest)
      const fastService = 'https://ipinfo.io/json';
      
      console.log('📍 Geolocation service: Making API call to', fastService);
      
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
        console.log('📍 Geolocation service: Data received from fast service:', data);
        
        const result = {
          country: data.country || 'Unknown',
          countryCode: data.country || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
        };

        // Cache the result in localStorage
        this.cacheLocation(result);
        return result;
      }
    } catch (fastServiceError) {
      console.log('📍 Geolocation service: Fast service failed, trying fallback');
    }

    // Fallback to a single reliable service with short timeout
    try {
      const fallbackService = 'https://ipapi.co/json/';
      console.log('📍 Geolocation service: Trying fallback service:', fallbackService);
      
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
        console.log('📍 Geolocation service: Data received from fallback service:', data);
        
        const result = {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
        };

        // Cache the result in localStorage
        this.cacheLocation(result);
        return result;
      }
    } catch (fallbackError) {
      console.log('📍 Geolocation service: Fallback service also failed');
    }

    // Return cached data even if expired, or default to international
    const expiredCache = this.getCachedLocation();
    if (expiredCache) {
      console.log('📍 Geolocation service: Using expired cache as fallback');
      return expiredCache.data;
    }

    // Final fallback
    console.log('📍 Geolocation service: Using default international region');
    return {
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC',
    };
  }

  private getCachedLocation(): { data: GeolocationData; timestamp: number } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem('bst_geolocation_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to parse cached geolocation data:', error);
      localStorage.removeItem('bst_geolocation_data');
    }
    return null;
  }

  private cacheLocation(data: GeolocationData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = { data, timestamp: Date.now() };
      localStorage.setItem('bst_geolocation_data', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache geolocation data:', error);
    }
  }

  public getState(): GeolocationState {
    return { ...this.state };
  }

  public forceRefresh(): void {
    this.state.data = null;
    this.state.isFromCache = false;
    this.detectLocation();
  }
}

export const geolocationService = GeolocationService.getInstance();
export type { GeolocationState };
