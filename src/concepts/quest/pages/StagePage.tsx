import { useParams, useNavigate } from 'react-router-dom'
import { Navigate, Link } from '../../nav'
import { useConceptPath } from '../../nav'
import { parentJourney, parentProcedure } from '../../../data/parent'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES, OPTIONAL_STAGES, loadProcs } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { StageIcon } from '../../../components/StageIcon'
import { OceanStageSheet } from '../components/OceanStageSheet'
import { ParentInfo } from '../components/ParentInfo'
import { OceanProcedureIcons } from '../components/OceanProcedureIcons'
import { OCEAN_IMAGES, OCEAN_SYMBOLS, OCEAN_SHEET_PICTURES } from './OceanMapPage'
import css from '../quest.module.css'

const LAST_REQUIRED = REQUIRED_STAGES[REQUIRED_STAGES.length - 1]

export function StagePage() {
  const { id } = useParams<{ id: string }>()
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { stages, active, completeActive, completeStage, completeProcedure, doneProcedures } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const isLastStage = id === LAST_REQUIRED
  const isOptional = id ? (OPTIONAL_STAGES as readonly string[]).includes(id) : false
  const thisStage = stages.find((s) => s.id === id)
  // the second stage's stations are not in order: any of them that was ordered and is not done yet can be finished
  // (a station left "locked" by an older saved state could never be finished, and the ending stayed locked)
  const isActive = isOptional ? !!thisStage?.visible && thisStage.status !== 'done' : active?.id === id

  const data = parentJourney(lang).find((j) => j.id === id)
  const skin = id ? theme.stages[id] : undefined

  // ocean: the ending station opened before everything is done: a sheet with only the way back
  if (theme.id === 'ocean' && id === 'decision') {
    const skin = theme.stages.decision
    return (
      <OceanStageSheet
        stageId="decision"
        label={skin?.label ?? ''}
        hint={skin?.hint}
        image={OCEAN_IMAGES.decision}
        isActive={false}
        onDone={() => {}}
        backTo="/night-map"
        noParent
      />
    )
  }

  if (!data) return <Navigate to="/map" replace />

  const label = skin?.label ?? data.title
  const icon = skin?.icon ?? data.emoji
  const heroImg = skin?.heroImage ?? skin?.image

  // When a stage has exactly one procedure, embed it inline instead of showing an icon link
  const inlineProcId = data.procedureIds?.length === 1 ? data.procedureIds[0] : undefined
  const inlineProc = inlineProcId ? parentProcedure(lang, inlineProcId) : undefined
  const themedSteps = inlineProcId ? theme.procedureSteps?.[inlineProcId] : undefined
  const inlineSteps = themedSteps ?? inlineProc?.story

  function handleDone() {
    if (inlineProcId) {
      completeProcedure(inlineProcId)
    } else if (id) {
      const procIds = data?.procedureIds ?? []
      const anyProcDone = procIds.some((pid) => loadProcs().has(pid))
      if (!anyProcDone) completeProcedure(id)
    }
    if (isOptional && id) {
      completeStage(id)
    } else {
      completeActive()
    }
    if (isLastStage) {
      // ocean: finishing the doctor stage goes straight on to the procedure choice
      navigate(conceptPath(theme.id === 'ocean' ? '/procedures' : '/map'))
    } else if (isOptional) {
      navigate(conceptPath('/night-map'))
    } else {
      navigate(conceptPath('/map'))
    }
  }

  if (theme.id === 'ocean' && id) {
    return (
      <OceanStageSheet
        stageId={id}
        label={label}
        hint={skin?.hint}
        image={OCEAN_SYMBOLS[id] ?? OCEAN_SHEET_PICTURES[id] ?? heroImg ?? OCEAN_IMAGES[id]}
        isActive={!!isActive}
        onDone={handleDone}
        showChooseTests={isLastStage && thisStage?.status === 'done'}
        doneIsChoice={isLastStage}
        backTo={isOptional ? '/night-map' : '/map'}
      >
        {inlineProc && inlineSteps && inlineSteps.length > 0 && (
          <ol className={css.procedureSteps} style={{ color: theme.accent }}>
            {inlineSteps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        )}
        {!inlineProc && data.procedureIds && data.procedureIds.length > 0 && (
          <OceanProcedureIcons ids={data.procedureIds} />
        )}
      </OceanStageSheet>
    )
  }

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        {heroImg ? (
          <img src={heroImg} alt="" className={css.stageHeroImg} />
        ) : (
          <span className={css.stageHeroIcon}><StageIcon icon={icon} /></span>
        )}
        <h1 style={{ color: theme.accent }}>{label}</h1>
        {skin?.hint && <p className={css.stageHeroHint}>{skin.hint}</p>}

        {inlineProc && inlineSteps && inlineSteps.length > 0 && (
          <div className={css.procedureStoryBlock}>
            <ol className={css.procedureSteps} style={{ color: theme.accent }}>
              {inlineSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}

        {!inlineProc && data.procedureIds && data.procedureIds.length > 0 && (
          <div className={css.procedureIconRow}>
            {data.procedureIds.map((pid) => {
              const proc = parentProcedure(lang, pid)
              const done = doneProcedures.has(pid)
              return (
                <Link key={pid} to={`/procedure/${pid}`} style={{ position: 'relative' }}>
                  <button className={css.procedureIconBtn} style={{ borderColor: theme.accent, color: theme.accent }} aria-label={proc?.title ?? pid}>
                    {proc?.emoji ?? '?'}
                  </button>
                  {done && (
                    <span className={css.procDoneBadge}>{theme.doneEmoji ?? '✓'}</span>
                  )}
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
              {t('ui.buttons.done')}
            </button>
          )}
          {isLastStage && !isActive && (
            <Link to="/procedures">
              <button
                className={css.doneBtn}
                style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
              >
                {t('ui.buttons.chooseTests')}
              </button>
            </Link>
          )}
          <Link to={isOptional ? '/night-map' : '/map'}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              {t('ui.buttons.backToMap')}
            </button>
          </Link>
        </div>
      </div>

      <div className={css.parentRow}>
        {/* the parent's part is the same block in every world */}
        <ParentInfo stageId={id} inline />
      </div>
    </div>
  )
}
