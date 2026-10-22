import type { SensoryLevels } from '../data/types'
import { useI18n } from '../hooks/useI18n'
import css from './SensoryBar.module.css'

interface Props {
  sensory: SensoryLevels
  /** The ocean world's sheets: a white card in its colours instead of the beige strip */
  ocean?: boolean
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

export function SensoryBar({ sensory, ocean }: Props) {
  const { t } = useI18n()
  return (
    <div className={ocean ? `${css.bar} ${css.ocean}` : css.bar}>
      <p className={css.title}>{t('ui.labels.adult.sensoryTitle')}</p>
      <div className={css.channels}>
        {CHANNELS.map(({ key, emoji }, ci) => {
          const val = sensory[key]
          return (
            <div key={key} className={css.channel}>
              <span className={css.emoji}>{emoji}</span>
              <span className={css.channelLabel}>{t(`ui.text.sensoryLabels.${ci}`)}</span>
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
