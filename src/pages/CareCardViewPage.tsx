import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { Note } from '../components/ui'
import { usePersistentState } from '../hooks/usePersistentState'
import { DAY_MS } from '../lib/storage'
import {
  emptyCard,
  isCardEmpty,
  suggestedAdaptations,
  type CareCard,
} from '../data/careCard'
import styles from './CareCardViewPage.module.css'

interface Row {
  emoji: string
  label: string
  value: string
}

/**
 * The immediate staff-facing display (spec: "תצוגה מיידית לצוות") —
 * deliberately very short: a handful of high-contrast lines the parent
 * shows from the screen or prints. No transmission, ever.
 */
export function CareCardViewPage() {
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)

  if (isCardEmpty(card)) {
    return (
      <div className="container">
        <div className={styles.empty}>
          <Mascot size={96} mood="calm" />
          <h1>הכרטיס עדיין ריק</h1>
          <p>כמה סימונים קצרים — ויהיה לכם כרטיס להציג לצוות.</p>
          <Link to="/card" className={styles.emptyBtn}>
            למילוי הכרטיס
          </Link>
        </div>
      </div>
    )
  }

  const rows: Row[] = [
    { emoji: '💬', label: 'תקשורת', value: card.communication.join(' · ') },
    { emoji: '⚠️', label: 'רגישויות', value: card.sensitivities.join(' · ') },
    { emoji: '💛', label: 'עוזר', value: card.calming.join(' · ') },
    {
      emoji: '🚫',
      label: 'להימנע',
      value: [...card.escalators, ...card.avoid].join(' · '),
    },
    { emoji: '🩺', label: 'קשה במיוחד', value: card.hardMoments.join(' · ') },
    { emoji: '🤕', label: 'ביטוי כאב', value: card.pain.join(' · ') },
    { emoji: '✏️', label: 'עוד', value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestions = suggestedAdaptations(card)
  const name = card.nickname.trim()

  return (
    <div className="container">
      <div className={`${styles.card} print-area`}>
        <div className={styles.cardHead}>
          <span className={styles.cardHeadIcon} aria-hidden>
            🪪
          </span>
          <div>
            <div className={styles.cardTitle}>
              חשוב לדעת על {name || 'הילד/ה'} שלי
            </div>
            {card.age.trim() && <div className={styles.cardAge}>גיל {card.age.trim()}</div>}
          </div>
        </div>
        <div className={styles.rows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.row}>
              <span className={styles.rowLabel}>
                <span aria-hidden>{row.emoji}</span>
                {row.label}
              </span>
              <span className={styles.rowValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className={`${styles.suggest} no-print`}>
          <div className={styles.suggestTitle}>
            <span aria-hidden>💡</span> לפי מה שסימנתם — התאמות שכדאי לבקש
          </div>
          <ul style={{ margin: 0, paddingInlineStart: '1.2em', lineHeight: 1.7 }}>
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--space-2)' }}>
            <Link to="/requests" style={{ textDecoration: 'underline', fontWeight: 600 }}>
              לרשימה המלאה של מה אפשר לבקש ←
            </Link>
          </div>
        </div>
      )}

      <div className={`${styles.controls} no-print`}>
        <button type="button" className={styles.printBtn} onClick={() => window.print()}>
          🖨️ הדפסה
        </button>
        <Link to="/card" className={styles.editBtn}>
          ✏️ עריכת הכרטיס
        </Link>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-3)' }}>
        <Note>
          הכרטיס נשמר במכשיר הזה בלבד ונמחק אחרי 24 שעות. הוא מגיע לצוות רק אם תבחרו
          להציג או להדפיס אותו.
        </Note>
      </div>
    </div>
  )
}
