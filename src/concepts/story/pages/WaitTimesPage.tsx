import { keyed } from '../../../lib/keyed'
import { useI18n } from '../../../hooks/useI18n'
import { parentJourney } from '../../../data/parent'
import { Scene, Bubble } from '../components/kit'
import homeTexts from '../../../data/parent/home.json'

export function WaitTimesPage() {
  const { lang, dir, t } = useI18n()
  const tx = keyed(homeTexts[lang], 'parent/home').wait
  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={t('ui.tiles.wait-times.title')} subtitle={t('ui.tiles.wait-times.desc')}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          {tx.note}
        </Bubble>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {parentJourney(lang).map((stage, i) => (
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
                  {stage.waitKind === 'duration' ? tx.duration : tx.wait}:
                </span>
                <br />
                <span style={{ fontSize: '1.1em' }}>{stage.waitRange}</span>
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
            {tx.back}
          </button>
        </a>
      </div>
    </Scene>
    </div>
  )
}
