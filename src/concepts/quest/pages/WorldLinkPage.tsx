import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { themes } from '../themes'
import { useQuestTheme } from '../useQuestTheme'

/** A link to one world: #/quest/world/ocean opens that world's map directly (so a world can be sent to someone).
 *  An unknown id leads to the world choice. */
export function WorldLinkPage() {
  const { id } = useParams<{ id: string }>()
  const { setThemeId } = useQuestTheme()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  useEffect(() => {
    if (id && themes.some((t) => t.id === id)) {
      setThemeId(id)
      navigate(conceptPath('/map'), { replace: true })
    } else {
      navigate(conceptPath('/'), { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return null
}
