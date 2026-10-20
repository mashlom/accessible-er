import type { RoniMood } from '../../components/Roni'
import parentUi from '../../data/parent/ui.json'

type Lang = 'he' | 'en' | 'ru'
export interface CompanionLine {
  text: string
  mood: RoniMood
}

/**
 * What Roni says on each screen. He is present everywhere in this concept,
 * so the line has to change with the place — otherwise he stops being a
 * companion and becomes decoration. The texts come from parent/ui.json
 * (companion.route, companion.tap) in the chosen language; the moods stay here.
 *
 * Keys are the path inside the concept ('' = the concept's home screen).
 */
const moods: Record<string, RoniMood> = {
  '': 'wave',
  reason: 'curious',
  trail: 'happy',
  show: 'curious',
  map: 'calm',
  calm: 'hug',
  distract: 'calm',
  requests: 'happy',
  card: 'curious',
  'card/view': 'proud',
  'going-home': 'sleepy',
  message: 'happy',
  feedback: 'proud',
  settings: 'calm',
}
const tapMoods: RoniMood[] = ['happy', 'hug', 'calm', 'cheer', 'sleepy', 'curious', 'proud', 'wave']

const texts = (lang: Lang) =>
  ((parentUi as unknown as Record<Lang, { companion: { route: Record<string, string>; tap: string[] } }>)[lang] ??
    (parentUi as unknown as Record<'he', { companion: { route: Record<string, string>; tap: string[] } }>).he).companion

export function lineFor(subPath: string, lang: Lang = 'he'): CompanionLine {
  const route = texts(lang).route
  // procedure story pages: /show/:id
  const key = moods[subPath] ? subPath : subPath.startsWith('show/') ? 'show/' : ''
  return { text: route[key] ?? route[''], mood: moods[key] ?? 'wave' }
}

/** Said when the child taps Roni — a small dose of agency and play. */
export function tapLinesFor(lang: Lang = 'he'): CompanionLine[] {
  return texts(lang).tap.map((text, i) => ({ text, mood: tapMoods[i] }))
}
