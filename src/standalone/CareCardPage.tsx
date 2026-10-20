import { useI18n } from '../hooks/useI18n'
import { Link } from '../concepts/nav'
import { PageHeader } from './ui'
import { usePersistentState } from '../hooks/usePersistentState'
import { DAY_MS } from '../lib/storage'
import {
  cardSections,
  CUSTOM_MAX,
  emptyCard,
  emptyCustom,
  isCardEmpty,
  type CardArrayField,
  type CareCard,
} from '../data/careCard'
import styles from './CareCardPage.module.css'

/**
 * Module 1 — quick adaptations card. Chips-first so a parent can fill it
 * in under two minutes, even when arriving in a hurry. Every field is
 * optional; nothing identifying is required.
 */
export function CareCardPage() {
  const { t } = useI18n()
  // the chosen options are saved in Hebrew (the card is for the staff); only their labels are translated
  const translatedSections = t('careCard.cardSections', cardSections)
  const [card, setCard, clearCard] = usePersistentState<CareCard>(
    'care-card',
    emptyCard,
    DAY_MS,
  )

  function toggle(key: CardArrayField, option: string) {
    const list = card[key]
    const next = list.includes(option)
      ? list.filter((x) => x !== option)
      : [...list, option]
    setCard({ ...card, [key]: next })
  }

  function setCustom(key: CardArrayField, value: string) {
    setCard({ ...card, custom: { ...(card.custom ?? emptyCustom), [key]: value } })
  }

  const empty = isCardEmpty(card)

  return (
    <div className="container">
      <PageHeader
        eyebrow={t('ui.text.cardTitle', 'כרטיס התאמות')}
        title={t('ui.text.aboutMyChild', 'מה חשוב לדעת על הילד/ה שלי')}
        subtitle={t('ui.text.cardSubtitle', 'סמנו את מה שמתאים — פחות מ־2 דקות. בסוף מקבלים כרטיס קצר שמציגים לצוות מהמסך או בהדפסה.')}
      />

      <div className={styles.privacy}>
        <span aria-hidden>🔒</span>
        <span>
          {t('ui.text.privacyA', '🔒 הכל נשמר')} <strong>{t('ui.text.privacyB', 'במכשיר הזה בלבד')}</strong>{t('ui.text.privacyC', ', נמחק אחרי 24 שעות, ולא נשלח לשום מקום.')} {t('ui.text.privacyD', 'מה שלא תציגו בעצמכם — לא יגיע לצוות. אפשר למלא בלי שם בכלל.')}
        </span>
      </div>

      <section className={`card ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          <span aria-hidden>🧒</span> {t('ui.text.whoWeAre', '🧒 מי אנחנו (לא חובה)').replace('🧒 ', '')}
        </h2>
        <div className={styles.identity}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t('ui.text.nickname', 'כינוי / שם פרטי')}</span>
            <input
              className={styles.input}
              value={card.nickname}
              onChange={(e) => setCard({ ...card, nickname: e.target.value })}
              maxLength={30}
              placeholder={t('ui.text.optional', 'לא חובה')}
            />
          </label>
          <label className={styles.field} style={{ maxWidth: 110 }}>
            <span className={styles.fieldLabel}>{t('ui.text.age', 'גיל')}</span>
            <input
              className={styles.input}
              value={card.age}
              onChange={(e) => setCard({ ...card, age: e.target.value })}
              maxLength={6}
              inputMode="numeric"
              placeholder="—"
            />
          </label>
        </div>
      </section>

      {cardSections.map((section, si) => (
        <section key={section.key} className={`card ${styles.section}`}>
          <h2 className={styles.sectionTitle}>
            <span aria-hidden>{section.emoji}</span> {translatedSections[si]?.title ?? section.title}
          </h2>
          <div className={styles.chips} role="group" aria-label={translatedSections[si]?.title ?? section.title}>
            {section.options.map((option, oi) => {
              const on = card[section.key].includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                  aria-pressed={on}
                  onClick={() => toggle(section.key, option)}
                >
                  {translatedSections[si]?.options?.[oi] ?? option}
                </button>
              )
            })}
          </div>
          <div className={styles.otherRow}>
            <input
              className={styles.otherInput}
              value={card.custom?.[section.key] ?? ''}
              onChange={(e) => setCustom(section.key, e.target.value)}
              maxLength={CUSTOM_MAX}
              placeholder={t('ui.text.otherPlaceholder', 'אחר… (אפשר לכתוב בחופשי)')}
              aria-label={`${t('ui.text.other', 'אחר')} — ${section.title}`}
            />
            {(card.custom?.[section.key] ?? '').length > 0 && (
              <span className={styles.otherCount}>
                {(card.custom?.[section.key] ?? '').length}/{CUSTOM_MAX}
              </span>
            )}
          </div>
        </section>
      ))}

      <section className={`card ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          <span aria-hidden>✏️</span> {t('ui.text.anythingElse', '✏️ עוד משהו שעוזר? (לא חובה)').replace('✏️ ', '')}
        </h2>
        <textarea
          className={styles.textarea}
          rows={3}
          value={card.freeNote}
          onChange={(e) => setCard({ ...card, freeNote: e.target.value })}
          placeholder={t('ui.text.freeNotePlaceholder', 'למשל: אוהב שמספרים לו מה קורה בקול שקט…')}
        />
      </section>

      <div className={styles.actions}>
        <Link
          to="/card/view"
          className={`${styles.showBtn} ${empty ? styles.showBtnDisabled : ''}`}
          aria-disabled={empty}
        >
          {t('ui.buttons.showCardNext', '🪪 הצגת הכרטיס לצוות ←').replace(' ←', '')}
        </Link>
        {!empty && (
          <button type="button" className={styles.clearBtn} onClick={clearCard}>
            {t('ui.buttons.clear', 'ניקוי')}
          </button>
        )}
      </div>
    </div>
  )
}
