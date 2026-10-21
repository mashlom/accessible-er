import { useNavigate } from 'react-router-dom'
import { Link } from '../../nav'
import { parentJourney } from '../../../data/parent'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, loadProcs } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { StageIcon } from '../../../components/StageIcon'
import { OceanStageSheet } from '../components/OceanStageSheet'
import { ParentInfo } from '../components/ParentInfo'
import { OCEAN_IMAGES } from './OceanMapPage'
import css from '../quest.module.css'

export function WaitTimesPage() {
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { active, completeProcedure, completeActive } = useQuestProgress()
  const navigate = useNavigate()

  const isActive = active?.id === 'wait-before-triage'

  function handleDone() {
    const procIds = ['temperature', 'saturation', 'blood-pressure']
    const anyProcDone = procIds.some((pid) => loadProcs().has(pid))
    if (!anyProcDone) completeProcedure('wait-before-triage')
    completeActive()
    navigate('/quest/map')
  }

  const data = parentJourney(lang).find((j) => j.id === 'wait-before-triage')
  if (!data) return <div>Error: stage not found</div>

  const skin = theme.stages['wait-before-triage']

  if (theme.id === 'ocean') {
    return (
      <OceanStageSheet
        stageId="wait-before-triage"
        label={skin?.label ?? data.title}
        hint={skin?.hint ?? data.meaning}
        image={skin?.heroImage ?? skin?.image ?? OCEAN_IMAGES['wait-before-triage']}
        isActive={isActive}
        onDone={handleDone}
        backTo="/map"
      />
    )
  }

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}><StageIcon icon={skin?.icon ?? data.emoji} /></span>
        <h1 style={{ color: theme.accent }}>{skin?.label ?? data.title}</h1>
        <p className={css.stageHeroHint}>{skin?.hint ?? data.meaning}</p>

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
          <Link to="/map">
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              {t('ui.buttons.backToMap')}
            </button>
          </Link>
        </div>
      </div>

      <div className={css.stageBody}>
        {/* the parent's part is the same block in every world */}
        <ParentInfo stageId="wait-before-triage" inline />
      </div>
    </div>
  )
}
