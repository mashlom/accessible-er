import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navigate } from '../../nav'
import { parentJourney, parentProcedure } from '../../../data/parent'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { OceanProcedureDetailSheet } from '../components/OceanProcedureDetailSheet'
import { ParentInfo } from '../components/ParentInfo'
import css from '../quest.module.css'

export function ProcedureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { completeProcedure, doneProcedures, active, visibleOptionals } = useQuestProgress()
  const navigate = useNavigate()
  const isDone = id ? doneProcedures.has(id) : false

  // Only allow completing if the parent stage is currently active
  const parentStage = parentJourney(lang).find((s) => s.procedureIds?.includes(id ?? ''))
  const parentIsActive = parentStage
    ? active?.id === parentStage.id ||
      visibleOptionals.some((s) => s.id === parentStage.id && s.status === 'active')
    : true // procedure with no parent stage — allow
  const procedure = id ? parentProcedure(lang, id) : undefined
  const [variant, setVariant] = useState(0)

  useEffect(() => { setVariant(0) }, [id])

  if (!procedure) return <Navigate to="/map" replace />

  if (theme.id === 'ocean' && id) return <OceanProcedureDetailSheet id={id} />

  const themedSteps = id ? theme.procedureSteps?.[id] : undefined
  // the variants (the methods) come first; a world without them shows its own steps, else the shared story
  const variants = theme.procedureVariants?.[id!] ?? procedure.storyVariants
  const steps = variants ? (variants[variant] ?? variants[0]).steps : (themedSteps ?? procedure.story)

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
              {steps.map((step, i) => {
                return <li key={i}>{step}</li>
              })}
            </ol>
          </div>
        )}

        <div className={css.stageBack}>
          {parentIsActive && (
            <button
              className={css.doneBtn}
              style={{ background: theme.accent, color: theme.accentText }}
              onClick={() => { completeProcedure(id!); navigate(-1) }}
            >
              {isDone
                ? <em className={css.doneBtnCoin}>{theme.doneEmoji ?? '✓'}</em>
                : t('ui.buttons.done')}
            </button>
          )}
          {(!isDone || !parentIsActive) && (
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={() => navigate(-1)}>
              {t('ui.buttons.back')}
            </button>
          )}
        </div>
      </div>

      <div className={css.stageBody}>
        {/* the parent's part is the same block in every world, opened on this procedure */}
        <ParentInfo stageId={parentStage?.id} inline initialProc={id} />
      </div>
    </div>
  )
}
