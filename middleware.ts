import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache for maintenance mode status
let maintenanceModeCache = {
  value: false,
  lastCheck: 0,
  cacheDuration: 30000 // 30 seconds cache
};

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes, dashboard, and auth
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if cache is still valid
  const now = Date.now();
  let maintenanceMode = maintenanceModeCache.value;
  
  if (now - maintenanceModeCache.lastCheck > maintenanceModeCache.cacheDuration) {
    // Cache expired, fetch fresh data
    try {
      const baseUrl = request.nextUrl.origin;
      const response = await fetch(`${baseUrl}/api/maintenance`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        maintenanceMode = data.maintenanceMode || false;
        
        // Update cache
        maintenanceModeCache = {
          value: maintenanceMode,
          lastCheck: now,
          cacheDuration: 30000
        };
        
        // Log maintenance status changes for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`Maintenance mode: ${maintenanceMode ? 'ACTIVE' : 'INACTIVE'}`);
        }
      } else {
        console.warn('Maintenance API returned non-OK status:', response.status);
      }
    } catch (error) {
      // Fallback to environment variable if API call fails
      console.log('Maintenance API call failed, using environment variable fallback');
      maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
      
      // Update cache with fallback value
      maintenanceModeCache = {
        value: maintenanceMode,
        lastCheck: now,
        cacheDuration: 30000
      };
    }
  }

  if (maintenanceMode) {
    if (request.nextUrl.pathname !== '/maintenance') {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  } else {
    if (request.nextUrl.pathname === '/maintenance') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - dashboard (admin dashboard)
     * - auth (authentication pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|dashboard|auth).*)',
  ],
}; 