import { Link } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import css from '../quest.module.css'

export function WaitTimesPage() {
  const { theme } = useQuestTheme()

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>⏱️</span>
        <h1 style={{ color: theme.accent }}>זמנים משוערים</h1>
        <p className={css.stageHeroHint}>כל שלב יכול לקחת בערך כמה דקות</p>
      </div>

      <div className={css.stageBody}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {journeyStages.map((stage, i) => (
            <div
              key={stage.id}
              style={{
                padding: 'var(--space-3)',
                borderLeft: `4px solid ${theme.accent}`,
                background: theme.accentSoft,
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.25em', minWidth: '2em' }}>{stage.emoji}</span>
                <h3 style={{ margin: 0, color: theme.accent, flex: 1 }}>{i + 1}. {stage.title}</h3>
              </div>

              {stage.waitRange && (
                <p style={{ margin: 0, fontSize: '0.95em', color: theme.accent }}>
                  <span style={{ fontWeight: 600 }}>
                    {stage.waitKind === 'duration' ? '⏱️ משך זמן משוער' : '⏳ זמן המתנה משוער'}:
                  </span>
                  <br />
                  <span style={{ fontSize: '1.1em' }}>{stage.waitRange}</span>
                </p>
              )}

              {stage.meaning && (
                <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: '0.9em', color: theme.accent, opacity: 0.85 }}>
                  {stage.meaning}
                </p>
              )}
            </div>
          ))}
        </div>

        <p style={{ marginTop: 'var(--space-4)', fontSize: '0.85em', color: theme.accent, opacity: 0.7, fontStyle: 'italic' }}>
          הזמנים הם טווחים להמחשה בלבד. הסדר והזמנים עשויים להשתנות לפי החלטת הצוות ולפי העומס במיון.
        </p>

        <div className={css.stageBack}>
          <Link to="/map">
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              חזרה למפה →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
