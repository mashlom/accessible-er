import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { procedures, getProcedure } from '../data/procedures'
import { useVisitReason } from '../hooks/useVisitReason'
import type { Procedure } from '../data/types'
import styles from './ProceduresPage.module.css'

export function ProceduresPage() {
  const { path } = useVisitReason()

  // Procedures that appear on the selected reason's route, surfaced first.
  const relevant: Procedure[] = path
    ? path.route
        .map((s) => s.procedureId)
        .filter((id): id is string => Boolean(id))
        .map((id) => getProcedure(id))
        .filter((p): p is Procedure => Boolean(p))
        // de-dupe while keeping order
        .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    : []

  const relevantIds = new Set(relevant.map((p) => p.id))
  const rest = procedures.filter((p) => !relevantIds.has(p.id))

  return (
    <div className="container">
      <PageHeader
        eyebrow="מה עומד לקרות"
        title="הכנה לבדיקות ולפרוצדורות"
        subtitle="בחרו פעולה כדי לראות מה עומד לקרות, כמה זמן זה לוקח, ומה אפשר לבקש. רוני יסביר לילד/ה שלב אחרי שלב."
      />

      {relevant.length > 0 && (
        <>
          <p className={styles.groupLabel}>
            {path?.emoji} רלוונטי לביקור שלנו ({path?.label})
          </p>
          <div className={`${styles.grid} ${styles.relevant}`}>
            {relevant.map((p) => (
              <ProcedureTile key={p.id} p={p} relevant />
            ))}
          </div>
        </>
      )}

      <p className={styles.groupLabel}>
        {relevant.length > 0 ? 'כל הפעולות' : 'הפעולות הנפוצות'}
      </p>
      <div className={styles.grid}>
        {rest.map((p) => (
          <ProcedureTile key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}

function ProcedureTile({ p, relevant }: { p: Procedure; relevant?: boolean }) {
  return (
    <Link
      to={`/procedures/${p.id}`}
      className={`${styles.tile} ${relevant ? styles.relevant : ''}`}
    >
      <span className={styles.tileEmoji} aria-hidden>
        {p.emoji}
      </span>
      <span className={styles.tileTitle}>{p.title}</span>
      <span className={styles.tileDuration}>{p.duration}</span>
    </Link>
  )
}
