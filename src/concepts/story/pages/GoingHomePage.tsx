import { Link } from '../../nav'
import { useI18n } from '../../../hooks/useI18n'
import homeTexts from '../../../data/parent/home.json'
import { Scene, Bubble, Note } from '../components/kit'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * Discharge as its own scene (Keren & Rotem's feedback): going home is a
 * transition too, and the reaction to the visit often arrives only later,
 * at home. The texts are in parent/home.json (a draft, to be finalised with Hagit).
 */
const emojis = ['📝', '🚪', '🏠', '🧰', '🩺']

export function GoingHomePage() {
  const { lang, dir } = useI18n()
  const tx = homeTexts[lang].goingHome
  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
      </div>

      <div className={styles.tips}>
        {tx.blocks.map(([title, body], i) => (
          <div key={title} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {emojis[i]}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{title}</h2>
              <p className={styles.tipBody}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.center} style={{ marginTop: 'var(--space-5)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--s-ink)' }}>
          {tx.closing}
        </p>
      </div>

      <div className={styles.actions}>
        <Link to="/feedback" className={shell.bigBtn}>
          {tx.feedback}
        </Link>
        <Link to="/" className={shell.ghostBtn}>
          {tx.back}
        </Link>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>
    </Scene>
    </div>
  )
}
