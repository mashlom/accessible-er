import type { Procedure } from './types'

/** A procedure as the code knows it: the words are in src/data/parent/texts.json and src/data/child/procedures/texts.json. */
export type ProcedureBase = Pick<Procedure, 'id' | 'emoji'>

/**
 * Visual preparation library for common paediatric-ER procedures.
 * Content is illustrative demo material. (Not medical guidance.)
 * parentProcedure (src/data/parent) puts the words of the chosen language on top.
 */
export const procedures: ProcedureBase[] = [
  { id: 'temperature', emoji: '🌡️' },
  { id: 'saturation', emoji: '🔴' },
  { id: 'blood-pressure', emoji: '💪' },
  { id: 'doctor-exam', emoji: '👩‍⚕️' },
  { id: 'blood-test', emoji: '🩸' },
  { id: 'urine', emoji: '🧪' },
  { id: 'xray', emoji: '🦴' },
  { id: 'ultrasound', emoji: '📡' },
  { id: 'ct', emoji: '🌀' },
  { id: 'iv', emoji: '💧' },
  { id: 'medication', emoji: '💊' },
  { id: 'inhalation', emoji: '😮‍💨' },
  { id: 'stitches', emoji: '🤕' },
  { id: 'cast', emoji: '🦿' },
  { id: 'bandage', emoji: '🩹' },
  { id: 'waiting-results', emoji: '⏳' },
]

export function getProcedure(id: string): ProcedureBase | undefined {
  return procedures.find((p) => p.id === id)
}
