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
  /** No parent details (the locked ending has none) */
  noParent?: boolean
}

/** Bubbles far behind the captain's picture, on its sea floor panel: centre (x, y) in % of the panel's width and height,
 *  diameter in % of its width. Some are half hidden behind the dome. */
export const BUBBLES = [
  { x: 71, y: 23, d: 13 },
  { x: 29, y: 20, d: 10 },
  { x: 84, y: 36, d: 6.5 },
  { x: 14, y: 42, d: 5 },
  { x: 77, y: 58, d: 4 },
  { x: 22, y: 66, d: 6 },
  { x: 60, y: 22, d: 2.5 },
  { x: 55, y: 28, d: 1.8 },
  { x: 9, y: 28, d: 2.2 },
]

/** Ocean world: a stage opens as a bottom sheet over the map instead of a separate page. */
export function OceanStageSheet({ stageId, label, hint, image, children, isActive, onDone, showChooseTests, doneIsChoice, backTo, noParent }: Props) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const handleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  // every station that stands in the water (all but the house on the pier and the golden symbols) has bubbles behind its picture
  const bubbles = ['wait-before-triage', 'triage', 'wait-doctor', 'doctor'].includes(stageId)
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
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={close} aria-label={t('ui.buttons.close')}>
            <span aria-hidden />
          </button>

          {image && (
            // the captain's sheet has bubbles far behind its picture, on the sea floor panel (the wrapper carries the panel)
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

          {!noParent && <ParentInfo stageId={stageId} inline ocean />}

          <div className={css.stageSheetActions}>
            {isActive && (
              <button
                type="button"
                className={`${css.oceanBtn} ${css.oceanBtnDone}`}
                onClick={onDone}
              >
                {doneIsChoice ? t('ui.buttons.oceanDecision') : t('ui.buttons.oceanDone')}
              </button>
            )}
            {showChooseTests && !isActive && (
              <Link to="/procedures" className={`${css.oceanBtn} ${css.oceanBtnDone}`}>
                {t('ui.buttons.oceanDecision')}
              </Link>
            )}
            <button type="button" className={`${css.oceanBtn} ${css.oceanBtnBack}`} onClick={close}>
              {t('ui.buttons.backToMap')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
