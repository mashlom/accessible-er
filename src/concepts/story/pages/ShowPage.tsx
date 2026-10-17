import { useI18n } from '../../../hooks/useI18n'
import { Link } from '../../nav'
import { Scene, Bubble } from '../components/kit'
import { procedures } from '../../../data/procedures'
import { parentProcedure } from '../../../data/parent'
import { useVisitReason } from '../../../hooks/useVisitReason'
import type { Procedure } from '../../../data/types'
import styles from '../pages.module.css'

function Card({ p }: { p: Procedure }) {
  return (
    <Link to={`/show/${p.id}`} className={styles.showCard}>
      <span className={styles.showEmoji} aria-hidden>
        {p.emoji}
      </span>
      <span className={styles.showName}>{p.title}</span>
      <span className={styles.showMeta}>⏱️ {p.duration}</span>
    </Link>
  )
}

/**
 * The library of visual preparations, as a shelf of little books. When the
 * family has told us why they came, the ones on their likely route come first.
 */
export function ShowPage() {
  const { lang } = useI18n()
  const { path } = useVisitReason()

  const likelyIds = [
    ...new Set(
      (path?.route ?? []).map((s) => s.procedureId).filter((id): id is string => !!id),
    ),
  ]
  const likely = likelyIds.map((id) => parentProcedure(lang, id)).filter((p): p is Procedure => !!p)
  const rest = procedures.filter((p) => !likelyIds.includes(p.id)).map((p) => parentProcedure(lang, p.id) ?? p)

  return (
    <Scene
      title="מה עומד לקרות?"
      subtitle="כל בדיקה היא סיפור קצר עם ציור, ואני מספר אותו עמוד אחרי עמוד. אפשר לעצור בכל רגע ולחזור אחורה."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          אפשר לקרוא את הסיפור <strong>לפני</strong> שנכנסים — ככה כבר יודעים מה יקרה,
          ואין הפתעות.
        </Bubble>
      </div>

      {likely.length > 0 && (
        <>
          <h2 className={styles.sectionLabel}>
            {path?.emoji} כנראה נפגוש את אלה היום
          </h2>
          <div className={styles.showGrid}>
            {likely.map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
        </>
      )}

      <h2 className={styles.sectionLabel}>
        {likely.length > 0 ? 'כל הסיפורים' : 'הסיפורים שלנו'}
      </h2>
      <div className={styles.showGrid}>
        {rest.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
    </Scene>
  )
}
