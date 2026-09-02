import { Link } from '../../nav'
import { Roni } from '../../../components/Roni'
import { Note } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { DAY_MS } from '../../../lib/storage'
import {
  emptyCard,
  emptyCustom,
  isCardEmpty,
  suggestedAdaptations,
  type CareCard,
} from '../../../data/careCard'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * The staff-facing side of the card: very short, very large, shown from
 * the screen or printed. Nothing is transmitted — the parent shows it.
 */
export function CardViewPage() {
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const [avatar] = useSessionAvatar()

  if (isCardEmpty(card)) {
    return (
      <div className={shell.page}>
        <div className={styles.emptyState}>
          <Roni size={120} mood="curious" float />
          <h1 className={shell.sceneTitle}>הכרטיס עדיין ריק</h1>
          <p style={{ color: 'var(--s-ink-soft)' }}>
            כמה סימונים קצרים — ויהיה לכם כרטיס גדול להראות לצוות.
          </p>
          <Link to="/card" className={shell.bigBtn}>
            למילוי הכרטיס
          </Link>
        </div>
      </div>
    )
  }

  const c = card.custom ?? emptyCustom
  const join = (...parts: string[]) =>
    parts
      .map((p) => p.trim())
      .filter(Boolean)
      .join(' · ')

  const rows = [
    { emoji: '💬', label: 'תקשורת', value: join(...card.communication, c.communication) },
    { emoji: '⚠️', label: 'רגישויות', value: join(...card.sensitivities, c.sensitivities) },
    { emoji: '💛', label: 'עוזר לי', value: join(...card.calming, c.calming) },
    {
      emoji: '🚫',
      label: 'להימנע',
      value: join(...card.escalators, ...card.avoid, c.escalators, c.avoid),
    },
    { emoji: '🩺', label: 'קשה במיוחד', value: join(...card.hardMoments, c.hardMoments) },
    { emoji: '🤕', label: 'ככה נראה כאב', value: join(...card.pain, c.pain) },
    { emoji: '✏️', label: 'עוד', value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestions = suggestedAdaptations(card)
  const name = card.nickname.trim()

  return (
    <div className={shell.page}>
      <div className={`${styles.idCard} print-area`}>
        <div className={styles.idHead}>
          <span className={styles.idFace} aria-hidden>
            {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
          </span>
          <div>
            <div className={styles.idTitle}>
              חשוב לדעת על {name || 'הילד/ה'} שלי
            </div>
            {card.age.trim() && <div className={styles.idAge}>גיל {card.age.trim()}</div>}
          </div>
        </div>
        <div className={styles.idRows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.idRow}>
              <span className={styles.idRowLabel}>
                <span aria-hidden>{row.emoji}</span>
                {row.label}
              </span>
              <span className={styles.idRowValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className={`${styles.suggest} no-print`} style={{ marginTop: 'var(--space-4)' }}>
          <strong>💡 לפי מה שסימנתם — התאמות שכדאי לבקש</strong>
          <ul className={styles.suggestList}>
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link to="/requests" className={styles.crossLink} style={{ marginTop: 10 }}>
            לרשימה המלאה של מה אפשר לבקש ←
          </Link>
        </div>
      )}

      <div className={`${styles.actions} no-print`}>
        <button type="button" className={shell.bigBtn} onClick={() => window.print()}>
          📄 שמירה כ־PDF / הדפסה
        </button>
        <Link to="/card" className={shell.ghostBtn}>
          ✏️ עריכה
        </Link>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          לשליחה לצוות: לחצו "שמירה כ־PDF", בחרו "שמירה כ־PDF" בחלון ההדפסה, ושִׁלחו את
          הקובץ בעצמכם. הכרטיס נשמר במכשיר הזה בלבד, נמחק אחרי 24 שעות, ושום דבר לא
          נשלח אוטומטית.
        </Note>
      </div>
    </div>
  )
}
