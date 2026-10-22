import { usePersistentState } from './usePersistentState'
import { DAY_MS } from '../lib/storage'
import { getPath } from '../data/paths'
import type { PathBase } from '../data/paths'

const KEY = 'visit-reason'

/**
 * The family's selected reason-for-visit. Persisted for one day so a
 * page refresh keeps the choice, but a new day starts fresh. The parent
 * can update or clear it at any time.
 */
export function useVisitReason() {
  const [reasonId, setReasonId, clear] = usePersistentState<string | null>(
    KEY,
    null,
    DAY_MS,
  )

  const path: PathBase | undefined = reasonId ? getPath(reasonId) : undefined

  return {
    reasonId,
    path,
    setReason: (id: string) => setReasonId(id),
    clearReason: clear,
  }
}
