import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Public routes — accessible without authentication.
 * All other routes are protected and redirect to /login.
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/forgot-password(.*)',
  '/sso-callback(.*)',
  '/feed(.*)',
  '/watch(.*)',
  '/explore(.*)',
  '/discover(.*)',
  '/qa(.*)',
  '/notifications(.*)',
  // Public API routes (demo data, health check)
  '/api/health',
  '/api/feed',
  '/api/videos/(.*)',
  // Auth is validated by the backend; the route handler only forwards headers.
  '/api/proxy/(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
