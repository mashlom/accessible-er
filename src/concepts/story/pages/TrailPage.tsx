import { useState } from 'react'
import { Link } from '../../nav'
import { Scene, Bubble, Note } from '../components/kit'
import { journeyStages, getStageIndex } from '../../../data/journey'
import { getProcedure } from '../../../data/procedures'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { DAY_MS } from '../../../lib/storage'
import styles from '../pages.module.css'

/**
 * "השביל שלנו" — the visit as a winding trail of stops. The child's own
 * figure stands on the current stop, passed stops get a star. Opening a
 * stop tells what it means, what may be hard, and what can be asked for
 * (the spec's status + meaning + action, not status alone).
 *
 * Shares `journey-stage` with the calm concept, so a family that switches
 * concepts mid-visit keeps their place.
 */
export function TrailPage() {
  const { path } = useVisitReason()
  const [currentId, setCurrentId] = usePersistentState<string | null>(
    'journey-stage',
    null,
    DAY_MS,
  )
  const [openId, setOpenId] = useState<string | null>(currentId ?? journeyStages[0].id)
  const [avatar] = useSessionAvatar()

  const currentIndex = currentId ? getStageIndex(currentId) : -1

  return (
    <Scene
      title="השביל שלנו"
      subtitle="כל עיגול הוא תחנה בביקור. לוחצים על תחנה כדי לראות מה קורה בה, מה עלול להיות קשה, ומה אפשר לבקש."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          {path ? (
            <>
              באנו בגלל <strong>{path.label}</strong>. כל ילד/ה מתחיל/ה אותו דבר —
              קבלה, טריאז׳ ובדיקת רופא/ה — ומשם הצוות מתאים את ההמשך.{' '}
              <Link to="/reason" style={{ textDecoration: 'underline' }}>
                שינוי הסיבה
              </Link>
            </>
          ) : (
            <>
              עוד לא סיפרתם לי למה באנו.{' '}
              <Link to="/reason" style={{ textDecoration: 'underline', fontWeight: 700 }}>
                אפשר לספר לי כאן
              </Link>{' '}
              ואתאים את הדרך.
            </>
          )}
        </Bubble>
      </div>

      <ol className={styles.trail}>
        {journeyStages.map((stage, i) => {
          const isHere = stage.id === currentId
          const isDone = currentIndex > -1 && i < currentIndex
          const isOpen = openId === stage.id
          return (
            <li key={stage.id} className={styles.stop}>
              <button
                type="button"
                className={`${styles.stopDot} ${isDone ? styles.stopDone : ''} ${
                  isHere ? styles.stopHere : ''
                }`}
                onClick={() => setOpenId(isOpen ? null : stage.id)}
                aria-expanded={isOpen}
                aria-label={`${stage.title}${isHere ? ' — אנחנו כאן' : ''}`}
              >
                <span aria-hidden>{stage.emoji}</span>
                {isDone && (
                  <span className={styles.stopStar} aria-hidden>
                    ⭐
                  </span>
                )}
                {isHere && (
                  <span className={styles.meToken} aria-hidden>
                    {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
                  </span>
                )}
              </button>

              <div className={`${styles.stopCard} ${isHere ? styles.stopCardHere : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : stage.id)}
                  aria-expanded={isOpen}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  <span className={styles.stopTitleRow}>
                    <span className={styles.stopTitle}>
                      {isHere && '📍 '}
                      {stage.title}
                    </span>
                    {stage.waitRange && (
                      <span className={styles.stopWait}>
                        {stage.waitKind === 'duration' ? '⏱️' : '⏳'} {stage.waitRange}
                      </span>
                    )}
                  </span>
                  <span className={styles.stopMeaning}>{stage.meaning}</span>
                </button>

                {isOpen && (
                  <div className={styles.stopDetail}>
                    <p className={styles.detailRow}>
                      <span className={styles.detailLabel}>מה קורה כאן</span>
                      {stage.whatHappens}
                    </p>
                    <p className={styles.detailRow}>
                      <span className={styles.detailLabel}>מה עלול להיות קשה</span>
                      {stage.challenge}
                    </p>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>מה אפשר לבקש</span>
                      <ul className={styles.askList}>
                        {stage.canAsk.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>

                    {stage.procedureIds && stage.procedureIds.length > 0 && (
                      <div className={styles.prepRow}>
                        {stage.procedureIds.map((pid) => {
                          const p = getProcedure(pid)
                          if (!p) return null
                          return (
                            <Link key={pid} to={`/show/${pid}`} className={styles.prepLink}>
                              <span aria-hidden>{p.emoji}</span>
                              {p.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    <button
                      type="button"
                      className={`${styles.hereBtn} ${isHere ? styles.hereBtnOn : ''}`}
                      onClick={() => setCurrentId(isHere ? null : stage.id)}
                      aria-pressed={isHere}
                    >
                      {isHere ? '📍 אנחנו כאן — לביטול' : 'לסמן: אנחנו כאן'}
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          הזמנים הם טווחים להמחשה בלבד. הסדר והזמנים עשויים להשתנות לפי החלטת הצוות
          ולפי העומס במיון.
        </Note>
      </div>

      <Link to="/going-home" className={styles.crossLink}>
        🏠 מה קורה בסוף הביקור, בדרך הביתה ←
      </Link>
    </Scene>
  )
}
