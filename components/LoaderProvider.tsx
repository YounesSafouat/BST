/**
 * LoaderProvider.tsx
 * 
 * Global loader provider component that manages loading states across the
 * application. This component provides a centralized loading system with
 * minimum duration enforcement and route change handling.
 * 
 * WHERE IT'S USED:
 * - Root layout (/app/layout.tsx) - Global loader provider
 * - Automatically included in every page through the root layout
 * - Provides loading context for all components
 * 
 * KEY FEATURES:
 * - Global loading state management
 * - Minimum duration enforcement (800ms)
 * - Route change detection and loader hiding
 * - Context-based loading control
 * - Automatic cleanup and timeout handling
 * - Smooth loading transitions
 * 
 * TECHNICAL DETAILS:
 * - Uses React Context API for global loading state
 * - Implements minimum duration logic for better UX
 * - Tracks route changes with usePathname hook
 * - Manages timeouts and cleanup automatically
 * - Provides showLoader and hideLoader functions
 * - Integrates with custom Loader component
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client";
import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import Loader from "@/components/home/Loader";
import { useRouter, usePathname } from 'next/navigation';

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function useGlobalLoader() {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useGlobalLoader must be used within LoaderProvider");
  return context;
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const showTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showLoader = () => {
    setLoading(true);
    showTimeRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const hideLoader = () => {
    const minDuration = 800; // Reduced from 2 seconds to 800ms for better UX
    const now = Date.now();
    const elapsed = showTimeRef.current ? now - showTimeRef.current : 0;
    if (elapsed >= minDuration) {
      setLoading(false);
      showTimeRef.current = null;
    } else {
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        showTimeRef.current = null;
        timeoutRef.current = null;
      }, minDuration - elapsed);
    }
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
}

export function LoaderRouteListener() {
  const pathname = usePathname();
  const { hideLoader } = useGlobalLoader();
  const prevPath = React.useRef(pathname);

  React.useEffect(() => {
    if (prevPath.current !== pathname) {
      hideLoader();
      prevPath.current = pathname;
    }
  }, [pathname, hideLoader]);

  return null;
} 