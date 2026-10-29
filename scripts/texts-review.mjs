// Export every text of the site to one Excel workbook for the translation review.
//
//   npm run texts-review   →   docs/exports/texts-review.xlsx
//
// One tab per page of the site (or per world, book or shared group), one row per text key.
// Each text sits in exactly one tab (the page that shows it); texts used on many pages go to "Shared".
// Cell A1 of each tab links to the page on the site, named in Hebrew (the site's own words).
// Columns: key, Hebrew, Comment, Status, English, Russian, Arabic, Amharic (Hebrew is reviewed first).
// The last tab ("All texts (tech.)") lists every row of every tab one after another, for sorting and filters.
// All names come from the data, so the script holds no site text of its own.

import { readFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'src/data')
const OUT = join(ROOT, 'docs/exports/texts-review.xlsx')
const SITE = 'https://accessible-er.mashlom.me/#'
const RLM = '‏' // keeps a trailing question mark on the right in Hebrew text

const read = (rel) => JSON.parse(readFileSync(join(DATA, rel), 'utf8'))
const ui = read('i18n/ui.json')
const home = read('parent/home.json')
const talk = read('parent/talk.json')
const parentTexts = read('parent/texts.json')
const worldName = (id) => read(`child/worlds/${id}/texts.json`).he.name

// the tabs in order: English tab name, Hebrew page name (from the data), route on the site
const WORLDS = [['dinosaurs', 'dino'], ['dollhouse', 'dollhouse'], ['fairy tale', 'fairy'], ['knights', 'knight'], ['ocean', 'ocean'], ['safari', 'safari'], ['space', 'space']]
const TABS = [
  ['01 Home', home.he.title, '/story'],
  ['02 Visit reason', ui.he.tiles.reason.title, '/story/reason'],
  ['03 Our trail', ui.he.tiles.journey.title, '/story/trail'],
  ['04 Wait times', ui.he.tiles['wait-times'].title, '/story/wait-times'],
  ['05 How we prepare', ui.he.tiles.procedures.title, '/story/show'],
  ['06 Map', ui.he.tiles.map.title, '/story/map'],
  ['07 Calm', ui.he.tiles.calm.title, '/story/calm'],
  ['08 Distraction', ui.he.tiles.distract.title, '/story/distract'],
  ['09 Requests', ui.he.tiles.requests.title, '/story/requests'],
  ['10 Going home', ui.he.tiles.discharge.title, '/story/going-home'],
  ['11 Message to staff', ui.he.tiles.message.title, '/story/message'],
  ['12 Feedback', ui.he.tiles.feedback.title, '/story/feedback'],
  ['13 Care card', ui.he.tiles.card.title, '/card'],
  ['14 Chat with Roni', talk.he.ui.roni, '/talk'],
  ...WORLDS.map(([en, id]) => [`World - ${en}`, worldName(id), `/quest/${id}/map`]),
  ['Parent procedures', parentTexts.he.procedures.temperature.title, '/story/show/temperature'],
  ['Child procedures', worldName('ocean'), '/quest/ocean/procedures'],
  ['Book - main', ui.he.books.tabs.picture, '/book'],
  ['Book with Roni', ui.he.books.tabs.roni, '/book/story'],
  ['Real book', ui.he.books.tabs.real, '/book/real'],
  ['Shared', home.he.title, '/story'],
]

// which tab a key belongs to: by its file and its first part
const HOME = { reasonAsk: '02 Visit reason', reasonLabel: '02 Visit reason', reasonChange: '02 Visit reason', reason: '02 Visit reason', trail: '03 Our trail', wait: '04 Wait times', show: '05 How we prepare', mapPage: '06 Map', goingHome: '10 Going home', cardPage: '13 Care card' }
const UI = { careView: '13 Care card', card: '13 Care card', cardView: '13 Care card', circles: 'Real book', tiles: '01 Home', procedurePage: 'Parent procedures', storyCalm: '07 Calm', storyDistract: '08 Distraction', storyRequests: '09 Requests', storyFeedback: '12 Feedback', storyMessage: '11 Message to staff', books: 'Book - main' }
function tabFor(file, key) {
  const top = key.split('.')[0]
  if (file === 'parent/home') return HOME[top] ?? '01 Home'
  if (file === 'parent/talk') return '14 Chat with Roni'
  if (file === 'parent/map') return '06 Map'
  if (file === 'parent/paths') return '02 Visit reason'
  if (file === 'parent/texts') return top === 'stages' ? '03 Our trail' : 'Parent procedures'
  if (file === 'i18n/ui') return UI[top] ?? 'Shared'
  if (file === 'i18n/support') return top === 'staffRequests' ? '09 Requests' : '07 Calm'
  if (file === 'i18n/careCard') return '13 Care card'
  if (file === 'child/book/book') return 'Book - main'
  if (file === 'child/book/roni') return 'Book with Roni'
  if (file.startsWith('child/book/')) return 'Real book'
  if (file === 'child/procedures/texts') return 'Child procedures'
  if (file === 'child/ui') return 'Shared'
  const world = file.match(/^child\/worlds\/([^/]+)\/texts$/)
  if (world) return `World - ${WORLDS.find(([, id]) => id === world[1])[0]}`
  throw new Error(`no tab for ${file}`)
}

// every text leaf of a language, as [key, text]
function* leaves(node, path = '') {
  if (typeof node === 'string') yield [path, node]
  else if (Array.isArray(node)) for (const [i, v] of node.entries()) yield* leaves(v, `${path}.${i}`)
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) yield* leaves(v, path ? `${path}.${k}` : k)
}
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.json') ? [join(dir, e.name)] : []))

const rows = Object.fromEntries(TABS.map(([tab]) => [tab, []]))
for (const path of files(DATA)) {
  const json = JSON.parse(readFileSync(path, 'utf8'))
  if (!json.he) continue
  const file = relative(DATA, path).replace(/\.json$/, '')
  const en = Object.fromEntries(leaves(json.en ?? {}))
  const ru = Object.fromEntries(leaves(json.ru ?? {}))
  for (const [key, he] of leaves(json.he)) {
    rows[tabFor(file, key)].push({ id: `${file.replace(/\//g, '.')}.${key}`, he, en: en[key] ?? '', ru: ru[key] ?? '' })
  }
}

// the language names come from the data; Arabic and Amharic are not on the site yet
const LANG = ui.he.language
const HEAD = ['', LANG.he, 'Comment', 'Status', LANG.en, LANG.ru, 'العربية', 'አማርኛ']
const WIDTHS = [34, 50, 30, 14, 50, 50, 50, 50]
const RTL = [2, 7] // Hebrew and Arabic
const FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } }
const top = { vertical: 'top', wrapText: true }
const rtl = { horizontal: 'right', vertical: 'top', wrapText: true, readingOrder: 'rtl' }

function addSheet(wb, name, head, widths, rtlCols, data, frozen) {
  const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', xSplit: frozen, ySplit: 1 }] })
  ws.columns = widths.map((width) => ({ width }))
  ws.addRow(head)
  for (const row of data) ws.addRow(row)
  ws.eachRow((row, r) => row.eachCell({ includeEmpty: true }, (cell, c) => {
    cell.alignment = rtlCols.includes(c) ? rtl : top
    if (r === 1) { cell.font = { bold: true }; cell.fill = FILL }
  }))
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: head.length } }
  return ws
}

const wb = new ExcelJS.Workbook()
for (const [tab, page, route] of TABS) {
  const ws = addSheet(wb, tab, HEAD, WIDTHS, RTL, rows[tab].map((r) => [r.id, r.he, '', 'proposed', r.en, r.ru, '', '']), 1)
  const a1 = ws.getCell('A1')
  a1.value = { text: page + RLM, hyperlink: SITE + route }
  a1.font = { bold: true, color: { argb: 'FF0563C1' }, underline: true }
  a1.alignment = rtl
}
addSheet(wb, 'All texts (tech.)', ['Tab', 'Key', ...HEAD.slice(1)], [26, ...WIDTHS], RTL.map((c) => c + 1),
  TABS.flatMap(([tab]) => rows[tab].map((r) => [tab, r.id, r.he, '', 'proposed', r.en, r.ru, '', ''])), 2)

mkdirSync(dirname(OUT), { recursive: true })
await wb.xlsx.writeFile(OUT)
const total = Object.values(rows).reduce((n, r) => n + r.length, 0)
console.log(`texts-review: ${total} texts in ${TABS.length} tabs (+ all texts) → ${relative(ROOT, OUT)}`)
