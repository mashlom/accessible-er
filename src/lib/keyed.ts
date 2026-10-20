import { currentLang, keysOn } from '../hooks/useI18n'
import { keyLabel } from './keyIndex'

// fields that are ids or codes, not texts: they keep their value in the technical language
const NOT_TEXT = new Set(['id', 'stage', 'go', 'key', 'emoji', 'icon', 'load', 'waitKind', 'kind', 'mood'])

/**
 * The texts of a JSON file as the code reads them. In the technical
 * 'text_name' language every text is replaced by its key ("file:path"), so
 * the screen shows exactly where each text comes from; otherwise the texts
 * are returned as they are.
 */
export function keyed<T>(tree: T, file: string): T {
  if (!keysOn() || tree == null) return tree
  const lang = currentLang()
  const walk = (o: unknown, at: string[]): unknown => {
    if (typeof o === 'string') return keyLabel(`${file}:${at.join('.')}`, o, lang)
    if (Array.isArray(o)) return o.map((v, i) => walk(v, [...at, String(i)]))
    if (o && typeof o === 'object')
      return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, NOT_TEXT.has(k) ? v : walk(v, [...at, k])]))
    return o
  }
  return walk(tree, []) as T
}
