/**
 * Every text of src/data in one language, mapped to the keys it is stored
 * under ("file:path"). The technical 'text_name' language uses it to name
 * the texts and to count how many times the same text is stored.
 */
type Lang = 'he' | 'en' | 'ru'
export type KeyIndex = Map<string, string[]>

const files = import.meta.glob<Record<string, unknown>>('../data/**/*.json', { eager: true, import: 'default' })
const indexes: Partial<Record<Lang, KeyIndex>> = {}

export function keyIndex(lang: Lang): KeyIndex {
  if (indexes[lang]) return indexes[lang] as KeyIndex
  const index: KeyIndex = new Map()
  for (const [path, data] of Object.entries(files)) {
    const name = path.replace(/^\.\.\/data\//, '').replace(/\.json$/, '')
    const tree = (data as Record<string, unknown>)?.[lang]
    if (!tree) continue
    const walk = (o: unknown, at: string[]) => {
      if (typeof o === 'string') {
        const text = o.trim()
        if (!text) return
        const list = index.get(text) ?? []
        list.push(`${name}:${at.join('.')}`)
        index.set(text, list)
      } else if (Array.isArray(o)) o.forEach((v, i) => walk(v, [...at, String(i)]))
      else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, [...at, k])
    }
    walk(tree, [])
  }
  indexes[lang] = index
  return index
}

/** A key as the screen shows it: its name, and how many times its text is stored when more than once. */
export function keyLabel(key: string, text: unknown, lang: Lang): string {
  const n = typeof text === 'string' ? keyIndex(lang).get(text.trim())?.length ?? 1 : 1
  return (n > 1 ? `${key} ×${n}` : key) + '\u00a0'
}

/** A text on the screen that is already a key label (so it is not looked up again). */
export const KEY_LABEL = /^[\w./-]+:[\w.\-]+( ×\d+)?$/
