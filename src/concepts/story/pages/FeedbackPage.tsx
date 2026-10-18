import { useState } from 'react'
import { Link } from '../../nav'
import { Roni } from '../../../components/Roni'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { Scene, Panel, ChipButton, Note } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import shell from '../story.module.css'
import styles from '../pages.module.css'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'

type FeedbackTexts = {
  title: string
  subtitle: string
  ratingTitle: string
  faces: string[]
  helpTitle: string
  help: string[]
  diagTitle: string
  diag: string[]
  diagNote: string
  notesTitle: string
  notePh: string
  submit: string
  note: string
  thanks: string
  thanksText: string
  mailAgain: string
  copy: string
  copied: string
  back: string
}

// the values are stored and mailed in Hebrew; the labels come from parent/ui.json
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
  const { lang, dir } = useI18n()
  // labels are translated; the stored and mailed values stay in Hebrew, as the team reads them
  const tx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { storyFeedback: FeedbackTexts }>)[lang].storyFeedback
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
      <div className={shell.page} dir={dir} lang={lang}>
        <div className={styles.emptyState}>
          <Roni size={140} mood="cheer" float />
          <h1 className={shell.sceneTitle}>{tx.thanks}</h1>
          <p style={{ color: 'var(--s-ink-soft)', maxWidth: '34ch' }}>{tx.thanksText}</p>
          <div className={styles.actions}>
            <a href={buildMailto(sent)} className={shell.bigBtn}>
              {tx.mailAgain}
            </a>
            <button
              type="button"
              className={shell.ghostBtn}
              onClick={async () => {
                await navigator.clipboard.writeText(buildText(sent))
                setCopied(true)
              }}
            >
              {copied ? tx.copied : tx.copy}
            </button>
          </div>
          <Link to="/" className={styles.crossLink}>
            {tx.back}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div className={shell.stack}>
        <Panel title={tx.ratingTitle} emoji="🌤️">
          <div className={styles.faces}>
            {[
              { v: 1, e: '😕', l: tx.faces[0] },
              { v: 2, e: '🙂', l: tx.faces[1] },
              { v: 3, e: '😀', l: tx.faces[2] },
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

        <Panel title={tx.helpTitle} emoji="💛">
          <div className={shell.chipRow}>
            {HELP_OPTIONS.map((item, i) => (
              <ChipButton
                key={item}
                on={helped.includes(item)}
                onClick={() =>
                  setHelped((prev) =>
                    prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
                  )
                }
              >
                {tx.help[i] ?? item}
              </ChipButton>
            ))}
          </div>
        </Panel>

        <Panel title={tx.diagTitle} emoji="🧩">
          <div className={shell.chipRow}>
            {DIAGNOSIS_OPTIONS.map((opt, i) => (
              <ChipButton
                key={opt}
                on={diagnosis === opt}
                onClick={() => setDiagnosis(diagnosis === opt ? null : opt)}
              >
                {tx.diag[i] ?? opt}
              </ChipButton>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--s-ink-faint)' }}>
            {tx.diagNote}
          </p>
        </Panel>

        <Panel title={tx.notesTitle} emoji="✏️">
          <textarea
            className={styles.textarea}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={tx.notePh}
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
          {tx.submit}
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>
    </Scene>
    </div>
  )
}
