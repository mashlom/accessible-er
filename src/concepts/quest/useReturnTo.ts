import { useLocation, useNavigate } from 'react-router-dom'
import { useConceptPath } from '../nav'

interface ReturnState {
  from?: string
  fromState?: ReturnState | null
}

/**
 * Explicit "where did we come from" for sub-screens reachable from several
 * places (calm, card, distract…). Browser history is unreliable here because
 * returning always pushes, so `navigate(-1)` from a hub screen would dive
 * back into the sub-screen instead of leaving.
 */
export function useReturnTo(fallback: string) {
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const location = useLocation()
  const state = (location.state ?? null) as ReturnState | null
  const backTo = state?.from ?? fallback

  const goBack = () => navigate(conceptPath(backTo), { state: state?.fromState ?? null })

  /** Attach to a Link leaving this screen so the target's back button returns here. */
  const leaveState = (here: string): ReturnState => ({ from: here, fromState: state })

  /** Attach to a Link that should inherit this screen's own origin (skip this screen on the way back). */
  const passThroughState = state

  return { backTo, goBack, leaveState, passThroughState }
}
