import { keyed } from '../../../lib/keyed'
import { useState } from 'react'
import { Link } from '../../nav'
import { Scene, Panel, ChipButton } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import shell from '../story.module.css'
import { LineIcon } from '../../../components/LineIcon'
import styles from '../pages.module.css'
import { useI18n } from '../../../hooks/useI18n'
import i18nUi from '../../../data/i18n/ui.json'
import { sendToTeam } from '../../../lib/mail'

type FeedbackTexts = {
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
  sending: string
  failed: string
  thanks: string
  thanksText: string
  back: string
}

// the choices are stored by id; the team's Hebrew words for them are in i18n/ui.json (storyFeedback.team)
const HELP_IDS = ['trail', 'tests', 'map', 'calm', 'ask', 'roni'] as const
const DIAG_IDS = ['diagnosed', 'inProcess', 'no', 'noAnswer'] as const
type TeamWords = { help: Record<string, string>; diag: Record<string, string>; rating: Record<string, string>; unset: string; none: string; topic: string; labels: Record<string, string> }
const team = keyed((i18nUi as unknown as { he: { storyFeedback: { team: TeamWords } } }).he, 'i18n/ui').storyFeedback.team

interface Feedback {
  rating: number | null
  helped: string[]
  diagnosis: string | null
  note: string
}

function buildText({ rating, helped, diagnosis, note }: Feedback) {
  return [
    `${team.labels.rating}: ${rating ? team.rating[String(rating)] : team.unset}`,
    `${team.labels.helped}: ${helped.length ? helped.map((id) => team.help[id]).join(', ') : team.none}`,
    `${team.labels.diagnosis}: ${diagnosis ? team.diag[diagnosis] : team.unset}`,
    `${team.labels.note}: ${note.trim() || team.none}`,
  ].join('\n')
}

export function FeedbackPage() {
  const { lang, dir, t } = useI18n()
  // labels are translated; the stored and mailed values stay in Hebrew, as the team reads them
  const tx = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { storyFeedback: FeedbackTexts }>)[lang], 'i18n/ui').storyFeedback
  const [saved, setSaved] = usePersistentState<Feedback | null>('feedback', null, DAY_MS)
  const [rating, setRating] = useState<number | null>(saved?.rating ?? null)
  const [helped, setHelped] = useState<string[]>(saved?.helped ?? [])
  const [diagnosis, setDiagnosis] = useState<string | null>(saved?.diagnosis ?? null)
  const [note, setNote] = useState(saved?.note ?? '')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  // the feedback goes straight to the team's mail (mashlom.me@gmail.com); a copy stays on this device
  async function submit() {
    const feedback = { rating, helped, diagnosis, note }
    setSaved(feedback)
    setStatus('sending')
    try {
      await sendToTeam(team.topic, buildText(feedback))
      setStatus('sent')
    } catch (error) {
      console.warn(error)
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div className={`${shell.page} ${styles.trailLook}`} dir={dir} lang={lang}>
        <div className={styles.emptyState}>
          <h1 className={shell.sceneTitle} style={{ color: '#173b4d' }}>{tx.thanks}</h1>
          <p style={{ color: '#6f6573', maxWidth: '34ch' }}>{tx.thanksText}</p>
          <div className={`${styles.actions} ${styles.actionsSingle}`}>
            <Link to="/" className={shell.bigBtn}>
              {tx.back}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir={dir} lang={lang} className={styles.trailLook} style={{ textAlign: 'start' }}>
    <Scene title={t('ui.tiles.feedback.title')} subtitle={tx.subtitle}>
      <div className={shell.stack}>
        <Panel title={tx.ratingTitle} emoji="🌤️" icon={<LineIcon id="feedback" size={22} />}>
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
                <LineIcon id={`face-${f.v}`} emoji={f.e} size={40} />
                {f.l}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={tx.helpTitle} emoji="💛" icon={<LineIcon id="calm" size={22} />}>
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

        <Panel title={tx.diagTitle} emoji="🧩" icon={<LineIcon id="puzzle" size={22} />}>
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

        <Panel title={tx.notesTitle} emoji="✏️" icon={<LineIcon id="card-else" size={22} />}>
          <textarea
            className={styles.textarea}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={tx.notePh}
            rows={3}
          />
        </Panel>
      </div>

      <div className={`${styles.actions} ${styles.actionsSingle}`}>
        <button
          type="button"
          className={shell.bigBtn}
          onClick={submit}
          disabled={status === 'sending' || (rating === null && helped.length === 0 && !note.trim())}
          aria-busy={status === 'sending'}
        >
          {status === 'sending' ? tx.sending : tx.submit}
        </button>
      </div>
      <p role="status" className={styles.sendFailed}>
        {status === 'failed' && tx.failed}
      </p>
    </Scene>
    </div>
  )
}
