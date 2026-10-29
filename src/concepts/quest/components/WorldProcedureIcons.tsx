import { Link } from '../../nav'
import { useI18n } from '../../../hooks/useI18n'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { parentProcedure } from '../../../data/parent'
import { ProcedureLineIcon } from './ProcedureLineIcon'
import css from '../quest.module.css'

/** The procedure buttons of a stage (child side): each opens that procedure's own child page. */
export function WorldProcedureIcons({ ids }: { ids: string[] }) {
  const { t, lang } = useI18n()
  const { theme } = useQuestTheme()
  const { doneProcedures } = useQuestProgress()

  return (
    <div className={css.procedureBtnBlock}>
      <p className={css.procedureBtnHint}>{t('ui.text.procedureButtonsHint')}</p>
      <div className={css.procedureBtnGrid}>
        {ids.map((pid) => {
          const proc = parentProcedure(lang, pid)
          const done = doneProcedures.has(pid)
          return (
            <Link key={pid} to={`/procedure/${pid}`} className={css.procedureBtn}>
              <span className={css.procedureBtnIcon} aria-hidden><ProcedureLineIcon id={pid} emoji={proc?.emoji} /></span>
              <span className={css.procedureBtnLabel}>{proc?.title ?? pid}</span>
              {done && <span className={css.procedureBtnDone}>{theme.doneEmoji ?? '✓'}</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
