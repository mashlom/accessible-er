import { useCallback, useEffect, useState } from 'react'
import { readStored, removeStored, writeStored } from '../lib/storage'

/**
 * useState that persists to localStorage with an optional TTL.
 *
 * On mount it reads the (non-expired) stored value. Writes are mirrored
 * to storage, and changes are synced across tabs via the `storage` event.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  ttlMs?: number,
): [T, (value: T) => void, () => void] {
  const [state, setState] = useState<T>(() => readStored(key, initial))

  const set = useCallback(
    (value: T) => {
      setState(value)
      writeStored(key, value, ttlMs)
    },
    [key, ttlMs],
  )

  const clear = useCallback(() => {
    removeStored(key)
    setState(initial)
  }, [key, initial])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === key) setState(readStored(key, initial))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, initial])

  return [state, set, clear]
}
