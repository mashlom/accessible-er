import { Link } from '../../nav'
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
import styles from '../talk.module.css'

/**
 * The one screen in concept 3 that is not a conversation: the card the
 * parent physically holds up to staff. It needs to be big, still, printable
 * and on a light ground, so it steps out of the dusk theme on purpose.
 */
export function CardViewPage() {
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const [avatar] = useSessionAvatar()

  if (isCardEmpty(card)) {
    return (
      <div id="main" className={styles.doc}>
        <div className={styles.docInner} style={{ textAlign: 'center' }}>
          <h1 className={styles.docTitle}>הכרטיס עדיין ריק</h1>
          <p>חזרו לשיחה עם רוני — הוא ישאל כמה שאלות קצרות, ויהיה כרטיס.</p>
          <Link to="/" className={styles.docBtn}>
            חזרה לשיחה
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
    <div id="main" className={styles.doc}>
      <div className={styles.docInner}>
        <div className={`${styles.idCard} print-area`}>
          <div className={styles.idHead}>
            <span className={styles.idFace} aria-hidden>
              {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
            </span>
            <div>
              <div className={styles.idTitle}>
                חשוב לדעת על {name || 'הילד/ה'} שלי
              </div>
              {card.age.trim() && <div>גיל {card.age.trim()}</div>}
            </div>
          </div>
          {rows.map((row) => (
            <div key={row.label} className={styles.idRow}>
              <span className={styles.idRowLabel}>
                <span aria-hidden>{row.emoji} </span>
                {row.label}
              </span>
              <span className={styles.idRowValue}>{row.value}</span>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <div className={`${styles.docNote} no-print`}>
            <strong>💡 לפי מה שסימנתם — התאמות שכדאי לבקש</strong>
            <ul style={{ margin: '6px 0 0', paddingInlineStart: '1.1em', lineHeight: 1.8 }}>
              {suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="no-print"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button type="button" className={styles.docBtn} onClick={() => window.print()}>
            📄 שמירה כ־PDF / הדפסה
          </button>
          <Link to="/" className={`${styles.docBtn} ${styles.docBtnGhost}`}>
            ↩️ חזרה לשיחה
          </Link>
        </div>

        <div className={`${styles.docNote} no-print`}>
          הכרטיס נשמר במכשיר הזה בלבד, נמחק אחרי 24 שעות, ושום דבר לא נשלח אוטומטית.
          מה שלא תראו בעצמכם — לא יגיע לצוות.
        </div>
      </div>
    </div>
  )
}
