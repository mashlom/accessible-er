/**
 * Child texts of each world: src/data/child/worlds/<world>/texts.json, one file per world with all languages.
 * A language that is not translated yet falls back to the Hebrew original in the same file.
 */
export type WorldLang = 'he' | 'en' | 'ru'

export interface WorldText {
  name?: string
  stages?: Record<string, { label?: string; hint?: string }>
  procedureNarratives?: Record<string, string>
  procedureSteps?: Record<string, string[]>
  procedureVariants?: Record<string, { label: string; steps: string[] }[]>
  calmLines?: string[]
  cardChildHero?: { title: string; subtitle: string }
  distractTitle?: string
}

const files = import.meta.glob<Partial<Record<WorldLang, WorldText>>>('./*/texts.json', { eager: true, import: 'default' })

const byWorld: Record<string, Partial<Record<WorldLang, WorldText>>> = Object.fromEntries(
  Object.entries(files).map(([path, data]) => [path.split('/')[1], data]),
)

/** The texts of one world in one language (Hebrew when that language is not translated yet). */
export function worldText(worldId: string, lang: WorldLang): WorldText | undefined {
  const w = byWorld[worldId]
  return w?.[lang] ?? w?.he
}
