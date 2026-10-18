import { useI18n } from '../../../hooks/useI18n'
import { useNavigate } from 'react-router-dom'
import { parentJourney } from '../../../data/parent'
import { PageHeader } from '../components/ui'

export function WaitTimesPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()

  return (
    <div className="container">
      <PageHeader
        eyebrow="⏱️"
        title={t('ui.calmWaitTimes.title', 'זמנים משוערים')}
        subtitle={t('ui.calmWaitTimes.subtitle', 'כל שלב יכול לקחת בערך כמה דקות')}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {parentJourney(lang).map((stage, i) => (
          <div
            key={stage.id}
            style={{
              padding: '1.5rem',
              borderLeft: `4px solid var(--c-calm)`,
              background: 'var(--c-calm-soft)',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5em', minWidth: '2em' }}>{stage.emoji}</span>
              <h3 style={{ margin: 0, color: 'var(--c-calm)', flex: 1 }}>
                {i + 1}. {stage.title}
              </h3>
            </div>

            {stage.waitRange && (
              <p style={{ margin: 0, fontSize: '0.95em', color: 'var(--c-calm)', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>
                  {stage.waitKind === 'duration' ? `⏱️ ${t('ui.calmJourney.durationLabel', 'משך זמן משוער')}` : `⏳ ${t('ui.calmJourney.waitLabel', 'זמן המתנה משוער')}`}:
                </span>
                <br />
                <span style={{ fontSize: '1.1em', fontWeight: 500 }}>{stage.waitRange}</span>
              </p>
            )}

            {stage.meaning && (
              <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--c-calm)', opacity: 0.85 }}>
                {stage.meaning}
              </p>
            )}
          </div>
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.85em', color: 'var(--c-calm)', opacity: 0.7, fontStyle: 'italic' }}>
        {t('ui.calmWaitTimes.note', 'הזמנים הם טווחים להמחשה בלבד. הסדר והזמנים עשויים להשתנות לפי החלטת הצוות ולפי העומס במיון.')}
      </p>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--c-calm)',
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
          {t('ui.calmWaitTimes.back', 'חזרה ←')}
        </button>
      </div>
    </div>
  )
}
