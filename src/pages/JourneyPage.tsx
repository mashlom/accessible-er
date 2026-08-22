import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, InfoList } from '../components/ui'
import { useSessionAvatar } from '../hooks/useSessionAvatar'
import { journeyStages, getStageIndex } from '../data/journey'
import { getProcedure } from '../data/procedures'
import { useVisitReason } from '../hooks/useVisitReason'
import { usePersistentState } from '../hooks/usePersistentState'
import { DAY_MS } from '../lib/storage'
import styles from './JourneyPage.module.css'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function JourneyPage() {
  const { path } = useVisitReason()
  // "where are we in the process" — persisted for the day so a refresh keeps it.
  const [currentId, setCurrentId] = usePersistentState<string | null>(
    'journey-stage',
    null,
    DAY_MS,
  )
  const [openId, setOpenId] = useState<string | null>(currentId ?? journeyStages[0].id)
  // Roni walking along the stepper — a gentle sense of movement/control.
  // Off by default only when the OS asks for reduced motion; user can toggle.
  const [motionOn, setMotionOn] = usePersistentState<boolean>('journey-motion', true)
  const [avatar] = useSessionAvatar() // the child's figure that travels the rail

  const railRef = useRef<HTMLDivElement>(null)
  const stopRefs = useRef<Record<string, HTMLElement | null>>({})
  const prevCurrent = useRef<string | null>(currentId)
  const [roniX, setRoniX] = useState<number | null>(null)
  const [walking, setWalking] = useState(false)

  const animateWalk = motionOn && !prefersReducedMotion
  const currentIndex = currentId ? getStageIndex(currentId) : -1
  // Share of the journey already reached — used to tint the passed rail green.
  const progressPct =
    currentIndex >= 0
      ? Math.round((currentIndex / (journeyStages.length - 1)) * 100)
      : 0

  // Roni rides a stable horizontal progress rail (independent of the
  // accordion below), so the walk is always visible. Measure the current
  // stop's centre and translate Roni there. Runs AFTER paint so the CSS
  // transform transition actually plays instead of jumping.
  const measureRoni = useCallback(() => {
    const rail = railRef.current
    const anchorId = currentId ?? journeyStages[0].id
    const stop = stopRefs.current[anchorId]
    if (rail && stop) {
      const r = stop.getBoundingClientRect()
      setRoniX(r.left + r.width / 2 - rail.getBoundingClientRect().left - 20)
    } else {
      setRoniX(null)
    }
  }, [currentId])

  useEffect(measureRoni, [measureRoni])

  useEffect(() => {
    window.addEventListener('resize', measureRoni)
    return () => window.removeEventListener('resize', measureRoni)
  }, [measureRoni])

  // Announce the move ("בואו נלך…") briefly whenever we advance.
  useEffect(() => {
    if (prevCurrent.current !== currentId && currentId && animateWalk) {
      setWalking(true)
      const t = setTimeout(() => setWalking(false), 1600)
      prevCurrent.current = currentId
      return () => clearTimeout(t)
    }
    prevCurrent.current = currentId
  }, [currentId, animateWalk])

  function toggleOpen(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  function markHere(id: string) {
    setCurrentId(currentId === id ? null : id)
    setOpenId(id)
  }

  return (
    <div className="container">
      <PageHeader
        eyebrow="מה קורה עכשיו"
        title="המסע שלנו במיון"
        subtitle="אלה השלבים של כל ביקור. סמנו איפה אנחנו עכשיו, ואני אראה מה צפוי בהמשך."
      />

      {path && (
        <Link to="/reason" className={styles.reasonChip}>
          <span aria-hidden>{path.emoji}</span>
          הגענו בגלל: {path.label}
        </Link>
      )}

      <div className={styles.hint}>
        <span aria-hidden>⏱️</span>
        <span>
          הסדר והזמנים כאן הם הערכה כללית בלבד, ויכולים להשתנות לפי החלטת הצוות והעומס
          במיון. לא כל ביקור עובר את כל השלבים, ולפעמים הסדר שונה — זה עוזר לדעת למה
          לצפות, ולא הבטחה מדויקת.
        </span>
      </div>

      <label className={styles.motionToggle}>
        <input
          type="checkbox"
          checked={motionOn}
          onChange={(e) => setMotionOn(e.target.checked)}
        />
        <span>🐾 הדמות שלי זזה לאורך המסע</span>
      </label>

      <div className={styles.rail} ref={railRef} aria-label="התקדמות במסע">
        {motionOn && roniX != null && (
          <div
            className={styles.railRoni}
            style={{
              transform: `translateX(${roniX}px)`,
              transition: animateWalk ? 'transform 1.1s var(--ease)' : 'none',
            }}
            aria-hidden
          >
            {walking && <span className={styles.railBubble}>בואו נלך…</span>}
            {avatar.kind === 'photo' ? (
              <img src={avatar.value} alt="" className={styles.railAvatarImg} />
            ) : (
              <span className={styles.railAvatarEmoji}>{avatar.value}</span>
            )}
          </div>
        )}
        <div
          className={styles.railTrack}
          style={
            progressPct > 0
              ? {
                  background: `linear-gradient(to left, var(--c-calm-soft) ${progressPct}%, var(--c-surface-2) ${progressPct}%)`,
                }
              : undefined
          }
        >
          {journeyStages.map((stage, i) => {
            const stopState =
              stage.id === currentId
                ? styles.stopCurrent
                : currentIndex > -1 && i < currentIndex
                  ? styles.stopDone
                  : ''
            return (
              <button
                key={stage.id}
                type="button"
                ref={(el) => {
                  stopRefs.current[stage.id] = el
                }}
                className={`${styles.stop} ${stopState}`}
                onClick={() => markHere(stage.id)}
                aria-label={`${stage.title}${stage.id === currentId ? ' — אנחנו כאן' : ''}`}
                aria-current={stage.id === currentId ? 'step' : undefined}
                title={stage.title}
              >
                {stage.emoji}
              </button>
            )
          })}
        </div>
      </div>

      <ol className={styles.stepper}>
        {journeyStages.map((stage, i) => {
          const isCurrent = stage.id === currentId
          const isDone = currentIndex > -1 && i < currentIndex
          const isOpen = openId === stage.id
          const stateClass = isCurrent ? styles.current : isDone ? styles.done : ''

          return (
            <li key={stage.id} className={`${styles.step} ${stateClass}`}>
              <span className={styles.marker} aria-hidden>
                {isDone ? '✓' : i + 1}
              </span>

              <button
                type="button"
                className={styles.stepHead}
                onClick={() => toggleOpen(stage.id)}
                aria-expanded={isOpen}
              >
                <span className={styles.stepEmoji} aria-hidden>
                  {stage.emoji}
                </span>
                <span className={styles.stepTitle}>{stage.title}</span>
                {isCurrent && <span className={styles.currentTag}>אנחנו כאן</span>}
                <span
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  aria-hidden
                >
                  ⌄
                </span>
              </button>

              {isOpen && (
                <div className={styles.body}>
                  <p className={styles.meaning}>{stage.meaning}</p>

                  {stage.waitRange && (
                    <div className={styles.waitBox}>
                      <span className={styles.waitEmoji} aria-hidden>
                        ⏳
                      </span>
                      <span>
                        <span className={styles.waitLabel}>
                          {stage.waitKind === 'duration' ? 'משך זמן משוער' : 'זמן המתנה משוער'}
                        </span>
                        <br />
                        <span className={styles.waitValue}>{stage.waitRange}</span>
                      </span>
                    </div>
                  )}

                  <div className={styles.detailBlock}>
                    <h3>מה קורה כאן</h3>
                    <p>{stage.whatHappens}</p>
                  </div>

                  <div className={styles.detailBlock}>
                    <h3>מה עלול להיות מאתגר</h3>
                    <p>{stage.challenge}</p>
                  </div>

                  <div>
                    <p className={styles.askTitle}>💬 מה אפשר לבקש בשלב הזה</p>
                    <InfoList items={stage.canAsk} />
                  </div>

                  {stage.procedureIds && stage.procedureIds.length > 0 && (
                    <div>
                      <p className={styles.askTitle}>
                        🎬 להכין את הילד/ה למה שקורה כאן
                      </p>
                      <div className={styles.procChips}>
                        {stage.procedureIds.map((pid) => {
                          const proc = getProcedure(pid)
                          if (!proc) return null
                          return (
                            <Link
                              key={pid}
                              to={`/procedures/${pid}`}
                              className={styles.procChip}
                            >
                              <span aria-hidden>{proc.emoji}</span> {proc.title}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className={`${styles.hereBtn} ${isCurrent ? styles.hereBtnActive : ''}`}
                    onClick={() => markHere(stage.id)}
                  >
                    {isCurrent ? '✓ אנחנו כאן' : 'סמנו: אנחנו כאן'}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
