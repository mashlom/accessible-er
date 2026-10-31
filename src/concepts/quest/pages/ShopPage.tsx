import { useEffect, useRef, useState } from 'react'
import { useGoBackTo } from '../../nav'
import { WORLD_SELECT } from '../components/WorldScope'
import { useWide } from './WorldMapPage'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { pageFontsCss } from '../../../components/careCard/saveCardPdf'
import { worldText, type WorldLang } from '../../../data/child/worlds'
import css from '../quest.module.css'

/** What each thing costs, in the stars earned on the way, by its place in the world's list. Chosen so that any
 *  number of stars from 1 to 15 can be spent to the last one with at most four things (so with 7 things too). */
const PRICES = [2, 1, 3, 1, 4, 2, 5, 3]
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

/**
 * Lays the doll and the pieces out on landscape A4 pages, all at one scale (the doll's): the doll stands at the start
 * edge, the pieces go in rows on the free part of the page (the doll's half too, but never over the doll); what does
 * not fit goes on a next page, at the same scale.
 */
function layOut(
  doll: Size | null,
  pieces: { id: string; size: Size; place?: 'head' | 'feet' }[],
  rtl: boolean,
): Placed[][] {
  const k = DOLL_H / (doll?.h ?? NO_DOLL_H)
  const pages: Placed[][] = [[]]
  let left = MARGIN
  if (doll) {
    const w = Math.round(doll.w * k)
    pages[0].push({ id: 'doll', x: MARGIN, y: Math.round((PAGE_H - DOLL_H) / 2), w, h: DOLL_H })
    left = MARGIN + w + GAP
  }
  // as on the doll: what is worn on the head first (at the top), then the rest, then what is worn on the feet,
  // each group from its tallest piece down, in rows; a new row for each group, a new page when one does not fit
  const order = { head: 0, undefined: 1, feet: 2 } as const
  const sorted = [...pieces].sort((a, b) => order[`${a.place}` as keyof typeof order] - order[`${b.place}` as keyof typeof order] || b.size.h - a.size.h)
  const feet = new Set(pieces.filter((p) => p.place === 'feet').map((p) => p.id))
  let x = left, y = MARGIN, rowH = 0, page = 0, group: string | undefined
  for (const { id, size, place } of sorted) {
    const w = Math.round(size.w * k), h = Math.round(size.h * k)
    if (x > left && (x + w > PAGE_W - MARGIN || place !== group)) { x = left; y += rowH + GAP; rowH = 0 }
    group = place
    if (y + h > PAGE_H - MARGIN && y > MARGIN) {
      page += 1; pages.push([]); left = MARGIN; x = left; y = MARGIN; rowH = 0
    }
    pages[page].push({ id, x, y, w, h })
    x += w + GAP
    rowH = Math.max(rowH, h)
  }
  // what is worn on the feet stands on the bottom of the page, as the feet do
  for (const p of pages) {
    const f = p.filter((it) => feet.has(it.id))
    if (!f.length) continue
    const drop = PAGE_H - MARGIN - Math.max(...f.map((it) => it.y + it.h))
    if (drop > 0) for (const it of f) it.y += drop
  }
  // Hebrew reads from the right: the doll stands at the right edge
  return rtl ? pages.map((p) => p.map((it) => ({ ...it, x: PAGE_W - it.x - it.w }))) : pages
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
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const wide = useWide()
  const goBackTo = useGoBackTo()
  const { doneProcedures } = useQuestProgress()
  const shop = theme.shop!
  const stars = doneProcedures.size
  const price = (id: string) => PRICES[shop.items.indexOf(id) % PRICES.length]
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
  const pages = ready
    ? layOut(shop.doll ? sizes.doll : null, chosen.map((id) => ({ id, size: sizes[id], place: shop.place?.[id] })), lang === 'he')
    : []

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
      <div className={wide ? `${css.worldTopRow} ${css.worldTopRowWide}` : css.worldTopRow}>
        <button type="button" className={`${css.worldTopBtn} ${css.navWord}`} onClick={() => goBackTo(WORLD_SELECT, { absolute: true })}>
          {t('ui.shell.chooseWorld')}
        </button>
        <div className={css.worldTopGroup}>
          {/* the light page: the plain picker (the overlay one is white, for a picture) */}
          <LanguagePicker />
          <a href="#/" className={`${css.worldTopBtn} ${css.homeIcon}`} aria-label={t('ui.shell.home')}>
            <span aria-hidden>🏠</span>
          </a>
        </div>
      </div>
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
                    <span aria-hidden>{price(id)} {theme.doneEmoji ?? '⭐'}</span>
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
              {state === 'saving' ? t('ui.cardView.pdfSaving') : t('ui.shop.print')}
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
