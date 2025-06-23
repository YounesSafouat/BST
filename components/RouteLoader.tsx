"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/home/Loader";

export default function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => {
      // Add a small delay to ensure smooth transitions
      setTimeout(() => setLoading(false), 300);
    };

    handleStop(); // Reset loading state on mount

    // Next.js App Router navigation events
    document.addEventListener("navigationstart", handleStart);
    document.addEventListener("navigationend", handleStop);
    document.addEventListener("navigationerror", handleStop);

    return () => {
      document.removeEventListener("navigationstart", handleStart);
      document.removeEventListener("navigationend", handleStop);
      document.removeEventListener("navigationerror", handleStop);
    };
  }, []);

  // Also trigger loading state on route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all">
      <Loader />
    </div>
  );
} 