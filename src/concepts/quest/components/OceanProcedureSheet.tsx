import { lockBodyScroll } from '../../../lib/scrollLock'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { OPTIONAL_STAGES, type StageId } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { StageIcon } from '../../../components/StageIcon'
import { OceanMapPage } from '../pages/OceanMapPage'
import css from '../quest.module.css'

interface Props {
  selected: Set<StageId>
  onToggle: (id: StageId) => void
  onContinue: () => void
  onSkip: () => void
}

/** Ocean world: the procedure choice (which extra stations were prescribed) as a sheet over the map. */
export function OceanProcedureSheet({ selected, onToggle, onContinue, onSkip }: Props) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const handleRef = useRef<HTMLButtonElement>(null)

  const close = () => navigate(conceptPath('/map'))

  useEffect(() => {
    handleRef.current?.focus()
    const unlock = lockBodyScroll()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Texts are the app's own (not the mockup's wording)
  const title = t('ui.text.oceanDecisionTitle', 'החלטת הקפטן')
  const prompt = theme.procedurePrompt ?? t('ui.text.procedurePrompt', 'בחרו את הפרוצדורות שנקבעו')

  return (
    <>
      <OceanMapPage underSheet />
      <div className={css.sheetBackdrop} onClick={close}>
        <div
          className={`${css.sheet} ${css.pickSheet} ${css.oceanSheet}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
          <button ref={handleRef} type="button" className={css.sheetHandle} onClick={close} aria-label={t('ui.buttons.close', 'סגירה')}>
            <span aria-hidden />
          </button>

          <h1 className={css.pickTitle}>{title}</h1>
          <p className={css.pickSub}>{prompt}</p>
          <p className={css.pickNote}>{t('ui.text.staffNote', 'אחות או רופא: בחרו את הבדיקות או הטיפולים שהרופא הנחה')}</p>

          <div className={css.pickGrid}>
            {OPTIONAL_STAGES.map((id) => {
              const skin = theme.stages[id]
              const isSelected = selected.has(id)
              return (
                <button
                  key={id}
                  type="button"
                  className={isSelected ? `${css.pickCard} ${css.pickCardOn}` : css.pickCard}
                  aria-pressed={isSelected}
                  onClick={() => onToggle(id)}
                >
                  <span className={css.pickPic}>
                    {skin?.image ? (
                      <img src={skin.image} alt="" />
                    ) : (
                      <StageIcon icon={skin?.icon ?? '❓'} />
                    )}
                  </span>
                  <span className={css.pickLabel}>{skin?.label ?? id}</span>
                </button>
              )
            })}
          </div>

          {selected.size > 0 ? (
            <button type="button" className={css.pickBtn} onClick={onContinue}>
              {t('ui.buttons.continue', 'המשיכו ←')}
            </button>
          ) : (
            <button type="button" className={css.pickBtn} onClick={onSkip}>
              {t('ui.buttons.finish', 'לסיום ←')}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
