import { keyed } from '../lib/keyed'
import { Link, useBack } from '../concepts/nav'
import { usePersistentState } from '../hooks/usePersistentState'
import i18nUi from '../data/i18n/ui.json'
import { DAY_MS } from '../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../data/careCard'
import { CareCardView, careCardHeading } from '../components/careCard/CareCardView'
import { LineIcon } from '../components/LineIcon'
import styles from './CareCardViewPage.module.css'

type Lang = 'he' | 'en' | 'ru'

/** The card as the staff reads it: Hebrew, on black. */
export function CareCardViewPage() {
  const lang: Lang = 'he'
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const back = useBack()
  const ui = keyed((i18nUi as unknown as Record<Lang, { cardView: Record<string, string>; buttons: { back: string } }>)[lang], 'i18n/ui')
  const cv = ui.cardView
  const emptyTitle = keyed((i18nUi as unknown as Record<Lang, { card: { empty: { title: string; hint: string } } }>)[lang], 'i18n/ui').card.empty
  if (isCardEmpty(card)) {
    return (
      <div className={styles.empty}>
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
    <div className={styles.staffScreen}>
      <div className="app-container">
        <div className={`${styles.card} app-print-area`}>
          <div className={styles.cardHead}>
            <span className={styles.cardHeadIcon} aria-hidden>
              <LineIcon id="card-about" size={28} />
            </span>
            <div>
              <div className={styles.cardTitle}>{heading.title}</div>
              {heading.age && <div className={styles.cardAge}>{heading.age}</div>}
            </div>
          </div>
          <CareCardView lineIcons classes={{ rows: styles.rows, row: styles.row, label: styles.label, value: styles.value }} />
        </div>
        {/* the parent's way out of the card, once the staff has read it */}
        <div className={`${styles.actions} app-no-print`}>
          <button type="button" className={styles.actionBtn} onClick={() => back('/card')}>
            {ui.buttons.back}
          </button>
        </div>
      </div>
    </div>
  )
}
