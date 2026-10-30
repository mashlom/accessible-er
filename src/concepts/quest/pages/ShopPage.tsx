import { useEffect, useRef, useState } from 'react'
import { useGoBackTo } from '../../nav'
import { WORLD_SELECT } from '../components/WorldScope'
import { useWide } from './WorldMapPage'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { saveCardPdf } from '../../../components/careCard/saveCardPdf'
import { worldText, type WorldLang } from '../../../data/child/worlds'
import css from '../quest.module.css'

/** What one thing on the colouring sheet costs, in the stars earned on the way */
const STARS_PER_ITEM = 2
/** At most this many things go on the sheet next to the doll */
const MAX_ITEMS = 4

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
  const affordable = Math.min(MAX_ITEMS, Math.floor(stars / STARS_PER_ITEM))
  const [chosen, setChosen] = useState<string[]>([])
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const handleRef = useRef<HTMLHeadingElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const texts = worldText(theme.id, lang as WorldLang)
  const name = (id: string) => texts?.shop?.[id] ?? id
  const picture = (id: string) => `${import.meta.env.BASE_URL}worlds/${theme.id}/shop/${id}.webp`
  const left = stars - chosen.length * STARS_PER_ITEM
  const close = () => goBackTo('/celebrate')

  useEffect(() => {
    handleRef.current?.focus()
  }, [])

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < affordable ? [...c, id] : c))

  const save = async () => {
    if (!sheetRef.current) return
    setState('saving')
    try {
      await saveCardPdf(sheetRef.current, `${texts?.name ?? theme.id} - colouring`)
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
          <p className={css.shopPrice}>{t('ui.shop.price').replace('{n}', String(STARS_PER_ITEM))}</p>

          <div className={css.shopGrid}>
            {shop.items.map((id) => {
              const on = chosen.includes(id)
              const can = on || chosen.length < affordable
              return (
                // a card as in an online shop: the picture, the name, the price and a "buy" button
                <div key={id} className={on ? `${css.shopItem} ${css.shopItemOn}` : css.shopItem}>
                  <span className={css.shopItemPic}>
                    <img src={picture(id)} alt="" />
                    {on && <span className={css.shopTick} aria-hidden>✓</span>}
                  </span>
                  <span className={css.shopItemName}>{name(id)}</span>
                  <span className={css.shopItemPrice}>
                    <span aria-hidden>{STARS_PER_ITEM} {theme.doneEmoji ?? '⭐'}</span>
                    <span className="app-sr-only">{t('ui.shop.price').replace('{n}', String(STARS_PER_ITEM))}</span>
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
              disabled={chosen.length === 0 || state === 'saving'}
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

      {/* the A4 sheet the PDF is made from: drawn off the screen, black and white */}
      <div className={css.shopPaperHolder} aria-hidden>
        <div ref={sheetRef} className={css.shopPaper} dir={lang === 'he' ? 'rtl' : 'ltr'}>
          <div className={css.shopPaperHead}>
            <strong>{texts?.name}</strong>
            <span>{t('ui.shop.sheetLine')}</span>
          </div>
          <div className={shop.doll ? css.shopPaperBody : `${css.shopPaperBody} ${css.shopPaperNoDoll}`}>
            {shop.doll && (
              <div className={`${css.shopPiece} ${css.shopPieceDoll}`}>
                <img src={picture('doll')} alt="" />
              </div>
            )}
            <div className={css.shopPieces}>
              {chosen.map((id) => (
                <div key={id} className={css.shopPiece}>
                  <img src={picture(id)} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
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
