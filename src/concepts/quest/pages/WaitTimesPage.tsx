import { useNavigate } from 'react-router-dom'
import { Link } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { getProcedure } from '../../../data/procedures'
import { SensoryBar } from '../../../components/SensoryBar'
import { useQuestProgress, loadProcs } from '../useQuestProgress'
import css from '../quest.module.css'

export function WaitTimesPage() {
  const { theme } = useQuestTheme()
  const { active, completeProcedure, completeActive } = useQuestProgress()
  const navigate = useNavigate()

  const isActive = active?.id === 'wait-before-triage'

  function handleDone() {
    const procIds = ['temperature', 'saturation', 'blood-pressure']
    const anyProcDone = procIds.some((pid) => loadProcs().has(pid))
    if (!anyProcDone) completeProcedure('wait-before-triage')
    completeActive()
    navigate('/quest/map')
  }

  const data = journeyStages.find((j) => j.id === 'wait-before-triage')
  if (!data) return <div>Error: stage not found</div>

  const procIds = ['temperature', 'saturation', 'blood-pressure']

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>⏳</span>
        <h1 style={{ color: theme.accent }}>{data.title}</h1>
        <p className={css.stageHeroHint}>{data.meaning}</p>

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
          <Link to="/map">
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              חזרה למפה →
            </button>
          </Link>
        </div>
      </div>

      {data.sensory && <SensoryBar sensory={data.sensory} />}
      <p className={css.waitRange}>
        {data.waitRange && <span>⏱ זמן משוער: {data.waitRange}</span>}
      </p>

      <div className={css.stageBody}>
        {data.whatHappens && (
          <section>
            <h2>מה קורה כאן</h2>
            <p>{data.whatHappens}</p>
          </section>
        )}

        {data.challenge && (
          <section>
            <h2>מה יכול להיות קשה?</h2>
            <p>{data.challenge}</p>
          </section>
        )}

        <section>
          <h2>איך להכין את הילד/ה למדידות שעומדות לקרות</h2>
          <p style={{ marginBottom: 'var(--space-3)' }}>{data.nextStagePrepare}</p>

          {procIds.map((pid) => {
            const proc = getProcedure(pid)
            if (!proc) return null
            return (
              <div key={pid} style={{ marginBottom: 'var(--space-3)' }}>
                <p style={{ margin: 0, marginBottom: 'var(--space-2)' }}>
                  <strong>{proc.emoji} {proc.title}</strong>
                </p>
                <p style={{ margin: 0, marginBottom: 'var(--space-1)', fontSize: '0.95em', lineHeight: '1.5' }}>
                  {proc.what} {proc.feel && `לא כואב — ${proc.feel}`}
                </p>
                <p style={{ margin: 0, marginBottom: 'var(--space-2)', fontSize: '0.95em', lineHeight: '1.5', fontStyle: 'italic' }}>
                  💡 {proc.prepare}
                </p>
              </div>
            )
          })}
        </section>

        {data.canAsk && data.canAsk.length > 0 && (
          <section>
            <h2>אפשר לבקש</h2>
            <ul>
              {data.canAsk.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
