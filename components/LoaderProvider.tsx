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