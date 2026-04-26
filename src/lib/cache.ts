const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expiresAt } = JSON.parse(raw) as { value: T; expiresAt: number };
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, value: T, ttlMs = CACHE_TTL_MS): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiresAt: Date.now() + ttlMs }));
  } catch {
    // storage full or unavailable
  }
}

export const LOCATION_KEY = 'weather_last_location';
export const UNIT_KEY = 'weather_unit';
