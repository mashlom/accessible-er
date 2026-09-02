import { useState } from 'react'
import { Link } from '../../nav'
import { AnimatedIcon } from '../components/AnimatedIcon'
import { Scene, Bubble, Note } from '../components/kit'
import styles from '../pages.module.css'

/**
 * "פינת הסחת דעת" — the distraction the spec keeps listing as an adaptation
 * ("הסחת דעת: סרטון, בועות, ספירה"). Something calm and looping to look at
 * during a needle, a cast or a long wait, with the choice of *what* to watch
 * left to the child: another small piece of control at a moment with very
 * little of it.
 *
 * Only emoji that actually have an animation are offered here — a static
 * glyph would defeat the point.
 */
const watchables: { emoji: string; label: string }[] = [
  { emoji: '🌈', label: 'קשת' },
  { emoji: '💧', label: 'טיפה' },
  { emoji: '🌟', label: 'כוכב' },
  { emoji: '💗', label: 'לב' },
  { emoji: '🌀', label: 'סחרחורת' },
  { emoji: '⭐', label: 'כוכבון' },
]

/** Slow-rising bubbles, offset so they never pulse together. */
const bubbles = [
  { size: 46, left: '8%', delay: '0s', duration: '13s' },
  { size: 26, left: '24%', delay: '3.5s', duration: '16s' },
  { size: 60, left: '44%', delay: '1.5s', duration: '11s' },
  { size: 32, left: '64%', delay: '5s', duration: '15s' },
  { size: 40, left: '82%', delay: '2.5s', duration: '18s' },
  { size: 20, left: '92%', delay: '6.5s', duration: '12s' },
]

export function DistractPage() {
  const [pick, setPick] = useState(watchables[0])

  return (
    <Scene
      title="פינת הסחת דעת"
      subtitle="משהו רגוע להסתכל עליו בזמן בדיקה, דקירה או המתנה ארוכה. הילד/ה בוחר/ת מה לראות."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          אפשר להסתכל לכאן במקום על היד. אני נשאר איתכם עד שזה נגמר.
        </Bubble>
      </div>

      <div className={styles.watchStage}>
        <div className={styles.bubbleField} aria-hidden>
          {bubbles.map((b, i) => (
            <span
              key={i}
              className={styles.bubble}
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
        <AnimatedIcon
          emoji={pick.emoji}
          size={200}
          className={styles.watchArt}
        />
      </div>

      <div className={styles.watchPicker} role="group" aria-label="מה רוצים לראות">
        {watchables.map((w) => (
          <button
            key={w.emoji}
            type="button"
            className={`${styles.watchOpt} ${pick.emoji === w.emoji ? styles.watchOptOn : ''}`}
            onClick={() => setPick(w)}
            aria-pressed={pick.emoji === w.emoji}
          >
            <span aria-hidden>{w.emoji}</span>
            {w.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          אם המכשיר מוגדר ל"הפחתת תנועה", האנימציות לא ירוצו — הבועות והציור יישארו
          במקום. אפשר גם פשוט לספור יחד עד עשר; גם זו הסחת דעת טובה.
        </Note>
      </div>

      <Link to="/calm" className={styles.crossLink}>
        💗 לעוד דברים שעוזרים כשקשה ←
      </Link>
    </Scene>
  )
}
