import { lockBodyScroll } from '../../../lib/scrollLock'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { getProcedure } from '../../../data/procedures'
import { journeyStages } from '../../../data/journey'
import { OPTIONAL_STAGES, useQuestProgress } from '../useQuestProgress'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { OceanMapPage } from '../pages/OceanMapPage'
import { OceanNightMapPage } from '../pages/OceanNightMapPage'
import { ParentInfo } from './ParentInfo'
import css from '../quest.module.css'

/** Route of a station's own (child) sheet */
export const stageRoute = (stageId: string) => (stageId === 'wait-before-triage' ? '/wait-times' : `/stage/${stageId}`)

/**
 * Ocean world, child side: one procedure as a sheet over the map. Both buttons (and closing the sheet)
 * lead back to the station's child sheet; the parent's details open only from the parent pill.
 */
export function OceanProcedureDetailSheet({ id }: { id: string }) {
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { completeProcedure, doneProcedures, active, visibleOptionals } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const handleRef = useRef<HTMLButtonElement>(null)
  const [variant, setVariant] = useState(0)
  useEffect(() => setVariant(0), [id])

  const parentStage = t('journey.journeyStages', journeyStages).find((s) => s.procedureIds?.includes(id))
  const stageId = parentStage?.id ?? 'triage'
  const stageActive = parentStage
    ? active?.id === stageId || visibleOptionals.some((s) => s.id === stageId && s.status === 'active')
    : true
  const isDone = doneProcedures.has(id)
  const procedure = t(`procedures.procedures.${id}`, getProcedure(id))
  const night = (OPTIONAL_STAGES as readonly string[]).includes(stageId)

  const back = () => navigate(conceptPath(stageRoute(stageId)))

  useEffect(() => {
    handleRef.current?.focus()
    const unlock = lockBodyScroll()
    const onKey = (e: KeyboardEvent) => {
      // the parent sheet, if open, takes the Escape itself
      if (e.key !== 'Escape' || document.querySelectorAll('[role="dialog"]').length > 1) return
      back()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!procedure) return null

  const themedSteps = theme.procedureSteps?.[id]
  const variants = themedSteps ? undefined : (theme.procedureVariants?.[id] ?? procedure.storyVariants)
  const steps = themedSteps ?? (variants ? (variants[variant] ?? variants[0]).steps : procedure.story)
  const narrative = theme.procedureNarratives?.[id]

  return (
    <>
      {night ? <OceanNightMapPage underSheet /> : <OceanMapPage underSheet />}
      <div className={css.sheetBackdrop} onClick={back}>
        <div
          className={`${css.sheet} ${css.stageSheet} ${css.oceanSheet} ${lang === 'he' ? '' : css.parentBelow}`}
          role="dialog"
          aria-modal="true"
          aria-label={procedure.title}
          onClick={(e) => e.stopPropagation()}
        >
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={back} aria-label={t('ui.buttons.close', 'סגירה')}>
            <span aria-hidden />
          </button>

          <div className={css.procBigIcon} aria-hidden><span>{procedure.emoji}</span></div>
          <h1 className={css.stageSheetTitle} style={{ color: theme.accent }}>{procedure.title}</h1>
          {narrative && <p className={css.stageSheetHint}>{narrative}</p>}

          {steps && steps.length > 0 && (
            <div className={css.procBody}>
              {variants && variants.length > 1 && (
                <div className={css.variantToggle} style={{ '--n': variants.length } as React.CSSProperties}>
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`${css.variantBtn} ${i === variant ? css.variantBtnActive : ''}`}
                      style={i === variant
                        ? { background: theme.accent, color: theme.accentText, borderColor: theme.accent }
                        : { borderColor: theme.accent, color: theme.accent }}
                      onClick={() => setVariant(i)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}
              <ol className={css.procedureSteps} style={{ color: theme.accent }}>
                {steps.map((step, i) => {
                  const m = /^(לפני|בזמן|אחרי):\s*(.*)$/s.exec(step)
                  return <li key={i}>{m ? <><strong>{m[1]}:</strong> {m[2]}</> : step}</li>
                })}
              </ol>
            </div>
          )}

          <ParentInfo stageId={stageId} inline ocean initialProc={id} />

          <div className={css.stageSheetActions}>
            {stageActive && (
              <button
                type="button"
                className={`${css.oceanBtn} ${css.oceanBtnDone}`}
                onClick={() => {
                  completeProcedure(id)
                  back()
                }}
              >
                {isDone ? (theme.doneEmoji ?? '✓') : t('ui.buttons.oceanDone', 'הצלחתי! ←')}
              </button>
            )}
            {(!isDone || !stageActive) && (
              <button type="button" className={`${css.oceanBtn} ${css.oceanBtnBack}`} onClick={back}>
                {t('ui.buttons.backToStation', 'חזרה לתחנה →')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
