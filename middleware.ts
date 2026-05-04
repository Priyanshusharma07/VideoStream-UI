import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to enforce authentication on cinematic routes.
 * Only the Home page (/) and Auth pages are public.
 * All other actions (watch, upload, dashboard, feed) require login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Public Paths
  const isPublicPath = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname === '/forgot-password';

  // 2. Define Assets/Static Paths (always public)
  const isAssetPath = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') || 
    pathname.includes('.') || // matches images, favicon, etc.
    pathname === '/favicon.ico';

  if (isAssetPath) {
    return NextResponse.next();
  }

  // 3. Check for Token Cookie
  const token = request.cookies.get('cineview_token')?.value;

  // 4. Protection Logic
  if (!token && !isPublicPath) {
    // Redirect to login if trying to access protected content while unauthenticated
    const url = new URL('/login', request.url);
    // Optional: add a 'from' param to redirect back after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (token && (pathname === '/login' || pathname === '/signup')) {
    // Redirect to feed if already logged in and trying to access auth pages
    return NextResponse.redirect(new URL('/feed', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
