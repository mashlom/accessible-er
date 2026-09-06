import { useParams } from 'react-router-dom'
import { Navigate, Link } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import css from '../quest.module.css'

export function StagePage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()

  const data = journeyStages.find((j) => j.id === id)
  const skin = id ? theme.stages[id] : undefined

  if (!data) return <Navigate to="/map" replace />

  const label = skin?.label ?? data.title
  const icon = skin?.icon ?? data.emoji

  return (
    <div className={css.stagePage}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        {skin?.image ? (
          <img src={skin.image} alt="" className={css.stageHeroImg} />
        ) : (
          <span className={css.stageHeroIcon}>{icon}</span>
        )}
        <h1 style={{ color: theme.accent }}>{label}</h1>
        {skin?.hint && <p className={css.stageHeroHint}>{skin.hint}</p>}
      </div>

      <div className={css.stageBody}>
        <section>
          <h2>מה קורה כאן?</h2>
          <p>{data.whatHappens}</p>
        </section>

        {data.challenge && (
          <section>
            <h2>מה יכול להיות קשה?</h2>
            <p>{data.challenge}</p>
          </section>
        )}

        {data.canAsk && data.canAsk.length > 0 && (
          <section>
            <h2>אפשר לבקש</h2>
            <ul>
              {data.canAsk.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}

        {data.waitRange && (
          <p className={css.waitRange}>⏱ זמן משוער: {data.waitRange}</p>
        )}
      </div>

      <div className={css.stageBack}>
        <Link to="/map">
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
            ← חזרה למפה
          </button>
        </Link>
      </div>
    </div>
  )
}
