import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PageHeader, InfoList } from '../components/ui'
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

  const wrapRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const prevCurrent = useRef<string | null>(currentId)
  const [walkerTop, setWalkerTop] = useState<number | null>(null)
  const [walking, setWalking] = useState(false)

  const animateWalk = motionOn && !prefersReducedMotion
  const currentIndex = currentId ? getStageIndex(currentId) : -1

  // Measure the current step's position so Roni can stand beside it.
  const measureWalker = useCallback(() => {
    const wrap = wrapRef.current
    const el = currentId ? stepRefs.current[currentId] : null
    if (!wrap || !el) {
      setWalkerTop(null)
      return
    }
    setWalkerTop(el.getBoundingClientRect().top - wrap.getBoundingClientRect().top)
  }, [currentId])

  useLayoutEffect(measureWalker, [measureWalker, openId, path])

  useEffect(() => {
    window.addEventListener('resize', measureWalker)
    return () => window.removeEventListener('resize', measureWalker)
  }, [measureWalker])

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
          זמני ההמתנה הם הערכה בטווחים בלבד, ויכולים להשתנות לפי העומס במיון. הם עוזרים
          לדעת למה לצפות — לא הבטחה מדויקת.
        </span>
      </div>

      {!prefersReducedMotion && (
        <label className={styles.motionToggle}>
          <input
            type="checkbox"
            checked={motionOn}
            onChange={(e) => setMotionOn(e.target.checked)}
          />
          <span>🐾 רוני צועד/ת איתנו במסע</span>
        </label>
      )}

      <div className={styles.stepperWrap} ref={wrapRef}>
        {currentId && walkerTop != null && (
          <div
            className={styles.walker}
            style={{ top: walkerTop, transition: animateWalk ? 'top 1.1s var(--ease)' : 'none' }}
            aria-hidden
          >
            {walking && <span className={styles.walkerBubble}>בואו נלך…</span>}
            <Mascot size={44} mood={walking ? 'wave' : 'happy'} />
          </div>
        )}

        <ol className={styles.stepper}>
        {journeyStages.map((stage, i) => {
          const isCurrent = stage.id === currentId
          const isDone = currentIndex > -1 && i < currentIndex
          const isOpen = openId === stage.id
          const stateClass = isCurrent ? styles.current : isDone ? styles.done : ''

          return (
            <li
              key={stage.id}
              ref={(el) => {
                stepRefs.current[stage.id] = el
              }}
              className={`${styles.step} ${stateClass}`}
            >
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
    </div>
  )
}
