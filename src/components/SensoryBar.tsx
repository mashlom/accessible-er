import type { SensoryLevels } from '../data/types'
import { useI18n } from '../hooks/useI18n'
import css from './SensoryBar.module.css'
import { soundLabel } from '../data/careCard'
import { LineIcon } from './LineIcon'

interface Props {
  sensory: SensoryLevels
  /** The ocean world's sheets: a white card in its colours instead of the beige strip */
  ocean?: boolean
  /** Shevi's thin line icons instead of the emoji (the parent pages in the home's look) */
  lineIcons?: boolean
}

const CHANNELS = [
  { key: 'sound',  emoji: '🔊' },
  { key: 'light',  emoji: '💡' },
  { key: 'smell',  emoji: '👃' },
  { key: 'people', emoji: '👥' },
] as const

function levelClass(n: number): string {
  if (n <= 1) return css.low
  if (n <= 3) return css.mid
  return css.high
}

export function SensoryBar({ sensory, ocean, lineIcons }: Props) {
  const { t, lang } = useI18n()
  return (
    <div className={[css.bar, ocean && css.ocean, lineIcons && css.lilac].filter(Boolean).join(' ')}>
      <p className={css.title}>{t('ui.labels.adult.sensoryTitle')}</p>
      <div className={css.channels}>
        {CHANNELS.map(({ key, emoji }) => {
          const val = sensory[key]
          return (
            <div key={key} className={css.channel}>
              <span className={css.emoji}>{lineIcons ? <LineIcon id={`sense-${key}`} size={18} /> : emoji}</span>
              <span className={css.channelLabel}>{key === 'sound' ? soundLabel(lang) : t(`ui.text.sensoryLabels.${key}`)}</span>
              <div className={css.dots}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={[css.dot, i <= val ? levelClass(val) : css.empty].join(' ')}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
