import type { JourneyStage } from './types'

/**
 * The generic stages of an ER visit: ids, icons, sensory levels and procedures.
 * The words of each stage are in src/data/parent/texts.json (parentJourney merges them in).
 */
export const journeyStages: Omit<JourneyStage, 'title' | 'meaning' | 'whatHappens' | 'challenge' | 'canAsk' | 'nextStagePrepare' | 'waitRange'>[] = [
  {
    id: 'reception',
    emoji: '📝',
    sensory: { sound: 3, light: 3, smell: 1, people: 3 },
  },
  {
    id: 'wait-before-triage',
    emoji: '⏳',
    sensory: { sound: 4, light: 3, smell: 1, people: 4 },
  },
  {
    id: 'triage',
    emoji: '🩺',
    waitKind: 'duration',
    procedureIds: ['temperature', 'saturation', 'blood-pressure'],
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'wait-doctor',
    emoji: '⏳',
    sensory: { sound: 4, light: 4, smell: 2, people: 4 },
  },
  {
    id: 'doctor',
    emoji: '👩‍⚕️',
    waitKind: 'duration',
    procedureIds: ['doctor-exam'],
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'tests',
    emoji: '🔬',
    waitKind: 'duration',
    procedureIds: ['blood-test', 'urine', 'xray', 'ultrasound', 'ct'],
    sensory: { sound: 3, light: 4, smell: 2, people: 2 },
  },
  {
    id: 'consult',
    emoji: '🧑‍⚕️',
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'wait-results',
    emoji: '🕰️',
    procedureIds: ['waiting-results'],
    sensory: { sound: 4, light: 3, smell: 2, people: 3 },
  },
  {
    id: 'treatment',
    emoji: '💊',
    waitKind: 'duration',
    procedureIds: ['iv', 'medication', 'inhalation', 'stitches', 'cast', 'bandage'],
    sensory: { sound: 2, light: 3, smell: 2, people: 2 },
  },
  {
    id: 'decision',
    emoji: '🏁',
  },
]

export function getStageIndex(id: string): number {
  return journeyStages.findIndex((s) => s.id === id)
}
