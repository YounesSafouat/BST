"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AppearanceSettings {
  _id?: string;
  name: string;
  description: string;
  isActive: boolean;
  
  // Simplified Color System
  colorMain: string;      // Orange
  colorSecondary: string; // Purple
  colorBackground: string; // White
  colorBlack: string;     // Black
  colorWhite: string;     // White
  colorGray: string;      // Gray
  colorGreen: string;     // Green
  
  // Typography
  fontFamily: string;
  headingFontFamily: string;
  fontSize: string;
  headingFontSize: string;
  lineHeight: string;
  
  // Spacing & Effects
  borderRadius: string;
  spacing: string;
  shadowColor: string;
  shadowSize: string;
}

interface ThemeContextType {
  theme: AppearanceSettings | null;
  refreshTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  refreshTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppearanceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyTheme = (appearance: AppearanceSettings) => {
    const root = document.documentElement;
    
    // Apply simplified color system
    root.style.setProperty('--color-main', appearance.colorMain);
    root.style.setProperty('--color-secondary', appearance.colorSecondary);
    root.style.setProperty('--color-background', appearance.colorBackground);
    root.style.setProperty('--color-black', appearance.colorBlack);
    root.style.setProperty('--color-white', appearance.colorWhite);
    root.style.setProperty('--color-gray', appearance.colorGray);
    root.style.setProperty('--color-green', appearance.colorGreen);
    
    // Apply typography
    root.style.setProperty('--font-family', `${appearance.fontFamily}, sans-serif`);
    root.style.setProperty('--heading-font-family', `${appearance.headingFontFamily}, sans-serif`);
    root.style.setProperty('--font-size', appearance.fontSize);
    root.style.setProperty('--heading-font-size', appearance.headingFontSize);
    root.style.setProperty('--line-height', appearance.lineHeight);
    
    // Apply spacing & effects
    root.style.setProperty('--border-radius', appearance.borderRadius);
    root.style.setProperty('--spacing', appearance.spacing);
    root.style.setProperty('--shadow-color', appearance.shadowColor);
    root.style.setProperty('--shadow-size', appearance.shadowSize);
    
    // Apply shadcn/ui variables for dropdown menus and switch components
    root.style.setProperty('--background', '0 0% 100%'); // white
    root.style.setProperty('--foreground', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--card', '0 0% 100%'); // white
    root.style.setProperty('--card-foreground', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--popover', '0 0% 100%'); // white
    root.style.setProperty('--popover-foreground', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--primary', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--primary-foreground', '0 0% 98%'); // white
    root.style.setProperty('--secondary', '0 0% 96.1%'); // light gray
    root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--muted', '0 0% 96.1%'); // light gray
    root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%'); // gray
    root.style.setProperty('--accent', '0 0% 96.1%'); // light gray
    root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--destructive', '0 84.2% 60.2%'); // red
    root.style.setProperty('--destructive-foreground', '0 0% 98%'); // white
    root.style.setProperty('--border', '214.3 31.8% 91.4%'); // light gray
    root.style.setProperty('--input', '214.3 31.8% 91.4%'); // light gray
    root.style.setProperty('--ring', '222.2 47.4% 11.2%'); // black
    root.style.setProperty('--radius', '0.5rem');
  };

  const fetchActiveTheme = async () => {
    try {
      // Check if we have cached theme data
      const cachedTheme = localStorage.getItem('bst-theme');
      if (cachedTheme) {
        const parsedTheme = JSON.parse(cachedTheme);
        setTheme(parsedTheme);
        applyTheme(parsedTheme);
        setIsLoading(false);
        
        // Fetch fresh data in background
        fetch('/api/appearance/active')
          .then(res => res.json())
          .then(freshTheme => {
            if (freshTheme && freshTheme._id !== parsedTheme._id) {
              setTheme(freshTheme);
              applyTheme(freshTheme);
              localStorage.setItem('bst-theme', JSON.stringify(freshTheme));
            }
          })
          .catch(() => {}); // Silent fail for background refresh
        return;
      }

      const response = await fetch('/api/appearance/active');
      if (response.ok) {
        const appearance = await response.json();
        setTheme(appearance);
        applyTheme(appearance);
        // Cache the theme data
        localStorage.setItem('bst-theme', JSON.stringify(appearance));
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
      // Apply fallback theme
      const fallbackTheme: AppearanceSettings = {
        name: 'Default',
        description: 'Default theme',
        isActive: true,
        colorMain: '#f97316',
        colorSecondary: '#8b5cf6',
        colorBackground: '#ffffff',
        colorBlack: '#000000',
        colorWhite: '#ffffff',
        colorGray: '#6b7280',
        colorGreen: '#10b981',
        fontFamily: 'Inter',
        headingFontFamily: 'Poppins',
        fontSize: '16px',
        headingFontSize: '24px',
        lineHeight: '1.5',
        borderRadius: '8px',
        spacing: '16px',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowSize: '4px',
      };
      setTheme(fallbackTheme);
      applyTheme(fallbackTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTheme = () => {
    fetchActiveTheme();
  };

  useEffect(() => {
    fetchActiveTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
