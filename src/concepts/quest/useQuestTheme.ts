import { useMemo, useSyncExternalStore } from 'react'
import { getTheme, type QuestTheme } from './themes'
import { useI18n } from '../../hooks/useI18n'

const KEY = 'quest-theme'

function readId(): string {
  try { return sessionStorage.getItem(KEY) ?? '' } catch { return '' }
}

let id = readId()
const listeners = new Set<() => void>()
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

function setThemeId(newId: string) {
  id = newId
  try { sessionStorage.setItem(KEY, newId) } catch {}
  listeners.forEach((l) => l())
}

export function useQuestTheme(): { theme: QuestTheme; setThemeId: (id: string) => void } {
  const current = useSyncExternalStore(subscribe, () => id)
  const { lang, t } = useI18n()

  const theme = useMemo(() => {
    const base = getTheme(current)
    if (base.id !== 'ocean' || lang === 'he') return base
    return {
      ...base,
      name: t('ocean.meta.name', base.name),
      stages: t('ocean.stages', base.stages),
      procedureNarratives: t('ocean.procedures', base.procedureNarratives ?? {}),
      procedureSteps: t('ocean.procedureSteps', base.procedureSteps ?? {}),
      calmLines: t('ocean.calm', base.calmLines ?? []),
      cardChildHero: t('ocean.card', base.cardChildHero ?? { title: '', subtitle: '' }),
      distractTitle: t('ocean.distract', base.distractTitle ?? ''),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, lang])

  return { theme, setThemeId }
}
