import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, OPTIONAL_STAGES } from '../useQuestProgress'
import css from '../quest.module.css'

export function MapPage() {
  const { theme } = useQuestTheme()
  const { visible, active, completeActive, revealOptional } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const bgStyle = theme.bg
    ? { backgroundImage: `url(${theme.bg})` }
    : { background: theme.accentSoft }

  return (
    <div className={css.mapPage} style={bgStyle}>
      <div className={css.mapOverlay}>
        <h1 className={css.mapTitle} style={{ color: theme.accent }}>
          {theme.name}
        </h1>

        <ol className={css.stageList}>
          {visible.map((stage) => {
            const data = journeyStages.find((j) => j.id === stage.id)
            const skin = theme.stages[stage.id]
            const label = skin?.label ?? data?.title ?? stage.id
            const icon = skin?.icon ?? data?.emoji ?? '❓'
            const hint = skin?.hint ?? data?.meaning ?? ''

            return (
              <li
                key={stage.id}
                className={[
                  css.stageItem,
                  css[`stage--${stage.status}`],
                  stage.parentId ? css['stage--optional'] : '',
                ].join(' ')}
              >
                <button
                  className={css.stageBtn}
                  disabled={stage.status === 'locked'}
                  onClick={() => navigate(conceptPath(`/stage/${stage.id}`))}
                  aria-label={label}
                >
                  <span className={css.stageIcon}>{icon}</span>
                  <span className={css.stageText}>
                    <strong>{label}</strong>
                    {stage.status !== 'locked' && <span>{hint}</span>}
                  </span>
                  {stage.status === 'done' && <span className={css.stageDone} aria-hidden>✓</span>}
                  {stage.status === 'locked' && <span className={css.stageLock} aria-hidden>🔒</span>}
                </button>
              </li>
            )
          })}
        </ol>

        {/* Nurse/parent controls */}
        <div className={css.controls}>
          {active && (
            <button
              className={css.doneBtn}
              style={{ background: theme.accent, color: theme.accentText }}
              onClick={completeActive}
            >
              סיימנו! ➜
            </button>
          )}

          {/* Debug: reveal optional stages */}
          <details className={css.nursePanel}>
            <summary>הוספת שלב (לצוות)</summary>
            <div className={css.nurseBtns}>
              {OPTIONAL_STAGES.map((id) => {
                const already = visible.find((s) => s.id === id)
                const skin = theme.stages[id]
                return (
                  <button
                    key={id}
                    disabled={!!already}
                    onClick={() => revealOptional(id)}
                    className={css.nurseBtn}
                  >
                    {skin?.icon} {skin?.label ?? id}
                  </button>
                )
              })}
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
