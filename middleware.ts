import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache for maintenance mode status
let maintenanceModeCache = {
  value: false,
  lastCheck: 0,
  cacheDuration: 30000 // 30 seconds cache
};

export async function middleware(request: NextRequest) {
  // Force HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

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
      // Use absolute URL to ensure it works on server
      const baseUrl = request.nextUrl.origin;
      const maintenanceUrl = `${baseUrl}/api/maintenance`;
      
              // [Maintenance Middleware] Fetching from maintenance URL
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(maintenanceUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'Maintenance-Middleware/1.0',
        },
        // Add timeout for server environments
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        maintenanceMode = data.maintenanceMode || false;
        
        // Update cache
        maintenanceModeCache = {
          value: maintenanceMode,
          lastCheck: now,
          cacheDuration: 30000
        };
        
        // Log maintenance status changes for debugging (both dev and prod)
        // [Maintenance Middleware] Mode status logged silently
      } else {
        console.warn(`[Maintenance Middleware] API returned status: ${response.status}`);
        // Don't update cache on error, keep previous value
      }
    } catch (error) {
      // Fallback to environment variable if API call fails
              // [Maintenance Middleware] API call failed, using environment variable fallback
      maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
      
      // Update cache with fallback value
      maintenanceModeCache = {
        value: maintenanceMode,
        lastCheck: now,
        cacheDuration: 30000
      };
    }
  }

  // Force cache refresh for maintenance page access (for immediate response)
  if (request.nextUrl.pathname === '/maintenance' && maintenanceMode === false) {
    try {
      const baseUrl = request.nextUrl.origin;
      const maintenanceUrl = `${baseUrl}/api/maintenance`;
      
      const response = await fetch(maintenanceUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'Maintenance-Middleware/1.0',
        },
        signal: AbortSignal.timeout(3000), // 3 second timeout for refresh
      });
      
      if (response.ok) {
        const data = await response.json();
        const freshMaintenanceMode = data.maintenanceMode || false;
        
        if (freshMaintenanceMode !== maintenanceMode) {
          maintenanceMode = freshMaintenanceMode;
          maintenanceModeCache = {
            value: maintenanceMode,
            lastCheck: now,
            cacheDuration: 30000
          };
          // [Maintenance Middleware] Cache refreshed silently
        }
      }
    } catch (error) {
              // [Maintenance Middleware] Cache refresh failed, using cached value
    }
  }

  if (maintenanceMode) {
    if (request.nextUrl.pathname !== '/maintenance') {
              // [Maintenance Middleware] Redirecting to maintenance page
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  } else {
    if (request.nextUrl.pathname === '/maintenance') {
              // [Maintenance Middleware] Redirecting maintenance to home
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