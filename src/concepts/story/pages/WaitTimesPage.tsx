import { journeyStages } from '../../../data/journey'
import { Scene, Bubble } from '../components/kit'
import styles from '../pages.module.css'

export function WaitTimesPage() {
  return (
    <Scene
      title="זמנים משוערים"
      subtitle="כל שלב יכול לקחת בערך כמה דקות"
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          הזמנים בעמוד הזה הם טווחים בלבד. הסדר והזמנים עשויים להשתנות לפי החלטת הצוות ולפי העומס במיון.
        </Bubble>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {journeyStages.map((stage, i) => (
          <div
            key={stage.id}
            style={{
              padding: 'var(--space-3)',
              borderLeft: '4px solid var(--c-story)',
              background: 'var(--c-story-soft)',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.25em', minWidth: '2em' }}>{stage.emoji}</span>
              <h3 style={{ margin: 0, color: 'var(--c-story)', flex: 1 }}>
                {i + 1}. {stage.title}
              </h3>
            </div>

            {stage.waitRange && (
              <p style={{ margin: 0, fontSize: '0.95em', color: 'var(--c-story)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 600 }}>
                  {stage.waitKind === 'duration' ? '⏱️ משך זמן משוער' : '⏳ זמן המתנה משוער'}:
                </span>
                <br />
                <span style={{ fontSize: '1.1em' }}>{stage.waitRange}</span>
              </p>
            )}

            {stage.meaning && (
              <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--c-story)', opacity: 0.85 }}>
                {stage.meaning}
              </p>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
        <a href="#/story/trail" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--c-story)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95em',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            חזרה ←
          </button>
        </a>
      </div>
    </Scene>
  )
}
