import { useMemo, useSyncExternalStore } from 'react'
import { getTheme, type QuestTheme } from './themes'
import { useI18n } from '../../hooks/useI18n'
import { worldText, type WorldLang } from '../../data/child/worlds'

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
  const { lang } = useI18n()

  const theme = useMemo(() => {
    // every world's child texts come from src/data/child/worlds/<world>/texts.json (the language, else Hebrew)
    const base = getTheme(current)
    const tx = worldText(base.id, lang as WorldLang)
    if (!tx) return base
    const stages = Object.fromEntries(
      Object.entries(base.stages).map(([id, st]) => [id, { ...st, ...tx.stages?.[id] }]),
    )
    return {
      ...base,
      name: tx.name ?? base.name,
      stages,
      procedureNarratives: tx.procedureNarratives,
      procedureSteps: tx.procedureSteps,
      procedureVariants: tx.procedureVariants,
      calmLines: tx.calmLines,
      distractTitle: tx.distractTitle,
    }
  }, [current, lang])

  return { theme, setThemeId }
}
