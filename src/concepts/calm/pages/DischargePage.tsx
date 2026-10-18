import { Link } from '../../nav'
import { PageHeader } from '../components/ui'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import styles from './SupportPages.module.css'

/**
 * Discharge / going-home screen (Keren & Rotem, K6 + K13/K14).
 * Draft Hebrew copy — to be refined together with Hagit.
 */
// the emoji of each block stay here; the words come from src/data/parent/ui.json (the same blocks as on the quest's celebration screen)
const BLOCK_EMOJI = ['📝', '🚪', '🏠', '🧰', '🩺']

export function DischargePage() {
  const { t, lang } = useI18n()
  const texts = ((parentUi as unknown as Record<'he' | 'en' | 'ru', { celebrate: { discharge: { title: string; body: string }[] } }>)[lang] ?? (parentUi as unknown as Record<'he', { celebrate: { discharge: { title: string; body: string }[] } }>).he).celebrate.discharge
  const dischargeBlocks = texts.map((b, i) => ({ emoji: BLOCK_EMOJI[i], ...b }))
  return (
    <div className="container">
      <PageHeader
        eyebrow={t('ui.calmDischarge.eyebrow', 'שחרור')}
        title={t('ui.calmDischarge.title', 'לקראת שחרור הביתה')}
        subtitle={t('ui.calmDischarge.subtitle', 'מה קורה בסיום הביקור, ואיך מתכוננים לחזרה הביתה.')}
      />

      <div className={styles.list}>
        {dischargeBlocks.map((b, i) => (
          <div key={i} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {b.emoji}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{b.title}</h2>
              <p className={styles.tipBody}>{b.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
        <Link to="/">{t('ui.calmDischarge.home', 'חזרה לדף הבית')}</Link>
      </div>
    </div>
  )
}
