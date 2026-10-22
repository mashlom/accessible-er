#!/usr/bin/env node
/**
 * The children's world texts as one table: a row per key, a column per world.
 * Writes docs/exports/worlds-<lang>.csv from src/data/child/worlds/<world>/texts.json.
 *
 *   node scripts/worlds-csv.mjs ru
 *
 * The file is UTF-8 with a byte-order mark, so Excel and Google Sheets read the letters right.
 * An empty cell means the world has no text for that key in that language.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const LANGS = ['he', 'en', 'ru']
const lang = process.argv[2]
if (!LANGS.includes(lang)) {
  console.error(`Usage: node scripts/worlds-csv.mjs <${LANGS.join('|')}>`)
  process.exit(1)
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WORLDS = path.join(ROOT, 'src/data/child/worlds')
const OUT = path.join(ROOT, 'docs/exports', `worlds-${lang}.csv`)

// the ocean first (the finished world), then the others in folder order
const worlds = fs.readdirSync(WORLDS, { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(WORLDS, e.name, 'texts.json')))
  .map((e) => e.name)
  .sort((a, b) => (a === 'ocean' ? -1 : b === 'ocean' ? 1 : a.localeCompare(b)))

const flat = (o) => {
  const out = new Map()
  const rec = (v, at) => {
    if (typeof v === 'string') out.set(at.join('.'), v)
    else if (Array.isArray(v)) v.forEach((x, i) => rec(x, [...at, String(i)]))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) rec(x, [...at, k])
  }
  rec(o, [])
  return out
}

const texts = Object.fromEntries(worlds.map((w) => {
  const data = JSON.parse(fs.readFileSync(path.join(WORLDS, w, 'texts.json'), 'utf8'))
  return [w, flat(data[lang] ?? {})]
}))

// rows by section, then in the order the keys first appear
const SECTIONS = ['name', 'stages', 'procedureNarratives', 'procedureSteps', 'procedureVariants', 'calmLines', 'distractTitle']
const rank = (k) => { const i = SECTIONS.indexOf(k.split('.')[0]); return i < 0 ? SECTIONS.length : i }
const keys = []
const seen = new Set()
for (const w of worlds) for (const k of texts[w].keys()) if (!seen.has(k)) { seen.add(k); keys.push(k) }
keys.sort((a, b) => rank(a) - rank(b))

// each world's column is titled with its own name in this language
const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`
const header = ['key', ...worlds.map((w) => texts[w].get('name') || w)]
const lines = [header.map(q).join(',')]
for (const k of keys) lines.push([k, ...worlds.map((w) => texts[w].get(k) ?? '')].map(q).join(','))

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, '﻿' + lines.join('\r\n') + '\r\n')

const empty = worlds.reduce((n, w) => n + keys.filter((k) => !(texts[w].get(k) ?? '').trim()).length, 0)
console.log(`${path.relative(ROOT, OUT)}: ${keys.length} keys × ${worlds.length} worlds, ${empty} empty cells`)
