import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { ConceptBase, Navigate } from '../../nav'
import { themes } from '../themes'
import { useQuestTheme } from '../useQuestTheme'

/** The world select screen's address */
export const WORLD_SELECT = '/quest'

/**
 * The first part of the address after /quest names the world: /quest/<world>/…
 * Everything under it belongs to that world: the chosen theme is set from the address, and every link inside
 * is written relative to /quest/<world>, so it stays in the same world.
 * An address whose first part is not a world (/quest/map, /quest/wait-times …) goes to the same screen of the
 * chosen world.
 */
export function WorldScope() {
  const { worldId = '', '*': rest = '' } = useParams()
  const { theme, setThemeId } = useQuestTheme()
  const known = themes.some((w) => w.id === worldId)

  useEffect(() => {
    if (known && theme.id !== worldId) setThemeId(worldId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldId, known])

  if (!known) return <Navigate to={`/${theme.id}/${worldId}${rest ? `/${rest}` : ''}`} replace />
  // draw nothing until the chosen world is the one in the address (no flash of the previous world)
  if (theme.id !== worldId) return null

  return (
    <ConceptBase base={`/quest/${worldId}`}>
      <Outlet />
    </ConceptBase>
  )
}

