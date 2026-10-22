import { useSyncExternalStore } from 'react'
import { keyLabel } from '../lib/keyIndex'
export type Language = 'he' | 'en' | 'ru'

const KEY = 'quest-lang'

// Each file in data/i18n (and the children's book texts, child/book/book.json) is a namespace named after the file: ocean.json → t('ocean.…').
const dictionaries: Record<string, Record<string, unknown>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<Record<string, unknown>>(['../data/i18n/*.json', '../data/child/book/book.json'], { eager: true, import: 'default' }),
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

// the technical 'text_name' switch: while it is on, t() returns the keys instead of the texts
const KEYS_KEY = 'quest-keys'
let showKeys = (() => { try { return sessionStorage.getItem(KEYS_KEY) === '1' } catch { return false } })()
export function keysOn() { return showKeys }
/** The language underneath (the texts of the technical language are looked up in it). */
export function currentLang(): Language { return enabled ? lang : 'he' }
export function setKeysOn(on: boolean) {
  showKeys = on
  try { sessionStorage.setItem(KEYS_KEY, on ? '1' : '0') } catch {}
  notify()
}

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

export function translate<T>(l: Language, key: string, fallback?: T): T {
  // without a fallback the text comes only from src/data/i18n (a missing one shows its key)
  if (fallback === undefined) {
    const v = lookup(l, key)
    return (v ?? key) as T
  }
  return l === 'he' ? fallback : merge(fallback, lookup(l, key))
}

export function useI18n() {
  const current = useSyncExternalStore(subscribe, snapshot)
  // re-render when the keys switch changes (the store notifies on every change)
  const keys = useSyncExternalStore(subscribe, () => showKeys)
  return {
    lang: current,
    setLang,
    dir: current === 'he' ? ('rtl' as const) : ('ltr' as const),
    // without a fallback the text is a string from src/data/i18n
    keysOn: keys,
    t: <T = string>(key: string, fallback?: T): T => {
      const text = translate(current, key, fallback)
      if (!keys || typeof text !== 'string') return text
      // the technical language: the key ('ui.buttons.back' is in i18n/ui.json) and how many times its text is stored
      const [ns, ...path] = key.split('.')
      return keyLabel(`i18n/${ns}:${path.join('.')}`, text, current) as unknown as T
    },
  }
}
