import { keyed } from '../../../lib/keyed'
import { useI18n } from '../../../hooks/useI18n'
import { parentJourney } from '../../../data/parent'
import { Scene, Bubble } from '../components/kit'
import { Link } from '../../nav'
import { LineIcon } from '../../../components/LineIcon'
import homeTexts from '../../../data/parent/home.json'
import styles from '../pages.module.css'

/** The estimated times of every stage, in the home's look: one white card per stage, as on the trail */
export function WaitTimesPage() {
  const { lang, dir, t } = useI18n()
  const tx = keyed(homeTexts[lang], 'parent/home').wait
  return (
    <div dir={dir} lang={lang} className={styles.trailLook} style={{ textAlign: 'start' }}>
    <Scene title={t('ui.tiles.wait-times.title')} subtitle={t('ui.tiles.wait-times.desc')}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          {tx.note}
        </Bubble>
      </div>

      <ol className={styles.waitList}>
        {parentJourney(lang).map((stage, i) => (
          <li key={stage.id} className={styles.stopCard}>
            <span className={styles.stopTitleRow}>
              <span className={styles.stopTitle}>
                <span className={styles.stopIcon} aria-hidden>
                  <LineIcon id={`stage-${stage.id}`} emoji={stage.emoji} size={22} />
                </span>
                {i + 1}. {stage.title}
              </span>
            </span>
            {stage.waitRange && (
              <p className={styles.waitRow}>
                <span className={styles.waitKind}>{stage.waitKind === 'duration' ? tx.duration : tx.wait}</span>
                <span className={styles.stopWait}>{stage.waitRange}</span>
              </p>
            )}
          </li>
        ))}
      </ol>

      <Link to="/trail" className={styles.lookBtn}>
        {t('ui.tiles.journey.title')}
      </Link>
    </Scene>
    </div>
  )
}
