import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES, OPTIONAL_STAGES } from '../useQuestProgress'
import css from '../quest.module.css'

export function MapPage() {
  const { theme } = useQuestTheme()
  const { visible, revealOptional } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const bgStyle = theme.bg
    ? {
        '--bg-portrait': `url(${theme.bg})`,
        '--bg-landscape': `url(${theme.bgLandscape ?? theme.bg})`,
      } as React.CSSProperties
    : { '--bg-portrait': 'none', '--bg-landscape': 'none', background: theme.accentSoft } as React.CSSProperties

  const requiredStages = REQUIRED_STAGES.map((id) => {
    const state = visible.find((s) => s.id === id)
    const data = journeyStages.find((j) => j.id === id)
    const skin = theme.stages[id]
    return {
      id,
      label: skin?.label ?? data?.title ?? id,
      icon: skin?.icon ?? data?.emoji ?? '❓',
      image: skin?.image,
      status: state?.status ?? 'locked',
    }
  })

  return (
    <div className={css.mapPage} style={bgStyle}>
      <div className={css.mapOverlay}>
        <h1 className={css.mapTitle} style={{ color: theme.accent }}>
          {theme.name}
        </h1>

        <div className={css.mapBottom}>
          <div className={css.stageStrip}>
            {requiredStages.map((stage, i) => (
              <button
                key={stage.id}
                className={[css.stagePin, css[`pin--${stage.status}`]].join(' ')}
                disabled={stage.status === 'locked'}
                onClick={() => navigate(conceptPath(`/stage/${stage.id}`))}
                aria-label={stage.label}
              >
                <div className={css.pinImageWrap}>
                  {stage.image ? (
                    <img src={stage.image} alt="" className={css.pinImage} />
                  ) : (
                    <span className={css.pinEmoji}>{stage.icon}</span>
                  )}
                  {stage.status === 'done' && <span className={css.pinCheck} aria-hidden>✓</span>}
                  {stage.status === 'locked' && <span className={css.pinLock} aria-hidden>🔒</span>}
                  {stage.status === 'active' && <span className={css.pinPulse} aria-hidden />}
                </div>
                <span className={css.pinLabel}>{i + 1}. {stage.label}</span>
              </button>
            ))}
          </div>

          <div className={css.controls}>
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
    </div>
  )
}
