import { Link } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { getProcedure } from '../../../data/procedures'
import { SensoryBar } from '../../../components/SensoryBar'
import css from '../quest.module.css'

export function WaitTimesPage() {
  const { theme } = useQuestTheme()

  const data = journeyStages.find((j) => j.id === 'wait-before-triage')
  if (!data) return <div>Error: stage not found</div>

  const procIds = ['temperature', 'saturation', 'blood-pressure']

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>⏳</span>
        <h1 style={{ color: theme.accent }}>{data.title}</h1>
        <p className={css.stageHeroHint}>{data.meaning}</p>
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
          <h2>הכנה למדידות שעומדות לקרות</h2>
          <p>{data.nextStagePrepare}</p>

          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {procIds.map((pid) => {
              const proc = getProcedure(pid)
              if (!proc) return null
              return (
                <div key={pid} style={{
                  padding: 'var(--space-2)',
                  background: theme.accentSoft,
                  borderRadius: '4px',
                  borderLeft: `3px solid ${theme.accent}`,
                }}>
                  <h3 style={{ margin: '0 0 var(--space-1) 0', color: theme.accent }}>
                    {proc.emoji} {proc.title}
                  </h3>
                  <p style={{ margin: '0 0 var(--space-1) 0', fontSize: '0.9em' }}>
                    <strong>מה קורה:</strong> {proc.what}
                  </p>
                  <p style={{ margin: '0 0 var(--space-1) 0', fontSize: '0.9em' }}>
                    <strong>איך להכין:</strong> {proc.prepare}
                  </p>
                  {proc.adaptations && proc.adaptations.length > 0 && (
                    <div style={{ fontSize: '0.9em' }}>
                      <strong>אפשר גם:</strong>
                      <ul style={{ margin: 'var(--space-1) 0 0 0', paddingLeft: '1.5em' }}>
                        {proc.adaptations.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {data.canAsk && data.canAsk.length > 0 && (
          <section>
            <h2>אפשר לבקש</h2>
            <ul>
              {data.canAsk.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}

        <Link to="/map">
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent, marginTop: 'var(--space-3)' }}>
            חזרה למפה →
          </button>
        </Link>
      </div>
    </div>
  )
}
