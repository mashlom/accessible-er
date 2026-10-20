import { paths } from '../paths'
import texts from './paths.json'
import type { VisitPath } from '../types'

/**
 * The reasons for the visit as the parent sees them: the label, the short description and the stops of the route
 * come from src/data/parent/paths.json (all languages); the ids, emoji and procedure links stay in src/data/paths.ts.
 */
export function parentPaths(lang: 'he' | 'en' | 'ru'): VisitPath[] {
  const tx = (texts as unknown as Record<'he' | 'en' | 'ru', Record<string, { label: string; blurb: string; route: string[] }>>)
  return paths.map((p) => {
    const x = tx[lang]?.[p.id] ?? tx.he[p.id]
    return {
      ...p,
      label: x.label,
      blurb: x.blurb,
      route: p.route.map((stop, i) => ({ ...stop, title: x.route[i] ?? '' })),
    }
  })
}
