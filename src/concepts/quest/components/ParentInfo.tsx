import { useEffect, useRef, useState } from 'react'
import { Link } from '../../nav'
import { SensoryBar } from '../../../components/SensoryBar'
import { journeyStages } from '../../../data/journey'
import { getProcedure } from '../../../data/procedures'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

const WAIT_PROCS = ['temperature', 'saturation', 'blood-pressure']

/** Floating pill on the map that opens the parent-facing details of the current stage in a bottom sheet. */
export function ParentInfo({ stageId: stageOverride }: { stageId?: string }) {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()
  const { active } = useQuestProgress()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const stageId = stageOverride ?? active?.id ?? REQUIRED_STAGES[REQUIRED_STAGES.length - 1]

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={css.parentBtn}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span className={css.parentBtnArrow} aria-hidden>↖</span>
        {t('ui.buttons.parentInfo', 'מידע נוסף להורה')}
      </button>
      {open && <ParentSheet stageId={stageId} onClose={close} />}
    </>
  )
}

function ParentSheet({ stageId, onClose }: { stageId: string; onClose: () => void }) {
  const { t } = useI18n()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const data = t('journey.journeyStages', journeyStages).find((j) => j.id === stageId)
  if (!data) return null

  const singleProcId = data.procedureIds?.length === 1 ? data.procedureIds[0] : undefined
  const singleProc = singleProcId ? t(`procedures.procedures.${singleProcId}`, getProcedure(singleProcId)) : undefined

  return (
    <div className={css.sheetBackdrop} onClick={onClose}>
      <div
        className={css.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={t('ui.buttons.parentInfo', 'מידע נוסף להורה')}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={css.sheetHandle}
          onClick={onClose}
          aria-label={t('ui.buttons.close', 'סגירה')}
        >
          <span aria-hidden />
        </button>

        {data.sensory && <SensoryBar sensory={data.sensory} />}
        {(singleProc?.who || data.waitRange) && (
          <p className={css.sheetWait}>
            {singleProc?.who && <span>👤 {singleProc.who}</span>}
            {singleProc?.who && data.waitRange && <span> · </span>}
            {data.waitRange && <span>{t('ui.text.estimated', '⏱ זמן משוער:')} {data.waitRange}</span>}
          </p>
        )}

        {data.meaning && (
          <section className={css.sheetCard}>
            <h2>{t('ui.text.weAreHere', 'אנחנו כאן')}</h2>
            <p>{data.meaning}</p>
            {stageId === 'reception' && (
              <>
                <p className={css.sheetHint}>{t('ui.text.reasonHint', 'בלחיצה על הכפתור תוכלו לבחור את סיבת הביקור ולראות את תכנית הביקור הצפויה שלכם.')}</p>
                <Link to="/reason" className={css.calmLink}>{t('ui.buttons.whatAwaits', '🗺️ מה מחכה לנו היום?')}</Link>
              </>
            )}
          </section>
        )}

        {singleProc ? (
          <>
            <section className={css.sheetCard}>
              <h2>{t('ui.text.whatActuallyHappens', 'מה קורה בפועל')}</h2>
              <p>{singleProc.what}</p>
            </section>
            <section className={css.sheetCard}>
              <h2>{t('ui.text.childMayFeel', 'מה הילד/ה עשוי/ה להרגיש')}</h2>
              <p>{singleProc.feel}</p>
            </section>
          </>
        ) : (
          data.whatHappens && (
            <section className={css.sheetCard}>
              <h2>
                {stageId === 'wait-before-triage'
                  ? t('ui.text.whatHappensHere', 'מה קורה כאן')
                  : t('ui.text.whatHappens', 'מה קורה')}
              </h2>
              <p>{data.whatHappens}</p>
            </section>
          )
        )}

        {data.challenge && (
          <section className={css.sheetCard}>
            <h2>{t('ui.text.whatMayBeHard', 'מה יכול להיות קשה?')}</h2>
            <p>{data.challenge}</p>
            {stageId === 'reception' && (
              <>
                <p className={css.sheetHint}>{t('ui.text.cardHint', 'בלחיצה על הכפתור תוכלו להכין כרטיס קצר לצוות המתאר את המאפיינים המיוחדים של הילד/ה שלכם.')}</p>
                <Link to="/card" state={{ from: '/map' }} className={css.calmLink}>{t('ui.buttons.cardForStaff', '🪪 כרטיס התאמות לצוות')}</Link>
              </>
            )}
          </section>
        )}

        {stageId === 'wait-before-triage' && (
          <section className={css.sheetCard}>
            <h2>{t('ui.text.prepareMeasurements', 'איך להכין את הילד/ה למדידות שעומדות לקרות')}</h2>
            {data.nextStagePrepare && <p>{data.nextStagePrepare}</p>}
            {WAIT_PROCS.map((pid) => {
              const proc = t(`procedures.procedures.${pid}`, getProcedure(pid))
              if (!proc) return null
              return (
                <div key={pid} className={css.sheetProc}>
                  <strong>{proc.emoji} {proc.title}</strong>
                  <p>{proc.what} {proc.feel}</p>
                  <p>💡 {proc.prepare}</p>
                </div>
              )
            })}
          </section>
        )}

        {stageId !== 'wait-before-triage' && data.nextStagePrepare && (
          <section className={css.sheetCard}>
            <h2>{t('ui.text.prepareChild', 'איך להכין את הילד/ה')}</h2>
            <p>{data.nextStagePrepare}</p>
          </section>
        )}

        {(() => {
          const asks = singleProc?.adaptations?.length ? singleProc.adaptations : data.canAsk
          return asks && asks.length > 0 ? (
            <section className={css.sheetCard}>
              <h2>{singleProc?.adaptations?.length ? t('ui.text.askStaff', 'מה לבקש מהצוות') : t('ui.text.canAsk', 'אפשר לבקש')}</h2>
              <ul>
                {asks.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>
          ) : null
        })()}

        {!singleProc && data.procedureIds && data.procedureIds.length > 0 && stageId !== 'wait-before-triage' && (
          <section className={css.sheetCard}>
            <h2>{t('ui.text.stageProcedures', 'פרוצדורות בשלב הזה')}</h2>
            <ul className={css.sheetLinks}>
              {data.procedureIds.map((pid) => {
                const proc = t(`procedures.procedures.${pid}`, getProcedure(pid))
                return (
                  <li key={pid}>
                    <Link to={`/procedure/${pid}`}>{proc?.emoji} {proc?.title ?? pid}</Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <Link to="/calm" state={{ from: '/map' }} className={css.calmLink}>{t('ui.buttons.hardNow', '💙 קשה לנו כרגע')}</Link>
      </div>
    </div>
  )
}
