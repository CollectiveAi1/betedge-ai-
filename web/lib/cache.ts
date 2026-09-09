// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; expiresAt: number }>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: any, ttlMs: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function invalidateCache(keyPattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
}

// TTL constants
export const ODDS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const ANALYSIS_CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours
export const ESPN_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
