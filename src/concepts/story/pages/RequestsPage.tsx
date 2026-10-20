import { keyed } from '../../../lib/keyed'
import { Scene, Bubble, Note } from '../components/kit'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import styles from '../pages.module.css'

type StoryRequestsTexts = {
  title: string
  subtitle: string
  bubble: string
  note: string
  items: { emoji: string; title: string; detail: string }[]
}

/** The legitimate asks. Informational — nothing is sent; the parent asks. */
export function RequestsPage() {
  const { lang, dir } = useI18n()
  const tx = keyed((parentUi as unknown as Record<'he' | 'en' | 'ru', { storyRequests: StoryRequestsTexts }>)[lang], 'parent/ui').storyRequests
  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
      </div>

      <div className={styles.requests}>
        {tx.items.map((r) => (
          <div key={r.title} className={styles.request}>
            <span className={styles.requestEmoji} aria-hidden>
              {r.emoji}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{r.title}</h2>
              <p className={styles.tipBody}>{r.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>
    </Scene>
    </div>
  )
}
