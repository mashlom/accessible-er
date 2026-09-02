import { Roni, type RoniMood } from '../../../components/Roni'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import styles from '../talk.module.css'

/**
 * Roni's stage: a lit strip across the top third of the screen that never
 * goes away. He is deliberately large (up to 260px), sways continuously,
 * changes expression with every line he says, and reacts when tapped.
 *
 * This is the whole point of concept 3 — the avatar is not next to the
 * interface, it *is* the interface.
 */
export function RoniStage({
  mood,
  bounce,
  thinking,
  onTap,
}: {
  mood: RoniMood
  /** changes on every new line, replaying the reaction animation */
  bounce: number
  thinking: boolean
  onTap: () => void
}) {
  const [avatar] = useSessionAvatar()

  return (
    <div className={styles.stage}>
      <span className={styles.spot} aria-hidden />
      <span className={styles.nameplate} aria-hidden>
        רוני · כאן איתכם
      </span>

      {thinking && (
        <span className={styles.thinking} aria-hidden>
          <span className={styles.thinkDot} />
          <span className={styles.thinkDot} />
          <span className={styles.thinkDot} />
        </span>
      )}

      <div className={styles.cast}>
        <span className={styles.me} aria-hidden>
          {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
        </span>
        <button
          type="button"
          className={styles.roniBtn}
          onClick={onTap}
          aria-label="ללחוץ על רוני"
        >
          <Roni size={230} mood={mood} float bounceKey={bounce} decorative />
        </button>
      </div>

      <span className={styles.floor} aria-hidden />
    </div>
  )
}
