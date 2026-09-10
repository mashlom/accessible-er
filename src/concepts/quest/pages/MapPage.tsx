import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import css from '../quest.module.css'

export function MapPage() {
  const { theme } = useQuestTheme()
  const { visible, doneProcedures } = useQuestProgress()
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
    const procIds = data?.procedureIds ?? []
    const procCoins = procIds.filter((pid) => doneProcedures.has(pid)).length
    const stageCoins = doneProcedures.has(id) ? 1 : 0
    const earnedCoins = procCoins > 0 ? procCoins : stageCoins
    return {
      id,
      label: skin?.label ?? data?.title ?? id,
      icon: skin?.icon ?? data?.emoji ?? '❓',
      image: skin?.image,
      status: state?.status ?? 'locked',
      earnedCoins,
    }
  })

  return (
    <div className={css.mapPage} style={bgStyle}>
      <div className={css.mapOverlay}>
        <a href="#/" className={css.allConceptsLink}>
          🔗 כל הקונספטים (זמני)
        </a>
        <h1 className={css.mapTitle} style={{ color: theme.accent }}>
          {theme.name}
        </h1>

        <div className={css.mapBottom}>
          <div className={css.stageStrip}>
            {requiredStages.map((stage, i) => (
              <button
                key={stage.id}
                className={[css.stagePin, css[`pin--${stage.status}`]].join(' ')}
                onClick={() => navigate(conceptPath(`/stage/${stage.id}`))}
                aria-label={stage.label}
              >
                <div className={css.pinImageWrap}>
                  {stage.image ? (
                    <img src={stage.image} alt="" className={css.pinImage} />
                  ) : (
                    <span className={css.pinEmoji}>{stage.icon}</span>
                  )}
                  {stage.status === 'done' && (
                    <span className={css.pinCoins} aria-hidden>
                      {Array.from({ length: stage.earnedCoins }, (_, i) => (
                        <span key={i} className={css.pinCoin}>{theme.doneEmoji ?? '✓'}</span>
                      ))}
                    </span>
                  )}
                  {stage.status === 'locked' && <span className={css.pinLock} aria-hidden>🔒</span>}
                  {stage.status === 'active' && <span className={css.pinPulse} aria-hidden />}
                </div>
                <span className={css.pinLabel}>{i + 1}. {stage.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
