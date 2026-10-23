import { paths } from '../paths'
import texts from './paths.json'
import { parentJourney } from './index'
import type { VisitPath } from '../types'

/**
 * The reasons for the visit as the parent sees them: the label, the short description and the stops of the route
 * come from src/data/parent/paths.json (all languages); the ids, emoji and procedure links stay in src/data/paths.ts.
 */
export function parentPaths(lang: 'he' | 'en' | 'ru'): VisitPath[] {
  const tx = (texts as unknown as Record<'he' | 'en' | 'ru', Record<string, { label: string; blurb: string; route: string[] }>>)
  const stations = parentJourney(lang)
  return paths.map((p) => {
    const x = tx[lang]?.[p.id] ?? tx.he[p.id]
    // the station stops take the station's title; the other stops have their own, in order
    let own = 0
    return {
      ...p,
      label: x.label,
      blurb: x.blurb,
      route: p.route.map((stop) => {
        if (stop.stageId) return { ...stop, title: stations.find((s) => s.id === stop.stageId)?.title ?? '' }
        return { ...stop, title: x.route[own++] ?? '' }
      }),
    }
  })
}
