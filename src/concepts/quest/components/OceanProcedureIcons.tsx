import { Link } from '../../nav'
import { getProcedure } from '../../../data/procedures'
import { useI18n } from '../../../hooks/useI18n'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { ProcedureLineIcon } from './ProcedureLineIcon'
import css from '../quest.module.css'

/** The round procedure buttons of a stage (child side): each opens that procedure's own child page. */
export function OceanProcedureIcons({ ids }: { ids: string[] }) {
  const { t } = useI18n()
  const { theme } = useQuestTheme()
  const { doneProcedures } = useQuestProgress()

  return (
    <div className={css.procedureIconRow}>
      {ids.map((pid) => {
        const proc = t(`procedures.procedures.${pid}`, getProcedure(pid))
        return (
          <span key={pid} style={{ position: 'relative' }}>
            <Link to={`/procedure/${pid}`} className={css.procedureIconBtn} aria-label={proc?.title ?? pid}>
              <ProcedureLineIcon id={pid} emoji={proc?.emoji} />
            </Link>
            {doneProcedures.has(pid) && <span className={css.procDoneBadge}>{theme.doneEmoji ?? '✓'}</span>}
          </span>
        )
      })}
    </div>
  )
}
