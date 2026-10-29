import { keyed } from '../../../lib/keyed'
/**
 * Child texts of each world: src/data/child/worlds/<world>/texts.json, one file per world with all languages.
 * A language that is not translated yet falls back to the Hebrew original in the same file.
 */
export type WorldLang = 'he' | 'en' | 'ru'

export interface WorldText {
  name?: string
  /** story: how the station is like the same step in the ER (the designed sheet); done: the station's own "I did it" button */
  stages?: Record<string, { label?: string; hint?: string; story?: string; done?: string }>
  procedureNarratives?: Record<string, string>
  procedureSteps?: Record<string, string[]>
  procedureVariants?: Record<string, { label: string; steps: string[] }[]>
  calmLines?: string[]
  distractTitle?: string
  /** The world's own wording on the designed screens (the main buttons, the choice sheet's title, the map's headline,
   *  and intro: the sentence at the top of the first map that says the ER visit is like this world's journey) */
  ui?: { done?: string; decision?: string; decisionTitle?: string; headline?: string; intro?: string }
}

const files = import.meta.glob<Partial<Record<WorldLang, WorldText>>>('./*/texts.json', { eager: true, import: 'default' })

const byWorld: Record<string, Partial<Record<WorldLang, WorldText>>> = Object.fromEntries(
  Object.entries(files).map(([path, data]) => [path.split('/')[1], data]),
)

/** The texts of one world in one language (Hebrew when that language is not translated yet). */
export function worldText(worldId: string, lang: WorldLang): WorldText | undefined {
  const w = byWorld[worldId]
  return keyed(w?.[lang] ?? w?.he, `child/worlds/${worldId}/texts`)
}
