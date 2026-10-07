import { useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '../../nav'
import { useConceptPath } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { OceanMapPage } from '../pages/OceanMapPage'
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
  /** Map to return to when the sheet closes */
  backTo: '/map' | '/night-map'
}

/** Ocean world: a stage opens as a bottom sheet over the map instead of a separate page. */
export function OceanStageSheet({ stageId, label, hint, image, children, isActive, onDone, showChooseTests, backTo }: Props) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const handleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const close = () => navigate(conceptPath(backTo))

  useEffect(() => {
    handleRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      // A nested dialog (parent info) handles its own Escape
      if (e.key !== 'Escape' || dialogRef.current?.querySelector('[role="dialog"]')) return
      close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <OceanMapPage />
      <div className={css.sheetBackdrop} onClick={close}>
        <div
          ref={dialogRef}
          className={`${css.sheet} ${css.stageSheet}`}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
        >
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={close} aria-label={t('ui.buttons.close', 'סגירה')}>
            <span aria-hidden />
          </button>

          {image && <img src={image} alt="" className={css.stageSheetImg} />}
          <h1 className={css.stageSheetTitle} style={{ color: theme.accent }}>{label}</h1>
          {hint && <p className={css.stageSheetHint}>{hint}</p>}

          {children}

          <div className={css.stageSheetActions}>
            {isActive && (
              <button
                type="button"
                className={css.doneBtn}
                style={{ background: theme.accent, color: theme.accentText }}
                onClick={onDone}
              >
                {t('ui.buttons.done', 'הצלחתי! ←')}
              </button>
            )}
            {showChooseTests && !isActive && (
              <Link to="/procedures" className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }}>
                {t('ui.buttons.chooseTests', 'לבחירת הבדיקות ←')}
              </Link>
            )}
            <button
              type="button"
              className={css.backBtn}
              style={{ background: theme.accentSoft, borderColor: theme.accent, color: theme.accent }}
              onClick={close}
            >
              {t('ui.buttons.backToMap', 'חזרה למפה →')}
            </button>
          </div>

          <ParentInfo stageId={stageId} inline />
        </div>
      </div>
    </>
  )
}
