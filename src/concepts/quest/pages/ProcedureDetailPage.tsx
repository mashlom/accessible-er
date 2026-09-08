import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navigate } from '../../nav'
import { getProcedure } from '../../../data/procedures'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import css from '../quest.module.css'

export function ProcedureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()
  const { completeProcedure, doneProcedures } = useQuestProgress()
  const navigate = useNavigate()
  const isDone = id ? doneProcedures.has(id) : false
  const procedure = id ? getProcedure(id) : undefined
  const [variant, setVariant] = useState(0)

  useEffect(() => { setVariant(0) }, [id])

  if (!procedure) return <Navigate to="/map" replace />

  const themedSteps = id ? theme.procedureSteps?.[id] : undefined
  const variants = themedSteps ? undefined : procedure.storyVariants
  const steps = themedSteps ?? (variants ? (variants[variant] ?? variants[0]).steps : procedure.story)

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>{procedure.emoji}</span>
        <h1 style={{ color: theme.accent }}>{procedure.title}</h1>
        {theme.procedureNarratives?.[id!] && (
          <p className={css.stageHeroHint}>{theme.procedureNarratives[id!]}</p>
        )}

        {steps && steps.length > 0 && (
          <div className={css.procedureStoryBlock}>
            {variants && variants.length > 1 && (
              <div className={css.variantToggle}>
                {variants.map((v, i) => (
                  <button
                    key={i}
                    className={`${css.variantBtn} ${i === variant ? css.variantBtnActive : ''}`}
                    style={i === variant
                      ? { background: theme.accent, color: theme.accentText, borderColor: theme.accent }
                      : { borderColor: theme.accent, color: theme.accent }}
                    onClick={() => setVariant(i)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
            <ol className={css.procedureSteps} style={{ color: theme.accent }}>
              {steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}

        <div className={css.stageBack}>
          {!isDone && (
            <button
              className={css.doneBtn}
              style={{ background: theme.accent, color: theme.accentText }}
              onClick={() => { completeProcedure(id!); navigate(-1) }}
            >
              הצלחתי! ←
            </button>
          )}
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={() => navigate(-1)}>
            חזרה →
          </button>
        </div>
      </div>

      {(procedure.who || procedure.duration) && (
        <p className={css.waitRange}>
          {procedure.who && <span>👤 {procedure.who}</span>}
          {procedure.who && procedure.duration && <span> · </span>}
          {procedure.duration && <span>⏱ זמן משוער: {procedure.duration}</span>}
        </p>
      )}

      <div className={css.stageBody}>
        <section>
          <h2>מה קורה בפועל</h2>
          <p>{procedure.what}</p>
        </section>

        <section>
          <h2>מה הילד/ה עשוי/ה להרגיש</h2>
          <p>{procedure.feel}</p>
        </section>

        <section>
          <h2>איך להכין את הילד/ה</h2>
          <p>{procedure.prepare}</p>
        </section>

        {procedure.adaptations && procedure.adaptations.length > 0 && (
          <section>
            <h2>מה לבקש מהצוות</h2>
            <ul>
              {procedure.adaptations.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
