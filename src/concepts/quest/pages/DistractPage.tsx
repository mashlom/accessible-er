import { useState } from 'react'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { useQuestTheme } from '../useQuestTheme'
import { useReturnTo } from '../useReturnTo'
import css from '../quest.module.css'

const watchables: { emoji: string; label: string }[] = [
  { emoji: '🌈', label: 'קשת' },
  { emoji: '💧', label: 'טיפה' },
  { emoji: '🌟', label: 'כוכב' },
  { emoji: '💗', label: 'לב' },
  { emoji: '🌀', label: 'סחרחורת' },
  { emoji: '⭐', label: 'כוכבון' },
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
  const { goBack } = useReturnTo('/calm')
  const [pick, setPick] = useState(watchables[0])

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      {/* ── Child zone ── */}
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <h1 style={{ color: theme.accent }}>{theme.distractTitle ?? 'פינת הסחת דעת'}</h1>
        <p className={css.stageHeroHint}>בחרי/בחר מה רוצים לראות ↓</p>

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

        <div className={css.distractPicker} role="group" aria-label="מה רוצים לראות">
          {watchables.map((w) => (
            <button
              key={w.emoji}
              type="button"
              className={`${css.distractOpt} ${pick.emoji === w.emoji ? css.distractOptOn : ''}`}
              style={pick.emoji === w.emoji ? { borderColor: theme.accent, background: theme.accentSoft } : undefined}
              onClick={() => setPick(w)}
              aria-pressed={pick.emoji === w.emoji}
            >
              <span aria-hidden>{w.emoji}</span>
              {w.label}
            </button>
          ))}
        </div>

        <div className={css.stageBack}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            חזרה →
          </button>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        <p className={css.parentZoneLabel}>הסחת דעת — למה זה עוזר</p>
        <section>
          <p>אפשר להסתכל יחד לכאן במקום על היד או על המכשיר. בחרו ביחד מה הכי מעניין את הילד/ה — עצם הבחירה כבר נותנת תחושת שליטה.</p>
        </section>
        <p className={css.cardPrivacy}>
          אם המכשיר מוגדר ל"הפחתת תנועה", האנימציות לא ירוצו. אפשר גם פשוט לספור יחד עד עשר — גם זו הסחת דעת טובה.
        </p>
      </div>
    </div>
  )
}
