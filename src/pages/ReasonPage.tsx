import { Link } from 'react-router-dom'
import { PageHeader, Note } from '../components/ui'
import { paths } from '../data/paths'
import { useVisitReason } from '../hooks/useVisitReason'
import styles from './ReasonPage.module.css'

export function ReasonPage() {
  const { reasonId, path, setReason, clearReason } = useVisitReason()

  return (
    <div className="container">
      <PageHeader
        eyebrow="למה הגענו"
        title="מה הביא אתכם היום?"
        subtitle="הבחירה עוזרת לי להראות לכם את המסלול הצפוי. אפשר לשנות בכל רגע — וכל ביקור מתחיל אותו דבר."
      />

      <div className={styles.options} role="radiogroup" aria-label="סיבת ההגעה">
        {paths.map((p) => {
          const selected = p.id === reasonId
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
              onClick={() => setReason(p.id)}
            >
              <span className={styles.optionEmoji} aria-hidden>
                {p.emoji}
              </span>
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{p.label}</span>
                <span className={styles.optionBlurb}>{p.blurb}</span>
              </span>
              {selected && (
                <span className={styles.check} aria-hidden>
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {path && (
        <section className={`card ${styles.routeCard}`} style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>
            {path.emoji} המסלול הצפוי שלנו
          </h2>
          <ol className={styles.routeList}>
            {path.route.map((stop, i) => (
              <li key={i} className={styles.routeItem}>
                <span className={styles.routeDot} aria-hidden>
                  {i + 1}
                </span>
                <span className={styles.routeLabel}>
                  {stop.procedureId ? (
                    <Link to={`/procedures/${stop.procedureId}`} className={styles.routeLink}>
                      {stop.title}
                    </Link>
                  ) : (
                    stop.title
                  )}
                </span>
                {stop.optional && <span className={styles.optionalTag}>לפי הצורך</span>}
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Note>
              זהו מסלול לדוגמה בלבד. המסלול המדויק תמיד נקבע על ידי הצוות הרפואי לפי מצב הילד.
            </Note>
          </div>
        </section>
      )}

      {path && (
        <div className={styles.actions}>
          <Link to="/journey" className={styles.primaryBtn}>
            להתקדם למסע במיון ←
          </Link>
          <button type="button" className={styles.ghostBtn} onClick={clearReason}>
            ניקוי הבחירה
          </button>
        </div>
      )}
    </div>
  )
}
