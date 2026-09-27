import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

export function MapPage() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { visible, doneProcedures } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const bgStyle = theme.bg
    ? {
        '--bg-portrait': `url(${theme.bg})`,
        '--bg-landscape': `url(${theme.bgLandscape ?? theme.bg})`,
      } as React.CSSProperties
    : { '--bg-portrait': 'none', '--bg-landscape': 'none', background: theme.accentSoft } as React.CSSProperties

  const allItems = REQUIRED_STAGES.map((id) => {
    const state = visible.find((s) => s.id === id)
    const data = t('journey.journeyStages', journeyStages).find((j) => j.id === id)
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
        <h1 className={css.mapTitle} style={{ color: theme.accent }}>
          {theme.name}
        </h1>

        <div className={css.mapBottom}>
          <div className={css.stageStrip}>
            {allItems.map((item, i) => (
              <button
                key={item.id}
                className={[css.stagePin, css[`pin--${item.status}`]].join(' ')}
                onClick={() => navigate(conceptPath(item.id === 'wait-before-triage' ? '/wait-times' : `/stage/${item.id}`))}
                aria-label={item.label}
              >
                <div className={css.pinImageWrap}>
                  {item.image ? (
                    <img src={item.image} alt="" className={css.pinImage} />
                  ) : (
                    <span className={css.pinEmoji}>{item.icon}</span>
                  )}
                  {item.status === 'done' && (
                    <span className={css.pinCoins} aria-hidden>
                      {Array.from({ length: item.earnedCoins }, (_, j) => (
                        <span key={j} className={css.pinCoin}>{theme.doneEmoji ?? '✓'}</span>
                      ))}
                    </span>
                  )}
                  {item.status === 'locked' && <span className={css.pinLock} aria-hidden>🔒</span>}
                  {item.status === 'active' && <span className={css.pinPulse} aria-hidden />}
                </div>
                <span className={css.pinLabel}>{i + 1}. {item.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
