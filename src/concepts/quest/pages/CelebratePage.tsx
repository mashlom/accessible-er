import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useGoBackTo } from '../../nav'
import { WORLD_SELECT } from '../components/WorldScope'
import { useWide } from './WorldMapPage'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import { isTestMode } from '../../../lib/testMode'
import i18nUi from '../../../data/i18n/ui.json'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import { createPortal } from 'react-dom'
import { lockBodyScroll } from '../../../lib/scrollLock'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { PARENT_WORLD } from '../useQuestTheme'
import { designVars, getTheme } from '../themes'
import { useMoreBelow } from '../useMoreBelow'
import css from '../quest.module.css'

// the emoji of each block stay in code; the words come from src/data/i18n/ui.json
const BLOCK_EMOJI = {
  discharge: ['📝', '🚪', '🏠', '🧰', '🩺'],
  admission: ['🏥', '🚪', '🛏️', '💙', '📞'],
} as const

type Block = { title: string; body: string }
const parentCelebrate = i18nUi as unknown as Record<'he' | 'en' | 'ru', { celebrate: Record<'discharge' | 'admission', Block[]> }>

function blocksFor(lang: 'he' | 'en' | 'ru', kind: 'discharge' | 'admission') {
  const texts = (parentCelebrate[lang] ?? parentCelebrate.he).celebrate[kind]
  // the first title is the same for both outcomes: it is the discharge's
  const first = (parentCelebrate[lang] ?? parentCelebrate.he).celebrate.discharge[0].title
  return texts.map((b, i) => ({ emoji: BLOCK_EMOJI[kind][i], ...b, title: i === 0 ? first : b.title }))
}

export function CelebratePage() {
  const [outcome, setOutcome] = useState<'discharge' | 'admission' | null>(null)
  const { theme } = useQuestTheme()
  // the shop is hidden unless the address asks for the test mode (?test=true)
  const withStore = isTestMode()
  const { t, lang } = useI18n()
  const { reset, doneProcedures } = useQuestProgress()
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const celebrateSkin = theme.stages['decision']
  const doneCount = doneProcedures.size
  const cardEmpty = isCardEmpty(card)
  const goBackTo = useGoBackTo()
  // a new journey: back to the world select screen (through the history, when it was the way in)
  const chooseWorld = () => {
    reset()
    goBackTo(WORLD_SELECT, { absolute: true })
  }

  const childText = (
    <>
      {doneCount > 0 && (
        <p className={css.celebrateCoins}>
          {Array.from({ length: doneCount }, (_, i) => (
            <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
          ))}
        </p>
      )}
      <p className={css.celebrateHint}>
        {/* the coins line welcomes to the shop: only when there is one */}
        {doneCount > 0 && withStore
          ? t(`ui.text.coins.${new Intl.PluralRules(lang).select(doneCount)}`).replace('{n}', String(doneCount))
          : (celebrateSkin?.hint ?? '')}
      </p>
    </>
  )
  const childButtons = (
    <>
      {withStore && (
        <Link to="/shop">
          <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }}>
            {t('ui.buttons.toShop')}
          </button>
        </Link>
      )}
      <button
        className={css.backBtn}
        style={{ borderColor: theme.accent, color: theme.accent }}
        onClick={chooseWorld}
      >
        {t('ui.buttons.chooseWorld')}
      </button>
    </>
  )
  const parentZone = (
    <div className={`${css.stageBody} ${css.celebrateParentZone}`}>
      {!outcome && (
        <div className={css.outcomeChoice}>
          <p className={css.outcomeLabel}>{t('ui.labels.adult.outcomeLabel')}</p>
          <div className={css.outcomeButtons}>
            <button
              className={css.outcomeBtn}
              onClick={() => setOutcome('discharge')}
              style={{ background: theme.accent, color: theme.accentText }}
            >
              {t('ui.buttons.discharge')}
            </button>
            <button
              className={css.outcomeBtn}
              onClick={() => setOutcome('admission')}
              style={{ background: theme.accent, color: theme.accentText }}
            >
              {t('ui.buttons.admission')}
            </button>
          </div>
        </div>
      )}

      {outcome && (
        <>
          <p className={css.parentZoneLabel}>
            {outcome === 'discharge' ? t('ui.text.towardsDischarge') : t('ui.text.towardsAdmission')}
          </p>

          {blocksFor(lang, outcome).map((b, i) => (
            <section key={i}>
              <h2>{b.emoji} {b.title}</h2>
              <p>{b.body}</p>
            </section>
          ))}

          {outcome === 'admission' && (
            cardEmpty ? (
              <Link to="/card" state={{ from: '/celebrate' }} className={css.calmLink}>
                <button
                  className={css.doneBtn}
                  style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
                >
                  {t('ui.buttons.fillCard')}
                </button>
              </Link>
            ) : (
              <Link to="/card/view" state={{ from: '/celebrate' }} className={css.calmLink}>
                <button
                  className={css.doneBtn}
                  style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
                >
                  {t('ui.buttons.showCard')}
                </button>
              </Link>
            )
          )}

          <button
            className={css.calmLink}
            onClick={() => setOutcome(null)}
            style={{ color: theme.accent, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('ui.buttons.changeChoice')}
          </button>

          <Link to="/feedback" className={css.calmLink}>
            {t('ui.buttons.feedback')}
          </Link>
        </>
      )}
    </div>
  )

  // a designed world: the celebration is a sheet like the stations', over the world's landscape
  // a designed world: the last sheet only asks what happens now (going home is only one of the two); the chosen
  // outcome's details open in the parent's sheet
  if (theme.design) {
    return (
      <CelebrateSheet
        image={theme.shopImage}
        question={t('ui.labels.adult.outcomeLabel')}
        choices={[
          { label: t('ui.buttons.discharge'), pick: () => setOutcome('discharge') },
          { label: t('ui.buttons.admission'), pick: () => setOutcome('admission') },
        ]}
        stars={doneCount > 0 ? (
          <>
            <p className={css.celebrateCoins}>
              {Array.from({ length: doneCount }, (_, i) => (
                <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
              ))}
            </p>
            {/* the shop's welcome only in the test mode, where the shop is */}
            {withStore && (
              <p className={css.celebrateHint}>
                {t(`ui.text.coins.${new Intl.PluralRules(lang).select(doneCount)}`).replace('{n}', String(doneCount))}
              </p>
            )}
          </>
        ) : null}
        buttons={childButtons}
        parent={outcome ? parentZone : null}
        closeParent={() => setOutcome(null)}
      />
    )
  }

  return (
    <div className={css.celebratePage}>
      {/* ── Child zone ── */}
      <div className={css.celebrateChildZone} style={{ background: theme.accentSoft }}>
        {theme.shopImage && (
          <img src={theme.shopImage} alt="" className={css.celebrateImg} />
        )}
        <div className={css.celebrateContent}>
          <p className={css.celebrateTitle} style={{ color: theme.accent }}>
            {celebrateSkin?.label ?? t('ui.text.weDidIt')}
          </p>
          {childText}
        </div>
        <div className={css.celebrateActions}>{childButtons}</div>
      </div>

      {/* ── Parent zone ── */}
      {parentZone}
    </div>
  )
}

/** A designed world's celebration: the world's landscape fills the screen, and the picture, the words, the buttons
 *  and the parent's part stand on a bottom sheet, as on a station */
function CelebrateSheet({ image, question, choices, stars, buttons, parent, closeParent }: {
  image?: string
  question: string
  choices: { label: string; pick: () => void }[]
  /** the stars earned on the way (and the shop's line in the test mode) */
  stars: ReactNode
  /** the shop (test mode only) and the world choice */
  buttons: ReactNode
  parent: ReactNode
  closeParent: () => void
}) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const wide = useWide()
  const goBackTo = useGoBackTo()
  const handleRef = useRef<HTMLButtonElement>(null)
  const moreRef = useMoreBelow<HTMLDivElement>()
  // closing the sheet goes back to the second map, where the journey ended
  const close = () => goBackTo('/second-map')
  useEffect(() => {
    handleRef.current?.focus()
    return lockBodyScroll()
  }, [])
  const land = { '--celebrate-bg': wide ? 'var(--w-background-wide, var(--w-background))' : 'var(--w-background)' } as React.CSSProperties
  return (
    <div className={css.celebrateLand} style={land}>
      {/* the same top row as on the maps (the shell's bar is hidden here): words for the adult, not pictures */}
      <div className={wide ? `${css.worldTopRow} ${css.worldTopRowWide}` : css.worldTopRow}>
        <button type="button" className={`${css.worldTopBtn} ${css.navWord}`} onClick={close}>
          {t('ui.shell.map')}
        </button>
        <div className={css.worldTopGroup}>
          <LanguagePicker variant="overlay" />
          {/* children's screens: the word, not a picture (Rakheli's review, #37); the parents' pages keep the house */}
          <a href="#/" className={`${css.worldTopBtn} ${css.navWord}`}>
            {t('ui.shell.home')}
          </a>
        </div>
      </div>
      <div className={css.sheetBackdrop}>
        <div ref={moreRef} className={`${css.sheet} ${css.stageSheet} ${css.worldSheet} ${css.celebrateSheet}`} role="dialog" aria-modal="true" aria-labelledby="celebrate-title">
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={close} aria-label={t('ui.buttons.close')}>
            <span aria-hidden />
          </button>
          {image && (
            <div className={css.stageSheetPicPlain}>
              <img src={image} alt="" className={`${css.stageSheetImg} ${css.stageSheetImgScene}`} />
            </div>
          )}
          {/* what scrolls: the stars and the shop's line, then the shop and the world choice side by side */}
          {stars && <div className={css.celebrateSheetText}>{stars}</div>}
          <div className={css.celebrateSheetRow}>{buttons}</div>
          {/* the bottom block, always in view: what happens now, and its two answers side by side */}
          <div className={css.sheetFooter}>
            <h1 id="celebrate-title" className={`${css.stageSheetTitle} ${css.celebrateQuestion}`} style={{ color: theme.accent }}>{question}</h1>
            <div className={css.stageSheetActions}>
              {choices.map((c) => (
                <button key={c.label} type="button" className={`${css.worldBtn} ${css.worldBtnDone}`} onClick={c.pick}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {parent && createPortal(<CelebrateParentSheet onClose={closeParent}>{parent}</CelebrateParentSheet>, document.body)}
    </div>
  )
}

/** The parent's sheet of the celebration: what happens now, in the parent's colours */
function CelebrateParentSheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const { t, lang, dir } = useI18n()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const unlock = lockBodyScroll()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return (
    <div className={css.sheetBackdrop} onClick={onClose}>
      <div
        className={`${css.sheet} ${css.worldSheet} ${css.celebrateSheetParent}`}
        style={designVars(getTheme(PARENT_WORLD).design)}
        // drawn in the page body (outside the shell): it takes the language's direction itself
        dir={dir}
        lang={lang}
        role="dialog"
        aria-modal="true"
        aria-label={t('ui.buttons.parentInfo')}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className={css.sheetHandle} onClick={onClose} aria-label={t('ui.buttons.close')}>
          <span aria-hidden />
        </button>
        {children}
      </div>
    </div>
  )
}
