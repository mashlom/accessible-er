import texts from './texts.json'

/** The steps a child hears before a procedure (shared by all worlds): src/data/child/procedures/texts.json */
export interface ProcedureSteps {
  story?: string[]
  storyVariants?: { label: string; steps: string[] }[]
}

/** The steps of one procedure in one language (Hebrew when that language is not translated yet). */
export function procedureSteps(lang: 'he' | 'en' | 'ru', id: string): ProcedureSteps | undefined {
  const t = texts as unknown as Record<'he' | 'en' | 'ru', Record<string, ProcedureSteps>>
  return t[lang]?.[id] ?? t.he[id]
}
