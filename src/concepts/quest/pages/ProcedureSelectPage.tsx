import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, OPTIONAL_STAGES, StageId } from '../useQuestProgress'
import css from '../quest.module.css'

export function ProcedureSelectPage() {
  const { theme } = useQuestTheme()
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
    navigate(conceptPath('/night-map'))
  }

  function handleSkip() {
    navigate(conceptPath('/celebrate'))
  }

  const prompt = theme.procedurePrompt ?? 'בחרו את הפרוצדורות שנקבעו'

  return (
    <div className={css.selectPage} style={{ '--accent': theme.accent, '--accent-soft': theme.accentSoft } as React.CSSProperties}>
      <h1 className={css.selectTitle} style={{ color: theme.accent }}>שלב הבא</h1>
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
                <span className={css.worldEmoji}>{skin?.icon ?? '❓'}</span>
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
            המשיכו ←
          </button>
        ) : (
          <button
            className={css.doneBtn}
            style={{ background: theme.accent, color: theme.accentText }}
            onClick={handleSkip}
          >
            לסיום ←
          </button>
        )}
      </div>
    </div>
  )
}
