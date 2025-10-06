import { useState, useEffect } from 'react';

interface VisualEffectsSettings {
  showCurvedLines: boolean;
}

export function useVisualEffects() {
  const [settings, setSettings] = useState<VisualEffectsSettings>({
    showCurvedLines: true // Default to true for better UX
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisualEffectsSettings();
  }, []);

  const fetchVisualEffectsSettings = async () => {
    try {
      const response = await fetch('/api/content/settings', {
        cache: 'no-store', // Disable caching to get fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.content && data.content.visualEffects) {
          setSettings(data.content.visualEffects);
        } else {
          console.log('No visual effects settings found, using default');
        }
      }
    } catch (error) {
      console.error('Error fetching visual effects settings:', error);
      // Keep default settings on error
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchVisualEffectsSettings };
}
