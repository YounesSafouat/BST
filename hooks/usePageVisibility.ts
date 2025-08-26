import { useState, useEffect } from 'react';

interface PageVisibility {
  home: boolean;
  blog: boolean;
  hubspot: boolean;
  about: boolean;
  casClient: boolean;
  contact: boolean;
}

export function usePageVisibility() {
  const [pageVisibility, setPageVisibility] = useState<PageVisibility>({
    home: true,
    blog: true,
    hubspot: true,
    about: true,
    casClient: true,
    contact: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageVisibility = async () => {
      try {
        const response = await fetch('/api/content/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.content?.pageVisibility) {
            setPageVisibility(data.content.pageVisibility);
          }
        }
      } catch (error) {
        console.error('Error fetching page visibility:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageVisibility();
  }, []);

  const isPageVisible = (pageName: keyof PageVisibility): boolean => {
    const isVisible = pageVisibility[pageName] ?? true;
            // Page visibility tracked silently
    return isVisible;
  };

  return {
    pageVisibility,
    isPageVisible,
    loading
  };
} 