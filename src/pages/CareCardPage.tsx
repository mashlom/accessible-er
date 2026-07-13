import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { usePersistentState } from '../hooks/usePersistentState'
import { DAY_MS } from '../lib/storage'
import {
  cardSections,
  emptyCard,
  isCardEmpty,
  type CardArrayField,
  type CareCard,
} from '../data/careCard'
import styles from './CareCardPage.module.css'

/**
 * Module 1 — quick adaptations card. Chips-first so a parent can fill it
 * in under two minutes, even when arriving in a hurry. Every field is
 * optional; nothing identifying is required.
 */
export function CareCardPage() {
  const [card, setCard, clearCard] = usePersistentState<CareCard>(
    'care-card',
    emptyCard,
    DAY_MS,
  )

  function toggle(key: CardArrayField, option: string) {
    const list = card[key]
    const next = list.includes(option)
      ? list.filter((x) => x !== option)
      : [...list, option]
    setCard({ ...card, [key]: next })
  }

  const empty = isCardEmpty(card)

  return (
    <div className="container">
      <PageHeader
        eyebrow="כרטיס התאמות"
        title="מה חשוב לדעת על הילד/ה שלי"
        subtitle="סמנו את מה שמתאים — פחות מ־2 דקות. בסוף מקבלים כרטיס קצר שמציגים לצוות מהמסך או בהדפסה."
      />

      <div className={styles.privacy}>
        <span aria-hidden>🔒</span>
        <span>
          הכל נשמר <strong>במכשיר הזה בלבד</strong>, נמחק אוטומטית אחרי 24 שעות, ולא
          נשלח לשום מקום. מה שלא תציגו בעצמכם — לא יגיע לצוות. אפשר למלא בלי שם בכלל.
        </span>
      </div>

      <section className={`card ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          <span aria-hidden>🧒</span> מי אנחנו (לא חובה)
        </h2>
        <div className={styles.identity}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>כינוי / שם פרטי</span>
            <input
              className={styles.input}
              value={card.nickname}
              onChange={(e) => setCard({ ...card, nickname: e.target.value })}
              maxLength={30}
              placeholder="לא חובה"
            />
          </label>
          <label className={styles.field} style={{ maxWidth: 110 }}>
            <span className={styles.fieldLabel}>גיל</span>
            <input
              className={styles.input}
              value={card.age}
              onChange={(e) => setCard({ ...card, age: e.target.value })}
              maxLength={6}
              inputMode="numeric"
              placeholder="—"
            />
          </label>
        </div>
      </section>

      {cardSections.map((section) => (
        <section key={section.key} className={`card ${styles.section}`}>
          <h2 className={styles.sectionTitle}>
            <span aria-hidden>{section.emoji}</span> {section.title}
          </h2>
          <div className={styles.chips} role="group" aria-label={section.title}>
            {section.options.map((option) => {
              const on = card[section.key].includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                  aria-pressed={on}
                  onClick={() => toggle(section.key, option)}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <section className={`card ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          <span aria-hidden>✏️</span> עוד משהו שעוזר לילד/ה שלכם? (לא חובה)
        </h2>
        <textarea
          className={styles.textarea}
          rows={3}
          value={card.freeNote}
          onChange={(e) => setCard({ ...card, freeNote: e.target.value })}
          placeholder="למשל: אוהב שמספרים לו מה קורה בקול שקט; נרגעת עם הדובי הכחול…"
        />
      </section>

      <div className={styles.actions}>
        <Link
          to="/card/view"
          className={`${styles.showBtn} ${empty ? styles.showBtnDisabled : ''}`}
          aria-disabled={empty}
        >
          🪪 הצגת הכרטיס לצוות
        </Link>
        {!empty && (
          <button type="button" className={styles.clearBtn} onClick={clearCard}>
            ניקוי
          </button>
        )}
      </div>
    </div>
  )
}
