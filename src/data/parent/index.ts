import texts from './texts.json'
import { keyed } from '../../lib/keyed'
import i18nUi from '../i18n/ui.json'
import { TIMES } from './times'

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

/** A time code from the data ("t10-20") as its number ("10–20") and the unit of the language ("minutes"); other texts ("about a minute") as they are. */
function withUnit(lang: ParentLang, text: string | undefined): string | undefined {
  if (!text) return text
  const number = TIMES[text]
  return number ? `${number} ${keyed((i18nUi as unknown as Record<ParentLang, { labels: { adult: { minutes: string } } }>)[lang], 'i18n/ui').labels.adult.minutes}` : text
}

/** The stations as shown to the parent: the code's station data with the parent texts of the language on top */
export function parentJourney(lang: ParentLang): JourneyStage[] {
  return journeyStages.map((s) => {
    const tx = parentTexts(lang).stages[s.id]
    return { ...s, ...tx, ...(tx?.waitRange ? { waitRange: withUnit(lang, tx.waitRange) } : {}) } as JourneyStage
  })
}

/** A procedure as shown to the parent: the code's procedure (id, emoji, story steps) with the parent texts on top */
export function parentProcedure(lang: ParentLang, id: string): Procedure | undefined {
  const base = getProcedure(id)
  const tx = parentTexts(lang).procedures[id]
  // the steps a child hears are shared by all worlds: their own file (src/data/child/procedures)
  const steps = procedureSteps(lang, id)
  // the waiting for results has the station's title
  // these two procedures have their station's title
  const STATION_TITLE: Record<string, string> = { 'waiting-results': 'wait-results', 'doctor-exam': 'doctor' }
  const title = STATION_TITLE[id] ? parentTexts(lang).stages[STATION_TITLE[id]].title : undefined
  // a nurse does these: the same words for each of them (one key)
  const NURSE_PROCEDURES = ['temperature', 'saturation', 'blood-pressure', 'iv', 'medication', 'inhalation']
  const who = NURSE_PROCEDURES.includes(id) ? keyed((i18nUi as unknown as Record<ParentLang, { labels: { adult: { whoNurse: string } } }>)[lang], 'i18n/ui').labels.adult.whoNurse : undefined
  // about a minute: the same words for these three (one key)
  // the doctor exam lasts as long as the doctor station (one time)
  const DOCTOR_TIME = id === 'doctor-exam' ? parentTexts(lang).stages.doctor.waitRange : undefined
  const MINUTE_PROCEDURES = ['temperature', 'saturation', 'blood-pressure']
  const duration = MINUTE_PROCEDURES.includes(id) ? keyed((i18nUi as unknown as Record<ParentLang, { labels: { adult: { durationMinute: string } } }>)[lang], 'i18n/ui').labels.adult.durationMinute : undefined
  return base && tx ? ({ ...base, ...tx, ...(title ? { title } : {}), ...(who ? { who } : {}), ...(duration ? { duration } : { duration: withUnit(lang, DOCTOR_TIME ?? tx.duration) }), ...steps } as Procedure) : undefined
}
