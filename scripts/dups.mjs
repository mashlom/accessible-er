#!/usr/bin/env node
/**
 * Duplicate texts in src/data: the same text stored under more than one key
 * in the same language. Keys follow the same "file:path" naming as the
 * technical 'text_name' language (src/lib/keyIndex.ts).
 *
 *   npm run dups            print the table of duplicates
 *   npm run dups -- --check fail when a key holds a duplicate that is not in
 *                           scripts/dups-allowed.json (run by `npm run build`)
 *   npm run dups -- --update write the current duplicates as the allowed list
 *
 * The allowed list holds the duplicates kept on purpose (the same words in
 * different flows may drift apart) and the ones still waiting for a decision.
 * Removing a duplicate needs no update; adding one does.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = path.join(ROOT, 'src/data')
const ALLOWED = path.join(ROOT, 'scripts/dups-allowed.json')
const LANGS = ['he', 'en', 'ru']

function jsonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return jsonFiles(p)
    return e.name.endsWith('.json') ? [p] : []
  })
}

/** lang → text → keys, for texts with at least one letter (ids, emoji and numbers are not texts) */
function index() {
  const out = Object.fromEntries(LANGS.map((l) => [l, new Map()]))
  for (const file of jsonFiles(DATA).sort()) {
    const name = path.relative(DATA, file).replace(/\\/g, '/').replace(/\.json$/, '')
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    for (const lang of LANGS) {
      const walk = (o, at) => {
        if (typeof o === 'string') {
          const text = o.trim()
          if (!/\p{L}/u.test(text)) return
          const map = out[lang]
          map.set(text, [...(map.get(text) ?? []), `${name}:${at.join('.')}`])
        } else if (Array.isArray(o)) o.forEach((v, i) => walk(v, [...at, String(i)]))
        else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, [...at, k])
      }
      if (data?.[lang]) walk(data[lang], [])
    }
  }
  return out
}

/** lang → [{ text, keys }] for every text stored more than once */
function duplicates() {
  const idx = index()
  return Object.fromEntries(
    LANGS.map((l) => [
      l,
      [...idx[l]].filter(([, keys]) => keys.length > 1).map(([text, keys]) => ({ text, keys })),
    ]),
  )
}

const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--update') ? 'update' : 'print'
const dups = duplicates()

if (mode === 'update') {
  const allowed = Object.fromEntries(LANGS.map((l) => [l, dups[l].flatMap((d) => d.keys).sort()]))
  fs.writeFileSync(ALLOWED, JSON.stringify(allowed, null, 2) + '\n')
  console.log(`dups: wrote ${LANGS.map((l) => `${allowed[l].length} ${l}`).join(', ')} allowed keys to scripts/dups-allowed.json`)
} else if (mode === 'check') {
  const allowed = JSON.parse(fs.readFileSync(ALLOWED, 'utf8'))
  const fresh = []
  for (const l of LANGS) {
    const ok = new Set(allowed[l] ?? [])
    for (const d of dups[l]) {
      const added = d.keys.filter((k) => !ok.has(k))
      if (added.length) fresh.push({ lang: l, text: d.text, added, keys: d.keys })
    }
  }
  if (fresh.length) {
    console.error(`dups: ${fresh.length} new duplicate text(s). Read the text from the key that already has it, or, if the copy is on purpose, run "npm run dups -- --update".`)
    for (const f of fresh) console.error(`  [${f.lang}] "${f.text.slice(0, 60)}"\n      new: ${f.added.join(', ')}\n      all: ${f.keys.join(', ')}`)
    process.exit(1)
  }
  console.log('dups: no new duplicate texts')
} else {
  for (const l of LANGS) {
    const rows = dups[l].sort((a, b) => b.keys.length - a.keys.length)
    console.log(`\n${l}: ${rows.length} texts stored more than once, ${rows.reduce((s, d) => s + d.keys.length - 1, 0)} extra copies`)
    for (const d of rows) console.log(`  ×${d.keys.length}  ${d.text.slice(0, 50)}\n        ${d.keys.join(', ')}`)
  }
}
