import { Link } from '../../nav'
import { useReturnTo } from '../useReturnTo'
import { useParentTheme as useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { CareCardForm } from '../../../components/careCard/CareCardForm'
import css from '../quest.module.css'

export function CardPage() {
  const { theme } = useQuestTheme()
  const { t, lang, dir } = useI18n()
  const { goBack, leaveState } = useReturnTo('/stage/reception')

  return (
    <div className={css.stagePage} dir={dir} lang={lang} style={{ '--accent': theme.accent, textAlign: 'start' } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft, ...(lang === 'he' ? {} : { alignItems: 'flex-start', textAlign: 'start' }) }}>
        <span className={css.stageHeroIcon}>🪪</span>
        <h1 style={{ color: theme.accent }}>
          {t('ui.tiles.card.title')}
        </h1>
        {/* the card is the same on every page and in every world: the same heading as the parent's card page */}
        <p className={css.stageHeroHint}>{t('ui.labels.adult.cardSubtitle')}</p>
        <div className={css.stageBack}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            {t('ui.buttons.back')}
          </button>
        </div>
      </div>

      <div className={css.stageBody}>
        <CareCardForm
          colours={{ accent: theme.accent, accentSoft: theme.accentSoft, accentText: theme.accentText }}
          footer={({ empty }) => (
            <div className={css.stageBack}>
              <Link to="/card/view" state={leaveState('/card')}>
                <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText, opacity: empty ? 0.4 : 1 }} disabled={empty}>
                  {t('ui.buttons.showCardNext')}
                </button>
              </Link>
              <Link to="/card/view?print=1" style={empty ? { pointerEvents: 'none', opacity: 0.4 } : undefined}>
                <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} disabled={empty}>
                  {t('ui.cardView.savePdf')}
                </button>
              </Link>
              <Link to="/card/view?print=1" style={empty ? { pointerEvents: 'none', opacity: 0.4 } : undefined}>
                <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} disabled={empty}>
                  {t('ui.cardView.print')}
                </button>
              </Link>
            </div>
          )}
        />
      </div>
    </div>
  )
}
