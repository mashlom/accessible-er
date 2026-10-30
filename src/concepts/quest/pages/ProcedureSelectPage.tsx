import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, OPTIONAL_STAGES, StageId } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { StageIcon } from '../../../components/StageIcon'
import { WorldProcedureSheet } from '../components/WorldProcedureSheet'
import css from '../quest.module.css'

export function ProcedureSelectPage() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { revealMultiple, resetOptionals } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const [selected, setSelected] = useState<Set<StageId>>(new Set())

  useEffect(() => {
    resetOptionals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggle(id: StageId) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleContinue() {
    revealMultiple([...selected])
    // the second map takes the choice's place: going back from it returns to the first map, not to the choice
    navigate(conceptPath('/second-map'), { replace: true })
  }

  function handleSkip() {
    navigate(conceptPath('/celebrate'), { replace: true })
  }

  if (theme.design) {
    return <WorldProcedureSheet selected={selected} onToggle={toggle} onContinue={handleContinue} onSkip={handleSkip} />
  }

  const prompt = theme.procedurePrompt ?? t('ui.labels.adult.procedurePrompt')

  return (
    <div className={css.selectPage} style={{ '--accent': theme.accent, '--accent-soft': theme.accentSoft } as React.CSSProperties}>
      <h1 className={css.selectTitle} style={{ color: theme.accent }}>{t('ui.labels.adult.nextStep')}</h1>
      <p className={css.selectSub}>{prompt}</p>

      <div className={css.worldGrid}>
        {OPTIONAL_STAGES.map((id) => {
          const skin = theme.stages[id]
          const isSelected = selected.has(id)
          return (
            <button
              key={id}
              className={[css.worldCard, isSelected ? css.worldCardSelected : ''].join(' ')}
              style={isSelected ? { borderColor: theme.accent, background: theme.accentSoft } : {}}
              onClick={() => toggle(id)}
              aria-pressed={isSelected}
            >
              {skin?.image ? (
                <img src={skin.image} alt="" className={css.worldCardImg} />
              ) : (
                <span className={css.worldEmoji}><StageIcon icon={skin?.icon ?? '❓'} /></span>
              )}
              <span className={css.worldName} style={{ color: theme.accent }}>
                {isSelected ? '✓ ' : ''}{skin?.label ?? id}
              </span>
            </button>
          )
        })}

      </div>

      <div className={css.procedureActions}>
        {selected.size > 0 ? (
          <button
            className={css.doneBtn}
            style={{ background: theme.accent, color: theme.accentText }}
            onClick={handleContinue}
          >
            {t('ui.buttons.continue')}
          </button>
        ) : (
          <button
            className={css.doneBtn}
            style={{ background: theme.accent, color: theme.accentText }}
            onClick={handleSkip}
          >
            {t('ui.buttons.finish')}
          </button>
        )}
      </div>
    </div>
  )
}
