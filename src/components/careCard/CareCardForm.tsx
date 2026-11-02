import type { ReactNode } from 'react'
import { LineIcon } from '../LineIcon'
import { withoutEmoji } from '../../concepts/quest/components/ButtonIcon'
import { usePersistentState } from '../../hooks/usePersistentState'
import { DAY_MS } from '../../lib/storage'
import { useI18n } from '../../hooks/useI18n'
import careI18n from '../../data/i18n/careCard.json'
import { askIds, askTexts, cardSections, CUSTOM_MAX, emptyCard, emptyCustom, isCardEmpty, type CardArrayField, type CareCard } from '../../data/careCard'
import css from '../../concepts/quest/quest.module.css'
import { suggestionsFor } from './CareCardView'

export interface CareCardColours {
  accent: string
  accentSoft: string
  accentText: string
}

/**
 * The care card as the parent fills it in. The same on every screen: the
 * screen only gives its colours and the buttons under the form (`footer`).
 */
export function CareCardForm({ colours, footer, sectionClass, lineIcons }: { colours: CareCardColours; footer: (state: { empty: boolean; clear: () => void }) => ReactNode; /** a screen's own look for each part of the form */ sectionClass?: string; /** the parts' line icons (Shevi's style) instead of their emoji */ lineIcons?: boolean }) {
  const { t, lang } = useI18n()
  const { accent, accentSoft } = colours
  const [card, setCard, clearCard] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)

  // the requests that fit what the parent has ticked (the ticks are the card's choices)
  const askFor = (careI18n as unknown as { askFor: Record<string, string[]> }).askFor
  const ticked = [...card.sensitivities, ...card.escalators, ...card.hardMoments, ...card.avoid, ...card.pain, ...card.communication]
  const relevantAsks = askIds.filter((id) => (askFor[id] ?? []).some((opt) => ticked.includes(opt)))

  function toggle(key: CardArrayField, option: string) {
    const list = card[key]
    const next = list.includes(option) ? list.filter((x) => x !== option) : [...list, option]
    setCard({ ...card, [key]: next })
  }

  function setCustom(key: CardArrayField, value: string) {
    setCard({ ...card, custom: { ...(card.custom ?? emptyCustom), [key]: value } })
  }

  const chipStyle = (on: boolean) => (on ? { borderColor: accent, background: accentSoft, color: accent } : undefined)

  // a part's heading: its emoji, or its line icon in a lilac square
  const heading = (part: string, text: string, emoji?: string) =>
    lineIcons ? (
      <h2 className={css.cardHeadingIcon}>
        <span className={css.cardHeadingIconBox} aria-hidden><LineIcon id={`card-${part}`} size={20} /></span>
        {withoutEmoji(text)}
      </h2>
    ) : (
      <h2>{emoji ? `${emoji} ${text}` : text}</h2>
    )

  return (
    <>
      <p className={css.parentZoneLabel}>{t('ui.labels.adult.aboutMyChild')}</p>
      {!isCardEmpty(card) && (
        <div className={css.stageBack}>
          <button type="button" className={css.backBtn} style={{ borderColor: '#aaa', color: '#888' }} onClick={clearCard}>
            {t('ui.buttons.clear')}
          </button>
        </div>
      )}

      <section className={sectionClass}>
        {heading('about', t('ui.labels.adult.aboutChild'))}
        <div className={css.cardIdentity}>
          <label className={css.cardField}>
            <span className={css.cardFieldLabel}>{t('ui.labels.adult.nickname')}</span>
            <input className={css.cardInput} value={card.nickname} onChange={(e) => setCard({ ...card, nickname: e.target.value })} maxLength={30} placeholder={t('ui.labels.adult.optional')} />
          </label>
          <label className={css.cardField} style={{ maxWidth: 100 }}>
            <span className={css.cardFieldLabel}>{t('ui.labels.adult.age')}</span>
            <input className={css.cardInput} value={card.age} onChange={(e) => setCard({ ...card, age: e.target.value })} maxLength={6} inputMode="numeric" placeholder="—" />
          </label>
        </div>
      </section>

      {cardSections.map((section, si) => {
        const label = t(`careCard.cardSections.${si}`, section)
        return (
          <section key={section.key} className={sectionClass}>
            {heading(section.key, label.title, section.emoji)}
            <div className={css.cardChips} role="group" aria-label={label.title}>
              {section.options.map((option, oi) => {
                const on = card[section.key].includes(option)
                return (
                  <button key={option} type="button" className={`${css.cardChip} ${on ? css.cardChipOn : ''}`} style={chipStyle(on)} aria-pressed={on} onClick={() => toggle(section.key, option)}>
                    {label.options[oi] ?? option}
                  </button>
                )
              })}
            </div>
            <input className={css.cardOtherInput} value={card.custom?.[section.key] ?? ''} onChange={(e) => setCustom(section.key, e.target.value)} maxLength={CUSTOM_MAX} placeholder={t('ui.labels.adult.otherPlaceholder')} aria-label={`${t('ui.labels.adult.other')} — ${label.title}`} />
          </section>
        )
      })}

      {relevantAsks.length > 0 && (
        <section className={sectionClass}>
          {heading('asks', t('careCard.asks.title'))}
          <div className={css.cardChips} role="group" aria-label={t('careCard.asks.title')}>
            {relevantAsks.map((id) => {
              const on = (card.asks ?? []).includes(id)
              return (
                <button key={id} type="button" className={`${css.cardChip} ${on ? css.cardChipOn : ''}`} style={chipStyle(on)} aria-pressed={on} onClick={() => setCard({ ...card, asks: on ? (card.asks ?? []).filter((x) => x !== id) : [...(card.asks ?? []), id] })}>
                  {askTexts(lang)[id]}
                </button>
              )
            })}
          </div>
        </section>
      )}

      <section className={sectionClass}>
        {heading('else', t('ui.labels.adult.anythingElse'))}
        <textarea className={css.calmFreeText} rows={3} value={card.freeNote} onChange={(e) => setCard({ ...card, freeNote: e.target.value })} placeholder={t('ui.labels.adult.freeNotePlaceholder')} />
      </section>

      {suggestionsFor(card, lang).length > 0 && (
        <section className={sectionClass}>
          {heading('suggestions', t('ui.card.suggestionsTitle'))}
          <ul style={{ paddingInlineStart: '1.2em', lineHeight: 1.7 }}>
            {suggestionsFor(card, lang).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

      {lang !== 'he' && <p className={css.cardPrivacy}>{t('ui.careView.hebrewNote')}</p>}

      {footer({ empty: isCardEmpty(card), clear: clearCard })}

      {/* where the card is kept: small, at the end of the screen, as a footer */}
      <p className={css.cardPrivacyFoot}>
        {t('ui.labels.adult.privacyA')} {t('ui.labels.adult.privacyB')}{t('ui.labels.adult.privacyC')}
      </p>
    </>
  )
}
