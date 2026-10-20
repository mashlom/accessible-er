import { Link } from '../concepts/nav'
import { Mascot } from './Mascot'
import { Note } from './ui'
import { usePersistentState } from '../hooks/usePersistentState'
import { useI18n } from '../hooks/useI18n'
import parentUi from '../data/parent/ui.json'
import { DAY_MS } from '../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../data/careCard'
import { CareCardView, careCardHeading } from '../components/careCard/CareCardView'
import styles from './CareCardViewPage.module.css'

type Lang = 'he' | 'en' | 'ru'

/** The card as the staff reads it: the same view as on every other screen. */
export function CareCardViewPage() {
  const { lang } = useI18n()
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const cv = (parentUi as unknown as Record<Lang, { cardView: Record<string, string> }>)[lang].cardView
  const emptyTitle = (parentUi as unknown as Record<Lang, { card: { empty: { title: string; hint: string } } }>)[lang].card.empty

  if (isCardEmpty(card)) {
    return (
      <div className={styles.empty}>
        <Mascot size={96} mood="calm" />
        <h1>{emptyTitle.title}</h1>
        <p>{emptyTitle.hint}</p>
        <Link to="/card" className={styles.emptyBtn}>
          {cv.fill}
        </Link>
      </div>
    )
  }

  const heading = careCardHeading(card, lang)

  return (
    <div className="container">
      <div className={`${styles.card} print-area`}>
        <div className={styles.cardHead}>
          <span className={styles.cardHeadIcon} aria-hidden>
            🧒
          </span>
          <div>
            <div className={styles.cardTitle}>{heading.title}</div>
            {heading.age && <div className={styles.cardAge}>{heading.age}</div>}
          </div>
        </div>
        <CareCardView
          footer={({ print }) => (
            <div className={`${styles.controls} no-print`}>
              <button type="button" className={styles.pdfBtn} onClick={print}>
                {cv.savePdf}
              </button>
              <button type="button" className={styles.printBtn} onClick={print}>
                {cv.print}
              </button>
              <Link to="/card" className={styles.editBtn}>
                {cv.edit}
              </Link>
            </div>
          )}
        />
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-3)' }}>
        <Note>{cv.sendHint}</Note>
      </div>
    </div>
  )
}
