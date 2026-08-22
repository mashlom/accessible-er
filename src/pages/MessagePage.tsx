import { useState } from 'react'
import { PageHeader, Note } from '../components/ui'
import styles from './SupportPages.module.css'

/**
 * "הודעה לצוות" — near the end of the visit the family can write a short
 * request or thank-you. Two ways to deliver it, both parent-initiated:
 * show it large on screen, or open the mail app pre-filled (the parent
 * adds the ER address and sends themselves). Nothing is sent automatically.
 */
const templates = [
  { label: '🙏 בקשה', starter: 'נשמח מאוד אם אפשר ' },
  { label: '💛 תודה', starter: 'רצינו להגיד תודה על ' },
]

export function MessagePage() {
  const [text, setText] = useState('')
  const [shown, setShown] = useState(false)

  const trimmed = text.trim()
  const mailto = `mailto:?subject=${encodeURIComponent('הודעה מההורים')}&body=${encodeURIComponent(trimmed)}`

  return (
    <div className="container">
      <PageHeader
        eyebrow="לפני שהולכים"
        title="הודעה לצוות"
        subtitle="רוצים לבקש משהו או להגיד תודה? כתבו משפט קצר — ותוכלו להראות אותו לצוות על המסך, או לשלוח במייל בעצמכם."
      />

      <div className={styles.msgTemplates}>
        {templates.map((t) => (
          <button
            key={t.label}
            type="button"
            className={styles.sentence}
            onClick={() => setText(t.starter)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        className={styles.msgInput}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="לדוגמה: נשמח אם אפשר להמתין בפינה שקטה יותר · תודה רבה על הסבלנות."
        rows={4}
        maxLength={400}
      />

      <div className={styles.msgActions}>
        <button
          type="button"
          className={styles.msgShowBtn}
          disabled={!trimmed}
          onClick={() => setShown(true)}
        >
          🖥️ הצגה לצוות על המסך
        </button>
        <a
          className={`${styles.msgMailBtn} ${!trimmed ? styles.msgDisabled : ''}`}
          href={trimmed ? mailto : undefined}
          aria-disabled={!trimmed}
        >
          ✉️ שליחה במייל
        </a>
      </div>

      <Note>
        להצגה: לחצו "הצגה לצוות" והראו את המסך. לשליחה: ייפתח המייל עם ההודעה — הוסיפו
        את כתובת המייל של המיון ושִׁלחו בעצמכם. שום דבר לא נשלח אוטומטית.
      </Note>

      {shown && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="הודעה מוצגת לצוות"
          onClick={() => setShown(false)}
        >
          <p className={styles.overlayText}>{trimmed}</p>
          <button type="button" className={styles.overlayClose}>
            סגירה
          </button>
        </div>
      )}
    </div>
  )
}
