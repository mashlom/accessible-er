import { keyed } from '../../../lib/keyed'
import { useState } from 'react'
import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import parentUi from '../../../data/parent/ui.json'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import careI18n from '../../../data/i18n/careCard.json'

// the requests are for the staff, so they are in Hebrew
const askHe = keyed((careI18n as unknown as { he: { asks: Record<string, string> } }).he, 'i18n/careCard').asks
import css from '../quest.module.css'

// the emoji of each block stay in code; the words come from src/data/parent/ui.json
const BLOCK_EMOJI = {
  discharge: ['📝', '🚪', '🏠', '🧰', '🩺'],
  admission: ['🏥', '🚪', '🛏️', '💙', '📞'],
} as const

type Block = { title: string; body: string }
const parentCelebrate = parentUi as unknown as Record<'he' | 'en' | 'ru', { celebrate: Record<'discharge' | 'admission', Block[]> }>

function blocksFor(lang: 'he' | 'en' | 'ru', kind: 'discharge' | 'admission') {
  const texts = (parentCelebrate[lang] ?? parentCelebrate.he).celebrate[kind]
  return texts.map((b, i) => ({ emoji: BLOCK_EMOJI[kind][i], ...b }))
}

export function CelebratePage() {
  const [outcome, setOutcome] = useState<'discharge' | 'admission' | null>(null)
  const [showCard, setShowCard] = useState(false)
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { reset, doneProcedures } = useQuestProgress()
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const celebrateSkin = theme.stages['decision']
  const doneCount = doneProcedures.size
  const cardEmpty = isCardEmpty(card)

  return (
    <div className={css.celebratePage}>
      {/* ── Child zone ── */}
      <div className={css.celebrateChildZone} style={{ background: theme.accentSoft }}>
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
            {doneCount > 0
              ? t(`ui.text.coins.${lang === 'he' ? (doneCount === 1 ? 'one' : 'other') : new Intl.PluralRules(lang).select(doneCount)}`).replace('{n}', String(doneCount))
              : (celebrateSkin?.hint ?? '')}
          </p>
        </div>
        <div className={css.stageBack}>
          <Link to="/shop" style={{ flex: 2, display: 'flex' }}>
            <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText, flex: 1 }}>
              {t('ui.buttons.toShop')}
            </button>
          </Link>
          <Link to="/" style={{ flex: 1, display: 'flex' }}>
            <button
              className={css.backBtn}
              style={{ borderColor: theme.accent, color: theme.accent, flex: 1 }}
              onClick={reset}
            >
              {t('ui.buttons.chooseWorld')}
            </button>
          </Link>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        {!outcome && (
          <div className={css.outcomeChoice}>
            <p className={css.outcomeLabel}>{t('ui.text.outcomeLabel')}</p>
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
                <button
                  className={css.calmLink}
                  onClick={() => setShowCard(true)}
                  style={{ background: theme.accent, color: theme.accentText }}
                >
                  {t('ui.buttons.showCard')}
                </button>
              )
            )}

            <button
              className={css.calmLink}
              onClick={() => setOutcome(null)}
              style={{ marginTop: '1rem', color: theme.accent, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t('ui.buttons.changeChoice')}
            </button>

            <Link to="/feedback" className={css.calmLink}>
              {t('ui.buttons.feedback')}
            </Link>
          </>
        )}
      </div>

      {showCard && !cardEmpty && (
        <div
          className={css.calmOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCard(false)}
        >
          <div className={css.cardOverlayContent}>
            {card.nickname.trim() && <div className={css.cardOverlayName}>{card.nickname.trim()}</div>}
            {[
              { emoji: '💬', items: [...card.communication, card.custom?.communication].filter(Boolean) },
              { emoji: '⚠️', items: [...card.sensitivities, card.custom?.sensitivities].filter(Boolean) },
              { emoji: '💛', items: [...card.calming, card.custom?.calming].filter(Boolean) },
              { emoji: '🚫', items: [...card.escalators, ...card.avoid, card.custom?.escalators, card.custom?.avoid].filter(Boolean) },
              { emoji: '🩺', items: [...card.hardMoments, card.custom?.hardMoments].filter(Boolean) },
              { emoji: '🤕', items: [...card.pain, card.custom?.pain].filter(Boolean) },
            ]
              .filter((section) => section.items.length > 0)
              .map((section, i) => (
                <div key={i} className={css.cardOverlaySection}>
                  <div className={css.cardOverlayEmoji}>{section.emoji}</div>
                  <div className={css.cardOverlayItems}>
                    {section.items.map((item, j) => (
                      <div key={j} className={css.cardOverlayItem}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {(card.asks ?? []).length > 0 && (
              <div className={css.cardOverlaySection}>
                <div className={css.cardOverlayEmoji}>🙋</div>
                <div className={css.cardOverlayItems}>
                  {(card.asks ?? []).map((id) => (
                    <div key={id} className={css.cardOverlayItem}>{askHe[id]}</div>
                  ))}
                </div>
              </div>
            )}
            {card.freeNote.trim() && (
              <div className={css.cardOverlaySection}>
                <div className={css.cardOverlayEmoji}>✏️</div>
                <div className={css.cardOverlayItems}>
                  <div className={css.cardOverlayItem}>{card.freeNote.trim()}</div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className={css.calmOverlayClose}
            onClick={() => setShowCard(false)}
          >
            {t('ui.buttons.close')}
          </button>
        </div>
      )}
    </div>
  )
}
