import { keyed } from '../../../lib/keyed'
import { Link } from '../../nav'
import { Scene, Bubble, Note } from '../components/kit'
import { useI18n } from '../../../hooks/useI18n'
import i18nUi from '../../../data/i18n/ui.json'
import supportI18n from '../../../data/i18n/support.json'
import { staffRequests } from '../../../data/support'
import styles from '../pages.module.css'

type StoryRequestsTexts = {
  subtitle: string
  bubble: string
  note: string
  items: { emoji: string; title: string; detail: string }[]
}

/** The legitimate asks. Informational — nothing is sent; the parent asks. */
export function RequestsPage() {
  const { lang, dir, t } = useI18n()
  const tx = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { storyRequests: StoryRequestsTexts }>)[lang], 'i18n/ui').storyRequests
  // the requests: the emoji from the code, the words from the support source
  const items = staffRequests.map((d, i) => ({ ...d, ...(supportI18n as unknown as Record<string, { staffRequests: { title: string; detail: string }[] }>)[lang].staffRequests[i] }))

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={t('ui.tiles.requests.title')} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
      </div>

      <div className={styles.requests}>
        {items.map((r) => (
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

      <Link to="/card/view" className={styles.crossLink}>
        {t('ui.buttons.showCard')}
      </Link>
    </Scene>
    </div>
  )
}
