import type { MapArea, SensoryLevels } from './types'

/**
 * Simple orientation map of a standard paediatric ER (module 2),
 * with a "sensory load" layer so a parent knows where it is calmer,
 * where it is busier, and what happens in each area.
 *
 * The per-channel `sensory` levels (0–5) are a first estimate to be
 * reviewed with Rotem/Hagit (Keren/Rotem feedback, K5).
 */
// the words of each area are in src/data/parent/map.json (parentMapAreas merges them in)
export const mapAreas: Omit<MapArea, 'name' | 'note' | 'next'>[] = [
  {
    id: 'entrance',
    emoji: '🚪',
    load: 'medium',
    sensory: { sound: 3, light: 3, smell: 1, people: 3 },
  },
  {
    id: 'triage',
    emoji: '🩺',
    load: 'medium',
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'waiting',
    emoji: '🪑',
    load: 'busy',
    sensory: { sound: 4, light: 3, smell: 1, people: 5 },
  },
  {
    id: 'doctor',
    emoji: '🧑‍⚕️',
    load: 'medium',
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'outside',
    emoji: '🌳',
    load: 'calm',
    sensory: { sound: 1, light: 2, smell: 1, people: 1 },
  },
  {
    id: 'quiet-room',
    emoji: '🌙',
    load: 'calm',
    sensory: { sound: 1, light: 1, smell: 0, people: 1 },
  },
  {
    id: 'treatment',
    emoji: '🛏️',
    load: 'medium',
    sensory: { sound: 2, light: 3, smell: 2, people: 2 },
  },
  {
    id: 'imaging',
    emoji: '📷',
    load: 'medium',
    sensory: { sound: 4, light: 2, smell: 1, people: 2 },
  },
  {
    id: 'ct',
    emoji: '🌀',
    load: 'medium',
    sensory: { sound: 4, light: 1, smell: 1, people: 1 },
  },
  {
    id: 'restroom',
    emoji: '🚻',
    load: 'medium',
    sensory: { sound: 3, light: 2, smell: 4, people: 2 },
  },
]

export const loadLabels: Record<MapArea['load'], { color: string }> = {
  calm: { color: 'var(--c-calm)' },
  medium: { color: 'var(--c-medium)' },
  busy: { color: 'var(--c-alert)' },
}

/** Highest per-channel sensory level. */
export const SENSORY_MAX = 5

/** The sensory channels shown per area, in display order. */
export const sensoryChannels: {
  key: keyof SensoryLevels
  emoji: string
}[] = [
  { key: 'sound', emoji: '🔊' },
  { key: 'light', emoji: '💡' },
  { key: 'smell', emoji: '👃' },
  { key: 'people', emoji: '👥' },
]

/**
 * Colour for a sensory level: green (little) → amber → red (a lot).
 * Hue goes from 130 (green) at 0 to 0 (red) at SENSORY_MAX.
 */
export function sensoryColor(level: number): string {
  const t = Math.max(0, Math.min(1, level / SENSORY_MAX))
  const hue = Math.round(130 * (1 - t))
  return `hsl(${hue} 68% 42%)`
}

/** Soft tint of the same hue, for the channel label behind dark text. */
export function sensoryColorSoft(level: number): string {
  const t = Math.max(0, Math.min(1, level / SENSORY_MAX))
  const hue = Math.round(130 * (1 - t))
  return `hsl(${hue} 60% 90%)`
}
