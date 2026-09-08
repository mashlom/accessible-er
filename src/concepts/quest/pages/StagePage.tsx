import { useParams, useNavigate } from 'react-router-dom'
import { Navigate, Link } from '../../nav'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES, OPTIONAL_STAGES, loadProcs } from '../useQuestProgress'
import { SensoryBar } from '../../../components/SensoryBar'
import { getProcedure } from '../../../data/procedures'
import css from '../quest.module.css'

const LAST_REQUIRED = REQUIRED_STAGES[REQUIRED_STAGES.length - 1]

export function StagePage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()
  const { stages, active, completeActive, completeStage, completeProcedure, doneProcedures } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const isLastStage = id === LAST_REQUIRED
  const isOptional = id ? (OPTIONAL_STAGES as readonly string[]).includes(id) : false
  const thisStage = stages.find((s) => s.id === id)
  const isActive = isOptional ? thisStage?.status === 'active' : active?.id === id

  const data = journeyStages.find((j) => j.id === id)
  const skin = id ? theme.stages[id] : undefined

  if (!data) return <Navigate to="/map" replace />

  const label = skin?.label ?? data.title
  const icon = skin?.icon ?? data.emoji
  const heroImg = skin?.heroImage ?? skin?.image

  // When a stage has exactly one procedure, embed it inline instead of showing an icon link
  const inlineProcId = data.procedureIds?.length === 1 ? data.procedureIds[0] : undefined
  const inlineProc = inlineProcId ? getProcedure(inlineProcId) : undefined
  const themedSteps = inlineProcId ? theme.procedureSteps?.[inlineProcId] : undefined
  const inlineSteps = themedSteps ?? inlineProc?.story

  function handleDone() {
    if (inlineProcId) {
      completeProcedure(inlineProcId)
    } else if (id) {
      const procIds = data?.procedureIds ?? []
      const anyProcDone = procIds.some((pid) => loadProcs().has(pid))
      if (!anyProcDone) completeProcedure(id)
    }
    if (isOptional && id) {
      completeStage(id)
    } else {
      completeActive()
    }
    if (isLastStage) {
      navigate(conceptPath('/procedures'))
    } else if (isOptional) {
      navigate(conceptPath('/night-map'))
    } else {
      navigate(conceptPath('/map'))
    }
  }

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        {heroImg ? (
          <img src={heroImg} alt="" className={css.stageHeroImg} />
        ) : (
          <span className={css.stageHeroIcon}>{icon}</span>
        )}
        <h1 style={{ color: theme.accent }}>{label}</h1>
        {skin?.hint && <p className={css.stageHeroHint}>{skin.hint}</p>}

        {inlineProc && inlineSteps && inlineSteps.length > 0 && (
          <div className={css.procedureStoryBlock}>
            <ol className={css.procedureSteps} style={{ color: theme.accent }}>
              {inlineSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}

        {!inlineProc && data.procedureIds && data.procedureIds.length > 0 && (
          <div className={css.procedureIconRow}>
            {data.procedureIds.map((pid) => {
              const proc = getProcedure(pid)
              const done = doneProcedures.has(pid)
              return (
                <Link key={pid} to={`/procedure/${pid}`} style={{ position: 'relative' }}>
                  <button className={css.procedureIconBtn} style={{ borderColor: theme.accent, color: theme.accent }} aria-label={proc?.title ?? pid}>
                    {proc?.emoji ?? '?'}
                  </button>
                  {done && (
                    <span className={css.procDoneBadge}>{theme.doneEmoji ?? '✓'}</span>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        <div className={css.stageBack}>
          {isActive && (
            <button
              className={css.doneBtn}
              style={{ background: theme.accent, color: theme.accentText }}
              onClick={handleDone}
            >
              הצלחתי! ←
            </button>
          )}
          {isLastStage && !isActive && (
            <Link to="/procedures">
              <button
                className={css.doneBtn}
                style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
              >
                לבחירת הבדיקות ←
              </button>
            </Link>
          )}
          <Link to={isOptional ? '/night-map' : '/map'}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              חזרה למפה →
            </button>
          </Link>
        </div>
      </div>

      {data.sensory && <SensoryBar sensory={data.sensory} />}
      <p className={css.waitRange}>
        {inlineProc?.who && <span>👤 {inlineProc.who}</span>}
        {inlineProc?.who && data.waitRange && <span> · </span>}
        {data.waitRange && <span>⏱ זמן משוער: {data.waitRange}</span>}
      </p>

      <div className={css.stageBody}>
        {data.meaning && (
          <section>
            <h2>אנחנו כאן</h2>
            <p>{data.meaning}</p>
          </section>
        )}

        {inlineProc ? (
          <>
            <section>
              <h2>מה קורה בפועל</h2>
              <p>{inlineProc.what}</p>
            </section>
            <section>
              <h2>מה הילד/ה עשוי/ה להרגיש</h2>
              <p>{inlineProc.feel}</p>
            </section>
            {inlineProc.prepare && (
              <section>
                <h2>איך להכין את הילד/ה</h2>
                <p>{inlineProc.prepare}</p>
              </section>
            )}
            {inlineProc.adaptations && inlineProc.adaptations.length > 0 && (
              <section>
                <h2>מה לבקש מהצוות</h2>
                <ul>
                  {inlineProc.adaptations.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}
            {data.challenge && (
              <section>
                <h2>מה יכול להיות קשה?</h2>
                <p>{data.challenge}</p>
              </section>
            )}
            {data.canAsk && data.canAsk.length > 0 && (
              <section>
                <h2>אפשר לבקש</h2>
                <ul>
                  {data.canAsk.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}
          </>
        ) : (
          <>
            <section>
              <h2>מה קורה</h2>
              <p>{data.whatHappens}</p>
            </section>
            {data.challenge && (
              <section>
                <h2>מה יכול להיות קשה?</h2>
                <p>{data.challenge}</p>
              </section>
            )}
            {data.canAsk && data.canAsk.length > 0 && (
              <section>
                <h2>אפשר לבקש</h2>
                <ul>
                  {data.canAsk.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}
          </>
        )}
        <Link to="/calm" className={css.calmLink}>
          💙 קשה לנו כרגע
        </Link>
      </div>
    </div>
  )
}
