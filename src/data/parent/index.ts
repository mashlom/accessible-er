import texts from './texts.json'
import { keyed } from '../../lib/keyed'

/** Parent texts for the stations and procedures (src/data/parent/texts.json), one file with all languages. */
export type ParentLang = 'he' | 'en' | 'ru'

export interface ParentStageText {
  title: string
  meaning: string
  whatHappens: string
  challenge: string
  canAsk: string[]
  waitRange: string
}

export interface ParentProcedureText {
  title: string
  duration: string
  who: string
  what: string
  feel: string
  prepare: string
  adaptations: string[]
}

type ParentTexts = {
  stages: Record<string, ParentStageText>
  procedures: Record<string, ParentProcedureText>
}

export function parentTexts(lang: ParentLang): ParentTexts {
  return keyed((texts as unknown as Record<ParentLang, ParentTexts>)[lang], 'parent/texts')
}

import { journeyStages } from '../journey'
import { getProcedure } from '../procedures'
import { procedureSteps } from '../child/procedures'
import type { JourneyStage, Procedure } from '../types'

/** The stations as shown to the parent: the code's station data with the parent texts of the language on top */
export function parentJourney(lang: ParentLang): JourneyStage[] {
  return journeyStages.map((s) => ({ ...s, ...parentTexts(lang).stages[s.id] }))
}

/** A procedure as shown to the parent: the code's procedure (id, emoji, story steps) with the parent texts on top */
export function parentProcedure(lang: ParentLang, id: string): Procedure | undefined {
  const base = getProcedure(id)
  const tx = parentTexts(lang).procedures[id]
  // the steps a child hears are shared by all worlds: their own file (src/data/child/procedures)
  const steps = procedureSteps(lang, id)
  return base && tx ? { ...base, ...tx, ...steps } : base
}
