import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { themes } from '../themes'
import { useQuestTheme } from '../useQuestTheme'
import { MapPage } from './MapPage'

/** A link to one world: #/quest/world/ocean shows that world's map and keeps its address in the address bar, so the
 *  address can be copied and sent. An unknown id leads to the world choice. */
export function WorldLinkPage() {
  const { id } = useParams<{ id: string }>()
  const { theme, setThemeId } = useQuestTheme()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const known = !!id && themes.some((t) => t.id === id)

  useEffect(() => {
    if (!known) navigate(conceptPath('/'), { replace: true })
    else if (theme.id !== id) setThemeId(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, known, theme.id])

  // the map is drawn only once the world is the chosen one (no flash of the previous world)
  return known && theme.id === id ? <MapPage /> : null
}
