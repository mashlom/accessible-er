import { Link } from '../../nav'
import { paths } from '../../../data/paths'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

export function ReasonPage() {
  const { reasonId, path, setReason } = useVisitReason()
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const localPath = path && t(`paths.paths.${path.id}`, path)

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>🗺️</span>
        <h1 style={{ color: theme.accent }}>{t('ui.text.reasonTitle', 'מה הביא אתכם היום?')}</h1>
        <p className={css.stageHeroHint}>{t('ui.text.reasonHintTop', 'הבחירה עוזרת לראות את המסלול הצפוי שלכם')}</p>
      </div>

      <div className={css.stageBody}>
        <div className={css.reasonOptions} role="radiogroup" aria-label={t('ui.text.reasonAria', 'סיבת ההגעה')}>
          {t('paths.paths', paths).map((p) => {
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
            <h2>{localPath.emoji} {t('ui.text.expectedRoute', 'המסלול הצפוי שלנו')}</h2>
            <ol className={css.reasonRouteList}>
              {localPath.route.map((stop, i) => (
                <li key={i} className={css.reasonRouteItem}>
                  <span className={css.reasonRouteDot} style={{ background: theme.accentSoft, color: theme.accent }}>{i + 1}</span>
                  <span className={css.reasonRouteLabel}>
                    {stop.title}
                    {stop.optional && <span className={css.reasonOptional}>{t('ui.text.ifNeeded', 'לפי הצורך')}</span>}
                  </span>
                </li>
              ))}
            </ol>
            <p className={css.reasonNote}>{t('ui.text.routeNote', 'זהו מסלול לדוגמה בלבד. המסלול המדויק נקבע על ידי הצוות הרפואי.')}</p>
          </section>
        )}

        <div className={css.stageBack}>
          <Link to="/stage/reception">
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              {t('ui.buttons.back', 'חזרה →')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
