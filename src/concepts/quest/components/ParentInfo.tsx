import { useEffect, useRef, useState } from 'react'
import { Link } from '../../nav'
import { SensoryBar } from '../../../components/SensoryBar'
import { journeyStages } from '../../../data/journey'
import { getProcedure } from '../../../data/procedures'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { useQuestTheme } from '../useQuestTheme'
import { ProcedureLineIcon } from './ProcedureLineIcon'
import css from '../quest.module.css'

/** Open-book icon from the ocean mockup (drawn inside a 24×24 circle at 33,888 in the frame) */
const BOOK_PATH = 'M40.75 903C41.3553 903 41.9445 903.066 42.5176 903.197C43.0907 903.328 43.6606 903.525 44.2273 903.788V896.4C43.6992 896.1 43.139 895.875 42.5466 895.725C41.9542 895.575 41.3553 895.5 40.75 895.5C40.2864 895.5 39.8259 895.544 39.3688 895.631C38.9116 895.719 38.4705 895.85 38.0455 896.025V903.45C38.4962 903.3 38.9437 903.188 39.3881 903.113C39.8324 903.038 40.2864 903 40.75 903ZM45.7727 903.788C46.3394 903.525 46.9093 903.328 47.4824 903.197C48.0555 903.066 48.6447 903 49.25 903C49.7136 903 50.1676 903.038 50.6119 903.113C51.0563 903.188 51.5038 903.3 51.9545 903.45V896.025C51.5295 895.85 51.0884 895.719 50.6312 895.631C50.1741 895.544 49.7136 895.5 49.25 895.5C48.6447 895.5 48.0458 895.575 47.4534 895.725C46.861 895.875 46.3008 896.1 45.7727 896.4V903.788ZM45 906C44.3818 905.525 43.7121 905.156 42.9909 904.894C42.2697 904.631 41.5227 904.5 40.75 904.5C40.2091 904.5 39.6778 904.569 39.1562 904.706C38.6347 904.844 38.1356 905.038 37.6591 905.288C37.3886 905.425 37.1278 905.419 36.8767 905.269C36.6256 905.119 36.5 904.9 36.5 904.613V895.575C36.5 895.438 36.5354 895.306 36.6063 895.181C36.6771 895.056 36.7833 894.963 36.925 894.9C37.5174 894.6 38.1356 894.375 38.7795 894.225C39.4235 894.075 40.0803 894 40.75 894C41.497 894 42.2278 894.094 42.9426 894.281C43.6574 894.469 44.3432 894.75 45 895.125C45.6568 894.75 46.3426 894.469 47.0574 894.281C47.7722 894.094 48.503 894 49.25 894C49.9197 894 50.5765 894.075 51.2205 894.225C51.8644 894.375 52.4826 894.6 53.075 894.9C53.2167 894.963 53.3229 895.056 53.3938 895.181C53.4646 895.306 53.5 895.438 53.5 895.575V904.613C53.5 904.9 53.3744 905.119 53.1233 905.269C52.8722 905.419 52.6114 905.425 52.3409 905.288C51.8644 905.038 51.3653 904.844 50.8438 904.706C50.3222 904.569 49.7909 904.5 49.25 904.5C48.4773 904.5 47.7303 904.631 47.0091 904.894C46.2879 905.156 45.6182 905.525 45 906Z'

const WAIT_PROCS = ['temperature', 'saturation', 'blood-pressure']

/** Floating pill on the map that opens the parent-facing details of the current stage in a bottom sheet. */
interface ParentInfoProps {
  stageId?: string
  inline?: boolean
  /** ocean: the mockup's pill with the book icon */
  ocean?: boolean
  /** Open straight on this procedure's details (from the procedure's own child page) */
  initialProc?: string
}

export function ParentInfo({ stageId: stageOverride, inline, ocean, initialProc }: ParentInfoProps) {
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
      {ocean ? (
        <button
          ref={triggerRef}
          type="button"
          className={inline ? `${css.parentBtnOcean} ${css.parentBtnOceanInline}` : css.parentBtnOcean}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          <span className={css.parentBtnOceanPill}>
            {t('ui.buttons.parentInfo', 'מידע נוסף להורה')}
            <svg viewBox="33 888 24 24" className={css.parentBtnOceanIcon} aria-hidden>
              <rect x="33" y="888" width="24" height="24" rx="12" />
              <path d={BOOK_PATH} />
            </svg>
          </span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={inline ? `${css.parentBtn} ${css.parentBtnInline}` : css.parentBtn}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          <span className={css.parentBtnArrow} aria-hidden>↖</span>
          {t('ui.buttons.parentInfo', 'מידע נוסף להורה')}
        </button>
      )}
      {open && <ParentSheet stageId={stageId} onClose={close} initialProc={initialProc} />}
    </>
  )
}

function ParentSheet({ stageId, onClose, initialProc }: { stageId: string; onClose: () => void; initialProc?: string }) {
  const { t, dir } = useI18n()
  const { theme } = useQuestTheme()
  const closeRef = useRef<HTMLButtonElement>(null)
  const ocean = theme.id === 'ocean'
  // ocean: a procedure's details slide in inside this same sheet
  const [proc, setProc] = useState<string | null>(initialProc ?? null)
  const procRef = useRef(proc)
  procRef.current = proc

  useEffect(() => {
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Escape first steps back from a procedure to the overview, then closes the sheet
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (procRef.current && !initialProc) setProc(null)
      else onClose()
    }
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
        className={theme.id === 'ocean' ? `${css.sheet} ${css.oceanSheet}` : css.sheet}
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

        {ocean && proc ? (
          <ProcedurePanel pid={proc} onBack={initialProc ? undefined : () => setProc(null)} />
        ) : (
          <>
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
                    {ocean ? (
                      <button type="button" className={css.sheetProcBtn} onClick={() => setProc(pid)}>
                        <span>{proc?.emoji} {proc?.title ?? pid}</span>
                        <span aria-hidden>{dir === 'rtl' ? '‹' : '›'}</span>
                      </button>
                    ) : (
                      <Link to={`/procedure/${pid}`}>{proc?.emoji} {proc?.title ?? pid}</Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <Link to="/calm" state={{ from: '/map' }} className={css.calmLink}>{t('ui.buttons.hardNow', '💙 קשה לנו כרגע')}</Link>
          </>
        )}
      </div>
    </div>
  )
}

/** One procedure's details for the parent, shown inside the parent sheet (slides in from the "forward" side) */
function ProcedurePanel({ pid, onBack }: { pid: string; onBack?: () => void }) {
  const { t, dir } = useI18n()
  const { theme } = useQuestTheme()
  const proc = t(`procedures.procedures.${pid}`, getProcedure(pid))
  const narrative = theme.procedureNarratives?.[pid]
  if (!proc) return null

  return (
    <div className={css.procPanel} style={{ '--slide': dir === 'rtl' ? -1 : 1 } as React.CSSProperties}>
      {onBack && (
        <button type="button" className={css.procBack} onClick={onBack} aria-label={t('ui.buttons.back', 'חזרה →')}>
          <span aria-hidden>{dir === 'rtl' ? '→' : '←'}</span>
        </button>
      )}

      <header className={css.procHead}>
        <span className={css.procIcon} aria-hidden><ProcedureLineIcon id={pid} emoji={proc.emoji} /></span>
        <div className={css.procHeadText}>
          <h2>{proc.title}</h2>
          {narrative && <p>{narrative}</p>}
        </div>
      </header>

      {proc.what && (
        <section className={css.sheetCard}>
          <h2>{t('ui.text.whatActuallyHappens', 'מה קורה בפועל')}</h2>
          <p>{proc.what}</p>
        </section>
      )}
      {proc.feel && (
        <section className={css.sheetCard}>
          <h2>{t('ui.text.childMayFeel', 'מה הילד/ה עשוי/ה להרגיש')}</h2>
          <p>{proc.feel}</p>
        </section>
      )}
      {proc.prepare && (
        <section className={css.sheetCard}>
          <h2>{t('ui.text.prepareChild', 'איך להכין את הילד/ה')}</h2>
          <p>{proc.prepare}</p>
        </section>
      )}
      {proc.adaptations && proc.adaptations.length > 0 && (
        <section className={css.sheetCard}>
          <h2>{t('ui.text.askStaff', 'מה לבקש מהצוות')}</h2>
          <ul>
            {proc.adaptations.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

    </div>
  )
}
