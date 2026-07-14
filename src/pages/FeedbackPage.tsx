import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PageHeader, Note } from '../components/ui'
import { usePersistentState } from '../hooks/usePersistentState'
import { DAY_MS } from '../lib/storage'
import styles from './FeedbackPage.module.css'

const HELP_OPTIONS = [
  'שלבי הביקור',
  'ההכנה לפרוצדורות',
  'המפה',
  'מה לעשות כשקשה',
  'מה אפשר לבקש',
  'הדמות המלווה (רוני)',
]

interface Feedback {
  rating: number | null
  helped: string[]
  note: string
}

const FEEDBACK_EMAIL = 'posicel@gmail.com'

const RATING_LABELS: Record<number, string> = {
  1: 'פחות עזר',
  2: 'עזר קצת',
  3: 'עזר מאוד',
}

function buildFeedbackText({ rating, helped, note }: Feedback) {
  return [
    `דירוג: ${rating ? RATING_LABELS[rating] : 'לא צוין'}`,
    `מה עזר: ${helped.length ? helped.join(', ') : '—'}`,
    `הערה: ${note.trim() || '—'}`,
  ].join('\n')
}

function buildFeedbackMailto(feedback: Feedback) {
  const subject = encodeURIComponent('משוב על "מה שלומי?"')
  const body = encodeURIComponent(buildFeedbackText(feedback))
  return `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
}

export function FeedbackPage() {
  const [saved, setSaved] = usePersistentState<Feedback | null>(
    'feedback',
    null,
    DAY_MS,
  )
  const [rating, setRating] = useState<number | null>(saved?.rating ?? null)
  const [helped, setHelped] = useState<string[]>(saved?.helped ?? [])
  const [note, setNote] = useState(saved?.note ?? '')
  const [done, setDone] = useState(false)
  const [sentFeedback, setSentFeedback] = useState<Feedback | null>(null)
  const [copied, setCopied] = useState(false)

  function toggleHelped(item: string) {
    setHelped((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  function submit() {
    const feedback = { rating, helped, note }
    setSaved(feedback)
    setSentFeedback(feedback)
    window.location.href = buildFeedbackMailto(feedback)
    setDone(true)
  }

  async function copyFeedback() {
    if (!sentFeedback) return
    await navigator.clipboard.writeText(buildFeedbackText(sentFeedback))
    setCopied(true)
  }

  if (done) {
    return (
      <div className="container">
        <div className={styles.thanks}>
          <Mascot size={110} mood="happy" />
          <h1 className={styles.thanksTitle}>תודה רבה! 🌟</h1>
          <p className={styles.thanksBody}>
            המשוב שלכם עוזר לנו לשפר את הכלי עבור משפחות אחרות. אם נפתחה אצלכם
            אפליקציית מייל עם הודעה מוכנה — נשאר רק לשלוח אותה.
          </p>

          {sentFeedback && (
            <>
              <a href={buildFeedbackMailto(sentFeedback)} className={styles.mailLink}>
                📧 לא נפתח מייל אצלכם? לחצו כאן
              </a>
              <button type="button" className={styles.copyBtn} onClick={copyFeedback}>
                {copied ? '✓ הועתק' : 'העתקת המשוב כטקסט'}
              </button>
            </>
          )}

          <Link to="/" className={styles.homeBtn}>
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <PageHeader
        eyebrow="משוב"
        title="איך היה לכם?"
        subtitle="שאלה קצרה — כדי שנוכל לשפר את הכלי. אין צורך בשם או בפרטים מזהים."
      />

      <section className={`card ${styles.block}`}>
        <h2 className={styles.q}>עד כמה הכלי עזר לכם היום?</h2>
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
              <span className={styles.faceEmoji} aria-hidden>
                {f.e}
              </span>
              <span className={styles.faceLabel}>{f.l}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={`card ${styles.block}`}>
        <h2 className={styles.q}>מה עזר לכם? (אפשר לבחור כמה)</h2>
        <div className={styles.chips}>
          {HELP_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.chip} ${helped.includes(item) ? styles.chipOn : ''}`}
              onClick={() => toggleHelped(item)}
              aria-pressed={helped.includes(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className={`card ${styles.block}`}>
        <h2 className={styles.q}>עוד משהו שתרצו לספר? (לא חובה)</h2>
        <textarea
          className={styles.textarea}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="מה עזר, מה חסר, מה נשמח לשפר…"
          rows={3}
        />
      </section>

      <button
        type="button"
        className={styles.submit}
        onClick={submit}
        disabled={rating === null && helped.length === 0 && !note.trim()}
      >
        שליחת משוב
      </button>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <Note>
          לחיצה על השליחה תפתח הודעת מייל מוכנה (לאחר אישור ושליחה מצדכם, המשוב
          יגיע לצוות). עותק נשמר גם במכשיר הזה (דמו) ואינו כולל מידע מזהה.
        </Note>
      </div>
    </div>
  )
}
