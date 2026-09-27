import { useSyncExternalStore } from 'react'
export type Language = 'he' | 'en' | 'ru'

const KEY = 'quest-lang'

// Each file in data/i18n is a namespace named after the file: ocean.json → t('ocean.…').
const dictionaries: Record<string, Record<string, unknown>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<Record<string, unknown>>('../data/i18n/*.json', { eager: true, import: 'default' }),
  ).map(([path, data]) => [path.replace(/^.*\/(.+)\.json$/, '$1'), data]),
)

function readLang(): Language {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === 'en' || v === 'ru' ? v : 'he'
  } catch {
    return 'he'
  }
}

let lang: Language = readLang()
let enabled = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const snapshot = () => (enabled ? lang : 'he')

export function setLang(next: Language) {
  lang = next
  try { sessionStorage.setItem(KEY, next) } catch {}
  notify()
}

/** Translations apply only where a scope (the ocean world) switches them on; elsewhere the app stays Hebrew. */
export function setI18nEnabled(on: boolean) {
  if (enabled === on) return
  enabled = on
  notify()
}

function lookup(l: Language, key: string): unknown {
  const [ns, ...path] = key.split('.')
  let v: unknown = (dictionaries[ns] as Record<string, unknown> | undefined)?.[l]
  for (const k of path) v = (v as Record<string, unknown> | undefined)?.[k]
  return v
}

// Overlays a translation onto the Hebrew original: strings are replaced, arrays of items
// with an `id` may be translated as an object keyed by id, untranslated fields keep Hebrew.
function merge<T>(orig: T, tr: unknown): T {
  if (tr == null) return orig
  if (typeof orig === 'string') return (typeof tr === 'string' && tr ? tr : orig) as T
  if (Array.isArray(orig)) {
    if (Array.isArray(tr)) return orig.map((o, i) => merge(o, tr[i])) as T
    if (typeof tr === 'object')
      return orig.map((o) =>
        o && typeof o === 'object' && 'id' in o ? merge(o, (tr as Record<string, unknown>)[(o as { id: string }).id]) : o,
      ) as T
    return orig
  }
  if (orig && typeof orig === 'object' && typeof tr === 'object') {
    const out = { ...orig } as Record<string, unknown>
    for (const k of Object.keys(tr as object)) out[k] = k in out ? merge(out[k], (tr as Record<string, unknown>)[k]) : (tr as Record<string, unknown>)[k]
    return out as T
  }
  return orig
}

export function translate<T>(l: Language, key: string, fallback: T): T {
  return l === 'he' ? fallback : merge(fallback, lookup(l, key))
}

export function useI18n() {
  const current = useSyncExternalStore(subscribe, snapshot)
  return {
    lang: current,
    setLang,
    dir: current === 'he' ? ('rtl' as const) : ('ltr' as const),
    t: <T,>(key: string, fallback: T): T => translate(current, key, fallback),
  }
}
