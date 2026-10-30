import { lockBodyScroll } from '../../../lib/scrollLock'
import { useEffect, useRef, type ReactNode } from 'react'
import { Link, useGoBackTo } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { WorldMapPage, stationPicture, useWide } from '../pages/WorldMapPage'
import { WorldNightMapPage } from '../pages/WorldNightMapPage'
import { ParentInfo } from './ParentInfo'
import css from '../quest.module.css'

interface Props {
  stageId: string
  label: string
  hint?: string
  /** Child-facing extras (story steps, procedure icons) rendered under the hint */
  children?: ReactNode
  isActive: boolean
  onDone: () => void
  /** Last required stage, already done: offer the procedure selection instead */
  showChooseTests?: boolean
  /** Last required stage: the main button finishes it and goes straight to the procedure selection */
  doneIsChoice?: boolean
  /** Map to return to when the sheet closes */
  backTo: '/map' | '/second-map'
  /** No parent details (the locked ending has none) */
  noParent?: boolean
}

/** The world's main buttons: its own wording (texts.json, ui), else the shared one */
export function useWorldButtons() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  return {
    done: theme.ui?.done ?? t('ui.buttons.worldDone'),
    decision: theme.ui?.decision ?? t('ui.buttons.chooseTests'),
  }
}

/** The bubbles behind a picture on its panel (the world's design) */
export function Bubbles() {
  const { theme } = useQuestTheme()
  return (
    <>
      {theme.design?.bubbles?.map((b, i) => (
        <span key={i} className={css.stageBubble} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.d}%` }} aria-hidden />
      ))}
    </>
  )
}

/** Designed world: a stage opens as a bottom sheet over the map instead of a separate page. */
export function WorldStageSheet({ stageId, label, hint, children, isActive, onDone, showChooseTests, doneIsChoice, backTo, noParent }: Props) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const buttons = useWorldButtons()
  const goBackTo = useGoBackTo()
  const handleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const wide = useWide()
  // the picture and how it stands on the sheet are the world's (world.json, design.stations)
  const design = theme.design!
  const image = stationPicture(design, stageId, 'sheet')
  const panel = design.stations[stageId]?.panel ?? 'plain'
  const bubbles = panel === 'bubbles'
  const isHouse = panel === 'bleed'
  // the world's own words for this station: how it is like the ER, and its button
  const skin = theme.stages[stageId]

  const close = () => goBackTo(backTo)

  useEffect(() => {
    handleRef.current?.focus()
    const unlock = lockBodyScroll()
    const onKey = (e: KeyboardEvent) => {
      // A nested dialog (parent info) handles its own Escape
      if (e.key !== 'Escape' || dialogRef.current?.querySelector('[role="dialog"]')) return
      close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {backTo === '/second-map' ? <WorldNightMapPage underSheet /> : <WorldMapPage underSheet />}
      <div className={css.sheetBackdrop} onClick={close}>
        <div
          ref={dialogRef}
          className={`${css.sheet} ${css.stageSheet} ${css.worldSheet} ${css.parentBelow}`}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
        >
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={close} aria-label={t('ui.buttons.close')}>
            <span aria-hidden />
          </button>

          {image && (
            // a picture with bubbles far behind it, on the floor panel (the wrapper carries the panel)
            <div className={isHouse ? css.stageSheetPicHouse : bubbles ? css.stageSheetPicWrap : css.stageSheetPicPlain}>
              <img
                src={image}
                alt=""
                // A 'bleed' picture (the ocean's house) is cut straight on one edge in the mockup: push it off the sheet's edge
                className={[
                  css.stageSheetImg,
                  isHouse ? css.stageSheetImgBleed : '',
                  // on the landscape map it is mirrored (the ocean's pier points left): so it is on its sheet
                  isHouse && wide ? css.stageSheetImgFlip : '',
                  panel === 'symbol' ? css.stageSheetImgSymbol : '',
                  panel === 'scene' ? css.stageSheetImgScene : '',
                ].join(' ')}
              />
              {bubbles && <Bubbles />}
            </div>
          )}
          <h1 className={css.stageSheetTitle} style={{ color: theme.accent }}>{label}</h1>
          {(skin?.story ?? hint) && <p className={css.stageSheetHint}>{skin?.story ?? hint}</p>}

          {children}

          {!noParent && <ParentInfo stageId={stageId} inline />}

          <div className={css.stageSheetActions}>
            {isActive && (
              <button
                type="button"
                className={`${css.worldBtn} ${css.worldBtnDone}`}
                onClick={onDone}
              >
                {doneIsChoice ? buttons.decision : skin?.done ?? buttons.done}
              </button>
            )}
            {showChooseTests && !isActive && (
              // the choice takes this sheet's place: closing it returns to the map, not to this sheet
              <Link to="/procedures" replace className={`${css.worldBtn} ${css.worldBtnDone}`}>
                {buttons.decision}
              </Link>
            )}
            <button type="button" className={`${css.worldBtn} ${css.worldBtnBack}`} onClick={close}>
              {t('ui.buttons.backToMap')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
