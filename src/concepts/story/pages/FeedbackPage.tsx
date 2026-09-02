import { useState } from 'react'
import { Link } from '../../nav'
import { Roni } from '../components/Roni'
import { AnimatedIcon } from '../components/AnimatedIcon'
import { Scene, Panel, ChipButton, Note } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import shell from '../story.module.css'
import styles from '../pages.module.css'

const HELP_OPTIONS = [
  'השביל של הביקור',
  'הסיפורים על הבדיקות',
  'המפה',
  'מה עושים כשקשה',
  'מה אפשר לבקש',
  'רוני, הדמות המלווה',
]

// Optional and anonymous — to learn who uses the tool and how well it
// serves different populations (Keren/Rotem; options confirmed by Rotem).
const DIAGNOSIS_OPTIONS = ['מאובחן/ת', 'בתהליך אבחון', 'לא', 'מעדיף/ה לא לענות']

interface Feedback {
  rating: number | null
  helped: string[]
  diagnosis: string | null
  note: string
}

const FEEDBACK_EMAIL = 'posicel@gmail.com'
const RATING_LABELS: Record<number, string> = {
  1: 'פחות עזר',
  2: 'עזר קצת',
  3: 'עזר מאוד',
}

function buildText({ rating, helped, diagnosis, note }: Feedback) {
  return [
    `דירוג: ${rating ? RATING_LABELS[rating] : 'לא צוין'}`,
    `מה עזר: ${helped.length ? helped.join(', ') : '—'}`,
    `אבחון: ${diagnosis ?? 'לא צוין'}`,
    `הערה: ${note.trim() || '—'}`,
    'קונספט: המסע של רוני',
  ].join('\n')
}

function buildMailto(feedback: Feedback) {
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('משוב על "מה שלומי?"')}&body=${encodeURIComponent(buildText(feedback))}`
}

export function FeedbackPage() {
  const [saved, setSaved] = usePersistentState<Feedback | null>('feedback', null, DAY_MS)
  const [rating, setRating] = useState<number | null>(saved?.rating ?? null)
  const [helped, setHelped] = useState<string[]>(saved?.helped ?? [])
  const [diagnosis, setDiagnosis] = useState<string | null>(saved?.diagnosis ?? null)
  const [note, setNote] = useState(saved?.note ?? '')
  const [sent, setSent] = useState<Feedback | null>(null)
  const [copied, setCopied] = useState(false)

  function submit() {
    const feedback = { rating, helped, diagnosis, note }
    setSaved(feedback)
    setSent(feedback)
    window.location.href = buildMailto(feedback)
  }

  if (sent) {
    return (
      <div className={shell.page}>
        <div className={styles.emptyState}>
          <Roni size={140} mood="cheer" float />
          <h1 className={shell.sceneTitle}>תודה רבה! 🌟</h1>
          <p style={{ color: 'var(--s-ink-soft)', maxWidth: '34ch' }}>
            המשוב שלכם עוזר לנו לשפר את הכלי עבור משפחות אחרות. אם נפתחה אצלכם
            אפליקציית מייל עם הודעה מוכנה — נשאר רק לשלוח אותה.
          </p>
          <div className={styles.actions}>
            <a href={buildMailto(sent)} className={shell.bigBtn}>
              📧 לא נפתח מייל? לחצו כאן
            </a>
            <button
              type="button"
              className={shell.ghostBtn}
              onClick={async () => {
                await navigator.clipboard.writeText(buildText(sent))
                setCopied(true)
              }}
            >
              {copied ? '✓ הועתק' : 'העתקת המשוב כטקסט'}
            </button>
          </div>
          <Link to="/" className={styles.crossLink}>
            חזרה לעולם של רוני ←
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Scene
      title="איך היה לכם?"
      subtitle="כמה שאלות קצרות — כדי שנוכל לשפר את הכלי. אין צורך בשם או בפרטים מזהים."
    >
      <div className={shell.stack}>
        <Panel title="עד כמה הכלי עזר לכם היום?" emoji="🌤️">
          <div className={styles.faces}>
            {[
              { v: 1, e: '😕', l: 'פחות' },
              { v: 2, e: '🙂', l: 'קצת' },
              { v: 3, e: '😀', l: 'מאוד' },
            ].map((f) => (
              <button
                key={f.v}
                type="button"
                className={`${styles.face} ${rating === f.v ? styles.faceOn : ''}`}
                onClick={() => setRating(f.v)}
                aria-pressed={rating === f.v}
              >
                <AnimatedIcon emoji={f.e} size={46} className={styles.faceEmoji} />
                {f.l}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="מה עזר לכם? (אפשר לבחור כמה)" emoji="💛">
          <div className={shell.chipRow}>
            {HELP_OPTIONS.map((item) => (
              <ChipButton
                key={item}
                on={helped.includes(item)}
                onClick={() =>
                  setHelped((prev) =>
                    prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
                  )
                }
              >
                {item}
              </ChipButton>
            ))}
          </div>
        </Panel>

        <Panel title="האם הילד/ה מאובחן/ת? (לא חובה, אנונימי)" emoji="🧩">
          <div className={shell.chipRow}>
            {DIAGNOSIS_OPTIONS.map((opt) => (
              <ChipButton
                key={opt}
                on={diagnosis === opt}
                onClick={() => setDiagnosis(diagnosis === opt ? null : opt)}
              >
                {opt}
              </ChipButton>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--s-ink-faint)' }}>
            עוזר לנו להבין מי משתמש בכלי ועד כמה הוא מסייע לאוכלוסיות שונות. אין חובה
            לענות, והתשובה אנונימית.
          </p>
        </Panel>

        <Panel title="עוד משהו שתרצו לספר? (לא חובה)" emoji="✏️">
          <textarea
            className={styles.textarea}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="מה עזר, מה חסר, מה נשמח לשפר…"
            rows={3}
          />
        </Panel>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={shell.bigBtn}
          onClick={submit}
          disabled={rating === null && helped.length === 0 && !note.trim()}
        >
          שליחת משוב
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          לחיצה על השליחה תפתח הודעת מייל מוכנה (המשוב יגיע לצוות רק אחרי שתאשרו
          ותשלחו). עותק נשמר גם במכשיר הזה (דמו) ואינו כולל מידע מזהה.
        </Note>
      </div>
    </Scene>
  )
}
