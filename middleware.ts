import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // Use environment variable for maintenance mode
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
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