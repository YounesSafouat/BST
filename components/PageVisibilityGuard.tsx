"use client";

import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/home/Loader';

interface PageVisibilityGuardProps {
     pageName: 'home' | 'blog' | 'hubspot' | 'about' | 'casClient' | 'contact';
     children: React.ReactNode;
}

export default function PageVisibilityGuard({ pageName, children }: PageVisibilityGuardProps) {
     const { isPageVisible, loading } = usePageVisibility();
     const router = useRouter();

     useEffect(() => {
          console.log(`PageVisibilityGuard for ${pageName}:`, { loading, isVisible: isPageVisible(pageName) });
          if (!loading && !isPageVisible(pageName)) {
               console.log(`Redirecting ${pageName} to home page - page is not visible`);
               // Redirect to home page if page is not visible
               router.push('/');
          }
     }, [loading, isPageVisible, pageName, router]);

     if (loading) {
          return <Loader />;
     }

     if (!isPageVisible(pageName)) {
          return null; // Don't render anything if page is not visible
     }

     return <>{children}</>;
} 