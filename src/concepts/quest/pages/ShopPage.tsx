import { useEffect, useRef, useState } from 'react'
import { useGoBackTo } from '../../nav'
import { WORLD_SELECT } from '../components/WorldScope'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { pageFontsCss } from '../../../components/careCard/saveCardPdf'
import { worldText, type WorldLang } from '../../../data/child/worlds'
import { WorldTopRow } from '../components/WorldTopRow'
import { useMoreBelowPage } from '../useMoreBelow'
import { ButtonIcon, withoutEmoji } from '../components/ButtonIcon'
import css from '../quest.module.css'

/**
 * What each thing costs, set by the stars the child has: four things together cost exactly the stars (so four can
 * always be bought and every star spent), and the others a little more (so a fifth is always too dear). With fewer
 * than four stars the cheap things cost one star each. Cheap and dear things alternate along the world's list.
 * Checked for 1 to 30 stars, with 7 or 8 things.
 */
function pricesFor(stars: number, n: number): number[] {
  const base = Math.floor(stars / 4)
  const rest = stars % 4
  const cheap = [...Array(rest).fill(Math.max(1, base + 1)), ...Array(4 - rest).fill(Math.max(1, base))].sort((a, b) => a - b)
  const b = Math.max(1, base)
  const dear = [b + 1, b + 2, b + 2, b + 3]
  return [cheap[0], dear[0], cheap[1], dear[1], cheap[2], dear[2], cheap[3], dear[3]].slice(0, n)
}
/** At most this many things go on the sheet next to the doll */
const MAX_ITEMS = 4
/** The colouring sheet: landscape A4 in CSS px (96 per inch), its margin, and the doll 18 cm tall, so that it fits
 *  on one half of the sheet (A5). Every picture is printed at the doll's reduction: one factor for all. */
const MM = 96 / 25.4
const PAGE_W = Math.round(297 * MM)
const PAGE_H = Math.round(210 * MM)
const MARGIN = Math.round(10 * MM)
const GAP = Math.round(4 * MM)
const DOLL_H = Math.round(180 * MM)
/** A world without a doll (the dinosaurs): its pictures as if a doll were this tall in the files (px) */
const NO_DOLL_H = 1200

type Size = { w: number; h: number }
type Placed = { id: string; x: number; y: number; w: number; h: number }

/** The page as a grid of small cells (px): the pieces may not touch each other's drawn lines (their see-through
 *  parts may overlap), so a piece can stand beside the doll's head, between its arms and legs */
const CELL = 4

/** Which cells of a picture are drawn, at its size on the page, made a little wider so pieces keep a gap */
type Mask = { cw: number; ch: number; on: Uint8Array }

async function maskOf(src: string, w: number, h: number): Promise<Mask> {
  const cw = Math.ceil(w / CELL), ch = Math.ceil(h / CELL)
  // waiting for the load, not decode(): a page in a background tab never finishes decode()
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`cannot load ${src}`))
    img.src = src
  })
  const c = document.createElement('canvas')
  c.width = cw
  c.height = ch
  const g = c.getContext('2d')!
  g.drawImage(img, 0, 0, cw, ch)
  const a = g.getImageData(0, 0, cw, ch).data
  const raw = new Uint8Array(cw * ch)
  for (let i = 0; i < cw * ch; i++) raw[i] = a[i * 4 + 3] > 16 ? 1 : 0
  // the gap: every drawn cell also takes its neighbours
  const r = Math.ceil(GAP / 2 / CELL)
  const on = new Uint8Array(cw * ch)
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) if (raw[y * cw + x])
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const yy = y + dy, xx = x + dx
      if (yy >= 0 && yy < ch && xx >= 0 && xx < cw) on[yy * cw + xx] = 1
    }
  return { cw, ch, on }
}

/**
 * Lays the doll and the pieces out on landscape A4 pages, all at one scale (the doll's): the doll stands at the start
 * edge; every piece, the biggest first, takes the first place where its drawing touches no other drawing (the feet's
 * from the bottom up, the others from the top down). Only a piece that finds no place goes on a next page.
 */
async function layOut(
  doll: Size | null,
  pieces: { id: string; size: Size; place?: 'head' | 'feet' }[],
  src: (id: string) => string,
  rtl: boolean,
): Promise<Placed[][]> {
  const k = DOLL_H / (doll?.h ?? NO_DOLL_H)
  const gw = Math.floor(PAGE_W / CELL), gh = Math.floor(PAGE_H / CELL)
  const m = Math.ceil(MARGIN / CELL)
  const grids: Uint8Array[] = []
  const pages: Placed[][] = []
  const newPage = () => { grids.push(new Uint8Array(gw * gh)); pages.push([]); return pages.length - 1 }
  const stamp = (pi: number, mask: { cw: number; ch: number; on: Uint8Array }, cx: number, cy: number) => {
    for (let y = 0; y < mask.ch; y++) for (let x = 0; x < mask.cw; x++)
      if (mask.on[y * mask.cw + x]) grids[pi][(cy + y) * gw + cx + x] = 1
  }
  const fits = (pi: number, mask: { cw: number; ch: number; on: Uint8Array }, cx: number, cy: number) => {
    const g = grids[pi]
    for (let y = 0; y < mask.ch; y++) {
      const row = (cy + y) * gw + cx
      for (let x = 0; x < mask.cw; x++) if (mask.on[y * mask.cw + x] && g[row + x]) return false
    }
    return true
  }
  newPage()
  if (doll) {
    const w = Math.round(doll.w * k), y = Math.round((PAGE_H - DOLL_H) / 2)
    pages[0].push({ id: 'doll', x: MARGIN, y, w, h: DOLL_H })
    stamp(0, await maskOf(src('doll'), w, DOLL_H), m, Math.round(y / CELL))
  }
  // the head's pieces choose their corners first, then the feet's, then the rest; the bigger first within each
  const rank = (p: { place?: 'head' | 'feet' }) => (p.place === 'head' ? 0 : p.place === 'feet' ? 1 : 2)
  const sorted = [...pieces].sort((a, b) => rank(a) - rank(b) || b.size.w * b.size.h - a.size.w * a.size.h)
  const masks: Record<string, Mask> = {}
  if (doll) masks.doll = await maskOf(src('doll'), pages[0][0].w, pages[0][0].h)
  // the four corners of the page's free part (beside the doll), in cells: the head's pieces take the top ones, the
  // feet's the bottom ones, the rest what is left; a piece that does not fit in a corner looks for any free place
  const left = doll ? Math.ceil((MARGIN + pages[0][0].w + GAP) / CELL) : m
  const corners = { tl: true, tr: true, bl: true, br: true }
  const cornerAt = (c: keyof typeof corners, mk: Mask) => ({
    cx: c === 'tl' || c === 'bl' ? left : gw - m - mk.cw,
    cy: c === 'tl' || c === 'tr' ? m : gh - m - mk.ch,
  })
  for (const p of sorted) {
    const w = Math.round(p.size.w * k), h = Math.round(p.size.h * k)
    const mask = await maskOf(src(p.id), w, h)
    const prefer: (keyof typeof corners)[] =
      p.place === 'feet' ? ['bl', 'br', 'tl', 'tr'] : ['tl', 'tr', 'bl', 'br']
    const corner = prefer.find((c) => {
      if (!corners[c]) return false
      const at = cornerAt(c, mask)
      return at.cx >= m && at.cy >= m && fits(0, mask, at.cx, at.cy)
    })
    if (corner) {
      corners[corner] = false
      const at = cornerAt(corner, mask)
      stamp(0, mask, at.cx, at.cy)
      pages[0].push({ id: p.id, x: at.cx * CELL, y: at.cy * CELL, w, h })
      masks[p.id] = mask
      continue
    }
    const ys: number[] = []
    for (let cy = m; cy + mask.ch <= gh - m; cy += 2) ys.push(cy)
    if (p.place === 'feet') ys.reverse()
    let spot: { pi: number; cx: number; cy: number } | null = null
    for (let pi = 0; pi < pages.length && !spot; pi++)
      for (const cy of ys) {
        for (let cx = m; cx + mask.cw <= gw - m; cx += 2) if (fits(pi, mask, cx, cy)) { spot = { pi, cx, cy }; break }
        if (spot) break
      }
    if (!spot) spot = { pi: newPage(), cx: m, cy: m }
    stamp(spot.pi, mask, spot.cx, spot.cy)
    pages[spot.pi].push({ id: p.id, x: spot.cx * CELL, y: spot.cy * CELL, w, h })
    masks[p.id] = mask
  }
  // Hebrew reads from the right: the doll stands at the right edge
  return rtl ? pages.map((pg) => pg.map((it) => ({ ...it, x: PAGE_W - it.x - it.w }))) : pages
}

/** Each page drawn by the browser, taken as a picture, one landscape A4 page of the PDF each. Nothing leaves the device. */
async function savePagesPdf(nodes: HTMLElement[], fileName: string) {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')])
  await document.fonts.ready
  const fontEmbedCSS = await pageFontsCss()
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' })
  for (const [i, node] of nodes.entries()) {
    const jpeg = await toJpeg(node, { pixelRatio: 3, quality: 0.92, backgroundColor: '#fff', fontEmbedCSS })
    if (i > 0) doc.addPage('a4', 'landscape')
    doc.addImage(jpeg, 'JPEG', 0, 0, 297, 210)
  }
  doc.save(`${fileName}.pdf`)
}

/**
 * The shop (issue #50): the stars earned at the stations buy black-and-white paper-doll pieces of the world, and the
 * family prints them on an A4 sheet to colour in, cut out and play with at home. The sheet is made on the device as a
 * PDF; nothing is sent anywhere.
 */
export function ShopPage() {
  const { theme } = useQuestTheme()
  if (!theme.shop || !theme.design) return <OldShop />
  return <WorldShop />
}

function WorldShop() {
  useMoreBelowPage()
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const goBackTo = useGoBackTo()
  const { doneProcedures } = useQuestProgress()
  const shop = theme.shop!
  const stars = doneProcedures.size
  const prices = pricesFor(stars, shop.items.length)
  const price = (id: string) => prices[shop.items.indexOf(id)]
  const [chosen, setChosen] = useState<string[]>([])
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const handleRef = useRef<HTMLHeadingElement>(null)
  const pagesRef = useRef<(HTMLDivElement | null)[]>([])
  // the pictures' own sizes (px in the files): they set every piece's size on the sheet, at the doll's scale
  const [sizes, setSizes] = useState<Record<string, Size>>({})
  const texts = worldText(theme.id, lang as WorldLang)
  const name = (id: string) => texts?.shop?.[id] ?? id
  const picture = (id: string) => `${import.meta.env.BASE_URL}worlds/${theme.id}/shop/${id}.webp`
  const left = stars - chosen.reduce((sum, id) => sum + price(id), 0)
  const close = () => goBackTo('/celebrate')

  useEffect(() => {
    handleRef.current?.focus()
  }, [])

  useEffect(() => {
    for (const id of [...(shop.doll ? ['doll'] : []), ...chosen]) {
      if (sizes[id]) continue
      const im = new Image()
      im.onload = () => setSizes((s) => ({ ...s, [id]: { w: im.naturalWidth, h: im.naturalHeight } }))
      im.src = picture(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen])
  const ready = (!shop.doll || sizes.doll) && chosen.every((id) => sizes[id])
  const [pages, setPages] = useState<Placed[][]>([])
  const key = ready ? chosen.join(',') + lang : ''
  useEffect(() => {
    if (!key) return setPages([])
    let live = true
    layOut(shop.doll ? sizes.doll : null, chosen.map((id) => ({ id, size: sizes[id], place: shop.place?.[id] })), picture, lang === 'he')
      .then((p) => live && setPages(p))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < MAX_ITEMS && price(id) <= left ? [...c, id] : c))

  const save = async () => {
    const nodes = pagesRef.current.slice(0, pages.length).filter((n): n is HTMLDivElement => !!n)
    if (!nodes.length) return
    setState('saving')
    try {
      await savePagesPdf(nodes, `${texts?.name ?? theme.id} - colouring`)
      setState('saved')
    } catch {
      setState('failed')
    }
  }

  return (
    // the shop is a page of its own, the whole screen
    <div className={css.shopFull}>
      <WorldTopRow light />
      <main className={css.shopBody} aria-labelledby="shop-title">
          <h1 id="shop-title" ref={handleRef} tabIndex={-1} className={css.stageSheetTitle} style={{ color: theme.accent }}>{t('ui.shop.title')}</h1>
          {/* the stars still to spend */}
          <p className={css.celebrateCoins} role="img" aria-label={t('ui.shop.left').replace('{n}', String(left))}>
            {Array.from({ length: Math.max(0, left) }, (_, i) => (
              <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '⭐'}</span>
            ))}
          </p>

          <div className={css.shopGrid}>
            {shop.items.map((id) => {
              const on = chosen.includes(id)
              const can = on || (chosen.length < MAX_ITEMS && price(id) <= left)
              return (
                // a card as in an online shop: the picture, the name, the price and a "buy" button
                <div key={id} className={on ? `${css.shopItem} ${css.shopItemOn}` : css.shopItem}>
                  <span className={css.shopItemPic}>
                    <img src={picture(id)} alt="" />
                    {on && <span className={css.shopTick} aria-hidden>✓</span>}
                  </span>
                  <span className={css.shopItemName}>{name(id)}</span>
                  <span className={css.shopItemPrice}>
                    <span aria-hidden>{price(id)} <span className={css.coinCounterItem}>{theme.doneEmoji ?? '⭐'}</span></span>
                    <span className="app-sr-only">{t('ui.shop.price').replace('{n}', String(price(id)))}</span>
                  </span>
                  {/* bought: tapping again gives the piece back, and its stars */}
                  <button
                    type="button"
                    className={on ? `${css.shopBuy} ${css.shopBuyOn}` : css.shopBuy}
                    aria-pressed={on}
                    aria-label={`${on ? t('ui.shop.bought') : t('ui.shop.buy')}: ${name(id)}`}
                    disabled={!can}
                    onClick={() => toggle(id)}
                  >
                    {on ? t('ui.shop.bought') : t('ui.shop.buy')}
                  </button>
                </div>
              )
            })}
          </div>

          <div className={css.celebrateSheetActions}>
            <button
              type="button"
              className={`${css.worldBtn} ${css.worldBtnDone}`}
              disabled={chosen.length === 0 || !ready || state === 'saving'}
              onClick={save}
            >
              {state === 'saving' ? t('ui.cardView.pdfSaving') : <><ButtonIcon kind="colouring" />{withoutEmoji(t('ui.shop.print'))}</>}
            </button>
            {state === 'saved' && <p className={css.shopNote} role="status">{t('ui.cardView.pdfSaved')}</p>}
            {state === 'failed' && <p className={css.shopNote} role="alert">{t('ui.cardView.pdfFailed')}</p>}
            <button type="button" className={`${css.worldBtn} ${css.worldBtnBack}`} onClick={close}>
              {t('ui.buttons.back')}
            </button>
          </div>
      </main>

      {/* the landscape A4 pages the PDF is made from: drawn off the screen, black and white */}
      <div className={css.shopPaperHolder} aria-hidden>
        {pages.map((page, i) => (
          <div key={i} ref={(n) => { pagesRef.current[i] = n }} className={css.shopPaper} style={{ width: PAGE_W, height: PAGE_H }}>
            {i === 0 && (
              <div className={css.shopPaperHead} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <strong>{texts?.name}</strong> · {t('ui.shop.sheetLine')}
              </div>
            )}
            {page.map((it) => (
              <img key={it.id} src={picture(it.id)} alt="" style={{ left: it.x, top: it.y, width: it.w, height: it.h }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** A world without a designed shop: the celebration picture and the stars, as before */
function OldShop() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { reset, doneProcedures } = useQuestProgress()
  const doneCount = doneProcedures.size
  const goBackTo = useGoBackTo()

  return (
    <div className={css.shopPage} style={{ background: '#000' }}>
      {theme.shopImage && (
        <img src={theme.shopImage} alt="" className={css.shopImg} />
      )}
      {doneCount > 0 && (
        <p className={css.shopCoins}>
          {Array.from({ length: doneCount }, (_, i) => (
            <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
          ))}
        </p>
      )}
      <div className={css.shopActions}>
        <button
          className={css.backBtn}
          style={{ borderColor: theme.accent, color: theme.accent, background: 'rgba(255,255,255,0.9)' }}
          onClick={() => {
            reset()
            goBackTo(WORLD_SELECT, { absolute: true })
          }}
        >
          {t('ui.buttons.chooseWorld')}
        </button>
      </div>
    </div>
  )
}
