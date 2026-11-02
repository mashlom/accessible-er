import { keyed } from '../../../lib/keyed'
import { Link } from '../../nav'
import { useSearchParams } from 'react-router-dom'
import { withoutEmoji } from '../../quest/components/ButtonIcon'
import { blocksFor } from '../../quest/pages/CelebratePage'
import { useI18n } from '../../../hooks/useI18n'
import homeTexts from '../../../data/parent/home.json'
import { Scene } from '../components/kit'
import shell from '../story.module.css'
import { LineIcon } from '../../../components/LineIcon'
import styles from '../pages.module.css'

/**
 * Discharge as its own scene (Keren & Rotem's feedback): going home is a
 * transition too, and the reaction to the visit often arrives only later,
 * at home. The texts are in parent/home.json.
 */
const emojis = ['📝', '🚪', '🏠', '🧰', '🩺']

/** Staying in the hospital: the same texts as the last sheet's "continue hospitalization" in the worlds */
function StayPage() {
  const { lang, dir, t } = useI18n()
  const blocks = blocksFor(lang, 'admission')
  return (
    <div dir={dir} lang={lang} className={styles.trailLook} style={{ textAlign: 'start' }}>
    <Scene title={withoutEmoji(t('ui.buttons.admission'))} back="/trail">
      <div className={styles.tips}>
        {blocks.map((b, i) => (
          <div key={b.title} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden><LineIcon id={`end-admission-${i}`} emoji={b.emoji} size={22} /></span>
            <div>
              {b.title && <h2 className={styles.tipTitle}>{b.title}</h2>}
              <p className={styles.tipBody}>{b.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* the other end of the visit */}
      <Link to="/going-home" className={`${styles.crossLink} ${styles.endLink}`}>
        <span className={styles.stopIcon} aria-hidden><LineIcon id="going-home" size={22} /></span>
        {withoutEmoji(t('ui.buttons.discharge'))}
      </Link>
    </Scene>
    </div>
  )
}

export function GoingHomePage() {
  const { lang, dir, t } = useI18n()
  const tx = keyed(homeTexts[lang], 'parent/home').goingHome
  const [params] = useSearchParams()
  if (params.has('stay')) return <StayPage />
  return (
    <div dir={dir} lang={lang} className={styles.trailLook} style={{ textAlign: 'start' }}>
    <Scene title={t('ui.tiles.discharge.title')} subtitle={tx.subtitle}>
      <div className={styles.tips}>
        {tx.blocks.map(([rawTitle, body], i) => {
          // the first title is the same as the celebration's first title (one key)
          const title = rawTitle ?? t('ui.celebrate.discharge.0.title')
          return (
          <div key={title} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              <LineIcon id={`end-discharge-${i}`} emoji={emojis[i]} size={22} />
            </span>
            <div>
              <h2 className={styles.tipTitle}>{title}</h2>
              <p className={styles.tipBody}>{body}</p>
            </div>
          </div>
          )
        })}
      </div>

      <div className={styles.center} style={{ marginTop: 'var(--space-5)' }}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f0341', fontFamily: 'Rubik, var(--font)' }}>
          {tx.closing}
        </p>
      </div>

      <div className={`${styles.actions} ${styles.actionsSingle}`}>
        <Link to="/feedback" className={shell.bigBtn}>
          {tx.feedback}
        </Link>
      </div>

      {/* the other end of the visit: staying in the hospital */}
      <Link to="/going-home?stay=1" className={`${styles.crossLink} ${styles.endLink}`}>
        <span className={styles.stopIcon} aria-hidden><LineIcon id="tile-admission" size={22} /></span>
        {withoutEmoji(t('ui.buttons.admission'))}
      </Link>
    </Scene>
    </div>
  )
}
