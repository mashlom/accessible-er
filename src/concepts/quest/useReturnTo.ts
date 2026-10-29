import { useLocation } from 'react-router-dom'
import { useGoBackTo } from '../nav'

interface ReturnState {
  from?: string
  fromState?: ReturnState | null
}

/**
 * Explicit "where did we come from" for sub-screens reachable from several
 * places (calm, card, distract…). Going back returns to that screen: through
 * the history when it is the screen before (so the browser's back button
 * agrees), else in this screen's place (see useGoBackTo).
 */
export function useReturnTo(fallback: string) {
  const goBackTo = useGoBackTo()
  const location = useLocation()
  const state = (location.state ?? null) as ReturnState | null
  const backTo = state?.from ?? fallback

  const goBack = () => goBackTo(backTo, { state: state?.fromState ?? null })

  /** Attach to a Link leaving this screen so the target's back button returns here. */
  const leaveState = (here: string): ReturnState => ({ from: here, fromState: state })

  /** Attach to a Link that should inherit this screen's own origin (skip this screen on the way back). */
  const passThroughState = state

  return { backTo, goBack, leaveState, passThroughState }
}
