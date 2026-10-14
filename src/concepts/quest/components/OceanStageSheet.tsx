import { lockBodyScroll } from '../../../lib/scrollLock'
import { useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '../../nav'
import { useConceptPath } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { OceanMapPage, useWide } from '../pages/OceanMapPage'
import { OceanNightMapPage } from '../pages/OceanNightMapPage'
import { ParentInfo } from './ParentInfo'
import css from '../quest.module.css'

interface Props {
  stageId: string
  label: string
  hint?: string
  image?: string
  /** Child-facing extras (story steps, procedure icons) rendered under the hint */
  children?: ReactNode
  isActive: boolean
  onDone: () => void
  /** Last required stage, already done: offer the procedure selection instead */
  showChooseTests?: boolean
  /** Last required stage: the main button finishes it and goes straight to the procedure selection */
  doneIsChoice?: boolean
  /** Map to return to when the sheet closes */
  backTo: '/map' | '/night-map'
}

/** Bubbles over the captain's picture, as in Shevi's frame (measured on it): centre (x, y) in % of the panel's width and
 *  height, diameter in % of its width. Two big ones, a pair, three tiny ones and two small ones rise from the dome. */
const BUBBLES = [
  { x: 53.4, y: -3, d: 14.2 },
  { x: 64.8, y: 9.5, d: 14.2 },
  { x: 46, y: 25, d: 12.5 },
  { x: 50.6, y: 20, d: 4.3 },
  { x: 62.2, y: 35.8, d: 1.7 },
  { x: 65.7, y: 41.2, d: 1.7 },
  { x: 63.1, y: 43, d: 1.7 },
  { x: 65.7, y: 49.6, d: 4.5 },
  { x: 58.3, y: 54, d: 9.7 },
]

/** Ocean world: a stage opens as a bottom sheet over the map instead of a separate page. */
export function OceanStageSheet({ stageId, label, hint, image, children, isActive, onDone, showChooseTests, doneIsChoice, backTo }: Props) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const handleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const bubbles = stageId === 'doctor'
  const wide = useWide()
  const isHouse = !!image?.endsWith('station-house.png')

  const close = () => navigate(conceptPath(backTo))

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
      {backTo === '/night-map' ? <OceanNightMapPage underSheet /> : <OceanMapPage underSheet />}
      <div className={css.sheetBackdrop} onClick={close}>
        <div
          ref={dialogRef}
          className={`${css.sheet} ${css.stageSheet} ${css.oceanSheet} ${css.parentBelow}`}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
        >
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={close} aria-label={t('ui.buttons.close', 'סגירה')}>
            <span aria-hidden />
          </button>

          {image && (
            // the captain's sheet has bubbles rising over its picture, on a pale panel (the other stations have the sea floor)
            <div className={isHouse ? css.stageSheetPicHouse : bubbles ? css.stageSheetPicWrap : css.stageSheetPicPlain}>
              <img
                src={image}
                alt=""
                // The house is cut straight on its left edge in the mockup: push it off the sheet's edge
                className={[
                  css.stageSheetImg,
                  isHouse ? css.stageSheetImgBleed : '',
                  // on the landscape map the house is mirrored (the pier points left): so it is on its sheet
                  isHouse && wide ? css.stageSheetImgFlip : '',
                  bubbles ? css.stageSheetImgPale : '',
                  image.includes('/symbol-') ? css.stageSheetImgSymbol : '',
                ].join(' ')}
              />
              {bubbles && BUBBLES.map((b, i) => (
                <span key={i} className={css.stageBubble} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.d}%` }} aria-hidden />
              ))}
            </div>
          )}
          <h1 className={css.stageSheetTitle} style={{ color: theme.accent }}>{label}</h1>
          {hint && <p className={css.stageSheetHint}>{hint}</p>}

          {children}

          <ParentInfo stageId={stageId} inline ocean />

          <div className={css.stageSheetActions}>
            {isActive && (
              <button
                type="button"
                className={`${css.oceanBtn} ${css.oceanBtnDone}`}
                onClick={onDone}
              >
                {doneIsChoice ? t('ui.buttons.oceanDecision', 'החלטת הקפטן ←') : t('ui.buttons.oceanDone', 'הצלחתי! ←')}
              </button>
            )}
            {showChooseTests && !isActive && (
              <Link to="/procedures" className={`${css.oceanBtn} ${css.oceanBtnDone}`}>
                {t('ui.buttons.oceanDecision', 'החלטת הקפטן ←')}
              </Link>
            )}
            <button type="button" className={`${css.oceanBtn} ${css.oceanBtnBack}`} onClick={close}>
              {t('ui.buttons.backToMap', 'חזרה למפה →')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
