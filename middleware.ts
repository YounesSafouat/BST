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

  // Skip middleware for API routes, dashboard, auth, and maintenance page
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname === '/maintenance'
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
      
      console.log(`[Maintenance Middleware] Fetching from: ${maintenanceUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      
      const response = await fetch(maintenanceUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'Maintenance-Middleware/1.0',
        },
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
        console.log(`[Maintenance Middleware] Mode: ${maintenanceMode ? 'ACTIVE' : 'INACTIVE'} | Path: ${request.nextUrl.pathname} | Source: ${data.source}`);
      } else {
        console.warn(`[Maintenance Middleware] API returned status: ${response.status}`);
        // Don't update cache on error, keep previous value
      }
    } catch (error) {
      // Fallback to cached value or environment variable if API call fails
      console.log(`[Maintenance Middleware] API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log('[Maintenance Middleware] Using cached value or environment variable fallback');
      // Use cached value if available, otherwise fallback to env
      if (maintenanceModeCache.value !== undefined) {
        maintenanceMode = maintenanceModeCache.value;
      } else {
        maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
        maintenanceModeCache = {
          value: maintenanceMode,
          lastCheck: now,
          cacheDuration: 30000
        };
      }
    }
  }

  // Skip static assets from maintenance redirect
  if (
    request.nextUrl.pathname.startsWith('/images/') ||
    request.nextUrl.pathname.startsWith('/videos/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  if (maintenanceMode) {
    if (request.nextUrl.pathname !== '/maintenance') {
      console.log(`[Maintenance Middleware] Redirecting ${request.nextUrl.pathname} to /maintenance`);
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  } else {
    if (request.nextUrl.pathname === '/maintenance') {
      console.log(`[Maintenance Middleware] Redirecting /maintenance to /`);
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