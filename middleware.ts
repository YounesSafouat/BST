import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache for maintenance mode status
let maintenanceModeCache = {
  value: false,
  lastCheck: 0,
  cacheDuration: 5000 // 5 seconds cache (reduced for faster updates)
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
  
  // Always try to fetch fresh data if:
  // 1. Cache is uninitialized (first request after server start)
  // 2. Cache expired
  // 3. In production, check more frequently (every 2 seconds)
  const isUninitialized = maintenanceModeCache.lastCheck === 0;
  const isExpired = now - maintenanceModeCache.lastCheck > maintenanceModeCache.cacheDuration;
  const shouldCheckInProd = process.env.NODE_ENV === 'production' && now - maintenanceModeCache.lastCheck > 2000;
  const shouldFetch = isUninitialized || isExpired || shouldCheckInProd;
  
  if (shouldFetch) {
    // Cache expired, fetch fresh data
    try {
      // Use absolute URL to ensure it works on server
      // In production, use the public URL from env or fallback to origin
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     process.env.NEXT_PUBLIC_SITE_URL || 
                     request.nextUrl.origin;
      const maintenanceUrl = `${baseUrl}/api/maintenance`;
      
      console.log(`[Maintenance Middleware] Fetching from: ${maintenanceUrl} (origin: ${request.nextUrl.origin})`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for production
      
      const response = await fetch(maintenanceUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'Maintenance-Middleware/1.0',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        maintenanceMode = data.maintenanceMode === true; // Explicit boolean check
        
        // Update cache
        maintenanceModeCache = {
          value: maintenanceMode,
          lastCheck: now,
          cacheDuration: 5000
        };
        
        // Log maintenance status changes for debugging (both dev and prod)
        console.log(`[Maintenance Middleware] Mode: ${maintenanceMode ? 'ACTIVE' : 'INACTIVE'} | Path: ${request.nextUrl.pathname} | Source: ${data.source}`);
      } else {
        console.warn(`[Maintenance Middleware] API returned status: ${response.status} for ${maintenanceUrl}`);
        // Don't update cache on error, keep previous value but log it
        console.warn(`[Maintenance Middleware] Keeping cached value: ${maintenanceMode}`);
      }
    } catch (error) {
      // In production, prefer cached value over env variable if cache exists
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Maintenance Middleware] API call failed: ${errorMsg}`);
      console.log('[Maintenance Middleware] Using cached value or environment variable fallback');
      
      // Use cached value if available and recent (within last 60 seconds), otherwise fallback to env
      if (maintenanceModeCache.value !== undefined && (now - maintenanceModeCache.lastCheck < 60000)) {
        maintenanceMode = maintenanceModeCache.value;
        console.log(`[Maintenance Middleware] Using cached value: ${maintenanceMode}`);
      } else {
        // Only use env variable as last resort
        const envValue = process.env.MAINTENANCE_MODE === 'true';
        console.log(`[Maintenance Middleware] Using environment variable: ${envValue}`);
        maintenanceMode = envValue;
        maintenanceModeCache = {
          value: maintenanceMode,
          lastCheck: now,
          cacheDuration: 5000
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