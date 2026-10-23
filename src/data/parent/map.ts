import { mapAreas } from '../map'
import type { MapArea } from '../types'
import mapTexts from './map.json'
import { keyed } from '../../lib/keyed'
import type { ParentLang } from './index'
import i18nUi from '../i18n/ui.json'
import { soundLabel } from '../careCard'

/** The map areas as the parent sees them: the code's area (id, emoji, sensory levels) with the parent texts on top */
export function parentMapAreas(lang: ParentLang): MapArea[] {
  const texts = keyed((mapTexts as unknown as Record<ParentLang, { areas: Record<string, Partial<MapArea>> }>)[lang], 'parent/map')
  return mapAreas.map((a) => ({ ...a, ...texts.areas[a.id] }) as MapArea)
}

export function parentLoadLabel(lang: ParentLang, load: MapArea['load']): string {
  return keyed((mapTexts as unknown as Record<ParentLang, { load: Record<string, string> }>)[lang], 'parent/map').load[load] ?? load
}

export function parentChannelLabel(lang: ParentLang, key: string): string {
  if (key === 'sound') return soundLabel(lang)
  return (i18nUi as unknown as Record<ParentLang, { text: { sensoryLabels: Record<string, string> } }>)[lang].text.sensoryLabels[key] ?? key
}
