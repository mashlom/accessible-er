import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useConceptBase } from '../../nav'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { lineFor, tapLines } from '../companionLines'
import { Roni } from '../../../components/Roni'
import styles from '../story.module.css'

/**
 * Roni, permanently on screen. He says something about the place the
 * family is in, and reacts when the child taps him — the "manipulation"
 * the first-round feedback asked for, so the avatar gives a feeling of
 * control rather than just decorating the screen.
 *
 * Can be minimised to a peeking head: the tool has to be usable when a
 * child is already overwhelmed, and animation is not always welcome.
 */
export function RoniCompanion() {
  const base = useConceptBase()
  const { pathname } = useLocation()
  const [avatar] = useSessionAvatar()
  const [minimised, setMinimised] = useState(false)
  const [tapped, setTapped] = useState<number | null>(null)
  const [bounce, setBounce] = useState(0)
  const timer = useRef<number>()

  const sub = pathname.startsWith(base) ? pathname.slice(base.length).replace(/^\//, '') : ''
  const routeLine = lineFor(sub)
  const line = tapped == null ? routeLine : tapLines[tapped]

  // A tapped reaction is temporary — Roni goes back to narrating the place.
  useEffect(() => {
    if (tapped == null) return
    timer.current = window.setTimeout(() => setTapped(null), 4200)
    return () => window.clearTimeout(timer.current)
  }, [tapped, bounce])

  // Moving to another screen resets him to that screen's line.
  useEffect(() => setTapped(null), [pathname])

  function onTapRoni() {
    setTapped((prev) => {
      const next = Math.floor(Math.random() * tapLines.length)
      return next === prev ? (next + 1) % tapLines.length : next
    })
    setBounce((b) => b + 1)
  }

  if (minimised) {
    return (
      <div className={`${styles.companion} no-print`}>
        <button
          type="button"
          className={styles.peek}
          onClick={() => setMinimised(false)}
          aria-label="להחזיר את רוני"
          style={{ marginInlineEnd: 'auto' }}
        >
          <Roni size={78} mood="curious" decorative />
        </button>
      </div>
    )
  }

  return (
    <div className={`${styles.companion} no-print`}>
      <div className={styles.companionInner}>
        <button
          type="button"
          className={styles.roniBtn}
          onClick={onTapRoni}
          aria-label="ללחוץ על רוני"
        >
          <Roni size={96} mood={line.mood} float bounceKey={bounce} decorative />
          <span className={styles.tapHint} aria-hidden>
            לחצו עליי
          </span>
          <span className={styles.companionAvatar} aria-hidden>
            {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
          </span>
        </button>

        <p className={styles.companionBubble} aria-live="polite">
          <span>{line.text}</span>
          <button
            type="button"
            className={styles.hideBtn}
            onClick={() => setMinimised(true)}
            aria-label="להקטין את רוני"
          >
            <span aria-hidden>−</span>
          </button>
        </p>
      </div>
    </div>
  )
}
