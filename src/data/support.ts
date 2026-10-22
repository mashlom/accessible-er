import type { DistressTip, StaffRequest } from './types'
import supportI18n from './i18n/support.json'

// the Hebrew words are the source lists; en and ru follow them by position (src/data/i18n/support.json)
const he = (supportI18n as unknown as {
  he: {
    distressTips: { title: string; body: string }[]
    readySentences: string[]
    staffRequests: { title: string; detail: string }[]
  }
}).he

/**
 * Short parent guidance for moments of distress (module 5).
 * Reassuring, actionable, low-cognitive-load.
 */
const tipIcons: Pick<DistressTip, 'emoji' | 'id'>[] = [
  { emoji: '🤫', id: 'fewer-words' },
  { emoji: '🧍', id: 'more-space' },
  { emoji: '🎧', id: 'less-stimuli' },
  { emoji: '⏸️', id: 'pause' },
  { emoji: '🧸', id: 'familiar' },
  { emoji: '💬', id: 'mediate' },
]
export const distressTips: DistressTip[] = tipIcons.map((tip, i) => ({ ...tip, ...he.distressTips[i] }))

/**
 * Ready-made short sentences a parent can say — or show on screen in
 * large type — to staff during a hard moment (the spec's "what to tell
 * the staff in one short sentence"). Nothing is sent; the parent shows/reads them.
 * They stay Hebrew on the screen, because they are for the staff.
 */
export const readySentences: string[] = he.readySentences

/**
 * Legitimate things a parent can ask the staff for (informational —
 * this does not send anything to staff; the parent chooses to ask).
 */
const requestIcons: Pick<StaffRequest, 'emoji'>[] = [
  { emoji: '🌙' },
  { emoji: '👤' },
  { emoji: '🗣️' },
  { emoji: '🙌' },
  { emoji: '⏱️' },
  { emoji: '💉' },
  { emoji: '🔇' },
  { emoji: '🖼️' },
]
export const staffRequests: StaffRequest[] = requestIcons.map((request, i) => ({ ...request, ...he.staffRequests[i] }))
