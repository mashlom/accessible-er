import { mapAreas, loadLabels, sensoryChannels } from '../map'
import type { MapArea } from '../types'
import mapTexts from './map.json'
import type { ParentLang } from './index'

/** The map areas as the parent sees them: the code's area (id, emoji, sensory levels) with the parent texts on top */
export function parentMapAreas(lang: ParentLang): MapArea[] {
  const texts = (mapTexts as unknown as Record<ParentLang, { areas: Record<string, Partial<MapArea>> }>)[lang]
  return mapAreas.map((a) => ({ ...a, ...texts.areas[a.id] }))
}

export function parentLoadLabel(lang: ParentLang, load: MapArea['load']): string {
  return (mapTexts as unknown as Record<ParentLang, { load: Record<string, string> }>)[lang].load[load] ?? loadLabels[load].label
}

export function parentChannelLabel(lang: ParentLang, key: string): string {
  const fallback = sensoryChannels.find((c) => c.key === key)?.label ?? key
  return (mapTexts as unknown as Record<ParentLang, { channels: Record<string, string> }>)[lang].channels[key] ?? fallback
}
