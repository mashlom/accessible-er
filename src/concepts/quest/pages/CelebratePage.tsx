import { useState } from 'react'
import { Link, useGoBackTo } from '../../nav'
import { WORLD_SELECT } from '../components/WorldScope'
import { useWide } from './WorldMapPage'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import { isTestMode } from '../../../lib/testMode'
import i18nUi from '../../../data/i18n/ui.json'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import css from '../quest.module.css'

// the emoji of each block stay in code; the words come from src/data/i18n/ui.json
const BLOCK_EMOJI = {
  discharge: ['📝', '🚪', '🏠', '🧰', '🩺'],
  admission: ['🏥', '🚪', '🛏️', '💙', '📞'],
} as const

type Block = { title: string; body: string }
const parentCelebrate = i18nUi as unknown as Record<'he' | 'en' | 'ru', { celebrate: Record<'discharge' | 'admission', Block[]> }>

function blocksFor(lang: 'he' | 'en' | 'ru', kind: 'discharge' | 'admission') {
  const texts = (parentCelebrate[lang] ?? parentCelebrate.he).celebrate[kind]
  // the first title is the same for both outcomes: it is the discharge's
  const first = (parentCelebrate[lang] ?? parentCelebrate.he).celebrate.discharge[0].title
  return texts.map((b, i) => ({ emoji: BLOCK_EMOJI[kind][i], ...b, title: i === 0 ? first : b.title }))
}

export function CelebratePage() {
  const [outcome, setOutcome] = useState<'discharge' | 'admission' | null>(null)
  const { theme } = useQuestTheme()
  const wide = useWide()
  // the shop is hidden unless the address asks for the test mode (?test=true)
  const withStore = isTestMode()
  // a designed world: the page stands on the world's own map picture (the landscape one on a wide screen)
  const worldBg = theme.design
    ? ({ '--celebrate-bg': wide ? 'var(--w-background-wide, var(--w-background))' : 'var(--w-background)' } as React.CSSProperties)
    : undefined
  const { t, lang } = useI18n()
  const { reset, doneProcedures } = useQuestProgress()
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const celebrateSkin = theme.stages['decision']
  const doneCount = doneProcedures.size
  const cardEmpty = isCardEmpty(card)
  const goBackTo = useGoBackTo()
  // a new journey: back to the world select screen (through the history, when it was the way in)
  const chooseWorld = () => {
    reset()
    goBackTo(WORLD_SELECT, { absolute: true })
  }

  return (
    <div className={`${css.celebratePage} ${worldBg ? css.celebrateWorld : ''}`} style={worldBg}>
      {/* ── Child zone ── */}
      <div className={css.celebrateChildZone} style={worldBg ? undefined : { background: theme.accentSoft }}>
        {theme.shopImage && (
          <img src={theme.shopImage} alt="" className={css.celebrateImg} />
        )}
        <div className={css.celebrateContent}>
          <p className={css.celebrateTitle} style={{ color: theme.accent }}>
            {celebrateSkin?.label ?? t('ui.text.weDidIt')}
          </p>
          {doneCount > 0 && (
            <p className={css.celebrateCoins}>
              {Array.from({ length: doneCount }, (_, i) => (
                <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
              ))}
            </p>
          )}
          <p className={css.celebrateHint}>
            {/* the coins line welcomes to the shop: only when there is one */}
            {doneCount > 0 && withStore
              ? t(`ui.text.coins.${new Intl.PluralRules(lang).select(doneCount)}`).replace('{n}', String(doneCount))
              : (celebrateSkin?.hint ?? '')}
          </p>
        </div>
        <div className={css.celebrateActions}>
          {withStore && (
            <Link to="/shop">
              <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }}>
                {t('ui.buttons.toShop')}
              </button>
            </Link>
          )}
          <button
            className={css.backBtn}
            style={{ borderColor: theme.accent, color: theme.accent }}
            onClick={chooseWorld}
          >
            {t('ui.buttons.chooseWorld')}
          </button>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={`${css.stageBody} ${css.celebrateParentZone}`}>
        {!outcome && (
          <div className={css.outcomeChoice}>
            <p className={css.outcomeLabel}>{t('ui.labels.adult.outcomeLabel')}</p>
            <div className={css.outcomeButtons}>
              <button
                className={css.outcomeBtn}
                onClick={() => setOutcome('discharge')}
                style={{ background: theme.accent, color: theme.accentText }}
              >
                {t('ui.buttons.discharge')}
              </button>
              <button
                className={css.outcomeBtn}
                onClick={() => setOutcome('admission')}
                style={{ background: theme.accent, color: theme.accentText }}
              >
                {t('ui.buttons.admission')}
              </button>
            </div>
          </div>
        )}

        {outcome && (
          <>
            <p className={css.parentZoneLabel}>
              {outcome === 'discharge' ? t('ui.text.towardsDischarge') : t('ui.text.towardsAdmission')}
            </p>

            {blocksFor(lang, outcome).map((b, i) => (
              <section key={i}>
                <h2>{b.emoji} {b.title}</h2>
                <p>{b.body}</p>
              </section>
            ))}

            {outcome === 'admission' && (
              cardEmpty ? (
                <Link to="/card" state={{ from: '/celebrate' }} className={css.calmLink}>
                  <button
                    className={css.doneBtn}
                    style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
                  >
                    {t('ui.buttons.fillCard')}
                  </button>
                </Link>
              ) : (
                <Link to="/card/view" state={{ from: '/celebrate' }} className={css.calmLink}>
                  <button
                    className={css.doneBtn}
                    style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
                  >
                    {t('ui.buttons.showCard')}
                  </button>
                </Link>
              )
            )}

            <button
              className={css.calmLink}
              onClick={() => setOutcome(null)}
              style={{ color: theme.accent, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t('ui.buttons.changeChoice')}
            </button>

            <Link to="/feedback" className={css.calmLink}>
              {t('ui.buttons.feedback')}
            </Link>
          </>
        )}
      </div>

    </div>
  )
}
