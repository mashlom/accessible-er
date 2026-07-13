import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { distressTips, readySentences } from '../data/support'
import styles from './SupportPages.module.css'

export function CalmPage() {
  // A sentence the parent chose to show staff in large type.
  const [shown, setShown] = useState<string | null>(null)

  return (
    <div className="container">
      <PageHeader
        eyebrow="כשקשה"
        title="רגע של מצוקה? אנחנו כאן"
        subtitle="כשהילד/ה מוצף/ת, כמה דברים קטנים עוזרים. קחו נשימה — אתם עושים עבודה נהדרת."
      />

      <div className={styles.list}>
        {distressTips.map((tip, i) => (
          <div key={i} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {tip.emoji}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{tip.title}</h2>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.subhead}>🗨️ משפטים מוכנים לצוות</h2>
      <p className={styles.subnote}>
        קשה לדבר ברגע כזה? לחצו על משפט כדי להציג אותו לצוות בגדול על המסך.
      </p>
      <div className={styles.sentences}>
        {readySentences.map((s) => (
          <button
            key={s}
            type="button"
            className={styles.sentence}
            onClick={() => setShown(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <Link to="/requests" className={styles.crossLink}>
        🙋 לרשימת הדברים שאפשר לבקש מהצוות ←
      </Link>

      {shown && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="משפט מוצג לצוות"
          onClick={() => setShown(null)}
        >
          <p className={styles.overlayText}>{shown}</p>
          <button type="button" className={styles.overlayClose}>
            סגירה
          </button>
        </div>
      )}
    </div>
  )
}
