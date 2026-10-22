/**
 * "Quick adaptations card" (module 1 in the spec) — what the staff should
 * know about my child. Filled quickly by the parent (chips-first, so it
 * works even when arriving in a hurry), stored ONLY on this device with
 * a 1-day expiry, and shown to staff physically (screen or print).
 * Nothing is ever transmitted anywhere.
 */

import careI18n from './i18n/careCard.json'
import supportI18n from './i18n/support.json'

export interface CareCard {
  /** optional nickname — the app works without any identifying detail */
  nickname: string
  age: string
  communication: string[]
  sensitivities: string[]
  calming: string[]
  escalators: string[]
  hardMoments: string[]
  pain: string[]
  avoid: string[]
  /** per-section free text ("Other"), keyed by section — max 150 chars each */
  custom: Record<CardArrayField, string>
  /** the requests the parent picked for the staff (ids, see askIds; the text is in i18n/careCard.json) */
  asks: string[]
  freeNote: string
}

/** The requests the parent can pick. The Hebrew text is what the staff reads. */
export const askIds = ['noise', 'light', 'touch', 'staff', 'waiting', 'needle', 'sudden', 'micro', 'alt'] as const

export type CardArrayField =
  | 'communication'
  | 'sensitivities'
  | 'calming'
  | 'escalators'
  | 'hardMoments'
  | 'pain'
  | 'avoid'

/** Max length of each per-section "Other" free-text line. */
export const CUSTOM_MAX = 150

export const emptyCustom: Record<CardArrayField, string> = {
  communication: '',
  sensitivities: '',
  calming: '',
  escalators: '',
  hardMoments: '',
  pain: '',
  avoid: '',
}

export const emptyCard: CareCard = {
  nickname: '',
  age: '',
  communication: [],
  sensitivities: [],
  calming: [],
  escalators: [],
  hardMoments: [],
  pain: [],
  avoid: [],
  custom: { ...emptyCustom },
  asks: [],
  freeNote: '',
}

export interface CardSection {
  key: CardArrayField
  title: string
  emoji: string
  hint?: string
  options: string[]
}

// the section keys and icons; the Hebrew titles and options are in i18n/careCard.json (he)
const sectionMeta: { key: CardArrayField; emoji: string }[] = [
  { key: 'communication', emoji: '💬' },
  { key: 'sensitivities', emoji: '⚠️' },
  { key: 'calming', emoji: '💛' },
  { key: 'escalators', emoji: '⚡' },
  { key: 'hardMoments', emoji: '🩺' },
  { key: 'pain', emoji: '🤕' },
  { key: 'avoid', emoji: '🚫' },
]

export const cardSections: CardSection[] = sectionMeta.map((m, i) => ({
  ...m,
  title: (careI18n as unknown as { he: { cardSections: { title: string; options: string[] }[] } }).he.cardSections[i].title,
  options: (careI18n as unknown as { he: { cardSections: { title: string; options: string[] }[] } }).he.cardSections[i].options,
}))

/**
 * Marking a sensitivity/trigger opens matching adaptation suggestions
 * (the spec: "marking a sensitivity opens suggestions for matching adaptations").
 */
// the requests the card and the requests page share: their text is the page's title (one source)
const PAGE_ASK: Record<string, number> = { noise: 0, staff: 1, touch: 2, waiting: 4, needle: 5, light: 6, micro: 3, alt: 7 }

/** The text of every request id in the language: the page's title for the shared ones, the card's own for the rest. */
export function askTexts(lang: 'he' | 'en' | 'ru'): Record<string, string> {
  const own = (careI18n as unknown as Record<string, { asks: Record<string, string> }>)[lang].asks
  const page = (supportI18n as unknown as Record<string, { staffRequests: { title: string }[] }>)[lang].staffRequests
  const out: Record<string, string> = { ...own }
  for (const [id, i] of Object.entries(PAGE_ASK)) out[id] = page[i].title
  return out
}

// the suggestions: the requests whose answers the parent has ticked (askFor: request id → answers), in the order of askIds
export function suggestedAdaptations(
  card: CareCard,
  copy: { asks: Record<string, string> },
  askFor: Record<string, string[]>,
): string[] {
  const picked = [...card.sensitivities, ...card.escalators, ...card.hardMoments]
  return askIds
    .filter((id) => (askFor[id] ?? []).some((answer) => picked.includes(answer)))
    .map((id) => copy.asks[id])
    .filter(Boolean)
}

export function isCardEmpty(card: CareCard): boolean {
  return (
    !card.nickname.trim() &&
    !card.freeNote.trim() &&
    cardSections.every((s) => card[s.key].length === 0) &&
    cardSections.every((s) => !(card.custom?.[s.key] ?? '').trim()) &&
    (card.asks ?? []).length === 0
  )
}
