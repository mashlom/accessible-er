// Renders the SVG pictures of a world (scripts/art/build/<world>/*.svg) into PNGs, with the same Chromium the
// headless tests use: the pictures are then ordinary images for every browser (the SVG filters are costly to redraw
// on a phone, render differently in Safari, and turn black when an SVG is mirrored in Chrome).
//   node scripts/art/render.cjs <svg dir> <png dir>
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const [src, out] = process.argv.slice(2)
// the landscape map, the celebration picture and the sheet's floor are drawn at their own size (they are never shown
// larger); the others at twice their size, for sharp phone screens
const scaleOf = (name) => (/^(map-landscape|celebrate|sheet-floor)/.test(name) ? 1 : 2)

;(async () => {
  fs.mkdirSync(out, { recursive: true })
  const browser = await chromium.launch()
  const pages = {}
  for (const name of fs.readdirSync(src).filter((f) => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(src, name), 'utf8')
    const w = +svg.match(/width="(\d+)"/)[1]
    const h = +svg.match(/height="(\d+)"/)[1]
    const scale = scaleOf(name)
    if (!pages[scale]) pages[scale] = await (await browser.newContext({ deviceScaleFactor: scale })).newPage()
    const page = pages[scale]
    await page.setViewportSize({ width: w, height: h })
    await page.goto('file://' + path.resolve(src, name))
    await page.screenshot({ path: path.join(out, name.replace(/\.svg$/, '.png')), clip: { x: 0, y: 0, width: w, height: h }, omitBackground: true })
  }
  await browser.close()
})()
