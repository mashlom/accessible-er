import { Fragment } from 'react'
import { Link } from '../../nav'
import { Scene, Panel, Note } from '../components/kit'
import { paths } from '../../../data/paths'
import { useVisitReason } from '../../../hooks/useVisitReason'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/** "למה באנו היום?" — the answer draws the family's stepping-stone route. */
export function ReasonPage() {
  const { reasonId, path, setReason, clearReason } = useVisitReason()

  return (
    <Scene
      title="למה באנו היום?"
      subtitle="הבחירה עוזרת לי להראות לכם את הדרך הצפויה. אפשר לשנות בכל רגע — וכל ביקור מתחיל אותו דבר."
    >
      <div className={styles.reasonGrid} role="radiogroup" aria-label="סיבת ההגעה">
        {paths.map((p) => {
          const on = p.id === reasonId
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`${styles.reasonBtn} ${on ? styles.reasonBtnOn : ''}`}
              onClick={() => setReason(p.id)}
            >
              <span className={styles.reasonEmoji} aria-hidden>
                {p.emoji}
              </span>
              <span>
                <span className={styles.reasonName}>{p.label}</span>
                <span className={styles.reasonBlurb}>{p.blurb}</span>
              </span>
              <span className={styles.reasonCheck} aria-hidden>
                {on ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {path && (
        <div className={shell.stack} style={{ marginTop: 'var(--space-4)' }}>
          <Panel title="הדרך הצפויה שלנו" emoji={path.emoji}>
            <div className={styles.stones}>
              {path.route.map((stop, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <span className={styles.stoneArrow} aria-hidden>
                      ←
                    </span>
                  )}
                  <span
                    className={`${styles.stone} ${stop.optional ? styles.stoneOptional : ''}`}
                  >
                    {stop.procedureId ? (
                      <Link to={`/show/${stop.procedureId}`}>{stop.title}</Link>
                    ) : (
                      stop.title
                    )}
                    {stop.optional && <span aria-hidden> · לפי הצורך</span>}
                  </span>
                </Fragment>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <Note>
                זו דוגמה בלבד. הסדר והזמנים עשויים להשתנות לפי החלטת הצוות הרפואי
                ולפי העומס במיון.
              </Note>
            </div>
          </Panel>

          <div className={styles.actions}>
            <Link to="/trail" className={shell.bigBtn}>
              לשביל שלנו ←
            </Link>
            <button type="button" className={shell.ghostBtn} onClick={clearReason}>
              ניקוי הבחירה
            </button>
          </div>
        </div>
      )}
    </Scene>
  )
}
