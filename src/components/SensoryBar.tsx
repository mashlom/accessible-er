import type { SensoryLevels } from '../data/types'
import css from './SensoryBar.module.css'

interface Props {
  sensory: SensoryLevels
}

const CHANNELS = [
  { key: 'sound',  emoji: '🔊', label: 'רעש' },
  { key: 'light',  emoji: '💡', label: 'אור' },
  { key: 'smell',  emoji: '👃', label: 'ריח' },
  { key: 'people', emoji: '👥', label: 'אנשים' },
] as const

function level(n: number): string {
  if (n <= 1) return 'נמוך'
  if (n <= 3) return 'בינוני'
  return 'גבוה'
}

function levelClass(n: number): string {
  if (n <= 1) return css.low
  if (n <= 3) return css.mid
  return css.high
}

export function SensoryBar({ sensory }: Props) {
  return (
    <div className={css.bar}>
      <p className={css.title}>מה לצפות כאן</p>
      <div className={css.channels}>
        {CHANNELS.map(({ key, emoji, label }) => {
          const val = sensory[key]
          return (
            <div key={key} className={css.channel}>
              <span className={css.emoji}>{emoji}</span>
              <span className={css.channelLabel}>{label}</span>
              <div className={css.dots}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={[css.dot, i <= val ? levelClass(val) : css.empty].join(' ')}
                  />
                ))}
              </div>
              <span className={[css.levelLabel, levelClass(val)].join(' ')}>{level(val)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
