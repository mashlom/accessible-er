import { forwardRef } from 'react'
import type { CareCard } from '../../data/careCard'
import { CareCardView, careCardHeading } from './CareCardView'
import styles from './CareCardPaper.module.css'

/** The card laid out on an A4 page, drawn out of sight: saveCardPdf takes its picture. */
export const CareCardPaper = forwardRef<HTMLDivElement, { card: CareCard }>(function CareCardPaper({ card }, ref) {
  const heading = careCardHeading(card, 'he')
  return (
    <div className={styles.offscreen} aria-hidden>
    <div ref={ref} className={styles.paper} dir="rtl" lang="he">
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.headIcon}>🧒</span>
          <div>
            <div className={styles.title}>{heading.title}</div>
            {heading.age && <div className={styles.age}>{heading.age}</div>}
          </div>
        </div>
        <CareCardView classes={{ rows: styles.rows, row: styles.row, label: styles.label, value: styles.value }} />
      </div>
    </div>
    </div>
  )
})
