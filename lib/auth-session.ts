/**
 * auth-session.ts
 *
 * Manages user authentication sessions using localStorage and Cookies.
 * Tokens are stored and retrieved for API requests and Middleware validation.
 */

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  name?: string;
  email?: string;
};

const STORAGE_KEY = 'streamhub.auth';
const COOKIE_NAME = 'cineview_token';

function safeParseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === 'undefined') return;
  
  // Save to LocalStorage for JS services
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  
  // Save to Cookie for Next.js Middleware (Server-side)
  // Set to expire in 30 days
  const expires = new Date();
  expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
  document.cookie = `${COOKIE_NAME}=${session.accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  
  window.localStorage.removeItem(STORAGE_KEY);
  
  // Clear Cookie
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // If Clerk is available on the window, use it to get the token
  if ((window as any).Clerk?.session) {
    try {
      return await (window as any).Clerk.session.getToken();
    } catch (e) {
      console.error("Failed to get Clerk token", e);
    }
  }

  // Fallback to Cookie (for Next.js Middleware or __session)
  const names = ['__session=', COOKIE_NAME + '='];
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  
  for (const name of names) {
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
  }

  return null;
}