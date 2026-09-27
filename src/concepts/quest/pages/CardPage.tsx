import { Link } from '../../nav'
import { useReturnTo } from '../useReturnTo'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import {
  cardSections,
  CUSTOM_MAX,
  emptyCard,
  emptyCustom,
  isCardEmpty,
  type CardArrayField,
  type CareCard,
} from '../../../data/careCard'
import { useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

export function CardPage() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { goBack, leaveState } = useReturnTo('/stage/reception')
  const [card, setCard, clearCard] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)

  function toggle(key: CardArrayField, option: string) {
    const list = card[key]
    const next = list.includes(option) ? list.filter((x) => x !== option) : [...list, option]
    setCard({ ...card, [key]: next })
  }

  function setCustom(key: CardArrayField, value: string) {
    setCard({ ...card, custom: { ...(card.custom ?? emptyCustom), [key]: value } })
  }

  const empty = isCardEmpty(card)

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>🪪</span>
        <h1 style={{ color: theme.accent }}>
          {theme.cardChildHero?.title ?? t('ui.text.cardTitle', 'כרטיס התאמות')}
        </h1>
        {theme.cardChildHero?.subtitle && (
          <p className={css.stageHeroHint}>{theme.cardChildHero.subtitle}</p>
        )}
        <div className={css.stageBack}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            {t('ui.buttons.back', 'חזרה →')}
          </button>
        </div>
      </div>

      <div className={css.stageBody}>
        <p className={css.parentZoneLabel}>{t('ui.text.aboutMyChild', 'מה חשוב לדעת על הילד/ה שלי')}</p>
        <p className={css.cardPrivacy}>
          {t('ui.text.privacyA', '🔒 הכל נשמר')} <strong>{t('ui.text.privacyB', 'במכשיר הזה בלבד')}</strong>{t('ui.text.privacyC', ', נמחק אחרי 24 שעות, ולא נשלח לשום מקום.')}
        </p>

        <section>
          <h2>{t('ui.text.whoWeAre', '🧒 מי אנחנו (לא חובה)')}</h2>
          <div className={css.cardIdentity}>
            <label className={css.cardField}>
              <span className={css.cardFieldLabel}>{t('ui.text.nickname', 'כינוי / שם פרטי')}</span>
              <input
                className={css.cardInput}
                value={card.nickname}
                onChange={(e) => setCard({ ...card, nickname: e.target.value })}
                maxLength={30}
                placeholder={t('ui.text.optional', 'לא חובה')}
              />
            </label>
            <label className={css.cardField} style={{ maxWidth: 100 }}>
              <span className={css.cardFieldLabel}>{t('ui.text.age', 'גיל')}</span>
              <input
                className={css.cardInput}
                value={card.age}
                onChange={(e) => setCard({ ...card, age: e.target.value })}
                maxLength={6}
                inputMode="numeric"
                placeholder="—"
              />
            </label>
          </div>
        </section>

        {cardSections.map((section, si) => {
          const label = t(`careCard.cardSections.${si}`, section)
          return (
          <section key={section.key}>
            <h2>{section.emoji} {label.title}</h2>
            <div className={css.cardChips} role="group" aria-label={label.title}>
              {section.options.map((option, oi) => {
                const on = card[section.key].includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    className={`${css.cardChip} ${on ? css.cardChipOn : ''}`}
                    style={on ? { borderColor: theme.accent, background: theme.accentSoft, color: theme.accent } : undefined}
                    aria-pressed={on}
                    onClick={() => toggle(section.key, option)}
                  >
                    {label.options[oi] ?? option}
                  </button>
                )
              })}
            </div>
            <input
              className={css.cardOtherInput}
              value={card.custom?.[section.key] ?? ''}
              onChange={(e) => setCustom(section.key, e.target.value)}
              maxLength={CUSTOM_MAX}
              placeholder={t('ui.text.otherPlaceholder', 'אחר… (אפשר לכתוב בחופשי)')}
              aria-label={`${t('ui.text.other', 'אחר')} — ${label.title}`}
            />
          </section>
          )
        })}

        <section>
          <h2>{t('ui.text.anythingElse', '✏️ עוד משהו שעוזר? (לא חובה)')}</h2>
          <textarea
            className={css.calmFreeText}
            rows={3}
            value={card.freeNote}
            onChange={(e) => setCard({ ...card, freeNote: e.target.value })}
            placeholder={t('ui.text.freeNotePlaceholder', 'למשל: אוהב שמספרים לו מה קורה בקול שקט…')}
          />
        </section>

        <div className={css.stageBack}>
          <Link to="/card/view" state={leaveState('/card')}>
            <button
              className={css.doneBtn}
              style={{ background: theme.accent, color: theme.accentText, opacity: empty ? 0.4 : 1 }}
              disabled={empty}
            >
              {t('ui.buttons.showCardNext', '🪪 הצגת הכרטיס לצוות ←')}
            </button>
          </Link>
          {!empty && (
            <button type="button" className={css.backBtn} style={{ borderColor: '#aaa', color: '#888' }} onClick={clearCard}>
              {t('ui.buttons.clear', 'ניקוי')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
