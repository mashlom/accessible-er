import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { type RoniMood } from '../../../components/Roni'
import { RoniStage } from '../components/RoniStage'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, type CardArrayField, type CareCard } from '../../../data/careCard'
import { resolveNode, type Action, type Choice, type Say } from '../script'
import styles from '../talk.module.css'

/** One exchange: what Roni said, and what the family answered to it. */
interface Turn {
  node: string
  answer?: string
}

const TRAIL_KEY = 'talk-trail'
const FEEDBACK_EMAIL = 'posicel@gmail.com'
const RATING_LABELS: Record<number, string> = {
  1: 'פחות עזר',
  2: 'עזר קצת',
  3: 'עזר מאוד',
}

/** Roni's asides when the child taps him — not part of the conversation. */
const tapAsides: { text: string; mood: RoniMood }[] = [
  { text: 'היי! נגעתם בי 😊', mood: 'happy' },
  { text: 'אני כאן. לא הולך לשום מקום.', mood: 'hug' },
  { text: 'רוצים לנשום איתי? פנימה… והחוצה…', mood: 'calm' },
  { text: 'אתם עושים את זה מצוין!', mood: 'cheer' },
  { text: 'אפשר גם רק לשבת בשקט. גם זה בסדר.', mood: 'sleepy' },
  { text: 'אני גאה בכם 🌟', mood: 'proud' },
]

const reduceMotion = () =>
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function readTrail(): Turn[] {
  try {
    const raw = sessionStorage.getItem(TRAIL_KEY)
    const parsed = raw ? (JSON.parse(raw) as Turn[]) : null
    if (Array.isArray(parsed) && parsed.length && parsed.every((t) => t?.node)) return parsed
  } catch {
    /* fall through to a fresh conversation */
  }
  return [{ node: 'start' }]
}

/**
 * Concept 3 — the whole app on one screen.
 *
 * No menu, no page tree: the family and Roni have a single running
 * conversation, and every part of the content (the route, the stages, the
 * procedure stories, the adaptations card, the map, the distress support) is
 * reached by answering him. Information arrives one bubble at a time, which
 * is also the pacing this audience needs.
 *
 * The thread itself lives in sessionStorage, so a refresh mid-visit does not
 * throw the family back to the beginning. It is rebuilt by re-resolving each
 * node, so no message text is ever persisted.
 */
export function TalkPage() {
  const navigate = useNavigate()
  const path = useConceptPath()

  const { reasonId, setReason } = useVisitReason()
  const [stageId, setStageId] = usePersistentState<string | null>(
    'journey-stage',
    null,
    DAY_MS,
  )
  const [card, setCard] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)

  const [trail, setTrail] = useState<Turn[]>(readTrail)
  const [revealed, setRevealed] = useState(0)
  const [aside, setAside] = useState<{ text: string; mood: RoniMood } | null>(null)
  const [big, setBig] = useState<string | null>(null)

  const threadRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number>()
  const asideTimer = useRef<number>()

  const ctx = useMemo(() => ({ reasonId, stageId, card }), [reasonId, stageId, card])
  const currentId = trail[trail.length - 1].node
  const current = useMemo(() => resolveNode(currentId, ctx), [currentId, ctx])

  useEffect(() => {
    try {
      sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail.slice(-40)))
    } catch {
      /* storage unavailable — the conversation still works in memory */
    }
  }, [trail])

  /* Roni says his lines one at a time. Paced, not decorative: it keeps a
     screenful of information from landing at once. */
  useEffect(() => {
    const total = current.say.length
    window.clearInterval(timer.current)
    if (reduceMotion() || total <= 1) {
      setRevealed(total)
      return
    }
    setRevealed(1)
    let i = 1
    timer.current = window.setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= total) window.clearInterval(timer.current)
    }, 700)
    return () => window.clearInterval(timer.current)
  }, [currentId, trail.length, current.say.length])

  const revealAll = useCallback(() => {
    window.clearInterval(timer.current)
    setRevealed(current.say.length)
  }, [current.say.length])

  const messages = useMemo(() => {
    const out: { key: string; mine: boolean; say?: Say; text?: string }[] = []
    trail.forEach((turn, ti) => {
      const node = resolveNode(turn.node, ctx)
      const limit = ti === trail.length - 1 ? revealed : node.say.length
      node.say.slice(0, limit).forEach((say, si) => {
        out.push({ key: `${ti}-${si}`, mine: false, say })
      })
      if (turn.answer) out.push({ key: `${ti}-a`, mine: true, text: turn.answer })
    })
    return out
  }, [trail, ctx, revealed])

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, aside])

  const lastMood: RoniMood =
    aside?.mood ??
    [...messages].reverse().find((m) => !m.mine && m.say?.mood)?.say?.mood ??
    'calm'

  function applyAction(action: Action) {
    switch (action.kind) {
      case 'setReason':
        setReason(action.id)
        break
      case 'setStage':
        setStageId(action.id)
        break
      case 'showBig':
        setBig(action.text)
        break
      case 'open':
        navigate(path(action.to))
        break
      case 'feedback': {
        const body = [
          `דירוג: ${RATING_LABELS[action.rating]}`,
          'קונספט: לדבר עם רוני',
        ].join('\n')
        window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('משוב על "מה שלומי?"')}&body=${encodeURIComponent(body)}`
        break
      }
      case 'restart':
        setTrail([{ node: 'start' }])
        break
    }
  }

  function choose(choice: Choice) {
    if (choice.action) applyAction(choice.action)
    if (!choice.go) return
    setAside(null)
    setTrail((prev) => {
      const head = prev.slice(0, -1)
      const last = { ...prev[prev.length - 1], answer: choice.label }
      return [...head, last, { node: choice.go! }]
    })
  }

  function toggleCardOption(field: CardArrayField, option: string) {
    const list = card[field]
    setCard({
      ...card,
      [field]: list.includes(option) ? list.filter((x) => x !== option) : [...list, option],
    })
  }

  function tapRoni() {
    const next = tapAsides[Math.floor(Math.random() * tapAsides.length)]
    setAside(next)
    window.clearTimeout(asideTimer.current)
    asideTimer.current = window.setTimeout(() => setAside(null), 5000)
  }

  const done = revealed >= current.say.length

  return (
    <>
      <RoniStage
        mood={lastMood}
        bounce={trail.length * 100 + revealed + (aside ? 1 : 0)}
        thinking={!done}
        onTap={tapRoni}
      />

      <div
        id="main"
        className={styles.thread}
        ref={threadRef}
        onClick={done ? undefined : revealAll}
        aria-live="polite"
      >
        <div className={styles.threadInner}>
          {messages.map((m) =>
            m.mine ? (
              <p key={m.key} className={`${styles.msg} ${styles.msgMine}`}>
                {m.text}
              </p>
            ) : (
              <div key={m.key} className={`${styles.msg} ${styles.msgRoni}`}>
                {m.say?.art && (
                  <span className={styles.msgArt}>
                    <AnimatedIcon emoji={m.say.art} size={84} />
                  </span>
                )}
                {m.say?.text}
              </div>
            ),
          )}

          {aside && (
            <p className={`${styles.msg} ${styles.msgRoni}`}>{aside.text}</p>
          )}
          <span className={styles.spacer} />
        </div>
      </div>

      <div className={`${styles.answers} no-print`}>
        <div className={styles.answersInner}>
          {current.multi && (
            <div
              className={styles.multi}
              role="group"
              aria-label="אפשר לסמן כמה תשובות"
            >
              {current.multi.options.map((option) => {
                const on = card[current.multi!.field].includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.multiChip} ${on ? styles.multiChipOn : ''}`}
                    aria-pressed={on}
                    onClick={() => toggleCardOption(current.multi!.field, option)}
                  >
                    {on && <span aria-hidden>✓ </span>}
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {done ? (
            current.choices.map((choice, i) => (
              <button
                key={`${choice.label}-${i}`}
                type="button"
                className={`${styles.answer} ${choice.quiet ? styles.answerQuiet : ''}`}
                onClick={() => choose(choice)}
              >
                {choice.emoji && <span aria-hidden>{choice.emoji}</span>}
                {choice.label}
              </button>
            ))
          ) : (
            <button type="button" className={styles.answerQuiet} onClick={revealAll}>
              להראות הכול עכשיו
            </button>
          )}
        </div>
      </div>

      {big && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="משפט מוצג לצוות"
          onClick={() => setBig(null)}
        >
          <p className={styles.overlayText}>{big}</p>
          <button type="button" className={styles.overlayClose}>
            סגירה
          </button>
        </div>
      )}
    </>
  )
}
