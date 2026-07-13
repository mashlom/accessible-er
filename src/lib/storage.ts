/**
 * Tiny localStorage helper with per-key expiration.
 *
 * Values are wrapped as `{ v: value, exp: epochMs | null }`. A `null`
 * expiry never expires. Reading an expired entry removes it and returns
 * the provided fallback. All access is guarded so the app keeps working
 * in private-mode / storage-disabled browsers.
 */

interface Wrapped<T> {
  v: T
  exp: number | null
}

export const DAY_MS = 24 * 60 * 60 * 1000

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const parsed = JSON.parse(raw) as Wrapped<T>
    if (parsed.exp != null && Date.now() > parsed.exp) {
      localStorage.removeItem(key)
      return fallback
    }
    return parsed.v
  } catch {
    return fallback
  }
}

/** Persist a value. `ttlMs` (optional) sets an expiration window from now. */
export function writeStored<T>(key: string, value: T, ttlMs?: number): void {
  try {
    const wrapped: Wrapped<T> = {
      v: value,
      exp: ttlMs != null ? Date.now() + ttlMs : null,
    }
    localStorage.setItem(key, JSON.stringify(wrapped))
  } catch {
    /* storage unavailable — fail silently, app still works in-memory */
  }
}

export function removeStored(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
