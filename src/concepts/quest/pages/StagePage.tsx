import { useParams, useNavigate } from 'react-router-dom'
import { Navigate, Link } from '../../nav'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES, OPTIONAL_STAGES } from '../useQuestProgress'
import { SensoryBar } from '../../../components/SensoryBar'
import { getProcedure } from '../../../data/procedures'
import css from '../quest.module.css'

const LAST_REQUIRED = REQUIRED_STAGES[REQUIRED_STAGES.length - 1]

export function StagePage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()
  const { active, completeActive } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const isActive = active?.id === id
  const isLastStage = id === LAST_REQUIRED
  const isOptional = id ? (OPTIONAL_STAGES as readonly string[]).includes(id) : false

  function handleDone() {
    completeActive()
    if (isLastStage) {
      navigate(conceptPath('/procedures'))
    } else if (isOptional) {
      navigate(conceptPath('/night-map'))
    } else {
      navigate(conceptPath('/map'))
    }
  }

  const data = journeyStages.find((j) => j.id === id)
  const skin = id ? theme.stages[id] : undefined

  if (!data) return <Navigate to="/map" replace />

  const label = skin?.label ?? data.title
  const icon = skin?.icon ?? data.emoji
  const heroImg = skin?.heroImage ?? skin?.image

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        {heroImg ? (
          <img src={heroImg} alt="" className={css.stageHeroImg} />
        ) : (
          <span className={css.stageHeroIcon}>{icon}</span>
        )}
        <h1 style={{ color: theme.accent }}>{label}</h1>
        {skin?.hint && <p className={css.stageHeroHint}>{skin.hint}</p>}

        {data.procedureIds && data.procedureIds.length > 0 && (
          <div className={css.procedureIconRow}>
            {data.procedureIds.map((pid) => {
              const proc = getProcedure(pid)
              return (
                <Link key={pid} to={`/procedure/${pid}`}>
                  <button className={css.procedureIconBtn} style={{ borderColor: theme.accent, color: theme.accent }} aria-label={proc?.title ?? pid}>
                    {proc?.emoji ?? '?'}
                  </button>
                </Link>
              )
            })}
          </div>
        )}

        <div className={css.stageBack}>
          {isActive && (
            <button
              className={css.doneBtn}
              style={{ background: theme.accent, color: theme.accentText }}
              onClick={handleDone}
            >
              הצלחתי! ←
            </button>
          )}
          {isLastStage && !isActive && (
            <Link to="/procedures">
              <button
                className={css.doneBtn}
                style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
              >
                לבחירת הבדיקות ←
              </button>
            </Link>
          )}
          <Link to={isOptional ? '/night-map' : '/map'}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              חזרה למפה →
            </button>
          </Link>
        </div>
      </div>

      {data.sensory && <SensoryBar sensory={data.sensory} />}
      {data.waitRange && (
        <p className={css.waitRange}>⏱ זמן משוער: {data.waitRange}</p>
      )}

      <div className={css.stageBody}>
        {data.meaning && (
          <section>
            <h2>אנחנו כאן</h2>
            <p>{data.meaning}</p>
          </section>
        )}
        <section>
          <h2>מה קורה</h2>
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

      </div>
    </div>
  )
}
