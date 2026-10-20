import { keyed } from '../../../lib/keyed'
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

// the choices are stored by id; the team's Hebrew words for them are in parent/ui.json (storyFeedback.team)
const HELP_IDS = ['trail', 'tests', 'map', 'calm', 'ask', 'roni'] as const
const DIAG_IDS = ['diagnosed', 'inProcess', 'no', 'noAnswer'] as const
type TeamWords = { help: Record<string, string>; diag: Record<string, string>; rating: Record<string, string>; unset: string; none: string; subject: string; concept: string; labels: Record<string, string> }
const team = keyed((parentUi as unknown as { he: { storyFeedback: { team: TeamWords } } }).he, 'parent/ui').storyFeedback.team

interface Feedback {
  rating: number | null
  helped: string[]
  diagnosis: string | null
  note: string
}

const FEEDBACK_EMAIL = 'posicel@gmail.com'

function buildText({ rating, helped, diagnosis, note }: Feedback) {
  return [
    `${team.labels.rating}: ${rating ? team.rating[String(rating)] : team.unset}`,
    `${team.labels.helped}: ${helped.length ? helped.map((id) => team.help[id]).join(', ') : team.none}`,
    `${team.labels.diagnosis}: ${diagnosis ? team.diag[diagnosis] : team.unset}`,
    `${team.labels.note}: ${note.trim() || team.none}`,
    team.concept,
  ].join('\n')
}

function buildMailto(feedback: Feedback) {
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(team.subject)}&body=${encodeURIComponent(buildText(feedback))}`
}

export function FeedbackPage() {
  const { lang, dir } = useI18n()
  // labels are translated; the stored and mailed values stay in Hebrew, as the team reads them
  const tx = keyed((parentUi as unknown as Record<'he' | 'en' | 'ru', { storyFeedback: FeedbackTexts }>)[lang], 'parent/ui').storyFeedback
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
            {HELP_IDS.map((item, i) => (
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
            {DIAG_IDS.map((opt, i) => (
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
