import { keyed } from '../../../lib/keyed'
import { Link } from '../../nav'
import { useReturnTo } from '../useReturnTo'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { CareCardView, careCardHeading } from '../../../components/careCard/CareCardView'
import parentUi from '../../../data/parent/ui.json'
import css from '../quest.module.css'

type Lang = 'he' | 'en' | 'ru'

export function CardViewPage() {
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { goBack, leaveState, passThroughState } = useReturnTo('/card')
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const emptyTexts = keyed((parentUi as unknown as Record<Lang, { card: { empty: { title: string; hint: string } } }>)[lang], 'parent/ui').card.empty

  if (isCardEmpty(card)) {
    return (
      <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
        <div className={css.stageHero} style={{ background: theme.accentSoft }}>
          <span className={css.stageHeroIcon}>🪪</span>
          <h1 style={{ color: theme.accent }}>{emptyTexts.title}</h1>
          <p className={css.stageHeroHint}>{emptyTexts.hint}</p>
          <div className={css.stageBack}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
              {t('ui.buttons.back')}
            </button>
          </div>
        </div>
        <div className={css.stageBody}>
          <div className={css.stageBack}>
            <Link to="/card" state={passThroughState}>
              <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }}>
                {t('ui.buttons.fillCard')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const heading = careCardHeading(card, lang)

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>🪪</span>
        <h1 style={{ color: theme.accent }}>{heading.title}</h1>
        {heading.age && <p className={css.stageHeroHint}>{heading.age}</p>}
        <div className={`${css.stageBack} no-print`}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            {t('ui.buttons.back')}
          </button>
        </div>
      </div>

      <div className={css.stageBody}>
        <CareCardView
          footer={({ print }) => (
            <div className={`${css.stageBack} no-print`}>
              <button type="button" className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }} onClick={print}>
                {t('ui.buttons.savePrint')}
              </button>
              <Link to="/card" state={leaveState('/card/view')}>
                <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
                  {t('ui.buttons.edit')}
                </button>
              </Link>
            </div>
          )}
        />
      </div>
    </div>
  )
}
