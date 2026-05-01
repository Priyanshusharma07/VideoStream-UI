export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
};

const STORAGE_KEY = "streamhub.auth";

function safeParseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const json = safeParseJson(raw);

  if (!isRecord(json)) return null;

  return typeof json.accessToken === "string" && json.accessToken.trim()
    ? json.accessToken
    : null;
}