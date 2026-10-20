import { useState } from 'react'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { useQuestTheme } from '../useQuestTheme'
import { useReturnTo } from '../useReturnTo'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

const watchables: { emoji: string }[] = [
  { emoji: '🌈' },
  { emoji: '💧' },
  { emoji: '🌟' },
  { emoji: '💗' },
  { emoji: '🌀' },
  { emoji: '⭐' },
]

const bubbles = [
  { size: 46, left: '8%', delay: '0s', duration: '13s' },
  { size: 26, left: '24%', delay: '3.5s', duration: '16s' },
  { size: 60, left: '44%', delay: '1.5s', duration: '11s' },
  { size: 32, left: '64%', delay: '5s', duration: '15s' },
  { size: 40, left: '82%', delay: '2.5s', duration: '18s' },
  { size: 20, left: '92%', delay: '6.5s', duration: '12s' },
]

export function DistractPage() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { goBack } = useReturnTo('/calm')
  const [pick, setPick] = useState(watchables[0])

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      {/* ── Child zone ── */}
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <h1 style={{ color: theme.accent }}>{theme.distractTitle ?? t('ui.text.distractDefault')}</h1>
        <p className={css.stageHeroHint}>{t('ui.text.distractHint')}</p>

        <div className={css.distractStage}>
          <div className={css.distractBubbleField} aria-hidden>
            {bubbles.map((b, i) => (
              <span
                key={i}
                className={css.distractBubble}
                style={{
                  width: b.size,
                  height: b.size,
                  insetInlineStart: b.left,
                  animationDelay: b.delay,
                  animationDuration: b.duration,
                }}
              />
            ))}
          </div>
          <AnimatedIcon emoji={pick.emoji} size={180} className={css.distractArt} />
        </div>

        <div className={css.distractPicker} role="group" aria-label={t('ui.text.distractAria')}>
          {watchables.map((w, wi) => (
            <button
              key={w.emoji}
              type="button"
              className={`${css.distractOpt} ${pick.emoji === w.emoji ? css.distractOptOn : ''}`}
              style={pick.emoji === w.emoji ? { borderColor: theme.accent, background: theme.accentSoft } : undefined}
              onClick={() => setPick(w)}
              aria-pressed={pick.emoji === w.emoji}
            >
              <span aria-hidden>{w.emoji}</span>
              {t(`ui.text.distractLabels.${wi}`)}
            </button>
          ))}
        </div>

        <div className={css.stageBack}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            {t('ui.buttons.back')}
          </button>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        <p className={css.parentZoneLabel}>{t('ui.text.distractWhy')}</p>
        <section>
          <p>{t('ui.text.distractP1')}</p>
        </section>
        <p className={css.cardPrivacy}>
          {t('ui.text.distractP2')}
        </p>
      </div>
    </div>
  )
}
