import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import css from '../quest.module.css'

export function NightMapPage() {
  const { theme } = useQuestTheme()
  const { visibleOptionals, allOptionalsDone } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const bg = theme.nightBg ?? theme.bg
  const bgStyle = bg
    ? { '--bg-portrait': `url(${bg})`, '--bg-landscape': `url(${bg})` } as React.CSSProperties
    : { '--bg-portrait': 'none', '--bg-landscape': 'none', background: theme.accentSoft } as React.CSSProperties

  const firstActiveIdx = visibleOptionals.findIndex((s) => s.status !== 'done')

  const stages = visibleOptionals.map((s, i) => {
    const data = journeyStages.find((j) => j.id === s.id)
    const skin = theme.stages[s.id]
    const effectiveStatus = s.status === 'done' ? 'done' : i === firstActiveIdx ? 'active' : 'locked'
    return {
      id: s.id,
      label: skin?.label ?? data?.title ?? s.id,
      icon: skin?.icon ?? data?.emoji ?? '❓',
      image: skin?.image,
      status: effectiveStatus,
      clickable: effectiveStatus !== 'locked',
    }
  })

  return (
    <div className={css.mapPage} style={bgStyle}>
      <div className={css.mapOverlay}>
        <h1 className={css.mapTitle} style={{ color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
          {theme.name}
        </h1>

        <div className={css.mapBottom}>
          <div className={css.stageStrip}>
            {stages.map((stage) => (
              <button
                key={stage.id}
                className={[css.stagePin, css[`pin--${stage.status}`]].join(' ')}
                onClick={() => stage.clickable && navigate(conceptPath(`/stage/${stage.id}`))}
                disabled={!stage.clickable}
                aria-label={stage.label}
              >
                <div className={css.pinImageWrap}>
                  {stage.image ? (
                    <img src={stage.image} alt="" className={css.pinImage} />
                  ) : (
                    <span className={css.pinEmoji}>{stage.icon}</span>
                  )}
                  {stage.status === 'done' && <span className={css.pinCheck} aria-hidden>{theme.doneEmoji ?? '✓'}</span>}
                  {stage.status === 'active' && <span className={css.pinPulse} aria-hidden />}
                </div>
                <span className={css.pinLabel}>{stage.label}</span>
              </button>
            ))}

            {/* Celebration — clickable once all stages are done */}
            {(() => {
              const skin = theme.stages['decision']
              const pinClass = [css.stagePin, css[allOptionalsDone ? 'pin--active' : 'pin--locked']].join(' ')
              return (
                <button
                  className={pinClass}
                  onClick={() => allOptionalsDone && navigate(conceptPath('/celebrate'))}
                  disabled={!allOptionalsDone}
                  aria-label={skin?.label ?? 'סוף טוב'}
                >
                  <div className={css.pinImageWrap} style={allOptionalsDone ? {} : { opacity: 0.6 }}>
                    {skin?.image ? (
                      <img src={skin.image} alt="" className={css.pinImage} />
                    ) : (
                      <span className={css.pinEmoji}>🎉</span>
                    )}
                    {allOptionalsDone && <span className={css.pinPulse} aria-hidden />}
                  </div>
                  <span className={css.pinLabel}>{skin?.label ?? 'סוף טוב'}</span>
                </button>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
