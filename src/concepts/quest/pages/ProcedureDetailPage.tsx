import { useParams } from 'react-router-dom'
import { Navigate, Link } from '../../nav'
import { getProcedure } from '../../../data/procedures'
import { useQuestTheme } from '../useQuestTheme'
import css from '../quest.module.css'

export function ProcedureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()
  const procedure = id ? getProcedure(id) : undefined

  if (!procedure) return <Navigate to="/map" replace />

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>{procedure.emoji}</span>
        <h1 style={{ color: theme.accent }}>{procedure.title}</h1>
        {procedure.duration && (
          <p className={css.stageHeroHint}>⏱ {procedure.duration}</p>
        )}
        <div className={css.stageBack}>
          <Link to={`/map`}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              חזרה למפה →
            </button>
          </Link>
        </div>
      </div>

      <div className={css.stageBody}>
        <section>
          <h2>מה קורה</h2>
          <p>{procedure.what}</p>
        </section>

        <section>
          <h2>מה מרגישים</h2>
          <p>{procedure.feel}</p>
        </section>

        <section>
          <h2>איך מכינים</h2>
          <p>{procedure.prepare}</p>
        </section>

        {procedure.adaptations && procedure.adaptations.length > 0 && (
          <section>
            <h2>אפשר לבקש</h2>
            <ul>
              {procedure.adaptations.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}

        {procedure.story && procedure.story.length > 0 && (
          <section>
            <h2>צעד אחר צעד</h2>
            <ol className={css.procedureSteps}>
              {procedure.story.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </section>
        )}
      </div>
    </div>
  )
}
