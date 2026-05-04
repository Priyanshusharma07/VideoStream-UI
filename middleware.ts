import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth Middleware for CINEVIEW
 *
 * Public (no login needed):
 *   /            → home page (browse, but can't play)
 *   /login
 *   /signup
 *   /forgot-password
 *   /sso-callback
 *
 * Protected (login required):
 *   Everything else: /feed, /watch/*, /upload, /dashboard,
 *                    /live/*, /profile, /discover, /explore, etc.
 */

const PUBLIC_PATHS = new Set(['/', '/login', '/signup', '/forgot-password', '/sso-callback']);

// Paths that start with these prefixes are also public
const PUBLIC_PREFIXES = ['/api', '/_next', '/static'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow assets
  const isAsset = PUBLIC_PREFIXES.some(p => pathname.startsWith(p)) || pathname.includes('.');
  if (isAsset) return NextResponse.next();

  const isPublicPath = PUBLIC_PATHS.has(pathname);
  const token = request.cookies.get('cineview_token')?.value;

  // Logged-in user trying to access auth pages → redirect to feed
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Not logged in, on a protected route → redirect to login
  if (!token && !isPublicPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
