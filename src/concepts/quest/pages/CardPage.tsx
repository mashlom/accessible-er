import { Link } from '../../nav'
import { useReturnTo } from '../useReturnTo'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { CareCardForm } from '../../../components/careCard/CareCardForm'
import css from '../quest.module.css'

export function CardPage() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { goBack, leaveState } = useReturnTo('/stage/reception')

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>🪪</span>
        <h1 style={{ color: theme.accent }}>
          {t('ui.tiles.card.title')}
        </h1>
        {/* the card is the same on every page and in every world: the same heading as the parent's card page */}
        <p className={css.stageHeroHint}>{t('ui.text.cardSubtitle')}</p>
        <div className={css.stageBack}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            {t('ui.buttons.back')}
          </button>
        </div>
      </div>

      <div className={css.stageBody}>
        <CareCardForm
          colours={{ accent: theme.accent, accentSoft: theme.accentSoft, accentText: theme.accentText }}
          footer={({ empty, clear }) => (
            <div className={css.stageBack}>
              <Link to="/card/view" state={leaveState('/card')}>
                <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText, opacity: empty ? 0.4 : 1 }} disabled={empty}>
                  {t('ui.buttons.showCardNext')}
                </button>
              </Link>
              {!empty && (
                <button type="button" className={css.backBtn} style={{ borderColor: '#aaa', color: '#888' }} onClick={clear}>
                  {t('ui.buttons.clear')}
                </button>
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}
