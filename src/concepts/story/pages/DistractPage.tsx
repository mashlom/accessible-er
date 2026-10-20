import { keyed } from '../../../lib/keyed'
import { useState } from 'react'
import { Link } from '../../nav'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { Scene, Bubble, Note } from '../components/kit'
import styles from '../pages.module.css'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'

type StoryDistractTexts = {
  title: string
  subtitle: string
  bubble: string
  labels: string[]
  aria: string
  note: string
  cross: string
}

/**
 * "Distraction corner" — the distraction the spec keeps listing as an adaptation
 * ("distraction: video, bubbles, counting"). Something calm and looping to look at
 * during a needle, a cast or a long wait, with the choice of *what* to watch
 * left to the child: another small piece of control at a moment with very
 * little of it.
 *
 * Only emoji that actually have an animation are offered here — a static
 * glyph would defeat the point.
 */
const watchEmojis = ['🌈', '💧', '🌟', '💗', '🌀', '⭐']

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
  const { lang, dir } = useI18n()
  const tx = keyed((parentUi as unknown as Record<'he' | 'en' | 'ru', { storyDistract: StoryDistractTexts }>)[lang], 'parent/ui').storyDistract
  const watchables = watchEmojis.map((emoji, i) => ({ emoji, label: tx.labels[i] ?? '' }))
  const [pick, setPick] = useState(watchEmojis[0])
  const current = watchables.find((w) => w.emoji === pick) ?? watchables[0]

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
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
          emoji={current.emoji}
          size={200}
          className={styles.watchArt}
        />
      </div>

      <div className={styles.watchPicker} role="group" aria-label={tx.aria}>
        {watchables.map((w) => (
          <button
            key={w.emoji}
            type="button"
            className={`${styles.watchOpt} ${current.emoji === w.emoji ? styles.watchOptOn : ''}`}
            onClick={() => setPick(w.emoji)}
            aria-pressed={current.emoji === w.emoji}
          >
            <span aria-hidden>{w.emoji}</span>
            {w.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>

      <Link to="/calm" className={styles.crossLink}>
        {tx.cross}
      </Link>
    </Scene>
    </div>
  )
}
