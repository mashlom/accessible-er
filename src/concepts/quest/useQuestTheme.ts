import { useMemo, useSyncExternalStore } from 'react'
import { getTheme, type QuestTheme } from './themes'
import { useI18n } from '../../hooks/useI18n'
import oceanTexts from '../../data/child/worlds/ocean/texts.json'

/** The ocean world's child texts, one file with all languages (src/data/child/worlds/ocean/texts.json) */
interface OceanText {
  meta: { name: string; emoji: string }
  stages: Record<string, { label: string; hint: string }>
  procedures: Record<string, string>
  procedureSteps?: Record<string, string[]>
  procedureVariants?: Record<string, { label: string; steps: string[] }[]>
  calm: string[]
  card: { title: string; subtitle: string }
  distract: string
}

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
    const base = getTheme(current)
    if (base.id !== 'ocean') return base
    const tx = (oceanTexts as unknown as Record<string, OceanText>)[lang]
    const stages = Object.fromEntries(
      Object.entries(base.stages).map(([id, st]) => [id, { ...st, ...tx.stages[id] }]),
    )
    return {
      ...base,
      name: tx.meta.name,
      stages,
      procedureNarratives: tx.procedures,
      procedureSteps: tx.procedureSteps ?? {},
      procedureVariants: tx.procedureVariants ?? {},
      calmLines: tx.calm,
      cardChildHero: tx.card,
      distractTitle: tx.distract,
    }
  }, [current, lang])

  return { theme, setThemeId }
}
