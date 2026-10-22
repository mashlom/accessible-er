import { Link } from '../../nav'
import { parentPaths } from '../../../data/parent/paths'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { useParentTheme as useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

export function ReasonPage() {
  const { reasonId, path, setReason } = useVisitReason()
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const localPath = path && parentPaths(lang).find((p) => p.id === path.id)

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>🗺️</span>
        <h1 style={{ color: theme.accent }}>{t('ui.labels.adult.reasonTitle')}</h1>
        <p className={css.stageHeroHint}>{t('ui.labels.adult.reasonHintTop')}</p>
      </div>

      <div className={css.stageBody}>
        <div className={css.reasonOptions} role="radiogroup" aria-label={t('ui.labels.adult.reasonAria')}>
          {parentPaths(lang).map((p) => {
            const selected = p.id === reasonId
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${css.reasonOption} ${selected ? css.reasonOptionSelected : ''}`}
                style={selected ? { borderColor: theme.accent, background: theme.accentSoft } : undefined}
                onClick={() => setReason(p.id)}
              >
                <span className={css.reasonEmoji} aria-hidden>{p.emoji}</span>
                <span className={css.reasonText}>
                  <span className={css.reasonLabel}>{p.label}</span>
                  <span className={css.reasonBlurb}>{p.blurb}</span>
                </span>
                {selected && <span className={css.reasonCheck} aria-hidden style={{ color: theme.accent }}>✓</span>}
              </button>
            )
          })}
        </div>

        {localPath && (
          <section className={css.reasonRoute}>
            <h2>{localPath.emoji} {t('ui.labels.adult.expectedRoute')}</h2>
            <ol className={css.reasonRouteList}>
              {localPath.route.map((stop, i) => (
                <li key={i} className={css.reasonRouteItem}>
                  <span className={css.reasonRouteDot} style={{ background: theme.accentSoft, color: theme.accent }}>{i + 1}</span>
                  <span className={css.reasonRouteLabel}>
                    {stop.title}
                    {stop.optional && <span className={css.reasonOptional}>{t('ui.labels.adult.ifNeeded')}</span>}
                  </span>
                </li>
              ))}
            </ol>
            <p className={css.reasonNote}>{t('ui.labels.adult.routeNote')}</p>
          </section>
        )}

        <div className={css.stageBack}>
          <Link to="/stage/reception">
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              {t('ui.buttons.back')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
