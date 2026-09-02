import { useState } from 'react'
import { Scene, Bubble, Note } from '../components/kit'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * A short request or thank-you, delivered by the parent: shown large on
 * the screen, or opened in their own mail app. Nothing is sent automatically.
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
    <Scene
      title="הודעה לצוות"
      subtitle="רוצים לבקש משהו או להגיד תודה? כתבו משפט קצר, והראו אותו לצוות על המסך — או שִׁלחו במייל בעצמכם."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>אפשר להתחיל ממשפט מוכן, ולשנות אותו איך שרוצים.</Bubble>
      </div>

      <div className={shell.chipRow} style={{ justifyContent: 'center' }}>
        {templates.map((t) => (
          <button
            key={t.label}
            type="button"
            className={shell.pchip}
            onClick={() => setText(t.starter)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        style={{ marginTop: 'var(--space-3)' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="לדוגמה: נשמח אם אפשר להמתין בפינה שקטה יותר · תודה רבה על הסבלנות."
        rows={4}
        maxLength={400}
        aria-label="ההודעה שלכם"
      />

      <div className={styles.actions}>
        <button
          type="button"
          className={shell.bigBtn}
          disabled={!trimmed}
          onClick={() => setShown(true)}
        >
          🖥️ להראות על המסך
        </button>
        <a
          className={shell.ghostBtn}
          href={trimmed ? mailto : undefined}
          aria-disabled={!trimmed}
          style={!trimmed ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
        >
          ✉️ שליחה במייל
        </a>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          להצגה: לחצו "להראות על המסך" והראו את המסך לצוות. לשליחה: ייפתח המייל עם
          ההודעה — הוסיפו את כתובת המייל של המיון ושִׁלחו בעצמכם. שום דבר לא נשלח
          אוטומטית.
        </Note>
      </div>

      {shown && (
        <div
          className={shell.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="הודעה מוצגת לצוות"
          onClick={() => setShown(false)}
        >
          <p className={shell.overlayText}>{trimmed}</p>
          <button type="button" className={shell.bigBtn}>
            סגירה
          </button>
        </div>
      )}
    </Scene>
  )
}
