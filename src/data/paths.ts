import type { VisitPath } from './types'

/** A reason as the code knows it: the words (label, blurb, the title of each stop) are in src/data/parent/paths.json. */
export type PathBase = Omit<VisitPath, 'label' | 'blurb' | 'route'> & { route: Omit<VisitPath['route'][number], 'title'>[] }

/**
 * Reasons for the visit. Each tailors the "road ahead" (the likely
 * sequence of stops) shown to the family. Based on the common ER
 * routes in the spec. The route is illustrative — the real path is
 * always decided by the medical team.
 */
export const paths: PathBase[] = [
  {
    id: 'fever',
    emoji: '🌡️',
    route: [
      { stageId: 'reception' },
      { stageId: 'triage' },
      { stageId: 'doctor', procedureId: 'doctor-exam' },
      { procedureId: 'blood-test', optional: true },
      { procedureId: 'xray', optional: true },
      {},
    ],
  },
  {
    id: 'abdominal',
    emoji: '😣',
    route: [
      { stageId: 'reception' },
      { stageId: 'triage' },
      { stageId: 'doctor', procedureId: 'doctor-exam' },
      { procedureId: 'blood-test', optional: true },
      { procedureId: 'urine', optional: true },
      { procedureId: 'ultrasound', optional: true },
      { procedureId: 'ct', optional: true },
      { optional: true },
      {},
    ],
  },
  {
    id: 'limb-injury',
    emoji: '🦴',
    route: [
      { stageId: 'reception' },
      { stageId: 'triage' },
      { stageId: 'doctor', procedureId: 'doctor-exam' },
      { procedureId: 'xray' },
      { optional: true },
      { procedureId: 'cast', optional: true },
      {},
    ],
  },
  {
    id: 'cut',
    emoji: '🩹',
    route: [
      { stageId: 'reception' },
      { stageId: 'triage' },
      { stageId: 'doctor', procedureId: 'doctor-exam' },
      { optional: true },
      { procedureId: 'xray', optional: true },
      { procedureId: 'stitches' },
      { procedureId: 'bandage' },
      {},
    ],
  },
  {
    id: 'other',
    emoji: '💭',
    route: [
      { stageId: 'reception' },
      { stageId: 'triage' },
      { stageId: 'doctor', procedureId: 'doctor-exam' },
      { optional: true },
      {},
    ],
  },
]

export function getPath(id: string): PathBase | undefined {
  return paths.find((p) => p.id === id)
}
